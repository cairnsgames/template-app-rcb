# TypeScript Migration Checklist

> **Goal:** Convert every `.js` / `.jsx` file in `src/packages/` (and key `src/` root files) to `.ts` / `.tsx`.
>
> **Key rule for unknown API shapes:** instead of typing a response as `any`, import and use `logUntypedResponse` from `src/functions/loguntypedresponse.ts`:
>
> ```ts
> import { logUntypedResponse } from '../../../functions/loguntypedresponse';
>
> const data = logUntypedResponse<unknown>('myPackage.fetchSomething', await res.json());
> ```
>
> `REACT_APP_LOG_UNTYPED_RESPONSES=true` (set in `.env.development`, `false` in `.env.production`) controls whether the `console.warn` fires.  Replace each `logUntypedResponse` call with a real typed assignment once a `*.types.ts` file is created for that response.
>
> **Partial migration already done:**
> - ✅ `src/functions/` — all `.ts` already (`combineurlandpath.ts`, `converttomarkdown.ts`, `extractfilename.ts`, `loguntypedresponse.ts`)
> - ✅ `src/packages/auth/types/user.types.ts` — `User` type exists
> - ✅ `src/packages/kloko/eventform/EventQRCode.tsx` + `EventQRCode.types.ts`
> - ✅ `src/packages/profile/types/property.types.ts`
> - ✅ `src/packages/search2/` — fully converted (`search.tsx`, `search2.types.ts`, all components `.tsx`/`.ts`)
> - ✅ `src/packages/utilities/formattedtext.tsx`
> - ✅ `src/global.d.ts`

---

## Phase 1 — Small / simple packages (no API calls, mostly pure UI or utility)

### 1.1 `src/packages/router`
- [ ] Convert `router.js` → `router.tsx`
- [ ] Convert `route.js` → `route.tsx`
- [ ] Convert `default.js` → `default.tsx`
- [ ] Convert `index.js` → `index.ts`
- [ ] Create `router.types.ts` (RouteProps, RouterProps)
  - [ ] `RouteProps` type
  - [ ] `RouterProps` type

### 1.2 `src/packages/toasts`
- [ ] Convert `toastsprovider.js` → `toastsprovider.tsx`
- [ ] Convert `toasts.js` → `toasts.tsx`
- [ ] Convert `usetoast.js` → `usetoast.ts`
- [ ] Create `toasts.types.ts` (Toast, ToastContext)
  - [ ] `Toast` type
  - [ ] `ToastContextType` type

### 1.3 `src/packages/eventing`
- [ ] Convert `eventing.js` → `eventing.tsx`
- [ ] Convert `useeventing.js` → `useeventing.ts`
- [ ] Create `eventing.types.ts`
  - [ ] `EventingContextType` type

### 1.4 `src/packages/qrcode`
- [ ] Convert `qrcode.js` → `qrcode.tsx`
- [ ] Convert `qrcodesample.js` → `qrcodesample.tsx`

### 1.5 `src/packages/photo`
- [ ] Convert `capturephoto.js` → `capturephoto.tsx`
- [ ] Convert `qrcodescanner.js` → `qrcodescanner.tsx`
- [ ] Remove / archive `capturephoto copy.js`

### 1.6 `src/packages/reviews`
- [ ] Convert `rating.js` → `rating.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `reviews.js` → `reviews.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `stars.js` → `stars.tsx`
- [ ] Create `reviews.types.ts`
  - [ ] `Review` type (untyped — replace once shape known)
  - [ ] `Rating` type (untyped — replace once shape known)

### 1.7 `src/packages/translation`
- [ ] Convert `translationprovider.js` → `translationprovider.tsx`
- [ ] Convert `usetranslation.js` → `usetranslation.ts`
- [ ] Convert `locales.js` → `locales.ts`
- [ ] Convert `locales/en.js` → `locales/en.ts`
- [ ] Convert `locales/af.js` → `locales/af.ts`
- [ ] Convert `summary.js` → `summary.tsx`
- [ ] Create `translation.types.ts`
  - [ ] `TranslationContextType` type

### 1.8 `src/packages/device`
- [ ] Convert `mobiledeviceprovider.js` → `mobiledeviceprovider.tsx`
- [ ] Convert `usedeviceinfo.js` → `usedeviceinfo.ts`
- [ ] Convert `usePushNotifications.js` → `usePushNotifications.ts`
- [ ] Remove / archive `mobiledeviceprovider copy.js`
- [ ] Create `device.types.ts`
  - [ ] `DeviceInfo` type
  - [ ] `DeviceContextType` type

### 1.9 `src/packages/gps`
- [ ] Convert `gpsprovider.js` → `gpsprovider.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `usegps.js` → `usegps.ts`
- [ ] Convert `selectlocationmodal.js` → `selectlocationmodal.tsx`
- [ ] Create `gps.types.ts`
  - [ ] `GpsPosition` type (untyped — replace once shape known)
  - [ ] `GpsContextType` type

### 1.10 `src/packages/forms`
- [ ] Convert `index.js` → `index.ts`
- [ ] Convert `components/form.js` → `components/form.tsx`
- [ ] Convert `components/element.js` → `components/element.tsx`
- [ ] Create `forms.types.ts`
  - [ ] `FormField` type
  - [ ] `FormProps` type

---

## Phase 2 — Infrastructure / cross-cutting packages

### 2.1 `src/packages/datahooks`
- [ ] Convert `usefetch.js` → `usefetch.ts` (has API call — add `logUntypedResponse`)
- [ ] Convert `usedata.js` → `usedata.ts` (has API call — add `logUntypedResponse`)
- [ ] Convert `usefilter.js` → `usefilter.ts`
- [ ] Convert `usepagination.js` → `usepagination.ts`
- [ ] Convert `usesort.js` → `usesort.ts`
- [ ] Create `datahooks.types.ts`
  - [ ] `FetchResult<T>` generic type
  - [ ] `DataHookOptions` type

### 2.2 `src/packages/featureflags`
- [ ] Convert `usefeatureflags.js` → `usefeatureflags.ts` (has API call — add `logUntypedResponse`)
- [ ] Convert `featureflag.js` → `featureflag.tsx`
- [ ] Convert `flagssummarypage.js` → `flagssummarypage.tsx`
- [ ] Convert `summary.js` → `summary.tsx`
- [ ] Create `featureflags.types.ts`
  - [ ] `FeatureFlag` type (untyped — replace once shape known)
  - [ ] `FeatureFlagsContextType` type

### 2.3 `src/packages/settings`
- [ ] Convert `settingsprovider.js` → `settingsprovider.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `usesettings.js` → `usesettings.ts`
- [ ] Convert `settingssummarypage.js` → `settingssummarypage.tsx`
- [ ] Convert `summary.js` → `summary.tsx`
- [ ] Create `settings.types.ts`
  - [ ] `Setting` type (untyped — replace once shape known)
  - [ ] `SettingsContextType` type

### 2.4 `src/packages/store`
- [ ] Convert `storeprovider.js` → `storeprovider.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `usestore.js` → `usestore.ts`
- [ ] Convert `settingssummarypage.js` → `settingssummarypage.tsx`
- [ ] Convert `summary.js` → `summary.tsx`
- [ ] Create `store.types.ts`
  - [ ] `StoreItem` type (untyped — replace once shape known)
  - [ ] `StoreContextType` type

### 2.5 `src/packages/tracker`
- [ ] Convert `trackercontext.js` → `trackercontext.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `usetracker.js` → `usetracker.ts`
- [ ] Convert `tracker.js` → `tracker.tsx`
- [ ] Convert `TrackerTest.js` → `TrackerTest.tsx`
- [ ] Remove / archive `tracker copy.js`, `trackercontext-simple.js`
- [ ] Create `tracker.types.ts`
  - [ ] `TrackerEvent` type (untyped — replace once shape known)
  - [ ] `TrackerContextType` type

---

## Phase 3 — Domain packages with API calls

### 3.1 `src/packages/tenant`
- [ ] Convert `context/tenantprovider.js` → `tenantprovider.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/usetenant.js` → `usetenant.ts`
- [ ] Convert `context/useconfig.js` → `useconfig.ts`
- [ ] Convert `context/useparams.js` → `useparams.ts`
- [ ] Convert `component/summary.js` → `component/summary.tsx`
- [ ] Convert `pages/summarypage.js` → `pages/summarypage.tsx`
- [ ] Create `tenant.types.ts`
  - [ ] `Tenant` type (untyped — replace once shape known)
  - [ ] `TenantContextType` type

### 3.2 `src/packages/auth`
- [ ] Convert `context/authprovider.js` → `authprovider.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/useauth.js` → `useauth.ts`
- [ ] Convert `context/useuser.js` → `useuser.ts`
- [ ] Convert `forms/login.js` → `forms/login.tsx`
- [ ] Convert `forms/register.js` → `forms/register.tsx`
- [ ] Convert `forms/forgot.js` → `forms/forgot.tsx`
- [ ] Convert `forms/changepassword.js` → `forms/changepassword.tsx`
- [ ] Convert `forms/magiclink.js` → `forms/magiclink.tsx`
- [ ] Convert `components/summary.js` → `components/summary.tsx`
- [ ] Update `types/user.types.ts` — already exists ✅, extend as needed
  - [ ] `AuthContextType` type
  - [ ] `LoginRequest` / `RegisterRequest` types (untyped — replace once shapes known)

### 3.3 `src/packages/news`
- [ ] Convert `context/newscontext.js` → `newscontext.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `news.js` → `news.tsx`
- [ ] Convert `newsitem.js` → `newsitem.tsx`
- [ ] Convert `newscard.js` → `newscard.tsx`
- [ ] Convert `newsthumb.js` → `newsthumb.tsx`
- [ ] Convert `fullnewsitem.js` → `fullnewsitem.tsx`
- [ ] Convert `editable.js` → `editable.tsx`
- [ ] Convert `mynews.js` → `mynews.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `mynewseditor.js` → `mynewseditor.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `newsrouting.js` → `newsrouting.tsx`
- [ ] Create `news.types.ts`
  - [ ] `NewsItem` type (untyped — replace once shape known)
  - [ ] `NewsContextType` type

### 3.4 `src/packages/partner`
- [ ] Convert `context/partnercontext.js` → `partnercontext.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `partnerbio.js` → `partnerbio.tsx`
- [ ] Convert `partnerdetail.js` → `partnerdetail.tsx`
- [ ] Convert `partnerlist.js` → `partnerlist.tsx`
- [ ] Convert `partnerevents.js` → `partnerevents.tsx`
- [ ] Convert `partnerclasses.js` → `partnerclasses.tsx`
- [ ] Convert `partnernews.js` → `partnernews.tsx`
- [ ] Convert `partnerrouting.js` → `partnerrouting.tsx`
- [ ] Convert `PartnerFilterModal.jsx` → `PartnerFilterModal.tsx`
- [ ] Create `partner.types.ts`
  - [ ] `Partner` type (untyped — replace once shape known)
  - [ ] `PartnerContextType` type

### 3.5 `src/packages/map`
- [ ] Convert `context/mapprovider.js` → `mapprovider.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/usemapcontext.js` → `usemapcontext.ts`
- [ ] Convert `mapdisplay.js` → `mapdisplay.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `mapevents.js` → `mapevents.tsx`
- [ ] Convert `mapfilter.js` → `mapfilter.tsx`
- [ ] Convert `mappage.js` → `mappage.tsx`
- [ ] Convert `mapSearch.js` → `mapSearch.tsx`
- [ ] Convert `markers.js` → `markers.tsx`
- [ ] Convert `pin.js` → `pin.tsx`
- [ ] Convert `pin2.js` → `pin2.tsx`
- [ ] Convert `pinfunctions.js` → `pinfunctions.ts`
- [ ] Create `map.types.ts`
  - [ ] `MapMarker` type (untyped — replace once shape known)
  - [ ] `MapContextType` type

### 3.6 `src/packages/profile`
- [ ] Convert `profileform.js` → `profileform.tsx`
- [ ] Convert `userpropertyform.js` → `userpropertyform.tsx`
- [ ] Update `types/property.types.ts` — already exists ✅, extend as needed
  - [ ] `ProfileContextType` type (if a provider is added)

### 3.7 `src/packages/membership`
- [ ] Convert `context/membershipsprovider.js` → `membershipsprovider.tsx`
- [ ] Convert `context/usemembership.js` → `usemembership.ts`
- [ ] Convert `forms/application/applicationform.js` → `applicationform.tsx`
- [ ] Convert `forms/application/applicationlist.js` → `applicationlist.tsx`
- [ ] Convert `forms/application/permissions/summary.js` → `summary.tsx`
- [ ] Convert `forms/user/userlist.js` → `userlist.tsx`
- [ ] Convert `membership.js` → `membership.tsx`
- [ ] Create `membership.types.ts`
  - [ ] `Membership` type (untyped — replace once shape known)
  - [ ] `MembershipContextType` type

### 3.8 `src/packages/loyalty`
- [ ] Convert `context/loyaltyprovider.js` → `loyaltyprovider.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/userloyaltyprovider.js` → `userloyaltyprovider.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `userloyaltycards.js` → `userloyaltycards.tsx`
- [ ] Convert `userrewardmodal.js` → `userrewardmodal.tsx`
- [ ] Create `loyalty.types.ts`
  - [ ] `LoyaltyCard` type (untyped — replace once shape known)
  - [ ] `Reward` type (untyped — replace once shape known)
  - [ ] `LoyaltyContextType` type

---

## Phase 4 — Large domain packages

### 4.1 `src/packages/kloko` (context + providers)
> Partial migration done: `eventform/EventQRCode.tsx` + `EventQRCode.types.ts` ✅

- [ ] Convert `context/klokoeventsprovider.js` → `.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/klokolocationprovider.js` → `.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/klokomyeventprovider.js` → `.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/klokoproviders.js` → `.tsx`
- [ ] Convert `context/usebookings.js` → `.ts`
- [ ] Convert `context/useevents.js` → `.ts`
- [ ] Convert `context/uselocations.js` → `.ts`
- [ ] Convert `context/usemyevents.js` → `.ts` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/usesearch.js` → `.ts` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/usetemplates.js` → `.ts`
- [ ] Create `kloko.types.ts`
  - [ ] `KlokoEvent` type (untyped — replace once shape known)
  - [ ] `KlokoLocation` type (untyped — replace once shape known)
  - [ ] `KlokoBooking` type (untyped — replace once shape known)
  - [ ] `KlokoEventsContextType` type
  - [ ] `KlokoLocationContextType` type
  - [ ] `KlokoMyEventContextType` type

### 4.2 `src/packages/kloko` (UI components)
- [ ] Convert `kloko.js` → `kloko.tsx`
- [ ] Convert `klokorouting.js` → `klokorouting.tsx`
- [ ] Convert `klokoevent.js` → `klokoevent.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `klokoevents.js` → `klokoevents.tsx`
- [ ] Convert `klokomyevents.js` → `klokomyevents.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `klokobookingsection.js` → `klokobookingsection.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `klokoform.js` → `klokoform.tsx`
- [ ] Convert `klokoimage.js` → `klokoimage.tsx`
- [ ] Convert `klokosearch.js` → `klokosearch.tsx`
- [ ] Convert `klokoeventsasnews.js` → `klokoeventsasnews.tsx`
- [ ] Convert `klokoeventdetail.js` → `klokoeventdetail.tsx`
- [ ] Convert `klokoeventclasscard.js` → `klokoeventclasscard.tsx`
- [ ] Convert `eventcard.js` → `eventcard.tsx`
- [ ] Convert `eventthumb.js` → `eventthumb.tsx`
- [ ] Convert `eventitem.js` → `eventitem.tsx`
- [ ] Convert `eventdetailsmodal.js` → `eventdetailsmodal.tsx`
- [ ] Convert `eventtemplatemodal.js` → `eventtemplatemodal.tsx`
- [ ] Convert `eventfunctions.js` → `eventfunctions.ts`
- [ ] Convert `FavoriteIcon.js` → `FavoriteIcon.tsx`
- [ ] Convert `LocationSelect.js` → `LocationSelect.tsx`
- [ ] Convert `LocationSelectModal.js` → `LocationSelectModal.tsx`
- [ ] Convert `placesearch.js` → `placesearch.tsx` (has API call — add `logUntypedResponse`)

### 4.3 `src/packages/kloko` (eventform sub-folder)
- [ ] Convert `eventform/coverimage.js` → `.tsx`
- [ ] Convert `eventform/dateandduration.js` → `.tsx`
- [ ] Convert `eventform/displaysettings.js` → `.tsx`
- [ ] Convert `eventform/eventdetails.js` → `.tsx`
- [ ] Convert `eventform/locationsection.js` → `.tsx`
- [ ] Convert `eventform/pricingoptions.js` → `.tsx`
- [ ] Convert `eventform/ticketline.js` → `.tsx`

### 4.4 `src/packages/kloko` (mycalendar + locations sub-folders)
- [ ] Convert `mycalendar/mycalendarcontext.js` → `.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `mycalendar/mycalendar.js` → `.tsx`
- [ ] Convert `mycalendar/mycalendarlist.js` → `.tsx`
- [ ] Convert `locations/LocationEditModal.js` → `.tsx`
- [ ] Convert `locations/UserLocationManagement.js` → `.tsx`
- [ ] Create `mycalendar/mycalendar.types.ts`
  - [ ] `MyCalendarEntry` type (untyped — replace once shape known)

### 4.5 `src/packages/breezo`
- [ ] Convert `context/breezoprovider.js` → `.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/usecart.js` → `.ts` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/useinvoices.js` → `.ts` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/useorders.js` → `.ts` (has API call — add `logUntypedResponse`)
- [ ] Convert `context/usesupplier.js` → `.ts` (has API call — add `logUntypedResponse`)
- [ ] Convert `breezocart.js` → `.tsx`
- [ ] Convert `breezocarttoorder.js` → `.tsx`
- [ ] Convert `breezomyorderdetails.js` → `.tsx`
- [ ] Convert `breezomyorders.js` → `.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `breezoorders.js` → `.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `breezopayorder.js` → `.tsx`
- [ ] Convert `paygate.js` → `.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `paygatebutton.js` → `.tsx`
- [ ] Convert `paynowbutton.js` → `.tsx` (has API call — add `logUntypedResponse`)
- [ ] Create `breezo.types.ts`
  - [ ] `BreezoOrder` type (untyped — replace once shape known)
  - [ ] `BreezoCartItem` type (untyped — replace once shape known)
  - [ ] `BreezoInvoice` type (untyped — replace once shape known)
  - [ ] `BreezoSupplier` type (untyped — replace once shape known)
  - [ ] `BreezoContextType` type

---

## Phase 5 — Remaining packages

### 5.1 `src/packages/classes`
- [ ] Convert `context/ClassContext.jsx` → `ClassContext.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `Classes.jsx` → `Classes.tsx`
- [ ] Convert `ClassesPage.jsx` → `ClassesPage.tsx`
- [ ] Convert `MyClassesPage.jsx` → `MyClassesPage.tsx`
- [ ] Convert `components/AddClassModal.jsx` → `.tsx`
- [ ] Convert `components/BookingModal.jsx` → `.tsx`
- [ ] Convert `components/calendarheader.jsx` → `.tsx`
- [ ] Convert `components/classcard.jsx` → `.tsx`
- [ ] Convert `components/desktopcalendargrid.jsx` → `.tsx`
- [ ] Convert `components/desktopnavigation.jsx` → `.tsx`
- [ ] Convert `components/desktopsearch.jsx` → `.tsx`
- [ ] Convert `components/functions.js` → `.ts`
- [ ] Convert `components/mobiledayview.jsx` → `.tsx`
- [ ] Convert `components/mobilenavigation.jsx` → `.tsx`
- [ ] Convert `components/searchresults.jsx` → `.tsx`
- [ ] Convert `components/weekdaysheader.jsx` → `.tsx`
- [ ] Create `classes.types.ts`
  - [ ] `Class` type (untyped — replace once shape known)
  - [ ] `ClassesContextType` type

### 5.2 `src/packages/content`
- [ ] Convert `contentdisplay.js` → `.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `contentitem.js` → `.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `usefileloader.js` → `.ts` (has API call — add `logUntypedResponse`)
- [ ] Convert `getimagesrc.js` → `.ts`
- [ ] Convert `layout.js` → `.tsx`
- [ ] Convert `layoutitem.js` → `.tsx`
- [ ] Convert `media.js` → `.tsx`
- [ ] Convert `display/imagedescription.js` → `.tsx`
- [ ] Convert `display/imageonly.js` → `.tsx`
- [ ] Convert `display/link.js` → `.tsx`
- [ ] Convert `display/markdown.js` → `.tsx`
- [ ] Convert `display/overlaycard.js` → `.tsx`
- [ ] Convert `display/plaintext.js` → `.tsx`
- [ ] Convert `display/videodescription.js` → `.tsx`
- [ ] Convert `display/videoonly.js` → `.tsx`
- [ ] Convert `edit/imageedit.js` → `.tsx`
- [ ] Create `content.types.ts`
  - [ ] `ContentItem` type (untyped — replace once shape known)
  - [ ] `ContentLayout` type (untyped — replace once shape known)

### 5.3 `src/packages/search` (legacy — superseded by `search2`)
- [ ] Evaluate: keep or delete? If keeping:
  - [ ] Convert `context/searchcontext.js` → `.tsx`
  - [ ] Convert `search.js` → `.tsx`
  - [ ] Convert `searchrouting.js` → `.tsx`
  - [ ] Convert `components/Partner.js` → `.tsx`
  - [ ] Convert `components/SearchDisplay.js` → `.tsx`
  - [ ] Convert `components/SearchItems.js` → `.tsx`
  - [ ] Convert `SearchFilterModal.jsx` → `.tsx`
  - [ ] Create `search.types.ts`
    - [ ] `SearchResult` type
    - [ ] `SearchContextType` type

### 5.4 `src/packages/fullcalendar`
- [ ] Convert `weekview/week.js` → `.tsx` (has API call — add `logUntypedResponse`)
- [ ] Convert `weekview/events.js` → `.tsx`
- [ ] Convert `weekview/CustomModal.js` → `.tsx`
- [ ] Convert `weekview/components/CustomModal.js` → `.tsx`
- [ ] Create `fullcalendar.types.ts`
  - [ ] `CalendarEvent` type (untyped — replace once shape known)

### 5.5 `src/packages/doc` + `src/packages/document`
- [ ] Convert `doc/doc.js` → `doc.tsx`
- [ ] Convert `doc/order.js` → `order.tsx`
- [ ] Convert `document/document.js` → `document.tsx`
- [ ] Convert `document/exampledoc.js` → `exampledoc.tsx`
- [ ] Convert `document/pdf.js` → `pdf.tsx`

### 5.6 `src/packages/layout`
- [ ] Audit files and convert all `.js`/`.jsx` → `.ts`/`.tsx`

### 5.7 `src/packages/apitest`
- [ ] Convert `provider.js` → `provider.tsx` (has API call — add `logUntypedResponse`)
- [ ] Create `apitest.types.ts`
  - [ ] `ApiTestResponse` type (untyped — replace once shape known)

---

## Phase 6 — `src/` root files

- [ ] Convert `src/app.js` → `app.tsx`
- [ ] Convert `src/index.js` → `index.tsx`
- [ ] Convert `src/routing.js` → `routing.tsx` (legacy; consider deleting instead)
- [ ] Convert `src/sitedown.js` → `sitedown.tsx`
- [ ] Create `src/providers/` type files if needed

---

## Progress summary

| Phase | Package(s) | Status |
|-------|-----------|--------|
| Already done | `src/functions/`, `search2`, `utilities/formattedtext`, `auth/types/user.types.ts`, `kloko/eventform/EventQRCode`, `profile/types/property.types.ts` | ✅ |
| 1 | router, toasts, eventing, qrcode, photo, reviews, translation, device, gps, forms | ⬜ |
| 2 | datahooks, featureflags, settings, store, tracker | ⬜ |
| 3 | tenant, auth, news, partner, map, profile, membership, loyalty | ⬜ |
| 4 | kloko (all sub-folders), breezo | ⬜ |
| 5 | classes, content, search (legacy), fullcalendar, doc/document, layout, apitest | ⬜ |
| 6 | `src/` root files | ⬜ |
