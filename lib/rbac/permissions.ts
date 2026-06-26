export enum Permission {
  // =========================
  // INVITE user
  // =========================
  INVITE_COLLEGE_ADMIN = "invite_college_admin",
  INVITE_SUPERVISOR = "invite_supervisor",
  INVITE_STUDENT = "invite_student",

  RESEND_INVITE = "resend_invite",
  REVOKE_INVITE = "revoke_invite",
  DELETE_INVITE = "delete_invite",

  REVOKE_OWN_INVITE = "revoke_own_invite",
  DELETE_OWN_INVITE = "delete_own_invite",

  SUSPEND_USER = "suspend_user",
  VIEW_OWN_PROFILE = "view_own_profile",
  UPDATE_OWN_PROFILE = "update_own_profile",

  // =========================
  // COLLEGE (Tenant Management)
  // =========================
  CREATE_COLLEGE = "create_college",
  READ_COLLEGE = "read_college",
  UPDATE_COLLEGE = "update_college",
  DELETE_COLLEGE = "delete_college",
  SUSPEND_COLLEGE = "suspend_college",

  // =========================
  // COLLEGE ADMIN MANAGEMENT
  // =========================
  FORCE_DEACTIVATE_ACCOUNT = "force_deactivate_account",

  // =========================
  // DEPARTMENT MANAGEMENT
  // =========================
  CREATE_DEPARTMENT = "create_department",
  READ_DEPARTMENT = "read_department",
  UPDATE_DEPARTMENT = "update_department",
  DELETE_DEPARTMENT = "delete_department",

  // =========================
  // SUPERVISOR MANAGEMENT
  // =========================
  READ_SUPERVISOR = "read_supervisor",
  UPDATE_SUPERVISOR = "update_supervisor",
  DELETE_SUPERVISOR = "delete_supervisor",
  REASSIGN_SUPERVISOR = "reassign_supervisor",

  // =========================
  // STUDENT MANAGEMENT
  // =========================
  READ_STUDENT = "read_student",
  UPDATE_STUDENT = "update_student",
  DELETE_STUDENT = "delete_student",

  // Ownership-based (VERY IMPORTANT)
  READ_OWN_STUDENT = "read_own_student",
  UPDATE_OWN_STUDENT = "update_own_student",

  // Cross-college visibility (admin level)
  VIEW_ALL_COLLEGE_STUDENTS = "view_all_college_students",
  REASSIGN_STUDENT = "reassign_student",

  // =========================
  // FEES & PAYMENTS
  // =========================
  MANAGE_FEES = "manage_fees",
  VIEW_PAYMENTS = "view_payments",
  TRACK_PAYMENT_STATUS = "track_payment_status",
  PAY_TUITION = "pay_tuition",
  DOWNLOAD_RECEIPT = "download_receipt",

  // =========================
  // REPORTS & ANALYTICS
  // =========================
  VIEW_REPORTS = "view_reports",
  VIEW_ANALYTICS = "view_analytics",
  VIEW_DEPARTMENT_REPORTS = "view_department_reports",

  // =========================
  // AUDIT & LOGS
  // =========================
  VIEW_AUDIT_LOGS = "view_audit_logs",

  // =========================
  // SETTINGS & PLATFORM
  // =========================
  MANAGE_PLATFORM_SETTINGS = "manage_platform_settings",
  MANAGE_COLLEGE_SETTINGS = "manage_college_settings",
  MANAGE_BILLING = "manage_billing",
}
