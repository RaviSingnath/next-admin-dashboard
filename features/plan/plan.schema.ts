import z from "zod";

const zPlanFeature = z.object({
  id: z.uuid().nullable(),
  feature: z.string().min(1, "Feature cannot be empty").trim(),
  display_order: z.number().int().min(0),
});

export type TPlanFeature = z.infer<typeof zPlanFeature>;

export const zAdminPlan = z.object({
  display_order: z.number().positive("Must be a positive number"),
  // features: z
  //   .array(z.object({ feature: z.string(), order: z.number() }))
  //   .optional(),
  features: z.array(zPlanFeature).min(1, "Add at least one feature"),
});

export type TAdminPlan = z.infer<typeof zAdminPlan>;
