import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Empleado } from "@/interfaces/auth/empleado";
import {
  authCheckStatusEmpleado,
  authLoginEmpleado,
} from "@/api/agroservicio/empleados/accions/auth-empleados";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

interface AuthResponseEmpleado {
  empleado: Empleado;
  token: string;
}

export interface AuthEmpleadoState {
  status: AuthStatus;
  token?: string;
  empleado?: Empleado;

  login: (
    email: string,
    password: string,
  ) => Promise<AuthResponseEmpleado | null>;
  checkStatus: () => Promise<AuthResponseEmpleado | null>;
  logout: () => Promise<void>;
  changeStatus: (token?: string, empleado?: Empleado) => Promise<boolean>;
  hasHydrated: boolean;
}

export const useAuthEmpleadoStore = create<AuthEmpleadoState>()(
  persist(
    (set, get) => ({
      status: "checking",
      token: undefined,
      empleado: undefined,
      hasHydrated: false,

      changeStatus: async (token?: string, empleado?: Empleado) => {
        if (!token || !empleado) {
          set({
            status: "unauthenticated",
            token: undefined,
            empleado: undefined,
          });
          return false;
        }
        set({ status: "authenticated", token, empleado });
        return true;
      },

      login: async (email: string, password: string) => {
        try {
          const resp = await authLoginEmpleado(email, password);
          if (!resp?.token || !resp.empleado) return null;
          const success = await get().changeStatus(resp.token, resp.empleado);
          return success ? resp : null;
        } catch {
          return null;
        }
      },

      checkStatus: async () => {
        try {
          const resp = await authCheckStatusEmpleado();
          if (!resp) {
            await get().changeStatus();
            return null;
          }
          await get().changeStatus(resp.token, resp.empleado);
          return resp;
        } catch {
          return null;
        }
      },

      logout: async () => {
        set({
          status: "checking",
          token: undefined,
          empleado: undefined,
        });

        localStorage.removeItem("auth-empleado-storage");

        await new Promise((resolve) => setTimeout(resolve, 100));

        set({
          status: "unauthenticated",
          token: undefined,
          empleado: undefined,
        });
      },
    }),
    {
      name: "auth-empleado-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        empleado: state.empleado,
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
