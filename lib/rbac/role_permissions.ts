import { Permission } from "./permissions";
import UserRole from "./roles";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // =========================
  // SUPER ADMIN (FULL ACCESS)
  // =========================
  [UserRole.SUPER_ADMIN]: [...Object.values(Permission)],

  // =========================
  // COLLEGE ADMIN
  // =========================
  [UserRole.COLLEGE_ADMIN]: [
    // Department
    Permission.CREATE_DEPARTMENT,
    Permission.READ_DEPARTMENT,
    Permission.UPDATE_DEPARTMENT,
    Permission.DELETE_DEPARTMENT,

    // Supervisor
    Permission.CREATE_SUPERVISOR,
    Permission.READ_SUPERVISOR,
    Permission.UPDATE_SUPERVISOR,
    Permission.DELETE_SUPERVISOR,
    Permission.REASSIGN_SUPERVISOR,

    // Student
    Permission.CREATE_STUDENT,
    Permission.READ_STUDENT,
    Permission.UPDATE_STUDENT,
    Permission.DELETE_STUDENT,
    Permission.VIEW_ALL_COLLEGE_STUDENTS,
    Permission.REASSIGN_STUDENT,

    // Fees & Payments
    Permission.MANAGE_FEES,
    Permission.VIEW_PAYMENTS,

    // Reports
    Permission.VIEW_REPORTS,
    Permission.VIEW_ANALYTICS,

    // Audit
    Permission.VIEW_AUDIT_LOGS,

    // Settings
    Permission.MANAGE_COLLEGE_SETTINGS,
  ],

  // =========================
  // SUPERVISOR
  // =========================
  [UserRole.SUPERVISOR]: [
    // Student (OWN ONLY via RLS)
    Permission.CREATE_STUDENT,
    Permission.READ_OWN_STUDENT,
    Permission.UPDATE_OWN_STUDENT,

    // Payments
    Permission.TRACK_PAYMENT_STATUS,

    // Optional Reports
    Permission.VIEW_DEPARTMENT_REPORTS,
  ],

  // =========================
  // STUDENT
  // =========================
  [UserRole.STUDENT]: [
    Permission.READ_OWN_STUDENT,
    Permission.UPDATE_OWN_STUDENT,

    Permission.PAY_TUITION,
    Permission.VIEW_PAYMENTS,
    Permission.DOWNLOAD_RECEIPT,
  ],
};
