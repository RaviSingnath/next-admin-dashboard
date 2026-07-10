import { getAvatarSignedUrlQuery } from "@/features/queries";
import { CurrentUserQueryResult } from "@/features/queries";

type CollegeSubscriptions = {
  id: string;
  status: string;
  plan_id: string;
};

export const currentUserProfile = async (profile: CurrentUserQueryResult) => {
  const departments = profile?.colleges?.departments
    .filter((d) => !d.deleted_at)
    .map((d) => ({ id: d.id, department_name: d.department_name }));

  const college = Array.isArray(profile.colleges)
    ? profile.colleges[0]
    : profile.colleges;
  const activeSubscription = college?.college_subscriptions.find(
    (s: CollegeSubscriptions) => s.status === "active",
  );

  const collegeDepartments = profile.colleges
    ? profile.colleges.departments
    : [];

  const department = Array.isArray(profile.departments)
    ? profile.departments[0]
    : profile.departments;

  const address = Array.isArray(profile.addresses)
    ? profile.addresses[0]
    : profile.addresses;

  const userProfile = {
    id: profile.id,
    email: profile.email ?? "",
    address_id: profile.address_id,
    phone: profile.phone,

    role: profile.role,
    full_name: profile.full_name,
    status: profile.status,

    college_id: profile.college_id,
    college_name: college?.college_name ?? null,
    college_status: college?.status ?? null,

    subscription_plan_id: activeSubscription?.plan_id ?? null,

    college_departments: collegeDepartments,

    departments: departments,
    department_id: profile.department_id,
    department_name: department?.department_name ?? null,

    city: address?.city ?? null,
    state_province: address?.state_province,
    country: address?.country,
    country_code: address?.country_code,
    postal_code: address?.postal_code,
  };

  if (!profile.avatar) {
    return {
      ...userProfile,
      avatar_url: null,
    };
  }

  const { data: avatarData, error: bucketError } =
    await getAvatarSignedUrlQuery(profile.avatar);

  if (bucketError) {
    return {
      ...userProfile,
      avatar_url: null,
    };
  }

  return {
    ...userProfile,
    avatar_url: avatarData.signedUrl,
  };
};
