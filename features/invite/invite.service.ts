import { getInviteById, getInvitesQuery } from "./invite.queries";
import { Errors } from "@/lib/errors/error-factory";

import { createAdminClient } from "@/lib/supabase/admin";
import { getInviteByEmail } from "../invite/invite.queries";
import UserRole from "@/lib/rbac/roles";
import {
  cancelOlderInviteByEmail,
  createInvite,
} from "../invite/invite.mutations";
import { generateToken } from "@/lib/helper/generate-token";
import { StudentInvite } from "../invite/invite.types";
import { mapSupabaseAuthError } from "@/lib/errors/supabase-auth-error";
import { TInvitePayload } from "../invite/invite.schema";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import {
  createRequestContext,
  RequestContext,
} from "@/lib/auth/request-context";
import { assertCanInvite } from "./invite.security";

export async function getInvitesService() {
  const ctx = await createRequestContext();

  const { data, error } = await getInvitesQuery(ctx.user);

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}
export type InvitesListResponse = Awaited<ReturnType<typeof getInvitesService>>;

export type InvitesListItem = InvitesListResponse[number];

type InviteUserServiceInput = {
  ctx: RequestContext;
  data: TInvitePayload;
};

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

  const { data: invitation, error } = await createInvite(inviteData);

  if (error) {
    throw mapSupabaseError(error);
  }

  return invitation;
}

export async function resendInviteService({ id }: { id: string }) {
  const supabaseAdmin = createAdminClient();

  const { data: oldInvite, error } = await getInviteById(id);

  if (error) {
    throw mapSupabaseError(error);
  }

  if (!oldInvite) {
    throw Errors.notFound("Old invite not found");
  }

  const token = generateToken();
  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite?token=${token}`;

  const { data, error: resendInviteError } =
    await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email: oldInvite.email,
      options: {
        redirectTo: inviteUrl,
      },
    });

  console.log(resendInviteError);
  if (resendInviteError) {
    throw mapSupabaseAuthError(resendInviteError);
  }

  const inviteLink = data.properties.action_link;
  console.log(inviteLink);

  // After getting the invite link, need to send email manually
  // await resend.emails.send({
  //   from: "College Admin <noreply@college.com>",
  //   to: email,
  //   subject: "Your college account invitation",
  //   html: `
  //   <h2>You have been invited</h2>
  //   <p>Click below to activate your account:</p>
  //   <a href="${inviteLink}">
  //     Accept Invitation
  //   </a>
  // `,
  // });

  return data.user;
}
