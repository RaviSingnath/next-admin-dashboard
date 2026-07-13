import AddressCard from "@/components/common/address-card";
import EditCollegeAddressButton from "./edit-college-address-button";
import { CollegeAddress } from "@/features/colleges/queries/get-college-with-address";

type CollegeAddressCardProps = {
  collegeAddress: CollegeAddress;
};

export default async function CollegeAddressCard({
  collegeAddress,
}: CollegeAddressCardProps) {
  return (
    <AddressCard address={collegeAddress}>
      <EditCollegeAddressButton collegeAddress={collegeAddress} />
    </AddressCard>
  );
}
