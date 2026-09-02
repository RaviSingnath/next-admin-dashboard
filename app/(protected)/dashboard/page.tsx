import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUserServer } from "@/lib/auth/getCurrentUserServer";

import SupervisorDashboard from "@/features/dashboard/components/supervisor-dashboard";
import CollegeAdminDashboard from "@/features/dashboard/components/college-admin-dashboard";
import { getSupervisorDashboardService } from "@/features/dashboard/services/supervisor-dashboard.service";
import SuperAdminDashboard from "@/features/dashboard/components/super-admin-dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "College Diary Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect("/login");
  }

  switch (user.role) {
    case "supervisor": {
      const data = await getSupervisorDashboardService();

      return <SupervisorDashboard user={user} data={data} />;
    }

    case "college_admin": {
      // const data = await getCollegeAdminDashboard();
      return <CollegeAdminDashboard user={user} />;
    }

    case "super_admin": {
      // const data = await getSuperAdminDashboard();
      return <SuperAdminDashboard user={user} />;
    }

    // case "student": {
    //   const data = await getStudentDashboard();
    //   return <StudentDashboard user={user} data={data} />;
    // }

    default:
      redirect("/unauthorized");
  }
}
