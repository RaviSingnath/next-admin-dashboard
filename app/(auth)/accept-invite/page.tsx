import { Metadata } from "next";
import AcceptInviteForm from "@/components/auth/accept-invite-form";

export const metadata: Metadata = {
  title: "Next.js Blank Page | Next.js Dashboard Template",
  description: "This is Next.js Blank Page Dashboard Template",
};

export default function AcceptInvitePage() {
  return <AcceptInviteForm />;
}
