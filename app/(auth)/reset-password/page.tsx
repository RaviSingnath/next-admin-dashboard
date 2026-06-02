import ResetPassword from "@/components/auth/reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "College diary login page",
  description: "The College Diary App",
};

export default function ResetPasswordPage() {
  return <ResetPassword />;
}
