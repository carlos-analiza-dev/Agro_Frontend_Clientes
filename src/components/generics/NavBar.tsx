"use client";

import React from "react";
import { Button } from "../ui/button";
import { Heart, LogOut, Menu, ShoppingCart, User } from "lucide-react";

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
import { navItems } from "@/helpers/data/sidebarData";
import { useFavoritos } from "@/hooks/favoritos/useFavoritos";
import { useCartStore } from "@/providers/store/useCartStore";

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

  const cantidadCarrito = totalItems();

  const permisosVer =
    cliente?.clientePermisos
      ?.filter((permiso) => permiso.ver === true)
      ?.map((permiso) => permiso.permiso.url) || [];

  const allowedRoutes = ["/panel", "/not-found", "/unauthorized"];

  const navItemsConPermisos = navItems.flatMap((section) =>
    section.items.filter((item) => {
      if (allowedRoutes.includes(item.href)) {
        return true;
      }
      return permisosVer.includes(item.href);
    })
  );

  const activePage =
    navItemsConPermisos.find((item) => item.href === pathname)?.name || "";

  const tienePermisoFavoritos = permisosVer.includes("/favoritos");

  const tienePermisoCarrito = permisosVer.includes("/cart");

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
          <h2 className="ml-4 text-base md:text-lg font-medium text-gray-900">
            {activePage}
          </h2>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {tienePermisoFavoritos && (
          <Button
            onClick={() => router.push("/favoritos")}
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
            title="Favoritos"
          >
            {cantidadFavoritos > 0 ? (
              <Heart className="text-red-500" fill="currentColor" />
            ) : (
              <Heart />
            )}
          </Button>
        )}

        {tienePermisoCarrito && (
          <Button
            onClick={() => router.push("/cart")}
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
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
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs leading-none text-gray-500">
                  {cliente?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
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
