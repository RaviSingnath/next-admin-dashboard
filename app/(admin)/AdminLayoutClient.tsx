"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppSidebar from "@/components/layout/sidebar/app-sidebar";
import Backdrop from "@/components/layout/Backdrop";
import AppHeader from "@/components/layout/AppHeader";

type AdminLayoutClientProps = {
  children: React.ReactNode;
};

export default function AdminLayoutClient({
  children,
}: AdminLayoutClientProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex bg-zinc-50 font-sans dark:bg-black">
      <AppSidebar />
      <Backdrop />
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
