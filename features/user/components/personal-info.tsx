import { UserProfileView } from "../user.service";

type UserDetailsProps = {
  profile: UserProfileView;
};

export default function PersonalInfo({ profile }: UserDetailsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
      <div>
        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
          Full Name
        </p>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          {profile.full_name}
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
          Last Name
        </p>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          -
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
          Father Name
        </p>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          -
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
          Mother Name
        </p>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          -
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
          Father Occupation
        </p>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          -
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
          Mother Occupation
        </p>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          -
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
          Date Of Birth
        </p>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          -
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
          Religion
        </p>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          -
        </p>
      </div>
    </div>
  );
}
