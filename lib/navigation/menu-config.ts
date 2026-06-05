import UserRole from "@/lib/rbac/roles";
import { Permission } from "@/lib/rbac/permissions";

import {
  LayoutGrid,
  LayoutDashboard,
  BarChart3,
  Building2,
  UserCog,
  CreditCard,
  ShieldCheck,
  Settings,
  GraduationCap,
  Users,
  FolderKanban,
  FileText,
  UserCircle2,
  Landmark,
  School,
  ClipboardList,
  BookOpen,
  Mail,
  type LucideIcon,
} from "lucide-react";

export type MenuItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  permission?: Permission;
};

export type MenuGroup = {
  name: string;
  icon?: LucideIcon;
  path?: string;
  subItems: MenuItem[];
};

export const MENU_CONFIG: Record<UserRole, MenuGroup[]> = {
  // =====================================================
  // PLATFORM SUPER ADMIN
  // Separate admin area for platform-level management
  // =====================================================
  [UserRole.SUPER_ADMIN]: [
    {
      name: "Overview",
      icon: LayoutGrid,
      subItems: [
        {
          name: "Dashboard",
          path: "/admin",
          icon: LayoutDashboard,
        },
        {
          name: "Platform Analytics",
          path: "/admin/analytics",
          icon: BarChart3,
        },
      ],
    },

    {
      name: "Tenant Management",
      icon: Building2,
      subItems: [
        {
          name: "Colleges",
          path: "/colleges",
          icon: School,
        },
        {
          name: "College Admins",
          path: "/admin/colleges-admin",
          icon: UserCog,
        },
        {
          name: "invites",
          path: "/admin/invites",
          icon: Mail,
        },
      ],
    },

    {
      name: "Finance & Security",
      icon: ShieldCheck,
      subItems: [
        {
          name: "Billing",
          path: "/admin/billing",
          icon: CreditCard,
        },
        {
          name: "Audit Logs",
          path: "/admin/audit-logs",
          icon: ClipboardList,
        },
      ],
    },

    {
      name: "System",
      icon: Settings,
      subItems: [
        {
          name: "Platform Settings",
          path: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ],

  // =====================================================
  // COLLEGE ADMIN
  // Tenant-level dashboard
  // =====================================================
  [UserRole.COLLEGE_ADMIN]: [
    {
      name: "Overview",
      icon: LayoutGrid,
      subItems: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Reports",
          path: "/dashboard/reports",
          icon: BarChart3,
          permission: Permission.VIEW_REPORTS,
        },
      ],
    },

    {
      name: "Academic Management",
      icon: BookOpen,
      subItems: [
        {
          name: "Departments",
          path: "/departments",
          icon: FolderKanban,
        },
        {
          name: "Supervisors",
          path: "/college-admin/supervisors",
          icon: Users,
        },
        {
          name: "Students",
          path: "/dashboard/students",
          icon: GraduationCap,
        },
      ],
    },

    {
      name: "Finance",
      icon: Landmark,
      subItems: [
        {
          name: "Payments",
          path: "/dashboard/payments",
          icon: CreditCard,
        },
      ],
    },

    {
      name: "Administration",
      icon: ShieldCheck,
      subItems: [
        {
          name: "Audit Logs",
          path: "/dashboard/audit-logs",
          icon: ClipboardList,
        },
        {
          name: "Settings",
          path: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
  ],

  // =====================================================
  // SUPERVISOR
  // =====================================================
  [UserRole.SUPERVISOR]: [
    {
      name: "Overview",
      icon: LayoutGrid,
      subItems: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },

    {
      name: "Student Management",
      icon: GraduationCap,
      subItems: [
        {
          name: "My Students",
          path: "/supervisor/students",
          icon: Users,
        },
      ],
    },

    {
      name: "Finance",
      icon: Landmark,
      subItems: [
        {
          name: "Payments",
          path: "/dashboard/payments",
          icon: CreditCard,
        },
      ],
    },

    {
      name: "Reports",
      icon: FileText,
      subItems: [
        {
          name: "Reports",
          path: "/dashboard/reports",
          icon: BarChart3,
        },
      ],
    },
  ],

  // =====================================================
  // STUDENT
  // =====================================================
  [UserRole.STUDENT]: [
    {
      name: "Overview",
      icon: LayoutGrid,
      subItems: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },

    {
      name: "My Account",
      icon: UserCircle2,
      subItems: [
        {
          name: "My Profile",
          path: "/student/profile",
          icon: UserCircle2,
        },
        {
          name: "Documents",
          path: "/dashboard/documents",
          icon: FolderKanban,
        },
      ],
    },

    {
      name: "Finance",
      icon: Landmark,
      subItems: [
        {
          name: "Fees & Payments",
          path: "/dashboard/payments",
          icon: CreditCard,
        },
      ],
    },
  ],
};
