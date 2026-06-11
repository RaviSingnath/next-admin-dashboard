"use server";

export async function retrieveAddress(sessionToken: string, mapboxId: string) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?session_token=${sessionToken}&access_token=${token}`,
    {
      cache: "no-store",
    },
  );

  const data = await response.json();

  const feature = data.features?.[0];
  const props = feature.properties;
  const context = props.context;

  return {
    place_id: props.mapbox_id,

    address_line_1: props.address,
    address_line_2: props.place_formatted,
    formatted_address: props.full_address,

    city: context.place?.name ?? context.locality?.name ?? null,

    state_province: context.region?.name ?? null,

    country: context.country?.name ?? null,
    country_code: context.country?.country_code_alpha_3 ?? null,

    postal_code: context.postcode?.name ?? null,

    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0],
  };
}
