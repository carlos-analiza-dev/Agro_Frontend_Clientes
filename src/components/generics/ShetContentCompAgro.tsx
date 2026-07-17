"use client";

import React, { useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { LogOut, Sprout } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  agroRoutes,
  agroEmpleadoRoutes,
} from "@/helpers/data/sidebar/siderbarAgro";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import useGetPermisosAgro from "@/hooks/permisos/useGetPermisosAgro";
import useGetPermisosByRol from "@/hooks/permisos/useGetPermisosByRol";
import { Permiso } from "@/api/permisos/interface/response-permisos.interface";

interface ShetContentCompAgroProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
  isPropietario: boolean;
}

const ShetContentCompAgro = ({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  handleLogout,
  isPropietario,
}: ShetContentCompAgroProps) => {
  const pathname = usePathname();
  const { cliente } = useAuthStore();
  const { empleado } = useAuthEmpleadoStore();

  const rolId = empleado?.role?.id ?? "";

  const { data: permisosAgro, isLoading: isLoadingPermisosAgro } =
    useGetPermisosAgro();

  const { data: permisosEmpleados, isLoading: isLoadingPermisosEmpleados } =
    useGetPermisosByRol(rolId);

  const rutasBase = useMemo(() => {
    if (isPropietario) {
      return agroRoutes;
    } else {
      return agroEmpleadoRoutes;
    }
  }, [isPropietario]);

  const rutasPermitidas = useMemo(() => {
    if (!isPropietario) {
      if (!permisosEmpleados || permisosEmpleados.length === 0) {
        return ["/agro-empleados/agro-servicios"];
      }

      const permisosActivos = permisosEmpleados.filter(
        (permiso: any) => permiso.permiso?.isActive !== false,
      );

      const urls = permisosActivos.map(
        (permiso: any) => permiso.permiso?.url || permiso.url,
      );

      if (!urls.includes("/agro-empleados/agro-servicios")) {
        urls.push("/agro-empleados/agro-servicios");
      }

      return urls;
    }

    if (!permisosAgro || permisosAgro.length === 0) {
      return ["/agro-propietario/agro-servicios"];
    }

    const permisosActivos = permisosAgro.filter((p: Permiso) => p.isActive);
    const urls = permisosActivos.map((p: Permiso) => p.url);

    if (!urls.includes("/agro-propietario/agro-servicios")) {
      urls.push("/agro-propietario/agro-servicios");
    }

    return urls;
  }, [permisosAgro, permisosEmpleados, isPropietario]);

  const rutasVisibles = useMemo(() => {
    return rutasBase.filter((ruta) => rutasPermitidas.includes(ruta.href));
  }, [rutasBase, rutasPermitidas]);

  const isActive = (href: string) => {
    if (
      href === "/agro-propietario/agro-servicios" ||
      href === "/agro-empleados/agro-servicios"
    ) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isLoading = isPropietario
    ? isLoadingPermisosAgro
    : isLoadingPermisosEmpleados;

  const getUserInfo = () => {
    if (isPropietario) {
      return {
        nombre: cliente?.nombre || cliente?.nombre || "Propietario",
        tipo: "Propietario",
      };
    } else {
      return {
        nombre: empleado?.nombre || "Empleado",
        tipo: "Empleado",
        rol: empleado?.role?.name || "Sin rol",
      };
    }
  };

  const userInfo = getUserInfo();

  return (
    <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
      <SheetContent
        side="left"
        className="w-64 p-0 h-screen flex flex-col overflow-hidden"
      >
        <SheetHeader className="border-b border-gray-200 flex-shrink-0">
          <div className="flex h-16 items-center px-6">
            <Sprout className="h-8 w-8 text-green-600" />
            <SheetTitle className="ml-2 text-xl font-bold text-gray-900">
              Agro Servicios
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <p className="text-sm font-medium text-gray-900">
              {userInfo.nombre}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">{userInfo.tipo}</span>
              {!isPropietario && userInfo.rol && (
                <>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-blue-600 font-medium">
                    {userInfo.rol}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <nav className="space-y-1">
                {rutasVisibles.length > 0 ? (
                  rutasVisibles.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`
                          flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors
                          ${
                            active
                              ? "bg-green-50 text-green-700"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }
                        `}
                      >
                        <Icon
                          className={`
                            mr-2 h-4 w-4 flex-shrink-0
                            ${active ? "text-green-600" : "text-gray-400"}
                          `}
                        />
                        {item.name}
                      </Link>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>No tienes permisos para ver rutas</p>
                    <p className="text-xs mt-1">Contacta al administrador</p>
                  </div>
                )}
              </nav>
            )}
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-100">
            <Separator className="my-4" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShetContentCompAgro;
