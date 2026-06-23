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
  Layers,
  Receipt,
  TrendingUp,
  Plug,
  ToggleRight,
  Lock,
  Calendar,
  WalletCards,
  MessageSquare,
  Megaphone,
  Bell,
  Building,
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
          path: "/admin/colleges",
          icon: School,
        },
        {
          name: "College Admins",
          path: "/admin/college-admins",
          icon: UserCog,
        },
        {
          name: "Invites",
          path: "/invites",
          icon: Mail,
        },
      ],
    },

    {
      name: "User Management",
      icon: Users,
      subItems: [
        {
          name: "Users",
          path: "/admin/users",
          icon: Users,
        },
        {
          name: "Roles & Permissions",
          path: "/admin/roles",
          icon: ShieldCheck,
        },
      ],
    },

    {
      name: "Finance",
      icon: Landmark,
      subItems: [
        {
          name: "Plans",
          path: "/admin/plans",
          icon: Layers,
        },
        {
          name: "Subscriptions",
          path: "/admin/subscriptions",
          icon: CreditCard,
        },
        {
          name: "Payments",
          path: "/admin/payments",
          icon: Receipt,
        },
        {
          name: "Invoices",
          path: "/admin/invoices",
          icon: FileText,
        },
        {
          name: "Revenue Reports",
          path: "/admin/revenue",
          icon: TrendingUp,
        },
      ],
    },

    {
      name: "Security",
      icon: ShieldCheck,
      subItems: [
        {
          name: "Audit Logs",
          path: "/admin/audit-logs",
          icon: ClipboardList,
        },
        {
          name: "Security Settings",
          path: "/admin/security",
          icon: Lock,
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
        {
          name: "Integrations",
          path: "/admin/integrations",
          icon: Plug,
        },
        {
          name: "Feature Flags",
          path: "/admin/features",
          icon: ToggleRight,
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
          path: "/dashboard/departments",
          icon: FolderKanban,
        },
        {
          name: "Programs",
          path: "/dashboard/programs",
          icon: GraduationCap,
        },
        {
          name: "Courses",
          path: "/dashboard/courses",
          icon: BookOpen,
        },
        {
          name: "Academic Years",
          path: "/dashboard/academic-years",
          icon: Calendar,
        },
      ],
    },

    {
      name: "People",
      icon: Users,
      subItems: [
        {
          name: "Students",
          path: "/dashboard/students",
          icon: GraduationCap,
        },
        {
          name: "Supervisors",
          path: "/dashboard/supervisors",
          icon: UserCog,
        },
        {
          name: "Invites",
          path: "/invites",
          icon: Mail,
        },
        {
          name: "Roles & Permissions",
          path: "/dashboard/roles",
          icon: ShieldCheck,
        },
      ],
    },

    {
      name: "Finance",
      icon: Landmark,
      subItems: [
        {
          name: "Subscription",
          path: "/dashboard/billing",
          icon: CreditCard,
        },
        {
          name: "Payments",
          path: "/dashboard/payments",
          icon: Receipt,
        },
        {
          name: "Payment Settings",
          path: "/dashboard/payment-settings",
          icon: WalletCards,
        },
      ],
    },

    {
      name: "Communication",
      icon: MessageSquare,
      subItems: [
        {
          name: "Announcements",
          path: "/dashboard/announcements",
          icon: Megaphone,
        },
        {
          name: "Notifications",
          path: "/dashboard/notifications",
          icon: Bell,
        },
        {
          name: "Email Templates",
          path: "/dashboard/email-templates",
          icon: Mail,
        },
      ],
    },

    {
      name: "Administration",
      icon: Settings,
      subItems: [
        {
          name: "College Profile",
          path: "/settings/profile",
          icon: Building,
        },
        {
          name: "Settings",
          path: "/settings",
          icon: Settings,
        },
        {
          name: "Audit Logs",
          path: "/audit-logs",
          icon: ClipboardList,
        },
        {
          name: "Integrations",
          path: "/integrations",
          icon: Plug,
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
          path: "/students",
          icon: Users,
        },
        {
          name: "invites",
          path: "/invites",
          icon: Mail,
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
