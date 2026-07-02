"use client";

import React, { useState } from "react";
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
  Sprout,
  Sparkles,
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
import { FullScreenLoader } from "../generics/FullScreenLoader";
import { getPlanInfo } from "@/helpers/funciones/paquetes/get-infos";
import { cn } from "@/lib/utils";

interface Props {
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
}

const PlanBadge = ({
  label,
  color,
  estaPorVencer,
  estaVencido,
}: {
  label: string;
  color: string;
  estaPorVencer: boolean;
  estaVencido: boolean;
}) => (
  <Badge
    className={cn(
      "backdrop-blur-sm border transition-all duration-200",
      color,
      estaPorVencer &&
        !estaVencido &&
        "border-yellow-300/50 shadow-[0_0_20px_rgba(234,179,8,0.15)]",
    )}
  >
    <Crown className="mr-1 h-3 w-3" />
    {label}
    {estaVencido && <AlertCircle className="ml-1 h-3 w-3" />}
  </Badge>
);

const ActionButton = ({
  icon: Icon,
  count,
  onClick,
  title,
  color = "text-gray-400",
  activeColor = "text-green-500",
}: {
  icon: React.ElementType;
  count?: number;
  onClick: () => void;
  title: string;
  color?: string;
  activeColor?: string;
}) => (
  <Button
    onClick={onClick}
    variant="ghost"
    className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-green-50/80 transition-all duration-200"
    title={title}
  >
    <Icon
      className={cn(
        "h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200",
        count && count > 0 ? activeColor : color,
      )}
    />
    {count && count > 0 && (
      <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-[10px] text-white font-bold shadow-[0_2px_8px_rgba(34,197,94,0.3)] border border-white/20">
        {count > 9 ? "9+" : count}
      </span>
    )}
  </Button>
);

const PlanButton = ({
  onClick,
  children,
  variant = "default",
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "outline" | "warning";
}) => {
  const variants = {
    default:
      "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-[0_4px_16px_rgba(34,197,94,0.25)]",
    outline:
      "bg-white/80 hover:bg-green-50/80 border border-gray-200/50 hover:border-green-200/50 text-gray-600 hover:text-green-600",
    warning:
      "bg-white/80 hover:bg-yellow-50/80 border border-yellow-200/50 text-yellow-600 hover:text-yellow-700",
  };

  return (
    <Button
      onClick={onClick}
      size="sm"
      className={cn(
        "rounded-full px-4 py-1.5 h-auto text-xs sm:text-sm font-medium transition-all duration-200",
        variants[variant],
      )}
    >
      {children}
    </Button>
  );
};

const DropdownItem = ({
  onClick,
  icon: Icon,
  children,
  color = "text-gray-700",
}: {
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
  color?: string;
}) => (
  <DropdownMenuItem
    onClick={onClick}
    className={cn(
      "cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
      "hover:bg-green-50/80",
      color,
    )}
  >
    <Icon className="mr-2.5 h-4 w-4" />
    {children}
  </DropdownMenuItem>
);

const NavBar = ({ handleLogout, setMobileSidebarOpen }: Props) => {
  const { cliente } = useAuthStore();
  const { cantidadFavoritos } = useFavoritos();
  const { totalItems } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const firstPath = `/${pathname.split("/")[1] || ""}`;
  const cantidadCarrito = totalItems();

  const esPropietario = cliente?.rol === TipoCliente.PROPIETARIO;

  const paqueteId = cliente?.paqueteActivo?.paquete?.id ?? "";
  const clienteId = cliente?.id ?? "";

  const tieneAgroGestion =
    cliente?.paqueteActivo?.paquete?.tipo === TipoPaquete.AGRO_GESTION;

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
    "/cart",
    "/favoritos",
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

  const handleNavigateToAgroServicios = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/agro-servicios");
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <header className="flex h-16 items-center justify-between bg-white/80 backdrop-blur-xl border-b border-gray-100/50 px-4 sm:px-6 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-full hover:bg-green-50/80 transition-all duration-200"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>

        {activePage && (
          <button
            onClick={handleNavigateToActivePage}
            className="ml-3 text-base md:text-lg font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent hover:from-green-800 hover:to-green-700 transition-all duration-200 cursor-pointer"
          >
            {activePage}
          </button>
        )}
      </div>

      <div className="flex items-center space-x-1 md:space-x-3">
        {esPropietario && tienePlanActivo && planActivo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hidden md:block">
                  <PlanBadge
                    label={planInfo.label}
                    color={planInfo.color}
                    estaPorVencer={estaPorVencer}
                    estaVencido={estaVencido}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white/95 backdrop-blur-sm border border-white/40 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                <div className="text-xs p-1">
                  {estaVencido ? (
                    <p className="text-red-600">
                      Plan vencido. Renueva para seguir usando el sistema.
                    </p>
                  ) : estaPorVencer ? (
                    <p className="text-yellow-600">
                      Quedan {planInfo.daysLeft} días para que venza tu plan
                    </p>
                  ) : (
                    <p className="text-green-600">
                      Plan activo. Quedan {planInfo.daysLeft} días
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {esPropietario && tienePlanActivo && <EcommerceButton />}

        {esPropietario && !tienePlanActivo && (
          <PlanButton onClick={handleNavigateToPlanes} variant="default">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Ver Planes
          </PlanButton>
        )}

        {esPropietario && tienePlanActivo && estaPorVencer && !estaVencido && (
          <PlanButton onClick={handleNavigateToPlanes} variant="warning">
            <Gift className="mr-1.5 h-3.5 w-3.5" />
            Renovar Plan
          </PlanButton>
        )}

        {tienePermisoFavoritos && (
          <ActionButton
            icon={Heart}
            count={cantidadFavoritos}
            onClick={() => router.replace("/favoritos")}
            title="Favoritos"
            color="text-gray-300"
            activeColor="text-red-500"
          />
        )}

        {tienePermisoCarrito && (
          <ActionButton
            icon={ShoppingCart}
            count={cantidadCarrito}
            onClick={() => router.replace("/cart")}
            title="Carrito"
            color="text-gray-300"
            activeColor="text-green-600"
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-green-50/80 transition-all duration-200 border-2 border-transparent hover:border-green-200/50"
            >
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <AvatarImage
                  src={
                    cliente && cliente?.profileImages.length > 0
                      ? cliente?.profileImages[0].url
                      : "/images/ProfileImage.png"
                  }
                  alt="Usuario"
                />
                <AvatarFallback className="bg-green-50/80 text-green-600">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-80 bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-2"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-semibold text-gray-900">
                  {cliente?.nombre || "Usuario"}
                </p>
                <p className="text-xs text-gray-400">{cliente?.email}</p>

                {esPropietario && (
                  <div className="mt-3 pt-3 border-t border-gray-100/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-medium">
                        Plan actual:
                      </span>
                      <Badge
                        className={cn(
                          "text-xs border backdrop-blur-sm",
                          planInfo.color,
                        )}
                      >
                        <Crown className="mr-1 h-3 w-3" />
                        {planInfo.label || "Sin plan"}
                      </Badge>
                    </div>

                    {planActivo && (
                      <>
                        {planActivo.fechaFin && (
                          <p className="text-xs text-gray-400 mb-2">
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
                              <span className="text-gray-400">
                                Días restantes:
                              </span>
                              <span
                                className={cn(
                                  "font-medium",
                                  estaPorVencer
                                    ? "text-yellow-600"
                                    : "text-green-600",
                                )}
                              >
                                {planActivo.diasRestantes} /{" "}
                                {planActivo.diasTotales}
                              </span>
                            </div>
                            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100/50">
                              <div
                                className={cn(
                                  "h-full transition-all duration-300",
                                  estaPorVencer
                                    ? "bg-yellow-500"
                                    : "bg-green-500",
                                )}
                                style={{
                                  width: `${Math.min(planInfo.progress, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {estaVencido && (
                          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-3 mt-2">
                            <p className="text-xs text-red-600 font-medium">
                              Tu plan ha vencido. Renueva para seguir usando el
                              sistema.
                            </p>
                          </div>
                        )}

                        {estaPorVencer && !estaVencido && (
                          <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-xl p-3 mt-2">
                            <p className="text-xs text-yellow-600 font-medium">
                              ¡Tu plan está por vencer! Renueva pronto para no
                              perder beneficios.
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {!planActivo && (
                      <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-3 mt-2">
                        <p className="text-xs text-blue-600 font-medium">
                          No tienes un plan activo. Adquiere uno para acceder a
                          todos los beneficios.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-gray-100/50" />

            {tieneAgroGestion && (
              <>
                <DropdownItem
                  onClick={handleNavigateToAgroServicios}
                  icon={Sprout}
                  color="text-green-600"
                >
                  Agro Servicios
                </DropdownItem>
                <DropdownMenuSeparator className="bg-gray-100/50" />
              </>
            )}

            {esPropietario && (
              <>
                <DropdownItem
                  onClick={handleNavigateToMiPlan}
                  icon={Crown}
                  color="text-yellow-600"
                >
                  Mi Plan Actual
                </DropdownItem>

                <DropdownItem
                  onClick={handleNavigateToPlanes}
                  icon={Gift}
                  color="text-blue-600"
                >
                  {tienePlanActivo ? "Cambiar / Renovar Plan" : "Comprar Plan"}
                </DropdownItem>

                <DropdownItem
                  onClick={handleNavigateToHistorial}
                  icon={History}
                  color="text-gray-600"
                >
                  Historial de Compras
                </DropdownItem>

                <DropdownMenuSeparator className="bg-gray-100/50" />
              </>
            )}

            <DropdownItem
              onClick={handleLogout}
              icon={LogOut}
              color="text-red-600"
            >
              Cerrar sesión
            </DropdownItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default NavBar;
