"use client";

import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import UploadCollegeLogoModal from "./upload-college-logo-modal";
import UploadCollegeLogoForm from "./upload-college-logo-form";

type CollegeLogoProps = {
  collegeLogoUrl: string | null;
  collegeName: string;
};

export default function CollegeLogo({
  collegeLogoUrl,
  collegeName,
}: CollegeLogoProps) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <div className="relative w-20 h-20 rounded-full bg-white">
        {collegeLogoUrl ? (
          <Image
            width={80}
            height={80}
            src={collegeLogoUrl}
            alt="user"
            className="object-cover w-full rounded-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-base font-semibold uppercase">
            {collegeName?.[0] ?? "U"}
          </div>
        )}
        <button onClick={openModal}>
          <ImagePlus
            size={24}
            className="absolute p-1 top-0 right-0 rounded-full border-[1.5px] stroke-gray-500 hover:stroke-dark-900 border-gray-200 bg-brand-50 hover:bg-brand-100 hover:stroke-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:stroke-gray-400 dark:hover:bg-gray-800 dark:hover:stroke-white"
          />
        </button>
      </div>
      <UploadCollegeLogoModal isOpen={isOpen} closeModal={closeModal}>
        <UploadCollegeLogoForm closeModal={closeModal} />
      </UploadCollegeLogoModal>
    </>
  );
}
