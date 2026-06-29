import { z } from "zod";
import UserRole from "@/lib/rbac/roles";

export const InviteTargetRole = z.enum([
  UserRole.COLLEGE_ADMIN,
  UserRole.SUPERVISOR,
  UserRole.STUDENT,
]);

export type InviteTargetRole = z.infer<typeof InviteTargetRole>;

/**
 * Common fields for all invitations
 */
const baseInviteSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),

  invite_email: z.string().email("Invalid email address"),

  college_id: z.string().uuid("Select a valid college"),

  target_role: z.nativeEnum(UserRole),
});

/**
 * Invite College Admin
 *
 * Created by:
 * - SUPER_ADMIN
 *
 * Department does not apply.
 */
export const zInviteCollegeAdmin = baseInviteSchema.extend({
  target_role: z.literal(UserRole.COLLEGE_ADMIN),

  department_id: z.undefined().optional(),
});

/**
 * Invite Supervisor
 *
 * Created by:
 * - SUPER_ADMIN (if allowed later)
 * - COLLEGE_ADMIN
 *
 * Department is required.
 */
export const zInviteSupervisor = baseInviteSchema.extend({
  target_role: z.literal(UserRole.SUPERVISOR),

  department_id: z.string().uuid("Select a valid department"),
});

/**
 * Invite Student
 *
 * Created by:
 * - COLLEGE_ADMIN
 * - SUPERVISOR
 *
 * Department is required.
 */
export const zInviteStudent = baseInviteSchema.extend({
  target_role: z.literal(UserRole.STUDENT),

  department_id: z.string().uuid("Select a valid department"),
});

/**
 * Complete invite payload
 *
 * target_role decides which schema applies.
 */
export const zInvitePayload = z.discriminatedUnion("target_role", [
  zInviteCollegeAdmin,
  zInviteSupervisor,
  zInviteStudent,
]);

export type TInvitePayload = z.infer<typeof zInvitePayload>;

// Useful for dynamic forms
export const INVITE_SCHEMA_BY_TARGET_ROLE = {
  [UserRole.COLLEGE_ADMIN]: zInviteCollegeAdmin,

  [UserRole.SUPERVISOR]: zInviteSupervisor,

  [UserRole.STUDENT]: zInviteStudent,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Resend invite schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Input schema for resend invite action.
 *
 * Only the invitation ID is needed — all other data is derived from the
 * existing invitation row after the security checks pass.
 */
export const zResendInvitePayload = z.object({
  invitationId: z.string().uuid("Invalid invitation ID"),
});

export type TResendInvitePayload = z.infer<typeof zResendInvitePayload>;

// ─────────────────────────────────────────────────────────────────────────────
// Delete invite schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Input schema for the delete invite action.
 *
 * Only the invitation ID is required — all other data needed for security
 * checks is fetched from the DB after the ID is validated.
 */
export const zDeleteInvitePayload = z.object({
  invitationId: z.string().uuid("Invalid invitation ID"),
});

export type TDeleteInvitePayload = z.infer<typeof zDeleteInvitePayload>;
