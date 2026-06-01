"use client";
import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSignoutUser() {
    setErrorMessage(null);

    try {
      setIsSubmitting(true);
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign out right now.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button
        className="justify-start group ring-0 px-4 py-2 mt-3 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-300"
        variant="plain"
        disabled={isSubmitting}
        onClick={handleSignoutUser}
      >
        <LogOut
          size={20}
          className="stroke-gray-500 group-hover:stroke-gray-700 dark:group-hover:stroke-gray-300"
        />

        {isSubmitting ? "Signing out..." : "Sign out"}
      </Button>
      {errorMessage && (
        <p className="mt-3 text-sm text-error-500">{errorMessage}</p>
      )}
    </>
  );
}
