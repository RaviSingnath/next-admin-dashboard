"use server";
import { getAvatarSignedUrlQuery, getCreatorQuery } from "./queries";
import { Database } from "@/supabase/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type CreatorShape = Pick<ProfileRow, "id" | "full_name" | "email" | "role">;

export async function withCreatorService<
  T extends { created_by: string | null },
>(record: T): Promise<T & { creator: CreatorShape | null }> {
  if (!record.created_by) return { ...record, creator: null };

  const { data: creator } = await getCreatorQuery(record.created_by);

  return { ...record, creator };
}

export async function getAvatarSignedUrlService(avatar: string) {
  const { data: avatarData, error: bucketError } =
    await getAvatarSignedUrlQuery(avatar);

  if (bucketError) throw bucketError;

  return avatarData.signedUrl;
}
