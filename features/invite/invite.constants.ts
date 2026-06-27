import UserRole from "@/lib/rbac/roles";
import { Invitation } from "./invite.types";
import { InvitationStatus } from "./invite.types";

export const INVITATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REVOKED: "revoked",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  ONBOARDING: "onboarding",
} as const satisfies Record<string, InvitationStatus>;

// Invite roles that a college_admin is NOT allowed to revoke
export const COLLEGE_ADMIN_BLOCKED_ROLES: Invitation["role"][] = [
  UserRole.SUPER_ADMIN,
];

// Invite roles that a supervisor is NOT allowed to revoke
export const SUPERVISOR_BLOCKED_ROLES: Invitation["role"][] = [
  UserRole.SUPER_ADMIN,
  UserRole.COLLEGE_ADMIN,
  UserRole.SUPERVISOR,
];

// Statuses that are eligible for revocation
export const REVOCABLE_STATUSES = [
  INVITATION_STATUS.PENDING,
  INVITATION_STATUS.ONBOARDING,
] as const satisfies ReadonlyArray<InvitationStatus>;

// Statuses that are eligible for resend
export const RESENDABLE_STATUSES = [
  INVITATION_STATUS.EXPIRED,
  INVITATION_STATUS.PENDING,
] as const satisfies ReadonlyArray<InvitationStatus>;
