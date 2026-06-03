import { Metadata } from "next";
import { getInvites } from "@/lib/services/super-admin.service";
import { getColleges } from "@/features/colleges/college.service";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import InvitesList from "@/components/admin/invites/invites-list";
import EmptyInvitesList from "@/components/admin/invites/empty-invites-list";

export const metadata: Metadata = {
  title: "Next.js Blank Page | Next.js Dashboard Template",
  description: "This is Next.js Blank Page Dashboard Template",
};

export default async function InvitesPage() {
  const colleges = await getColleges();
  const invites = await getInvites();

  return (
    <PageWrapperBreadcrumb title="Invites">
      {colleges.length > 0 ? (
        <InvitesList colleges={colleges} invites={invites} />
      ) : (
        <EmptyInvitesList />
      )}
    </PageWrapperBreadcrumb>
  );
}
