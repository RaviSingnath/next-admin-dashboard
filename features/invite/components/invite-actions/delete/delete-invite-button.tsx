"use client";

import { useModal } from "@/hooks/useModal";
import DeleteInviteModal from "./delete-invite-modal";
import { Trash2 } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { InviteActionProps } from "@/features/invite/config/invite-actions";

type DeleteInviteButtonProps = {
  context: InviteActionProps;
};

const DeleteInviteButton = ({ context }: DeleteInviteButtonProps) => {
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
        inviteId={context.inviteId}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </>
  );
};

export default DeleteInviteButton;
