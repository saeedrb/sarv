import { api } from "@/core/http";
import type { LoginInput } from "../schemas";
import type { AuthSession } from "../types";

export const authApi = {
  getSession: (signal?: AbortSignal) =>
    api.get<AuthSession>("/auth/session", { signal }),

  login: (input: LoginInput) =>
    api.post<AuthSession>("/auth/login", input),

  logout: () => api.post<void>("/auth/logout"),
};
