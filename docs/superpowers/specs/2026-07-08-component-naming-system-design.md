# component-vocab — Design Spec

**Date:** 2026-07-08
**Status:** Historical (superseded 2026-11-19)

> **Historical document.** This is the original 50-component design. The vocabulary was reworked from `docs/research/` (see `docs/reconciliation.md` and `README.md`): names, groups and the comparison table changed, and pages are now generated from `data/`. Kept for the record; do not use it as the current spec.

---

## Overview

A framework-agnostic website component naming system with 50 components, organized into two tiers (Structural + Content), aligned with HTML semantics. Accompanied by a standalone static documentation site with schematic wireframes showing component anatomy, configurations, and cross-system name mappings.

### Goals

1. **Shared vocabulary** — team uses consistent names when scoping website projects
2. **Cross-system Rosetta Stone** — maps to Bootstrap, Material Design, Ant Design, Apple HIG, and shadcn
3. **Development specification** — names become actual component names in code

### Audience

- Primary: internal team reference
- Secondary: client-presentable documentation

---

## Naming System Architecture

### Two-Tier Hybrid Approach

- **Tier 1: Structural Components** — named after HTML semantic elements. Define the page skeleton (width, spacing, landmarks).
- **Tier 2: Content Components** — named by function. Live inside structural components. Documented with their expected semantic wrapper.

### Naming Conventions

- Structural components map 1:1 to HTML semantic elements (`Section` → `<section>`, `Aside` → `<aside>`)
- Content components use familiar, descriptive names aligned with other design systems where possible
- Collection parents use a natural name when one exists (Gallery, Timeline, Logo Cloud) or fall back to `[Component] List` (Card List, Feature List, Profile List)
- Items document their collection layout as a **configuration**, not a separate component entry

### Composition Pattern

Components can be nested. A `Card` lives inside a `Card List`. The collection is a configuration of the item component, shown as a layout variation wireframe on the same documentation page.

---

## Complete Component List (50)

### Tier 1: Structural (7)

| # | Name | HTML Element | Functional Description |
|---|------|---|---|
| 1 | Container | `<div>` | Constrains content to a max-width, centers horizontally |
| 2 | Section | `<section>` | Thematic full-width page block |
| 3 | Header | `<header>` | Site header with branding and navigation |
| 4 | Footer | `<footer>` | Site footer with links, legal, contact |
| 5 | Aside | `<aside>` | Sidebar or complementary content |
| 6 | Article | `<article>` | Self-contained distributable content |
| 7 | Grid | `<div>` | Multi-column layout system |

### Tier 2: Content — Hero & Banners (2)

| # | Name | Functional Description |
|---|------|---|
| 8 | Hero | Large intro area — headline, subtext, CTA |
| 9 | Banner | Narrow high-visibility strip for announcements |

### Tier 2: Content — Content Display (16)

| # | Name | Functional Description | Collection Name |
|---|------|---|---|
| 10 | Card | Preview of content — image, title, excerpt, link | Card List |
| 11 | Feature | Single feature/benefit — icon, heading, description | Feature List |
| 12 | Media | Image/video paired with adjacent text | — |
| 13 | Figure | Image/illustration with caption | Gallery |
| 14 | Embed | Third-party content embedded inline | — |
| 15 | Profile | Person — photo, name, role, bio | Profile List |
| 16 | Testimonial | Quote/review attributed to a person | Testimonial List |
| 17 | Stat | Single key metric displayed prominently | Stats |
| 18 | Showcase | Focused presentation of a single product/project | — |
| 19 | Comparison | Side-by-side comparison of items | — |
| 20 | Timeline | Chronological sequence of events/milestones | *(is the collection)* |
| 21 | Logo Cloud | Row/grid of partner/client logos | *(is the collection)* |
| 22 | Marquee | Horizontally scrolling content strip | *(is the collection)* |
| 23 | Mosaic | Asymmetric mixed-size content layout | *(is the collection)* |
| 24 | Callout | Visually distinct block — tip, note, pull-quote | — |
| 25 | Snapshot | Compact key-value summary block | — |

### Tier 2: Content — Text & Lists (5)

| # | Name | Functional Description |
|---|------|---|
| 26 | Prose | Long-form rich text content |
| 27 | List | Structured list of items — features, steps |
| 28 | Table | Tabular data display |
| 29 | Accordion | Expandable/collapsible content panels |
| 30 | Tabs | Switchable tabbed content panels |

### Tier 2: Content — Navigation (3)

| # | Name | Functional Description |
|---|------|---|
| 31 | Nav | Primary navigation menu |
| 32 | Breadcrumb | Hierarchical location trail |
| 33 | Pagination | Page-by-page navigation |

### Tier 2: Content — Calls to Action (2)

| # | Name | Functional Description |
|---|------|---|
| 34 | CTA | Prominent call-to-action block |
| 35 | Pricing | Pricing plans/tiers for comparison |

### Tier 2: Content — Forms & Feedback (4)

| # | Name | Functional Description |
|---|------|---|
| 36 | Form | Data collection — contact, signup, search |
| 37 | Modal | Overlay dialog requiring action |
| 38 | Alert | Inline feedback message |
| 39 | Toast | Temporary non-blocking notification |

### Tier 2: Content — Overlays & Menus (3)

| # | Name | Functional Description |
|---|------|---|
| 40 | Tooltip | Contextual hint appearing on hover/focus |
| 41 | Popover | Floating panel of rich content triggered by click |
| 42 | Drawer | Panel sliding in from a screen edge |

### Tier 2: Content — Indicators & Status (4)

| # | Name | Functional Description |
|---|------|---|
| 43 | Badge | Small indicator (count, status dot, "new") attached to an element |
| 44 | Skeleton | Placeholder loading state mimicking content shape |
| 45 | Progress | Visual indicator of task/process completion (bar, ring) |
| 46 | Spinner | Generic loading/processing animation |

### Tier 2: Content — Interactive (3)

| # | Name | Functional Description |
|---|------|---|
| 47 | Dropdown | Menu of actions or links revealed from a trigger |
| 48 | Carousel | Paginated slideshow cycling through content |
| 49 | Avatar | Small identity image for attribution, comments, lists |

### Tier 2: Content — Utility (1)

| # | Name | Functional Description |
|---|------|---|
| 50 | Divider | Visual separator between content sections |

---

## Configuration System

### Universal Configuration Options

Apply broadly across many components. Documented once on the index page, referenced per-component.

| Config | Description | Values |
|---|---|---|
| Background | Surface treatment | Color, Image, Gradient, None |
| Spacing | Vertical padding | Compact, Default, Spacious |
| Width | Horizontal extent | Contained (max-width), Full-width |
| Alignment | Horizontal content alignment | Left, Center, Right |
| Theme | Light/dark treatment | Light, Dark |

### Component-Specific Configurations

Each component documents its own config options in a table with three columns: **Config**, **Options**, and **Affects Layout?**

Only configurations marked "Affects Layout: Yes" get a wireframe variation. Others are documented as text only.

### Example: Hero

| Config | Options | Affects Layout? |
|---|---|---|
| Layout | Centered, Split Left, Split Right | Yes |
| Media | None, Background Image, Side Image, Video | Yes |
| Content density | Minimal (heading + CTA), Full (heading + subtext + CTA + secondary link) | Yes |
| Overlay | None, Dark scrim, Light scrim | No |

### Example: Card

| Config | Options | Affects Layout? |
|---|---|---|
| Orientation | Vertical (image top), Horizontal (image side) | Yes |
| Image | Shown, Hidden | Yes |
| Collection layout | Grid (2-4 columns), List (single column), Carousel | Yes |
| Link style | Entire card clickable, Button only | No |

### Example: Feature

| Config | Options | Affects Layout? |
|---|---|---|
| Icon position | Top, Left | Yes |
| Collection layout | Grid (2-4 columns), Single column | Yes |
| Content density | Icon + heading only, Icon + heading + description | Yes |

### Example: Media

| Config | Options | Affects Layout? |
|---|---|---|
| Media position | Left, Right | Yes |
| Media size | Equal (50/50), Media dominant, Text dominant | Yes |
| Media type | Image, Video, Illustration | No |

### Example: Profile

| Config | Options | Affects Layout? |
|---|---|---|
| Layout | Vertical (photo top), Horizontal (photo side) | Yes |
| Photo shape | Circle, Square, Rounded | No |
| Content density | Minimal (photo + name + role), Full (+ bio + links) | Yes |
| Collection layout | Grid, List, Carousel | Yes |

### Example: Accordion

| Config | Options | Affects Layout? |
|---|---|---|
| Behavior | Single open, Multiple open | No |
| Icon | Chevron, Plus/minus, None | No |
| Borders | Divided, Contained (boxed), Flush | Yes |

---

## Cross-System Comparison

### Master Table (on index page)

Maps every component to its closest equivalent in five systems. Uses these conventions:

- **Exact match** — same concept, same or similar name
- **(partial)** — other system's component covers some but not all of the same use case
- **(composed)** — requires combining multiple components in that system
- **(deprecated)** — other system has renamed or removed the equivalent
- **—** — no direct equivalent

### Per-Component "Also Known As"

Each component detail page includes an inline list:

> **Also known as:** Jumbotron (Bootstrap, deprecated), Hero header (common usage)

Only shows systems where a match exists — no "—" entries on individual pages.

### Representative Mappings (Implementation must include all 50 components)

| This System | Bootstrap | Material Design | Ant Design | Apple HIG | shadcn |
|---|---|---|---|---|---|
| Hero | Jumbotron (deprecated) | — | — | — | — |
| Card | Card | Card | Card | — | Card |
| Accordion | Accordion | Expansion Panel | Collapse | Disclosure Group | Accordion |
| Modal | Modal | Dialog | Modal | Sheet / Alert | Dialog |
| Alert | Alert | Snackbar (partial) | Alert | Inline Alert | Alert |
| Toast | Toast | Snackbar | Message | Banner (partial) | Toast / Sonner |
| Tabs | Nav Tabs | Tabs | Tabs | Segmented Control (partial) | Tabs |
| Nav | Navbar | Navigation Drawer / Top App Bar | Menu | Tab Bar / Sidebar | Navigation Menu |
| Breadcrumb | Breadcrumb | — | Breadcrumb | — | Breadcrumb |
| Pagination | Pagination | — | Pagination | — | Pagination |
| Form | Form | Text Field / Select (individual) | Form | Form | Form |
| Table | Table | Data Table | Table | — | Table |
| Tooltip | Tooltip | Tooltip | Tooltip | — | Tooltip |
| Popover | Popover | Menu (partial) | Popover | Popover | Popover |
| Drawer | Offcanvas | Side Sheet | Drawer | Sheet | Sheet / Drawer |
| Badge | Badge | Badge | Badge | Badge | Badge |
| Carousel | Carousel | Carousel | Carousel | — | Carousel |
| Skeleton | Placeholder | — | Skeleton | Redacted | Skeleton |
| Progress | Progress | Linear/Circular Progress | Progress | Progress View | Progress |
| Spinner | Spinner | Circular Progress (indeterminate) | Spin | Activity Indicator | Spinner |
| Dropdown | Dropdown | Menu | Dropdown | Menu | Dropdown Menu |
| Avatar | — | — | Avatar | — | Avatar |
| Banner | Alert (partial) | Banner | Alert (partial) | — | — |
| Profile | — | — | Avatar + Card (composed) | — | Avatar + Card (composed) |
| Pricing | — | — | — | — | — |
| Stats | — | — | Statistic | — | — |
| CTA | — | — | — | — | — |
| Feature | — | — | — | — | — |
| Testimonial | — | — | — | — | — |
| Logo Cloud | — | — | — | — | — |

---

## Documentation Site

### Technology Stack

| Concern | Choice | Rationale |
|---|---|---|
| CSS framework | Pico CSS | Classless, semantic HTML-driven, polished without class names, works from `file://` |
| Wireframes | Inline SVG | Scalable, styleable with CSS, supports hover labels, no external images |
| Interactivity | Vanilla JS | Hover labels, category filtering — no build step, no dependencies |
| Cross-linking | Relative paths | All `href="./components/card.html"` — works from `file://` |

### File Structure

```
/
├── index.html                  # Overview: component grid + master comparison table
├── components/
│   ├── container.html
│   ├── ...                     # One page per component (50 files)
│   └── divider.html
├── css/
│   ├── pico.classless.min.css  # Pico CSS v2, classless build
│   └── site.css                # Wireframe rendering, hover labels, layout
└── js/
    └── main.js                 # Hover labels, filtering
```

*Corrected 2026-11-19 to match what was built (the original listed `pico.min.css`, `wireframes.css` and an `assets/` folder). Superseded by the generated structure described in `README.md`.*

### Index Page (`index.html`)

1. **Title & introduction** — what the system is, how to use it
2. **Component grid** — visual cards linking to each component page, grouped by category. Each card: name, tiny thumbnail wireframe, one-line functional description
3. **Master comparison table** — full cross-system mapping with all 50 components

### Component Detail Page (e.g., `components/card.html`)

1. **Component name + functional description** — one paragraph
2. **Also known as** — equivalent names in other systems
3. **Semantic output** — which HTML element(s) it renders
4. **Elements** — sub-elements (heading, text, image, button, etc.), marked required vs. optional
5. **Default wireframe** — large SVG with hover labels showing element annotations
6. **Configuration options** — table (universal + specific)
7. **Layout variations** — grid of smaller wireframes for each layout-affecting config
8. **Collection layout** (if applicable) — wireframe showing multiple items arranged together
9. **Usage notes** — when to use this vs. similar components, nesting expectations

### Wireframe Visual Style

- Light gray (`#f0f0f0`) filled rectangles for content regions
- Darker gray (`#ccc`) for image/media placeholders
- Dashed borders for optional elements
- Horizontal lines for text placeholders (classic wireframe "lorem" lines)
- Labels: monospace font, hidden by default, shown on `:hover` with leader line
- Color coding: blue border = interactive (button, link), gray = content, dashed = optional

### Navigation

- Every page: top nav with link back to index, previous/next component links
- Index page: anchor links to each category group
- Component pages: breadcrumb (`Home > [Category] > [Component]`)

---

## Extensibility

### Adding a New Component

1. Pick a descriptive name (use natural language, check cross-system equivalents)
2. Declare its semantic parent HTML element
3. Write a one-line functional description
4. Document elements (required vs. optional)
5. Define configuration options (mark which affect layout)
6. Create wireframe SVGs (default + layout-affecting variations)
7. Add one row to the master comparison table
8. Add one "Also known as" line if applicable
9. Place the new `.html` file in `components/` and add it to the index grid

### Adding a New Category

Add a new heading group on the index page. No structural changes needed to the site.

### Growth Areas (not yet included, room to expand)

- Data Visualization (Chart, Gauge, Meter)
- Commerce (Product Card, Cart, Checkout Steps)
- Communication (Chat Bubble, Comment Thread, Notification Feed)
- Content Management (Tree View, File Browser, Tag Cloud)

---

## Out of Scope

These are deliberately excluded from this system as they are too granular (atomic UI primitives) or are elements within existing components rather than standalone patterns:

- **Buttons, Toggles, Switches, Inputs** — elements within Form, CTA, Card, etc.
- **Date Picker, Color Picker, Upload** — specialized Form configurations
- **Steps/Stepper** — configuration of Progress or Timeline
- **Empty State** — configuration applicable to any collection component
- **Tag** — close to Badge; could be a Badge configuration
- **Search Bar** — configuration of Form
- **Sidebar** — configuration of Aside + Nav combined
