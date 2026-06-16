import { getCurrentUserServer } from "@/lib/autth/getCurrentUserServer";
import { getInvitesQuery } from "./invite.queries";
import AppError from "@/lib/errors/app-error";

export async function getInvitesService() {
  const profile = await getCurrentUserServer();

  if (!profile) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  const { data, error } = await getInvitesQuery(profile);
  console.log("getInvitesQuery: ", profile.role, data);

  if (error) {
    throw error;
  }

  return data;
}
export type InvitesListResponse = Awaited<ReturnType<typeof getInvitesService>>;

export type InvitesListItem = InvitesListResponse[number];
