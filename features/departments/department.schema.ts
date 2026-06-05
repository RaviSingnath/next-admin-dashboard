import * as z from "zod";

export const zAddDepartment = z.object({
  department_name: z.string().trim().min(1, "College name is required"),
});

export type TAddDepartment = z.infer<typeof zAddDepartment>;
