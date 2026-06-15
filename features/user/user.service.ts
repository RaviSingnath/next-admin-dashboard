import { withCreatorService } from "../services";
import { getStudentDetails, getUserQuery } from "./user.queries";
import createClient from "@/lib/supabase/server";

export async function getProfile(userId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("Querying as:", user?.id);

  const { data: profile, error: profileError } = await getUserQuery(userId);

  if (profileError) return profileError;

  if (profile?.role === "student") {
    const { data: student, error: studentError } = await getStudentDetails(
      profile?.id,
    );

    if (studentError) return studentError;

    if (student.created_by) {
      const studentwithCreator = await withCreatorService(student);
      return { ...profile, details: studentwithCreator };
    }

    return {
      ...profile,
      details: student,
    };
  }

  return profile;
}
