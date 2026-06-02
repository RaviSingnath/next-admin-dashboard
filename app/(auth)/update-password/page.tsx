import UpdatePasswordForm from "@/components/auth/update-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "College diary login page",
  description: "The College Diary App",
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
