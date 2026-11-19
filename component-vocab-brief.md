# component-vocab: Repository Brief

Read-only survey of `C:\Dev\Sandbox\component-vocab`, 2026-11-19, written for the session that will produce the change plan. Facts come from reading files directly. Anything marked **(inferred)** was not confirmed by running it.

**Summary**
- **What it is:** a static HTML docs site for a 50-component website naming vocabulary.
- **Stack:** hand-written HTML, Pico CSS (classless), inline SVG, vanilla JS. No build step, no npm.
- **Source of truth:** none. Component data is duplicated by hand across 51 HTML files and 2 docs.
- **Coverage:** all 50 components have a detail page, an index grid card and a comparison-table row.

**Changes since the first survey**
- The project name changed from "Component Naming System" to `component-vocab` in all 51 HTML files and the headings of both docs.
- The plan's old path `C:\Dev\Personal\ComponentNames\` now reads `C:\Dev\Sandbox\component-vocab\`.
- The remote `origin` = `https://github.com/cjsharp1/component-vocab.git` was added locally. It has no refs, so nothing has been pushed.
- None of this is committed.

---

## 1. Purpose and scope

**There is no README.** The stated purpose comes from the design spec, `docs/superpowers/specs/2026-07-08-component-naming-system-design.md`:

> "A framework-agnostic website component naming system with 50 components, organized into two tiers (Structural + Content), aligned with HTML semantics. Accompanied by a standalone static documentation site with schematic wireframes showing component anatomy, configurations, and cross-system name mappings."

> ### Goals
> 1. **Shared vocabulary** — team uses consistent names when scoping website projects
> 2. **Cross-system Rosetta Stone** — maps to Bootstrap, Material Design, Ant Design, Apple HIG, and shadcn
> 3. **Development specification** — names become actual component names in code
>
> - Primary: internal team reference
> - Secondary: client-presentable documentation

The site's own intro (`index.html:26`):

> "A framework-agnostic website component naming system with 50 components organized into two tiers: **Structural** (HTML-semantic layout primitives) and **Content** (functional UI patterns). Each component is documented with wireframes, configuration options, and cross-system name mappings."

The spec excludes Buttons/Toggles/Inputs, Date and Color Picker, Upload, Stepper, Empty State, Tag, Search Bar and Sidebar. It lists Data Viz, Commerce, Communication and Content Management as future growth areas.

## 2. Structure

```
.
├── .claude/settings.local.json
├── .playwright-mcp/                      (untracked)
│   ├── console-2026-07-08T15-26-15-871Z.log
│   └── page-2026-07-08T15-26-17-872Z.yml
├── .superpowers/sdd/progress.md          (modified, uncommitted)
├── components/                           (51 files)
│   ├── _template.html
│   └── accordion.html … tooltip.html     (50 component pages)
├── css/
│   ├── pico.classless.min.css
│   └── site.css
├── docs/superpowers/
│   ├── plans/2026-07-08-component-naming-system.md
│   └── specs/2026-07-08-component-naming-system-design.md
├── component-vocab-brief.md              (this file)
├── index.html
└── js/main.js
```

| Path | Purpose |
|---|---|
| `index.html` | Entry page (about 47 KB): intro, wireframe legend, category filter, component grid (50 cards), cross-system comparison table (50 rows) |
| `components/` | One hand-written page per component, plus `_template.html` with `{{PLACEHOLDER}}` tokens |
| `css/pico.classless.min.css` | Vendored Pico CSS, classless build. The plan says v2; the file doesn't state a version. |
| `css/site.css` | Wireframe SVG classes, hover labels, grid layouts, responsive and print rules |
| `js/main.js` | Touch toggle for hover labels, category filter, smooth scroll for anchor links |
| `docs/superpowers/` | Design spec and 5-task implementation plan, produced through the "superpowers" agent workflow |
| `.superpowers/sdd/progress.md` | Agent task ledger; ends "ALL TASKS COMPLETE." |
| `.claude/settings.local.json` | Local Claude Code permissions |
| `.playwright-mcp/` | Leftover browser logs from fetching `m3.material.io/sitemap.xml` (probably name research). Not project content. |

## 3. Tooling

- **Languages:** HTML5, CSS, vanilla JS. Wireframes are inline SVG.
- **Package manager, build, test, lint:** none. Plan: "Vanilla JS only — no frameworks, no build tools, no npm" and "All pages must work when opened from `file://`".
- **Static site generator:** none. All 50 pages were written by an agent from `_template.html`; the ledger calls this "mechanical transcription".
- **Publishing:** none set up. `origin` points at `github.com/cjsharp1/component-vocab` but is empty. There is no `.github/`, no CI and no GitHub Pages config. Because the site needs no build and uses only relative links, Pages could serve it straight from the repo root **(inferred)**.

## 4. Components

**Storage:** there is no data file (no JSON, YAML or markdown list). The list exists only as hand-written HTML, repeated in several places (§7). The spec's markdown tables are the closest thing to a source of truth.

**Count: 50.** Pages, index grid cards and comparison rows all match. Names exactly as shown, in index grid order (also the prev/next order), grouped by `data-category` slug:

| Slug | Components |
|---|---|
| `layout` | Container, Section, Header, Footer, Aside, Article, Grid |
| `hero-banners` | Hero, Banner |
| `content-display` | Card, Feature, Media, Figure, Embed, Profile, Testimonial, Stat, Showcase, Comparison, Timeline, Logo Cloud, Marquee, Mosaic, Callout, Snapshot |
| `text-lists` | Prose, List, Table, Accordion, Tabs |
| `navigation` | Nav, Breadcrumb, Pagination |
| `calls-to-action` | CTA, Pricing |
| `forms-feedback` | Form, Modal, Alert, Toast |
| `overlays-menus` | Tooltip, Popover, Drawer |
| `indicators-status` | Badge, Skeleton, Progress, Spinner |
| `interactive` | Dropdown, Carousel, Avatar |
| `utility` | Divider |

File names are lowercase kebab-case, e.g. `logo-cloud.html`, `cta.html`. The two complete files below are copied from disk as they are now, after the rename.

### Simplest: `components/section.html` (178 lines)

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Section — component-vocab</title>
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
        <li><a href="../index.html#layout">Layout</a></li>
        <li>Section</li>
      </ul>
    </nav>

    <section>
      <h1>Section</h1>
      <p>A thematic grouping of content that forms a distinct part of a page. Typically spans full width and contains one or more content components within a Container.</p>

      <dl>
        <dt>Also known as</dt>
        <dd>—</dd>
        <dt>Semantic element</dt>
        <dd><code>&lt;section&gt;</code></dd>
        <dt>Category</dt>
        <dd>Layout</dd>
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
          <tr><td>Heading</td><td>No</td><td>Section title (h2-h3)</td></tr>
          <tr><td>Content</td><td>Yes</td><td>Any child content</td></tr>
          <tr><td>Background</td><td>No</td><td>Background color, image, or gradient</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Default Layout</h2>
      <div class="wireframe-container">
        <svg viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg">
          <!-- Section background -->
          <rect class="region" x="0" y="0" width="800" height="350" />

          <!-- Heading -->
          <rect class="hover-target" x="50" y="40" width="180" height="24" fill="none" stroke="none" style="cursor:pointer" />
          <g class="label-group">
            <line class="label-line" x1="140" y1="35" x2="140" y2="15" />
            <rect class="label-bg" x="95" y="-1" width="90" height="20" />
            <text class="label-text" x="140" y="13" text-anchor="middle">Heading</text>
          </g>
          <line class="text-line" x1="50" y1="52" x2="230" y2="52" />

          <!-- Content area -->
          <rect class="hover-target" x="50" y="100" width="700" height="200" fill="none" stroke="none" style="cursor:pointer" />
          <g class="label-group">
            <line class="label-line" x1="400" y1="310" x2="400" y2="330" />
            <rect class="label-bg" x="360" y="332" width="80" height="20" />
            <text class="label-text" x="400" y="346" text-anchor="middle">Content</text>
          </g>
          <rect class="region" x="50" y="100" width="700" height="200" rx="4" stroke="#999" stroke-width="2" stroke-dasharray="8,4" fill="none" />
          <line class="text-line" x1="80" y1="130" x2="720" y2="130" />
          <line class="text-line" x1="80" y1="150" x2="680" y2="150" />
          <line class="text-line" x1="80" y1="170" x2="700" y2="170" />
          <line class="text-line" x1="80" y1="210" x2="710" y2="210" />
          <line class="text-line" x1="80" y1="230" x2="670" y2="230" />
          <line class="text-line" x1="80" y1="250" x2="690" y2="250" />
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
          <tr><td>Padding</td><td>Compact, Default, Spacious</td><td class="affects-layout">Yes</td></tr>
          <tr><td>Background</td><td>Color, Image, Gradient, None</td><td>No</td></tr>
          <tr><td>Border</td><td>None, Top, Bottom, Both</td><td>No</td></tr>
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
              <line class="text-line" x1="20" y1="25" x2="120" y2="25" />
              <line class="text-line" x1="20" y1="55" x2="380" y2="55" />
              <line class="text-line" x1="20" y1="75" x2="360" y2="75" />
              <line class="text-line" x1="20" y1="95" x2="370" y2="95" />
            </svg>
          </div>
          <figcaption>Compact — reduced padding</figcaption>
        </figure>

        <figure>
          <div class="wireframe-container">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <rect class="region" x="0" y="0" width="400" height="200" />
              <line class="text-line" x1="20" y1="50" x2="120" y2="50" />
              <line class="text-line" x1="20" y1="85" x2="380" y2="85" />
              <line class="text-line" x1="20" y1="105" x2="360" y2="105" />
              <line class="text-line" x1="20" y1="125" x2="370" y2="125" />
            </svg>
          </div>
          <figcaption>Spacious — increased padding</figcaption>
        </figure>
      </div>
    </section>

    <section>
      <h2>Usage Notes</h2>
      <ul>
        <li>Every major page block should be wrapped in a Section.</li>
        <li>Use with Container inside for centered content.</li>
        <li>Add an id attribute for anchor link navigation.</li>
      </ul>
    </section>

    <nav class="component-nav">
      <a href="container.html">&larr; Container</a>
      <a href="header.html">Header &rarr;</a>
    </nav>
  </main>

  <footer>
    <p>component-vocab &mdash; A framework-agnostic reference for website components.</p>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
```

### Most complex: `components/card.html` (277 lines, the largest page)

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Card — component-vocab</title>
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
        <li><a href="../index.html#content-display">Content Display</a></li>
        <li>Card</li>
      </ul>
    </nav>

    <section>
      <h1>Card</h1>
      <p>A contained preview of a piece of content. Presents an image, title, excerpt, and link as a clickable unit that leads to full content elsewhere.</p>

      <dl>
        <dt>Also known as</dt>
        <dd>Card (Bootstrap), Card (Material), Card (Ant), — (Apple), Card (shadcn)</dd>
        <dt>Semantic element</dt>
        <dd><code>&lt;article&gt;</code> or <code>&lt;div&gt;</code></dd>
        <dt>Category</dt>
        <dd>Content Display</dd>
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
          <tr><td>Image</td><td>No</td><td>Preview image or thumbnail</td></tr>
          <tr><td>Title</td><td>Yes</td><td>Content title/heading</td></tr>
          <tr><td>Excerpt</td><td>No</td><td>Short preview text</td></tr>
          <tr><td>Link/Button</td><td>No</td><td>Action to view full content</td></tr>
          <tr><td>Metadata</td><td>No</td><td>Date, author, category tag</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Default Layout</h2>
      <div class="wireframe-container">
        <svg viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg">
          <!-- Card border -->
          <rect class="region" x="250" y="20" width="300" height="310" rx="8" />

          <!-- Image -->
          <rect class="hover-target" x="250" y="20" width="300" height="150" fill="none" stroke="none" style="cursor:pointer" />
          <g class="label-group">
            <line class="label-line" x1="400" y1="90" x2="400" y2="70" />
            <rect class="label-bg" x="365" y="54" width="70" height="20" />
            <text class="label-text" x="400" y="68" text-anchor="middle">Image</text>
          </g>
          <rect class="media-placeholder optional" x="250" y="20" width="300" height="150" rx="8 8 0 0" />

          <!-- Title -->
          <rect class="hover-target" x="270" y="190" width="260" height="20" fill="none" stroke="none" style="cursor:pointer" />
          <g class="label-group">
            <line class="label-line" x1="400" y1="185" x2="400" y2="165" />
            <rect class="label-bg" x="374" y="149" width="52" height="20" />
            <text class="label-text" x="400" y="163" text-anchor="middle">Title</text>
          </g>
          <line class="text-line" x1="270" y1="200" x2="500" y2="200" />

          <!-- Excerpt -->
          <rect class="hover-target" x="270" y="220" width="260" height="40" fill="none" stroke="none" style="cursor:pointer" />
          <g class="label-group">
            <line class="label-line" x1="320" y1="265" x2="320" y2="285" />
            <rect class="label-bg" x="283" y="287" width="74" height="20" />
            <text class="label-text" x="320" y="301" text-anchor="middle">Excerpt</text>
          </g>
          <line class="text-line" x1="270" y1="230" x2="520" y2="230" />
          <line class="text-line" x1="270" y1="245" x2="490" y2="245" />

          <!-- Metadata -->
          <rect class="hover-target" x="270" y="275" width="150" height="15" fill="none" stroke="none" style="cursor:pointer" />
          <g class="label-group">
            <line class="label-line" x1="345" y1="270" x2="345" y2="250" />
            <rect class="label-bg" x="301" y="234" width="88" height="20" />
            <text class="label-text" x="345" y="248" text-anchor="middle">Metadata</text>
          </g>
          <line class="text-line" x1="270" y1="285" x2="380" y2="285" stroke-width="1" opacity="0.6" />

          <!-- Link/Button -->
          <rect class="hover-target" x="270" y="300" width="80" height="25" fill="none" stroke="none" style="cursor:pointer" />
          <g class="label-group">
            <line class="label-line" x1="310" y1="330" x2="310" y2="350" />
            <rect class="label-bg" x="262" y="352" width="96" height="20" />
            <text class="label-text" x="310" y="366" text-anchor="middle">Link/Button</text>
          </g>
          <rect class="interactive optional" x="270" y="300" width="80" height="25" rx="4" />
          <line class="text-line" x1="288" y="312" x2="332" y2="312" />
        </svg>
      </div>
    </section>

    <section>
      <h2>Card List Layout</h2>
      <div class="wireframe-container">
        <svg viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg">
          <!-- Card 1 -->
          <rect class="region" x="30" y="30" width="230" height="290" rx="8" />
          <rect class="media-placeholder" x="30" y="30" width="230" height="120" rx="8 8 0 0" />
          <line class="text-line" x1="45" y1="170" x2="230" y2="170" />
          <line class="text-line" x1="45" y1="190" x2="240" y2="190" />
          <line class="text-line" x1="45" y1="205" x2="210" y2="205" />
          <line class="text-line" x1="45" y1="235" x2="130" y2="235" stroke-width="1" opacity="0.6" />
          <rect class="interactive" x="45" y="260" width="70" height="22" rx="4" />

          <!-- Card 2 -->
          <rect class="region" x="285" y="30" width="230" height="290" rx="8" />
          <rect class="media-placeholder" x="285" y="30" width="230" height="120" rx="8 8 0 0" />
          <line class="text-line" x1="300" y1="170" x2="485" y2="170" />
          <line class="text-line" x1="300" y1="190" x2="495" y2="190" />
          <line class="text-line" x1="300" y1="205" x2="465" y2="205" />
          <line class="text-line" x1="300" y1="235" x2="385" y2="235" stroke-width="1" opacity="0.6" />
          <rect class="interactive" x="300" y="260" width="70" height="22" rx="4" />

          <!-- Card 3 -->
          <rect class="region" x="540" y="30" width="230" height="290" rx="8" />
          <rect class="media-placeholder" x="540" y="30" width="230" height="120" rx="8 8 0 0" />
          <line class="text-line" x1="555" y1="170" x2="740" y2="170" />
          <line class="text-line" x1="555" y1="190" x2="750" y2="190" />
          <line class="text-line" x1="555" y1="205" x2="720" y2="205" />
          <line class="text-line" x1="555" y1="235" x2="640" y2="235" stroke-width="1" opacity="0.6" />
          <rect class="interactive" x="555" y="260" width="70" height="22" rx="4" />
        </svg>
      </div>
      <p><em>Card List — 3-column grid layout</em></p>
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
          <tr><td>Orientation</td><td>Vertical (image top), Horizontal (image side)</td><td class="affects-layout">Yes</td></tr>
          <tr><td>Image</td><td>Shown, Hidden</td><td class="affects-layout">Yes</td></tr>
          <tr><td>Collection layout</td><td>Grid (2-col, 3-col, 4-col), List, Carousel</td><td class="affects-layout">Yes</td></tr>
          <tr><td>Link style</td><td>Entire card clickable, Button only</td><td>No</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Layout Variations</h2>
      <div class="variation-grid">
        <figure>
          <div class="wireframe-container">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <rect class="region" x="80" y="20" width="240" height="160" rx="8" />
              <rect class="media-placeholder" x="80" y="20" width="240" height="80" rx="8 8 0 0" />
              <line class="text-line" x1="95" y1="115" x2="280" y2="115" />
              <line class="text-line" x1="95" y1="130" x2="295" y2="130" />
              <line class="text-line" x1="95" y1="145" x2="260" y2="145" />
              <rect class="interactive" x="95" y="160" width="60" height="18" rx="4" />
            </svg>
          </div>
          <figcaption>Vertical — image on top</figcaption>
        </figure>

        <figure>
          <div class="wireframe-container">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <rect class="region" x="40" y="40" width="320" height="120" rx="8" />
              <rect class="media-placeholder" x="40" y="40" width="120" height="120" rx="8 0 0 8" />
              <line class="text-line" x1="175" y1="60" x2="330" y2="60" />
              <line class="text-line" x1="175" y1="80" x2="340" y2="80" />
              <line class="text-line" x1="175" y1="95" x2="310" y2="95" />
              <rect class="interactive" x="175" y="125" width="60" height="18" rx="4" />
            </svg>
          </div>
          <figcaption>Horizontal — image on left</figcaption>
        </figure>

        <figure>
          <div class="wireframe-container">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <rect class="region" x="80" y="20" width="240" height="160" rx="8" />
              <line class="text-line" x1="95" y1="45" x2="280" y2="45" />
              <line class="text-line" x1="95" y1="65" x2="295" y2="65" />
              <line class="text-line" x1="95" y1="80" x2="260" y2="80" />
              <line class="text-line" x1="95" y1="95" x2="285" y2="95" />
              <line class="text-line" x1="95" y1="125" x2="180" y2="125" stroke-width="1" opacity="0.6" />
              <rect class="interactive" x="95" y="150" width="60" height="18" rx="4" />
            </svg>
          </div>
          <figcaption>No image — text only</figcaption>
        </figure>

        <figure>
          <div class="wireframe-container">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <rect class="region" x="20" y="30" width="360" height="60" rx="8" />
              <rect class="media-placeholder" x="20" y="30" width="60" height="60" rx="8 0 0 8" />
              <line class="text-line" x1="95" y1="45" x2="220" y2="45" />
              <line class="text-line" x1="95" y1="60" x2="260" y2="60" />
              <line class="text-line" x1="95" y1="75" x2="240" y2="75" />
              <rect class="interactive" x="300" y="52" width="60" height="18" rx="4" />
              <rect class="region" x="20" y="110" width="360" height="60" rx="8" />
              <rect class="media-placeholder" x="20" y="110" width="60" height="60" rx="8 0 0 8" />
              <line class="text-line" x1="95" y1="125" x2="220" y2="125" />
              <line class="text-line" x1="95" y1="140" x2="260" y2="140" />
              <line class="text-line" x1="95" y1="155" x2="240" y2="155" />
              <rect class="interactive" x="300" y="132" width="60" height="18" rx="4" />
            </svg>
          </div>
          <figcaption>List — horizontal, stacked</figcaption>
        </figure>
      </div>
    </section>

    <section>
      <h2>Usage Notes</h2>
      <ul>
        <li>Use Card for teasers that link elsewhere. For in-place content, use Feature. For people, use Profile.</li>
        <li>When the entire card is clickable, ensure the hit area is clear with hover states.</li>
        <li>Maintain consistent card heights in grid layouts by setting a max-height or line clamp on excerpts.</li>
        <li>For image-less cards, consider using a subtle border or shadow to define card boundaries.</li>
      </ul>
    </section>

    <nav class="component-nav">
      <a href="banner.html">&larr; Banner</a>
      <a href="feature.html">Feature &rarr;</a>
    </nav>
  </main>

  <footer>
    <p>component-vocab &mdash; A framework-agnostic reference for website components.</p>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
```

## 5. Per-component detail pages

**All 50 exist.** Their structure is consistent because each was transcribed from `_template.html`:

- **Header block:** `<h1>` name, one description `<p>`, and a `<dl>` with *Also known as*, *Semantic element* and *Category*.
- **`<h2>` sections**, identical on all 50 pages: `Elements` (Element / Required / Description) → `Default Layout` (one 800-wide SVG with hover labels) → `Configuration Options` (a Universal table with the same five rows on every page, then Component-Specific: Config / Options / Affects Layout) → `Layout Variations` (grid of 400×200 SVG figures) → `Usage Notes` (list).
- **Optional collection section** on 6 pages: Card ("Card List Layout"), Feature ("Feature List Layout"), Figure ("Gallery Layout"), Profile ("Profile List Layout"), Stat ("Stats Layout"), Testimonial ("Testimonial List Layout").
- **Prev/next nav:** the chain is correct across all 50. Container's "prev" and Divider's "next" go to `../index.html`.

The "Also known as" value is the main ad-hoc field (see §9).

## 6. Wireframes

- **Format:** inline `<svg>` in each page. There are no image files, no `assets/` folder and no Figma links.
- **Visual vocabulary** (classes in `css/site.css`): `.region`, `.media-placeholder`, `.interactive` (blue), `.optional` (dashed), `.text-line`. Each `.hover-target` rectangle is followed by a `<g class="label-group">` that CSS shows through `.hover-target:hover + .label-group`. `main.js` toggles it on tap for touch devices.
- **Sizes:** default layout `viewBox="0 0 800 350"`, variations `0 0 400 200`, index thumbnails `0 0 250 80` (simpler drawings without labels).
- **Legend:** the `#legend` section of `index.html`.
- **Repetition:** every drawing is hand-written with literal coordinates. There are no shared symbols, `<use>` or includes.

## 7. Data and duplication

Nothing is generated. Each fact below is typed by hand in every place listed.

| Fact | Where it is stated |
|---|---|
| Component name | Spec tables; index grid `<strong>`; index comparison row; each page's `<title>`, breadcrumb and `<h1>`; prev/next link text on neighbouring pages |
| One-line description | Spec tables; index grid `<small>`. Pages use a longer, differently worded paragraph. |
| Category | Spec headings; index filter nav, `data-category` and `<h3>`; each page's breadcrumb (text and `#anchor`) and Category `<dd>` |
| Aliases (cross-system names) | Spec "Representative Mappings" (about 30 rows); index comparison table (50 rows); each page's "Also known as" `<dd>` |
| Semantic HTML element | Spec Tier 1 table (structural only); each page's `<dd>` |
| Universal config table | Spec; `_template.html`; copied into all 50 pages |
| Component-specific config | Spec examples (Hero, Card, Feature, Media, Profile, Accordion); each page |
| Ordering | Index grid order; the prev/next chain written into each page |
| Site name `component-vocab` | `<title>`, header nav and footer of all 51 HTML files; `index.html` `<h1>`; spec and plan H1s |

**(inferred)** The pages were produced once by an agent following the template and plan, and nothing can regenerate them.

## 8. Conventions

- **Naming:** lowercase kebab-case files (`logo-cloud.html`) and category slugs (`calls-to-action`).
- **Template:** `components/_template.html`, with tokens like `{{COMPONENT_NAME}}`, `{{CATEGORY_ANCHOR}}`, `{{ALSO_KNOWN_AS — or "No direct equivalent in major systems"}}`, `{{ELEMENTS_ROWS}}`.
- **Agent instruction files:** none. No `CLAUDE.md`, `.cursorrules`, `AGENTS.md`, CONTRIBUTING, style guide or schema exists.

**Plan's global constraints (verbatim):**

> - All pages must work when opened from `file://` (no absolute paths, no fetch calls, relative links only)
> - Pico CSS classless variant (`pico.classless.min.css`) — no CSS classes for base styling
> - Wireframes are inline SVG, not external images
> - Vanilla JS only — no frameworks, no build tools, no npm
> - Hover labels use CSS `:hover` with minimal JS fallback for touch devices
> - File paths use lowercase-kebab-case (`card.html`, `logo-cloud.html`)
> - All cross-links use relative paths (`../index.html`, `./card.html`)

The plan's header also says: "REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development … or superpowers:executing-plans".

**Spec, "Adding a New Component":** nine manual steps. Pick a name, declare the semantic element, write a one-line description, document elements, define configs, draw the SVGs, add a comparison row, add an "Also known as" line, then add the page to the index grid.

**`.claude/settings.local.json` (verbatim):**

```json
{
  "permissions": {
    "allow": [
      "Bash(curl *)",
      "Bash(git add *)",
      "Bash(git commit *)"
    ]
  }
}
```

## 9. Gaps and inconsistencies

### Broken behaviour

1. **All 50 breadcrumb category links miss.** Pages link to `../index.html#layout`, `#content-display` and so on, but the index only has `id`s for `intro`, `legend`, `components` and `comparison`. Category blocks use `data-category` with no `id`, so the links land at the top of the index.
2. **(inferred) Filter clicks probably throw.** Filter links are `href="#"`, and `initSmoothScroll` binds every `a[href^="#"]` and calls `document.querySelector('#')`, which is an invalid selector and throws. Filtering still works because its handler runs first, but `preventDefault` is never reached, so the page probably jumps to the top on each click.
3. **8 malformed SVG lines** use `x`/`y` instead of `x1`/`y1`, so they start at (0,0): `banner.html:98`, `card.html:117`, `cta.html:99` and `:103`, `form.html:104`, `hero.html:100`, `media.html:106`, `showcase.html:116`.
4. **28 hover-label boxes sit outside their viewBox** and get clipped, in 18 files: accordion, alert, article, aside, avatar, banner, card, container, drawer, feature, footer, grid, list, pricing, prose, section, table, tabs. For example, `section.html` has `label-bg y="-1"` and `y="332" height="20"` in a 350-high viewBox.
5. `js/main.js` doesn't highlight the active nav item, which the plan's file table says it should.

### Data disagreements

6. **"Also known as" uses several formats**, and most pages break the spec rule "Only shows systems where a match exists — no '—' entries":
   - Matches only: Container, Header, Footer, Aside, Grid, Hero, Tabs, Toast, and the all-five-match pages Accordion, Nav, Form, Modal, Alert, Popover, Drawer, Badge, Progress, Spinner, Dropdown.
   - Every system listed, with `— (Apple)` placeholders: Card, Banner, Media, Figure, Embed, Profile, Stat, Timeline, Callout, Snapshot, Prose, List, Table, Breadcrumb, Pagination, Tooltip, Skeleton, Carousel, Avatar, Divider.
   - Free text: Feature, Testimonial, Showcase, Comparison, Logo Cloud, Marquee, Mosaic, CTA, Pricing, e.g. "— (no direct equivalent; CSS Grid pattern)".
   - Just "—": Section, Article.
7. **Pages and the comparison table disagree.**
   - Prose: the page says "Typography (Bootstrap), — (Material)"; the table has Bootstrap "—" and Material "Typography".
   - Figure and Embed: the table's Bootstrap column says "Figure" and "Embed"; the pages say "— (Bootstrap)" and credit "HTML standard".
   - Hero: the page adds "Hero header, Hero banner, Landing section", which the table has no column for.
8. **Tier naming.** The spec and index intro say "Structural"; every category label on the site says "Layout" (slug `layout`).
9. **Collection naming.** The spec calls Stat's collection "Stats"; the page heading is "Stats Layout"; the spec's mapping table has a row named "Stats" rather than "Stat".
10. **Section order.** The template and spec put the collection section after Layout Variations; all 6 pages that have one put it right after Default Layout.

### Out of date

11. The spec's file structure lists `css/pico.min.css`, `css/wireframes.css` and `assets/`; the repo has `pico.classless.min.css` and `site.css` and no `assets/`. The spec's status is still "Draft".
12. Every plan checkbox is still `- [ ]`, but the ledger says "ALL TASKS COMPLETE."
13. *(Resolved)* The old name and old plan path have been replaced. The spec and plan **filenames** still contain `component-naming-system`; I left them alone because they describe the spec's subject. The spec's prose phrase "website component naming system" (lowercase, descriptive) also stays.

### Housekeeping

14. No README.
15. `.playwright-mcp/` is untracked scratch output.
16. The completed progress ledger, the rename and this brief are all uncommitted.
17. Local branch is `master`; the expected main branch is `main`. The new remote is empty, so the branch name can still be chosen before the first push.
18. No TODO/FIXME markers, and no leftover `{{…}}` tokens outside `_template.html`.

## 10. Git state

- **Branch:** `master` (only local branch).
- **Remote:** `origin` → `https://github.com/cjsharp1/component-vocab.git`, added 2026-11-19. `git ls-remote` returns no refs, so nothing has been pushed.
- **Working tree is not clean:**
  - 55 tracked files are modified: the rename across 51 HTML files and 2 docs, plus `.superpowers/sdd/progress.md`.
  - Untracked: `.playwright-mcp/` and this brief.
  - Nothing is committed.

**Last 10 commits:**

| Commit | Subject |
|---|---|
| `3a40ca0` | feat: polish with responsive styles, smooth scroll, wireframe legend, and print support |
| `ad7dc42` | feat: complete index page with component grid and comparison table |
| `f32bc2c` | feat: add Interactive & Utility component pages (Dropdown, Carousel, Avatar, Divider) |
| `f88dd7d` | feat: add Indicators & Status component pages (Badge, Skeleton, Progress, Spinner) |
| `53eb732` | feat: add Overlays & Menus component pages (Tooltip, Popover, Drawer) |
| `65a8368` | feat: add Forms & Feedback component pages (Form, Modal, Alert, Toast) |
| `71bd209` | feat: add Calls to Action component pages (CTA, Pricing) |
| `aa9421f` | feat: add Navigation component pages (Nav, Breadcrumb, Pagination) |
| `9aaa8e3` | feat: add Text & Lists component pages (Prose, List, Table, Accordion, Tabs) |
| `8600e5d` | feat: add Content Display component pages (Card, Feature, Media, Figure, Embed, Profile, Testimonial, Stat, Showcase, Comparison, Timeline, Logo Cloud, Marquee, Mosaic, Callout, Snapshot) |
