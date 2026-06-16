import UserAvatar from "@/components/common/user-avatar";
import { UserProfileView } from "../user.service";
import UserRole, { UserRoleLabel } from "@/lib/rbac/roles";
import PersonalInfo from "./personal-info";

type UserDetailsProps = {
  profile: UserProfileView;
};

export default function UserDetails({ profile }: UserDetailsProps) {
  const userRole = profile?.role as UserRole | undefined;

  return (
    <div className="flex gap-4 flex-col col-span-2 lg:col-span-1 p-4 rounded-sm border border-gray-300 dark:border-gray-800 sm:p-6">
      <div className="flex items-center gap-4">
        <UserAvatar profile={profile} className="size-18" />
        <div className="order-3 xl:order-2">
          <h4 className="text-lg font-normal text-center text-gray-800 dark:text-white/90 xl:text-left">
            {profile?.full_name}
          </h4>
          <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userRole ? (UserRoleLabel[userRole] ?? "") : ""}
            </p>
          </div>
        </div>
      </div>
      <PersonalInfo profile={profile} />
    </div>
  );
}
