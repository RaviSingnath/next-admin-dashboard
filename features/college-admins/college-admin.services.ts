import {
  getCollegeAdminsQuery,
  getCreatorByIdsQuery,
} from "./college-admin.queries";
import { mapSupabaseError } from "@/lib/errors/supabase-error";

export const getCollegeAdminsService = async () => {
  const query = getCollegeAdminsQuery();

  const { data, error } = await query;

  if (error) {
    throw mapSupabaseError(error);
  }

  if (!data?.length) {
    return [];
  }

  const creatorIds = [
    ...new Set(
      data.map((row) => row.created_by).filter((id): id is string => !!id),
    ),
  ];

  if (creatorIds.length === 0) {
    return data.map((row) => ({ ...row, creator: null }));
  }

  const { data: creators, error: creatorsError } =
    await getCreatorByIdsQuery(creatorIds);

  if (creatorsError) {
    throw mapSupabaseError(creatorsError);
  }

  const creatorsById = new Map(
    creators?.map((creator) => [creator.id, creator]) ?? [],
  );

  return data.map((row) => ({
    ...row,
    creator: row.created_by ? (creatorsById.get(row.created_by) ?? null) : null,
  }));
};

type CollegeAdminsListResponse = Awaited<
  ReturnType<typeof getCollegeAdminsService>
>;
export type CollegeAdminsListItem = CollegeAdminsListResponse[number];
