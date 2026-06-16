import { getAvatarSignedUrlService, withCreatorService } from "../services";
import {
  getCollegeAdminDetails,
  getStudentDetails,
  getSupervisorDetails,
  getUserQuery,
} from "./user.queries";

export async function getProfile(userId: string): Promise<UserProfileView> {
  const { data: profileData, error: profileError } = await getUserQuery(userId);
  if (profileError) throw profileError;

  let avatarURL: string | null = null;
  if (profileData.avatar) {
    try {
      avatarURL = await getAvatarSignedUrlService(profileData.avatar);
    } catch {
      avatarURL = null;
    }
  }

  const profile = { ...profileData, avatar: avatarURL };

  switch (profile.role) {
    case "super_admin": {
      return { ...profile, role: "super_admin" };
    }

    case "college_admin": {
      const { data: collegeAdmin, error } = await getCollegeAdminDetails(
        profile.id,
      );
      if (error) throw error;

      const details = collegeAdmin.created_by
        ? await withCreatorService(collegeAdmin)
        : collegeAdmin;

      return { ...profile, role: "college_admin", details };
    }

    case "supervisor": {
      const { data: supervisor, error } = await getSupervisorDetails(
        profile.id,
      );
      if (error) throw error;

      const details = supervisor.created_by
        ? await withCreatorService(supervisor)
        : supervisor;

      return { ...profile, role: "supervisor", details };
    }

    case "student": {
      const { data: student, error } = await getStudentDetails(profile.id);
      if (error) throw error;

      const details = student.created_by
        ? await withCreatorService(student)
        : student;

      return { ...profile, role: "student", details };
    }
  }
}

type BaseUserProfile = NonNullable<
  Awaited<ReturnType<typeof getUserQuery>>["data"]
>;

type WithCreator = Awaited<ReturnType<typeof withCreatorService>>;
type CollegeAdmin = NonNullable<
  Awaited<ReturnType<typeof getCollegeAdminDetails>>["data"]
>;
type CollegeAdminWithCreator = CollegeAdmin & WithCreator;

type Supervisor = NonNullable<
  Awaited<ReturnType<typeof getSupervisorDetails>>["data"]
>;
type SupervisorWithCreator = Supervisor & WithCreator;

type Student = NonNullable<
  Awaited<ReturnType<typeof getStudentDetails>>["data"]
>;
type StudentWithCreator = Student & WithCreator;

export type UserProfileView =
  | (BaseUserProfile & {
      role: "super_admin";
      details?: undefined;
    })
  | (BaseUserProfile & {
      role: "student";
      details: Student | StudentWithCreator;
    })
  | (BaseUserProfile & {
      role: "supervisor";
      details: Supervisor | SupervisorWithCreator;
    })
  | (BaseUserProfile & {
      role: "college_admin";
      details: CollegeAdmin | CollegeAdminWithCreator;
    });
