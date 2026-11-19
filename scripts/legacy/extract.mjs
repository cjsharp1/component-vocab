// One-off migration (Phase 3): read the hand-written pages and write
// data/components/<slug>.json plus wireframes/<slug>/*.svg.
// Content is copied verbatim (inner HTML strings); nothing is rewritten.
// Kept for the record. Run from the repo root: node scripts/legacy/extract.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = p => readFileSync(join(root, p), 'utf8');
const log = [];

// Strip the common leading indentation from a block of lines.
function dedent(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const indents = lines.slice(1).filter(l => l.trim()).map(l => l.match(/^ */)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return [lines[0], ...lines.slice(1).map(l => l.slice(Math.min(min, l.match(/^ */)[0].length)))].join('\n').trim() + '\n';
}
const one = (re, s, what, slug) => {
  const m = s.match(re);
  if (!m) { log.push(`${slug}: could not find ${what}`); return null; }
  return m;
};
const cells = row => [...row.matchAll(/<td([^>]*)>([\s\S]*?)<\/td>/g)].map(m => ({ attrs: m[1], html: m[2] }));
const rows = tbody => [...tbody.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m => cells(m[1]));

// ---- Index: order, categories, summaries, thumbnails, comparison rows
const index = read('index.html');
const [gridPart, comparisonPart] = index.split('<section id="comparison">');
const categories = [];
const entries = [];
for (const block of gridPart.split('<div data-category="').slice(1)) {
  const slug = block.slice(0, block.indexOf('"'));
  const label = block.match(/<h3 class="category-heading">([\s\S]*?)<\/h3>/)[1];
  categories.push({ slug, label });
  for (const li of block.matchAll(/<li>\s*<a href="\.\/components\/([^"]+)\.html">\s*(<svg[\s\S]*?<\/svg>)\s*<strong>([\s\S]*?)<\/strong>\s*<small>([\s\S]*?)<\/small>/g)) {
    entries.push({ slug: li[1], thumb: li[2], name: li[3], summary: li[4], category: slug });
  }
}
const comparison = {};
for (const tr of comparisonPart.split('<tbody>')[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
  const tds = [...tr[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m => m[1]);
  const slug = tds[0].match(/components\/([^"]+)\.html/)[1];
  const [bootstrap, material, ant, apple, shadcn] = tds.slice(1);
  if (tds.length !== 6) log.push(`${slug}: comparison row has ${tds.length} cells`);
  comparison[slug] = { bootstrap, material, ant, apple, shadcn };
}

mkdirSync(join(root, 'data/components'), { recursive: true });
writeFileSync(join(root, 'data/legacy-categories.json'), JSON.stringify(categories, null, 2) + '\n');

let svgCount = 0;
entries.forEach((entry, i) => {
  const { slug } = entry;
  const page = read(`components/${slug}.html`);
  const main = page.match(/<main>([\s\S]*)<\/main>/)[1];
  const wfDir = join(root, 'wireframes', slug);
  mkdirSync(wfDir, { recursive: true });
  const saveSvg = (name, svg) => { writeFileSync(join(wfDir, name), dedent(svg)); svgCount++; return `wireframes/${slug}/${name}`; };

  const crumb = one(/index\.html#([^"]+)">([\s\S]*?)<\/a><\/li>\s*<li>([\s\S]*?)<\/li>/, main, 'breadcrumb', slug);
  const head = one(/<section>\s*<h1>([\s\S]*?)<\/h1>\s*<p>([\s\S]*?)<\/p>\s*<dl>\s*<dt>Also known as<\/dt>\s*<dd>([\s\S]*?)<\/dd>\s*<dt>Semantic element<\/dt>\s*<dd>([\s\S]*?)<\/dd>\s*<dt>Category<\/dt>\s*<dd>([\s\S]*?)<\/dd>/, main, 'header block', slug);
  const sections = main.split(/<section>\s*<h2>/).slice(1).map(s => {
    const title = s.slice(0, s.indexOf('</h2>'));
    return { title, body: s.slice(s.indexOf('</h2>') + 5) };
  });
  const byTitle = t => sections.find(s => s.title === t);

  const elements = rows(byTitle('Elements').body.split('<tbody>')[1]).map(([el, req, desc]) => ({ name: el.html, required: req.html, description: desc.html }));

  const defaultSvg = byTitle('Default Layout').body.match(/<svg[\s\S]*?<\/svg>/)[0];
  const known = ['Elements', 'Default Layout', 'Configuration Options', 'Layout Variations', 'Usage Notes'];
  const collections = sections.filter(s => !known.includes(s.title)).map((s, n) => ({
    title: s.title,
    wireframe: saveSvg(`collection${n ? '-' + (n + 1) : ''}.svg`, s.body.match(/<svg[\s\S]*?<\/svg>/)[0]),
    caption: (s.body.match(/<p><em>([\s\S]*?)<\/em><\/p>/) || [])[1] ?? null,
  }));
  const sectionOrder = sections.map(s => known.includes(s.title) ? s.title : 'collection');

  const config = byTitle('Configuration Options').body.split('<h3>Component-Specific</h3>')[1].split('<tbody>')[1];
  const configOptions = rows(config).map(([c, o, a]) => ({ config: c.html, options: o.html, affectsLayout: a.html, highlighted: /affects-layout/.test(a.attrs) }));

  const variants = [...byTitle('Layout Variations').body.matchAll(/<figure>\s*<div class="wireframe-container">\s*(<svg[\s\S]*?<\/svg>)\s*<\/div>\s*<figcaption>([\s\S]*?)<\/figcaption>\s*<\/figure>/g)]
    .map((m, n) => ({ caption: m[2], wireframe: saveSvg(`variation-${n + 1}.svg`, m[1]) }));
  const figureCount = (byTitle('Layout Variations').body.match(/<figure>/g) || []).length;
  if (figureCount !== variants.length) log.push(`${slug}: ${figureCount} figures but ${variants.length} parsed`);

  const usageNotes = [...byTitle('Usage Notes').body.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1]);

  const data = {
    slug,
    name: head[1],
    order: i + 1,
    status: 'stable',
    group: entry.category,
    description: head[2],
    summary: entry.summary,
    alsoKnownAs: head[3],
    htmlElement: head[4],
    elements,
    wireframe: saveSvg('default.svg', defaultSvg),
    thumbnail: saveSvg('thumbnail.svg', entry.thumb),
    configOptions,
    variants,
    collections,
    sectionOrder,
    usageNotes,
    legacyComparison: comparison[slug],
    related: [],
  };

  // Cross-checks between the index and the page.
  if (head[1] !== entry.name) log.push(`${slug}: page h1 "${head[1]}" differs from index name "${entry.name}"`);
  if (crumb && crumb[1] !== entry.category) log.push(`${slug}: breadcrumb anchor #${crumb[1]} differs from index category ${entry.category}`);
  if (head[5] !== categories.find(c => c.slug === entry.category).label) log.push(`${slug}: Category "${head[5]}" differs from index heading`);
  if (crumb && crumb[3] !== head[1]) log.push(`${slug}: breadcrumb label "${crumb[3]}" differs from h1`);

  writeFileSync(join(root, 'data/components', `${slug}.json`), JSON.stringify(data, null, 2) + '\n');
});

const pages = readdirSync(join(root, 'components')).filter(f => f.endsWith('.html') && !f.startsWith('_'));
for (const p of pages) if (!entries.find(e => `${e.slug}.html` === p)) log.push(`${p}: page has no index entry`);

writeFileSync(join(root, 'docs/migration-log.md'), [
  '# Migration log',
  '',
  'Written by `scripts/legacy/extract.mjs` (Phase 3). Lists anything the extractor could not parse or found inconsistent between `index.html` and the pages.',
  '',
  `- Components extracted: ${entries.length}`,
  `- Wireframe SVG files written: ${svgCount}`,
  `- Categories: ${categories.length}`,
  '',
  '## Issues',
  '',
  ...(log.length ? log.map(l => `- ${l}`) : ['- None.']),
  '',
].join('\n'));
console.log(`extracted ${entries.length} components, ${svgCount} svgs, ${log.length} issues`);
