import type { Metadata } from "next";
import Image from "next/image";
import GridShape from "@/components/common/grid-shape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

export const metadata: Metadata = {
  title: "Login to college diary",
  description: "The college diary app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
        {children}
        <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
          <div className="relative items-center justify-center  flex z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs lg:max-w-xl gap-2">
              <Image
                width={231}
                height={48}
                src="./images/logo/auth-logo.svg"
                alt="Logo"
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
        </div>
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
