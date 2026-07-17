"use client";

import { useEffect, useRef } from "react";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import { useAuthStore } from "./store/useAuthStore";
import { useAuthEmpleadoStore } from "./store/useAuthEmpleados";
import PublicNavBar from "@/components/NavBars/PublicNavBar";
import Footer from "@/components/generics/Footer";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    status: clienteStatus,
    checkStatus: checkClienteStatus,
    token: clienteToken,
    cliente,
    hasHydrated: clienteHydrated,
  } = useAuthStore();

  const {
    status: empleadoStatus,
    checkStatus: checkEmpleadoStatus,
    token: empleadoToken,
    empleado,
    hasHydrated: empleadoHydrated,
  } = useAuthEmpleadoStore();

  const hasChecked = useRef(false);

  const hasHydrated = clienteHydrated && empleadoHydrated;
  const isAuthenticated = !!cliente || !!empleado;

  useEffect(() => {
    if (!hasHydrated) return;

    if (
      !hasChecked.current &&
      !clienteToken &&
      !empleadoToken &&
      !cliente &&
      !empleado
    ) {
      hasChecked.current = true;

      checkClienteStatus();
      checkEmpleadoStatus();
    }
  }, [
    hasHydrated,
    checkClienteStatus,
    checkEmpleadoStatus,
    clienteToken,
    empleadoToken,
    cliente,
    empleado,
  ]);

  useEffect(() => {
    if (clienteStatus === "checking") {
      const timeout = setTimeout(() => {
        useAuthStore.setState({ status: "unauthenticated" });
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [clienteStatus]);

  useEffect(() => {
    if (empleadoStatus === "checking") {
      const timeout = setTimeout(() => {
        useAuthEmpleadoStore.setState({
          status: "unauthenticated",
        });
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [empleadoStatus]);

  if (!hasHydrated) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthenticated && <PublicNavBar />}

      <main className="flex-1 flex justify-center">
        <div className="w-full">{children}</div>
      </main>

      {!isAuthenticated && <Footer />}
    </div>
  );
}
