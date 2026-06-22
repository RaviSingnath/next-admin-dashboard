"use server";

import { getCurrentUserServer } from "@/lib/auth/getCurrentUserServer";
import { TEditAddress } from "./address.schema";
import AppError from "@/lib/errors/app-error";
import {
  addAddress,
  addAddressToProfile,
  updateProfileAddress,
} from "./address.mutations";
import { AddressAdd, AddressUpdate } from "./types";
import { RequestContext } from "@/lib/auth/request-context";

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
    country_code: context.country?.country_code ?? null,

    postal_code: context.postcode?.name ?? null,

    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0],
  };
}

type updateAddrerssServiceInput = {
  ctx: RequestContext;
  data: TEditAddress;
};

export async function updateAddrerssService({
  ctx,
  data,
}: updateAddrerssServiceInput) {
  if (ctx.user.status !== "active") {
    throw new Error("Inactive users cannot edit address");
  }

  let dbData: AddressAdd | AddressUpdate = await mapAddressFormToDb(data);

  if (ctx.user.address_id) {
    const { data: updatedProfileAddress, error: updateProfileAddressError } =
      await updateProfileAddress(ctx.user.address_id, dbData);

    if (updateProfileAddressError) throw updateProfileAddressError;

    return {
      profile: updatedProfileAddress,
    };
  } else {
    dbData = { ...dbData, created_by: ctx.user.id };

    const { data: addressAdded, error: addressAddedError } =
      await addAddress(dbData);

    if (addressAddedError) throw addressAddedError;

    const { error: addProfileAddressError } = await addAddressToProfile(
      ctx.user.id,
      addressAdded.id,
    );

    if (addProfileAddressError) throw addProfileAddressError;

    return {
      profile: addressAdded,
    };
  }
}

async function mapAddressFormToDb(data: TEditAddress): Promise<AddressUpdate> {
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
