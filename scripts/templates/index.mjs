// Index page: static head (intro, legend) and foot come from the .html
// fragments beside this file; the filter, grid and comparison table are
// generated from the data.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { indent } from './util.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fragment = name => readFileSync(join(here, name), 'utf8').replace(/\r\n/g, '\n');

export function indexPage({ groups, components, svg }) {
  const filter = `      <nav>
        <ul>
          <li><a href="#" data-filter="all" aria-current="true">All</a></li>
${groups.map(g => `          <li><a href="#" data-filter="${g.slug}">${g.label}</a></li>`).join('\n')}
        </ul>
      </nav>
`;

  const grid = groups
    .map(g => {
      const items = components.filter(c => c.group === g.slug);
      return `      <div data-category="${g.slug}">
        <h3 class="category-heading">${g.label}</h3>
        <ul class="component-grid">
${items.map(c => `          <li>
            <a href="./components/${c.slug}.html">
${indent(svg(c.thumbnail), 14)}
              <strong>${c.name}</strong>
              <small>${c.summary}</small>
            </a>
          </li>`).join('\n')}
        </ul>
      </div>
`;
    })
    .join('\n');

  const rows = components
    .map(c => {
      const k = c.legacyComparison;
      return `            <tr>
              <td><a href="./components/${c.slug}.html">${c.name}</a></td>
${[k.bootstrap, k.material, k.ant, k.apple, k.shadcn].map(v => `              <td>${v}</td>`).join('\n')}
            </tr>`;
    })
    .join('\n');

  return `${fragment('index-head.html')}${filter}
${grid}    </section>

${fragment('index-comparison-head.html')}${rows}
          </tbody>
${fragment('index-foot.html')}`;
}
