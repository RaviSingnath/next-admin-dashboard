"use client";

import { AsYouType } from "libphonenumber-js";
import { useAuth } from "@/context/AuthProvider";
import UserRole, { UserRoleLabel } from "@/lib/rbac/roles";
import EditProfileButton from "./edit-profile-button";

export default function UserInfoCard() {
  const { user } = useAuth();
  const userRole = user?.role as UserRole | undefined;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.full_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email}
              </p>
            </div>

            {user?.department_name && (
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Department
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.department_name}
                </p>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.phone && new AsYouType().input(user?.phone)}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userRole ? (UserRoleLabel[userRole] ?? "") : ""}
              </p>
            </div>
          </div>
        </div>
        <EditProfileButton />
      </div>
    </div>
  );
}
