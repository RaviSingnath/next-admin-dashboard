import { QueryData } from "@supabase/supabase-js";
import { TCollege, TCollegeInfo } from "./college.schema";
import {
  createCollegeMutation,
  updatecollegeInfo,
  updateLogoPath,
  uploadLogo,
} from "./college.mutations";
import {
  getActiveColleges,
  getCollegeByEmailQuery,
  getCollegeProfileQuery,
  getCollegesQuery,
  getLogoSignedUrlQuery,
  getAllSubscriptionsQuery,
  getActiveSubscriptionQuery,
} from "./college.queries";
import { Errors } from "@/lib/errors/error-factory";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import {
  createRequestContext,
  RequestContext,
} from "@/lib/auth/request-context";
import { collegeWithAddressQuery } from "./queries/get-college-with-address";
import { TImageFile } from "../profile/profile.schema";
import sharp from "sharp";
import {
  recordSubscriptionEvent,
  SUBSCRIPTION_EVENT_TYPES,
} from "@/lib/helper/subscription-events";

type createCollegeServiceInput = {
  ctx: RequestContext;
  data: TCollege;
};

export async function createCollegeService({
  ctx,
  data,
}: createCollegeServiceInput) {
  // We have constraint colleges_official_email_unique. It's an optional duplicate check
  const { data: existingCollege } = await getCollegeByEmailQuery(
    data.official_email,
  );

  if (existingCollege) {
    throw Errors.alreadyExists("College");
  }

  const { data: college, error } = await createCollegeMutation(data);

  if (error) {
    throw mapSupabaseError(error);
  }

  await recordSubscriptionEvent({
    collegeId: college.id,
    eventType: SUBSCRIPTION_EVENT_TYPES.COLLEGE_CREATED,
  });

  return college;
}

export async function getCollegesService() {
  const query = getCollegesQuery();

  type RawCollegesResponse = QueryData<typeof query>;

  const { data, error } = await query;

  if (error) {
    throw mapSupabaseError(error);
  }

  const collegesData = await Promise.all(
    (data ?? []).map(async (college) => {
      const profiles =
        college.profiles?.filter((profile) => profile.status === "active") ??
        [];

      if (!college.logo_url) {
        return {
          ...college,
          profiles,
        };
      }

      const { data: logo } = await getLogoSignedUrlQuery(college.logo_url);

      return {
        ...college,
        profiles,
        logo_url: logo.publicUrl,
      };
    }),
  );

  return collegesData;
}

type CollegesListResponse = Awaited<ReturnType<typeof getCollegesService>>;
export type CollegeListItem = CollegesListResponse[number];

export async function showCollegeOnMap() {
  const { data, error } = await getActiveColleges();

  if (error) {
    throw mapSupabaseError(error);
  }

  const colleges = await Promise.all(
    data.map(async (college) => {
      if (!college.logo_url) {
        return college;
      }

      const { data: logo } = await getLogoSignedUrlQuery(college.logo_url);

      return {
        ...college,
        logo_url: logo.publicUrl,
      };
    }),
  );

  return colleges;
}

type ActiveCollege = Awaited<ReturnType<typeof showCollegeOnMap>>[number];

export type MapAddress = (ActiveCollege & {
  logo_url: string | null;
})[];
export type CollegeAddress = ActiveCollege & {
  logo_url: string | null;
};

export async function getCollegeWithAddress() {
  const ctx = await createRequestContext();

  const collegeId = ctx.user.college_id;

  if (!collegeId) throw Errors.collegeNotAssigned();

  const { data, error } = await collegeWithAddressQuery(collegeId);

  if (error) {
    throw mapSupabaseError(error);
  }

  return data;
}

export async function getCollegeProfileService() {
  const ctx = await createRequestContext();

  const collegeId = ctx.user.college_id;

  if (!collegeId) throw Errors.collegeNotAssigned();

  const { data: collegeProfile, error } =
    await getCollegeProfileQuery(collegeId);

  if (!collegeProfile) throw Errors.notFound();

  if (!collegeProfile.logo_url) {
    return {
      ...collegeProfile,
      avatar_url: null,
    };
  }

  const { data: avatarData } = await getLogoSignedUrlQuery(
    collegeProfile?.logo_url,
  );

  return {
    ...collegeProfile,
    logo_url: avatarData.publicUrl,
  };
}

export type CollegeProfile = Awaited<
  ReturnType<typeof getCollegeProfileService>
>;

type updateAvatarServiceInput = {
  ctx: RequestContext;
  data: TImageFile;
};
export async function uploadLogoService({
  ctx,
  data,
}: updateAvatarServiceInput) {
  if (!ctx.user.college_id) throw Errors.collegeNotAssigned();

  const file = data.imageFile;

  const filePath = `${ctx.user.college_id}/logo.webp`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const webpBuffer = await sharp(buffer)
    .resize(500, 500, {
      fit: "cover",
      position: "centre",
    })
    .webp({ quality: 80 })
    .toBuffer();

  const { error: uploadError } = await uploadLogo(filePath, webpBuffer);

  if (uploadError) throw uploadError;

  const { data: updatedData, error: profileUpdateError } = await updateLogoPath(
    ctx.user.college_id,
    filePath,
  );

  if (profileUpdateError) throw mapSupabaseError(profileUpdateError);

  return {
    profile: updatedData,
  };
}

type updateCollegeInfoServiceInput = {
  ctx: RequestContext;
  data: TCollegeInfo;
};

export async function updateCollegeInfoService({
  ctx,
  data,
}: updateCollegeInfoServiceInput) {
  if (!ctx.user.college_id) throw Errors.collegeNotAssigned();

  if (ctx.user.college_status !== "active") {
    throw new Error("You can't update inactive college");
  }

  const { data: updatedProfile, error: profileUpdateError } =
    await updatecollegeInfo(ctx.user.college_id, data);

  if (profileUpdateError) throw mapSupabaseError(profileUpdateError);

  return {
    profile: updatedProfile,
  };
}

export async function getAllSubscriptions() {
  const ctx = await createRequestContext();
  if (!ctx.user.college_id) {
    throw Errors.collegeNotAssigned();
  }
  const { data, error } = await getAllSubscriptionsQuery(ctx.user.college_id);

  if (error) throw mapSupabaseError(error);

  return data;
}
export type AllSubscription = Awaited<ReturnType<typeof getAllSubscriptions>>;

export async function getActiveSubscription() {
  const ctx = await createRequestContext();
  if (!ctx.user.college_id) {
    throw Errors.collegeNotAssigned();
  }
  const { data, error } = await getActiveSubscriptionQuery(ctx.user.college_id);

  if (error) throw mapSupabaseError(error);

  return data;
}
export type ActiveSubscription = Awaited<
  ReturnType<typeof getActiveSubscription>
>;
