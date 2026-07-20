import { ElDialogPanel, ElDialog } from "@tailwindplus/elements/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="w-full bg-white dark:bg-gray-900">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <span className="sr-only">College Diary</span>
            <Image
              width="0"
              height="0"
              sizes="100vw"
              src="./images/logo/logo.svg"
              alt=""
              className="h-10 w-auto dark:hidden"
            />
            {/* <Image
                width="0"
                height="0"
                sizes="100vw"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt=""
                className="h-8 w-auto not-dark:hidden"
              /> */}
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              command="show-modal"
              commandfor="mobile-menu"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-500 dark:text-gray-400"
            >
              <span className="sr-only">Open main menu</span>
              <Menu />
            </button>
          </div>
          {/* <div className="hidden lg:flex lg:gap-x-12">
            <a
              href="#"
              className="text-sm/6 font-semibold text-gray-900 dark:text-white"
            >
              Product
            </a>
            <a
              href="#"
              className="text-sm/6 font-semibold text-gray-900 dark:text-white"
            >
              Features
            </a>
            <a
              href="#"
              className="text-sm/6 font-semibold text-gray-900 dark:text-white"
            >
              Marketplace
            </a>
            <a
              href="#"
              className="text-sm/6 font-semibold text-gray-900 dark:text-white"
            >
              Company
            </a>
          </div> */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href="/login"
              className="text-sm/6 font-semibold text-gray-900 dark:text-white"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
        <ElDialog>
          <dialog
            id="mobile-menu"
            className="backdrop:bg-transparent lg:hidden"
          >
            <div tabIndex={0} className="fixed inset-0 focus:outline-none">
              <ElDialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-gray-100/10">
                <div className="flex items-center justify-between">
                  <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">College Diary</span>
                    <Image
                      width="0"
                      height="0"
                      sizes="100vw"
                      src="./images/logo/logo.svg"
                      alt=""
                      className="h-8 w-auto dark:hidden"
                    />
                    {/* <Image
                      width="0"
                      height="0"
                      sizes="100vw"
                      src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                      alt=""
                      className="h-8 w-auto not-dark:hidden"
                    /> */}
                  </a>
                  <button
                    type="button"
                    command="close"
                    commandfor="mobile-menu"
                    className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-400"
                  >
                    <span className="sr-only">Close menu</span>
                    <X />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-500/25">
                    {/* <div className="space-y-2 py-6">
                      <a
                        href="#"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                      >
                        Product
                      </a>
                      <a
                        href="#"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                      >
                        Features
                      </a>
                      <a
                        href="#"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                      >
                        Marketplace
                      </a>
                      <a
                        href="#"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                      >
                        Company
                      </a>
                    </div> */}
                    <div className="py-6">
                      <Link
                        href="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                      >
                        Log in
                      </Link>
                    </div>
                  </div>
                </div>
              </ElDialogPanel>
            </div>
          </dialog>
        </ElDialog>
      </header>

      <div className="relative isolate pt-14">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#feb648] to-[#feb648] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75 dark:opacity-20"></div>
        </div>
        <div className="py-24 sm:py-24 lg:pb-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-5xl font-display font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
                Run your college. Not your paperwork
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
                The admin platform built for institutions that want more time
                for education. College Diary brings your entire institution
                under one roof.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                >
                  Get started
                </a>
                <a
                  href="#"
                  className="text-sm/6 font-semibold text-gray-900 dark:text-white"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            {/* <img
              width="2432"
              height="1442"
              src="https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png"
              alt="App screenshot"
              className="mt-16 rounded-md bg-gray-50 shadow-xl ring-1 ring-gray-900/10 sm:mt-24 dark:hidden"
            /> */}
            <Image
              width="2432"
              height="1442"
              sizes="100vw"
              src="/images/dashboard-screenshot/supervisors.png"
              alt="App screenshot"
              className="mt-16 rounded-md bg-gray-50 shadow-xl ring-1 ring-gray-900/10 sm:mt-24 dark:hidden"
            />
            {/* <img
              width="2432"
              height="1442"
              src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
              alt="App screenshot"
              className="mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 not-dark:hidden sm:mt-24"
            /> */}
          </div>
        </div>
        {/* <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-55rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div className="relative left-[calc(50%+3rem)] bottom-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 -translate-y-1/2 bg-linear-to-tr from-[#feb648] to-[#feb648] opacity-30 sm:left-[calc(50%+36rem)] sm:bottom-[calc(70%+20rem)] sm:w-288.75 dark:opacity-20"></div>
        </div> */}
      </div>
    </div>
  );
}
