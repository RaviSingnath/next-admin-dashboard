import { Database } from "@/supabase/database.types";

export type AuthUser = {
  id: string;
  email: string;

  full_name: string | null;
  role: string | null;
  avatar_url: string | null;

  college_id: string | null;
  college_name: string | null;
  college_status: string | null;

  department_id: string | null;
  department_name: string | null;

  city: string | null;
  state_province: string | null;
  country: string | null;
  postal_code: string | null;
};

export type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;

  refreshUser: () => Promise<void>;

  isAuthenticated: boolean;

  hasRole: (...roles: string[]) => boolean;
};

export type ProfilesDB = Database["public"]["Tables"]["profiles"]["Row"];
