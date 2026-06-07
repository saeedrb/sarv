export type Permission = string;

export type AuthorizableUser = {
  roles: string[];
  permissions?: string[];
};

export function hasRole(
  user: AuthorizableUser | null | undefined,
  role: string,
) {
  return Boolean(user?.roles.includes(role));
}

export function hasPermission(
  user: AuthorizableUser | null | undefined,
  permission: Permission,
) {
  return Boolean(
    user?.permissions?.includes(permission) ||
      user?.roles.includes("admin") ||
      user?.roles.includes("super-admin"),
  );
}

export function canAny(
  user: AuthorizableUser | null | undefined,
  permissions: Permission[],
) {
  return permissions.some((permission) => hasPermission(user, permission));
}

export function canAll(
  user: AuthorizableUser | null | undefined,
  permissions: Permission[],
) {
  return permissions.every((permission) => hasPermission(user, permission));
}
