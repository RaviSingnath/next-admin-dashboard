"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import React, { useState } from "react";
import { resetPassword } from "@/lib/services/auth.service";

export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleUserRestPassword(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await resetPassword(email);
      if (data.success) setIsSuccess(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in right now.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {isSuccess ? (
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Reset Password
              </h1>
            </div>
            <div>
              <p className="text-md text-gray-500 dark:text-gray-400">
                A password reset link has been sent to your email address.
                Please follow the instructions in the email to update your
                password.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Reset Password
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email to reset password!
              </p>
            </div>
            <div>
              <form onSubmit={handleUserRestPassword}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Email <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      placeholder="info@gmail.com"
                      type="email"
                      name="email"
                    />
                  </div>

                  <div>
                    <Button
                      className="w-full"
                      size="sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submiting..." : "Submit"}
                    </Button>
                    {errorMessage && (
                      <p className="mt-3 text-sm text-error-500">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <div className="flex items-center gap-3">
                      {/* <Checkbox checked={isChecked} onChange={setIsChecked} /> */}
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Already have an account?
                      </span>
                    </div>
                    <Link
                      href="/login"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
