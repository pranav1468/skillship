import { useAuthStore } from "@/store/authStore";
import type { User, LoginPayload, AuthResponse } from "@/types";

// ============================================================
// useAuth — Components use this hook, never authStore directly.
// Login goes through /api/auth/login (Next.js route handler)
// which proxies Django and sets httpOnly refresh cookie.
// ============================================================

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const login = async (payload: LoginPayload) => {
    useAuthStore.getState().setLoading(true);
    try {
      // Next.js API route: sets httpOnly refresh cookie, returns { user, accessToken }
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail ?? "Login failed");
      }

      const data: AuthResponse = await res.json();
      useAuthStore.getState().login(data.user, data.accessToken);
      return data.user;
    } catch (error) {
      useAuthStore.getState().setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    // Blacklist refresh token via Next.js route, then clear client state
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    useAuthStore.getState().clearAuth();
    if (typeof window !== "undefined") window.location.href = "/login";
  };

  const hasRole = (role: User["role"]) => user?.role === role;

  const hasAnyRole = (...roles: User["role"][]) =>
    user ? roles.includes(user.role) : false;

  return {
    user,
    isAuthenticated,
    isLoading,
    role: user?.role ?? null,
    schoolId: user?.schoolId ?? null,   // T-033: explicit schoolId for academic screens
    login,
    logout,
    hasRole,
    hasAnyRole,
  };
}
