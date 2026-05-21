"use client";

import { Undo2 } from "lucide-react";
import { Tooltip } from "react-tooltip";

type RevokeInviteButtonProps = {
  inviteID: string;
};

export const RevokeInviteButton = ({ inviteID }: RevokeInviteButtonProps) => {
  const handleRevokeInvite = () => console.log(inviteID);
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
