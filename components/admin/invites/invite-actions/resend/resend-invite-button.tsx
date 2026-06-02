"use client";

import { RefreshCw } from "lucide-react";
import { Tooltip } from "react-tooltip";

type ResendInviteButtonProps = {
  inviteID: string;
};

const ResendInviteButton = ({ inviteID }: ResendInviteButtonProps) => {
  const handleResendInvite = () => console.log(inviteID);
  return (
    <>
      <RefreshCw
        size={16}
        className="resend-invite cursor-pointer"
        onClick={handleResendInvite}
      />
      <Tooltip anchorSelect=".resend-invite" place="top">
        Resend invite
      </Tooltip>
    </>
  );
};

export default ResendInviteButton;
