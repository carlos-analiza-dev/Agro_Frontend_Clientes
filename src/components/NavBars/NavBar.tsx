"use client";

import React from "react";
import { Button } from "../ui/button";
import {
  Heart,
  LogOut,
  Menu,
  ShoppingCart,
  User,
  Crown,
  Gift,
  History,
  AlertCircle,
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
import { useFavoritos } from "@/hooks/favoritos/useFavoritos";
import { useCartStore } from "@/providers/store/useCartStore";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { TipoCliente } from "@/interfaces/enums/clientes.enums";
import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";
import useGetPermisosByClientePaquete from "@/hooks/permisos/useGetPermisosByClientePaquete";
import useGetPermisosByCliente from "@/hooks/permisos/useGetPermisosByCliente";
import { EcommerceButton } from "../generics/EcommerceButton";

interface Props {
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
}

const NavBar = ({ handleLogout, setMobileSidebarOpen }: Props) => {
  const { cliente } = useAuthStore();
  const { cantidadFavoritos } = useFavoritos();
  const { totalItems } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();

  const firstPath = `/${pathname.split("/")[1] || ""}`;
  const cantidadCarrito = totalItems();

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

  const getPlanInfo = () => {
    if (!esPropietario) {
      return {
        label: "",
        color: "",
        progress: 0,
        daysLeft: 0,
      };
    }

    if (!planActivo) {
      return {
        label: "Sin plan activo",
        color: "bg-red-100 text-red-700",
        progress: 0,
        daysLeft: 0,
      };
    }

    const tipo = planActivo.paquete?.tipo || "FREE";
    const progress =
      planActivo.diasTotales > 0
        ? ((planActivo.diasTotales - planActivo.diasRestantes) /
            planActivo.diasTotales) *
          100
        : 0;

    switch (tipo) {
      case TipoPaquete.FREE:
        return {
          label: "Plan Gratuito",
          color: "bg-gray-100 text-gray-700",
          progress,
          daysLeft: planActivo.diasRestantes,
        };
      case TipoPaquete.BASICO:
        return {
          label: "Plan Básico",
          color: "bg-blue-100 text-blue-700",
          progress,
          daysLeft: planActivo.diasRestantes,
        };
      case TipoPaquete.PREMIUM:
        return {
          label: "Plan Premium",
          color: "bg-yellow-100 text-yellow-700",
          progress,
          daysLeft: planActivo.diasRestantes,
        };
      case TipoPaquete.EMPRESARIAL:
        return {
          label: "Plan Empresarial",
          color: "bg-purple-100 text-purple-700",
          progress,
          daysLeft: planActivo.diasRestantes,
        };
      default:
        return {
          label: tipo,
          color: "bg-gray-100 text-gray-700",
          progress,
          daysLeft: planActivo.diasRestantes,
        };
    }
  };

  const planInfo = getPlanInfo();
  const estaPorVencer = esPropietario
    ? planActivo?.estaPorVencer || false
    : false;
  const estaVencido = esPropietario ? planActivo?.estaVencido || false : false;

  const allowedRoutes = [
    "/panel",
    "/not-found",
    "/unauthorized",
    "/cart",
    "/favoritos",

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

  const tienePermisoFavoritos = permisosVer.includes("/favoritos");
  const tienePermisoCarrito = permisosVer.includes("/cart");

  const handleNavigateToActivePage = () => {
    if (firstPath && firstPath !== "/") {
      router.replace(firstPath);
    }
  };

  const handleNavigateToPlanes = () => {
    router.push("/comprar-plan");
  };

  const handleNavigateToMiPlan = () => {
    router.push("/mi-plan");
  };

  const handleNavigateToHistorial = () => {
    router.push("/historial-paquetes");
  };

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

        {esPropietario && tienePlanActivo && <EcommerceButton />}

        {esPropietario && !tienePlanActivo && (
          <Button
            onClick={handleNavigateToPlanes}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
          >
            <Crown className="mr-2 h-4 w-4" />
            Ver Planes
          </Button>
        )}

        {esPropietario && tienePlanActivo && estaPorVencer && !estaVencido && (
          <Button
            onClick={handleNavigateToPlanes}
            size="sm"
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
          >
            <Gift className="mr-2 h-4 w-4" />
            Renovar Plan
          </Button>
        )}

        {tienePermisoFavoritos && (
          <Button
            onClick={() => router.replace("/favoritos")}
            variant="ghost"
            className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-gray-100"
            title="Favoritos"
          >
            <Heart
              className={`h-4 w-4 sm:h-5 sm:w-5 ${cantidadFavoritos > 0 ? "text-red-500 fill-current" : ""}`}
            />
            {cantidadFavoritos > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {cantidadFavoritos > 9 ? "9+" : cantidadFavoritos}
              </span>
            )}
          </Button>
        )}

        {tienePermisoCarrito && (
          <Button
            onClick={() => router.replace("/cart")}
            variant="ghost"
            className="relative h-8 w-8 rounded-full hover:bg-gray-100"
            title="Carrito"
          >
            {cantidadCarrito > 0 ? (
              <>
                <ShoppingCart className="text-blue-600" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  {cantidadCarrito}
                </span>
              </>
            ) : (
              <ShoppingCart />
            )}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/user.png" alt="Usuario" />
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

            {esPropietario && (
              <>
                <DropdownMenuItem
                  onClick={handleNavigateToMiPlan}
                  className="cursor-pointer"
                >
                  <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                  Mi Plan Actual
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleNavigateToPlanes}
                  className="cursor-pointer"
                >
                  <Gift className="mr-2 h-4 w-4 text-blue-500" />
                  {tienePlanActivo ? "Cambiar / Renovar Plan" : "Comprar Plan"}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleNavigateToHistorial}
                  className="cursor-pointer"
                >
                  <History className="mr-2 h-4 w-4 text-gray-500" />
                  Historial de Compras
                </DropdownMenuItem>

                <DropdownMenuSeparator />
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

export default NavBar;
