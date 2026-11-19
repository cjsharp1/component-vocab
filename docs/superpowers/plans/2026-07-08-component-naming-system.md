# component-vocab — Implementation Plan

> **Historical document.** All five tasks were completed on 2026-07-08 (see `.superpowers/sdd/progress.md`); checkboxes are ticked to match. The site has since been reworked: pages are generated from `data/` by `scripts/build.mjs` (see `README.md`).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone static documentation site with 50 website component definitions, schematic wireframes, configuration options, and cross-system name mappings.

**Architecture:** Static HTML pages styled with Pico CSS (classless variant for semantic markup). Inline SVG wireframes rendered with CSS hover-label interactivity. One index page + 50 component detail pages. No build step, no server — opens from `file://`.

**Tech Stack:** HTML5, Pico CSS v2 (classless, local file), inline SVG, vanilla JavaScript, CSS custom properties.

## Global Constraints

- All pages must work when opened from `file://` (no absolute paths, no fetch calls, relative links only)
- Pico CSS classless variant (`pico.classless.min.css`) — no CSS classes for base styling
- Wireframes are inline SVG, not external images
- Vanilla JS only — no frameworks, no build tools, no npm
- Hover labels use CSS `:hover` with minimal JS fallback for touch devices
- File paths use lowercase-kebab-case (`card.html`, `logo-cloud.html`)
- All cross-links use relative paths (`../index.html`, `./card.html`)

---

## File Structure

```
C:\Dev\Sandbox\component-vocab\
├── index.html                      # Overview page: intro, component grid, comparison table
├── css/
│   ├── pico.classless.min.css      # Pico CSS classless v2 (downloaded locally)
│   └── site.css                    # Custom styles: wireframe rendering, hover labels, grid overrides, nav
├── js/
│   └── main.js                     # Hover label toggle, category filtering
├── components/
│   ├── container.html
│   ├── section.html
│   ├── ... (50 total)
│   └── divider.html
└── docs/                           # Design spec + this plan (already exists)
```

### Key File Responsibilities

| File | Responsibility |
|------|---------------|
| `index.html` | Site entry point. Component grid grouped by category. Master comparison table. Links to all component pages. |
| `css/pico.classless.min.css` | Base styling. Semantic HTML gets typography, forms, tables, landmarks styled automatically. |
| `css/site.css` | Custom properties (colors for wireframe elements), wireframe SVG styles, hover label positioning, responsive grid for component cards, nav overrides, layout-variation grid. |
| `js/main.js` | Show/hide hover labels on SVG elements (touch fallback), category filter on index page. (Active-nav highlighting was planned but dropped: the site has no multi-item nav to highlight.) |
| `components/*.html` | One per component. Follows a consistent template: name, description, also-known-as, semantic output, elements list, default wireframe SVG, config table, variation wireframes, collection layout (if applicable), usage notes. |

---

### Task 1: Project Scaffolding & Base Styles

**Files:**
- Create: `index.html`
- Create: `css/pico.classless.min.css`
- Create: `css/site.css`
- Create: `js/main.js`
- Create: `components/` (empty directory)

**Interfaces:**
- Consumes: nothing (first task)
- Produces: Base HTML template structure, CSS custom properties, JS hover-label utility function `initHoverLabels()`, component page template pattern

- [x] **Step 1: Download Pico CSS classless**

```bash
mkdir -p css js components
curl -o css/pico.classless.min.css "https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css"
```

Verify: file exists and is ~40-55KB.

- [x] **Step 2: Create `css/site.css` with custom properties and wireframe styles**

```css
/* === Custom Properties === */
:root {
  --wireframe-bg: #f0f0f0;
  --wireframe-media: #cccccc;
  --wireframe-border: #999999;
  --wireframe-interactive: #4a90d9;
  --wireframe-optional: #999999;
  --wireframe-text-line: #bbb;
  --wireframe-label-bg: #333;
  --wireframe-label-text: #fff;
  --wireframe-label-font: 'Courier New', monospace;
  --nav-max-width: 1200px;
}

/* === Wireframe SVG Base === */
.wireframe-container {
  position: relative;
  margin: 1.5rem 0;
}

.wireframe-container svg {
  width: 100%;
  height: auto;
  border: 1px solid var(--wireframe-border);
  border-radius: 4px;
  background: #fff;
}

/* Content region fills */
.wireframe-container svg .region {
  fill: var(--wireframe-bg);
  stroke: var(--wireframe-border);
  stroke-width: 1;
}

/* Media/image placeholders */
.wireframe-container svg .media-placeholder {
  fill: var(--wireframe-media);
  stroke: var(--wireframe-border);
  stroke-width: 1;
}

/* Interactive elements (buttons, links) */
.wireframe-container svg .interactive {
  fill: none;
  stroke: var(--wireframe-interactive);
  stroke-width: 2;
}

/* Optional elements */
.wireframe-container svg .optional {
  fill: none;
  stroke: var(--wireframe-optional);
  stroke-width: 1;
  stroke-dasharray: 4 2;
}

/* Text placeholder lines */
.wireframe-container svg .text-line {
  stroke: var(--wireframe-text-line);
  stroke-width: 2;
  stroke-linecap: round;
}

/* === Hover Labels === */
.wireframe-container svg .label-group {
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.wireframe-container svg .hover-target:hover + .label-group,
.wireframe-container svg .hover-target:focus + .label-group,
.wireframe-container svg .label-group.visible {
  opacity: 1;
}

.wireframe-container svg .label-bg {
  fill: var(--wireframe-label-bg);
  rx: 3;
  ry: 3;
}

.wireframe-container svg .label-text {
  fill: var(--wireframe-label-text);
  font-family: var(--wireframe-label-font);
  font-size: 11px;
}

.wireframe-container svg .label-line {
  stroke: var(--wireframe-label-bg);
  stroke-width: 1;
  stroke-dasharray: 2 2;
}

/* === Component Grid (Index Page) === */
.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  list-style: none;
  padding: 0;
}

.component-grid li {
  border: 1px solid var(--wireframe-border);
  border-radius: 8px;
  padding: 1rem;
  transition: box-shadow 0.2s ease;
}

.component-grid li:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.component-grid li a {
  text-decoration: none;
}

.component-grid li svg {
  width: 100%;
  height: 80px;
  margin-bottom: 0.5rem;
}

/* === Variation Grid === */
.variation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.variation-grid figure {
  margin: 0;
  text-align: center;
}

.variation-grid figcaption {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}

/* === Config Table === */
table .affects-layout {
  color: var(--wireframe-interactive);
  font-weight: 600;
}

/* === Navigation Overrides === */
body > header nav {
  max-width: var(--nav-max-width);
  margin: 0 auto;
}

/* === Category Headings === */
.category-heading {
  margin-top: 3rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--wireframe-border);
}

/* === Prev/Next Navigation === */
.component-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid var(--wireframe-border);
}
```

- [x] **Step 3: Create `js/main.js` with hover label utility and category filter**

```javascript
/**
 * Initialize hover labels for touch devices (tap to toggle).
 * On desktop, CSS :hover handles it. On touch, we toggle a .visible class.
 */
function initHoverLabels() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) return;

  document.querySelectorAll('.wireframe-container svg .hover-target').forEach(target => {
    target.addEventListener('click', (e) => {
      e.preventDefault();
      const labelGroup = target.nextElementSibling;
      if (labelGroup && labelGroup.classList.contains('label-group')) {
        labelGroup.classList.toggle('visible');
      }
    });
  });
}

/**
 * Category filter for the index page component grid.
 */
function initCategoryFilter() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  if (!filterButtons.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-filter');

      filterButtons.forEach(b => b.removeAttribute('aria-current'));
      button.setAttribute('aria-current', 'true');

      document.querySelectorAll('[data-category]').forEach(section => {
        if (category === 'all' || section.getAttribute('data-category') === category) {
          section.style.display = '';
        } else {
          section.style.display = 'none';
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHoverLabels();
  initCategoryFilter();
});
```

- [x] **Step 4: Create `index.html` with base structure**

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>component-vocab</title>
  <link rel="stylesheet" href="./css/pico.classless.min.css">
  <link rel="stylesheet" href="./css/site.css">
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><strong>component-vocab</strong></li>
      </ul>
      <ul>
        <li><a href="#components">Components</a></li>
        <li><a href="#comparison">Comparison</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="intro">
      <h1>component-vocab</h1>
      <p>A framework-agnostic website component naming system with 50 components organized into two tiers: <strong>Structural</strong> (HTML-semantic layout primitives) and <strong>Content</strong> (functional UI patterns). Each component is documented with wireframes, configuration options, and cross-system name mappings.</p>
      <p>Names align with HTML semantics for structural components and draw from established design systems (Bootstrap, Material Design, Ant Design, Apple HIG, shadcn) for content components.</p>
    </section>

    <section id="components">
      <h2>Components</h2>
      <nav>
        <ul>
          <li><a href="#" data-filter="all" aria-current="true">All</a></li>
          <li><a href="#" data-filter="layout">Layout</a></li>
          <li><a href="#" data-filter="hero-banners">Hero &amp; Banners</a></li>
          <li><a href="#" data-filter="content-display">Content Display</a></li>
          <li><a href="#" data-filter="text-lists">Text &amp; Lists</a></li>
          <li><a href="#" data-filter="navigation">Navigation</a></li>
          <li><a href="#" data-filter="calls-to-action">Calls to Action</a></li>
          <li><a href="#" data-filter="forms-feedback">Forms &amp; Feedback</a></li>
          <li><a href="#" data-filter="overlays-menus">Overlays &amp; Menus</a></li>
          <li><a href="#" data-filter="indicators-status">Indicators &amp; Status</a></li>
          <li><a href="#" data-filter="interactive">Interactive</a></li>
          <li><a href="#" data-filter="utility">Utility</a></li>
        </ul>
      </nav>

      <!-- Component cards will be added in Task 3 -->
    </section>

    <section id="comparison">
      <h2>Cross-System Comparison</h2>
      <!-- Comparison table will be added in Task 4 -->
    </section>
  </main>

  <footer>
    <p>component-vocab &mdash; A framework-agnostic reference for website components.</p>
  </footer>

  <script src="./js/main.js"></script>
</body>
</html>
```

- [x] **Step 5: Verify the page opens from file system**

Open `index.html` directly in a browser (double-click or `file://` URL). Verify:
- Pico CSS styles are applied (typography, spacing, nav styling)
- Custom CSS loads (check that `.component-grid` styles exist in devtools)
- JS loads without errors (check console)
- Category filter buttons respond to clicks (even though grid is empty)

- [x] **Step 6: Commit**

```bash
git init
git add index.html css/ js/
git commit -m "feat: scaffold project with Pico CSS, site styles, and JS utilities"
```

---

### Task 2: Component Page Template

**Files:**
- Create: `components/_template.html` (reference template, not served)
- Create: `components/hero.html` (first real component as proof of concept)

**Interfaces:**
- Consumes: CSS from `css/site.css` (wireframe classes, hover labels, variation grid, component-nav)
- Produces: Established page template pattern that all other component pages will follow

- [x] **Step 1: Create the component page template**

Create `components/_template.html`:

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{COMPONENT_NAME}} — component-vocab</title>
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
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <ul>
        <li><a href="../index.html">Home</a></li>
        <li><a href="../index.html#{{CATEGORY_ANCHOR}}">{{CATEGORY_NAME}}</a></li>
        <li>{{COMPONENT_NAME}}</li>
      </ul>
    </nav>

    <!-- Component Header -->
    <section>
      <h1>{{COMPONENT_NAME}}</h1>
      <p>{{FUNCTIONAL_DESCRIPTION}}</p>

      <dl>
        <dt>Also known as</dt>
        <dd>{{ALSO_KNOWN_AS — or "No direct equivalent in major systems"}}</dd>
        <dt>Semantic element</dt>
        <dd><code>{{HTML_ELEMENT}}</code></dd>
        <dt>Category</dt>
        <dd>{{CATEGORY_NAME}}</dd>
      </dl>
    </section>

    <!-- Elements -->
    <section>
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
          <!-- {{ELEMENTS_ROWS}} -->
        </tbody>
      </table>
    </section>

    <!-- Default Wireframe -->
    <section>
      <h2>Default Layout</h2>
      <div class="wireframe-container">
        <!-- {{DEFAULT_WIREFRAME_SVG}} -->
      </div>
    </section>

    <!-- Configuration Options -->
    <section>
      <h2>Configuration Options</h2>
      <h3>Universal</h3>
      <table>
        <thead>
          <tr>
            <th>Config</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Background</td><td>Color, Image, Gradient, None</td></tr>
          <tr><td>Spacing</td><td>Compact, Default, Spacious</td></tr>
          <tr><td>Width</td><td>Contained, Full-width</td></tr>
          <tr><td>Alignment</td><td>Left, Center, Right</td></tr>
          <tr><td>Theme</td><td>Light, Dark</td></tr>
        </tbody>
      </table>

      <h3>Component-Specific</h3>
      <table>
        <thead>
          <tr>
            <th>Config</th>
            <th>Options</th>
            <th>Affects Layout</th>
          </tr>
        </thead>
        <tbody>
          <!-- {{CONFIG_ROWS}} -->
        </tbody>
      </table>
    </section>

    <!-- Layout Variations -->
    <section>
      <h2>Layout Variations</h2>
      <div class="variation-grid">
        <!-- {{VARIATION_WIREFRAMES}} -->
      </div>
    </section>

    <!-- Collection Layout (if applicable) -->
    <!-- {{COLLECTION_SECTION}} -->

    <!-- Usage Notes -->
    <section>
      <h2>Usage Notes</h2>
      <!-- {{USAGE_NOTES}} -->
    </section>

    <!-- Prev/Next Nav -->
    <nav class="component-nav">
      <a href="{{PREV_COMPONENT}}.html">&larr; {{PREV_NAME}}</a>
      <a href="{{NEXT_COMPONENT}}.html">{{NEXT_NAME}} &rarr;</a>
    </nav>
  </main>

  <footer>
    <p>component-vocab &mdash; A framework-agnostic reference for website components.</p>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
```

- [x] **Step 2: Create `components/hero.html` — the first real component page**

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hero — component-vocab</title>
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
        <li><a href="../index.html#hero-banners">Hero &amp; Banners</a></li>
        <li>Hero</li>
      </ul>
    </nav>

    <section>
      <h1>Hero</h1>
      <p>A large introductory area typically placed at the top of a page. Contains a prominent headline, supporting text, and one or more calls to action. Sets the tone and primary message for the page content that follows.</p>

      <dl>
        <dt>Also known as</dt>
        <dd>Jumbotron (Bootstrap, deprecated), Hero header, Hero banner, Landing section</dd>
        <dt>Semantic element</dt>
        <dd><code>&lt;section&gt;</code></dd>
        <dt>Category</dt>
        <dd>Hero &amp; Banners</dd>
      </dl>
    </section>

    <section>
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
          <tr><td>Heading</td><td>Yes</td><td>Primary headline text</td></tr>
          <tr><td>Subheading</td><td>No</td><td>Supporting text beneath the heading</td></tr>
          <tr><td>Button (primary)</td><td>No</td><td>Primary call-to-action</td></tr>
          <tr><td>Button (secondary)</td><td>No</td><td>Secondary/alternative action</td></tr>
          <tr><td>Image</td><td>No</td><td>Hero image (background or beside content)</td></tr>
          <tr><td>Background</td><td>No</td><td>Background color, gradient, or image</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Default Layout</h2>
      <div class="wireframe-container">
        <svg viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg">
          <!-- Background -->
          <rect class="region" x="0" y="0" width="800" height="350" />

          <!-- Heading -->
          <rect class="hover-target" x="200" y="80" width="400" height="30" fill="none" stroke="none" style="cursor:pointer" />
          <g class="label-group">
            <line class="label-line" x1="400" y1="70" x2="400" y2="50" />
            <rect class="label-bg" x="355" y="34" width="90" height="20" />
            <text class="label-text" x="400" y="48" text-anchor="middle">Heading</text>
          </g>
          <line class="text-line" x1="200" y1="95" x2="600" y2="95" />

          <!-- Subheading -->
          <rect class="hover-target" x="250" y="130" width="300" height="20" fill="none" stroke="none" style="cursor:pointer" />
          <g class="label-group">
            <line class="label-line" x1="400" y1="125" x2="400" y2="110" />
            <rect class="label-bg" x="347" y="94" width="106" height="20" />
            <text class="label-text" x="400" y="108" text-anchor="middle">Subheading</text>
          </g>
          <line class="text-line" x1="250" y1="140" x2="550" y2="140" />
          <line class="text-line" x1="300" y1="155" x2="500" y2="155" />

          <!-- Primary Button -->
          <rect class="hover-target" x="310" y="200" width="180" height="45" fill="none" stroke="none" style="cursor:pointer" />
          <g class="label-group">
            <line class="label-line" x1="400" y1="250" x2="400" y2="270" />
            <rect class="label-bg" x="340" y="272" width="120" height="20" />
            <text class="label-text" x="400" y="286" text-anchor="middle">Button (primary)</text>
          </g>
          <rect class="interactive" x="310" y="200" width="180" height="45" rx="4" />
          <line class="text-line" x1="355" y1="222" x2="445" y2="222" />
        </svg>
      </div>
    </section>

    <section>
      <h2>Configuration Options</h2>
      <h3>Universal</h3>
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

      <h3>Component-Specific</h3>
      <table>
        <thead>
          <tr><th>Config</th><th>Options</th><th>Affects Layout</th></tr>
        </thead>
        <tbody>
          <tr><td>Layout</td><td>Centered, Split Left, Split Right</td><td class="affects-layout">Yes</td></tr>
          <tr><td>Media</td><td>None, Background Image, Side Image, Video</td><td class="affects-layout">Yes</td></tr>
          <tr><td>Content density</td><td>Minimal (heading + CTA), Full (heading + subtext + CTA + secondary)</td><td class="affects-layout">Yes</td></tr>
          <tr><td>Overlay</td><td>None, Dark scrim, Light scrim</td><td>No</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Layout Variations</h2>
      <div class="variation-grid">
        <figure>
          <div class="wireframe-container">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <rect class="region" x="0" y="0" width="400" height="200" />
              <line class="text-line" x1="100" y1="60" x2="300" y2="60" />
              <line class="text-line" x1="130" y1="80" x2="270" y2="80" />
              <rect class="interactive" x="155" y="120" width="90" height="30" rx="4" />
            </svg>
          </div>
          <figcaption>Centered — minimal content</figcaption>
        </figure>

        <figure>
          <div class="wireframe-container">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <rect class="region" x="0" y="0" width="400" height="200" />
              <!-- Left content -->
              <line class="text-line" x1="20" y1="50" x2="170" y2="50" />
              <line class="text-line" x1="20" y1="70" x2="150" y2="70" />
              <line class="text-line" x1="20" y1="90" x2="160" y2="90" />
              <rect class="interactive" x="20" y="120" width="80" height="30" rx="4" />
              <!-- Right image -->
              <rect class="media-placeholder" x="210" y="20" width="170" height="160" rx="4" />
            </svg>
          </div>
          <figcaption>Split Left — content left, image right</figcaption>
        </figure>

        <figure>
          <div class="wireframe-container">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <rect class="region" x="0" y="0" width="400" height="200" />
              <!-- Left image -->
              <rect class="media-placeholder" x="20" y="20" width="170" height="160" rx="4" />
              <!-- Right content -->
              <line class="text-line" x1="220" y1="50" x2="380" y2="50" />
              <line class="text-line" x1="220" y1="70" x2="360" y2="70" />
              <line class="text-line" x1="220" y1="90" x2="370" y2="90" />
              <rect class="interactive" x="220" y="120" width="80" height="30" rx="4" />
            </svg>
          </div>
          <figcaption>Split Right — image left, content right</figcaption>
        </figure>

        <figure>
          <div class="wireframe-container">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <rect class="media-placeholder" x="0" y="0" width="400" height="200" />
              <rect x="0" y="0" width="400" height="200" fill="rgba(0,0,0,0.4)" />
              <line x1="100" y1="60" x2="300" y2="60" stroke="#fff" stroke-width="2" />
              <line x1="130" y1="80" x2="270" y2="80" stroke="#fff" stroke-width="2" />
              <rect class="interactive" x="155" y="120" width="90" height="30" rx="4" style="stroke:#fff" />
            </svg>
          </div>
          <figcaption>Background Image — with dark overlay</figcaption>
        </figure>
      </div>
    </section>

    <section>
      <h2>Usage Notes</h2>
      <ul>
        <li>Use Hero as the first content component on a page, inside a <code>&lt;section&gt;</code>.</li>
        <li>Limit to one Hero per page. For secondary promotional areas lower on the page, use <strong>CTA</strong> instead.</li>
        <li>When using a background image, always provide an overlay or ensure text contrast meets WCAG AA.</li>
        <li>The "Split" layouts work best with a side image or illustration, not a background image.</li>
      </ul>
    </section>

    <nav class="component-nav">
      <a href="grid.html">&larr; Grid</a>
      <a href="banner.html">Banner &rarr;</a>
    </nav>
  </main>

  <footer>
    <p>component-vocab &mdash; A framework-agnostic reference for website components.</p>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
```

- [x] **Step 3: Verify the Hero page**

Open `components/hero.html` in a browser. Verify:
- Pico CSS styles apply (relative path `../css/` works)
- Wireframe SVGs render correctly
- Hovering over regions in the default wireframe shows labels
- Variation grid displays wireframes in a responsive grid
- Breadcrumb links work (back to index)
- Previous/Next links are present

- [x] **Step 4: Commit**

```bash
git add components/
git commit -m "feat: add component page template and Hero as first component"
```

---

### Task 3: All 50 Component Pages

**Files:**
- Create: `components/container.html` through `components/divider.html` (49 remaining pages, following the template from Task 2)

**Interfaces:**
- Consumes: Template pattern from `components/_template.html`, CSS classes from `css/site.css`
- Produces: 50 complete component pages with wireframes, configs, and cross-system mappings

This is the largest task. Each component page requires:
1. Functional description paragraph
2. "Also known as" line (from the cross-system comparison table in the spec)
3. Elements table (required vs. optional sub-elements)
4. Default wireframe SVG with hover labels
5. Config table (universal + specific)
6. Layout variation wireframes (only for configs that affect layout)
7. Collection layout wireframe (if applicable)
8. Usage notes
9. Prev/Next navigation links

**Implementation order — by category group, to maintain momentum and ensure consistent wireframe style:**

**Batch 1: Structural (7)**
container, section, header, footer, aside, article, grid

**Batch 2: Hero & Banners (2)**
hero (done), banner

**Batch 3: Content Display (16)**
card, feature, media, figure, embed, profile, testimonial, stat, showcase, comparison, timeline, logo-cloud, marquee, mosaic, callout, snapshot

**Batch 4: Text & Lists (5)**
prose, list, table, accordion, tabs

**Batch 5: Navigation (3)**
nav, breadcrumb, pagination

**Batch 6: Calls to Action (2)**
cta, pricing

**Batch 7: Forms & Feedback (4)**
form, modal, alert, toast

**Batch 8: Overlays & Menus (3)**
tooltip, popover, drawer

**Batch 9: Indicators & Status (4)**
badge, skeleton, progress, spinner

**Batch 10: Interactive + Utility (4)**
dropdown, carousel, avatar, divider

- [x] **Step 1: Build each batch of component pages**

For each component page, follow this checklist:
- Copy the template structure from `_template.html`
- Fill in component name, description, also-known-as, semantic element, category
- Write the elements table (identify 3-8 sub-elements per component)
- Create default wireframe SVG (use consistent 800x350 viewBox for full-width, 800x250 for compact)
- Add hover-target regions + label-groups for each element
- Write config table (copy universal configs, add 2-5 specific configs)
- Create variation wireframes (smaller: 400x200 viewBox) for each layout-affecting config
- If the component has a collection mode, add a collection wireframe showing 2-4 items
- Write 2-4 bullet usage notes
- Set prev/next links to adjacent components in the full list order

Each batch should be committed separately:

```bash
git add components/container.html components/section.html components/header.html components/footer.html components/aside.html components/article.html components/grid.html
git commit -m "feat: add structural component pages (Container, Section, Header, Footer, Aside, Article, Grid)"
```

- [x] **Step 2: Verify wireframe consistency across pages**

Spot-check 5-6 pages from different categories:
- SVG viewBox dimensions are consistent within categories
- Hover labels appear and disappear correctly
- Variation grids render responsively
- All breadcrumb and prev/next links work
- No broken relative paths

- [x] **Step 3: Final commit for remaining batches**

```bash
git add components/
git commit -m "feat: complete all 50 component detail pages"
```

---

### Task 4: Index Page — Component Grid & Comparison Table

**Files:**
- Modify: `index.html` (add component grid cards and full comparison table)

**Interfaces:**
- Consumes: All 50 component pages in `components/` (for linking), category filter JS from `main.js`
- Produces: Complete index page with navigable grid and full 50-row comparison table

- [x] **Step 1: Add component grid to index.html**

Replace the `<!-- Component cards will be added in Task 3 -->` comment with the full component grid. Each category gets a `data-category` wrapper and each component gets a card with a thumbnail wireframe:

```html
<div data-category="layout">
  <h3 class="category-heading">Layout</h3>
  <ul class="component-grid">
    <li>
      <a href="./components/container.html">
        <svg viewBox="0 0 250 80" xmlns="http://www.w3.org/2000/svg">
          <rect class="region" x="25" y="10" width="200" height="60" rx="2" />
          <line class="text-line" x1="50" y1="40" x2="200" y2="40" />
        </svg>
        <strong>Container</strong>
        <small>Constrains content to a max-width, centers horizontally</small>
      </a>
    </li>
    <!-- ... remaining layout components ... -->
  </ul>
</div>

<div data-category="hero-banners">
  <h3 class="category-heading">Hero &amp; Banners</h3>
  <ul class="component-grid">
    <li>
      <a href="./components/hero.html">
        <svg viewBox="0 0 250 80" xmlns="http://www.w3.org/2000/svg">
          <rect class="region" x="0" y="0" width="250" height="80" />
          <line class="text-line" x1="60" y1="25" x2="190" y2="25" />
          <line class="text-line" x1="80" y1="40" x2="170" y2="40" />
          <rect class="interactive" x="90" y="52" width="70" height="18" rx="3" />
        </svg>
        <strong>Hero</strong>
        <small>Large intro area — headline, subtext, CTA</small>
      </a>
    </li>
    <!-- ... remaining hero & banner components ... -->
  </ul>
</div>

<!-- ... repeat for all categories ... -->
```

Each of the 12 categories gets its own `data-category` div. All 50 components get a card.

- [x] **Step 2: Add the full comparison table**

Replace `<!-- Comparison table will be added in Task 4 -->` with the complete 50-row table:

```html
<div style="overflow-x: auto;">
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Bootstrap</th>
        <th>Material Design</th>
        <th>Ant Design</th>
        <th>Apple HIG</th>
        <th>shadcn</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><a href="./components/container.html">Container</a></td><td>Container</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
      <tr><td><a href="./components/section.html">Section</a></td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
      <tr><td><a href="./components/header.html">Header</a></td><td>Navbar (partial)</td><td>Top App Bar</td><td>Layout Header</td><td>Navigation Bar</td><td>—</td></tr>
      <!-- ... all 50 rows ... -->
      <tr><td><a href="./components/divider.html">Divider</a></td><td>—</td><td>Divider</td><td>Divider</td><td>—</td><td>Separator</td></tr>
    </tbody>
  </table>
</div>
```

All 50 components must have a row. Use "—" where no equivalent exists. Reference the spec's comparison section for mappings.

- [x] **Step 3: Verify index page**

Open `index.html` in browser. Verify:
- All 50 component cards render in the grid
- Category filter buttons show/hide correct groups
- Thumbnail wireframes render in the cards
- All links navigate to the correct component page
- Comparison table scrolls horizontally on mobile
- Table links navigate to component pages

- [x] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: complete index page with component grid and comparison table"
```

---

### Task 5: Polish & Cross-Linking

**Files:**
- Modify: `css/site.css` (responsive tweaks, print styles)
- Modify: `js/main.js` (smooth scroll for anchor links)
- Modify: `index.html` (add legend explaining wireframe conventions)
- Verify: all 50 component pages (prev/next links, breadcrumbs)

**Interfaces:**
- Consumes: All files from Tasks 1-4
- Produces: Final polished, cross-linked documentation site

- [x] **Step 1: Add wireframe legend to index page**

After the intro section, before the component grid, add:

```html
<section>
  <h2>Wireframe Legend</h2>
  <div class="wireframe-container">
    <svg viewBox="0 0 800 120" xmlns="http://www.w3.org/2000/svg">
      <!-- Content region -->
      <rect class="region" x="10" y="10" width="120" height="40" />
      <text x="70" y="65" text-anchor="middle" font-size="11" fill="#666">Content region</text>

      <!-- Media placeholder -->
      <rect class="media-placeholder" x="160" y="10" width="120" height="40" />
      <text x="220" y="65" text-anchor="middle" font-size="11" fill="#666">Media/Image</text>

      <!-- Interactive -->
      <rect class="interactive" x="310" y="10" width="120" height="40" rx="4" />
      <text x="370" y="65" text-anchor="middle" font-size="11" fill="#666">Interactive</text>

      <!-- Optional -->
      <rect class="optional" x="460" y="10" width="120" height="40" />
      <text x="520" y="65" text-anchor="middle" font-size="11" fill="#666">Optional</text>

      <!-- Text lines -->
      <line class="text-line" x1="620" y1="20" x2="770" y2="20" />
      <line class="text-line" x1="620" y1="35" x2="740" y2="35" />
      <text x="695" y="65" text-anchor="middle" font-size="11" fill="#666">Text content</text>
    </svg>
  </div>
  <p><small>Hover over wireframe elements to see their labels. On touch devices, tap to reveal.</small></p>
</section>
```

- [x] **Step 2: Add responsive tweaks to site.css**

Append to `css/site.css`:

```css
/* === Responsive === */
@media (max-width: 768px) {
  .component-grid {
    grid-template-columns: 1fr;
  }

  .variation-grid {
    grid-template-columns: 1fr;
  }

  .component-nav {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

/* === Print === */
@media print {
  .wireframe-container svg .label-group {
    opacity: 1;
  }

  nav, .component-nav {
    display: none;
  }
}
```

- [x] **Step 3: Add smooth scroll to main.js**

Append to `js/main.js`:

```javascript
/**
 * Smooth scroll for same-page anchor links.
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
});
```

Note: merge this with the existing DOMContentLoaded listener — don't create a duplicate.

- [x] **Step 4: Verify all prev/next links across component pages**

Manually check or script-verify that:
- Every component page's prev/next links point to valid `.html` files
- The first component (Container) has no "previous" link (or links to index)
- The last component (Divider) has no "next" link (or links to index)
- Breadcrumb category anchors match the `data-category` values on the index page

- [x] **Step 5: Final browser test**

Open from filesystem. Walk through:
- Index page loads, grid shows all 50 components
- Category filter works
- Click into 3-4 component pages from different categories
- Hover labels work on wireframes
- Prev/next navigation chains work
- Comparison table is scrollable and links work
- Responsive layout works at mobile widths (resize browser)
- Print preview shows labels visible, nav hidden

- [x] **Step 6: Commit**

```bash
git add css/site.css js/main.js index.html
git commit -m "feat: polish with responsive styles, smooth scroll, wireframe legend, and print support"
```

---

## Summary

| Task | Deliverable | Estimated Effort |
|------|-------------|-----------------|
| 1 | Project scaffolding, base styles, JS utilities | 15 min |
| 2 | Component page template + Hero proof of concept | 20 min |
| 3 | All 50 component pages with wireframes | 3-4 hours |
| 4 | Index page grid + comparison table | 45 min |
| 5 | Polish, cross-linking, responsive, print | 30 min |

Task 3 is by far the largest — it's 50 pages each with custom SVG wireframes. The template from Task 2 makes this mechanical but time-consuming. Consider parallelizing by category batch.
