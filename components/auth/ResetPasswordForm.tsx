"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import React, { useState } from "react";
import { resetPassword } from "@/lib/services/auth.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  zResetPassword,
  TResetPassword,
} from "@/lib/validations/admin/college-schema";

export default function SignInForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TResetPassword>({
    resolver: zodResolver(zResetPassword),

    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(formData: TResetPassword) {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            setError(field as keyof TResetPassword, {
              type: "server",
              message: (messages as string[])[0],
            });
          });
        }

        return;
      }

      reset();
      if (data.success) setIsSuccess(true);
    } catch (error) {
      console.error(error);
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Email <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="email"
                      error={!!errors.email}
                      hint={errors.email?.message}
                      placeholder="Enter your email"
                      {...register("email")}
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submiting..." : "Submit"}
                    </Button>
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
