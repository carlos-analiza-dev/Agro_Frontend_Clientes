"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ArrowLeft,
  Crown,
  Sparkles,
  Home,
  Lock,
} from "lucide-react";

const UnauthorizedPage = () => {
  const { cliente, token: clienteToken } = useAuthStore();
  const { empleado, token: empleadoToken } = useAuthEmpleadoStore();

  const router = useRouter();

  const isAuthenticated =
    (!!cliente && !!clienteToken) || (!!empleado && !!empleadoToken);

  const handleGoBack = () => {
    if (isAuthenticated) {
      router.replace("/panel");
    } else {
      router.replace("/");
    }
  };

  const handleGoToPlans = () => {
    router.push("/comprar-plan");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-green-50/30 p-4">
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-red-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl" />
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-50 border border-red-200/50 mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-gray-200/50 mb-4">
            <Lock className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs font-medium text-gray-500">
              Acceso restringido
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
            No autorizado
          </h1>

          <p className="text-sm md:text-base text-gray-500 mt-3 leading-relaxed">
            No tienes los permisos necesarios para acceder a esta página.
            {isAuthenticated
              ? " Si crees que es un error, contacta con el administrador o verifica tu plan actual."
              : " Inicia sesión o regístrate para continuar."}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button
              onClick={handleGoBack}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-[0_4px_16px_rgba(34,197,94,0.3)] transition-all duration-300"
            >
              {isAuthenticated ? (
                <>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Ir al panel
                </>
              ) : (
                <>
                  <Home className="w-4 h-4 mr-2" />
                  Volver al inicio
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
