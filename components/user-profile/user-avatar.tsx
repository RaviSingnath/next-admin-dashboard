"use client";

import Image from "next/image";
import { ImagePlus } from "lucide-react";
import UploadUserAvatarModal from "./upload-user-avatar-modal";
import { useModal } from "@/hooks/useModal";
import UploadUserAvatarForm from "./upload-user-avatar-form";

export default function UserAvatar() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <div className="relative w-20 h-20 rounded-fullbg-white">
        <Image
          width={80}
          height={80}
          src="/images/user/user-01.jpg"
          alt="user"
          className="object-cover w-full rounded-full"
        />
        <button onClick={openModal}>
          <ImagePlus
            size={24}
            className="absolute p-1 top-0 right-0 rounded-full border-[1.5px] stroke-gray-500 hover:stroke-dark-900 border-gray-200 hover:bg-gray-100 hover:stroke-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:stroke-gray-400 dark:hover:bg-gray-800 dark:hover:stroke-white"
          />
        </button>
      </div>
      <UploadUserAvatarModal isOpen={isOpen} closeModal={closeModal}>
        <UploadUserAvatarForm closeModal={closeModal} />
      </UploadUserAvatarModal>
    </>
  );
}
