import createClient from "@/lib/supabase/server";
import { createAdminClient } from "../supabase/admin";
import { QueryData } from "@supabase/supabase-js";
import type {
  TCollege,
  TCollegeAdminInvite,
} from "@/lib/validations/admin/college-schema";
import { AppError } from "@/lib/app-error";

export async function createCollege(data: TCollege) {
  const supabase = await createClient();

  // Optional duplicate check
  const { data: existingCollege } = await supabase
    .from("colleges")
    .select("id")
    .eq("official_email", data.official_email)
    .maybeSingle();

  if (existingCollege) {
    throw new Error("College email already exists");
  }

  const { data: college, error } = await supabase
    .from("colleges")
    .insert({
      college_name: data.college_name,
      official_email: data.official_email,
      phone: data.phone,
      country: data.country,
      state: data.state,
      city: data.city,
      postal_code: data.postal_code,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return college;
}

export async function getColleges() {
  const supabase = await createClient();

  const query = supabase.from("colleges").select(`
    id,
    college_name,
    official_email,
    phone,
    logo_url,
    country,
    status,
    stripe_connected_account_id,
    created_at,
    profiles (
      id,
      full_name,
      avatar,
      is_active
    )
  `);

  type RawCollegesResponse = QueryData<typeof query>;

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const collegesData: RawCollegesResponse =
    data?.map((college) => ({
      ...college,
      profiles: college.profiles?.filter((profile) => profile.is_active) ?? [],
    })) ?? [];

  return collegesData;
}

export type CollegesListResponse = Awaited<ReturnType<typeof getColleges>>;

export type CollegeListItem = CollegesListResponse[number];

export async function inviteCollegeAdmin(data: TCollegeAdminInvite) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const { data: existingInvite } = await supabase
    .from("invitations")
    .select("id")
    .eq("email", data.invite_email)
    .maybeSingle();

  if (existingInvite) {
    throw new AppError("Invitation already exists", 409, "INVITATION_EXISTS");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin") {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const { error } = await supabase.from("invitations").insert({
    email: data.invite_email,
    role: "college_admin",
    college_id: data.college_id,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new AppError(error.message, 400, error.code || "DATABASE_ERROR");
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite`;

  const { data: invite, error: inviteError } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(data.invite_email, {
      redirectTo: inviteUrl,
    });

  if (inviteError) {
    throw new AppError(
      inviteError.message,
      400,
      inviteError.code || "INVITE_ERROR",
    );
  }

  return invite;
}

export async function getCollegeAdmins() {
  const supabase = await createClient();

  const query = supabase
    .from("invitations")
    .select(
      `
    id,
    email,
    role,
    status,
    expires_at,
    accepted_at,
    created_at,

    college:colleges (
      id,
      college_name
    ),

    invited_by_profile:profiles (
      id,
      full_name,
      email
    )
  `,
    )
    .order("created_at", { ascending: false })
    .eq("role", "college_admin");

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}
export type CollegeAdminsListResponse = Awaited<
  ReturnType<typeof getCollegeAdmins>
>;

export type CollegeAdminListItem = CollegeAdminsListResponse[number];
