import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "College diary login page",
  description: "The College Diary App",
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
