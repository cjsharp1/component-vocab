# Reconciliation

**Phase 1 of `docs/plan/vocab-rework-plan.md`. Status: signed off 2026-11-19.** The user accepted every recommendation in §4 and §5, including corrections C1 to C8.

Inputs: `docs/research/component-vocabulary-and-page-structure.md` (the research doc; §-numbers below refer to it unless marked "plan") and `docs/research/framework-alignment.csv` (69 components × 12 design systems). The 50 existing pages are those in `index.html` on `research-inputs`.

## 1. Proposal table

One row per existing page. **Action** follows plan §3. **Gap test** applies the three-part test from research §6 (R7) to every Pattern and Fold row: a pattern gets its own coined name only if (1) no consensus list or major design system names it, (2) it isn't a universally understood region or control, and (3) people describe it with a phrase rather than a noun. For these rows the useful question is criterion 1: does a standard name already exist? If so, use that name and coin nothing.

| # | Existing | Action | Result | Gap test / evidence | Note |
|---|---|---|---|---|---|
| 1 | Container | Fold | Section (width modes) | Fails test 1: research §2 Q1 and §3 call it a render detail of Section. §4 B lists *Container* as "not a block" | Old name goes into the retired-names table |
| 2 | Section | Keep | Section | n/a | `<section aria-labelledby>` only when labelled, else `<div>` (§2 weak spot 1) |
| 3 | Header | Keep | Header | n/a | |
| 4 | Footer | Keep | Footer | n/a | CSV: only GOV.UK ships one (◐) |
| 5 | Aside | Rename | Sidebar | n/a | §4 A: Sidebar, alias Aside |
| 6 | Article | Fold | Rich Text / Card | Fails test 1: §2 weak spot 2 assigns `<article>` to Card and to article-type pages | Two targets: element semantics to Card, body text to Rich Text |
| 7 | Grid | Keep | Grid | n/a | Slot gets its own page later (§4 B "Column (Slot)") |
| 8 | Hero | Keep | Hero | n/a | 0 of 12 in the CSV; on the Gallery index (9). Mark as a page-builder name |
| 9 | Banner | Fold | Alert (announcement variant) | Fails test 1: §4 G lists Banner as an alias of Alert; §5 retires the word (landmark collision) | |
| 10 | Card | Keep | Card | n/a | |
| 11 | Feature | Pattern | Feature (J) | Fails test 1: §6 lists "Feature section" as an already-named marketing section | Already named, so keep it in J (see correction C4) |
| 12 | Media | Fold | Card (horizontal variant) | No research evidence for a separate name. "Media object" is a deprecated Bootstrap term (brief §9) *(inferred)* | |
| 13 | Figure | Fold | Image (captioned) | Fails test 1: §4 C Image renders `<figure>/<figcaption>` when captioned | Gallery layout: open question 6 |
| 14 | Embed | Keep | Embed | Not in the §4 list or the CSV. Appears only as a §3 content block | **Addition** (correction C1) |
| 15 | Profile | Fold | Card + Avatar (person variant) | Fails test 1: §6 lists "Team section" as already named; frameworks compose it from Avatar + Card (brief §9, old comparison table) | |
| 16 | Testimonial | Pattern | Testimonial (J) | Fails test 1: §6 lists "Testimonial" as already named | Overlaps Quote (§4 C); document it as an attributed quote |
| 17 | Stat | Pattern | Stat (J) | Fails test 1: §6 lists "Stats" as already named, and "Milestone, Statline" were dropped coinages for it | §6 uses the plural; see C5 |
| 18 | Showcase | Fold | Card (large variant) | No research evidence for a separate name; nothing behaves differently from a large Card *(inferred)* | |
| 19 | Comparison | Fold | Table (comparison variant) | Fails test 1: §6 dropped "Ledger" because "Comparison table" already names it | |
| 20 | Timeline | Keep | Timeline | n/a | CSV: MUI, Ant, Chakra (3 of 12) |
| 21 | Logo Cloud | Pattern | Logo Cloud (J) | Fails test 1: §6 lists "Logo cloud" as already named | §6 writes "Logo cloud"; see C5 |
| 22 | Marquee | Fold | Logo Cloud (scrolling variant) | Fails test 1: §6 dropped "Marquee" because it's already called "Logo cloud" | |
| 23 | Mosaic | Fold | Grid (asymmetric variant) | No research evidence. "Bento grid" is a common industry name *(inferred, not in the inputs)* | |
| 24 | Callout | Fold | Alert (note variant) | Fails test 1: §4 G lists Callout as an alias of Alert | Pull-quotes go to Quote (§4 C) |
| 25 | Snapshot | Rename | Description list | Not in the §4 list or the CSV. §4 C List covers `dl` | **Addition**; framework evidence unverified (correction C2) |
| 26 | Prose | Rename | Rich Text | n/a | §4 C: Rich Text, alias Prose |
| 27 | List | Keep | List | n/a | |
| 28 | Table | Keep | Table | n/a | |
| 29 | Accordion | Keep | Accordion | n/a | Disclosure gets its own page later (§4 F) |
| 30 | Tabs | Keep | Tabs | n/a | |
| 31 | Nav | Rename | Navigation | n/a | §4 A: Navigation, aliases Nav, Menu |
| 32 | Breadcrumb | Rename | Breadcrumbs | n/a | §4 A canonical form |
| 33 | Pagination | Keep | Pagination | n/a | |
| 34 | CTA | Pattern, rename | Call to action (J) | Fails test 1: §6 lists "CTA section" as already named | Plan picks "Call to action"; §6 says "CTA section" (C5) |
| 35 | Pricing | Pattern | Pricing (J) | Fails test 1: §6 lists "Pricing table" as already named | §6 says "Pricing table" (C5) |
| 36 | Form | Keep | Form | n/a | |
| 37 | Modal | Rename | Dialog | n/a | §5: Dialog, with modal as a variant. Consensus is split, so this one could be flipped |
| 38 | Alert | Keep | Alert | n/a | |
| 39 | Toast | Keep | Toast | n/a | |
| 40 | Tooltip | Keep | Tooltip | n/a | |
| 41 | Popover | Keep | Popover | n/a | |
| 42 | Drawer | Keep | Drawer | n/a | |
| 43 | Badge | Keep | Badge | n/a | |
| 44 | Skeleton | Keep | Skeleton | n/a | |
| 45 | Progress | Rename | Progress bar | n/a | §5: Progress bar vs Meter |
| 46 | Spinner | Keep | Spinner | n/a | |
| 47 | Dropdown | Rename | Menu button | n/a | §5 retires "Dropdown" as a name |
| 48 | Carousel | Keep | Carousel | n/a | |
| 49 | Avatar | Keep | Avatar | n/a | |
| 50 | Divider | Rename | Separator | n/a | §5: Separator |

**Totals:** 24 Keep, 9 Rename, 6 Pattern (Call to action is counted here, not under Rename), 11 Fold = 50. After the change: 39 existing pages stay (33 canonical plus 6 in group J), 11 old slugs become redirects, and Image becomes a new page built from Figure's content (C8), for 40 pages in total.

**Gap test summary:** none of the 17 Pattern and Fold rows passes, so nothing needs a coined name. Twelve fail on criterion 1 with explicit evidence in the research. Four (Media, Showcase, Mosaic, Profile's composition detail) rest on general knowledge, marked *(inferred)*. For Embed and Snapshot the test isn't the issue; they're additions to the canonical list.

## 2. Corrections to the plan found in Phase 1

| # | Plan says | What the inputs show | Proposed fix |
|---|---|---|---|
| C1 | Embed is "Keep", and every Result name is in the §4 list except group J and Description list | Embed appears only in the §3 content-block table, not in the §4 list or the CSV | Treat Embed as a second **addition**, beside Description list |
| C2 | Description list: "Ant, Chakra, Radix and GOV.UK ship it" | Neither input mentions Description list. The CSV has no such row, and §4 C List covers `dl` | Keep the rename, but mark the framework claim *(unverified)* until a CSV row is added with sources |
| C3 | Stub order: "Button 12 of 12; Popover, Tooltip, Checkbox 10; Select, Badge, Breadcrumbs 9" | CSV counts: Button 12, Text input 12, Select 12; Popover 11, Checkbox 11, Badge 11; Tooltip 10; Breadcrumbs 9 | Use the counts in §3 below, which are computed from the CSV |
| C4 | Feature: "Fold into Card if the gap test fails in Phase 1" | Failing the gap test means a standard name already exists, which is a reason to keep a pattern, not fold it. §6 lists "Feature section" as already named | Keep Feature in group J; don't fold |
| C5 | Group J names: Feature, Testimonial, Stat, Logo Cloud, Call to action, Pricing | §6 names them Feature section, Testimonial, Stats, Logo cloud, CTA section, Pricing table | Decide naming in open question 7 |
| C6 | Open question 1: "the instructions said 13 systems" | The CSV has 12 systems. The 13 was an error in the architect prompt, not a missing column | Question 1 is closed: 12 systems |
| C7 | New page "Slot" ("Column" alias) | §4 B canonical is "Column (Slot)", and §3 says "Slot (shown as 'Column')" | Pick one display name in open question 8 |
| C8 | Totals: "39 stay as pages", and Figure folds into Image | Image has no page today, so the fold has to create it. Quote receives only Callout's pull-quote guidance, so it stays a Phase 7 stub | Phase 5 creates `image` from Figure's content, giving 40 pages after Phase 5. The `figure` redirect points to `image` |

## 3. Canonical list

The research §4 list (77 rows), with framework coverage from the CSV and each name's status after reconciliation. **Frameworks** = how many of the 12 systems ship the component in any form (●, ◐ or ○); "n/a" means the CSV has no row. **Status** values:
- `existing`: keeps an existing page under the same name.
- `rename`: an existing page renamed (old name in brackets).
- `fold target`: also absorbs folded pages.
- `new`: no page yet; becomes a Phase 7 draft stub.
- `retired`: not a component.

| Group | Canonical | Frameworks (of 12) | Status |
|---|---|---|---|
| A. Page structure and landmarks | Header | 3 | existing |
| A. Page structure and landmarks | Navigation | 6 | rename (Nav) |
| A. Page structure and landmarks | Main | n/a | new |
| A. Page structure and landmarks | Sidebar | 3 | rename (Aside) |
| A. Page structure and landmarks | Footer | 1 | existing |
| A. Page structure and landmarks | Search | 3 | new |
| A. Page structure and landmarks | Skip link | 2 | new |
| A. Page structure and landmarks | Breadcrumbs | 9 | rename (Breadcrumb) |
| B. Layout primitives | Section | 2 | existing; fold target (Container) |
| B. Layout primitives | Grid | 7 | existing; fold target (Mosaic) |
| B. Layout primitives | Column (Slot) | 1 | new |
| B. Layout primitives | Stack | 7 | new |
| B. Layout primitives | Separator | 8 | rename (Divider) |
| B. Layout primitives | Visually hidden | 4 | new |
| B. Layout primitives | Container | 4 | retired (folded into Section) |
| C. Content display | Heading | 9 | new |
| C. Content display | Rich Text | n/a | rename (Prose); fold target (Article (part)) |
| C. Content display | Image | 7 | new page created in Phase 5 from Figure's content; fold target (Figure) |
| C. Content display | Video | n/a | new |
| C. Content display | Icon | 6 | new |
| C. Content display | Avatar | 8 | existing; fold target (Profile (part)) |
| C. Content display | Quote | 2 | new; fold target (Callout pull-quotes) |
| C. Content display | List | 8 | existing |
| C. Content display | Table | 11 | existing; fold target (Comparison) |
| C. Content display | Card | 8 | existing; fold target (Article (part), Media, Profile, Showcase) |
| C. Content display | Hero | 0 | existing |
| C. Content display | Empty state | 5 | new |
| C. Content display | File | n/a | new |
| D. Actions and links | Link | 7 | new |
| D. Actions and links | Button | 12 | new |
| D. Actions and links | Button group | 6 | new |
| D. Actions and links | Menu button | 11 | rename (Dropdown) |
| D. Actions and links | Segmented control | 7 | new |
| D. Actions and links | Switch | 10 | new |
| D. Actions and links | Toggle button | 2 | new |
| E. Wayfinding and sequence | Tabs | 11 | existing |
| E. Wayfinding and sequence | Pagination | 9 | existing |
| E. Wayfinding and sequence | Steps | 5 | new |
| E. Wayfinding and sequence | Timeline | 3 | existing |
| E. Wayfinding and sequence | Tree view | 5 | new |
| E. Wayfinding and sequence | Feed | n/a | new |
| E. Wayfinding and sequence | Mega menu | n/a | new |
| F. Disclosure and overlays | Accordion | 9 | existing |
| F. Disclosure and overlays | Disclosure | n/a | new |
| F. Disclosure and overlays | Dialog | 11 | rename (Modal) |
| F. Disclosure and overlays | Alert dialog | 4 | new |
| F. Disclosure and overlays | Drawer | 8 | existing |
| F. Disclosure and overlays | Popover | 11 | existing |
| F. Disclosure and overlays | Tooltip | 10 | existing |
| F. Disclosure and overlays | Toggletip | 2 | new |
| G. Feedback and status | Alert | 11 | existing; fold target (Banner, Callout) |
| G. Feedback and status | Toast | 7 | existing |
| G. Feedback and status | Badge | 11 | existing |
| G. Feedback and status | Tag | 6 | new |
| G. Feedback and status | Chip | 2 | new |
| G. Feedback and status | Progress bar | 11 | rename (Progress) |
| G. Feedback and status | Meter | 1 | new |
| G. Feedback and status | Spinner | 11 | existing |
| G. Feedback and status | Skeleton | 8 | existing |
| G. Feedback and status | Rating | 5 | new |
| H. Forms | Form | 4 | existing |
| H. Forms | Fieldset | 2 | new |
| H. Forms | Label | 2 | new |
| H. Forms | Text input | 12 | new |
| H. Forms | Textarea | 9 | new |
| H. Forms | Select | 12 | new |
| H. Forms | Combobox | 6 | new |
| H. Forms | Checkbox | 11 | new |
| H. Forms | Radio group | 11 | new |
| H. Forms | Slider | 10 | new |
| H. Forms | Number input | 6 | new |
| H. Forms | Date input | 3 | new |
| H. Forms | Date picker | 7 | new |
| H. Forms | File upload | 5 | new |
| H. Forms | Color picker | 4 | new |
| I. Collections | Carousel | 5 | existing |
| I. Collections | Data grid | n/a | new |

**Additions not in the §4 list:**

| Name | Group | Status | Source |
|---|---|---|---|
| Description list | C. Content display | rename (Snapshot) | Plan §3; framework evidence unverified (C2) |
| Embed | C. Content display | existing | Research §3 content blocks (C1) |
| Feature | J. Page patterns | existing | Research §6 "Feature section" |
| Testimonial | J. Page patterns | existing | Research §6 |
| Stat | J. Page patterns | existing | Research §6 "Stats" |
| Logo Cloud | J. Page patterns | existing, fold target (Marquee) | Research §6 "Logo cloud" |
| Call to action | J. Page patterns | rename (CTA) | Research §6 "CTA section" |
| Pricing | J. Page patterns | existing | Research §6 "Pricing table" |

**Draft stub order for Phase 7** (`new` names by framework coverage, highest first; names with no CSV row go last): Button (12), Text input (12), Select (12), Checkbox (11), Radio group (11), Switch (10), Slider (10), Heading (9), Textarea (9), Stack (7), Link (7), Segmented control (7), Date picker (7), Icon (6), Button group (6), Tag (6), Combobox (6), Number input (6), Empty state (5), Steps (5), Tree view (5), Rating (5), File upload (5), Visually hidden (4), Alert dialog (4), Color picker (4), Search (3), Date input (3), Skip link (2), Quote (2), Toggle button (2), Toggletip (2), Chip (2), Fieldset (2), Label (2), Column (Slot) (1), Meter (1), Main (n/a), Video (n/a), File (n/a), Feed (n/a), Mega menu (n/a), Disclosure (n/a), Data grid (n/a). Total: 44 (Image is excluded because Phase 5 creates it from Figure).

## 4. Decisions

Recommendations repeat the plan unless a correction above changes them. Fill in the **Answer** column (yes / no / changed: …).

| # | Decision | Recommendation | Needs confirmation | Answer |
|---|---|---|---|---|
| D1 | Reconciliation | The research list wins; apply §1 of this document | | Yes (accepted) |
| D2 | Source of truth | One JSON file per component in `data/components/`, a JSON Schema, and a dependency-free `scripts/build.mjs`. Generated HTML is committed. This relaxes "no build tools, no npm" to "no dependencies" | **Yes** | Yes (accepted) |
| D3 | Gap vocabulary (research §6) | Not in this rework. §1 shows none of the existing patterns needs a coined name, so no blocker remains for a later pass | | Yes (accepted) |
| D4 | Comparison table | The CSV's 12 systems replace the current 5; Material becomes MUI | Yes (column naming, see Q5) | Yes (accepted) |
| D5 | Taxonomy | Research groups A to I, plus J "Page patterns (not framework consensus)" for the six patterns | **Yes** | Yes (accepted) |
| D6 | Retired and renamed slugs | Small redirect pages (meta refresh plus a visible link) | Yes | Yes (accepted) |
| D7 | Universal config table | One shared section instead of a copy on every page | | Yes (accepted) |
| D8 | Where `design/overhaul` lands | Merged in Phase 2, before extraction | | Yes (accepted) |

## 5. Open questions

| # | Question | Recommendation | Answer |
|---|---|---|---|
| Q1 | Which framework is missing from the CSV? | **Closed** (C6): none; 12 is correct | — |
| Q2 | Should Text/Typography, Code, Calendar, Scroll area, Hover card, Context menu, Aspect ratio or Kbd join the canonical list? | Not in this rework. None is in the CSV or §4, so they'd need evidence first; log them for the gap pass | Yes (accepted) |
| Q3 | Redirect stubs for old URLs, or delete them? | Redirects (D6). They cost 11 tiny files and keep links working | Yes (accepted) |
| Q4 | Keep group J, or fold or drop those patterns? | Keep J. §6 explicitly treats all six as already-named sections | Yes (accepted) |
| Q5 | MUI or Material Design 3 for the comparison column? | MUI, because that is what the CSV records. Note in the key that Material 3 names some things differently | Yes (accepted) |
| Q6 | Old Figure "Gallery layout": Image variant, or a new Gallery component? | Image variant. Gallery isn't in §4 or the CSV, and §2 Q3 treats it as a multi-up block with a "per row" setting, which fits a variant | Yes (accepted) |
| Q7 | Group J names: the plan's short forms (Feature, Stat, Pricing, Call to action) or §6's forms (Feature section, Stats, Pricing table, CTA section)? (C5) | §6's forms with "section" dropped where the group already implies it: Feature, Testimonial, Stats, Logo cloud, Call to action, Pricing table. Follows R1 (name the thing) and avoids the abbreviation | Yes (accepted) |
| Q8 | "Slot" or "Column" as the page name for the Grid cell? (C7) | **Slot** as canonical, "Column" as alias. It matches the research's data model and avoids implying a free-standing block | Yes (accepted) |
