import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver } from "react-hook-form";
import UserRole from "@/lib/rbac/roles";

// ─────────────────────────────────────────────────────────────────────────────
// Target role
//
// Roles that can be invited. super_admin is excluded — that account
// is provisioned directly, never via invitation.
// ─────────────────────────────────────────────────────────────────────────────

export const InviteTargetRole = z.enum([
  UserRole.COLLEGE_ADMIN,
  UserRole.SUPERVISOR,
  UserRole.STUDENT,
]);

export type InviteTargetRole = z.infer<typeof InviteTargetRole>;

// ─────────────────────────────────────────────────────────────────────────────
// Base schema
//
// Fields shared by every invitation variant.
// target_role is narrowed to a literal in each variant below.
// ─────────────────────────────────────────────────────────────────────────────

const baseInviteSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),

  invite_email: z.string().email("Invalid email address"),

  college_id: z.string().uuid("Select a valid college"),

  target_role: InviteTargetRole,
});

// ─────────────────────────────────────────────────────────────────────────────
// Variants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Invite college admin
 *
 * No department — college admins are not scoped to a department.
 * Created by: super_admin
 */
export const zInviteCollegeAdmin = baseInviteSchema.extend({
  target_role: z.literal(UserRole.COLLEGE_ADMIN),
});

/**
 * Invite supervisor
 *
 * Department is required — supervisors belong to a specific department.
 * Created by: college_admin
 */
export const zInviteSupervisor = baseInviteSchema.extend({
  target_role: z.literal(UserRole.SUPERVISOR),

  department_id: z.string().uuid("Select a valid department"),
});

/**
 * Invite student
 *
 * Department is required — students are enrolled in a department.
 * Created by: college_admin, supervisor
 */
export const zInviteStudent = baseInviteSchema.extend({
  target_role: z.literal(UserRole.STUDENT),

  department_id: z.string().uuid("Select a valid department"),
});

// ─────────────────────────────────────────────────────────────────────────────
// Complete payload
//
// Discriminated union — used for Zod runtime validation only.
// Do NOT pass this type to useForm<T> — see TInviteForm below.
// ─────────────────────────────────────────────────────────────────────────────

export const zInvitePayload = z.discriminatedUnion("target_role", [
  zInviteCollegeAdmin,
  zInviteSupervisor,
  zInviteStudent,
]);

export type TInvitePayload = z.infer<typeof zInvitePayload>;

// ─────────────────────────────────────────────────────────────────────────────
// React Hook Form type
//
// useForm<T> needs a flat, non-union type to correctly type errors,
// register, watch, and setValue across all fields.
//
// Rules:
//   - target_role is undefined until the user selects one
//   - department_id is optional — only required for supervisor / student,
//     enforced by Zod on submit, not by TypeScript here
//
// Zod still enforces the real validation rules at submit time via
// inviteFormResolver below. This type is purely for the RHF layer.
// ─────────────────────────────────────────────────────────────────────────────

export type TInviteForm = {
  full_name: string;
  invite_email: string;
  college_id: string;
  target_role: InviteTargetRole | undefined;
  department_id?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Resolver
//
// Casts the discriminated-union resolver to the flat TInviteForm type.
// The cast is intentional and safe:
//   - RHF uses TInviteForm for field tracking (flat, all fields accessible)
//   - Zod uses zInvitePayload for validation (discriminated, real rules applied)
//
// Collocated here so the cast is defined once and imported everywhere.
// Usage: useForm<TInviteForm>({ resolver: inviteFormResolver })
// ─────────────────────────────────────────────────────────────────────────────

export const inviteFormResolver = zodResolver(
  zInvitePayload,
) as Resolver<TInviteForm>;

// ─────────────────────────────────────────────────────────────────────────────
// Lookup map
//
// Useful for dynamic validation — get the schema for a given role.
// ─────────────────────────────────────────────────────────────────────────────

export const INVITE_SCHEMA_BY_ROLE = {
  [UserRole.COLLEGE_ADMIN]: zInviteCollegeAdmin,
  [UserRole.SUPERVISOR]: zInviteSupervisor,
  [UserRole.STUDENT]: zInviteStudent,
} as const satisfies Record<InviteTargetRole, z.ZodTypeAny>;

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
