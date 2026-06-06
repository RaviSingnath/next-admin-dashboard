import z from "zod";

export const zCollegeAdminInvite = z.object({
  full_name: z.string().trim().min(1, "College name is required"),
  invite_email: z
    .email({ error: "Enter a valid email address" })
    .trim()
    .toLowerCase(),
  college_id: z.string().trim().min(1, "College is required"),
});

export type TCollegeAdminInvite = z.infer<typeof zCollegeAdminInvite>;
