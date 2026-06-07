import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { normalizeError } from "@/core/errors";

export function applyFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  const appError = normalizeError(error);

  for (const [field, messages] of Object.entries(appError.fields ?? {})) {
    const message = messages[0];

    if (message) {
      setError(field as Path<T>, {
        message,
        type: "server",
      });
    }
  }

  return appError;
}
