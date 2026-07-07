import { getInvitesQuery } from "./invite.queries";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { createRequestContext } from "@/lib/auth/request-context";

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
