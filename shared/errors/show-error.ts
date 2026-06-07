"use client";

import { normalizeError } from "@/core/errors";
import { toast } from "sonner";

export function showError(error: unknown) {
  const appError = normalizeError(error);
  toast.error(appError.message);
  return appError;
}
