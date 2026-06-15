"use server";

import createClient from "@/lib/supabase/server";

export const getUserQuery = async (id: string) => {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      email,
      role,
      status,
      college_id,
      department_id,
      created_at,
      deleted_at,
      created_by
      `,
    )
    .eq("id", id)
    .single();
};

export const getStudentDetails = async (id: string) => {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .select(
      `
      addresses (
        city,
        state_province,
        country,
        country_code,
        postal_code
      ),
      colleges (
        college_name,
        status
      ),
      departments!department_id (
        department_name
      ),
      created_by
      `,
    )
    .eq("id", id)
    .single();
};

export const getSupervisorDetails = async (id: string) => {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .select(
      `
      addresses (
        city,
        state_province,
        country,
        country_code,
        postal_code
      ),
      colleges (
        college_name,
        status
      ),
      departments!department_id (
        department_name
      ),
      created_by
      `,
    )
    .eq("id", id)
    .single();
};

export const getCollegeAdminDetails = async (id: string) => {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .select(
      `
      addresses (
        city,
        state_province,
        country,
        country_code,
        postal_code
      ),
      colleges (
        college_name,
        status
      ),
      departments!department_id (
        department_name
      ),
      created_by
      `,
    )
    .eq("id", id)
    .single();
};
