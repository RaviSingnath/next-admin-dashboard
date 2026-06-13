import * as z from "zod";

const nullableString = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable()
  .optional();

export const zEditAddress = z.object({
  place_id: nullableString,

  address_line_1: nullableString,

  address_line_2: nullableString,

  formatted_address: nullableString,

  city: z.string().trim().min(1, "City is required"),

  state_province: z.string().trim().min(1, "State is required"),

  country: z.string().trim().min(1, "Country is required"),
  country_code: z.string().trim().nullable().optional(),

  postal_code: z.string().trim().min(1, "Postal code is required"),

  latitude: z.number().nullable().optional(),

  longitude: z.number().nullable().optional(),
});

export type TEditAddress = z.infer<typeof zEditAddress>;
