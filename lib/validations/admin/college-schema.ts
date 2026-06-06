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

export const zAcceptInvite = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"], // Sets the error on the confirmPassword field
  });

export type TAcceptInvite = z.infer<typeof zAcceptInvite>;


