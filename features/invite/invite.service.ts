import { getCurrentUserServer } from "@/lib/autth/getCurrentUserServer";
import { getInvitesQuery } from "./invite.queries";
import { Errors } from "@/lib/errors/error-factory";

export async function getInvitesService() {
  const profile = await getCurrentUserServer();

  if (!profile) {
    throw Errors.forbidden();
  }

  const { data, error } = await getInvitesQuery(profile);

  if (error) {
    throw error;
  }

  return data;
}
export type InvitesListResponse = Awaited<ReturnType<typeof getInvitesService>>;

export type InvitesListItem = InvitesListResponse[number];
