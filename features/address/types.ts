import { Database } from "@/supabase/database.types";

export type Address = {
  place_id: string;

  address_line_1: string;
  address_line_2: string;
  formatted_address: string;

  city: string;
  state_province: string;
  country: string;
  country_code: string;
  postal_code: string;

  latitude: number;
  longitude: number;
};

export type AddressUpdate =
  // Database["public"]["Tables"]["addresses"]["Update"];

  {
    place_id?: string | null;

    address_line_1?: string | null;
    address_line_2?: string | null;

    formatted_address?: string | null;

    city: string;
    state_province: string;

    country: string;
    country_code?: string | null;

    postal_code: string;

    latitude?: number | null;
    longitude?: number | null;
  };

export type AddressAdd = AddressUpdate & { created_by: string };
