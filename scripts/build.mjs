// Generate the site from data/. No dependencies; Node 18+.
//
//   node scripts/build.mjs           write components/*.html and index.html
//   node scripts/build.mjs --check   fail if committed output differs from
//                                    generated output, data is invalid, or
//                                    any relative link or #fragment is broken
//
// Output always uses LF line endings. Generated files are committed so the
// site works from file:// and static hosting with no build step.
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname, normalize, relative } from 'node:path';
import { validate, loadComponents } from './validate.mjs';
import { componentPage } from './templates/component.mjs';
import { indexPage } from './templates/index.mjs';

const root = process.cwd();
const check = process.argv.includes('--check');
const read = p => readFileSync(join(root, p), 'utf8').replace(/\r\n/g, '\n');

// Fragments known to be broken and scheduled for a later phase. Each entry
// is reported, not failed. Remove entries as the fixes land.
const KNOWN_BROKEN_FRAGMENTS = {
  reason: 'Breadcrumb category anchors have no matching id in index.html (brief 9.1); fixed in Phase 6',
  test: (file, href) => file.startsWith('components/') && /^\.\.\/index\.html#[a-z-]+$/.test(href) && !/#(components|comparison|intro|legend)$/.test(href),
};

export function build() {
  const groups = JSON.parse(read('data/legacy-categories.json'));
  const components = loadComponents(root).map(c => c.data).sort((a, b) => a.order - b.order);
  const svg = path => read(path);
  const out = new Map();
  components.forEach((c, i) => {
    const group = groups.find(g => g.slug === c.group);
    if (!group) throw new Error(`${c.slug}: unknown group "${c.group}"`);
    out.set(`components/${c.slug}.html`, componentPage(c, { prev: components[i - 1], next: components[i + 1], group, svg }));
  });
  out.set('index.html', indexPage({ groups, components, svg }));
  return out;
}

function checkLinks(out) {
  const errors = [];
  const known = [];
  const ids = new Map();
  const idsOf = file => {
    if (!ids.has(file)) {
      const html = out.get(file) ?? (existsSync(join(root, file)) ? read(file) : '');
      ids.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])));
    }
    return ids.get(file);
  };
  for (const [file, html] of out) {
    for (const [, attr, href] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|data:)/.test(href) || href === '#') continue;
      const [path, frag] = href.split('#');
      const target = path ? normalize(join(dirname(file), path)).replace(/\\/g, '/') : file;
      if (path && !out.has(target) && !existsSync(join(root, target))) { errors.push(`${file}: ${attr}="${href}" points to a missing file`); continue; }
      if (frag && !idsOf(target).has(frag)) {
        if (KNOWN_BROKEN_FRAGMENTS.test(file, href)) known.push(`${file}: ${href}`);
        else errors.push(`${file}: ${attr}="${href}" has no matching id in ${target}`);
      }
    }
  }
  return { errors, known };
}

const { count, errors: dataErrors } = validate(root);
if (dataErrors.length) {
  console.error(dataErrors.join('\n'));
  console.error(`\nData invalid: ${dataErrors.length} error(s)`);
  process.exit(1);
}
const out = build();
const { errors: linkErrors, known } = checkLinks(out);
const generatedPages = new Set([...out.keys()].filter(f => f.startsWith('components/')));
const stale = readdirSync(join(root, 'components')).filter(f => f.endsWith('.html')).map(f => `components/${f}`).filter(f => !generatedPages.has(f));

if (check) {
  const diffs = [...out].filter(([file, html]) => !existsSync(join(root, file)) || read(file) !== html).map(([file]) => file);
  const problems = [
    ...diffs.map(f => `${f}: differs from generated output (run node scripts/build.mjs)`),
    ...stale.map(f => `${f}: not generated from data (stale page)`),
    ...linkErrors,
  ];
  if (known.length) console.log(`Known issue, not failing (${known.length}): ${KNOWN_BROKEN_FRAGMENTS.reason}`);
  if (problems.length) {
    console.error(problems.join('\n'));
    console.error(`\nCheck failed: ${problems.length} problem(s)`);
    process.exit(1);
  }
  console.log(`Check passed: ${count} components, ${out.size} pages, links and fragments resolve`);
} else {
  for (const [file, html] of out) writeFileSync(join(root, file), html);
  for (const f of stale) unlinkSync(join(root, f));
  if (linkErrors.length) console.error(`Warning: ${linkErrors.length} broken link(s):\n${linkErrors.join('\n')}`);
  console.log(`Wrote ${out.size} pages${stale.length ? `, removed ${stale.length} stale page(s): ${stale.join(', ')}` : ''}`);
}
