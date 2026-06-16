import { QueryData } from "@supabase/supabase-js";
import { TCollege } from "./college.schema";
import { createCollegeMutation } from "./college.mutations";
import { getCollegeByEmailQuery, getCollegesQuery } from "./college.queries";
import { Errors } from "@/lib/errors/error-factory";
import { mapSupabaseError } from "@/lib/errors/supabase-error";

export async function createCollege(data: TCollege) {
  // We have constraint colleges_official_email_unique. It's an optional duplicate check
  const { data: existingCollege } = await getCollegeByEmailQuery(
    data.official_email,
  );

  if (existingCollege) {
    throw Errors.alreadyExists("College");
  }

  const { data: college, error } = await createCollegeMutation(data);

  if (error) {
    throw mapSupabaseError(error);
  }

  return college;
}

export async function getCollegesService() {
  const query = getCollegesQuery();

  type RawCollegesResponse = QueryData<typeof query>;

  const { data, error } = await query;

  if (error) {
    throw mapSupabaseError(error);
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
