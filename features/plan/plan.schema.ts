import z from "zod";

export const zAdminPlan = z.object({
  display_order: z.number().positive("Must be a positive number"),
});

export type TAdminPlan = z.infer<typeof zAdminPlan>;
