"use client";

import Image from "next/image";
import useUser from "@/hooks/useUser";
import UserRole, { UserRoleLabel } from "@/lib/rbac/roles";

type UserToggleButtonProps = {
  isOpen: boolean;
  toggleDropdown: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function UserToggleButton({
  isOpen,
  toggleDropdown,
}: UserToggleButtonProps) {
  const { user } = useUser();
  const userRole = user?.role as UserRole | undefined;

  return (
    <button
      onClick={toggleDropdown}
      className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
    >
      <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
        <Image
          width={44}
          height={44}
          src="/images/user/owner.jpeg"
          alt="User"
        />
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
