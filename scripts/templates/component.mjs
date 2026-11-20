// Component page template. Markup mirrors the hand-written pages exactly,
// including the contracts js/main.js relies on (.wireframe-container svg,
// .hover-target followed by .label-group, .component-nav).
import { indent } from './util.mjs';

const UNIVERSAL = `      <p>Universal options (background, spacing, width, alignment, theme) apply to every component. See <a href="../index.html#universal-configuration">Universal configuration</a>.</p>
`;

const sections = {
  Elements: c => `    <section>
      <h2>Elements</h2>
      <table>
        <thead>
          <tr>
            <th>Element</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
${c.elements.map(e => `          <tr><td>${e.name}</td><td>${e.required}</td><td>${e.description}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </section>
`,

  'Default Layout': (c, svg) => `    <section>
      <h2>Default Layout</h2>
      <div class="wireframe-container">
${indent(svg(c.wireframe), 8)}
      </div>
    </section>
`,

  collection: (c, svg, n) => {
    const col = c.collections[n];
    return `    <section>
      <h2>${col.title}</h2>
      <div class="wireframe-container">
${indent(svg(col.wireframe), 8)}
      </div>
${col.caption != null ? `      <p><em>${col.caption}</em></p>\n` : ''}    </section>
`;
  },

  'Configuration Options': c => `    <section>
      <h2>Configuration Options</h2>
${UNIVERSAL}      <h3>Component-Specific</h3>
      <table>
        <thead>
          <tr><th>Config</th><th>Options</th><th>Affects Layout</th></tr>
        </thead>
        <tbody>
${c.configOptions.map(o => `          <tr><td>${o.config}</td><td>${o.options}</td><td${o.highlighted ? ' class="affects-layout"' : ''}>${o.affectsLayout}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </section>
`,

  'Layout Variations': (c, svg) => `    <section>
      <h2>Layout Variations</h2>
      <div class="variation-grid">
${c.variants.map(v => `        <figure>
          <div class="wireframe-container">
${indent(svg(v.wireframe), 12)}
          </div>
          <figcaption>${v.caption}</figcaption>
${v.htmlOutline
    ? `          <details class="variant-outline">
            <summary>HTML outline</summary>
            <pre class="html-outline"><code>${esc(v.htmlOutline)}</code></pre>
          </details>`
    : `          <p class="variant-outline">Same HTML as the <a href="#html-outline">default outline</a>; only the styling changes.</p>`}
        </figure>`).join('\n\n')}
      </div>
    </section>
`,

  'Usage Notes': c => `    <section>
      <h2>Usage Notes</h2>
      <ul>
${c.usageNotes.map(n => `        <li>${n}</li>`).join('\n')}
      </ul>
    </section>
`,
};

// "Also known as": aliases, then design-system names grouped by name.
// Only systems with a match are listed (no placeholder dashes).
export function alsoKnownAs(c) {
  const byName = new Map();
  for (const [system, v] of Object.entries(c.frameworkNames || {})) {
    if (v.match === 'none' || v.match === 'unchecked') continue;
    if (!byName.has(v.name)) byName.set(v.name, []);
    byName.get(v.name).push(system);
  }
  const systems = [...byName].map(([name, list]) => `${name} (${list.join(', ')})`);
  const parts = [];
  if (c.aliases?.length) parts.push(c.aliases.join(', '));
  if (systems.length) parts.push(`In design systems: ${systems.join('; ')}`);
  if (parts.length) return parts.join('. ');
  if (c.frameworkSource === 'none') return 'Not yet surveyed against the design systems';
  return 'No equivalent in the surveyed design systems';
}

// Small page left at a retired or renamed slug so old links keep working.
export function redirectPage(to) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=${to.slug}.html">
  <title>${to.name} — component-vocab</title>
  <link rel="canonical" href="${to.slug}.html">
  <link rel="stylesheet" href="../css/pico.classless.min.css">
  <link rel="stylesheet" href="../css/site.css">
</head>
<body>
  <main>
    <p>This page has moved: <a href="${to.slug}.html">${to.name}</a>.</p>
  </main>
</body>
</html>
`;
}

// Research cells use backticks for code; escape the rest.
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const codeText = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');

const MATCH_LABEL = { same: 'Same name', alias: 'Known alternative name', different: 'Related component under another name' };

function frameworkSection(c) {
  const rows = Object.entries(c.frameworkNames).filter(([, v]) => v.match !== 'none' && v.match !== 'unchecked');
  const unchecked = Object.entries(c.frameworkNames).filter(([, v]) => v.match === 'unchecked').map(([s]) => s);
  const source = c.frameworkSource === 'legacy'
    ? `Not in <code>docs/research/framework-alignment.csv</code>; these names come from the old page and cover 5 systems (Bootstrap, MUI, Ant Design, Apple HIG, shadcn/ui). Columns for other systems are marked "?" (not surveyed).`
    : c.frameworkSource === 'none'
      ? 'Not in <code>docs/research/framework-alignment.csv</code>; this component was never checked against the 12 indexes (shown as "?" in the comparison table).'
      : `From <code>docs/research/framework-alignment.csv</code>: ${rows.length} of ${Object.keys(c.frameworkNames).length} systems ship it.`;
  return `    <section>
      <h2>Design System Names</h2>
      <p>${source}</p>
${rows.length ? `      <table>
        <thead>
          <tr><th>System</th><th>Name</th><th>Match</th></tr>
        </thead>
        <tbody>
${rows.map(([s, v]) => `          <tr><td>${s}</td><td>${v.name}</td><td>${MATCH_LABEL[v.match]}</td></tr>`).join('\n')}
        </tbody>
      </table>
` : ''}${unchecked.length && c.frameworkSource === 'legacy' ? `      <p>Not surveyed: ${unchecked.join(', ')}.</p>
` : ''}${c.frameworkNotes ? `      <p>${esc(c.frameworkNotes)}</p>\n` : ''}    </section>
`;
}

function structureSection(c, names) {
  const list = slugs => slugs.map(s => `<a href="${s}.html">${names.get(s)}</a>`).join(', ');
  return `    <section>
      <h2>Structure</h2>
      <dl>
        <dt>Allowed parents</dt>
        <dd>${c.parents.length ? list(c.parents) : 'None: placed by the page template, rendered in the top layer, or used inline inside another component'}</dd>
${c.children.length ? `        <dt>Allowed children</dt>
        <dd>${list(c.children)}</dd>
` : ''}      </dl>
    </section>
`;
}

export function componentPage(c, { prev, next, group, svg, names }) {
  // One section order for every page: collections follow Layout Variations.
  // Sections without data are left out (draft pages have none of them).
  const has = {
    Elements: c.elements.length > 0,
    'Default Layout': Boolean(c.wireframe),
    'Configuration Options': c.configOptions.length > 0,
    'Layout Variations': c.variants.length > 0,
    'Usage Notes': c.usageNotes.length > 0,
  };
  const order = ['Elements', 'Default Layout', 'Configuration Options', 'Layout Variations', ...c.collections.map((_, n) => n), 'Usage Notes'];
  const outline = `    <section id="html-outline">
      <h2>HTML Outline</h2>
      <p>A high-level skeleton showing the semantic elements and ARIA this component uses. Illustrative, not production markup.</p>
      <pre class="html-outline"><code>${esc(c.htmlOutline)}</code></pre>
    </section>
`;
  const body = [
    outline,
    ...order.filter(s => typeof s === 'number' || has[s]).map(s => (typeof s === 'number' ? sections.collection(c, svg, s) : sections[s](c, svg))),
    structureSection(c, names),
    frameworkSection(c),
  ].join('\n');
  const industrySources = (c.industrySources || []).length
    ? (c.industrySources || [])
        .map(s => `<a href="${esc(s.url)}">${esc(s.label)}</a>`)
        .join('; ')
    : '';
  const facts = [
    ['Also known as', alsoKnownAs(c)],
    c.htmlElement && ['Semantic element', c.htmlElement],
    c.nativeHtml && ['Native HTML', codeText(c.nativeHtml)],
    c.aria && ['ARIA pattern', codeText(c.aria)],
    c.researchNote && c.status !== 'draft' && ['Research note', codeText(c.researchNote)],
    industrySources && ['Industry sources', industrySources],
    ['Category', `${group.letter}. ${group.label}`],
  ].filter(Boolean);
  const link = (target, label, dir) =>
    target
      ? `<a href="${target.slug}.html">${dir === 'prev' ? `&larr; ${target.name}` : `${target.name} &rarr;`}</a>`
      : `<a href="../index.html">${dir === 'prev' ? '&larr; Home' : 'Home &rarr;'}</a>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${c.name} — component-vocab</title>
  <link rel="stylesheet" href="../css/pico.classless.min.css">
  <link rel="stylesheet" href="../css/site.css">
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><strong><a href="../index.html">component-vocab</a></strong></li>
      </ul>
      <ul>
        <li><a href="../index.html#components">All Components</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <nav aria-label="breadcrumb">
      <ul>
        <li><a href="../index.html">Home</a></li>
        <li><a href="../index.html#${group.slug}">${group.label}</a></li>
        <li>${c.name}</li>
      </ul>
    </nav>

    <section>
      <h1>${c.name}</h1>
${c.status === 'draft' ? `      <p class="draft-badge"><strong>Draft</strong> No wireframe or usage guidance yet. This page lists only what the research and the framework survey record.</p>
` : ''}${c.description ? `      <p>${c.status === 'draft' ? codeText(c.description) : c.description}</p>
` : ''}
      <dl>
${facts.map(([dt, dd]) => `        <dt>${dt}</dt>\n        <dd>${dd}</dd>`).join('\n')}
      </dl>
    </section>

${body}
    <nav class="component-nav">
      ${link(prev, null, 'prev')}
      ${link(next, null, 'next')}
    </nav>
  </main>

  <footer>
    <p>component-vocab &mdash; A framework-agnostic reference for website components.</p>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
`;
}
