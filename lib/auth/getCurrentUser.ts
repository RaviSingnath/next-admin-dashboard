import { createClient } from "@/lib/supabase/client";
import { AuthUser } from "@/lib/auth/types";
import { getCurrentUserQuery } from "@/features/queries";
import { currentUserProfile } from "./current-user-profile";

const supabase = createClient();

export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const authUser = session?.user;

  if (!authUser) {
    return null;
  }

  const { data: profile, error } = await getCurrentUserQuery(authUser.id);

  if (error || !profile) {
    return null;
  }

  const userProfile = currentUserProfile(profile);

  return userProfile;
}
