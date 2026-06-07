import { describe, expect, it } from "vitest";
import { canAll, canAny, hasPermission, hasRole } from "./authorization";
import type { AuthUser } from "@/features/auth";

const user: AuthUser = {
  id: "1",
  email: "ada@example.com",
  name: "Ada",
  roles: ["editor"],
  permissions: ["posts.create", "posts.update"],
};

describe("authorization", () => {
  it("checks roles", () => {
    expect(hasRole(user, "editor")).toBe(true);
    expect(hasRole(user, "admin")).toBe(false);
  });

  it("checks permissions", () => {
    expect(hasPermission(user, "posts.create")).toBe(true);
    expect(hasPermission(user, "users.delete")).toBe(false);
  });

  it("allows admin roles to pass permission checks", () => {
    expect(hasPermission({ ...user, roles: ["admin"] }, "users.delete")).toBe(
      true,
    );
  });

  it("checks any and all permission groups", () => {
    expect(canAny(user, ["users.delete", "posts.update"])).toBe(true);
    expect(canAll(user, ["posts.create", "posts.update"])).toBe(true);
    expect(canAll(user, ["posts.create", "users.delete"])).toBe(false);
  });
});
