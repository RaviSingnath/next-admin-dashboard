import { getInviteActions } from "../../config/invite-actions";
import { inviteActionRegistry } from "@/features/invite/config/invite-action-registry";
import { InvitesListItem } from "../../invite.service";

type InviteListActionButtonsProps = {
  invite: InvitesListItem;
};

export default function InviteListActionButtons({
  invite,
}: InviteListActionButtonsProps) {
  const actions = getInviteActions(invite);

  return (
    <div className="flex gap-2 items-center justify-center">
      {actions.map((action) => {
        const Action = inviteActionRegistry[action];

        if (!Action) return null;

        return (
          <Action
            key={action}
            context={{
              inviteId: invite.id,
              userId: invite.created_user_profile?.id,
              invitedBy: invite.invited_by_profile.id,
            }}
          />
        );
      })}
    </div>
  );
}
