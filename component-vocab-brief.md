# component-vocab: Repository Brief

Survey of the repository after the vocabulary rework (Phases 1 to 8 of `docs/plan/vocab-rework-plan.md`), refreshed 2026-11-19 on branch `phase-8-docs`. It replaces the original brief, which described the 50 hand-written pages that existed before the rework (see that version in git history on `main`). Items marked **(inferred)** were not confirmed by running them.

**Summary**
- **What it is:** a static docs site for a website component vocabulary. There are 84 components in groups A to J: 40 stable and 44 drafts.
- **How it's built:** one JSON file per component. A dependency-free Node generator writes the pages, and the generated HTML is committed.
- **Checks:** `node scripts/build.mjs --check` validates the data and the generated output, and CI runs it on every push.
- **Branches:** each phase is its own branch, chained off `research-inputs`. None is merged into `main`.

## 1. Purpose and scope

The goal, as stated in `docs/research/component-vocabulary-and-page-structure.md`:

> "CMS-agnostic reference. Goal: one list of component names that (1) matches what most design systems already call things, (2) doesn't contradict native HTML, and (3) holds up for accessibility. Where those three disagree, this doc says which one won and why."

The `README.md` covers purpose, naming rules R1 to R7, the commands and how to add a component. The original design (`docs/superpowers/`) is marked historical.

**Out of scope for now:**
- The 30-name gap vocabulary (research §6).
- Wireframes and guidance for draft components.

## 2. Structure

```
.
├── .github/workflows/check.yml   CI: validate + build --check
├── .gitattributes                LF line endings everywhere
├── README.md
├── component-vocab-brief.md      this file
├── index.html                    generated
├── components/                   generated: 84 component pages + 23 redirect pages
├── css/
│   ├── pico.classless.min.css    Pico CSS v2.1.1
│   └── site.css                  drafting-sheet theme, light/dark, wireframes
├── js/main.js                    wireframe labels and toggle, filter, counts, smooth scroll
├── data/
│   ├── components/<slug>.json    84 files, the source of truth
│   ├── schema.json               JSON Schema (subset enforced by validate.mjs)
│   ├── groups.json               A to J
│   ├── systems.json              12 design systems
│   ├── structure.json            parent/child rules (research §3)
│   └── redirects.json            23 old slugs
├── wireframes/<slug>/*.svg       256 SVGs for the 40 stable components
├── scripts/
│   ├── build.mjs, validate.mjs, structure.mjs
│   ├── templates/                component.mjs, index.mjs, util.mjs, index-*.html fragments
│   └── legacy/                   extract.mjs, reconcile.mjs, properties.mjs (one-off migrations)
└── docs/
    ├── research/                 research inputs (consensus list, CSV)
    ├── reconciliation.md         Phase 1 mapping and signed-off decisions
    ├── migration-log.md          what each migration changed
    └── superpowers/              original spec and plan (historical)
```

`.claude/settings.local.json` and `.playwright-mcp/` are git-ignored.

## 3. Tooling

- **Languages:** HTML, CSS, vanilla JS for the site; Node 18+ ES modules for the scripts.
- **Dependencies:** none. There's no `package.json`.
- **Commands:** `node scripts/validate.mjs`, `node scripts/structure.mjs`, `node scripts/build.mjs`, `node scripts/build.mjs --check`.
- **What `--check` fails on:**
  - invalid data
  - duplicate slugs, names or aliases, or an alias that is another component's name
  - asymmetric parents/children, or structure data out of date with `data/structure.json`
  - generated output that differs from what's committed
  - stale pages
  - broken relative links or `#fragments` (escaped code is ignored)
- **CI:** `.github/workflows/check.yml` runs both checks on push and pull request.
- **Publishing:** none configured. The site needs no build, so GitHub Pages could serve the repo root as it is **(inferred)**.

## 4. Components

**Storage:** `data/components/<slug>.json`.
- **Content fields:** slug, name, order, status (`stable` or `draft`), group, description, summary, htmlElement, nativeHtml, aria, researchNote, htmlOutline, elements, configOptions, variants, collections, usageNotes.
- **Name and framework fields:** aliases, formerNames, absorbed, frameworkSource (`csv`, `legacy` or `none`), frameworkNames (12 systems, each `same` / `alias` / `different` / `none`), frameworkNotes.
- **Structure and links:** parents, children, wireframe, thumbnail, related.

See `data/components/card.json` for a stable component and `data/components/combobox.json` for a draft.

**Count:** 84 (40 stable, 44 draft). Names in page order, by group:

| Group | Components |
|---|---|
| A. Page structure | Header, Navigation, Main\*, Sidebar, Footer, Search\*, Skip link\*, Breadcrumbs |
| B. Layout primitives | Section, Grid, Slot\*, Stack\*, Separator, Visually hidden\* |
| C. Content display | Heading\*, Rich Text, Image, Video\*, Icon\*, Avatar, Quote\*, List, Table, Card, Hero, Empty state\*, File\*, Description list, Embed |
| D. Actions and links | Link\*, Button\*, Button group\*, Menu button, Segmented control\*, Switch\*, Toggle button\* |
| E. Wayfinding and sequence | Tabs, Pagination, Steps\*, Timeline, Tree view\*, Feed\*, Mega menu\* |
| F. Disclosure and overlays | Accordion, Disclosure\*, Dialog, Alert dialog\*, Drawer, Popover, Tooltip, Toggletip\* |
| G. Feedback and status | Alert, Toast, Badge, Tag\*, Chip\*, Progress bar, Meter\*, Spinner, Skeleton, Rating\* |
| H. Forms | Form, Fieldset\*, Label\*, Text input\*, Textarea\*, Select\*, Combobox\*, Checkbox\*, Radio group\*, Slider\*, Number input\*, Date input\*, Date picker\*, File upload\*, Color picker\* |
| I. Collections | Carousel, Data grid\* |
| J. Page patterns | Feature, Testimonial, Stats, Logo cloud, Call to action, Pricing table |

\* draft

## 5. Component pages

Generated by `scripts/templates/component.mjs`, in this order:
1. Breadcrumb
2. Title block: name, Draft badge for drafts, description, then Also known as, Semantic element, Native HTML, ARIA pattern, Research note and Category
3. HTML Outline
4. Elements
5. Default Layout
6. Configuration Options (component-specific; a link points to the shared Universal configuration section on the index)
7. Layout Variations
8. Collection layouts
9. Usage Notes
10. Structure (allowed parents and children)
11. Design System Names
12. Prev/next

Sections without data are left out, so a draft page shows only the title block, HTML Outline, Structure and Design System Names. The layout is consistent across all pages because it comes from one template.

## 6. Wireframes

- **Format:** SVG files in `wireframes/<slug>/` (default, thumbnail, variation-N, collection, from-<retired>), inlined at build time. Only stable components have them.
- **Visual vocabulary:** the classes in `css/site.css`.
- **Labels:** each `hover-target` is followed immediately by its `label-group`. `js/main.js` moves labels above the shapes and adds a Show labels toggle.

## 7. Data and duplication

The rework removed the hand duplication:
- Names, order, categories, prev/next, the comparison table and "Also known as" all come from the JSON files.
- The Universal config table appears once, on the index.

Still duplicated, by design:
- The research inputs and the data seeded from them. `docs/research/` is the source and `data/` is the working copy; the migration scripts record how one became the other.
- The static index fragments (`scripts/templates/index-*.html`).

**Generated:** `index.html` and `components/*.html`, produced by `node scripts/build.mjs`.

## 8. Conventions

- **Slugs:** lowercase kebab-case, enforced by the schema. Names follow research R1 to R7 (listed in the README).
- **Drafts:** carry only research and CSV facts plus an HTML outline. No wireframes, which the validator enforces.
- **Aliases:** unique across components, and never another component's name. Collisions were resolved by research R4 and §5 (`docs/migration-log.md`).
- **Line endings:** LF, through `.gitattributes`.
- **Agent instruction files:** none. No `CLAUDE.md`, `.cursorrules` or similar exists.

## 9. Gaps and known issues

1. **44 draft components** have no wireframe, elements or usage guidance.
2. **16 components aren't in the CSV.**
   - Nine (Rich Text, Embed, Description list and the six J patterns) keep framework names from their old pages, which covered 5 systems. Only Rich Text (3), Embed (1), Description list (1) and Stats (1) have any match. They're marked with \* in the comparison table.
   - Seven drafts (Main, Video, File, Feed, Mega menu, Disclosure, Data grid) have no framework data at all.
3. **12 invalid SVG `rx` values** (four-value form) in the Card, Alert (from Callout) and Dialog wireframes; browsers ignore them and draw square corners.
4. **Folding retired pages kept only their main wireframe** as a variant. Their own variations (about 40 small wireframes) were dropped and listed in `docs/migration-log.md`; they remain in git history.
5. **The CSV's symbol meanings are inferred:** ● same, ◐ alias, ○ different. Neither research file defines them.
6. **Not checked in a browser:** hover and tap interaction on every page, and the filter chips after Phase 6. Headless smoke tests covered the index, Section, Card and Dialog (formerly Modal) in Phase 2 **(inferred for the rest)**.
7. **Gap vocabulary** (research §6) is deferred.
8. **The plan file is only a chat document.** `docs/plan/vocab-rework-plan.md` is referenced here and in commit messages but isn't in the repo; it was delivered in chat.

## 10. Git state

- **Branch chain:** each branch is created off the one before it, starting from `research-inputs`.
  - `research-inputs` (off `main`)
  - `phase-1-reconciliation`
  - `phase-2-design-baseline` (merges `design/overhaul`)
  - `phase-3-extract`
  - `phase-4-generator`
  - `phase-5-reconcile`
  - `phase-6-taxonomy`
  - `phase-7-properties`
  - `phase-8-docs`
- **Remote:** all branches are pushed to `origin` (`github.com/cjsharp1/component-vocab`). Nothing is merged into `main`, and no pull requests are open.
- **`main`:** still at the pre-rework state plus the original brief (`0517e09`).
