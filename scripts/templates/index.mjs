// Index page: static head (intro, legend) and foot come from the .html
// fragments beside this file; the universal section, filter, grid and
// comparison table are generated from the data.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { indent } from './util.mjs';
import { codeText } from './component.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fragment = name => readFileSync(join(here, name), 'utf8').replace(/\r\n/g, '\n');

export const SYMBOL = { same: '●', alias: '◐', different: '○', none: '—' };
export const groupTitle = g => `${g.letter}. ${g.label}`;

export function indexPage({ groups, components, systems, svg }) {
  const used = groups.filter(g => components.some(c => c.group === g.slug));

  const filter = `      <nav>
        <ul>
          <li><a href="#" data-filter="all" aria-current="true">All <span class="chip-count">${components.length}</span></a></li>
${used.map(g => `          <li><a href="#" data-filter="${g.slug}">${g.label} <span class="chip-count">${components.filter(c => c.group === g.slug).length}</span></a></li>`).join('\n')}
        </ul>
      </nav>
`;

  const grid = used
    .map(g => {
      const items = components.filter(c => c.group === g.slug);
      return `      <div data-category="${g.slug}" id="${g.slug}">
        <h3 class="category-heading">${groupTitle(g)}</h3>
${g.consensus === false ? `        <p class="group-note">${g.description}</p>\n` : ''}        <ul class="component-grid">
${items.map(c => `          <li${c.status === 'draft' ? ' class="is-draft"' : ''}>
            <a href="./components/${c.slug}.html">
${c.thumbnail ? indent(svg(c.thumbnail), 14) : '              <span class="thumb-placeholder" aria-hidden="true">Draft</span>'}
              <strong>${c.name}</strong>
              <small>${c.status === 'draft' ? codeText(c.summary) : c.summary}</small>
            </a>
          </li>`).join('\n')}
        </ul>
      </div>
`;
    })
    .join('\n');

  const cell = (c, s) => {
    const v = c.frameworkNames[s] || { match: 'none' };
    return v.match === 'none'
      ? `<td class="match-none">—</td>`
      : `<td class="match-${v.match}"><span class="match-symbol" aria-hidden="true">${SYMBOL[v.match]}</span> ${v.name}</td>`;
  };
  const rows = components
    .map(c => `            <tr>
              <td><a href="./components/${c.slug}.html">${c.name}</a>${c.frameworkSource === 'legacy' ? '<sup>*</sup>' : ''}</td>
${systems.map(s => `              ${cell(c, s)}`).join('\n')}
            </tr>`)
    .join('\n');

  const comparison = `    <section id="comparison">
      <h2>Cross-System Comparison</h2>
      <p>How ${systems.length} design systems name each component, from <code>docs/research/framework-alignment.csv</code>. See <a href="https://github.com/cjsharp1/component-vocab/blob/main/docs/research/framework-survey.md">how the survey was done</a> for the index URLs, survey date, and what "—" means.</p>
      <ul class="match-key">
        <li><span class="match-symbol" aria-hidden="true">●</span> Same name</li>
        <li><span class="match-symbol" aria-hidden="true">◐</span> Known alternative name</li>
        <li><span class="match-symbol" aria-hidden="true">○</span> Related component under another name</li>
        <li><span class="match-symbol" aria-hidden="true">—</span> No equivalent on that system's index when surveyed</li>
        <li><sup>*</sup> Not in the CSV: names come from the old page and cover 5 systems only</li>
      </ul>
      <div class="table-scroll-controls" hidden>
        <button type="button" data-scroll="-1" aria-controls="comparison-table">&larr; Previous systems</button>
        <button type="button" data-scroll="1" aria-controls="comparison-table">Next systems &rarr;</button>
        <small>Or drag the table, use Shift + scroll wheel, or focus it and press &larr; / &rarr;.</small>
      </div>
      <div class="table-scroll" id="comparison-table" tabindex="0" role="region" aria-label="Cross-system comparison, scrolls sideways">
        <table>
          <thead>
            <tr>
              <th>Component</th>
${systems.map(s => `              <th>${s}</th>`).join('\n')}
            </tr>
          </thead>
          <tbody>
`;

  const head = fragment('index-head.html').replace('    <section id="components">', fragment('index-universal.html') + '    <section id="components">');
  return `${head}${filter}
${grid}    </section>

${comparison}${rows}
          </tbody>
${fragment('index-foot.html')}`;
}
