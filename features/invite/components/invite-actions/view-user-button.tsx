import Link from "next/link";
import { InviteActionProps } from "@/features/invite/config/invite-actions";

type ViewuserButtonProps = {
  context: InviteActionProps;
};

const ViewUserButton = ({ context }: ViewuserButtonProps) => {
  console.log(context);
  if (!context.userId) {
    return null;
  }

  return (
    <Link
      className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition p-3 text-xs bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
      href={`/admin/user/${context.userId}`}
    >
      View
    </Link>
  );
};

export default ViewUserButton;
