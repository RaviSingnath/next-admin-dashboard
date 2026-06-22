import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DropZone from "../ui/drop-zone/drop-zone";
import { useRouter } from "next/navigation";
import { zImageFile, TImageFile } from "@/features/profile/profile.schema";
import Button from "../ui/button/Button";
import FormWrapper from "@/components/common/form-wrapper";
import { appToast } from "@/lib/toast";
import { uploadAvatarAction } from "@/app/(admin)/profile/_lib/profile.actions";
import {
  handleActionError,
  handleUnexpectedError,
} from "@/lib/helper/error-handler";
import { useAuth } from "@/context/AuthProvider";

type UploadUserAvatarFormProps = {
  closeModal: () => void;
};

export default function UploadUserAvatarForm({
  closeModal,
}: UploadUserAvatarFormProps) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleUpload = (files: File[]) => {
    setValue("imageFile", files[0], {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Show local preview
    const objectUrl = URL.createObjectURL(files[0]);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = objectUrl;
    setPreview(objectUrl);
  };

  const form = useForm<TImageFile>({
    resolver: zodResolver(zImageFile),
  });

  const {
    register,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    register("imageFile");
  }, [register]);

  const profileAvatar = watch("imageFile");

  const onSubmit = async (formData: TImageFile) => {
    try {
      const payload = new FormData();
      payload.append("imageFile", formData.imageFile);

      const result = await uploadAvatarAction(payload);

      if (!result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            setError(field as keyof TImageFile, {
              type: "server",
              message: (messages as string[])[0],
            });
          });
          return;
        }

        handleActionError(result, router);
        return;
      }

      await refreshUser();

      appToast.success("Avatar changed successfully");

      reset();
      closeModal();
    } catch (error) {
      console.error(error);
      handleUnexpectedError(error);
    }
  };

  return (
    <FormWrapper
      form={form}
      closeModal={closeModal}
      onSubmit={onSubmit}
      isPending={isSubmitting}
      submitLabel="Update"
      pendingLabel="Updating..."
    >
      <DropZone onFilesSelected={handleUpload} />
      {preview && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-gray-700 dark:text-gray-400">
            <span>Selected file</span>
            <span>Max 10MB</span>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 p-4">
            <Image
              src={preview}
              alt="preview"
              width={140}
              height={140}
              unoptimized
              className="max-h-40 rounded-lg object-contain"
            />
            <div className="text-center">
              <p className="font-semibold text-gray-800 text-sm dark:text-white/90">
                {profileAvatar.name}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                {(profileAvatar.size / 1048576).toFixed(2)}MB
              </p>
              {errors.imageFile && (
                <p className="text-red-500">{errors.imageFile.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>

            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      )}
    </FormWrapper>
  );
}
