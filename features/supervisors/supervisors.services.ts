"use server";

import { getSupervisorsQuery } from "./supervisors.queries";
import { getCreatorByIdsQuery } from "../college-admins/college-admin.queries";
import { mapSupabaseError } from "@/lib/errors/supabase-error";

export async function getSupervisorsService() {
  const { data: supervisors, error } = await getSupervisorsQuery();

  if (error) {
    throw mapSupabaseError(error);
  }

  if (!supervisors?.length) {
    return [];
  }

  const creatorIds = [
    ...new Set(
      supervisors
        .map((row) => row.created_by)
        .filter((id): id is string => !!id),
    ),
  ];

  if (creatorIds.length === 0) {
    return supervisors.map((row) => ({ ...row, creator: null }));
  }

  const { data: creators, error: creatorsError } =
    await getCreatorByIdsQuery(creatorIds);

  if (creatorsError) {
    throw mapSupabaseError(creatorsError);
  }

  const creatorsById = new Map(
    creators?.map((creator) => [creator.id, creator]) ?? [],
  );

  return supervisors.map((row) => ({
    ...row,
    creator: row.created_by ? (creatorsById.get(row.created_by) ?? null) : null,
  }));
}
export type SupervisorsListResponse = Awaited<
  ReturnType<typeof getSupervisorsService>
>;

export type SupervisorsListItem = SupervisorsListResponse[number];
