enum UserRole {
  SUPER_ADMIN = "super_admin",
  COLLEGE_ADMIN = "college_admin",
  SUPERVISOR = "supervisor",
  STUDENT = "student",
}

export default UserRole;

export const UserRoleLabel: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "Super Admin",
  [UserRole.COLLEGE_ADMIN]: "College Admin",
  [UserRole.SUPERVISOR]: "Supervisor",
  [UserRole.STUDENT]: "Student",
};
