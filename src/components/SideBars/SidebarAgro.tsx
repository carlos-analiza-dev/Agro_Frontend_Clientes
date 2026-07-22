"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sprout } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  agroNavItems,
  agroEmpleadoNavItems,
} from "@/helpers/data/sidebar/siderbarAgro";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";
import useGetPermisosAgro from "@/hooks/permisos/useGetPermisosAgro";
import { useMemo } from "react";
import { Permiso } from "@/api/permisos/interface/response-permisos.interface";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import useGetPermisosByRol from "@/hooks/permisos/useGetPermisosByRol";
import { FullScreenLoader } from "../generics/FullScreenLoader";
import useGetLogoAgro from "@/hooks/agroservicios/logo/useGetLogoAgro";

interface SidebarAgroProps {
  handleLogout: () => Promise<void>;
  isPropietario: boolean;
}

const SidebarAgro = ({ handleLogout, isPropietario }: SidebarAgroProps) => {
  const pathname = usePathname();
  const { cliente } = useAuthStore();
  const { empleado } = useAuthEmpleadoStore();

  const rolId = empleado?.role?.id ?? "";

  const propietarioId =
    cliente?.paqueteActivo?.paquete.tipo === TipoPaquete.AGRO_GESTION
      ? cliente.id
      : (empleado?.agroservicio?.propietario?.id ??
        empleado?.agroservicio?.propietario.id ??
        null);

  const { data: logo, isLoading: cargando_logo } = useGetLogoAgro(
    propietarioId ?? "",
  );

  const { data: permisosAgro, isLoading: isLoadingPermisosAgro } =
    useGetPermisosAgro();

  const { data: permisosEmpleados, isLoading: isLoadingPermisosEmpleados } =
    useGetPermisosByRol(rolId);

  const rutasBase = useMemo(() => {
    return isPropietario ? agroNavItems : agroEmpleadoNavItems;
  }, [isPropietario]);

  const rutasPermitidas = useMemo(() => {
    if (!isPropietario) {
      if (!permisosEmpleados || permisosEmpleados.length === 0) {
        return [];
      }

      const permisosActivos = permisosEmpleados.filter(
        (permiso: any) => permiso.permiso?.isActive !== false,
      );

      return permisosActivos.map(
        (permiso: any) => permiso.permiso?.url || permiso.url,
      );
    }

    if (!permisosAgro || permisosAgro.length === 0) {
      return [];
    }

    const permisosActivos = permisosAgro.filter((p: Permiso) => p.isActive);
    return permisosActivos.map((p: Permiso) => p.url);
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

  if (isLoading || cargando_logo) {
    return (
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-full">
          <FullScreenLoader />
        </div>
      </aside>
    );
  }

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

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          {userInfo.tieneLogo ? (
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                <img
                  src={userInfo.imagen!}
                  alt="Logo agroservicio"
                  className="h-full w-full object-cover"
                />
              </div>

              <span
                className="max-w-[180px] truncate font-semibold text-gray-900"
                title={userInfo.agroservicio}
              >
                {userInfo.agroservicio}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8 text-green-600 flex-shrink-0" />

              <span
                className="max-w-[180px] truncate font-semibold text-gray-900"
                title={userInfo.agroservicio}
              >
                {userInfo.agroservicio}
              </span>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
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

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-6">
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
                          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            active
                              ? "bg-green-50 text-green-700"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <Icon
                            className={`mr-3 h-5 w-5 flex-shrink-0 ${
                              active
                                ? "text-green-600"
                                : "text-gray-400 group-hover:text-gray-500"
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
              <div className="text-center text-gray-500 py-4">
                No tienes permisos para ver ninguna ruta
              </div>
            )}
          </nav>
        </div>

        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Cerrar sesión</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
};

export default SidebarAgro;
