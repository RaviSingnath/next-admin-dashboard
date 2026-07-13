import { TEditAddress } from "@/features/address/address.schema";

export default async function mapAddressFormToDb(data: TEditAddress) {
  return {
    place_id: data.place_id ?? null,

    address_line_1: data.address_line_1 ?? null,

    address_line_2: data.address_line_2 ?? null,

    formatted_address: data.formatted_address ?? null,

    city: data.city,

    state_province: data.state_province,

    country: data.country,

    country_code: data.country_code ?? null,

    postal_code: data.postal_code,

    latitude: data.latitude ?? null,

    longitude: data.longitude ?? null,
  };
}
