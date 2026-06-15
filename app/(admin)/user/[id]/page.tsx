import { getProfile } from "@/features/user/user.service";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile(id);
  console.log(profile);

  return !profile ? (
    <div>User ID: {id} but not authorize</div>
  ) : (
    <div>User ID: {id}</div>
  );
}
