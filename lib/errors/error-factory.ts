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

  forbidden(message = "You do not have permission") {
    return new AppError(message, 403, ERROR_CODES.FORBIDDEN);
  },

  notFound(message = "Record not found") {
    return new AppError(message, 404, ERROR_CODES.NOT_FOUND);
  },

  conflict(message = "Conflict occurred") {
    return new AppError(message, 409, ERROR_CODES.CONFLICT);
  },

  alreadyExists(resource = "Record") {
    return new AppError(
      `${resource} already exists`,
      409,
      ERROR_CODES.ALREADY_EXISTS,
    );
  },

  collegeNotAssigned() {
    throw new AppError(
      "College association missing",
      403,
      ERROR_CODES.COLLEGE_NOT_ASSIGNED,
    );
  },

  inviteFailed() {
    return new AppError(
      "Unable to send invitation.",
      500,
      ERROR_CODES.INVITE_FAILED,
    );
  },

  database() {
    return new AppError(
      "Database operation failed",
      500,
      ERROR_CODES.DATABASE_ERROR,
    );
  },

  internal() {
    return new AppError(
      "Something went wrong",
      500,
      ERROR_CODES.INTERNAL_ERROR,
    );
  },
};
