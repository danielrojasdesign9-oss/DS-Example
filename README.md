# ClickGuard Threat Monitoring

A trust-centered React prototype for PPC invalid traffic monitoring. The experience is designed for an advertiser’s marketing team: scan the visitor queue quickly, then open one visitor and understand the cumulative decision without support.

## Workspace

The repository is a pnpm monorepo with a generic Radix-based UI package in `packages/ui` and ClickGuard domain data and types in `apps/web/src`. The WebDev preview is served from `client/` for the current session and imports the shared package through the `@clickguard/ui` alias. Token source lives in `packages/ui/src/tokens/tokens.ts`; generated CSS is checked in at `packages/ui/src/tokens/tokens.css`.

## Run locally

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm build
pnpm storybook
pnpm build:storybook
```

The main preview is a single Threat Monitoring view. It includes sortable visitor rows, status/channel/risk filters, IP and ISP search, bulk actions with undo, CSV export, light/dark theme switching, and a Radix Dialog drawer for the reasoning trail.

## Dataset scenarios

The mock traffic includes a clearly malicious 14-visit burst added to the Google Ads exclusion list, an ambiguous human-looking visitor with VPN evidence and a falsifiable prognosis, a converted-while-suspicious visitor that auto-clears, a first-timer awaiting interactions/clicks, a whitelisted visitor with reversal history, mixed paid/organic/direct/referral journeys, and rows with no paid clicks.

## Delivery notes

See [`docs/DECISIONS-LOG.md`](docs/DECISIONS-LOG.md) for the structured rationale material and [`docs/QA.md`](docs/QA.md) for the manual verification pass. External Vercel and Chromatic deployment requires Daniel’s connected accounts and is intentionally not performed from this session.
