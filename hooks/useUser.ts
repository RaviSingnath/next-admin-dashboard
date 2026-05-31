"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type UserContext = {
  id: string;
  email: string;
  role: string | null;
  college_id: string | null;
  department_id: string | null;
  full_name: string | null;
};

export default function useUser() {
  const supabase = createClient();

  const [user, setUser] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      setLoading(true);

      // Get authenticated user
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const authUser = session?.user;

      if (!authUser) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      // Get profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          full_name,
          role,
          college_id,
          department_id
        `,
        )
        .eq("id", authUser.id)
        .single();

      if (!mounted) return;

      if (error || !profile) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email ?? "",
        role: profile.role,
        college_id: profile.college_id,
        department_id: profile.department_id,
        full_name: profile.full_name,
      });

      setLoading(false);
    }

    loadUser();

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
