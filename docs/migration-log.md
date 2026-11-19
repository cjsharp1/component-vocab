# Migration log

> The migration scripts named below (`scripts/legacy/*.mjs`) and the original hand-written pages were removed after the rework; both remain in git history.

Written by `scripts/legacy/extract.mjs` (Phase 3). Lists anything the extractor could not parse or found inconsistent between `index.html` and the pages.

- Components extracted: 50
- Wireframe SVG files written: 307
- Categories: 11

## Issues

- None.

## Phase 5: reconciliation

Written by `scripts/legacy/reconcile.mjs`. Applies `docs/reconciliation.md` §1 with the Q7 names (Stats, Logo cloud, Pricing table, Call to action).

- Folded Container into section: default wireframe kept as variant "Contained width (formerly Container)"; not carried over: Small — max 720px, Medium — max 960px, Large — max 1200px, Full — no max width
- Folded Article into rich-text: default wireframe kept as variant "Article page (formerly Article)"; not carried over: Standard — image top, No image — text only, Metadata above — date before title, Narrow — prose-optimized width
- Folded Banner into alert: default wireframe kept as variant "Announcement (formerly Banner)"; not carried over: Top of page, Bottom of page, Inline — within page content, No icon, no button — message only
- Folded Media into card: default wireframe kept as variant "Horizontal media (formerly Media)"; not carried over: Media left — 50/50 split, Media right — 50/50 split, Media dominant — 60/40 split, Text dominant — 40/60 split
- Folded Profile into card: default wireframe kept as variant "Person (formerly Profile)"; not carried over: Vertical — photo on top, Horizontal — photo on left, Minimal — photo, name, role only, Square photo, Profile List Layout
- Folded Showcase into card: default wireframe kept as variant "Large feature (formerly Showcase)"; not carried over: Image left — 50/50 split, Image right — 50/50 split, Image top — stacked, Image dominant — 60/40 split
- Folded Comparison into table: default wireframe kept as variant "Comparison (formerly Comparison)"; not carried over: Table (rows) — 2 columns, Card columns — side by side, Split (2-panel) — before/after, 3 columns — with highlight
- Folded Marquee into logo-cloud: default wireframe kept as variant "Scrolling (formerly Marquee)"; not carried over: Logos — left-to-right, Text headlines — right-to-left, Images — with pause on hover, Mixed — logos and text
- Folded Mosaic into grid: default wireframe kept as variant "Asymmetric (formerly Mosaic)"; not carried over: Featured + small, Alternating sizes, No gap — seamless, Random pattern
- Folded Callout into alert: default wireframe kept as variant "Note (formerly Callout)"; not carried over: Info — left border accent, Warning — orange accent, Full background tint, Outlined — success/tip
- Renamed Aside (aside) to Sidebar (sidebar)
- Renamed Snapshot (snapshot) to Description list (description-list)
- Renamed Prose (prose) to Rich Text (rich-text)
- Renamed Nav (nav) to Navigation (navigation)
- Renamed Breadcrumb (breadcrumb) to Breadcrumbs (breadcrumbs)
- Renamed Modal (modal) to Dialog (dialog)
- Renamed Progress (progress) to Progress bar (progress-bar)
- Renamed Dropdown (dropdown) to Menu button (menu-button)
- Renamed Divider (divider) to Separator (separator)
- Renamed CTA (cta) to Call to action (call-to-action)
- Renamed Stat (stat) to Stats (stats)
- Renamed Pricing (pricing) to Pricing table (pricing-table)
- Renamed Figure (figure) to Image (image)
- Renamed Logo Cloud to Logo cloud (slug unchanged)
- Feature: not in the CSV; framework names kept from the legacy page for the 5 old systems
- Embed: not in the CSV; framework names kept from the legacy page for the 5 old systems
- Testimonial: not in the CSV; framework names kept from the legacy page for the 5 old systems
- Stats: not in the CSV; framework names kept from the legacy page for the 5 old systems
- Logo cloud: not in the CSV; framework names kept from the legacy page for the 5 old systems
- Description list: not in the CSV; framework names kept from the legacy page for the 5 old systems
- Rich Text: not in the CSV; framework names kept from the legacy page for the 5 old systems
- Call to action: not in the CSV; framework names kept from the legacy page for the 5 old systems
- Pricing table: not in the CSV; framework names kept from the legacy page for the 5 old systems

### Legacy comparison vs CSV (60 cells; the CSV wins)

Legacy column → CSV column: Bootstrap → Bootstrap, Material → MUI, Ant → Ant Design, Apple → Apple HIG, shadcn → shadcn/ui. Qualifiers such as "(partial)" are ignored when comparing.

- Header / Bootstrap: legacy "Navbar (partial)" vs CSV "—"
- Header / MUI: legacy "Top App Bar" vs CSV "App Bar"
- Header / Ant Design: legacy "Layout Header" vs CSV "—"
- Header / Apple HIG: legacy "Navigation Bar" vs CSV "—"
- Footer / Ant Design: legacy "Layout Footer" vs CSV "—"
- Sidebar / Ant Design: legacy "Layout Sider" vs CSV "—"
- Sidebar / Apple HIG: legacy "Sidebar (partial)" vs CSV "—"
- Grid / Bootstrap: legacy "Grid system" vs CSV "Grid"
- Grid / MUI: legacy "—" vs CSV "Grid"
- Grid / Ant Design: legacy "Row/Col" vs CSV "Grid"
- Hero / Bootstrap: legacy "Jumbotron (deprecated)" vs CSV "—"
- Image / Bootstrap: legacy "Figure" vs CSV "Images"
- Image / Apple HIG: legacy "—" vs CSV "Image views"
- Timeline / MUI: legacy "—" vs CSV "Timeline"
- List / Ant Design: legacy "List" vs CSV "List (deprecated)"
- List / Apple HIG: legacy "—" vs CSV "Lists and tables"
- Table / Bootstrap: legacy "Table" vs CSV "Tables"
- Table / MUI: legacy "Data Table" vs CSV "Table"
- Table / Apple HIG: legacy "—" vs CSV "Lists and tables"
- Accordion / MUI: legacy "Expansion Panel" vs CSV "Accordion"
- Accordion / Apple HIG: legacy "Disclosure Group" vs CSV "Disclosure controls"
- Tabs / Bootstrap: legacy "Nav Tabs" vs CSV "Navs & tabs"
- Tabs / Apple HIG: legacy "Segmented Control (partial)" vs CSV "Tab views"
- Navigation / MUI: legacy "Navigation Drawer / Top App Bar" vs CSV "—"
- Navigation / Apple HIG: legacy "Tab Bar / Sidebar" vs CSV "—"
- Breadcrumbs / MUI: legacy "—" vs CSV "Breadcrumbs"
- Pagination / MUI: legacy "—" vs CSV "Pagination"
- Pagination / Apple HIG: legacy "—" vs CSV "Page controls"
- Form / Bootstrap: legacy "Form" vs CSV "Forms"
- Form / MUI: legacy "Text Field / Select" vs CSV "—"
- Form / Apple HIG: legacy "Form" vs CSV "—"
- Form / shadcn/ui: legacy "Form" vs CSV "—"
- Dialog / Apple HIG: legacy "Sheet / Alert" vs CSV "Sheets / Alerts"
- Alert / Bootstrap: legacy "Alert" vs CSV "Alerts"
- Alert / MUI: legacy "Snackbar (partial)" vs CSV "Alert"
- Alert / Apple HIG: legacy "Inline Alert" vs CSV "—"
- Toast / Bootstrap: legacy "Toast" vs CSV "Toasts"
- Toast / Apple HIG: legacy "Banner (partial)" vs CSV "—"
- Toast / shadcn/ui: legacy "Toast / Sonner" vs CSV "Toast"
- Tooltip / Bootstrap: legacy "Tooltip" vs CSV "Tooltips"
- Popover / Bootstrap: legacy "Popover" vs CSV "Popovers"
- Popover / MUI: legacy "Menu (partial)" vs CSV "Popover"
- Popover / Apple HIG: legacy "Popover" vs CSV "Popovers"
- Drawer / MUI: legacy "Side Sheet" vs CSV "Drawer"
- Drawer / Apple HIG: legacy "Sheet" vs CSV "Sheets"
- Drawer / shadcn/ui: legacy "Sheet / Drawer" vs CSV "Sheet"
- Badge / Apple HIG: legacy "Badge" vs CSV "—"
- Skeleton / Bootstrap: legacy "Placeholder" vs CSV "Placeholders"
- Skeleton / MUI: legacy "—" vs CSV "Skeleton"
- Skeleton / Apple HIG: legacy "Redacted" vs CSV "—"
- Progress bar / MUI: legacy "Linear/Circular Progress" vs CSV "Progress"
- Progress bar / Apple HIG: legacy "Progress View" vs CSV "Progress indicators"
- Spinner / Bootstrap: legacy "Spinner" vs CSV "Spinners"
- Spinner / MUI: legacy "Circular Progress (indeterminate)" vs CSV "Progress"
- Spinner / Apple HIG: legacy "Activity Indicator" vs CSV "Progress indicators"
- Menu button / Bootstrap: legacy "Dropdown" vs CSV "Dropdowns"
- Menu button / Apple HIG: legacy "Menu" vs CSV "Pull-down buttons"
- Carousel / MUI: legacy "Carousel" vs CSV "—"
- Avatar / MUI: legacy "—" vs CSV "Avatar"
- Separator / Bootstrap: legacy "—" vs CSV "Vertical rule"

### Cross-references updated

Usage notes, descriptions and element names that pointed at a retired or renamed page now use the new names (39 edits in 26 files): for example "use Profile" became "use the person variant (formerly Profile)", "use Dropdown" became "use Menu button", "use Progress" became "use Progress bar", and Timeline's "use Progress" became "use Steps" (research §4 E). Notes that explain a change on purpose ("rather than a separate Profile component") keep the old name. Testimonial now points to Quote and Timeline to Steps; both are Phase 7 draft pages.

## Phase 7: alias collisions resolved

- Accordion no longer lists "Disclosure" as an alias: Disclosure is its own component (research §5).
- Menu button no longer lists "Dropdown" as an alias (kept in `formerNames`; `components/dropdown.html` still redirects to it). Select keeps "Dropdown", as research §4 lists it. Research §5 retires "Dropdown" as a component name.
- Badge no longer lists "Tag", "Label" or "Chip", and Tag no longer lists "Label": Tag, Label and Chip are their own components, and research R4 reserves "Label" for `<label>`.
- "Stepper" stays an alias of Steps only; research §5 splits it into Steps (process) and Number input (quantity).
- Logo cloud dropped the alias "Logo Cloud" (same as its name).
- Tooltip no longer lists "Toggletip": research §5 keeps Toggletip separate because it behaves differently for assistive tech.
