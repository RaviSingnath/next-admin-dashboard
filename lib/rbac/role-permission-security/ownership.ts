export function isOwner(
  userId: string,
  resourceUserId?: string | null,
): boolean {
  return userId === resourceUserId;
}
