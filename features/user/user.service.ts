import { getUserQuery } from "./user.queries";

export async function getProfile(userId: string) {
  const { data: profile, error: profileError } = await getUserQuery(userId);

  return profile;
}
