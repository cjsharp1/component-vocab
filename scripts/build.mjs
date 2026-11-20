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
import { componentPage, redirectPage } from './templates/component.mjs';
import { indexPage } from './templates/index.mjs';
import { collectNameFinderRows, nameFinderPage } from './templates/name-finder.mjs';
import { derive } from './structure.mjs';

const root = process.cwd();
const check = process.argv.includes('--check');
const read = p => readFileSync(join(root, p), 'utf8').replace(/\r\n/g, '\n');

export function build() {
  const groups = JSON.parse(read('data/groups.json'));
  const systems = JSON.parse(read('data/systems.json'));
  const components = loadComponents(root).map(c => c.data).sort((a, b) => a.order - b.order);
  const svg = path => read(path);
  const names = new Map(components.map(c => [c.slug, c.name]));
  const out = new Map();
  components.forEach((c, i) => {
    const group = groups.find(g => g.slug === c.group);
    if (!group) throw new Error(`${c.slug}: unknown group "${c.group}"`);
    out.set(`components/${c.slug}.html`, componentPage(c, { prev: components[i - 1], next: components[i + 1], group, svg, names }));
  });
  out.set('index.html', indexPage({ groups, components, systems, svg }));
  out.set('name-finder.html', nameFinderPage(components));
  const redirects = existsSync(join(root, 'data/redirects.json')) ? JSON.parse(read('data/redirects.json')) : {};
  for (const [from, to] of Object.entries(redirects)) {
    const target = components.find(c => c.slug === to);
    if (!target) throw new Error(`redirect ${from} -> ${to}: no such component`);
    if (components.some(c => c.slug === from)) throw new Error(`redirect ${from}: slug is still a live component`);
    out.set(`components/${from}.html`, redirectPage(target));
  }
  return out;
}

function checkNameFinder(components) {
  const errors = [];
  const rows = collectNameFinderRows(components);
  const byName = new Map(rows.map(r => [r.name.toLowerCase(), r]));
  const expected = new Map();
  for (const c of components) {
    for (const [name, kind] of [
      ...(c.aliases || []).map(n => [n, 'alias']),
      ...(c.formerNames || []).map(n => [n, 'former']),
      ...(c.absorbed || []).map(n => [n, 'absorbed']),
    ]) {
      const key = name.toLowerCase();
      if (!expected.has(key)) expected.set(key, { name, slugs: new Set() });
      expected.get(key).slugs.add(c.slug);
    }
  }
  for (const [key, { name, slugs }] of expected) {
    const row = byName.get(key);
    if (!row) {
      errors.push(`name-finder: missing row for "${name}"`);
      continue;
    }
    const rowSlugs = new Set(row.targets.map(t => t.component.slug));
    for (const slug of slugs) {
      if (!rowSlugs.has(slug)) errors.push(`name-finder: "${name}" should point at ${slug}`);
      else if (!components.some(c => c.slug === slug)) errors.push(`name-finder: "${name}" points at missing page ${slug}`);
    }
  }
  for (const row of rows) {
    for (const t of row.targets) {
      if (!components.some(c => c.slug === t.component.slug)) {
        errors.push(`name-finder: "${row.name}" points at missing page ${t.component.slug}`);
      }
    }
  }
  return errors;
}

function checkLinks(out) {
  const errors = [];
  const ids = new Map();
  const idsOf = file => {
    if (!ids.has(file)) {
      const html = out.get(file) ?? (existsSync(join(root, file)) ? read(file) : '');
      ids.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])));
    }
    return ids.get(file);
  };
  for (const [file, html] of out) {
    // Ignore markup shown as text (escaped code such as &lt;a href="#main"&gt;).
    const live = html.replace(/&lt;[\s\S]*?&gt;/g, '');
    for (const [, attr, href] of live.matchAll(/\s(href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|data:)/.test(href) || href === '#') continue;
      const [path, frag] = href.split('#');
      const target = path ? normalize(join(dirname(file), path)).replace(/\\/g, '/') : file;
      if (path && !out.has(target) && !existsSync(join(root, target))) { errors.push(`${file}: ${attr}="${href}" points to a missing file`); continue; }
      if (frag && !idsOf(target).has(frag)) errors.push(`${file}: ${attr}="${href}" has no matching id in ${target}`);
    }
  }
  return { errors };
}

const { count, errors: dataErrors } = validate(root);
if (dataErrors.length) {
  console.error(dataErrors.join('\n'));
  console.error(`\nData invalid: ${dataErrors.length} error(s)`);
  process.exit(1);
}
// Parent/child data must match what data/structure.json derives.
const rules = JSON.parse(read('data/structure.json'));
const current = loadComponents(root).map(c => c.data);
const derived = derive(current, rules);
const structureErrors = current
  .filter(c => [...derived.parents[c.slug]].sort().join() !== [...c.parents].sort().join() || [...derived.children[c.slug]].sort().join() !== [...c.children].sort().join())
  .map(c => `data/components/${c.slug}.json: parents/children out of date (run node scripts/structure.mjs)`);
if (structureErrors.length) {
  console.error(structureErrors.join('\n'));
  process.exit(1);
}
const out = build();
const { errors: linkErrors } = checkLinks(out);
const nameFinderErrors = checkNameFinder(current);
const generatedPages = new Set([...out.keys()].filter(f => f.startsWith('components/')));
const stale = readdirSync(join(root, 'components')).filter(f => f.endsWith('.html')).map(f => `components/${f}`).filter(f => !generatedPages.has(f));

if (check) {
  const diffs = [...out].filter(([file, html]) => !existsSync(join(root, file)) || read(file) !== html).map(([file]) => file);
  const problems = [
    ...diffs.map(f => `${f}: differs from generated output (run node scripts/build.mjs)`),
    ...stale.map(f => `${f}: not generated from data (stale page)`),
    ...linkErrors,
    ...nameFinderErrors,
  ];
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
  if (nameFinderErrors.length) console.error(`Warning: ${nameFinderErrors.length} name-finder issue(s):\n${nameFinderErrors.join('\n')}`);
  console.log(`Wrote ${out.size} pages${stale.length ? `, removed ${stale.length} stale page(s): ${stale.join(', ')}` : ''}`);
}
