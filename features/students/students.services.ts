import { getCurrentUserServer } from "@/lib/auth/getCurrentUserServer";
import { getStudentsQuery } from "./students.queries";
import { getCreatorByIdsQuery } from "../college-admins/college-admin.queries";
import { Errors } from "@/lib/errors/error-factory";
import { mapSupabaseError } from "@/lib/errors/supabase-error";

export async function getStudentsService() {
  const profile = await getCurrentUserServer();

  if (!profile) {
    throw Errors.unauthorized();
  }

  const { data: students, error } = await getStudentsQuery(profile);

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
