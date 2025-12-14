LocationSearch Component
========================

A compact React component that provides an input for searching geographic places (cities, towns, suburbs, villages, hamlets) using the OpenStreetMap Nominatim API.

File
----
- Component source: `src/components/LocationSearch.tsx`
- Optional built output: `src/components/LocationSearch.js` (created by `npm run build:ts`)

Props
-----
- value?: string
  - Optional initial value to prefill the input.

- onSelected?: (record: NominatimResult) => void
  - Callback executed when a location is selected. Receives the raw Nominatim result object.

- lat?: number, lng?: number
  - Optional fallback coordinates used to sort results by distance when browser geolocation is unavailable or denied.

- className?: string
  - Optional CSS class(es) to merge into the component's root element. The component keeps its default `w-100` class and appends any provided `className`.

- style?: React.CSSProperties
  - Optional inline style object applied to the root element.

- debounceDelay?: number
  - Optional debounce delay (in milliseconds) used for typing before the component fires the search request. Defaults to 500.

Behavior
--------
- Prefills the input if `value` is provided.
- Attempts to detect user location via `navigator.geolocation`. If denied or unavailable, it uses the `lat`/`lng` props (if provided).
- Debounces user input (default 500ms) before calling the Nominatim API. Results are filtered to specific place types and optionally sorted by distance from the user.
- The component requires a valid `User-Agent` header when calling the Nominatim API; the component includes a default `User-Agent` string for development. If you publish or reuse this component in production, replace the User-Agent with your application name and a contact address.

Basic usage example
-------------------
```tsx
import LocationSearch from './components/LocationSearch';

function App() {
  const handleSelected = (loc) => {
    console.log('Selected location:', loc);
  };

  return (
    <div className="p-4">
      <LocationSearch onSelected={handleSelected} debounceDelay={300} className="my-search" />
    </div>
  );
}
```

Types
-----
- The component uses `NominatimResult` and `LocationResult` types defined in `src/types/location.ts`. See that file for shape details.

License
-------
MIT
