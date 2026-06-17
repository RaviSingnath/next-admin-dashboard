import { Database } from "@/supabase/database.types";
import { currentUserProfile } from "@/lib/helper/current-user-profile";

export type CurrentUser = Awaited<ReturnType<typeof currentUserProfile>>;

export type AuthContextType = {
  user: CurrentUser | null;
  loading: boolean;

  refreshUser: () => Promise<void>;

  isAuthenticated: boolean;

  hasRole: (...roles: string[]) => boolean;
};

export type ProfilesDB = Database["public"]["Tables"]["profiles"]["Row"];
