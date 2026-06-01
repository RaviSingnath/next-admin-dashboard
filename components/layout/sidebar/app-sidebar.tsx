"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MENU_CONFIG, type MenuGroup } from "@/lib/navigation/menu-config";
import { useAuth } from "@/context/AuthProvider";
import { useSidebar } from "@/context/SidebarContext";
import { HorizontaLDots } from "../../icons/index";
import MenuItems from "./menu-items";
import UserRole from "@/lib/rbac/roles";

const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  console.log(user);
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const userRole = (user?.role as UserRole) || "";
  const collegeName = user?.college_name || "";

  const navItems: MenuGroup[] | [] = userRole ? MENU_CONFIG[userRole] : [];

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-72.5"
            : isHovered
              ? "w-72.5"
              : "w-22.5"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <Image
                className="dark:hidden w-auto h-auto max-w-44"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
                unoptimized
                loading="eager"
              />
              <Image
                className="hidden dark:block w-auto h-auto"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
                unoptimized
                loading="eager"
              />
            </div>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={150}
              height={32}
              unoptimized
              loading="eager"
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  collegeName
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {/* {renderMenuItems(navItems, "main")} */}
              <MenuItems navItems={navItems} menuType="main" />
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
