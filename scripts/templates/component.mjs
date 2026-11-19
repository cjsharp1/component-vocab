// Component page template. Markup mirrors the hand-written pages exactly,
// including the contracts js/main.js relies on (.wireframe-container svg,
// .hover-target followed by .label-group, .component-nav).
import { indent } from './util.mjs';

const UNIVERSAL = `      <h3>Universal</h3>
      <table>
        <thead>
          <tr><th>Config</th><th>Options</th></tr>
        </thead>
        <tbody>
          <tr><td>Background</td><td>Color, Image, Gradient, None</td></tr>
          <tr><td>Spacing</td><td>Compact, Default, Spacious</td></tr>
          <tr><td>Width</td><td>Contained, Full-width</td></tr>
          <tr><td>Alignment</td><td>Left, Center, Right</td></tr>
          <tr><td>Theme</td><td>Light, Dark</td></tr>
        </tbody>
      </table>
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
${UNIVERSAL}
      <h3>Component-Specific</h3>
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

export function componentPage(c, { prev, next, group, svg }) {
  let collectionIndex = 0;
  const body = c.sectionOrder
    .map(s => (s === 'collection' ? sections.collection(c, svg, collectionIndex++) : sections[s](c, svg)))
    .join('\n');
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
      <p>${c.description}</p>

      <dl>
        <dt>Also known as</dt>
        <dd>${c.alsoKnownAs}</dd>
        <dt>Semantic element</dt>
        <dd>${c.htmlElement}</dd>
        <dt>Category</dt>
        <dd>${group.label}</dd>
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
