import createClient from "@/lib/supabase/server";
import { QueryData } from "@supabase/supabase-js";

export async function collegeWithAddressQuery(collegeId: string) {
  const supabase = await createClient();

  return supabase
    .from("colleges")
    .select(
      `
      id, 
      addresses!colleges_address_id_fkey (
        address_line_2,
        city,
        state_province,
        country,
        postal_code,
        place_id,
        latitude,
        longitude
      )
      `,
    )
    .eq("id", collegeId)
    .single();
}

export type CollegeWithAddress = QueryData<
  ReturnType<typeof collegeWithAddressQuery>
>;

export type CollegeAddress = CollegeWithAddress["addresses"];
