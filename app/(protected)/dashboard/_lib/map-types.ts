export interface CustomerMarker {
  id: string;
  country: string;
  lng: number;
  lat: number;
  customers: number;
}

export interface WorldMapProps {
  markers?: CustomerMarker[];
}

export interface CountryProperties {
  ADMIN: string;
  ISO_A2: string;
  ISO_A3: string;
  name?: string;
}

export interface MapState {
  hoveredMarkerId: number | string | null;
  hoveredCountryId: number | string | null;
}
