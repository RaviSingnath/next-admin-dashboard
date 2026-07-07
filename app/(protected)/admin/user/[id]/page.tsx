import ComponentCard from "@/components/common/cmponent-card";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import { getProfile, UserProfileView } from "@/features/user/user.service";
import StudentProfile from "./components/student-profile";
import SupervisorProfile from "./components/supervisor-profile";
import CollegeAdminProfile from "./components/college-admin-profile";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile: UserProfileView = await getProfile(id);

  const userSection = (profile: UserProfileView) => {
    switch (profile.role) {
      case "student":
        return <StudentProfile profile={profile} />;

      case "supervisor":
        return <SupervisorProfile profile={profile} />;

      case "college_admin":
        return <CollegeAdminProfile profile={profile} />;

      default:
        return <div>Profile view not implemented for this role yet.</div>;
    }
  };

  return (
    <PageWrapperBreadcrumb title="User Profile">
      <ComponentCard title="About Me">{userSection(profile)}</ComponentCard>
    </PageWrapperBreadcrumb>
  );
}
