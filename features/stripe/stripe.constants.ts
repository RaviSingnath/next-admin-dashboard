// Statuses that allow full access to the platform.
export const ACTIVE_STATUSES = ["active", "trialing"] as const;

// Statuses that allow degraded access with a warning banner.
// Stripe is retrying payment — don't lock the college out yet.
export const AT_RISK_STATUSES = ["past_due"] as const;

// Statuses that block access entirely.
export const BLOCKED_STATUSES = [
  "unpaid",
  "paused",
  "incomplete",
  "incomplete_expired",
  "canceled",
] as const;

export type SubscriptionStatus =
  | (typeof ACTIVE_STATUSES)[number]
  | (typeof AT_RISK_STATUSES)[number]
  | (typeof BLOCKED_STATUSES)[number];

export function hasFullAccess(status: string): boolean {
  return (ACTIVE_STATUSES as readonly string[]).includes(status);
}

export function isAtRisk(status: string): boolean {
  return (AT_RISK_STATUSES as readonly string[]).includes(status);
}

export function isBlocked(status: string): boolean {
  return (BLOCKED_STATUSES as readonly string[]).includes(status);
}
