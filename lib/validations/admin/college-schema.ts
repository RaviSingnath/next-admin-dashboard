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

export const zCollegeAdminInvite = z.object({
  full_name: z.string().trim().min(1, "College name is required"),
  invite_email: z
    .email({ error: "Enter a valid email address" })
    .trim()
    .toLowerCase(),
  college_id: z.string().trim().min(1, "College is required"),
});

export type TCollegeAdminInvite = z.infer<typeof zCollegeAdminInvite>;

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

export const zImageFileSchema = z
  .custom<File>((value) => value instanceof File, {
    message: "Please select a file",
  })
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "File must be less than 10MB",
  })
  .refine(
    (file) =>
      [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/svg+xml",
      ].includes(file.type),
    {
      message: "Invalid file type",
    },
  );

export const zImageFile = z.object({
  imageFile: zImageFileSchema,
});

export type TImageFile = z.infer<typeof zImageFile>;

export const zImageFiles = z.object({
  gallery: z
    .array(zImageFileSchema)
    .min(1, "Select at least one image")
    .max(5, "Maximum 5 images"),
});

export type TImageFiles = z.infer<typeof zImageFiles>;
