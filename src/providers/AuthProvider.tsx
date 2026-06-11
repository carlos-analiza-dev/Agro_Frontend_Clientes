"use client";
import { useEffect, useRef } from "react";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import { useAuthStore } from "./store/useAuthStore";
import PublicNavBar from "@/components/NavBars/PublicNavBar";
import Footer from "@/components/generics/Footer";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { status, checkStatus, token, cliente, hasHydrated } = useAuthStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!hasChecked.current && !token && !cliente) {
      hasChecked.current = true;
      checkStatus();
    }
  }, [hasHydrated, checkStatus, token, cliente]);

  useEffect(() => {
    if (status === "checking") {
      const timeout = setTimeout(() => {
        useAuthStore.setState({ status: "unauthenticated" });
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [status]);

  if (!hasHydrated) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!cliente && <PublicNavBar />}
      <main className="flex-1 flex justify-center">
        <div className="w-full">{children}</div>
      </main>
      {!cliente && <Footer />}
    </div>
  );
}
