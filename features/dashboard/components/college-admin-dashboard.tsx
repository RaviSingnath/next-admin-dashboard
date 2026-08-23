import React from "react";
import { Users, UserCog, Building2, IndianRupee, Plus } from "lucide-react";

import PendingApprovals from "./college-admin/pending-approvals";
import EnrollmentTrend from "./college-admin/enrollment-trend";
import YourPlan from "./college-admin/your-plan";
import DepartmentsBySize from "./college-admin/departments-by-size";
import RecentActivity from "./college-admin/recent-activity";
import StatsCard from "./stats-card";
import type { AuthUser } from "@/lib/auth/types";
import DashboardWrapper from "@/components/layout/dashboard-wrapper";
import AddStudentButton from "@/app/(protected)/dashboard/students/_components/add-student-button";

// Sample data — replace with Supabase queries scoped to current_college_id()
const stats = [
  {
    label: "Total students",
    value: "2,847",
    icon: Users,
    tint: "bg-brand-200/30",
    ring: "text-brand-500",
    bar: "bg-brand-500",
    note: "+64 this month",
  },
  {
    label: "Faculty & supervisors",
    value: 142,
    icon: UserCog,
    tint: "bg-success-200/30",
    ring: "text-success-600",
    bar: "bg-success-600",
    note: "9 pending invites",
  },
  {
    label: "Departments",
    value: 12,
    icon: Building2,
    tint: "bg-warning-200/30",
    ring: "text-warning-600",
    bar: "bg-warning-600",
    note: "avg. 237 students each",
  },
  {
    label: "Fee collection",
    value: "94%",
    icon: IndianRupee,
    tint: "bg-brand-200/30",
    ring: "text-brand-500",
    bar: "bg-brand-500",
    note: "₹18.4L of ₹19.6L due",
  },
];

type CollegeAdminDashboardProps = {
  user: AuthUser;
};

export default function CollegeAdminDashboard({
  user,
}: CollegeAdminDashboardProps) {
  return (
    <DashboardWrapper
      user={user}
      ActionButton={<AddStudentButton />}
      desc={`Here's how ${user.college_name} is doing this month`}
    >
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatsCard key={s.label} stats={s} />
        ))}
      </div>

      {/* Enrollment trend + plan usage */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <EnrollmentTrend />

        <YourPlan />
      </div>

      {/* Departments + pending approvals */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DepartmentsBySize />

        <PendingApprovals />
      </div>

      {/* Recent activity */}
      <RecentActivity />
    </DashboardWrapper>
  );
}
