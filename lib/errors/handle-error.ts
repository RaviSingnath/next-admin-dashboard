import AppError from "./app-error";

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return {
      success: false,
      code: error.code,
      message: error.message,
    };
  }

  console.error(error);

  return {
    success: false,
    code: "INTERNAL_ERROR",
    message: "Something went wrong",
  };
}
