import type { UserRole } from "@/types";

// ============================================================
// Role Guard — Shared utility for per-role route layouts.
// Each role layout calls checkAccess() and redirects if denied.
// ============================================================

// URL paths match the (dashboard) route group structure in the main repo.
// subadmin maps to /sub-admin (hyphenated) per the main branch convention.
export const ROLE_ROUTES: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  subadmin: "/dashboard/sub-admin",
  principal: "/dashboard/principal",
  teacher: "/dashboard/teacher",
  student: "/dashboard/student",
};

export function getDefaultRouteForRole(role: UserRole): string {
  return ROLE_ROUTES[role] ?? "/";
}

export function isRoleAllowed(userRole: UserRole | undefined, allowedRole: UserRole): boolean {
  return userRole === allowedRole;
}
