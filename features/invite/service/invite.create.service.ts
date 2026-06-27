import { Errors } from "@/lib/errors/error-factory";
import { createAdminClient } from "@/lib/supabase/admin";
import { getInviteByEmail } from "../invite.queries";
import UserRole from "@/lib/rbac/roles";
import { cancelOlderInviteByEmail, createInvite } from "../invite.mutations";
import { generateToken } from "@/lib/helper/generate-token";
import { StudentInvite } from "../invite.types";
import { mapSupabaseAuthError } from "@/lib/errors/supabase-auth-error";
import { TInvitePayload } from "../invite.schema";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { RequestContext } from "@/lib/auth/request-context";
import { assertCanInvite } from "../security/invite.create.security";

import { getExpiresAtDate } from "@/lib/helper/date";

type InviteUserServiceInput = {
  ctx: RequestContext;
  data: TInvitePayload;
};

/**
 * Create invite service
 **/

export async function inviteUserService({ ctx, data }: InviteUserServiceInput) {
  const supabaseAdmin = createAdminClient();

  assertCanInvite(ctx, data);

  const { data: existingInvite } = await getInviteByEmail(data.invite_email);

  if (existingInvite) {
    throw Errors.alreadyExists("Invitation already exists");
  }

  // Invalidate older invites automatically for email reuse
  const { error: revokeOldInviteError } = await cancelOlderInviteByEmail(
    data.invite_email,
  );

  if (revokeOldInviteError) {
    throw mapSupabaseError(revokeOldInviteError);
  }

  const token = generateToken();
  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite?token=${token}`;

  const { error: inviteError } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(data.invite_email, {
      redirectTo: inviteUrl,
      data: {
        full_name: data.full_name,
        role: UserRole.STUDENT,
        college_id: data.college_id,
        department_id: data.department_id,
      },
    });

  if (inviteError) {
    throw mapSupabaseAuthError(inviteError);
  }

  const inviteData: StudentInvite = {
    email: data.invite_email,
    full_name: data.full_name,
    role: UserRole.STUDENT,
    token: token,
    college_id: data.college_id,
    department_id: data.department_id,
  };

  const { data: invitation, error } = await createInvite(
    inviteData,
    getExpiresAtDate(),
  );

  if (error) {
    throw mapSupabaseError(error);
  }

  return invitation;
}
