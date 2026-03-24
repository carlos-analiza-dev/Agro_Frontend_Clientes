import { authCheckStatus, authLogin } from "@/api/cliente/accions/auth-accions";
import { Cliente } from "@/interfaces/auth/cliente";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

interface AuthResponse {
  cliente: Cliente;
  token: string;
}

export interface AuthState {
  status: AuthStatus;
  token?: string;
  cliente?: Cliente;

  login: (email: string, password: string) => Promise<AuthResponse | null>;
  checkStatus: () => Promise<AuthResponse | null>;
  logout: () => Promise<void>;
  changeStatus: (token?: string, cliente?: Cliente) => Promise<boolean>;
  hasHydrated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      status: "checking",
      token: undefined,
      cliente: undefined,
      hasHydrated: false,

      changeStatus: async (token?: string, cliente?: Cliente) => {
        if (!token || !cliente) {
          set({
            status: "unauthenticated",
            token: undefined,
            cliente: undefined,
          });
          return false;
        }
        set({ status: "authenticated", token, cliente });
        return true;
      },

      login: async (email: string, password: string) => {
        try {
          const resp = await authLogin(email, password);
          if (!resp?.token || !resp.cliente) return null;
          const success = await get().changeStatus(resp.token, resp.cliente);
          return success ? resp : null;
        } catch {
          return null;
        }
      },

      checkStatus: async () => {
        try {
          const resp = await authCheckStatus();
          if (!resp) {
            await get().changeStatus();
            return null;
          }
          await get().changeStatus(resp.token, resp.cliente);
          return resp;
        } catch {
          return null;
        }
      },

      logout: async () => {
        set({
          status: "checking",
          token: undefined,
          cliente: undefined,
        });

        localStorage.removeItem("auth-storage");

        await new Promise((resolve) => setTimeout(resolve, 100));

        set({
          status: "unauthenticated",
          token: undefined,
          cliente: undefined,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        cliente: state.cliente,
        status: state.status,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);
