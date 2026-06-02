import SignInForm from "@/components/auth/signin-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "College diary login page",
  description: "The College Diary App",
};

export default function LoginPage() {
  return <SignInForm />;
}
