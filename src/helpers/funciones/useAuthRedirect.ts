"use client";

import { useAuthStore } from "@/providers/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { cliente, token, hasHydrated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;

    if (token && cliente) {
      const publicPaths = ["/", "/login", "/register", "/reset-password"];
      const isPublicPath = publicPaths.includes(pathname);

      if (isPublicPath) {
        router.push("/select-destination");
        setIsChecking(false);
        return;
      }

      if (pathname === "/select-destination") {
        setIsChecking(false);
        return;
      }
    }

    if (!token && !cliente) {
      const protectedPaths = ["/panel", "/agro-servicios"];
      const isProtectedPath = protectedPaths.some((path) =>
        pathname.startsWith(path),
      );

      if (isProtectedPath) {
        router.push("/");
        setIsChecking(false);
        return;
      }
    }

    setIsChecking(false);
  }, [cliente, token, router, pathname, hasHydrated]);

  return { isChecking };
}
