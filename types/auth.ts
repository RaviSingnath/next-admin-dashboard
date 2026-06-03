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
};

export type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;

  refreshUser: () => Promise<void>;

  isAuthenticated: boolean;

  hasRole: (...roles: string[]) => boolean;
};
