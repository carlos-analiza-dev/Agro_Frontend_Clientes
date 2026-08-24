"use client";

import React, { useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { LogOut, Sprout } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  agroNavItems,
  agroEmpleadoNavItems,
} from "@/helpers/data/sidebar/siderbarAgro";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import useGetPermisosAgro from "@/hooks/permisos/useGetPermisosAgro";
import useGetPermisosByRol from "@/hooks/permisos/useGetPermisosByRol";
import { Permiso } from "@/api/permisos/interface/response-permisos.interface";
import {
  TipoAgroservicio,
  TipoPaquete,
} from "@/interfaces/enums/paquetes/paquetes.enum";
import useGetLogoAgro from "@/hooks/agroservicios/logo/useGetLogoAgro";
import { FullScreenLoader } from "../generics/FullScreenLoader";

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

  const tipoPaquete =
    cliente?.paqueteActivo?.paquete.tipo ?? TipoAgroservicio.AGRO_GESTION;
  const rolId = empleado?.role?.id ?? "";

  const esAgro =
    cliente?.paqueteActivo?.paquete?.tipo === TipoPaquete.AGRO_GESTION ||
    cliente?.paqueteActivo?.paquete?.tipo === TipoPaquete.AGRO_LIGHT;

  const propietarioId = esAgro
    ? cliente?.id
    : (empleado?.agroservicio?.propietario?.id ??
      empleado?.agroservicio?.propietario.id ??
      null);

  const { data: logo, isLoading: cargando_logo } = useGetLogoAgro(
    propietarioId ?? "",
  );

  const { data: permisosAgro, isLoading: isLoadingPermisosAgro } =
    useGetPermisosAgro({ tipo_agro: tipoPaquete as TipoAgroservicio });

  const { data: permisosEmpleados, isLoading: isLoadingPermisosEmpleados } =
    useGetPermisosByRol(rolId);

  const rutasBase = useMemo(() => {
    return isPropietario ? agroNavItems : agroEmpleadoNavItems;
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
    return rutasBase
      .map((categoria) => ({
        ...categoria,
        items: categoria.items.filter((ruta) => {
          if (!isPropietario) {
            return (
              rutasPermitidas.includes(ruta.href) ||
              ruta.href === "/agro-empleados/agro-servicios"
            );
          }
          return rutasPermitidas.includes(ruta.href);
        }),
      }))
      .filter((categoria) => categoria.items.length > 0);
  }, [rutasBase, rutasPermitidas, isPropietario]);

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

  const userInfo = isPropietario
    ? {
        nombre: cliente?.nombre || cliente?.nombre || "Propietario",
        tipo: "Propietario",
        rol: "Administrador",
        email: cliente?.email || "",
        imagen:
          logo?.url ||
          (cliente?.profileImages && cliente?.profileImages?.length > 0
            ? cliente.profileImages[0].url
            : null),
        tieneLogo: !!logo?.url,
        agroservicio: logo?.agroservicio || "Agro Servicios",
      }
    : {
        nombre: empleado?.nombre || "Empleado",
        tipo: "Empleado",
        rol: empleado?.role?.name || "Sin rol",
        email: empleado?.email || "",
        imagen: logo?.url || null,
        tieneLogo: !!logo?.url,
        agroservicio: logo?.agroservicio || "Agro Servicios",
      };

  if (isLoading || cargando_logo) {
    return (
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 h-screen flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-center h-full">
            <FullScreenLoader />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
      <SheetContent
        side="left"
        className="w-64 p-0 h-screen flex flex-col overflow-hidden"
      >
        <SheetHeader className="border-b border-gray-200 flex-shrink-0">
          <div className="flex h-16 items-center px-6">
            {userInfo.tieneLogo ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-8 w-8 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                  <img
                    src={userInfo.imagen!}
                    alt="Logo agroservicio"
                    className="h-full w-full object-cover"
                  />
                </div>
                <SheetTitle
                  className="text-xl font-bold text-gray-900 truncate"
                  title={userInfo.agroservicio}
                >
                  {userInfo.agroservicio}
                </SheetTitle>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <Sprout className="h-8 w-8 text-green-600 flex-shrink-0" />
                <SheetTitle
                  className="text-xl font-bold text-gray-900 truncate"
                  title={userInfo.agroservicio}
                >
                  {userInfo.agroservicio}
                </SheetTitle>
              </div>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userInfo.nombre}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">{userInfo.tipo}</span>
                  {!isPropietario && (
                    <>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-blue-600 font-medium truncate">
                        {userInfo.rol}
                      </span>
                    </>
                  )}
                </div>
                {userInfo.email && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {userInfo.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-4">
            <nav className="space-y-5">
              {rutasVisibles.length > 0 ? (
                rutasVisibles.map((categoria) => (
                  <div key={categoria.category}>
                    <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {categoria.category}
                    </h3>

                    <div className="space-y-1">
                      {categoria.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileSidebarOpen(false)}
                            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                              active
                                ? "bg-green-50 text-green-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <Icon
                              className={`mr-2 h-4 w-4 flex-shrink-0 ${
                                active ? "text-green-600" : "text-gray-400"
                              }`}
                            />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No tienes permisos para ver rutas</p>
                  <p className="text-xs mt-1">Contacta al administrador</p>
                </div>
              )}
            </nav>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-200">
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
