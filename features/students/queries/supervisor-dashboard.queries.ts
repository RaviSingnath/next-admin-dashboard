import createClient from "@/lib/supabase/server";

export async function getSupervisorStudentCount(supervisorId: string) {
  const supabase = await createClient();

  return supabase
    .from("students")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("supervisor_id", supervisorId);
}

export async function getSupervisorActiveStudentCount(supervisorId: string) {
  const supabase = await createClient();

  return supabase
    .from("students")
    .select("id, profiles!students_profile_id_fkey(status)", {
      count: "exact",
      head: true,
    })
    .eq("supervisor_id", supervisorId)
    .eq("profiles.status", "active");
}

export async function getSupervisorPendingStudentCount(departmentId: string) {
  const supabase = await createClient();

  return supabase
    .from("invitations")
    .select("id", { count: "exact", head: true })
    .eq("department_id", departmentId)
    .eq("status", "pending");
}
