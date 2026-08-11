import createClient from "@/lib/supabase/server";
import { TCollege, TCollegeInfo } from "./college.schema";
import { AddressUpdate } from "../address/types";
import { COLLEGE_LOGO_BUCKET } from "@/lib/constants/db";
import { createAdminClient } from "@/lib/supabase/admin";
import { RecordSubscriptionEventInput } from "@/lib/helper/subscription-events";

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

export const updatecollegeInfo = async (
  collegeId: string,
  data: TCollegeInfo,
) => {
  const supabase = await createClient();

  return supabase
    .from("colleges")
    .update(data)
    .eq("id", collegeId)
    .maybeSingle();
};

export const insertCollegeEvents = async (
  input: RecordSubscriptionEventInput,
) => {
  const supabase = createAdminClient();

  return supabase.from("college_subscription_events").insert({
    college_id: input.collegeId,
    event_type: input.eventType,
    from_plan_id: input.fromPlanId ?? null,
    to_plan_id: input.toPlanId ?? null,
    occurred_at: input.occurredAt ?? new Date().toISOString(),
  });
};
