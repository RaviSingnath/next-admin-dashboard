"use client";

import { resendInviteAction } from "@/app/(protected)/invites/_lib/invite.actions";
import { InviteActionProps } from "@/features/invite/config/invite-actions";
import {
  handleActionError,
  handleUnexpectedError,
} from "@/lib/helper/error-handler";
import { OwnershipGuard } from "@/lib/rbac/guard/OwnershipGuard";
import { Permission } from "@/lib/rbac/permissions";
import { RefreshCw } from "lucide-react";
import { Tooltip } from "react-tooltip";

type ResendInviteButtonProps = {
  context: InviteActionProps;
};

const ResendInviteButton = ({ context }: ResendInviteButtonProps) => {
  const handleResendInvite = async () => {
    try {
      const newInvite = await resendInviteAction(context.inviteId);

      if (!newInvite.success) handleActionError(newInvite);
    } catch (error) {
      handleUnexpectedError(error);

      return false;
    }
  };
  return (
    <OwnershipGuard
      anyPermission={Permission.RESEND_INVITE}
      ownPermission={Permission.RESEND_OWN_INVITE}
      ownerId={context.invitedBy}
    >
      <RefreshCw
        size={16}
        className="resend-invite cursor-pointer"
        onClick={handleResendInvite}
      />
      <Tooltip anchorSelect=".resend-invite" place="top">
        Resend invite
      </Tooltip>
    </OwnershipGuard>
  );
};

export default ResendInviteButton;
