import Link from "next/link";
import { InviteActionProps } from "@/features/invite/config/invite-actions";
import { Permission } from "@/lib/rbac/permissions";
import { ScopeGuard } from "@/lib/rbac/guard/ScopeGuard";
import UserRole from "@/lib/rbac/roles";

type ViewuserButtonProps = {
  context: InviteActionProps;
};

const ViewUserButton = ({ context }: ViewuserButtonProps) => {
  if (!context.userId) {
    return null;
  }

  return (
    <ScopeGuard
      anyPermission={Permission.VIEW_USER}
      ownPermission={Permission.VIEW_OWN_USER}
      targetRole={context.targetRole as UserRole}
      targetCollegeId={context.targetCollegeId}
      targetDepartmentId={context.targetDepartmentId}
    >
      <Link
        className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition p-3 text-xs bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
        href={`/admin/user/${context.userId}`}
      >
        View
      </Link>
    </ScopeGuard>
  );
};

export default ViewUserButton;
