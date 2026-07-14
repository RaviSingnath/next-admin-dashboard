import * as z from "zod";

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

export const zCollegeInfo = z.object({
  college_name: z.string().trim().min(1, "College name is required"),

  official_email: z
    .email({ error: "Enter a valid email address" })
    .trim()
    .toLowerCase(),

  phone: z
    .e164({
      error: "Enter a valid phone number",
    })
    .optional(),
});

export type TCollegeInfo = z.infer<typeof zCollegeInfo>;
