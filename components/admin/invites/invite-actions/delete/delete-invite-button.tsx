"use client";

import { useModal } from "@/hooks/useModal";
import { DeleteInviteModal } from "./delete-invite-modal";
import { Trash2 } from "lucide-react";
import { Tooltip } from "react-tooltip";

type DeleteInviteButtonProps = {
  inviteID: string;
};

export const DeleteInviteButton = ({ inviteID }: DeleteInviteButtonProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <>
      <Trash2
        onClick={openModal}
        size={16}
        className="delete-invite cursor-pointer"
      ></Trash2>
      <Tooltip anchorSelect=".delete-invite" place="top">
        Delete invite
      </Tooltip>
      <DeleteInviteModal
        userID={inviteID}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </>
  );
};
