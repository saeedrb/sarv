import { AppError } from "@/core/errors";

type FileValidationOptions = {
  maxSizeInMb?: number;
  acceptedTypes?: string[];
};

export function validateFile(
  file: File,
  { acceptedTypes, maxSizeInMb = 5 }: FileValidationOptions = {},
) {
  const maxSize = maxSizeInMb * 1024 * 1024;

  if (file.size > maxSize) {
    throw new AppError(`File size must be less than ${maxSizeInMb}MB.`, {
      code: "FILE_TOO_LARGE",
    });
  }

  if (acceptedTypes?.length && !acceptedTypes.includes(file.type)) {
    throw new AppError("File type is not allowed.", {
      code: "INVALID_FILE_TYPE",
    });
  }
}

export function createUploadFormData(
  file: File,
  fields: Record<string, string | Blob> = {},
) {
  const formData = new FormData();
  formData.set("file", file);

  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }

  return formData;
}
