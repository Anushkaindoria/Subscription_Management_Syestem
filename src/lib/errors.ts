/**
 * Shared Infrastructure: Application Errors & Standard HTTP Responses
 * OWNER: Dev A (@devA)
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR", details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    super(
      identifier ? `${resource} with ID '${identifier}' was not found.` : `${resource} not found.`,
      404,
      "NOT_FOUND",
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required to access this resource.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action.") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 409, "CONFLICT", details);
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 422, "BUSINESS_RULE_VIOLATION", details);
  }
}

/**
 * Transforms an unknown error into a normalized JSON payload for Next.js route handlers.
 */
export function formatErrorResponse(error: unknown): {
  statusCode: number;
  payload: { success: false; error: { code: string; message: string; details?: unknown } };
} {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      payload: {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    };
  }

  const message = error instanceof Error ? error.message : "An unexpected internal error occurred.";
  return {
    statusCode: 500,
    payload: {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message,
      },
    },
  };
}
