import createClient from "@/lib/supabase/server";
import { TCollege } from "./college.schema";
import { AddressUpdate } from "../address/types";
import { COLLEGE_LOGO_BUCKET } from "@/lib/constants/db";

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

export const uploadLogo = async (filePath: string, webpBuffer: Buffer) => {
  const supabase = await createClient();

  return supabase.storage
    .from(COLLEGE_LOGO_BUCKET)
    .upload(filePath, webpBuffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: "image/webp",
    });
};

export const updateLogoPath = async (collegeId: string, filePath: string) => {
  const supabase = await createClient();

  return supabase
    .from("colleges")
    .update({ logo_url: filePath })
    .eq("id", collegeId)
    .maybeSingle();
};
