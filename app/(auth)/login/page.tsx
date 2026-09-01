import SignInForm from "@/components/auth/signin-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "College diary login page",
  description: "The College Diary App",
};

export default function LoginPage() {
  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}
