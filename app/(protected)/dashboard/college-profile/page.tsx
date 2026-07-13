import { getCollegeWithAddress } from "@/features/colleges/college.service";
import CollegeAddressCard from "./_components/college-address-card";

export default async function CollegeProfilePage() {
  const data = await getCollegeWithAddress();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        College Profile
      </h3>
      <div className="space-y-6">
        {/* <UserMetaCard />
        <UserInfoCard />
        <UserAddressCard /> */}
        <CollegeAddressCard collegeAddress={data.addresses} />
      </div>
    </div>
  );
}
