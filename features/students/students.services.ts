import { getStudentsQuery } from "./students.queries";
import { getCreatorByIdsQuery } from "../college-admins/college-admin.queries";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { createRequestContext } from "@/lib/auth/request-context";

export async function getStudentsService() {
  const ctx = await createRequestContext();

  const { data: students, error } = await getStudentsQuery(ctx.user);

  if (error) {
    throw mapSupabaseError(error);
  }

  if (!students?.length) {
    return [];
  }

  const creatorIds = [
    ...new Set(
      students.map((row) => row.created_by).filter((id): id is string => !!id),
    ),
  ];

  if (creatorIds.length === 0) {
    return students.map((row) => ({ ...row, creator: null }));
  }

  const { data: creators, error: creatorsError } =
    await getCreatorByIdsQuery(creatorIds);

  if (creatorsError) {
    throw mapSupabaseError(creatorsError);
  }

  const creatorsById = new Map(
    creators?.map((creator) => [creator.id, creator]) ?? [],
  );

  return students.map((row) => ({
    ...row,
    creator: row.created_by ? (creatorsById.get(row.created_by) ?? null) : null,
  }));
}

export type StudentsListResponse = Awaited<
  ReturnType<typeof getStudentsService>
>;

export type StudentsListItem = StudentsListResponse[number];
