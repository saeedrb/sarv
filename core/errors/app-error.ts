export type FieldErrors = Record<string, string[]>;

export type AppErrorOptions = {
  code?: string;
  status?: number;
  fields?: FieldErrors;
  cause?: unknown;
};

export class AppError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly fields?: FieldErrors;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.code = options.code ?? "UNKNOWN_ERROR";
    this.status = options.status;
    this.fields = options.fields;
  }
}
