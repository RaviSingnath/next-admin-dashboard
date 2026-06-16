"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { UserProfileView } from "@/features/user/user.service";

type UserAvatarProps = {
  className: string;
  profile: UserProfileView;
};

export default function UserAvatar({ className, profile }: UserAvatarProps) {
  return (
    <div className={cn("rounded-full bg-white", className)}>
      {profile?.avatar ? (
        <Image
          width={80}
          height={80}
          src={profile?.avatar}
          alt="user"
          className="object-cover w-full rounded-full"
        />
      ) : (
        <div className="flex w-full h-full items-center justify-center rounded-full bg-muted text-base font-semibold uppercase">
          {profile?.full_name?.[0] ?? "U"}
        </div>
      )}
    </div>
  );
}
