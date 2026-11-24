"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { empleado, token } = useAuthEmpleadoStore();

  useEffect(() => {
    if (empleado || token) {
      router.replace("/panel");
    }
  }, [empleado, token, router]);

  if (empleado || token) {
    return null;
  }

  return <>{children}</>;
}
