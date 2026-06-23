import UserDetails from "@/features/user/components/user-details";
import ContactInfo from "@/features/user/components/contact-info";
import AcademicInfo from "@/features/user/components/academic-info";
import { UserProfileView } from "@/features/user/user.service";

type SupervisorProfileProps = {
  profile: UserProfileView;
};

export default function SupervisorProfile({ profile }: SupervisorProfileProps) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
      <UserDetails profile={profile} />
      <ContactInfo profile={profile} />
      <AcademicInfo profile={profile} />
    </div>
  );
}
