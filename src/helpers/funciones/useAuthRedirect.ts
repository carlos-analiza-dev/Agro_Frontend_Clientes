"use client";

import { useAuthStore } from "@/providers/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuthRedirect() {
  const router = useRouter();
  const { cliente, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (token && cliente) {
      router.push("/panel");
    } else {
      setIsChecking(false);
    }
  }, [cliente, token, router]);

  return { isChecking };
}
