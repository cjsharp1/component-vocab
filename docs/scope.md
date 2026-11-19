# Scope: names considered and not added

The framework survey (`docs/research/framework-alignment.csv`) covers the 76 names in the research list. The indexes also list components that aren't in it. This page records what was decided about the ones that appeared in several frameworks, so the question isn't reopened without new evidence.

Counts are how many of the 12 surveyed indexes list the name, from the survey that produced the CSV. An index lists what a framework ships; it doesn't prove a framework lacks something.

| Name | In indexes | Decision | Why |
|---|---|---|---|
| Text, Typography | about 9 | Aliases of Rich Text | They name a styled run of text. Heading and Rich Text already cover the HTML elements involved, and a separate "Text" would overlap both. |
| Code, Code block | 5 | Candidate to add | Native elements (`<code>`, `<pre>`), a clear accessibility story, and several frameworks ship them. Not added yet: the per-framework mapping for all 12 systems has to be verified first (Carbon, Polaris and Apple HIG weren't re-checked). |
| Kbd | 3 | Candidate to add, with Code | Native `<kbd>` element. Same verification gap. |
| Calendar | 4 | Alias of Date picker | A calendar grid is the popup part of a Date picker. A standalone, read-only calendar could become its own entry if someone needs it. |
| Hover card | 3 | Not added | Interactive content that opens on hover fails keyboard and touch use. The vocabulary already has Tooltip (non-interactive) and Popover (interactive, click-opened). |
| Context menu | 3 | Not added | An action menu opened from a right-click. It would be a trigger variant of a menu, and the vocabulary has Menu button but no bare Menu. Revisit if Menu becomes its own entry. |
| Scroll area | 3 to 4 | Not added | A styling wrapper for custom scrollbars, not a content component. |
| Aspect ratio | 3 | Not added | A layout utility (CSS `aspect-ratio`), not a component. |
| Command, Backdrop, Splitter | 2 each | Not added | Too few frameworks, and each overlaps an existing name (Combobox, Dialog, Grid). |

To add one of these, follow "Adding a component" in the README, and update this table.
