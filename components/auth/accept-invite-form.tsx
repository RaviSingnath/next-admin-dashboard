"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/components/icons";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  zAcceptInvite,
  TAcceptInvite,
} from "@/lib/validations/admin/college-schema";
import { createClient } from "@/lib/supabase/client";

export default function AcceptInviteForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TAcceptInvite>({
    resolver: zodResolver(zAcceptInvite),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const inviteSession = useMemo(() => {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.hash.slice(1));

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (!accessToken || !refreshToken || type !== "invite") {
      return null;
    }

    return {
      accessToken,
      refreshToken,
    };
  }, []);

  async function onSubmit(formData: TAcceptInvite) {
    try {
      if (!inviteSession) {
        setError("password", {
          type: "server",
          message: "Invitation has expired. Please request a new invitation.",
        });
        return;
      }

      // 1. Establish the authenticated session from the invite link
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: inviteSession.accessToken,
        refresh_token: inviteSession.refreshToken,
      });

      if (sessionError) {
        setError("password", {
          type: "server",
          message: sessionError.message,
        });
        return;
      }

      // 2. Set the user's password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (passwordError) {
        setError("password", {
          type: "server",
          message: passwordError.message,
        });
        return;
      }

      // 3. Finalize the invitation
      const response = await fetch(`/api/auth/accept-invite?token=${token}`, {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        setError("password", {
          type: "server",
          message: result.message ?? "Failed to complete onboarding.",
        });
        return;
      }

      reset();

      router.replace("/login");
      router.refresh();
    } catch (err) {
      console.error(err);

      setError("password", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Set your password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your invite has been accepted. Choose a password to finish setting
            up your account.
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    error={!!errors.password}
                    hint={errors.password?.message}
                    {...register("password")}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>
              <div>
                <Label>
                  Confirm Password{" "}
                  <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter your password again"
                    error={!!errors.confirm_password}
                    hint={errors.confirm_password?.message}
                    {...register("confirm_password")}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>
              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Sign In
                  </Link>
                </p>
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
