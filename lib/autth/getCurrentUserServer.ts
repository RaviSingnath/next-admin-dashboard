import createClient from "@/lib/supabase/server";
import { AVATAR_BUCKET } from "../constants/db";

export async function getCurrentUserServer() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

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
      )
    `,
    )
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return null;
  }

  const college = Array.isArray(profile.colleges)
    ? profile.colleges[0]
    : profile.colleges;

  const department = Array.isArray(profile.departments)
    ? profile.departments[0]
    : profile.departments;

  const userProfile = {
    id: user.id,
    email: user.email ?? "",

    role: profile.role,
    full_name: profile.full_name,

    college_id: profile.college_id,
    college_name: college?.college_name ?? null,
    college_status: college?.status ?? null,

    department_id: profile.department_id,
    department_name: department?.department_name ?? null,
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

  return {
    ...userProfile,
    avatar_url: avatarData.signedUrl,
  };
}
