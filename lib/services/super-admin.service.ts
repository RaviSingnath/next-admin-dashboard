import createClient from "@/lib/supabase/server";
import { QueryData } from "@supabase/supabase-js";
import type { TCollege } from "@/lib/validations/admin/college-schema";

export async function createCollege(data: TCollege) {
  const supabase = await createClient();

  // Optional duplicate check
  const { data: existingCollege } = await supabase
    .from("colleges")
    .select("id")
    .eq("official_email", data.official_email)
    .maybeSingle();

  console.log("existingCollege; ", existingCollege);

  if (existingCollege) {
    throw new Error("College email already exists");
  }

  const { data: college, error } = await supabase
    .from("colleges")
    .insert({
      college_name: data.college_name,
      official_email: data.official_email,
      phone: data.phone,
      country: data.country,
      state: data.state,
      city: data.city,
      postal_code: data.postal_code,
    })
    .select()
    .single();

  console.log("error; ", error);

  if (error) {
    throw error;
  }

  console.log("college; ", college);

  return college;
}

export async function getColleges() {
  const supabase = await createClient();

  const query = supabase.from("colleges").select(`
    id,
    college_name,
    official_email,
    phone,
    logo_url,
    country,
    status,
    stripe_connected_account_id,
    created_at,
    profiles (
      id,
      full_name,
      avatar,
      is_active
    )
  `);

  type RawCollegesResponse = QueryData<typeof query>;

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const collegesData: RawCollegesResponse =
    data?.map((college) => ({
      ...college,
      profiles: college.profiles?.filter((profile) => profile.is_active) ?? [],
    })) ?? [];

  return collegesData;
}

export type CollegesListResponse = Awaited<ReturnType<typeof getColleges>>;

export type CollegeListItem = CollegesListResponse[number];
