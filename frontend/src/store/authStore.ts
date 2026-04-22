import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";

// ============================================================
// Auth Store — Zustand with safe token handling.
// Access token: memory only (never persisted — XSS safe)
// Refresh token: HttpOnly cookie (managed by Django, JS never touches it)
// Only user + isAuthenticated are persisted to survive page reload.
// ============================================================

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  refreshAuth: () => Promise<boolean>;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      setAccessToken: (accessToken) => set({ accessToken }),

      login: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true, isLoading: false }),

      logout: () => set({ ...initialState }),

      clearAuth: () => set({ ...initialState }),

      setLoading: (isLoading) => set({ isLoading }),

      refreshAuth: async () => {
        try {
          const res = await fetch("/api/auth/refresh", { method: "POST" });
          if (!res.ok) {
            get().clearAuth();
            return false;
          }
          const data = await res.json();
          set({ accessToken: data.access });
          return true;
        } catch {
          get().clearAuth();
          return false;
        }
      },
    }),
    {
      name: "skillship-auth",
      storage: createJSONStorage(() => localStorage),
      // SECURITY: Only persist user profile + auth flag.
      // Access token stays in memory only — lost on refresh, re-obtained via cookie refresh.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
