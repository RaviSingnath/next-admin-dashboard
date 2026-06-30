"use client";

import { revokeInviteAction } from "@/app/(protected)/invites/_lib/invite.actions";
import {
  handleActionError,
  handleUnexpectedError,
} from "@/lib/helper/error-handler";
import { Undo2 } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { InviteActionProps } from "@/features/invite/config/invite-actions";

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
    <>
      <Undo2
        size={16}
        className="revoke-invite cursor-pointer"
        onClick={handleRevokeInvite}
      />
      <Tooltip anchorSelect=".revoke-invite" place="top">
        Revoke invite
      </Tooltip>
    </>
  );
};

export default RevokeInviteButton;
