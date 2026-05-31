"use client";
import React, { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import UserToggleButton from "./user-toggle-button";
import SignOutButton from "@/components/auth/SignOutButton";
import { UserCircle2Icon, SettingsIcon, CircleAlertIcon } from "lucide-react";
import useUser from "@/hooks/useUser";
import UserRole, { UserRoleLabel } from "@/lib/rbac/roles";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const userRole = user?.role as UserRole | undefined;

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <UserToggleButton toggleDropdown={toggleDropdown} isOpen={isOpen} />

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="pb-3 border-b border-gray-200 dark:border-gray-800">
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.full_name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
        </div>
        <div className="py-3 border-b border-gray-200 dark:border-gray-800">
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.college?.college_name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {userRole ? (UserRoleLabel[userRole] ?? "") : ""}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.department?.department_name}
          </span>
        </div>
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <UserCircle2Icon
                size={24}
                className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
              />
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <SettingsIcon
                size={24}
                className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
              />
              Account settings
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <CircleAlertIcon
                size={24}
                className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
              />
              Support
            </DropdownItem>
          </li>
        </ul>

        <SignOutButton />
      </Dropdown>
    </div>
  );
}
