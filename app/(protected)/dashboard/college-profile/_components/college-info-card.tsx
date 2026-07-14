"use client";

import { AsYouType } from "libphonenumber-js";
import { useCollegeProfile } from "@/context/college-profile-context";
import EditCollegeInfoButton from "./edit-college-info-button";
import { Card } from "@/components/ui/card";

export default function CollegeInfoCard() {
  const collegeProfile = useCollegeProfile();

  return (
    <Card className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between p-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Personal Information
        </h4>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Name
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {collegeProfile.college_name}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Email address
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {collegeProfile.official_email}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Phone
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {collegeProfile?.phone &&
                new AsYouType().input(collegeProfile?.phone)}
            </p>
          </div>
        </div>
      </div>
      <EditCollegeInfoButton />
    </Card>
  );
}
