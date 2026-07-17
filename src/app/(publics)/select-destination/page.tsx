"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Building2, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";

const SelectDestinationPage = () => {
  const router = useRouter();
  const { cliente, token, hasHydrated } = useAuthStore();

  const tieneAgroElite =
    cliente?.paqueteActivo?.paquete?.tipo === TipoPaquete.AGRO_GESTION;

  useEffect(() => {
    if (hasHydrated && (!token || !cliente)) {
      router.push("/");
      return;
    }

    if (hasHydrated && token && cliente && !tieneAgroElite) {
      router.push("/panel");
      return;
    }
  }, [token, cliente, hasHydrated, router, tieneAgroElite]);

  if (!hasHydrated || !token || !cliente) {
    return <FullScreenLoader />;
  }

  if (!tieneAgroElite) {
    return <FullScreenLoader />;
  }

  const handleSelect = (destination: "agro" | "panel") => {
    if (destination === "agro") {
      router.push("/agro-propietario/agro-servicios");
    } else {
      router.push("/panel");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Bienvenido, {cliente.nombre || "Usuario"}
          </CardTitle>
          <CardDescription>¿A qué sistema deseas acceder?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleSelect("agro")}
            className="w-full h-20 flex items-center gap-4 text-left"
            variant="outline"
          >
            <Building2 size={32} className="text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-base">Agro Servicios</div>
              <div className="text-sm text-gray-500">
                Sistema de servicios agrícolas
              </div>
            </div>
          </Button>

          <Button
            onClick={() => handleSelect("panel")}
            className="w-full h-20 flex items-center gap-4 text-left"
            variant="outline"
          >
            <LayoutDashboard
              size={32}
              className="text-blue-600 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-semibold text-base">Panel Principal</div>
              <div className="text-sm text-gray-500">
                Panel de administración
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectDestinationPage;
