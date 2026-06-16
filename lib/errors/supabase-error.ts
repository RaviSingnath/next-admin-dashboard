import { ERROR_CODES } from "./error-codes";

type SupabaseError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

export function mapSupabaseError(error: SupabaseError) {
  switch (error.code) {
    // Unique constraint violation
    // Example: duplicate department name
    case "23505":
      return {
        code: ERROR_CODES.ALREADY_EXISTS,
        message: "A record with this value already exists.",
        statusCode: 409,
      };

    // Foreign key violation
    // Example: deleting college that has departments
    case "23503":
      return {
        code: ERROR_CODES.CONFLICT,
        message: "This record cannot be deleted because it is still in use.",
        statusCode: 409,
      };

    // Permission denied
    case "42501":
      return {
        code: ERROR_CODES.FORBIDDEN,
        message: "You do not have permission to perform this action.",
        statusCode: 403,
      };

    // Invalid input syntax
    case "22P02":
      return {
        code: ERROR_CODES.INVALID_INPUT,
        message: "Invalid data format.",
        statusCode: 400,
      };

    default:
      return {
        code: ERROR_CODES.DATABASE_ERROR,
        message: "A database error occurred.",
        statusCode: 500,
      };
  }
}
