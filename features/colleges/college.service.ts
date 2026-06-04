import createClient from "@/lib/supabase/server";
import { QueryData } from "@supabase/supabase-js";
import { TCollege } from "./college.schema";
import { createCollegeMutation } from "./college.mutations";
import { getCollegesQuery } from "./college.queries";

export async function createCollege(data: TCollege) {
  const supabase = await createClient();

  // We have constraint colleges_official_email_unique. It's an optional duplicate check
  const { data: existingCollege } = await supabase
    .from("colleges")
    .select("id")
    .eq("official_email", data.official_email)
    .maybeSingle();

  if (existingCollege) {
    throw new Error("College email already exists");
  }

  const { data: college, error } = await createCollegeMutation(data);

  if (error) {
    throw error;
  }

  return college;
}

export async function getCollegesService() {
  const query = getCollegesQuery();

  type RawCollegesResponse = QueryData<typeof query>;

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const collegesData: RawCollegesResponse =
    data?.map((college) => ({
      ...college,
      profiles:
        college.profiles?.filter((profile) => profile.status == "active") ?? [],
    })) ?? [];

  return collegesData;
}

type CollegesListResponse = Awaited<ReturnType<typeof getCollegesService>>;
export type CollegeListItem = CollegesListResponse[number];
