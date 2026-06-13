import { createClient } from "@/lib/supabase/client";
import { AuthUser } from "@/types/auth";
import { AVATAR_BUCKET } from "../constants/db";

const supabase = createClient();

export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const authUser = session?.user;

  if (!authUser) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      role,
      college_id,
      department_id,
      avatar,
      colleges (
        college_name,
        status
      ),
      departments!department_id (
        department_name
      ),
      addresses (
        city,
        state_province,
        country,
        postal_code
      )
    `,
    )
    .eq("id", authUser.id)
    .single();

  if (error || !profile) {
    return null;
  }

  console.log("profile: ", profile);

  const college = Array.isArray(profile.colleges)
    ? profile.colleges[0]
    : profile.colleges;

  const department = Array.isArray(profile.departments)
    ? profile.departments[0]
    : profile.departments;

  const address = Array.isArray(profile.addresses)
    ? profile.addresses[0]
    : profile.addresses;

  const userProfile = {
    id: authUser.id,
    email: authUser.email ?? "",

    full_name: profile.full_name,
    role: profile.role,

    college_id: profile.college_id,
    college_name: college?.college_name ?? null,
    college_status: college?.status ?? null,

    department_id: profile.department_id,
    department_name: department?.department_name ?? null,

    city: address?.city ?? null,
    state_province: address?.state_province,
    country: address?.country,
    postal_code: address?.postal_code,
  };

  if (!profile.avatar) {
    return {
      ...userProfile,
      avatar_url: null,
    };
  }

  const { data: avatarData, error: bucketError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(profile.avatar, 60 * 60);

  if (bucketError) {
    return {
      ...userProfile,
      avatar_url: null,
    };
  }
  console.log("profile: ", profile);

  return {
    ...userProfile,
    avatar_url: avatarData.signedUrl,
  };
}
