"use client";

import Image from "next/image";
import { ImagePlus } from "lucide-react";
import UploadUserAvatarModal from "./upload-user-avatar-modal";
import { useModal } from "@/hooks/useModal";
import UploadUserAvatarForm from "./upload-user-avatar-form";
import { useAuth } from "@/context/AuthProvider";

export default function UserAvatar() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth();

  return (
    <>
      <div className="relative w-20 h-20 rounded-full bg-white">
        {user?.avatar_url ? (
          <Image
            width={80}
            height={80}
            src={user?.avatar_url}
            alt="user"
            className="object-cover w-full rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase">
            {user?.full_name?.[0] ?? "U"}
          </div>
        )}
        <button onClick={openModal}>
          <ImagePlus
            size={24}
            className="absolute p-1 top-0 right-0 rounded-full border-[1.5px] stroke-gray-500 hover:stroke-dark-900 border-gray-200 bg-brand-50 hover:bg-brand-100 hover:stroke-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:stroke-gray-400 dark:hover:bg-gray-800 dark:hover:stroke-white"
          />
        </button>
      </div>
      <UploadUserAvatarModal isOpen={isOpen} closeModal={closeModal}>
        <UploadUserAvatarForm closeModal={closeModal} />
      </UploadUserAvatarModal>
    </>
  );
}
