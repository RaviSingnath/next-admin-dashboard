// lib/helper/handle-action-result.ts

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

  if (result.code === "UNAUTHORIZED") {
    router.push("/login");
    return;
  }

  appToast.error(result.message ?? "Something went wrong");
}
