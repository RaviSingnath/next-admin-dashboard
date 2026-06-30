"use client";

import { revokeInviteAction } from "@/app/(protected)/invites/_lib/invite.actions";
import {
  handleActionError,
  handleUnexpectedError,
} from "@/lib/helper/error-handler";
import { Undo2 } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { InviteActionProps } from "@/features/invite/config/invite-actions";
import { OwnershipGuard } from "@/lib/rbac/guard/OwnershipGuard";
import { Permission } from "@/lib/rbac/permissions";

type RevokeInviteButtonProps = {
  context: InviteActionProps;
};

const RevokeInviteButton = ({ context }: RevokeInviteButtonProps) => {
  const handleRevokeInvite = async () => {
    try {
      const result = await revokeInviteAction(context.inviteId);
      console.log(result);

      if (!result.success) handleActionError(result);
    } catch (error) {
      handleUnexpectedError(error);

      return false;
    }
  };

  return (
    <OwnershipGuard
      anyPermission={Permission.REVOKE_INVITE}
      ownPermission={Permission.REVOKE_OWN_INVITE}
      ownerId={context.invitedBy}
    >
      <Undo2
        size={16}
        className="revoke-invite cursor-pointer"
        onClick={handleRevokeInvite}
      />
      <Tooltip anchorSelect=".revoke-invite" place="top">
        Revoke invite
      </Tooltip>
    </OwnershipGuard>
  );
};

export default RevokeInviteButton;
