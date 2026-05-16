import * as z from "zod";

export const zSignIn = z.object({
  email: z.email({ error: "Enter a valid email address" }).trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type TSignIn = z.infer<typeof zSignIn>;

export const zResetPassword = z.object({
  email: z.email({ error: "Enter a valid email address" }).trim().toLowerCase(),
});

export type TResetPassword = z.infer<typeof zResetPassword>;

export const zUpdatePassword = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"], // Sets the error on the confirmPassword field
  });

export type TUpdatePassword = z.infer<typeof zUpdatePassword>;

export const zCollege = z.object({
  college_name: z.string().trim().min(1, "College name is required"),

  official_email: z
    .email({ error: "Enter a valid email address" })
    .trim()
    .toLowerCase(),

  phone: z.e164({
    error: "Enter a valid phone number",
  }),

  country: z.string().trim().min(1, "Country is required"),

  state: z.string().trim().min(1, "State is required"),

  city: z.string().trim().min(1, "City is required"),

  postal_code: z.string().trim().min(1, "Postal code is required"),
});

export type TCollege = z.infer<typeof zCollege>;

export const zCollegeAdminInvite = z.object({
  invite_email: z
    .email({ error: "Enter a valid email address" })
    .trim()
    .toLowerCase(),
  college_id: z.string().trim().min(1, "College is required"),
});

export type TCollegeAdminInvite = z.infer<typeof zCollegeAdminInvite>;

export const zAcceptInvite = z
  .object({
    full_name: z.string().trim().min(1, "Full name is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"], // Sets the error on the confirmPassword field
  });

export type TAcceptInvite = z.infer<typeof zAcceptInvite>;
