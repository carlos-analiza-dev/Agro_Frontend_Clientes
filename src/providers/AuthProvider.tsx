"use client";
import { useEffect } from "react";

import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import { useAuthStore } from "./store/useAuthStore";
import PublicNavBar from "@/components/generics/PublicNavBar";
import Footer from "@/components/generics/Footer";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { status, checkStatus, token, cliente, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (token && cliente) return;

    checkStatus();
  }, [checkStatus, token, cliente, hasHydrated]);

  if (!hasHydrated || status === "checking") {
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
