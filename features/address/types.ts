export type Address = {
  place_id: string;

  address_line_1: string;
  address_line_2: string;
  formatted_address: string;

  city: string | null;
  state_province: string | null;
  country: string | null;
  country_code: string | null;
  postal_code: string | null;

  latitude: number;
  longitude: number;
};
