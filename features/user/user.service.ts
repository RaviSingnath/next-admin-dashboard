import { withCreatorService } from "../services";
import {
  getCollegeAdminDetails,
  getStudentDetails,
  getSupervisorDetails,
  getUserQuery,
} from "./user.queries";

export async function getProfile(userId: string) {
  const { data: profile, error: profileError } = await getUserQuery(userId);

  if (profileError) return profileError;

  if (profile.role === "college_admin") {
    const { data: collegeAdmin, error: collegeAdminError } =
      await getCollegeAdminDetails(profile.id);

    if (collegeAdminError) return collegeAdminError;

    if (collegeAdmin.created_by) {
      const studentwithCreator = await withCreatorService(collegeAdmin);
      return { ...profile, details: studentwithCreator };
    }

    return {
      ...profile,
      details: collegeAdmin,
    };
  }

  if (profile.role === "supervisor") {
    const { data: supervisor, error: supervisorError } =
      await getSupervisorDetails(profile.id);

    if (supervisorError) return supervisorError;

    if (supervisor.created_by) {
      const studentwithCreator = await withCreatorService(supervisor);
      return { ...profile, details: studentwithCreator };
    }

    return {
      ...profile,
      details: supervisor,
    };
  }

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
