import * as z from "zod";

export const zPlan = z.object({
  planId: z.string().min(1, { message: "Please choose a plan" }),
});

export type TPlan = z.infer<typeof zPlan>;
