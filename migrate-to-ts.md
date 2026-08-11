# TypeScript Migration Plan

Convert all `src/packages/*` from JavaScript to TypeScript, following conventions in `.github/copilot-instructions.md`.

## Rules

- Prefer `type` over `interface`; never use `any`
- Store types in colocated `*.types.ts` files next to the context or main entry point
- Use arrow functions
- When an API response has no real type yet, use `logUntypedResponse` (see [src/functions/loguntypedresponse.ts](src/functions/loguntypedresponse.ts)):

```ts
import { logUntypedResponse } from "../../functions/loguntypedresponse";

const data = logUntypedResponse<unknown>("myprovider.fetchSomething", await res.json());
```

- `REACT_APP_LOG_UNTYPED_RESPONSES=true` in `.env.development` gates those warnings (already set)
- Once a real type is defined in `*.types.ts`, replace `logUntypedResponse` with a normal typed cast and tick off the type below

---

## Already Done

### src/functions/ ✅
All files already `.ts`.

### src/hooks/ ✅
All files already `.ts`.

### src/packages/search2 ✅
Fully migrated — context, components, types all `.ts`/`.tsx`.

---

## Phase 1 — Tiny packages (no API calls, pure UI / utilities) ✅

### `src/packages/doc` (2 files)
- [x] Convert files to `.ts`/`.tsx`

### `src/packages/eventing` (2 files)
- [x] Convert files to `.ts`/`.tsx`

### `src/packages/qrcode` (3 files)
- [x] Convert files to `.ts`/`.tsx`

### `src/packages/photo` (3 files)
- [x] Convert files to `.ts`/`.tsx`

### `src/packages/document` (3 files)
- [x] Convert files to `.ts`/`.tsx`

### `src/packages/layout` (7 tile components)
- [x] Convert files to `.ts`/`.tsx`
- [x] Create `layout.types.ts` — `TileData`, `TileRawData` types

### `src/packages/utilities` (partial — `formattedtext.tsx` already done)
- [x] Convert remaining files to `.ts`/`.tsx`

---

## Phase 2 — Small utility hooks & providers ✅

### `src/packages/toasts` (3 files)
No external API — pure client-side state.
- [x] Convert `toastsprovider.js` → `.tsx`
- [x] Convert `toasts.js` → `.tsx`
- [x] Convert `usetoast.js` → `.ts`
- [x] Create `toasts.types.ts`

### `src/packages/featureflags` (4 files)
Endpoint: `POST ${REACT_APP_FLAGS_API}/getfeatureflags.php`
- [x] Convert `featureflag.js` → `.tsx`
- [x] Convert `usefeatureflags.js` → `.ts`
- [x] Convert `flagssummarypage.js` → `.tsx`
- [x] Convert `summary.js` → `.tsx`
- [x] Create `featureflags.types.ts`
  - [ ] Type `GetFeatureFlagsResponse` for `POST .../getfeatureflags.php`

### `src/packages/device` (4 files)
No external API — uses `@capacitor/device`; `DeviceInfo` and `DeviceId` types come from the library.
- [x] Convert `mobiledeviceprovider.js` → `.tsx`
- [x] Convert `usedeviceinfo.js` → `.ts`
- [x] Convert `usePushNotifications.js` → `.ts`
- [x] Create `device.types.ts`

### `src/packages/gps` (4 files)
Endpoint: `GET https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lng}&format=json`
- [x] Convert `gpsprovider.js` → `.tsx`
- [x] Convert `usegps.js` → `.ts`
- [x] Convert `selectlocationmodal.js` → `.tsx`
- [x] Create `gps.types.ts`
  - [ ] Type `NominatimReverseResponse` for `GET nominatim.openstreetmap.org/reverse`

### `src/packages/settings` (4 files)
Endpoint: `GET ${REACT_APP_SETTINGS_API}/mysettings/${userId}`
- [x] Convert `settingsprovider.js` → `.tsx`
- [x] Convert `usesettings.js` → `.ts`
- [x] Convert `settingssummarypage.js` → `.tsx`
- [x] Convert `summary.js` → `.tsx`
- [x] Create `settings.types.ts`
  - [ ] Type `Setting` for `GET .../mysettings/${userId}`

---

## Phase 3 — Data utilities & forms

### `src/packages/datahooks` (5 files: usedata, usefetch, usefilter, usepagination, usesort)
- [ ] Convert to `.ts`/`.tsx`
- [ ] Create `datahooks.types.ts`
  - [ ] `FetchState<T>` generic type
  - [ ] `PaginationState` type
  - [ ] `SortState` type
  - [ ] `FilterState` type

### `src/packages/forms` (index + components/)
- [ ] Convert to `.ts`/`.tsx`
- [ ] Create `forms.types.ts`
  - [ ] `FormField` type
  - [ ] `FormConfig` type

### `src/packages/router` (custom hash router)
- [ ] Convert to `.ts`/`.tsx`
- [ ] Create `router.types.ts`
  - [ ] `RouteProps` type
  - [ ] `RouterProps` type

---

## Phase 4 — Core providers (auth, profile, tenant, translation, tracker)

### `src/packages/auth` (partial — `types/user.types.ts` exists)
Existing types: `Permission`, `User`
- [ ] Convert `authprovider.js` → `.tsx`
- [ ] Convert `useauth.js` → `.ts`
- [ ] Convert `useuser.js` → `.ts`
- [ ] Convert form components (5 files) → `.tsx`
- [ ] Extend `user.types.ts` as needed
  - [x] `Permission` type
  - [x] `User` type
  - [ ] `AuthContext` type
  - [ ] API response types for auth endpoints → `logUntypedResponse` until typed

### `src/packages/profile` (partial — `types/property.types.ts` exists)
Existing types: `PropertyValue`, `Property`
- [ ] Convert `profileform.js` → `.tsx`
- [ ] Convert `userpropertyform.js` → `.tsx`
- [ ] Extend `property.types.ts` as needed
  - [x] `PropertyValue` type
  - [x] `Property` type
  - [ ] `Profile` type
  - [ ] API response types for profile endpoints → `logUntypedResponse` until typed

### `src/packages/tenant` (4 context files + component/ + pages/)
- [ ] Convert context files to `.ts`/`.tsx`
  - [ ] `tenantprovider.js` → `.tsx`
  - [ ] `useconfig.js` → `.ts`
  - [ ] `useparams.js` → `.ts`
  - [ ] `usetenant.js` → `.ts`
- [ ] Convert component/ and pages/ to `.tsx`
- [ ] Create `tenant.types.ts`
  - [ ] `Tenant` type
  - [ ] `TenantConfig` type
  - [ ] `TenantContext` type
  - [ ] API response type for tenant fetch → `logUntypedResponse` until typed

### `src/packages/translation` (4 files + locales/)
- [ ] Convert to `.ts`/`.tsx`
- [ ] Create `translation.types.ts`
  - [ ] `TranslationConfig` type

### `src/packages/tracker` (7 files)
- [ ] Convert to `.ts`/`.tsx`
- [ ] Create `tracker.types.ts`
  - [ ] `TrackEvent` type
  - [ ] API response type for tracker → `logUntypedResponse` until typed

---

## Phase 5 — Feature packages (reviews, store, search, map, news, partner)

### `src/packages/reviews` (3 files)
- [ ] Convert to `.ts`/`.tsx`
- [ ] Create `reviews.types.ts`
  - [ ] `Review` type
  - [ ] API response types → `logUntypedResponse` until typed

### `src/packages/store` (4 files)
- [ ] Convert to `.ts`/`.tsx`
- [ ] Create `store.types.ts`
  - [ ] `StoreItem` type
  - [ ] `StoreState` type
  - [ ] API response types → `logUntypedResponse` until typed

### `src/packages/search` (4 files)
- [ ] Convert to `.ts`/`.tsx`
- [ ] Create `search.types.ts`
  - [ ] `SearchQuery` type
  - [ ] `SearchResult` type
  - [ ] API response types → `logUntypedResponse` until typed

### `src/packages/map` (13 files)
- [ ] Convert context files to `.ts`/`.tsx`
- [ ] Convert component files to `.tsx`
- [ ] Create `map.types.ts`
  - [ ] `MapMarker` type
  - [ ] `MapConfig` type
  - [ ] `MapContext` type
  - [ ] API response types → `logUntypedResponse` until typed

### `src/packages/news` (14 files)
- [ ] Convert `newscontext.js` → `.tsx`
- [ ] Convert remaining files to `.tsx`
- [ ] Create `news.types.ts`
  - [ ] `NewsItem` type
  - [ ] `NewsContext` type
  - [ ] API response types → `logUntypedResponse` until typed

### `src/packages/partner` (9 files)
- [ ] Convert `partnercontext.js` → `.tsx`
- [ ] Convert remaining files to `.tsx`
- [ ] Create `partner.types.ts`
  - [ ] `Partner` type
  - [ ] `PartnerContext` type
  - [ ] API response types → `logUntypedResponse` until typed

---

## Phase 6 — Complex packages (membership, loyalty, breezo, classes, content, kloko)

### `src/packages/membership`
- [ ] Convert context files to `.ts`/`.tsx`
  - [ ] `membershipsprovider.js` → `.tsx`
  - [ ] `usemembership.js` → `.ts`
- [ ] Convert forms/ to `.tsx`
- [ ] Create `membership.types.ts`
  - [ ] `Membership` type
  - [ ] `MembershipContext` type
  - [ ] API response types → `logUntypedResponse` until typed

### `src/packages/loyalty` (context + 8 files + cards/)
- [ ] Convert context files to `.ts`/`.tsx`
- [ ] Convert remaining files to `.tsx`
- [ ] Create `loyalty.types.ts`
  - [ ] `LoyaltyCard` type
  - [ ] `LoyaltyContext` type
  - [ ] API response types → `logUntypedResponse` until typed

### `src/packages/breezo` (5 context files + 5 other files)
- [ ] Convert context files to `.ts`/`.tsx`
  - [ ] `breezoprovider.js` → `.tsx`
  - [ ] `usecart.js` → `.ts`
  - [ ] `useinvoices.js` → `.ts`
  - [ ] `useorders.js` → `.ts`
  - [ ] `usesupplier.js` → `.ts`
- [ ] Convert remaining files to `.tsx`
- [ ] Create `breezo.types.ts`
  - [ ] `CartItem` type
  - [ ] `Order` type
  - [ ] `Invoice` type
  - [ ] `Supplier` type
  - [ ] `BreezoContext` type
  - [ ] API response types → `logUntypedResponse` until typed

### `src/packages/classes`
- [ ] Convert `ClassContext.jsx` → `.tsx`
- [ ] Convert `Classes.jsx`, `ClassesPage.jsx`, `MyClassesPage.jsx` → `.tsx`
- [ ] Convert components/ and mockData/ to `.ts`/`.tsx`
- [ ] Create `classes.types.ts`
  - [ ] `Class` type
  - [ ] `ClassContext` type
  - [ ] API response types → `logUntypedResponse` until typed

### `src/packages/content` (8 files + display/ + edit/)
- [ ] Convert all files to `.ts`/`.tsx`
- [ ] Create `content.types.ts`
  - [ ] `ContentItem` type
  - [ ] API response types → `logUntypedResponse` until typed

### `src/packages/kloko` (partial — `EventQRCode.tsx` + `EventQRCode.types.ts` exist)
Existing types: `EventQRCodeEvent`, `EventQRCodeProps`
- [ ] Convert context files (10 .js) to `.ts`/`.tsx`
- [ ] Convert remaining component files to `.tsx`
- [ ] Create `kloko.types.ts` (main domain types)
  - [ ] `KlokoEvent` type
  - [ ] `KlokoClass` type
  - [ ] `KlokoBooking` type
  - [ ] `KlokoContext` type
  - [ ] API response types → `logUntypedResponse` until typed
  - [x] `EventQRCodeEvent` type (in `eventform/EventQRCode.types.ts`)
  - [x] `EventQRCodeProps` type (in `eventform/EventQRCode.types.ts`)

---

## Phase 7 — Remaining packages

### `src/packages/apitest`
- [ ] Convert `provider.js` → `.ts`/`.tsx`

### `src/packages/fullcalendar`
- [ ] Convert weekview/ files to `.ts`/`.tsx`

---

## Tracking: All `logUntypedResponse` calls still in use

Run `grep -r "logUntypedResponse(" src` to see which API responses still need real types.
Once a type is defined and the call replaced, tick off the relevant type above.

---

## Migration reference: `logUntypedResponse` usage pattern

```ts
// Before typing is known
const data = logUntypedResponse<unknown>("myprovider.fetchItems", await res.json());

// After *.types.ts type is created
const data = (await res.json()) as MyItemType[];
```

env gating — `REACT_APP_LOG_UNTYPED_RESPONSES` is `true` in `.env.development` and `false` in `.env.production`, so warnings only appear locally.
