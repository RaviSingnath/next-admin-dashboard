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

// Invite roles that a college_admin is NOT allowed to act on
// (revoke, resend, delete)
export const COLLEGE_ADMIN_BLOCKED_ROLES: Invitation["role"][] = [
  UserRole.SUPER_ADMIN,
];

// Invite roles that a supervisor is NOT allowed to act on
// (revoke, resend, delete)
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

// Statuses that are eligible for soft deletion.
//
// onboarding and accepted are intentionally excluded:
//   onboarding — the user is mid-flow; deleting the invite would leave
//                the auth user in an inconsistent state.
//   accepted   — the invitation has already produced a real user account;
//                it cannot be deleted without affecting that account.
export const DELETABLE_STATUSES = [
  INVITATION_STATUS.PENDING,
  INVITATION_STATUS.REVOKED,
  INVITATION_STATUS.EXPIRED,
  INVITATION_STATUS.CANCELLED,
] as const satisfies ReadonlyArray<InvitationStatus>;

// This is the single source of truth for who can view whom.
// Keep this in invite.constants.ts or a dedicated rbac/view-hierarchy.ts
export const VIEWABLE_TARGET_ROLES: Record<UserRole, UserRole[]> = {
  [UserRole.SUPER_ADMIN]: [UserRole.COLLEGE_ADMIN],
  [UserRole.COLLEGE_ADMIN]: [UserRole.SUPERVISOR, UserRole.STUDENT],
  [UserRole.SUPERVISOR]: [UserRole.STUDENT],
  [UserRole.STUDENT]: [], // own profile only — handled at route level
};
