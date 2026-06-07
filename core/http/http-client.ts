import { env } from "@/core/config";
import {
  AppError,
  errorFromResponse,
  normalizeError,
} from "@/core/errors";

type SearchValue = string | number | boolean | null | undefined;

export type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Record<string, SearchValue>;
  timeout?: number;
};

type HttpClientOptions = {
  baseUrl: string;
  defaultTimeout?: number;
  getHeaders?: () => HeadersInit | Promise<HeadersInit>;
};

function createUrl(
  baseUrl: string,
  path: string,
  query?: RequestOptions["query"],
) {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${normalizedBase}${normalizedPath}`;

  if (!query) {
    return url;
  }

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined) {
      search.set(key, String(value));
    }
  }

  const queryString = search.toString();
  return queryString ? `${url}?${queryString}` : url;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || undefined;
}

export function createHttpClient({
  baseUrl,
  defaultTimeout = 15_000,
  getHeaders,
}: HttpClientOptions) {
  async function request<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const {
      body,
      query,
      timeout = defaultTimeout,
      headers: requestHeaders,
      signal,
      ...init
    } = options;
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), timeout);
    const headers = new Headers(await getHeaders?.());

    new Headers(requestHeaders).forEach((value, key) => {
      headers.set(key, value);
    });

    const isFormData = body instanceof FormData;

    if (body !== undefined && !isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const combinedSignal = signal
      ? AbortSignal.any([signal, timeoutController.signal])
      : timeoutController.signal;

    try {
      const response = await fetch(createUrl(baseUrl, path, query), {
        ...init,
        body:
          body === undefined
            ? undefined
            : isFormData
              ? body
              : JSON.stringify(body),
        credentials: init.credentials ?? "include",
        headers,
        signal: combinedSignal,
      });
      const payload = await parseResponse(response);

      if (!response.ok) {
        throw errorFromResponse(
          payload,
          response.status,
          response.statusText || "The request failed.",
        );
      }

      return payload as T;
    } catch (error) {
      if (
        timeoutController.signal.aborted &&
        !(signal && signal.aborted)
      ) {
        throw new AppError("The request timed out.", {
          code: "REQUEST_TIMEOUT",
          cause: error,
        });
      }

      throw normalizeError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    request,
    get: <T>(path: string, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "GET" }),
    post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "POST", body }),
    put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "PUT", body }),
    patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "PATCH", body }),
    delete: <T>(path: string, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "DELETE" }),
  };
}

export const api = createHttpClient({
  baseUrl: env.NEXT_PUBLIC_API_URL,
});

export type HttpClient = ReturnType<typeof createHttpClient>;
