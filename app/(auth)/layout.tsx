import type { Metadata } from "next";
import Image from "next/image";
import GridShape from "@/components/common/grid-shape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

export const metadata: Metadata = {
  title: "Login to College Diary",
  description: "The College Diary app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <div className="relative flex min-h-screen w-full flex-col justify-center lg:flex-row">
        {children}

        <aside className="bg-brand-950 hidden w-full items-center lg:grid lg:w-1/2 dark:bg-white/5">
          <div className="relative z-1 flex items-center justify-center">
            <GridShape />

            <div className="flex max-w-xs flex-col items-center gap-2 lg:max-w-xl">
              <Image
                preload
                src="/images/logo/auth-logo.svg"
                width={231}
                height={48}
                alt="College Diary"
                className="h-auto w-[231px]"
              />

              <p className="text-center text-2xl font-bold text-gray-400 dark:text-white/60">
                Smart Campus Management Starts Here
              </p>

              <p className="text-center text-gray-400 dark:text-white/60">
                Manage attendance, assignments, notices, student records,
                faculty workflows, and academic operations from one centralized
                platform built for modern colleges.
              </p>
            </div>
          </div>
        </aside>

        <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
