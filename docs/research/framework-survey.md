# How the framework survey was done

The comparison table and each component's framework names come from `framework-alignment.csv`. That file is a manual reading of each design system's **component index** (the list of what it ships), not a deep read of every docs page.

## When

The indexes were read in **November 2026**. Indexes change; treat a "—" as "not listed when surveyed", not a permanent absence.

## The 12 indexes

| System | Index used |
|---|---|
| MUI | https://mui.com/material-ui/all-components/ |
| Bootstrap | https://getbootstrap.com/docs/5.3/components/ |
| Ant Design | https://ant.design/components/overview/ |
| Carbon | https://carbondesignsystem.com/components/overview/ |
| Polaris | https://polaris.shopify.com/components |
| Atlassian | https://atlassian.design/components |
| Chakra UI | https://chakra-ui.com/docs/components/concepts/overview |
| Radix Themes | https://www.radix-ui.com/themes/docs/components/text (sibling pages under `/themes/docs/components/`) |
| shadcn/ui | https://ui.shadcn.com/docs/components |
| Fluent UI | https://react.fluentui.dev/ |
| GOV.UK | https://design-system.service.gov.uk/components/ |
| Apple HIG | https://developer.apple.com/design/human-interface-guidelines/ |

Component galleries linked from those hubs (for example Radix Themes' component list and Fluent's component docs) were used when the hub itself is an overview rather than a flat index.

## What the symbols mean

In the CSV and on the site:

| Symbol | Meaning |
|---|---|
| ● | Same name (or an obvious same-name listing) |
| ◐ | Known alternative name for the same idea |
| ○ | Related component under another name |
| — | No equivalent listed on that system's index when surveyed |
| ? | Not surveyed for that system (or for that component at all) |

"—" means the name was not found on the index at survey time. It does **not** prove the product lacks the pattern (for example under a different product name, or only in a package that the index omits).

"?" means the cell was never checked. Components with `frameworkSource: "none"` show "?" in every column. Components with `frameworkSource: "legacy"` keep results for the five systems from the old hand-written pages (Bootstrap, MUI, Ant Design, Apple HIG, shadcn/ui) and show "?" for the other seven.

## Apple HIG

Apple's Human Interface Guidelines are organized by platform topics, not a single web-component catalog. Mappings in the CSV are **approximate**: they record the closest HIG control or view when one was clear, and "—" when nothing close was listed. Do not treat Apple columns as strictly comparable to the other eleven framework indexes.
