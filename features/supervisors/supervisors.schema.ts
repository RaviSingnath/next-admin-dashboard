import * as z from "zod";

export const zSupervisorInvite = z.object({
  full_name: z.string().trim().min(1, "College name is required"),
  invite_email: z
    .email({ error: "Enter a valid email address" })
    .trim()
    .toLowerCase(),
  college_id: z.string().trim().min(1, "college is required"),
  department_id: z.string().trim().min(1, "Department is required"),
});

export type TSupervisorInvite = z.infer<typeof zSupervisorInvite>;
