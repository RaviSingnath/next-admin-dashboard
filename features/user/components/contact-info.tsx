import { UserProfileView } from "../user.service";

type UserDetailsProps = {
  profile: UserProfileView;
};

export default function ContactInfo({ profile }: UserDetailsProps) {
  return (
    <div className="flex gap-4 flex-col col-span-2 lg:col-span-1 p-4 rounded-sm border border-gray-300 dark:border-gray-800 sm:p-6">
      <div className="text-lg md:mb-4 font-normal text-center text-gray-800 dark:text-white/90 xl:text-left">
        Contact Information
        <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
          <p className="text-sm text-gray-500 dark:text-gray-400">Home</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Primary Phone
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {profile.phone}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Secondry Phone
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            -
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Primary Email
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {profile.email}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Secondry Email
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            -
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            City
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {profile?.details?.addresses?.city || "-"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            State
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {profile?.details?.addresses?.state_province || "-"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Country
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {profile?.details?.addresses?.country || "-"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Postal Code
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {profile?.details?.addresses?.postal_code || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
