# component-vocab

A shared vocabulary for website components: one list of names that matches what most design systems already call things, doesn't contradict native HTML, and holds up for accessibility. Each component has a page with an HTML outline, its native element and ARIA pattern, where it may be placed, wireframes (for stable components), configuration options, and the names 12 design systems use for it.

**Live site:** https://cjsharp1.github.io/component-vocab/

Open `index.html` in a browser. Pages work from `file://` and from any static host; there is no build step for visitors.

## What's in it

- **86 components** in groups A to J. Groups A to I follow the research consensus list (`docs/research/component-vocabulary-and-page-structure.md` §4), plus Code and Kbd from the scope candidates. Group J holds page patterns (Feature, Testimonial, Stats, Logo cloud, Call to action, Pricing table): standard industry terms that no surveyed UI framework ships.
- **All 86 are stable**, with wireframes, configuration options and usage guidance. The site still supports `"status": "draft"` for new entries: a draft carries a visible Draft badge and no wireframe.
- A **comparison table** across MUI, Bootstrap, Ant Design, Carbon, Polaris, Atlassian, Chakra UI, Radix Themes, shadcn/ui, Fluent UI, GOV.UK and Apple HIG, from `docs/research/framework-alignment.csv`.
- **Redirect pages** at every old slug that was renamed or folded (`data/redirects.json`), so old links keep working.

## Naming rules

From the research doc (§1). When the three sources disagree: native HTML first, then the W3C ARIA Authoring Practices, then design-system consensus.

| # | Rule | Example |
|---|---|---|
| R1 | Name the thing, not its look or behavior | Dialog, not Popup |
| R2 | When consensus is split, prefer the native/APG name; with no native/APG name, prefer consensus | Dialog over Modal |
| R3 | One name, one behavior. If a word means two things, split it or retire it | Stepper, Grid, Menu, Banner |
| R4 | Words native HTML/ARIA already claim stay reserved for them | Banner, Label, Menu, Slider |
| R5 | Name the semantic unit, not a part | Radio group, not Radio button |
| R6 | Variants are modifiers, not new nouns | Dialog + modal |
| R7 | Coin a new name only if it passes the gap test (research §6) | |

## How the site is built

The pages are generated from data and the generated HTML is committed.

```
data/
  components/<slug>.json   one file per component (the source of truth)
  schema.json              JSON Schema for those files
  groups.json              groups A to J
  systems.json             the 12 design systems, in column order
  structure.json           allowed parent/child rules (research §3)
  redirects.json           old slug -> new slug
wireframes/<slug>/*.svg    wireframes, inlined into pages at build time
scripts/
  build.mjs                writes components/*.html and index.html; --check verifies
  validate.mjs             schema and cross-file checks
  structure.mjs            derives parents/children from structure.json
  wireframe.mjs            draws wireframe SVGs from wireframes/<slug>/spec.json
  templates/               page templates and static index fragments
components/, index.html    generated output (don't edit by hand)
css/, js/                  site styles and behavior
fonts/                     self-hosted Latin WOFF2 fonts (Archivo, Public Sans, JetBrains Mono) and their OFL licenses
```

**No dependencies.** The scripts need Node 18 or newer and nothing else: no `package.json`, no install. This relaxes the original "no build tools" rule to "no dependencies" (decision D2 in `docs/reconciliation.md`).

### Commands

Run from the repo root:

```sh
node scripts/validate.mjs        # check data/components against the schema and cross-file rules
node scripts/structure.mjs       # recompute parents/children after adding or regrouping a component
node scripts/build.mjs           # regenerate components/*.html and index.html
node scripts/build.mjs --check   # fail if output is stale, data is invalid, or a link/#fragment is broken
```

`--check` also fails on duplicate names or aliases, an alias that is another component's name, asymmetric parent/child data, and pages in `components/` that the data doesn't produce.

## Adding a component

1. Pick the name with the rules above. Check `data/components/` and the aliases in them for collisions.
2. Copy a similar file in `data/components/` to `<slug>.json` (lowercase, hyphenated) and edit it. A new entry can start as `"status": "draft"` with no wireframe.
3. For a stable component, describe its wireframes in `wireframes/<slug>/spec.json` and run `node scripts/wireframe.mjs <slug>`. That writes `default.svg`, `thumbnail.svg` and `variation-N.svg` with hover labels placed inside the frame (the spec format is in the script's header comment; `wireframes/button/spec.json` is an example). Point to the files from the JSON. Older components have hand-drawn SVGs that use the same classes (`region`, `media-placeholder`, `interactive`, `optional`, `text-line`), with each `hover-target` rect followed immediately by its `label-group`.
4. Give each entry in `variants` either its own `htmlOutline` (when the variation changes elements, attributes, ARIA or structure) or `"sameMarkup": true` (when only the styling changes). `--check` fails if a variation has neither or both.
5. Set `group` to a slug from `data/groups.json`.
6. Run `node scripts/structure.mjs`, then `node scripts/build.mjs`, then `node scripts/build.mjs --check`.

To rename or retire a page, change or delete its JSON and add `"old-slug": "new-slug"` to `data/redirects.json`.

## Documents

- `docs/research/`: the research inputs (consensus list, naming collisions, gap vocabulary, framework survey).
- `docs/research/framework-survey.md`: when the 12 indexes were read, which URLs, what "—" and "?" mean, and why Apple HIG mappings are approximate.
- `docs/scope.md`: names that appear in several frameworks but aren't in the list, and why.
- `docs/reconciliation.md`: how the original 50 pages mapped to the research list, plus the signed-off decisions.
- `docs/migration-log.md`: how the data was migrated from the original 50 hand-written pages, including every legacy-vs-CSV disagreement and what was dropped.

The original 2026-07-08 spec, plan and migration scripts were removed once the rework landed; they remain in git history.

## Not yet done

- The 30-name gap vocabulary (research §6) is deferred; none of the current pages needed a coined name.
