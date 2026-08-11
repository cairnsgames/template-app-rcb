export type GpsAddressParts = {
  road: string;
  suburb: string;
  city: string;
  county: string;
  state: string;
  postcode: string;
  country: string;
  countryCode: string;
};

export type LocationCache = Record<string, GpsAddressParts>;

export type GPSContextValue = {
  locationDetails: LocationCache;
  loading: boolean;
  getLocationDetails: (lat: number, lng: number) => Promise<GpsAddressParts | null>;
};
