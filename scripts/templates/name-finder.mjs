// Name finder: every alias, former name and absorbed (folded) name → the
// canonical component page(s). Reasons come from researchNote text that
// mentions the looked-up name, so nothing is typed twice.
import { codeText } from './component.mjs';

function addRef(map, name, component, kind) {
  const key = name.toLowerCase();
  if (!map.has(key)) map.set(key, { name, targets: new Map() });
  const row = map.get(key);
  // Prefer the casing from the first alias/former/absorbed entry.
  if (!row.targets.has(component.slug)) {
    row.targets.set(component.slug, { component, kinds: new Set() });
  }
  row.targets.get(component.slug).kinds.add(kind);
}

function mentionsName(note, name, { quotedOnly = false } = {}) {
  if (!note) return false;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Retirement notes quote the looked-up name ("Banner", "Stepper"). Require
  // quotes for non-target notes so short aliases like "Menu" don't match every
  // sentence that happens to say "menu".
  const pattern = quotedOnly
    ? new RegExp(`"${escaped}"`, 'i')
    : new RegExp(`(^|[^\\w])${escaped}([^\\w]|$)`, 'i');
  return pattern.test(note);
}

export function collectNameFinderRows(components) {
  const map = new Map();
  for (const c of components) {
    for (const name of c.aliases || []) addRef(map, name, c, 'alias');
    for (const name of c.formerNames || []) addRef(map, name, c, 'former');
    for (const name of c.absorbed || []) addRef(map, name, c, 'absorbed');
  }

  const rows = [];
  for (const { name, targets } of map.values()) {
    const targetSlugs = new Set([...targets.keys()]);
    const reasons = [];
    for (const c of components) {
      const fromTarget = targetSlugs.has(c.slug);
      if (!mentionsName(c.researchNote, name, { quotedOnly: !fromTarget })) continue;
      if (!reasons.includes(c.researchNote)) reasons.push(c.researchNote);
    }
    // Multi-target names with no research note still need a one-line pointer.
    if (targets.size > 1 && !reasons.length) {
      reasons.push('Ambiguous name; see the linked components.');
    }
    rows.push({
      name,
      targets: [...targets.values()].sort((a, b) => a.component.name.localeCompare(b.component.name)),
      reason: reasons.join(' '),
    });
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}

export function nameFinderPage(components) {
  const rows = collectNameFinderRows(components);
  const body = rows
    .map(r => {
      const see = r.targets
        .map(t => `<a href="./components/${t.component.slug}.html">${t.component.name}</a>`)
        .join('; ');
      const note = r.reason ? codeText(r.reason) : '';
      return `          <tr>
            <th scope="row">${r.name}</th>
            <td>${see}</td>
            <td>${note}</td>
          </tr>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Name finder — component-vocab</title>
  <link rel="stylesheet" href="./css/pico.classless.min.css">
  <link rel="stylesheet" href="./css/site.css">
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><strong><a href="./index.html">component-vocab</a></strong></li>
      </ul>
      <ul>
        <li><a href="./index.html#components">Components</a></li>
        <li><a href="./index.html#comparison">Comparison</a></li>
        <li><a href="./name-finder.html" aria-current="page">Name finder</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="name-finder">
      <h1>Name finder</h1>
      <p>Look up an old, competing or folded name. Each row points at the canonical component page. Notes come from <code>researchNote</code> text that mentions the name (for example when a word is reserved or split).</p>
      <p>
        <label for="name-filter">Filter names
          <input type="search" id="name-filter" name="name-filter" placeholder="Banner, Stepper, Dropdown…" autocomplete="off">
        </label>
      </p>
      <table id="name-finder-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">See</th>
            <th scope="col">Note</th>
          </tr>
        </thead>
        <tbody>
${body}
        </tbody>
      </table>
    </section>
  </main>

  <footer>
    <p>component-vocab &mdash; A framework-agnostic reference for website components.</p>
  </footer>

  <script src="./js/main.js"></script>
</body>
</html>
`;
}
