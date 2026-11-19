// Derive parents and children for every component from data/structure.json
// (research section 3 matrix). Parents come from the rules; children are the
// exact inverse, so the data is symmetric by construction.
//   node scripts/structure.mjs          rewrite parents/children in data/components
//   import { derive } from './structure.mjs'   (used by the validator)
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadComponents } from './validate.mjs';

export function derive(components, rules) {
  const present = new Set(components.map(c => c.slug));
  const keep = list => list.filter(s => present.has(s));
  const parents = {};
  for (const c of components) {
    let p;
    if (rules.layout[c.slug]) p = rules.layout[c.slug].parents;
    else if (rules.special[c.slug]) p = rules.special[c.slug].parents;
    else if (rules.noParents.groups.includes(c.group) || rules.noParents.slugs.includes(c.slug)) p = [];
    else if (c.group === rules.formControls.group && !rules.formControls.exclude.includes(c.slug)) p = rules.formControls.parents;
    else if (c.slug === 'fieldset') p = rules.formControls.fieldsetParents;
    else p = rules.contentParents;
    parents[c.slug] = keep([...new Set([...p, ...(rules.extraParents[c.slug] || [])])]);
  }
  const children = Object.fromEntries(components.map(c => [c.slug, []]));
  for (const c of components) for (const p of parents[c.slug]) children[p].push(c.slug);
  return { parents, children };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = process.cwd();
  const rules = JSON.parse(readFileSync(join(root, 'data/structure.json'), 'utf8'));
  const loaded = loadComponents(root);
  const ordered = loaded.map(l => l.data).sort((a, b) => a.order - b.order);
  const { parents, children } = derive(ordered, rules);
  const bySlug = new Map(ordered.map((c, i) => [c.slug, i]));
  const sort = list => [...list].sort((a, b) => bySlug.get(a) - bySlug.get(b));
  for (const { file, data } of loaded) {
    data.parents = sort(parents[data.slug]);
    data.children = sort(children[data.slug]);
    writeFileSync(join(root, 'data/components', file), JSON.stringify(data, null, 2) + '\n');
  }
  console.log(`parents/children written for ${loaded.length} components`);
}
