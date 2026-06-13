import createClient from "@/lib/supabase/server";
import { AddressAdd, AddressUpdate } from "./types";

export const addAddress = async (data: AddressAdd) => {
  const supabase = await createClient();

  return supabase.from("addresses").insert(data).select().single();
};

export const addAddressToProfile = async (
  userID: string,
  addressID: string,
) => {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .update({ address_id: addressID })
    .eq("id", userID)
    .maybeSingle();
};

export const updateProfileAddress = async (
  addressID: string,
  data: AddressUpdate,
) => {
  const supabase = await createClient();

  return supabase
    .from("addresses")
    .update(data)
    .eq("id", addressID)
    .select()
    .maybeSingle();
};
