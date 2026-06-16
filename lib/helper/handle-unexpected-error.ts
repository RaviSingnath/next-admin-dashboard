import { appToast } from "@/lib/toast";

export function handleUnexpectedError(error: unknown) {
  console.error(error);

  appToast.error("Something went wrong. Please try again.");
}
