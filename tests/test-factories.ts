import { Invitation } from "@/features/invite/invite.types";

/**
 * Returns a complete Invitation row suitable for use with any security
 * assertion function.
 *
 * All nullable columns default to null. Required columns get sensible
 * deterministic defaults. Pass overrides to control only the fields
 * relevant to the test being written.
 *
 * Returning the full `Invitation` type (not `Partial<Invitation>`) means
 * the result is always assignable to narrower projections such as
 * GetInviteForResendResult or GetInviteByIdResult without a type assertion,
 * since those are structural subsets of the full row.
 *
 * Default expires_at is one hour in the past so that resend tests that
 * do not care about expiry get a valid (expired) invite out of the box.
 */
export function createInviteFactory(
  overrides: Partial<Invitation> = {},
): Invitation {
  return {
    id: crypto.randomUUID(),
    email: "test@example.com",
    status: "pending",
    role: "college_admin",
    college_id: crypto.randomUUID(),
    department_id: null,
    invited_by: crypto.randomUUID(),
    expires_at: new Date(Date.now() - 3600 * 1000).toISOString(), // expired by default
    // nullable columns — defaulted to null
    token: null,
    full_name: null,
    accepted_at: null,
    accepted_by: null,
    created_at: new Date(Date.now()).toISOString(),
    deleted_at: null,
    deleted_by: null,
    created_user_id: null,
    revoked_at: null,
    revoked_by: null,
    revoked_reason: null,
    ...overrides,
  };
}
