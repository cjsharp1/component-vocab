// One-off migration (Phase 5): apply docs/reconciliation.md to data/.
// Renames, folds (retired page -> variant on its target), group J names
// (open question Q7), aliases and framework names seeded from
// docs/research/framework-alignment.csv. Writes data/redirects.json and
// appends to docs/migration-log.md. Run once from the repo root.
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, unlinkSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dataDir = join(root, 'data/components');
const load = slug => JSON.parse(readFileSync(join(dataDir, `${slug}.json`), 'utf8'));
const save = c => writeFileSync(join(dataDir, `${c.slug}.json`), JSON.stringify(c, null, 2) + '\n');
const log = [];

// ---- Inputs
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(f => f !== '')) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}
const csv = parseCsv(readFileSync(join(root, 'docs/research/framework-alignment.csv'), 'utf8'));
const FRAMEWORKS = Object.keys(csv[0]).filter(k => !['Group', 'Canonical', 'Also called', 'Notes'].includes(k));
const csvRow = name => csv.find(r => r.Canonical.toLowerCase() === name.toLowerCase());

const research = readFileSync(join(root, 'docs/research/component-vocabulary-and-page-structure.md'), 'utf8');
const s4 = research.split('## 4.')[1].split('## 5.')[0];
const researchAliases = {};
for (const m of s4.matchAll(/^\| \*{0,2}([^|*]+?)\*{0,2} \| ([^|]*) \|/gm)) {
  const name = m[1].trim();
  if (name === 'Canonical' || name.startsWith('---')) continue;
  researchAliases[name.toLowerCase()] = m[2].split(',').map(s => s.trim()).filter(Boolean);
}

// ---- The reconciliation (docs/reconciliation.md section 1, with Q7 names)
const RENAMES = {
  aside: ['sidebar', 'Sidebar'],
  snapshot: ['description-list', 'Description list'],
  prose: ['rich-text', 'Rich Text'],
  nav: ['navigation', 'Navigation'],
  breadcrumb: ['breadcrumbs', 'Breadcrumbs'],
  modal: ['dialog', 'Dialog'],
  progress: ['progress-bar', 'Progress bar'],
  dropdown: ['menu-button', 'Menu button'],
  divider: ['separator', 'Separator'],
  cta: ['call-to-action', 'Call to action'],
  stat: ['stats', 'Stats'],
  pricing: ['pricing-table', 'Pricing table'],
  figure: ['image', 'Image'],
};
const NAME_ONLY = { 'logo-cloud': 'Logo cloud' };
// retired slug -> [target slug (after renames), variant caption]
const FOLDS = {
  container: ['section', 'Contained width (formerly Container)'],
  article: ['rich-text', 'Article page (formerly Article)'],
  banner: ['alert', 'Announcement (formerly Banner)'],
  media: ['card', 'Horizontal media (formerly Media)'],
  profile: ['card', 'Person (formerly Profile)'],
  showcase: ['card', 'Large feature (formerly Showcase)'],
  comparison: ['table', 'Comparison (formerly Comparison)'],
  marquee: ['logo-cloud', 'Scrolling (formerly Marquee)'],
  mosaic: ['grid', 'Asymmetric (formerly Mosaic)'],
  callout: ['alert', 'Note (formerly Callout)'],
};
// Extra notes carried into targets where the reconciliation says so.
const FOLD_NOTES = {
  container: 'Width is a Section setting (narrow, content, wide, full), not a separate Container block.',
  article: 'Use <code>&lt;article&gt;</code> only for self-contained content such as a post or a Card in a list; plain body text is a <code>&lt;div&gt;</code>.',
  profile: 'For people, use a Card with an Avatar (person variant) rather than a separate Profile component.',
  callout: 'Pull-quotes belong to Quote, not Alert.',
  banner: 'Avoid the word "banner" for this: it is the name of the page header landmark.',
};
const LEGACY_TO_CSV = { bootstrap: 'Bootstrap', material: 'MUI', ant: 'Ant Design', apple: 'Apple HIG', shadcn: 'shadcn/ui' };
const MATCH = { '●': 'same', '◐': 'alias', '○': 'different' };

const redirects = {};
const all = () => readdirSync(dataDir).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5));

// 1. Folds: move the retired page's default wireframe (and variants) to the target.
for (const [oldSlug, [targetSlugAfter, caption]] of Object.entries(FOLDS)) {
  const old = load(oldSlug);
  const targetSlugBefore = Object.entries(RENAMES).find(([, [s]]) => s === targetSlugAfter)?.[0] ?? targetSlugAfter;
  const target = load(targetSlugBefore);
  const destDir = join(root, 'wireframes', targetSlugBefore);
  const moveSvg = (from, name) => { const to = `wireframes/${targetSlugBefore}/${name}`; renameSync(join(root, from), join(root, to)); return to; };
  target.variants.push({ caption, wireframe: moveSvg(old.wireframe, `from-${oldSlug}.svg`) });
  const dropped = [...old.variants.map(v => v.caption), ...old.collections.map(c => c.title)];
  if (FOLD_NOTES[oldSlug]) target.usageNotes.push(FOLD_NOTES[oldSlug]);
  target.absorbed = [...(target.absorbed || []), old.name];
  save(target);
  rmSync(join(root, 'wireframes', oldSlug), { recursive: true, force: true });
  unlinkSync(join(dataDir, `${oldSlug}.json`));
  redirects[oldSlug] = targetSlugAfter;
  log.push(`Folded ${old.name} into ${targetSlugAfter}: default wireframe kept as variant "${caption}"${dropped.length ? `; not carried over: ${dropped.join(', ')}` : ''}`);
}

// 2. Renames (slug, name, wireframe folder), old name becomes an alias.
for (const [oldSlug, [newSlug, newName]] of Object.entries(RENAMES)) {
  const c = load(oldSlug);
  const oldName = c.name;
  const fix = p => p.replace(`wireframes/${oldSlug}/`, `wireframes/${newSlug}/`);
  renameSync(join(root, 'wireframes', oldSlug), join(root, 'wireframes', newSlug));
  Object.assign(c, { slug: newSlug, name: newName, wireframe: fix(c.wireframe), thumbnail: fix(c.thumbnail) });
  c.variants.forEach(v => (v.wireframe = fix(v.wireframe)));
  c.collections.forEach(col => (col.wireframe = fix(col.wireframe)));
  c.formerNames = [oldName];
  unlinkSync(join(dataDir, `${oldSlug}.json`));
  save(c);
  redirects[oldSlug] = newSlug;
  log.push(`Renamed ${oldName} (${oldSlug}) to ${newName} (${newSlug})`);
}
for (const [slug, name] of Object.entries(NAME_ONLY)) {
  const c = load(slug); c.formerNames = [c.name]; c.name = name; save(c);
  log.push(`Renamed ${c.formerNames[0]} to ${name} (slug unchanged)`);
}

// 3. Aliases and framework names; CSV wins over the legacy page and row.
const disagreements = [];
const aliasOwners = new Map();
const slugs = all();
const comps = slugs.map(load).sort((a, b) => a.order - b.order);
comps.forEach((c, i) => { c.order = i + 1; });
for (const c of comps) {
  const row = csvRow(c.name);
  const aliases = new Set([...(researchAliases[c.name.toLowerCase()] || []), ...(row ? row['Also called'].split(',').map(s => s.trim()).filter(Boolean) : []), ...(c.formerNames || [])]);
  // "Banner" is retired as a name (research section 5); keep it only where Banner was folded (Alert).
  if (c.slug !== 'alert') aliases.delete('Banner');
  aliases.delete(c.name);
  c.aliases = [...aliases];
  if (row) {
    c.frameworkSource = 'csv';
    c.frameworkNames = Object.fromEntries(FRAMEWORKS.map(f => {
      const cell = (row[f] || '—').trim();
      if (cell === '—' || !cell) return [f, { match: 'none' }];
      return [f, { match: MATCH[cell[0]] ?? 'same', name: cell.slice(1).trim() }];
    }));
    for (const [legacyKey, fw] of Object.entries(LEGACY_TO_CSV)) {
      const legacy = (c.legacyComparison[legacyKey] || '').replace(/\s*\(.*?\)\s*/g, '').trim();
      const now = c.frameworkNames[fw];
      const csvName = now.match === 'none' ? '—' : now.name;
      if (legacy.toLowerCase() !== csvName.toLowerCase()) disagreements.push(`${c.name} / ${fw}: legacy "${c.legacyComparison[legacyKey]}" vs CSV "${csvName}"`);
    }
  } else {
    c.frameworkSource = 'legacy';
    c.frameworkNames = Object.fromEntries(FRAMEWORKS.map(f => {
      const legacyKey = Object.entries(LEGACY_TO_CSV).find(([, v]) => v === f)?.[0];
      const v = legacyKey ? c.legacyComparison[legacyKey] : '—';
      if (!v || v === '—') return [f, { match: 'none' }];
      return [f, { match: /\(partial|composed\)/.test(v) ? 'alias' : 'same', name: v.replace(/\s*\((partial|composed|deprecated)\)/, '').trim() }];
    }));
    log.push(`${c.name}: not in the CSV; framework names kept from the legacy page for the 5 old systems`);
  }
  for (const a of c.aliases) {
    const k = a.toLowerCase();
    if (aliasOwners.has(k)) log.push(`Alias "${a}" claimed by ${aliasOwners.get(k)} and ${c.name}`);
    aliasOwners.set(k, c.name);
  }
  delete c.alsoKnownAs;
  delete c.legacyComparison;
  delete c.sectionOrder;
  save(c);
}

// Redirect targets must exist; chains are collapsed.
for (const [from, to] of Object.entries(redirects)) {
  let t = to; while (redirects[t]) t = redirects[t];
  redirects[from] = t;
  if (!existsSync(join(dataDir, `${t}.json`))) throw new Error(`redirect ${from} -> ${t}: missing target`);
}
writeFileSync(join(root, 'data/redirects.json'), JSON.stringify(Object.fromEntries(Object.entries(redirects).sort()), null, 2) + '\n');

const existing = readFileSync(join(root, 'docs/migration-log.md'), 'utf8');
writeFileSync(join(root, 'docs/migration-log.md'), existing.trimEnd() + '\n\n' + [
  '## Phase 5: reconciliation',
  '',
  'Written by `scripts/legacy/reconcile.mjs`. Applies `docs/reconciliation.md` §1 with the Q7 names (Stats, Logo cloud, Pricing table, Call to action).',
  '',
  ...log.map(l => `- ${l}`),
  '',
  `### Legacy comparison vs CSV (${disagreements.length} cells; the CSV wins)`,
  '',
  'Legacy column → CSV column: Bootstrap → Bootstrap, Material → MUI, Ant → Ant Design, Apple → Apple HIG, shadcn → shadcn/ui. Qualifiers such as "(partial)" are ignored when comparing.',
  '',
  ...disagreements.map(d => `- ${d}`),
  '',
].join('\n'));
console.log(`components: ${comps.length}; redirects: ${Object.keys(redirects).length}; disagreements: ${disagreements.length}; log lines: ${log.length}`);
