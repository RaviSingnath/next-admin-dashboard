import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { appToast } from "../toast";

export function handleActionError(
  result: {
    success: boolean;
    code?: string;
    message?: string;
  },
  router: AppRouterInstance,
) {
  if (result.success) return;

  switch (result.code) {
    case "UNAUTHORIZED":
      router.push("/login");
      break;

    case "FORBIDDEN":
      appToast.error("You don't have permission");
      break;

    default:
      appToast.error(result.message ?? "Something went wrong");
  }
}
