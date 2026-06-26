"use client";

import { revokeInviteAction } from "@/app/(protected)/invites/_lib/invite.actions";
import { Undo2 } from "lucide-react";
import { Tooltip } from "react-tooltip";

type RevokeInviteButtonProps = {
  inviteID: string;
};

const RevokeInviteButton = ({ inviteID }: RevokeInviteButtonProps) => {
  const handleRevokeInvite = () => revokeInviteAction(inviteID);
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
