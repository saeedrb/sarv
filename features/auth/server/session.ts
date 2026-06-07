import "server-only";

import { cookies, headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { env } from "@/core/config";
import { AppError, normalizeError } from "@/core/errors";
import { createHttpClient } from "@/core/http";
import { hasPermission, type Permission } from "@/core/auth";
import type { AuthSession } from "../types";

async function createServerApi() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const host = headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  const baseUrl = env.NEXT_PUBLIC_API_URL.startsWith("http")
    ? env.NEXT_PUBLIC_API_URL
    : `${protocol}://${host}${env.NEXT_PUBLIC_API_URL}`;

  return createHttpClient({
    baseUrl,
    getHeaders: () => ({
      cookie: cookieStore.toString(),
    }),
  });
}

export async function getServerSession() {
  try {
    const serverApi = await createServerApi();
    return await serverApi.get<AuthSession>("/auth/session", {
      cache: "no-store",
    });
  } catch (error) {
    const appError = normalizeError(error);

    if (appError.status === 401 || appError.status === 403) {
      return null;
    }

    throw error;
  }
}

export async function requireServerSession(loginPath = "/login") {
  const session = await getServerSession();

  if (!session) {
    redirect(loginPath);
  }

  return session;
}

export async function requireServerPermission(
  permission: Permission,
  loginPath = "/login",
) {
  const session = await requireServerSession(loginPath);

  if (!hasPermission(session.user, permission)) {
    forbidden();
  }

  return session;
}

export function unauthorizedError() {
  return new AppError("You must be signed in to continue.", {
    code: "UNAUTHORIZED",
    status: 401,
  });
}
