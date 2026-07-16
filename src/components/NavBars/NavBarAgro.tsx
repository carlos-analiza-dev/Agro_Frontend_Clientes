"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  LogOut,
  Menu,
  User,
  Crown,
  AlertCircle,
  PanelsTopLeft,
  Copy,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { navItems } from "@/helpers/data/sidebar/sidebarData";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { TipoCliente } from "@/interfaces/enums/clientes.enums";
import useGetPermisosByClientePaquete from "@/hooks/permisos/useGetPermisosByClientePaquete";
import useGetPermisosByCliente from "@/hooks/permisos/useGetPermisosByCliente";
import { FullScreenLoader } from "../generics/FullScreenLoader";
import { getPlanInfo } from "@/helpers/funciones/paquetes/get-infos";
import { toast } from "react-toastify";

interface Props {
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
}

const NavBarAgro = ({ handleLogout, setMobileSidebarOpen }: Props) => {
  const linkLoginEmpleados = `${process.env.NEXT_PUBLIC_APP_URL}/login-empleados`;
  const { cliente } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const firstPath = `/${pathname.split("/")[1] || ""}`;

  const esPropietario = cliente?.rol === TipoCliente.PROPIETARIO;

  const paqueteId = cliente?.paqueteActivo?.paquete?.id ?? "";
  const clienteId = cliente?.id ?? "";

  const { data: permisosPaquete } = useGetPermisosByClientePaquete(paqueteId);
  const { data: permisosCliente } = useGetPermisosByCliente(clienteId);

  const permisos = esPropietario ? permisosPaquete : permisosCliente;

  const planActivo = esPropietario ? cliente?.paqueteActivo : null;
  const tienePlanActivo = esPropietario
    ? cliente?.tienePlanActivo || false
    : false;

  const permisosVer =
    permisos
      ?.filter((permiso) => permiso.ver === true)
      ?.map((permiso) => permiso.permiso.url) || [];

  const planInfo = getPlanInfo(esPropietario, planActivo!);
  const estaPorVencer = esPropietario
    ? planActivo?.estaPorVencer || false
    : false;
  const estaVencido = esPropietario ? planActivo?.estaVencido || false : false;

  const allowedRoutes = [
    "/panel",
    "/not-found",
    "/unauthorized",
    "/agro-servicios",

    ...(esPropietario
      ? ["/mi-plan", "/comprar-plan", "/historial-paquetes"]
      : []),
  ];

  const navItemsConPermisos = navItems.flatMap((section) =>
    section.items.filter((item) => {
      if (allowedRoutes.includes(item.href)) {
        return true;
      }
      return permisosVer.includes(item.href);
    }),
  );

  const activePage =
    navItemsConPermisos.find((item) => item.href === firstPath)?.name || "";

  const handleNavigateToActivePage = () => {
    if (firstPath && firstPath !== "/") {
      router.replace(firstPath);
    }
  };

  const handleNavigateToPanel = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/panel");
      setIsLoading(false);
    }, 1000);
  };

  const handleCopyEmployeeLink = async () => {
    try {
      await navigator.clipboard.writeText(linkLoginEmpleados);
      toast.success("Enlace copiado al portapapeles.");
    } catch {
      toast.error("No se pudo copiar el enlace.");
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        {activePage && (
          <button
            onClick={handleNavigateToActivePage}
            className="ml-4 text-base md:text-lg font-medium text-gray-900 hover:text-green-600 transition-colors cursor-pointer"
          >
            {activePage}
          </button>
        )}
      </div>

      <div className="flex items-center space-x-1 md:space-x-4">
        {esPropietario && tienePlanActivo && planActivo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hidden md:block">
                  <Badge
                    className={`${planInfo.color} cursor-help ${estaPorVencer ? "animate-pulse" : ""}`}
                  >
                    <Crown className="mr-1 h-3 w-3" />
                    {planInfo.label}
                    {estaVencido && <AlertCircle className="ml-1 h-3 w-3" />}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  {estaVencido ? (
                    <p>Plan vencido. Renueva para seguir usando el sistema.</p>
                  ) : estaPorVencer ? (
                    <p>
                      Quedan {planInfo.daysLeft} días para que venza tu plan
                    </p>
                  ) : (
                    <p>Plan activo. Quedan {planInfo.daysLeft} días</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    cliente && cliente?.profileImages.length > 0
                      ? cliente?.profileImages[0].url
                      : "/images/ProfileImage.png"
                  }
                  alt="Usuario"
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  {cliente?.nombre || "Usuario"}
                </p>
                <p className="text-xs leading-none text-gray-500">
                  {cliente?.email}
                </p>

                {esPropietario && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        Plan actual:
                      </span>
                      <Badge className={planInfo.color}>
                        <Crown className="mr-1 h-3 w-3" />
                        {planInfo.label || "Sin plan"}
                      </Badge>
                    </div>

                    {planActivo && (
                      <>
                        {planActivo.fechaFin && (
                          <p className="text-xs text-gray-500 mb-2">
                            Vence:{" "}
                            {planActivo.fechaFinFormateada ||
                              new Date(
                                planActivo.fechaFin,
                              ).toLocaleDateString()}
                          </p>
                        )}

                        {!estaVencido && planActivo.diasTotales > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">
                                Días restantes:
                              </span>
                              <span
                                className={`font-medium ${estaPorVencer ? "text-yellow-600" : "text-green-600"}`}
                              >
                                {planActivo.diasRestantes} /{" "}
                                {planActivo.diasTotales}
                              </span>
                            </div>
                            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  estaPorVencer
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min(planInfo.progress, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {estaVencido && (
                          <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-2">
                            <p className="text-xs text-red-600">
                              Tu plan ha vencido. Renueva para seguir usando el
                              sistema.
                            </p>
                          </div>
                        )}

                        {estaPorVencer && !estaVencido && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mt-2">
                            <p className="text-xs text-yellow-600">
                              ¡Tu plan está por vencer! Renueva pronto para no
                              perder beneficios.
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {!planActivo && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-2">
                        <p className="text-xs text-blue-600">
                          No tienes un plan activo. Adquiere uno para acceder a
                          todos los beneficios.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleNavigateToPanel}
              className="cursor-pointer text-blue-600"
            >
              <PanelsTopLeft className="mr-2 h-4 w-4" />
              Panel
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {esPropietario && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleCopyEmployeeLink}
                  className="cursor-pointer"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar enlace para empleados
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default NavBarAgro;
