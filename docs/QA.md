# ClickGuard QA Notes

## Automated verification

The final implementation was verified with `pnpm typecheck` and `pnpm build`. Both completed successfully. The production bundle includes the active Vite app and the static server output. Storybook stories cover more than eight shared components, including buttons, statuses, risk bands, verdicts, KPIs, re-evaluation, visit evidence, empty states, actions, timelines, filters, and badges.

## Manual interaction pass

| Area | Pass criteria | Result |
|---|---|---|
| Default table | Table is populated by default and shows 44 visitors, including a one-visit Watching visitor. | Pass |
| Table density | Compact rows expose IP/geo, status, qualitative risk, visits, lead signal, first seen, and last updated. | Pass |
| Sorting | Visitor, risk, visits, first seen, and last updated headers are keyboard-focusable buttons with visible direction indicators. | Pass |
| Status filter | Watching, Needs a look, Blocked, and Trusted can be selected without hiding the dataset permanently. | Pass |
| Channel and risk filters | Paid, organic, direct, referral and qualitative risk bands are filterable. | Pass |
| Search | Search by IP or ISP filters the table and has a clear affordance. `/` focuses the search field. | Pass |
| Zero results | A non-matching search produces a textual empty state and Reset filters action. | Pass |
| Drill-down | Clicking a visitor opens a right-side Radix Dialog drawer with focus trap, close button, and Esc behavior. | Pass |
| Blocked trail | `203.0.113.72` shows the blocked verdict, Google Ads exclusion, 14-visit dense journey, paid spend chips, and accumulated evidence. | Pass |
| Burst collapse | The blocked visitor shows a collapsed 14-visit node that can be expanded. | Pass |
| Ambiguous trail | `198.51.100.44` shows Needs a look, a Medium confidence re-evaluation card, diagnostics, and a falsifiable prognosis. | Pass |
| Converter rule | `203.0.113.19` shows suspicious phase, purchase validation, auto-cleared narration, and override actions. | Pass |
| Trust reversal | `198.51.100.8` shows a whitelisted visitor with challenged → re-analyzed → unblocked history. | Pass |
| Visitor actions | Unblock, Whitelist, and Mark for review update the local state and preserve a visible toast with Undo. | Pass |
| Bulk actions | Checkbox selection exposes Exclude, Trust, and Export CSV actions. | Pass |
| Export | CSV export uses the currently filtered dataset and includes computed spend. | Pass |
| KPI arithmetic | Spend avoided is calculated from paid `costUsd` values on excluded visitors. | Pass |
| Theme toggle | Light is the default; the topbar toggle switches the generated token theme to dark. | Pass |
| Keyboard | Skip link, visible focus, sortable buttons, checkboxes, search shortcut, drawer close, and Esc behavior are implemented. | Pass |
| Responsive layout | The drawer becomes full width on narrow screens; the table preserves horizontal scanability rather than collapsing meaningfully distinct columns. | Pass |

## Known handoff note

The WebDev session does not include Daniel’s Vercel or Chromatic account connection, so deployment to those external accounts is intentionally left as the next account-connected step. The app preview is live in the current WebDev environment and Storybook source/configuration is checked in under `packages/ui`.
