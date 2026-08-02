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
import { cn } from "@/lib/utils";

const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const userRole = (user?.role as UserRole) || "";
  const collegeName = user?.college_name || "";

  const navItems: MenuGroup[] | [] = userRole ? MENU_CONFIG[userRole] : [];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded || isMobileOpen ? "w-72.5" : isHovered ? "w-72.5" : "w-22.5"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-6 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <Image
                className="h-auto w-auto max-w-32 dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
                unoptimized
                loading="eager"
              />
              <Image
                className="hidden h-auto w-auto dark:block"
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
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className={cn(`flex flex-col gap-2`)}>
            <h2
              className={`flex text-xs leading-5 text-gray-400 uppercase ${
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
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
