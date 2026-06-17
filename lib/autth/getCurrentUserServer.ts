import createClient from "@/lib/supabase/server";
import { getCurrentUserQuery } from "@/features/queries";
import { currentUserProfile } from "../helper/current-user-profile";

export async function getCurrentUserServer() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await getCurrentUserQuery(user.id);

  if (error || !profile) {
    return null;
  }

  const userProfile = currentUserProfile(profile);

  return userProfile;
}
