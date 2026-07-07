import { Errors } from "@/lib/errors/error-factory";
import { createAdminClient } from "@/lib/supabase/admin";
import { getInviteByEmail } from "../invite.queries";
import { cancelOlderInviteByEmail, createInvite } from "../invite.mutations";
import { generateToken } from "@/lib/helper/generate-token";
import { InvitationInsert } from "../invite.types";
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

export async function inviteUserService({ ctx, data }: InviteUserServiceInput) {
  const supabaseAdmin = createAdminClient();

  // 1. Permission + scope check
  assertCanInvite(ctx, data);

  // 2. Duplicate check
  const { data: existingInvite } = await getInviteByEmail(data.invite_email);

  if (existingInvite) {
    throw Errors.alreadyExists("Invitation already exists");
  }

  // 3. Cancel any older active invite for this email (allows re-invite)
  const { error: cancelError } = await cancelOlderInviteByEmail(
    data.invite_email,
  );

  if (cancelError) {
    throw mapSupabaseError(cancelError);
  }

  // 4. Generate invite token + URL
  const token = generateToken();
  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite?token=${token}`;

  // 5. Send via Supabase auth (uncomment when email is ready)
  const { error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    data.invite_email,
    {
      redirectTo: inviteUrl,
      data: {
        full_name: data.full_name,
        role: data.target_role,
        college_id: data.college_id,
        department_id: "department_id" in data ? data.department_id : null,
      },
    },
  );
  if (authError) throw mapSupabaseAuthError(authError);

  // 6. Insert invitation row
  //
  // department_id only exists on supervisor / student variants of TInvitePayload.
  // "department_id" in data narrows the union to those two variants before access.
  const inviteData: InvitationInsert = {
    email: data.invite_email,
    full_name: data.full_name,
    role: data.target_role,
    token,
    college_id: data.college_id,
    expires_at: getExpiresAtDate(),
    ...("department_id" in data && data.department_id
      ? { department_id: data.department_id }
      : {}),
  };

  const { data: invitation, error } = await createInvite(inviteData);

  if (error) {
    throw mapSupabaseError(error);
  }

  return invitation;
}
