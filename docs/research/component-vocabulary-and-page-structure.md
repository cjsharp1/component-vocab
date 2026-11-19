# Component Vocabulary & Page Structure

CMS-agnostic reference. Goal: one list of component names that (1) matches what most design systems already call things, (2) doesn't contradict native HTML, and (3) holds up for accessibility. Where those three disagree, this doc says which one won and why.

**Contents:** 1 Method · 2 Layout structure review · 3 Revised structure and block list · 4 Consensus component list · 5 Naming collisions, resolved · 6 Gap vocabulary (coined names for patterns nobody has named) · 7 Sources

---

## 1. Method

Three lenses, in this order of authority when they conflict:

1. **Native HTML.** If a native element exists, the component name must not contradict it (`<dialog>`, `<details>`, `<nav>`, `<progress>`, `<meter>`).
2. **Accessibility patterns.** The W3C ARIA Authoring Practices Guide (APG) lists 30 patterns. Where APG names a behavior, that name is used for the behavior.
3. **Consensus.** The Component Gallery index lists 60 components with the aliases they go by across design systems. Example counts below are the numbers shown on that index when I pulled it.

**Tiebreak rules**

| # | Rule | Example |
|---|------|---------|
| R1 | Name the thing, not its look or behavior | Dialog, not Popup |
| R2 | When consensus is split, prefer the native/APG name. When there is no native/APG name, prefer consensus | Dialog (HTML, APG) over Modal (more common) |
| R3 | One name, one behavior. If a word means two things in the wild, split it or retire it | Stepper, Grid, Menu, Banner |
| R4 | Words native HTML/ARIA already claim stay reserved for them | Banner = landmark, Label = `<label>`, Menu = `role=menu`, Slider = range input |
| R5 | Name the semantic unit, not a part | Radio group, not Radio button |
| R6 | Variants are modifiers, not new nouns | Dialog + modal, Button + primary |
| R7 | Coin a new name only if it passes the gap test (Part 6) | |

---

## 2. Review of the proposed layout structure

Proposed: Page > Section > Container > Grid > Column > [content blocks].

| Question | Verdict |
|---|---|
| 1. Is Container a separate block? | Not as an editor-facing block. The wrapper is real, but it is a render detail of Section. It only earns a block if your block model can't let a child choose a width track |
| 2. Is Column worth being its own block? | In the data model, yes. In the editor, no: make it a slot owned by the Grid, not something editors add and remove freely |
| 3. Does the hierarchy over-nest? | As written, yes: five levels to reach content. Remove Container, collapse slots in the UI, cap depth, and validate on the server, not just in the picker |

### Q1. Container

**What holds up.** Something has to exist inside Section. A background must span the viewport while text stays within a readable measure, and one element can't do both unless the cap is applied via padding or an inner box.

**Where the reasoning is weak.** "Container as a DOM wrapper" and "Container as an editor block" are different questions. Section already has a width-mode option, and that option is Container's only setting. Two blocks controlling one concept means editors answer the same question twice, and it allows impossible states (a "full-width" Section containing a Container capped at 1200px: which wins?).

**A sharper alternative: no wrapper at all.** Give Section a grid with named tracks. Children land in the content track by default and can opt into the full-bleed track:

```css
.section {
  display: grid;
  grid-template-columns:
    [full-start] minmax(var(--gutter), 1fr)
    [content-start] min(var(--content-max), 100% - 2 * var(--gutter))
    [content-end] minmax(var(--gutter), 1fr) [full-end];
}
.section > *      { grid-column: content; }
.section > .bleed { grid-column: full; }
```

The Section element itself spans the viewport (so the background bleeds), and an image can break out of the text measure without splitting the Section in two. A `wide` track can be added the same way. This is the same idea WordPress core uses with its content/wide/full alignments.

**This also challenges your second principle.** "Content blocks never control their own width" is right about *absolute* widths and wrong about *tracks*. A block shouldn't set `800px`. It can choose among named tracks that the parent defines (narrow / content / wide / full). Without that, a text-then-wide-image-then-text article needs three Sections.

**When Container earns its place.** Only if your CMS's block model can't carry layout props on a child (children can't say which track they want). Then a layout block must do that job, and a Container or "Narrow" wrapper is the fallback, not the default.

### Q2. Column

**What a Column provides that Grid settings don't:** a grid cell is a *stack of blocks*, not a single block. If Grid held blocks directly, one block would equal one cell, and putting an image, a paragraph and a button in the same cell would need a wrapper. That wrapper is a Column.

**What it costs as a freely addable block:**
- *Two sources of truth.* The Grid says "2/3 + 1/3" (two tracks), then an editor adds a third Column block. Now there are three children and two tracks.
- *Silent data loss.* Deleting a Column deletes its content, or orphans it.
- *Tree depth.* Per-column settings (background, padding) are rarely used, but every editor sees the node.

**Resolution: Column is a slot, not a block.** The Grid's layout preset (1:1, 2:1, 1:1:1...) creates its slots. Slots are added or removed only by changing the preset, and shrinking a preset merges the extra slot's content into the last slot after a confirmation. Slot settings (background, padding, vertical alignment, order when stacked) live on the slot and are collapsed by default. In the editor, slots render as drop zones, not as selectable tree nodes, unless a setting has been customized.

Data shape (works in any CMS that has repeaters containing block lists):

```
Grid { preset, gap, stacking, slots: [ { settings?, blocks: [] }, ... ] }
```

If your CMS can't nest a block list inside a repeater item, fall back to Column as a block with enforced parent/child rules (Q3).

This also mirrors where the browser reads things. Track definitions live on the parent (`grid-template-columns`), and placement lives on the child (`grid-column: span 2`, `align-self`). Ratios on the Grid and alignment/span on the slot follow the same split.

### Q3. Over-nesting and enforcement

**Depth as proposed:** Section > Container > Grid > Column > block = 5 levels. A plain two-column page costs four selections to reach the text. Removing Container gives four levels; hiding slots in the UI gives three visible ones. The simple page stays Section > Rich Text (two levels).

**Rules that keep it flat**
- No Section inside Section. Sub-layout is a Grid's job.
- No Grid inside a Slot. Inherently multi-up blocks (Card List, Gallery, Logo list) own a "per row" property instead of needing a Grid around them.
- Layout blocks never appear inside content blocks. Accordion panels and Tabs hold content blocks only.
- Editors get a **"Make columns"** action that wraps selected blocks in a Grid, and **"Unwrap"** to undo it. Structure appears when needed rather than being there from the start.

**Where to enforce.** The block picker filtering what's insertable is not enough, because content also arrives through paste, import, API, migration and AI-generated drafts. Enforce in three places:

1. **Picker:** only offer blocks the current parent allows.
2. **Validation on save/publish:** reject or auto-repair trees that violate the rules.
3. **Normalization pass:** unwrap a Grid with one slot, remove empty Sections/Grids, hoist loose blocks into a Section.

### Other weak spots (not in your three questions)

| # | Claim in the proposal | Problem | Fix |
|---|---|---|---|
| 1 | Section renders as `<section>` | HTML says `<section>` is not a generic container: use `<div>` when you only need styling. A `<section>` with no accessible name is not exposed as a region landmark, so a page of unlabelled sections adds no navigation value | Emit `<section aria-labelledby>` only when the Section has a heading. Otherwise `<div>`. The CMS can auto-detect this |
| 2 | Rich Text renders as `<article>` | `<article>` means self-contained, independently distributable content (a post, a comment, a product card). A text block isn't | `<div>` for Rich Text. `<article>` for each Card in a Card List, and for the page when the page type is an article |
| 3 | Accordion as `<details>/<dl>` | `<dl>` describes name/value groups. It contributes no collapsed state and no keyboard behavior | `<details>/<summary>` (grouped with the `name` attribute for one-open-at-a-time in current browsers) or a button with `aria-expanded`. A heading may sit inside `<summary>` |
| 4 | Hero as `<header>` | Inside `<main>` it's not a banner landmark (only a body-scoped header is), so that's fine. But nothing stops two Heroes or a Hero in the middle of the page | Max one per page, first in main, owns the `h1`. Avoid the word "banner" (see Part 5) |
| 5 | "Unitless ratios, so responsive by default" | Ratios set proportions, not what happens when the space is narrow. A `1fr 2fr` grid at 320px gives 100px and 200px columns. The collapse rule makes it responsive. Also, `1fr` is `minmax(auto, 1fr)`, so one long URL, table or image can blow out a track | Use `minmax(0, 1fr)`, and define stacking by available width, not only by device |
| 6 | Responsive behavior via viewport breakpoints | The same Card List lives in a full-width Section and in a one-third slot. The viewport can't tell it which one it's in | Set `container-type: inline-size` on Section and slot, and style blocks with container queries (supported in current browsers) |
| 7 | "Spacer is a smell" | Right instinct, incomplete diagnosis. Editors reach for Spacer because Section padding only controls the outer edges. Spacing *between* blocks has no control | Add a stack gap (same scale) to Section and slot. Stack is also a consensus name (10 examples on the Gallery index) |
| 8 | Divider as a block (`<hr>`) | `<hr>` is a thematic break with a separator role. Purely decorative dividers shouldn't be announced | Decorative edge shapes and lines become a Section option (CSS). Keep the Separator block only for genuine thematic breaks |
| 9 | CTA/Button Group | CTAs almost always navigate, so they should be `<a>` styled as buttons. `<button>` is for actions. The Gallery lists Toolbar as an alias of Button group, but APG's Toolbar implies roving-tabindex behavior a CTA pair doesn't need | `<div>` of links/buttons. No `role=toolbar` |
| 10 | Embed/Raw HTML | An escape hatch with security and a11y costs (iframes need a `title`, raw HTML can break landmarks) | Permission-gate it. Require a title for embeds. Sandbox where possible |

---

## 3. Revised structure and block list

```
Page (template; owns header, nav, main, footer, skip link)
└─ Section          <section> if labelled, else <div>
   ├─ Content blocks directly          ← simple pages: Section > Rich Text
   └─ Grid          <div>
      └─ Slot       ("Column" in editor language; auto-managed by the Grid preset)
         └─ Content blocks
```

**Removed:** Container (render detail), Spacer (replaced by stack gap), Divider-as-decoration (Section option).

### Layout blocks

| Block | Element | Editor options | Accepts |
|---|---|---|---|
| **Section** | `<section>` if it has a heading, else `<div>` | Content width (narrow / content / wide / full), background (color/image/video), vertical padding (none to xl), stack gap (none to xl), anchor ID, heading link (for the accessible name), optional decorative edge | Content blocks, Grid |
| **Grid** | `<div>` + CSS grid | Layout preset (1:1, 1:1:1, 1:1:1:1, 2:1, 1:2, 1:2:1), gap, stacking behavior (container-width based, with optional reverse order), vertical alignment | Slots (managed by preset) |
| **Slot** (shown as "Column") | `<div>` | Background, padding, vertical alignment, stacked order. All collapsed by default | Content blocks |

### Allowed parent/child matrix

| Block | Allowed parents | Allowed children | Limits |
|---|---|---|---|
| Section | Page | Content blocks, Grid | No nested Section |
| Grid | Section | Slots | Slot count = preset. Never inside a Slot |
| Slot | Grid | Content blocks | No layout blocks inside |
| Hero | Section | Heading, Rich Text, Button Group, Image | Max 1 per page, first in main |
| Accordion, Tabs | Section, Slot | Items containing Rich Text, Image, List, Button Group | No layout blocks inside |
| Card List | Section, Slot | Cards (fixed fields) | Owns "per row" setting |
| Everything else | Section, Slot | Per block | |

### Content blocks

| Block | Renders as | Notes |
|---|---|---|
| Hero | `<header>` or `<div>` | One `h1`. Optional image/video background |
| Heading | `h1` to `h6` | Semantic level and visual size are separate fields. `h1` reserved for Hero/page title |
| Rich Text | `<div>` with `p`, `ul`, `ol`, `blockquote`, `h2` to `h4` | Restrict heading levels so editors can't pick one by how it looks |
| Image | `<img>`, plus `<figure>/<figcaption>` when captioned | Alt text required, or an explicit "decorative" flag |
| Video | `<video>` with tracks, or an embed | Captions required. No autoplay with sound |
| Button Group | `<div>` of `<a>` and `<button>` | Links navigate, buttons act |
| Card List | `<ul><li><article>` | Owns its columns |
| Accordion | `<details>` | See weak spot 3 |
| Tabs | APG Tabs pattern | Hides content from linear reading, so use sparingly |
| Quote | `<blockquote>` + `<cite>` | |
| Table | `<table>` | Header cells required |
| Alert | `<div role="status">` or `role="alert"` | By urgency |
| Form | `<form>` | Fieldset/inputs as sub-blocks |
| Separator | `<hr>` | Thematic breaks only |
| Embed | `<iframe title>` | Raw HTML variant is permission-gated |

---

## 4. Consensus component list

Columns: **Canonical** = the name chosen · **Also called** = aliases from the Gallery index and APG · **Gallery** = example count on the index ("—" = not on the index) · **HTML** = native element · **APG / ARIA** = pattern or role.

### A. Page structure and landmarks

| Canonical | Also called | Gallery | HTML | APG / ARIA | Note |
|---|---|---|---|---|---|
| Header | | 38 | `<header>` | banner (only when scoped to body) | Inside main/section/article it is not a landmark |
| Navigation | Nav, Menu | 62 | `<nav>` | navigation | Link lists. Label each one if there's more than one |
| Main | | — | `<main>` | main | One per page |
| Sidebar | Aside | — | `<aside>` | complementary | Persistent and in flow. Not an overlay (that's a Drawer) |
| Footer | | 19 | `<footer>` | contentinfo (body-scoped) | |
| Search | Search input | 30 | `<search>` wrapping `<input type="search">` | search | Older stacks use `role="search"` |
| Skip link | | 14 | `<a href="#main">` | | First focusable element |
| Breadcrumbs | Breadcrumb, Breadcrumb trail | 55 | `<nav aria-label="Breadcrumb"><ol>` | Breadcrumb | `aria-current="page"` on the last item |

### B. Layout primitives

| Canonical | Also called | Gallery | HTML | APG / ARIA | Note |
|---|---|---|---|---|---|
| Section | | — | `<section>` or `<div>` | region (only when named) | See weak spot 1 |
| Grid | | — | `<div>` + CSS grid | none | `role=grid` is reserved for the interactive Data grid |
| Column (Slot) | Col | — | `<div>` | | Auto-managed by Grid |
| Stack | | 10 | `<div>` + gap | | Vertical flow with a consistent gap |
| Separator | Divider, Horizontal rule, Vertical rule | 34 | `<hr>` | separator | Decorative lines belong in CSS |
| Visually hidden | Screenreader only | 11 | utility class | | |
| *Container* | | — | — | | Render detail of Section, not a block |

### C. Content display

| Canonical | Also called | Gallery | HTML | APG / ARIA | Note |
|---|---|---|---|---|---|
| Heading | | 29 | `h1` to `h6` | heading | Level is not size |
| Rich Text | Prose | — | `p`, `ul`, `ol`... | | "Rich text editor" (5) on the index is the editing tool, not this |
| Image | Picture | 29 | `<img>`, `<picture>`, `<figure>` | img | Alt text |
| Video | Video player | 15 | `<video>` | | Captions |
| Icon | | 45 | inline `<svg>` | img or hidden | Decorative icons `aria-hidden` |
| Avatar | | 38 | `<img>` | | |
| Quote | Block quote, Pull quote | 11 | `<blockquote>` | | A pull quote repeats text already on the page, so hide the duplicate from screen readers |
| List | | 67 | `ul`, `ol`, `dl` | list | |
| Table | | 73 | `<table>` | Table | Static data |
| Card | Tile | 77 | `<article>` inside a list | | |
| Hero | Jumbotron, Banner | 9 | `<header>` or `<div>` | | "Banner" is a landmark, so avoid it |
| Empty state | | 16 | | | |
| File | Attachment, Download | 6 | `<a download>` | | Ambiguous in code (File API). "File link" is a reasonable alternative |

### D. Actions and links

| Canonical | Also called | Gallery | HTML | APG / ARIA | Note |
|---|---|---|---|---|---|
| Link | Anchor, Hyperlink | 64 | `<a href>` | Link | Navigates |
| Button | | 118 | `<button>` | Button | Acts |
| Button group | Toolbar | 35 | `<div role="group">` | Toolbar (only if roving tabindex is needed) | A CTA pair is not a toolbar |
| Menu button | Dropdown menu | 49 | `<button aria-haspopup>` | Menu Button | Opens an action menu |
| Segmented control | Toggle button group | 28 | radio inputs or buttons | | Mutually exclusive options |
| Switch | Toggle, Lightswitch | 60 | checkbox + `role="switch"` | Switch | Takes effect immediately |
| Toggle button | | (in Toggle) | `<button aria-pressed>` | | A pressed-state button, not a setting |

### E. Wayfinding and sequence

| Canonical | Also called | Gallery | HTML | APG / ARIA | Note |
|---|---|---|---|---|---|
| Tabs | Tabbed interface | 80 | none | Tabs | |
| Pagination | | 48 | `<nav aria-label="Pagination"><ul>` | | `aria-current="page"` |
| Steps | Stepper, Progress tracker | 38 (as Progress indicator) | `<ol>` | | `aria-current="step"` |
| Timeline | | (in Progress indicator) | `<ol>` + `<time>` | | Chronological events, not progress |
| Tree view | | 14 | | Tree View | |
| Feed | | — | | Feed | Auto-loading list of articles |
| Mega menu | | — | `<nav>` + disclosure buttons | disclosure-navigation example | A Navigation variant, not a Menu |

### F. Disclosure and overlays

| Canonical | Also called | Gallery | HTML | APG / ARIA | Note |
|---|---|---|---|---|---|
| Accordion | Collapse, Expander, Details, Collapsible | 101 | `<details>` | Accordion | A group of related disclosures |
| Disclosure | | (in Accordion) | `<details>` | Disclosure | A single one |
| Dialog | Modal, Popup, Modal window | 82 | `<dialog>` | Dialog (Modal) | Modal is a variant, not a separate thing |
| Alert dialog | Confirm dialog | | `<dialog role="alertdialog">` | Alert and Message Dialogs | Demands a response |
| Drawer | Tray, Flyout, Sheet | 38 | `<dialog>` | Dialog | Edge-anchored overlay |
| Popover | | 50 | `popover` attribute | | Interactive and click-opened |
| Tooltip | | 74 | | Tooltip | Non-interactive, hover/focus |
| Toggletip | | (in Tooltip) | | | A tooltip opened by click. Keeping the name because it behaves differently for assistive tech |

### G. Feedback and status

| Canonical | Also called | Gallery | HTML | APG / ARIA | Note |
|---|---|---|---|---|---|
| Alert | Notification, Banner, Callout, Message | 108 | `role="alert"` or `role="status"` | Alert | In-flow message |
| Toast | Snackbar | 41 | `role="status"` | | Transient overlay. Auto-dismissing ones can fail WCAG 2.2.1 (Timing Adjustable) |
| Badge | | 123 | `<span>` | | Static status or count |
| Tag | Label | (in Badge) | `<span>` or `<a>` | | Static categorization |
| Chip | | (in Badge) | `<button>` | | Interactive: removable or selectable |
| Progress bar | Progress | 40 | `<progress>` | | Task completion |
| Meter | | (in Progress indicator) | `<meter>` | Meter | A value within a known range |
| Spinner | Loader, Loading | 66 | `role="status"` | | |
| Skeleton | Skeleton loader | 30 | `aria-busy` on the region | | |
| Rating | | 19 | | | |

### H. Forms

| Canonical | Also called | Gallery | HTML | APG / ARIA | Note |
|---|---|---|---|---|---|
| Form | | 21 | `<form>` | form (when named) | |
| Fieldset | | 32 | `<fieldset><legend>` | group | |
| Label | Form label | 15 | `<label>` | | The word "label" is reserved for this |
| Text input | | 72 | `<input type="text">` | | |
| Textarea | Textbox | 52 | `<textarea>` | | |
| Select | Dropdown, Select input | 82 | `<select>` | Listbox (custom) | Choose a value |
| Combobox | Autocomplete, Autosuggest | 37 | | Combobox | Input plus suggestion popup |
| Checkbox | | 84 | `<input type="checkbox">` | Checkbox | |
| Radio group | Radio, Radio button | 85 | fieldset + radio inputs | Radio Group | The group is the unit |
| Slider | Range input | 38 | `<input type="range">` | Slider | Never used for a Carousel |
| Number input | Stepper, Quantity, Counter, Nudger | 20 | `<input type="number">` | Spinbutton | The +/- control |
| Date input | | 18 | `<input type="date">` or three fields | | Typed |
| Date picker | Calendar, Datetime picker | 44 | | | Calendar popup |
| File upload | File input, Dropzone | 32 | `<input type="file">` | | |
| Color picker | | 18 | `<input type="color">` | | |

### I. Collections

| Canonical | Also called | Gallery | HTML | APG / ARIA | Note |
|---|---|---|---|---|---|
| Carousel | Content slider | 22 | | Carousel | Auto-rotation needs a pause control (WCAG 2.2.2) |
| Data grid | | — | `<table>` + roles | Grid, Treegrid | Interactive and keyboard-navigable. The name avoids the layout Grid |

---

## 5. Naming collisions, resolved

| Collision | Resolution | Why |
|---|---|---|
| Modal vs Dialog vs Popup | **Dialog**, with modal / non-modal as a variant | HTML and APG both say Dialog. The index's own page title is Modal, which is more common, but it names a behavior (blocks the page), and non-modal dialogs exist. Flip this one if you value raw consensus over semantics |
| Accordion vs Collapse vs Disclosure vs Details | **Accordion** for a group, **Disclosure** for a single item | APG separates these the same way |
| Toggle vs Switch | **Switch** for an immediate on/off setting, **Toggle button** for a pressed state | APG's Switch, and `aria-pressed` for the other |
| Alert vs Toast vs Notification vs Banner | **Alert** (in flow), **Toast** (transient overlay). Retire Notification and Banner | Notification collides with browser/inbox notifications. Banner collides with the landmark |
| Badge vs Tag vs Chip vs Label | **Badge** (static status), **Tag** (static category), **Chip** (interactive). Label is reserved for forms | The index lumps four words into one entry, but they differ in interactivity |
| Stepper (process) vs Stepper (quantity) | **Steps** (process), **Number input** (quantity) | The index itself uses "Stepper" for both |
| Progress vs Meter | **Progress bar** (completion), **Meter** (a value in a range) | `<progress>` and `<meter>` are different elements |
| Navigation vs Menu vs Dropdown | **Navigation** for link lists, **Menu button** + Menu for actions. Retire "Dropdown" as a name | `role=menu` implements application-style menus whose arrow-key behavior doesn't match how people use site navigation. APG shows a disclosure-based navigation example instead. "Dropdown" describes appearance, and could mean Select or Menu |
| Select vs Combobox | **Select** (native choice), **Combobox** (input + popup) | |
| Tooltip vs Popover vs Toggletip | **Tooltip** (non-interactive), **Popover** (interactive), **Toggletip** (click-opened) | Keyboard and screen-reader behavior differs |
| Drawer vs Sidebar vs Sheet | **Drawer** (overlay), **Sidebar** (in flow). Sheet is an alias only | |
| Carousel vs Slider | **Carousel** for content, **Slider** for range input | |
| Hero vs Banner vs Jumbotron | **Hero** | Banner is a landmark |
| Grid (layout) vs Grid (interactive) | **Grid** for layout, **Data grid** for the interactive one | APG's `role=grid` is a different thing from CSS grid |
| Radio button vs Radio group | **Radio group** | A lone radio is meaningless |
| Button vs Link | **Link** navigates, **Button** acts. No "link button" noun | A styled link is a Link with a button variant |
| Button group vs Toolbar | **Button group** | A toolbar implies roving-tabindex behavior |
| Divider vs Separator | **Separator** | HTML (`<hr>`), ARIA and the index's primary name agree |

---

## 6. Gap vocabulary: names for patterns nobody has named

Everything above keeps its standard name. This section is only for patterns that have no one-or-two-word name anywhere, where people still describe the component with a phrase ("the sticky bar with the add-to-cart button").

### The gap test (R7)

A pattern gets a coined name only if all three are true:
1. None of the consensus list or major design systems has a one- or two-word name for it.
2. It isn't a universally understood page region or control (header, footer, breadcrumbs, sidebar, modal...).
3. People currently describe it with a phrase instead of a noun.

### Naming worlds

Names are drawn from five consistent worlds, so learning the world lets you guess the next name.

| World | Used for | Why it fits |
|---|---|---|
| **Wayfinding** (trails, maps, signs) | Orientation: where am I, where is this, how far | Navigation vocabulary maps almost one-to-one |
| **Light & Signal** (lamps, flags, flares) | Attention, urgency, social cues, status | These components exist to be noticed |
| **Theater & Performance** (marquees, casts, intermissions) | Persuasion and marketing display | A marketing page is a staged performance |
| **Tools & Mechanisms** (gauges, trays, rails) | Interactive utilities the visitor operates | They are literally instruments and fixtures |
| **Trade & Records** (ledgers, stickers, briefs) | Commerce, bookkeeping, documentation | They present records, prices and annotations |

Rules: one or two words · concrete noun over abstract noun · draw from the world assigned to that function · reuse a world's vocabulary before borrowing from another · check collisions against the consensus list first.

### The 30 names

#### Wayfinding

| Name | What it is | Where it usually appears | Content it shows | Described today as |
|---|---|---|---|---|
| **Milepost** | A progress meter attached to a "Load more" list that shows how far through the results the visitor is | Bottom of product grids, search results, long listings | "Showing 24 of 312" text, thin progress bar, Load more button | "load more with progress bar" |
| **Atlas** | A split view with a map on one side and a scrollable result list on the other. Hovering a card highlights its pin, and panning the map filters the list | Real estate, lodging, store locator, event result pages | Map with price or number pins, result cards (photo, title, price, rating, distance), "search as I move the map" option | "split map view" |
| **Signpost** | A one-link teaser dropped into an article body pointing to one related piece | Mid-article, between paragraphs | Small "Related" or "Read next" label, linked headline, optional thumbnail | "inline related link", "read also box" |
| **Aisle Signs** | A row of icon or image tiles, each labeled with a top-level category | Below the hero on store, marketplace and directory home pages | Icon or photo, category name, sometimes an item count | "category tiles", "shop by category" |
| **Compass** | A dismissible prompt offering to switch the visitor to the language, currency or region matching their location | Top of the page, or a small panel on first visit (international sites) | Detected-country message, "Switch to X" button, "Stay here" link | "geo banner", "locale suggestion" |
| **Arrivals Board** | A delivery estimator: the visitor enters a postcode and gets a delivery date range | Product detail pages near the buy button, cart | Postcode field, estimated delivery window, shipping method and cost, order-by cutoff ("order within 2 hrs") | "delivery estimator" |

#### Light & Signal

| Name | What it is | Where it usually appears | Content it shows | Described today as |
|---|---|---|---|---|
| **Shadow Bar** | A slim bar that appears after the main purchase button scrolls out of view and follows the visitor down the page | Top or bottom edge of product, pricing and booking pages (bottom on mobile) | Product name or thumbnail, price, variant summary, persistent Add to Cart / Buy / Book button | "sticky add-to-cart bar" |
| **Amber Line** | One line of caution-toned text flagging low stock or high demand | Under the price or beside the buy button, hotel and flight listings | "Only 3 left", "12 people are looking at this", "Selling fast", often with a small icon or dot | "scarcity message", "urgency text" |
| **Glimmer** | A small popup that appears briefly in a corner showing someone else's recent activity | Bottom-left corner of store and landing pages | Buyer's first name and city, product thumbnail and name, "4 minutes ago", verified tick | "social proof popup", "sales notification" |
| **Flare** | A small pill above a hero headline announcing something new and linking to it | Directly above the hero headline on landing pages | "New" tag, one short phrase, arrow | "announcement pill" |
| **Edge Flag** | A tab fixed to the side edge of the screen, text often rotated 90 degrees, that opens a feedback or help panel | Right or left viewport edge, mid-height | Short rotated label ("Feedback", "Help", "Book a demo") that opens a small form or panel | "feedback tab", "side tab" |
| **Ping** | A floating pill saying new content is available. Clicking it loads or scrolls to it | Top-center of feeds, comment threads, live blogs, dashboards | "↑ 12 new posts" with a count, optional author avatars | "new posts pill" |

#### Theater & Performance

| Name | What it is | Where it usually appears | Content it shows | Described today as |
|---|---|---|---|---|
| **Applause Line** | A compact social-proof line directly under the hero call to action | Under the primary hero button | Overlapping avatar stack, star rating, a headline number ("Loved by 12,000 teams"), sometimes a review-site logo | "hero social proof" |
| **Interlude** | A full-width band (image, texture or color) with one short line of text, used as a breather between dense sections | Mid-page, between content sections | Background image or pattern, one sentence or pull-line, optional single link | "image band", "parallax divider" |
| **Scene Stack** | Cards that stick as you scroll while the next card slides over the top, so they pile up like pages | Feature and process sections on marketing and portfolio pages | Per card: number or label, headline, short paragraph, image or illustration | "sticky stacking cards" |
| **Screening Room** | A list of feature names beside a large product screenshot that changes when a feature is selected, sometimes auto-advancing with a timer bar | Product and SaaS pages, below the hero | Feature titles with one-line descriptions, a screenshot or looping video per feature, progress bar on the active item | "tabbed feature screenshots" |
| **Cameo** | A small customer-story teaser built around one headline result | Customer stories index, landing-page proof sections | Customer logo, headline metric ("-38% churn"), one-line quote or description, "Read story" link | "case study card", "results card" |
| **Playbill** | Large typographic rows listing projects: number, title, category, year, with a thumbnail that appears on hover | Portfolio and agency home and work pages | Index number, project name, discipline tags, year, hover image, arrow | "project index", "work list" |

#### Tools & Mechanisms

| Name | What it is | Where it usually appears | Content it shows | Described today as |
|---|---|---|---|---|
| **Sidecar** | A card that rides alongside long content, staying in view while scrolling, and holds the page's primary action | Right column of listing detail pages: lodging, courses, events, real estate, products (desktop) | Price, date or quantity pickers, primary Reserve / Buy button, small print ("You won't be charged yet"), contact link | "sticky booking card", "sticky sidebar CTA" |
| **Concertina** | A row of panels that expand horizontally on hover or click while neighbors narrow | Home and landing pages for categories, services or destinations | Tall image panel with a short or rotated title. Expanded state adds heading, description, button | "horizontal accordion", "expanding cards" |
| **Handrail** | A vertical column of share icons that stays fixed beside the article while reading | Left margin of long articles (desktop) | Share icons (copy link, email, social), share count, optional like or save | "floating share bar" |
| **Fit Gauge** | A scale showing how reviewers rated sizing, from runs small to runs large | Product pages beside the size selector or in reviews (clothing, shoes) | Three- to five-point scale with a marker, label ("True to size"), reviewer count | "fit scale", "size feedback" |
| **Compare Tray** | A docked tray that collects products ticked "Compare" and slides up from the bottom edge | Bottom edge of category and search pages | Thumbnails of 2 to 4 selected products, remove buttons, "Compare (3)" button, clear link | "compare bar" |
| **Freight Meter** | A progress bar showing how close the cart is to free shipping or another reward | Top of the cart drawer or cart page, sometimes the announcement strip | "You're $12.50 away from free shipping", progress bar, success state | "free shipping bar" |

#### Trade & Records

| Name | What it is | Where it usually appears | Content it shows | Described today as |
|---|---|---|---|---|
| **Tally** | A bar breakdown of ratings by star count | Top of the reviews section on product and app pages | Average score, total reviews, five horizontal bars with counts or percentages, bars often clickable as filters | "rating breakdown", "review histogram" |
| **Price Sticker** | A stack presenting the current price with the original struck through, savings, unit price and financing | Product detail pages beside the title and buy button, product cards | Sale price, struck-through original, "Save 25%", per-unit price, "4 payments of $x" | "price block", "price lockup" |
| **Bundle Row** | A horizontal row of items joined by plus signs with a combined price and one button to add all | Product detail pages below the main purchase area, cart | Thumbnails with "+" between them, per-item checkboxes, names and prices, combined total and savings, "Add all to cart" | "frequently bought together" |
| **Letterhead** | A business contact block combining address, phone, hours and map | Contact page, local-business home pages, store detail pages | Address, phone and email, opening hours by weekday with "Open now / Closes at 6 pm", map thumbnail, directions link | "contact block", "location card" |
| **Brief** | A short boxed summary at the top of a long article listing the main points | Directly under the title and byline of articles, reports, guides | "Key takeaways" label, three to five bullets, sometimes reading time | "key takeaways", "TL;DR box" |
| **Gloss** | A dotted-underlined term inside body text that reveals a short definition on hover or tap | Inside body copy on technical, medical, legal and educational pages | The term (dotted underline), short definition, optional "Learn more" or glossary link | "glossary tooltip", "inline definition" |

### Considered and dropped (these already have a name)

The first draft of this list contained names for things that are already standard. Those were dropped, along with their standard names:

| Dropped coinage | Already called |
|---|---|
| Wayfinder | Table of contents |
| Skyhook | Back to top |
| Trackline | Timeline, Steps |
| Filter Rail | Chips |
| Signal Dot, Beacon (dot) | Badge, status indicator |
| Gauge (scroll) | Progress bar |
| Ticker | Countdown timer |
| Corner Flag | Ribbon, Badge |
| Marquee | Logo cloud |
| Waypoint | Hotspots |
| Trailhead | Related posts |
| Closer | CTA section |
| Roster | Team section |
| Switchback | Zigzag or alternating layout |
| Featurette | Bootstrap's marketing example templates already use this word for a feature row |
| Bio Strip | Author box |
| Toolbelt | Toolbar |
| Relay | Steps |
| Fitting Room | Product configurator |
| Launcher | Chat widget |
| Ledger | Comparison table |
| Sitemap Grid | Footer link columns, mega footer |
| Milestone, Statline | Stats |
| Subscribe Strip | Newsletter signup |
| Wipe | Before/after slider |
| Docket | Task list, queue |
| Cadence Switch | Billing toggle (a Switch or Segmented control) |

Marketing section names that are treated as already named and left alone: Hero, Feature section, CTA section, Logo cloud, Testimonial, Pricing table, FAQ, Stats, Team section, Newsletter signup, Contact section. In this pass, only Hero (Gallery index), Hero sections, Announcement banners, Promo cards and the Trust & Social Proof and Pricing & Conversion groupings (Preline's marketing index) were confirmed against a source. The rest are from general familiarity.

### How to extend it

A new pattern that passes the gap test goes to its world first: navigation aids reach for travel words (a "milepost"), status widgets for light words ("flare", "ping"), persuasion sections for theater words, utilities for tool words, and records or commerce for trade words. The list skews toward e-commerce because that is where the unnamed-pattern gap is widest. SaaS, docs and editorial sites would get their own pass.

---

## 7. Sources

- Component Gallery component index (60 components, aliases, example counts): https://component.gallery/components/
- W3C ARIA Authoring Practices Guide, patterns index (30 patterns): https://www.w3.org/WAI/ARIA/apg/patterns/
- Radix Themes layout overview (Section handles vertical spacing, Container a maximum width, as separate primitives; this is a code-library choice, not evidence that editors need both as nodes): https://radix-ui.com/themes/docs/overview/layout
- Preline marketing blocks index (marketing section categories): https://preline.co/blocks/marketing/
- Tailwind Plus marketing index was behind a login, so it was not used.
- HTML element semantics (`section`, `article`, `header`, `details`, `dialog`, `search`, `progress`, `meter`) and the CSS techniques in Part 2 are from general knowledge of the HTML and CSS specs and were not re-fetched in this pass.
