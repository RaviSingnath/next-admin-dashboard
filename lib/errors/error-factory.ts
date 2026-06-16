import AppError from "./app-error";
import { ERROR_CODES } from "./error-codes";

export const Errors = {
  unauthorized() {
    return new AppError(
      "Authentication required",
      401,
      ERROR_CODES.UNAUTHORIZED,
    );
  },

  forbidden() {
    return new AppError(
      "You do not have permission",
      403,
      ERROR_CODES.FORBIDDEN,
    );
  },

  notFound(resource = "Resource") {
    return new AppError(`${resource} not found`, 404, ERROR_CODES.NOT_FOUND);
  },

  internal(message = "Something went wrong") {
    return new AppError(message, 500, ERROR_CODES.INTERNAL_ERROR);
  },
};
