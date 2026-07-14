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
import { agroRoutes } from "@/helpers/data/sidebar/siderbarAgro";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";
import useGetPermisosAgro from "@/hooks/permisos/useGetPermisosAgro";
import useGetPermisosByCliente from "@/hooks/permisos/useGetPermisosByCliente";
import { useMemo } from "react";
import {
  Permiso,
  ResponsePermisosInterface,
} from "@/api/permisos/interface/response-permisos.interface";

interface SidebarAgroProps {
  handleLogout: () => Promise<void>;
}

const SidebarAgro = ({ handleLogout }: SidebarAgroProps) => {
  const pathname = usePathname();
  const { cliente } = useAuthStore();
  const tieneAgroGestion =
    cliente?.paqueteActivo?.paquete?.tipo === TipoPaquete.AGRO_GESTION;
  const clienteId = cliente?.id ?? "";

  const { data: permisosAgro, isLoading: isLoadingAgros } =
    useGetPermisosAgro();
  const { data: permisosCliente, isLoading: isLoadingCliente } =
    useGetPermisosByCliente(clienteId);
  const permisos = tieneAgroGestion ? permisosAgro : permisosCliente;
  const isLoadingPermisos = tieneAgroGestion
    ? isLoadingAgros
    : isLoadingCliente;

  const rutasPermitidas = useMemo(() => {
    if (!permisos) return [];

    if (tieneAgroGestion) {
      const permisosAgroArray = permisos as Permiso[];
      return permisosAgroArray.filter((p) => p.isActive).map((p) => p.url);
    } else {
      const permisosClienteArray = permisos as ResponsePermisosInterface[];
      return permisosClienteArray
        .filter((p) => p.ver && p.permiso.isActive)
        .map((p) => p.permiso.url);
    }
  }, [permisos, tieneAgroGestion]);

  const rutasVisibles = useMemo(
    () => agroRoutes.filter((ruta) => rutasPermitidas.includes(ruta.href)),
    [rutasPermitidas],
  );

  const isActive = (href: string) => {
    if (href === "/agro-servicios") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  if (isLoadingPermisos) {
    return (
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <Sprout className="h-8 w-8 text-green-600" />
          <span className="ml-2 text-lg font-semibold text-gray-900">
            Agro Servicios
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {rutasVisibles.length > 0 ? (
              rutasVisibles.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
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
              })
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
