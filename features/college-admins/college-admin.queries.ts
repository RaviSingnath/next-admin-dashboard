import createClient from "@/lib/supabase/server";

export async function getCollegeAdminsQuery() {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .select(
      `
    id,
    full_name,
    email,
    status,
    created_at,
    deleted_at,
    created_by,

    college:colleges (
      id,
      college_name
    )
  `,
    )
    .order("created_at", { ascending: false })
    .eq("role", "college_admin");
}

export async function getCreatorByIdsQuery(creatorIds: string[]) {
  const supabase = await createClient();

  return supabase.from("profiles").select("id, full_name").in("id", creatorIds);
}
