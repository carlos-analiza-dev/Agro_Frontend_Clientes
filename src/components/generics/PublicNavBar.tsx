"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import {
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  Globe,
  Menu,
  X,
  UserPlus,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useFavoritos } from "@/hooks/favoritos/useFavoritos";
import { useCartStore } from "@/providers/store/useCartStore";
import useGetPaisesActivos from "@/hooks/paises/useGetPaisesActivos";
import { Pais } from "@/interfaces/auth/cliente";
import { toast } from "react-toastify";
import SheetContentClientOut from "./SheetContentClientOut";

const PublicNavBar = () => {
  const { data: paises, isLoading: paisesLoading } = useGetPaisesActivos();
  const { cantidadFavoritos, limpiarFavoritos } = useFavoritos();
  const { totalItems, clearCart } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [hasSelectedCountry, setHasSelectedCountry] = useState(false);
  const [previousCountryId, setPreviousCountryId] = useState<string | null>(
    null,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const cantidadCarrito = totalItems();

  const handleProductsNavigationWithoutEvent = () => {
    if (!canNavigateToProducts()) {
      return;
    }
    router.push("/productos-agroservicios");
    setIsMobileMenuOpen(false);
  };

  const canNavigateToProducts = () => {
    if (!hasSelectedCountry) {
      toast.info(
        "Para ver los productos disponibles, primero debes seleccionar tu país",
        {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      );

      setTimeout(() => {
        setIsCountryModalOpen(true);
      }, 500);

      return false;
    }
    return true;
  };

  const handleProductsNavigation = (e: React.MouseEvent) => {
    if (!canNavigateToProducts()) {
      e.preventDefault();
      return;
    }
    router.push("/productos-agroservicios");
    setIsMobileMenuOpen(false);
  };

  const handleFavoritesNavigation = (e: React.MouseEvent) => {
    if (!canNavigateToProducts()) {
      e.preventDefault();
      return;
    }
    router.push("/favs");
  };

  const handleCartNavigation = (e: React.MouseEvent) => {
    if (!canNavigateToProducts()) {
      e.preventDefault();
      return;
    }
    router.push("/carrito");
  };

  useEffect(() => {
    const savedCountry = localStorage.getItem("selectedCountry");
    if (savedCountry && paises) {
      const parsedCountry = JSON.parse(savedCountry);

      const countryExists = paises.data.some(
        (p: any) => p.id === parsedCountry.id,
      );
      if (countryExists) {
        setSelectedCountry(parsedCountry);
        setHasSelectedCountry(true);
        setPreviousCountryId(parsedCountry.id);
      }
    }
  }, [paises]);

  useEffect(() => {
    if (selectedCountry && hasSelectedCountry) {
      localStorage.setItem("selectedCountry", JSON.stringify(selectedCountry));

      window.dispatchEvent(
        new CustomEvent("countryChanged", { detail: selectedCountry }),
      );
    }
  }, [selectedCountry, hasSelectedCountry]);

  useEffect(() => {
    if (
      hasSelectedCountry &&
      selectedCountry &&
      previousCountryId !== null &&
      previousCountryId !== selectedCountry.id
    ) {
      setPreviousCountryId(selectedCountry.id);

      toast.info(`🔄 Mostrando productos para ${selectedCountry.nombre}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      window.location.reload();
      clearCart();
      limpiarFavoritos();
    } else if (
      hasSelectedCountry &&
      selectedCountry &&
      previousCountryId === null
    ) {
      setPreviousCountryId(selectedCountry.id);
    }
  }, [selectedCountry, hasSelectedCountry, previousCountryId, router]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(target)
      ) {
        setIsCountryDropdownOpen(false);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  const isActive = (href: string) => pathname === href;

  const handleCountrySelect = (pais: Pais) => {
    if (selectedCountry?.id === pais.id) {
      setIsCountryDropdownOpen(false);
      setIsCountryModalOpen(false);
      return;
    }

    setSelectedCountry(pais);
    setHasSelectedCountry(true);
    setIsCountryDropdownOpen(false);
    setIsCountryModalOpen(false);
  };

  const openCountrySelector = () => {
    if (window.innerWidth < 640) {
      setIsCountryModalOpen(true);
    } else {
      setIsCountryDropdownOpen(!isCountryDropdownOpen);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-gray-100 rounded-full h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Abrir menú"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <Link href="/" className="flex items-center gap-1 sm:gap-2 group">
                <Image
                  alt="Logo"
                  src="/images/logo.png"
                  unoptimized
                  width={200}
                  height={100}
                  className="h-16 sm:h-28 w-auto object-contain transition-transform group-hover:scale-105"
                  priority
                />
                <span className="hidden sm:block text-lg sm:text-xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                  El Sembrador
                </span>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={handleProductsNavigation}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive("/productos-agroservicios")
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                }`}
              >
                Productos
              </button>
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <div
                ref={countryDropdownRef}
                className="relative country-dropdown hidden sm:block"
              >
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 sm:gap-2 rounded-full px-2 sm:px-3 py-1 h-8 sm:h-9 text-xs sm:text-sm transition-all ${
                    hasSelectedCountry
                      ? "text-gray-600 hover:text-green-600 hover:bg-green-50"
                      : "text-orange-600 bg-orange-50 hover:bg-orange-100 animate-pulse"
                  }`}
                  onClick={openCountrySelector}
                  disabled={paisesLoading}
                >
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-medium truncate max-w-[80px] sm:max-w-[120px]">
                    {hasSelectedCountry
                      ? selectedCountry?.nombre
                      : "Seleccionar país"}
                  </span>
                  <ChevronDown
                    className={`h-2 w-2 sm:h-3 sm:w-3 transition-transform ${
                      isCountryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {isCountryDropdownOpen && paises && paises.data.length > 0 && (
                  <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-80 sm:max-h-96 overflow-y-auto">
                    <div className="px-3 sm:px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">
                        Selecciona tu país
                      </p>
                      <p className="text-xs text-gray-400">
                        Los precios se mostrarán en la moneda local
                      </p>
                    </div>
                    {paises.data.map((pais: any) => (
                      <button
                        key={pais.id}
                        onClick={() => handleCountrySelect(pais)}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-colors ${
                          selectedCountry?.id === pais.id
                            ? "bg-green-50 text-green-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-medium">{pais.nombre}</span>
                            <span className="text-xs text-gray-400">
                              {pais.simbolo_moneda} - {pais.nombre_moneda}
                            </span>
                          </div>
                          {selectedCountry?.id === pais.id && (
                            <span className="text-green-600 text-xs sm:text-sm">
                              ✓
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                className={`sm:hidden flex items-center gap-1 rounded-full px-2 h-8 text-xs transition-all ${
                  hasSelectedCountry
                    ? "text-gray-600 hover:text-green-600"
                    : "text-orange-600 bg-orange-50 animate-pulse"
                }`}
                onClick={openCountrySelector}
                disabled={paisesLoading}
              >
                <Globe className="h-3 w-3" />
                <span className="font-medium truncate max-w-[60px]">
                  {hasSelectedCountry
                    ? selectedCountry?.nombre?.substring(0, 10)
                    : "País"}
                </span>
                <ChevronDown className="h-2 w-2" />
              </Button>

              {hasSelectedCountry && (
                <Button
                  onClick={handleFavoritesNavigation}
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

              {hasSelectedCountry && (
                <Button
                  onClick={handleCartNavigation}
                  variant="ghost"
                  className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-gray-100"
                  title="Carrito"
                >
                  <ShoppingCart
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${cantidadCarrito > 0 ? "text-blue-600" : ""}`}
                  />
                  {cantidadCarrito > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                      {cantidadCarrito > 9 ? "9+" : cantidadCarrito}
                    </span>
                  )}
                </Button>
              )}

              <div className="hidden sm:block w-px h-5 bg-gray-200" />

              <div className="hidden sm:flex items-center gap-2">
                <Button
                  onClick={() => router.push("/login")}
                  variant="ghost"
                  className="rounded-full px-3 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all"
                >
                  <User className="h-4 w-4 mr-1" />
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  variant="default"
                  className="rounded-full px-4 text-sm bg-green-600 hover:bg-green-700 text-white shadow-sm"
                >
                  Registrarse
                </Button>
              </div>

              <div className="flex sm:hidden items-center gap-1">
                <Button
                  onClick={() => router.push("/register")}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100"
                  title="Iniciar Sesión"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  variant="default"
                  className="rounded-full px-2.5 py-1 h-8 text-xs bg-green-600 hover:bg-green-700"
                >
                  Iniciar Sesion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SheetContentClientOut
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onProductsClick={handleProductsNavigationWithoutEvent}
        hasSelectedCountry={hasSelectedCountry}
        selectedCountry={selectedCountry}
        isActive={isActive}
        cantidadFavoritos={cantidadFavoritos}
        cantidadCarrito={cantidadCarrito}
      />

      {isCountryModalOpen && paises && paises.data.length > 0 && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md sm:max-w-lg animate-in slide-in-from-bottom-10 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Selecciona tu país
              </h3>
              <button
                onClick={() => setIsCountryModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {paises.data.map((pais: any) => (
                <button
                  key={pais.id}
                  onClick={() => handleCountrySelect(pais)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCountry?.id === pais.id
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{pais.nombre}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {pais.simbolo_moneda} - {pais.nombre_moneda}
                      </p>
                    </div>
                    {selectedCountry?.id === pais.id && (
                      <span className="text-green-600">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicNavBar;
