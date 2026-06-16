import AppError from "./app-error";
import { ERROR_CODES } from "./error-codes";

type SupabaseAuthError = {
  message: string;
  code?: string;
};

export function mapSupabaseAuthError(error: SupabaseAuthError) {
  switch (error.code) {
    case "email_exists":
      return new AppError(
        "A user with this email already exists.",
        409,
        ERROR_CODES.ALREADY_EXISTS,
        {
          provider: "supabase",
          originalCode: error.code,
          originalMessage: error.message,
        },
      );

    case "over_email_send_rate_limit":
      return new AppError(
        "Too many invitation attempts. Please try again later.",
        429,
        ERROR_CODES.RATE_LIMITED,
      );

    default:
      console.error("Supabase invite error:", error);

      return new AppError(
        "Unable to send invitation email.",
        500,
        ERROR_CODES.INVITE_FAILED,
      );
  }
}
