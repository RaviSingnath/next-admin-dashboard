export type ActionResponse<T = unknown> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      code: string;
      message?: string;
      errors?: Record<string, string[]>;
    };
