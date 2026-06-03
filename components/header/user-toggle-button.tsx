"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import UserRole, { UserRoleLabel } from "@/lib/rbac/roles";

type UserToggleButtonProps = {
  isOpen: boolean;
  toggleDropdown: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function UserToggleButton({
  isOpen,
  toggleDropdown,
}: UserToggleButtonProps) {
  const { user } = useAuth();
  const userRole = user?.role as UserRole | undefined;

  return (
    <button
      onClick={toggleDropdown}
      className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
    >
      <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
        {user?.avatar_url ? (
          <div className="relative h-11 w-11 overflow-hidden rounded-full">
            <Image
              src={user?.avatar_url}
              alt={user?.full_name || "user"}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex size-11 items-center justify-center text-sm font-semibold uppercase text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
            {user?.full_name?.[0] ?? "U"}
          </div>
        )}
      </span>

      <div className="flex flex-col items-start">
        <span className="block mr-1 font-medium text-theme-sm">
          {user?.full_name}
        </span>
        <span className="block mr-1 font-normal text-theme-xs">
          {userRole ? (UserRoleLabel[userRole] ?? "") : ""}
        </span>
      </div>

      <svg
        className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
        width="18"
        height="20"
        viewBox="0 0 18 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
