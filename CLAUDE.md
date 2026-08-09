# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm start                # webpack-dev-server on :3001, opens browser (dev mode, .env.development)
npm run build:dev        # webpack build, development mode
npm run build            # webpack build, production mode (.env.production)
npm run typecheck        # tsc --noEmit (types only; Babel actually strips/transpiles TS)
```

There is no test runner or linter configured in this repo (no `test`/`lint` script, no jest/eslint config). Verify changes by running `npm start` and exercising the app in the browser.

After changing `.env.development` or `.env.production`, you must restart (`npm start`) — env values are inlined at build time via `dotenv-webpack`.

## Architecture

This is a React web app (Capacitor's native Android layer was removed; there is no native/mobile-app build anymore, just a browser build deployed via `.github/workflows/deploy.yml`). It started from a generic "react-capacitor-bootstrap" template but the active product is a dance-events app ("Juzt.Dance"); vestiges of the generic template remain (e.g. `src/routing.js`, `getbootstrapexamples/`) and are effectively legacy/unused. The "mobile" naming throughout the codebase (`src/mobile/`, `MobileApp`, `MobileDeviceProvider`) refers to a mobile-first responsive layout, not a native app.

### Entry point and the two routers

`src/app.js` renders `Providers` → `MobileApp` (`src/mobile/mobile.js`) → `MobileMain` → the **mobile** router at `src/mobile/routing.js`. This is the router that actually runs today. The desktop-oriented `src/routing.js` (imported nowhere active — `App` renders `MobileApp` directly, the `<Routing />`/`<Container>` block in `app.js` is commented out) is legacy from the template and not on the live path; don't assume changes there affect the running app.

Routing is **not** react-router. It's a bespoke hash router at `src/packages/router/router.js`:
- `<Router isLoggedIn={...}>` reads `window.location.hash` and renders the first matching `<Route>`.
- `<Route is="events/{id}">` — exact match against a template; `{name}` segments are extracted and passed as props to children (and also parsed from the query string).
- `<Route startsWith="events">` — prefix match, used to hand off to a sub-feature's own nested `Routing`/`*routing.js` component (e.g. `KlokoRouting`, `PartnerRouting`, `NewsRouting`, `SearchRouting`).
- `<Route if={condition}>` / `auth` prop (checked against `isLoggedIn`) for conditional routes.
- See `src/packages/router/README.md` for the short usage summary.

Navigation is done by setting `window.location.hash` (e.g. `window.location.href = "#home"`), read via the `useLocation` hook.

### Domain packages (`src/packages/*`, aliased `@cairnsgames/*`)

The bulk of the app's logic lives under `src/packages/<domain>/`, aliased as `@cairnsgames/*` in both `webpack.config.js` (`resolve.alias`) and `tsconfig.json` (`paths`). Each domain package is largely self-contained and typically has its own subset of:
- `context/` — a `<XProvider>` plus `useX.js` hook(s) exposing that domain's state/actions
- `pages/`, `components/`, `forms/` — UI
- `types/` or colocated `*.types.ts` — see conventions below
- `.http` files — manual API request examples for the domain's backend (run with the VS Code REST Client / similar), pointing at that domain's own PHP API

Key domains: `auth`, `tenant`, `settings`, `featureflags`, `translation` (i18next-backed), `toasts`, `gps`/`map`, `search`, `tracker`, `news`, `partner`, `profile`. Two larger domains drive the core product:
- **kloko** — events/classes/calendar booking (`kloko.js`, `klokorouting.js`, `mycalendar/`)
- **breezo** — order placement/payment for tickets (`breezoprovider.js`, `breezomyorders.js`, `breezopayorder.js`)

Each domain typically talks to its own backend at `https://cairnsgames.co.za/php/<domain>/`, configured via a `REACT_APP_<DOMAIN>_API` env var (see `.env.development`) and read through `process.env` at build time via `dotenv-webpack`.

### Provider composition

`src/providers/providers.js` wires app-wide providers that don't need a logged-in user (theme, mobile-device detection, tenant, translation, auth, toasts), then nests `ProvidersWithUser` (`src/providers/providerswithuser.js`), which pulls `user`/`tenant`/`token` from `useUser`/`useTenant` and wires providers that depend on them (feature flags, settings, tracker, then `KlokoProviders` and `BreezoProvider` — both take `useSettings`/`useFeatureFlag` as injected hooks — then news, partner). When adding a new domain provider that needs the logged-in user/tenant, it goes in `providerswithuser.js`, not `providers.js`.

`onError` in `providers.js` redirects to `#sitedown?error=...` — this is the app's global error escape hatch alongside the top-level `ErrorBoundary` in `app.js` (renders `SiteDown`).

`webpack.config.js` also configures `ModuleFederationPlugin` (name `Cairnsgames`) with empty `remotes`/`exposes` — present but not currently used for micro-frontend sharing.

## Conventions (from `.github/copilot-instructions.md`)

- Prefer TypeScript for new files (the codebase is mixed `.js`/`.ts`); prefer `type` over `interface`; never use `any`.
- Store types in colocated `*.types.ts` files next to where they're most relevant — usually alongside a domain's `context` file.
- Prefer arrow functions over function declarations.
- Use `react-bootstrap` components and `react-bootstrap-icons` rather than raw HTML/other icon sets.
- Custom CSS goes in a same-named `.css` file next to the component; avoid inline styles.
