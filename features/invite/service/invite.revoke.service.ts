import { getInviteOrThrow } from "../invite.queries";
import { Errors } from "@/lib/errors/error-factory";
import { revokeInviteMutation } from "../invite.mutations";
import { Invitation } from "../invite.types";
import { RequestContext } from "@/lib/auth/request-context";
import { getRevokePermissions } from "../invite.rbac";
import {
  assertCanRevoke,
  assertInviteIsRevocable,
  assertRevokeCollegeScope,
  assertRevokeRoleHierarchy,
  assertRevokeOwnership,
  assertNotSelfRevoke,
} from "../security/invite.revoke.security";

/**
 * Revoke invite service
 **/

export const revokeInviteService = async ({
  ctx,
  inviteID,
}: {
  ctx: RequestContext;
  inviteID: string;
}): Promise<Invitation> => {
  const { user } = ctx;
  const permissions = getRevokePermissions(user);

  // 1. Permission Gate — fail before any DB call
  assertCanRevoke(user, permissions);

  // 2. Invite Existence — fetch once; all checks below use this record
  const invite = await getInviteOrThrow(inviteID);

  // 3. Status Guard
  assertInviteIsRevocable(invite);

  // 4. College Scope
  assertRevokeCollegeScope(user, invite);

  // 5. Role Hierarchy
  assertRevokeRoleHierarchy(user, invite);

  // 6. Ownership Check
  assertRevokeOwnership(user, invite, permissions);

  // 7. Self-invite Guard
  assertNotSelfRevoke(user, invite);

  // 8. Update — audit trigger fires automatically on this UPDATE
  const { data: revoked, error: updateError } = await revokeInviteMutation(
    invite.id,
    user.id,
  );

  if (updateError || !revoked) {
    throw Errors.database();
  }

  return revoked;
};
