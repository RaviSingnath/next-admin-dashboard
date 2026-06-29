export const inviteActions = ["resend", "revoke", "delete", "view"] as const;

export type InviteAction = (typeof inviteActions)[number];

export type InviteActionProps = {
  inviteId: string;
  userId?: string;
};

type InviteStatus =
  | "pending"
  | "onboarding"
  | "accepted"
  | "expired"
  | "cancelled"
  | "revoked";

type InviteContext = {
  status: InviteStatus;
  expires_at: string;
};

type ActionRule = {
  action: InviteAction;
  condition?: (invite: InviteContext) => boolean;
};

export const inviteActionRules: Record<InviteStatus, ActionRule[]> = {
  pending: [
    {
      action: "revoke",
      condition: (invite) => new Date(invite.expires_at) > new Date(),
    },

    {
      action: "resend",
      condition: (invite) => new Date(invite.expires_at) <= new Date(),
    },

    {
      action: "delete",
    },
  ],

  onboarding: [
    {
      action: "revoke",
    },
  ],

  accepted: [
    {
      action: "view",
    },
  ],

  expired: [
    {
      action: "resend",
    },
    {
      action: "delete",
    },
  ],

  revoked: [
    {
      action: "delete",
    },
  ],

  cancelled: [
    {
      action: "delete",
    },
  ],
};

export function getInviteActions(invite: InviteContext) {
  const rules = inviteActionRules[invite.status];

  return rules
    .filter((rule) => !rule.condition || rule.condition(invite))
    .map((rule) => rule.action);
}
