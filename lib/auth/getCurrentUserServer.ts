import createClient from "@/lib/supabase/server";
import { getCurrentUserQuery } from "@/features/queries";
import { currentUserProfile } from "./current-user-profile";
import { AuthUser } from "./types";

export async function getCurrentUserServer(): Promise<AuthUser | null> {
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
