"use client";

import { useModal } from "@/hooks/useModal";
import DeleteInviteModal from "./delete-invite-modal";
import { Trash2 } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { InviteActionProps } from "@/features/invite/config/invite-actions";
import { OwnershipGuard } from "@/lib/rbac/guard/OwnershipGuard";
import { Permission } from "@/lib/rbac/permissions";

type DeleteInviteButtonProps = {
  context: InviteActionProps;
};

const DeleteInviteButton = ({ context }: DeleteInviteButtonProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <OwnershipGuard
      anyPermission={Permission.DELETE_INVITE}
      ownPermission={Permission.DELETE_OWN_INVITE}
      ownerId={context.invitedBy}
    >
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
    </OwnershipGuard>
  );
};

export default DeleteInviteButton;
