import createClient from "@/lib/supabase/server";
import { TCollege } from "./college.schema";
import { AddressUpdate } from "../address/types";

export const createCollegeMutation = async (data: TCollege) => {
  const supabase = await createClient();

  return supabase.from("colleges").insert(data).select().single();
};

export const updateCollegeAddress = async (
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

export const addAddressToCollege = async (
  collegeId: string,
  addressId: string,
) => {
  const supabase = await createClient();

  return supabase
    .from("colleges")
    .update({ address_id: addressId })
    .eq("id", collegeId)
    .maybeSingle();
};
