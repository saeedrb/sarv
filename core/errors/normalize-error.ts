import { AppError, type FieldErrors } from "./app-error";

type ErrorPayload = {
  code?: unknown;
  message?: unknown;
  errors?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toFieldErrors(value: unknown): FieldErrors | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const fields = Object.entries(value).reduce<FieldErrors>(
    (result, [field, messages]) => {
      if (Array.isArray(messages)) {
        const validMessages = messages.filter(
          (message): message is string => typeof message === "string",
        );

        if (validMessages.length > 0) {
          result[field] = validMessages;
        }
      } else if (typeof messages === "string") {
        result[field] = [messages];
      }

      return result;
    },
    {},
  );

  return Object.keys(fields).length > 0 ? fields : undefined;
}

export function errorFromResponse(
  payload: unknown,
  status: number,
  fallbackMessage: string,
): AppError {
  const body: ErrorPayload = isRecord(payload) ? payload : {};

  return new AppError(
    typeof body.message === "string" ? body.message : fallbackMessage,
    {
      code:
        typeof body.code === "string" ? body.code : `HTTP_${String(status)}`,
      status,
      fields: toFieldErrors(body.errors),
    },
  );
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return new AppError("The request was cancelled.", {
      code: "REQUEST_ABORTED",
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new AppError(error.message, {
      code: "UNEXPECTED_ERROR",
      cause: error,
    });
  }

  return new AppError("An unexpected error occurred.", {
    code: "UNKNOWN_ERROR",
    cause: error,
  });
}
