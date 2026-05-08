import { z } from "zod";

export const CollegeSchema = z.object({
  college_name: z.string().min(1, "College name is required"),
  college_email: z.email({ error: "Enter a valid email address" }),
  phone: z.e164({ error: "Enter a valid phone number" }),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  postal_code: z.string().min(1, "Postal code is required"),
});

export type College = z.infer<typeof CollegeSchema>;
