import z from "zod";

export const zStudentInvite = z.object({
  full_name: z.string().trim().min(1, "College name is required"),
  invite_email: z
    .email({ error: "Enter a valid email address" })
    .trim()
    .toLowerCase(),
  college_id: z.string().trim().min(1, "college is required"),
  department_id: z.string().trim().min(1, "Department is required"),
});

export type TStudentInvite = z.infer<typeof zStudentInvite>;
