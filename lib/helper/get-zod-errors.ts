import * as z from "zod";

export function getZodErrors(error: z.ZodError) {
  return z.flattenError(error).fieldErrors;
}
