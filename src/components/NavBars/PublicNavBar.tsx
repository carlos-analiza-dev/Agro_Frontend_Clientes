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
import SheetContentClientOut from "../generics/SheetContentClientOut";

// ============================================
// COMPONENTES INTERNOS
// ============================================

// Badge para contadores (favoritos, carrito)
const BadgeCounter = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-medium">
      {count > 9 ? "9+" : count}
    </span>
  );
};

// Botón de acción con contador
const ActionButton = ({
  icon: Icon,
  count,
  onClick,
  title,
  countColor = "text-red-500",
}: {
  icon: React.ElementType;
  count: number;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  countColor?: string;
}) => (
  <Button
    onClick={onClick}
    variant="ghost"
    className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-gray-100 transition-colors"
    title={title}
  >
    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${count > 0 ? countColor : ""}`} />
    <BadgeCounter count={count} />
  </Button>
);

// Selector de país (desktop)
const CountrySelector = ({
  selectedCountry,
  hasSelectedCountry,
  paises,
  isLoading,
  isOpen,
  onToggle,
  onSelect,
}: {
  selectedCountry: Pais | null;
  hasSelectedCountry: boolean;
  paises: any;
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (pais: Pais) => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div ref={dropdownRef} className="relative hidden sm:block">
      <Button
        variant="ghost"
        className={`flex items-center gap-1 sm:gap-2 rounded-full px-2 sm:px-3 py-1 h-8 sm:h-9 text-xs sm:text-sm transition-all ${
          hasSelectedCountry
            ? "text-gray-600 hover:text-green-600 hover:bg-green-50"
            : "text-orange-600 bg-orange-50 hover:bg-orange-100 animate-pulse"
        }`}
        onClick={onToggle}
        disabled={isLoading}
      >
        <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="font-medium truncate max-w-[80px] sm:max-w-[120px]">
          {hasSelectedCountry ? selectedCountry?.nombre : "Seleccionar país"}
        </span>
        <ChevronDown
          className={`h-2 w-2 sm:h-3 sm:w-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && paises?.data?.length > 0 && (
        <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-80 sm:max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 sm:px-4 py-2 border-b border-gray-100">
            <p className="text-xs text-gray-500 font-medium">
              Selecciona tu país
            </p>
            <p className="text-xs text-gray-400">Precios en moneda local</p>
          </div>
          {paises.data.map((pais: any) => (
            <button
              key={pais.id}
              onClick={() => onSelect(pais)}
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
                  <span className="text-green-600 text-xs sm:text-sm">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Botón de país (mobile)
const MobileCountryButton = ({
  hasSelectedCountry,
  selectedCountry,
  isLoading,
  onClick,
}: {
  hasSelectedCountry: boolean;
  selectedCountry: Pais | null;
  isLoading: boolean;
  onClick: () => void;
}) => (
  <Button
    variant="ghost"
    className={`sm:hidden flex items-center gap-1 rounded-full px-2 h-8 text-xs transition-all ${
      hasSelectedCountry
        ? "text-gray-600 hover:text-green-600"
        : "text-orange-600 bg-orange-50 animate-pulse"
    }`}
    onClick={onClick}
    disabled={isLoading}
  >
    <Globe className="h-3 w-3" />
    <span className="font-medium truncate max-w-[60px]">
      {hasSelectedCountry ? selectedCountry?.nombre?.substring(0, 10) : "País"}
    </span>
    <ChevronDown className="h-2 w-2" />
  </Button>
);

// Modal de selección de país
const CountryModal = ({
  isOpen,
  paises,
  selectedCountry,
  onSelect,
  onClose,
}: {
  isOpen: boolean;
  paises: any;
  selectedCountry: Pais | null;
  onSelect: (pais: Pais) => void;
  onClose: () => void;
}) => {
  if (!isOpen || !paises?.data?.length) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md sm:max-w-lg animate-in slide-in-from-bottom-10 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Selecciona tu país
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {paises.data.map((pais: any) => (
            <button
              key={pais.id}
              onClick={() => onSelect(pais)}
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
  );
};

// Acciones de usuario (desktop)
const UserActionsDesktop = ({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) => (
  <div className="hidden sm:flex items-center gap-2">
    <div className="w-px h-5 bg-gray-200" />
    <Button
      onClick={onLogin}
      variant="ghost"
      className="rounded-full px-3 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all"
    >
      <User className="h-4 w-4 mr-1" />
      Iniciar Sesión
    </Button>
    <Button
      onClick={onRegister}
      variant="default"
      className="rounded-full px-4 text-sm bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all"
    >
      Registrarse
    </Button>
  </div>
);

// Acciones de usuario (mobile)
const UserActionsMobile = ({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) => (
  <div className="flex sm:hidden items-center gap-1">
    <Button
      onClick={onRegister}
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full hover:bg-gray-100"
      title="Registrarse"
    >
      <UserPlus className="h-4 w-4" />
    </Button>
    <Button
      onClick={onLogin}
      variant="default"
      className="rounded-full px-2.5 py-1 h-8 text-xs bg-green-600 hover:bg-green-700 transition-all"
    >
      Iniciar Sesión
    </Button>
  </div>
);

// ============================================
// HOOKS PERSONALIZADOS
// ============================================

const useScrollEffect = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isScrolled;
};

const useCountrySelection = (paises: any) => {
  const [selectedCountry, setSelectedCountry] = useState<Pais | null>(null);
  const [hasSelectedCountry, setHasSelectedCountry] = useState(false);
  const [previousCountryId, setPreviousCountryId] = useState<string | null>(
    null,
  );
  const { clearCart } = useCartStore();
  const { limpiarFavoritos } = useFavoritos();

  // Cargar país guardado
  useEffect(() => {
    const saved = localStorage.getItem("selectedCountry");
    if (saved && paises) {
      const parsed = JSON.parse(saved);
      const exists = paises.data.some((p: any) => p.id === parsed.id);
      if (exists) {
        setSelectedCountry(parsed);
        setHasSelectedCountry(true);
        setPreviousCountryId(parsed.id);
      }
    }
  }, [paises]);

  // Guardar país seleccionado
  useEffect(() => {
    if (selectedCountry && hasSelectedCountry) {
      localStorage.setItem("selectedCountry", JSON.stringify(selectedCountry));
      window.dispatchEvent(
        new CustomEvent("countryChanged", { detail: selectedCountry }),
      );
    }
  }, [selectedCountry, hasSelectedCountry]);

  // Manejar cambios de país
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
  }, [
    selectedCountry,
    hasSelectedCountry,
    previousCountryId,
    clearCart,
    limpiarFavoritos,
  ]);

  const handleCountrySelect = (pais: Pais) => {
    if (selectedCountry?.id === pais.id) return;
    setSelectedCountry(pais);
    setHasSelectedCountry(true);
  };

  return {
    selectedCountry,
    hasSelectedCountry,
    handleCountrySelect,
  };
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const PublicNavBar = () => {
  const { data: paises, isLoading: paisesLoading } = useGetPaisesActivos();
  const { cantidadFavoritos, limpiarFavoritos } = useFavoritos();
  const { totalItems, clearCart } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();

  const isScrolled = useScrollEffect();
  const { selectedCountry, hasSelectedCountry, handleCountrySelect } =
    useCountrySelection(paises);

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cantidadCarrito = totalItems();

  // ===== NAVEGACIÓN =====
  const ensureCountrySelected = (): boolean => {
    if (!hasSelectedCountry) {
      toast.info(
        "Para ver los productos disponibles, primero debes seleccionar tu país",
        {
          position: "top-center",
          autoClose: 4000,
        },
      );
      setTimeout(() => setIsCountryModalOpen(true), 500);
      return false;
    }
    return true;
  };

  const navigateTo = (path: string) => {
    if (ensureCountrySelected()) {
      router.push(path);
      setIsMobileMenuOpen(false);
    }
  };

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo(path);
  };

  // ===== SELECTOR DE PAÍS =====
  const openCountrySelector = () => {
    if (window.innerWidth < 640) {
      setIsCountryModalOpen(true);
    } else {
      setIsCountryDropdownOpen((prev) => !prev);
    }
  };

  const onCountrySelect = (pais: Pais) => {
    handleCountrySelect(pais);
    setIsCountryDropdownOpen(false);
    setIsCountryModalOpen(false);
  };

  // ===== RENDER =====
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
            {/* ===== LOGO Y MENÚ MÓVIL ===== */}
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
                  alt="Logo El Sembrador"
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

            {/* ===== NAVEGACIÓN DESKTOP ===== */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: "Productos", path: "/productos-agroservicios" },
                { label: "Servicios", path: "/servicios-sembrador" },
              ].map(({ label, path }) => (
                <button
                  key={path}
                  onClick={handleNavigation(path)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === path
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* ===== ACCIONES DERECHA ===== */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Selector de país */}
              <CountrySelector
                selectedCountry={selectedCountry}
                hasSelectedCountry={hasSelectedCountry}
                paises={paises}
                isLoading={paisesLoading}
                isOpen={isCountryDropdownOpen}
                onToggle={openCountrySelector}
                onSelect={onCountrySelect}
              />

              <MobileCountryButton
                hasSelectedCountry={hasSelectedCountry}
                selectedCountry={selectedCountry}
                isLoading={paisesLoading}
                onClick={openCountrySelector}
              />

              {/* Acciones solo con país seleccionado */}
              {hasSelectedCountry && (
                <>
                  <ActionButton
                    icon={Heart}
                    count={cantidadFavoritos}
                    onClick={handleNavigation("/favs")}
                    title="Favoritos"
                  />
                  <ActionButton
                    icon={ShoppingCart}
                    count={cantidadCarrito}
                    onClick={handleNavigation("/carrito")}
                    title="Carrito"
                    countColor="text-blue-600"
                  />
                </>
              )}

              {/* Acciones de usuario */}
              <UserActionsDesktop
                onLogin={() => router.push("/login")}
                onRegister={() => router.push("/register")}
              />
              <UserActionsMobile
                onLogin={() => router.push("/login")}
                onRegister={() => router.push("/register")}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ===== MENÚ MÓVIL ===== */}
      <SheetContentClientOut
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onProductsClick={() => navigateTo("/productos-agroservicios")}
        onServicesClick={() => navigateTo("/servicios-sembrador")}
        hasSelectedCountry={hasSelectedCountry}
        selectedCountry={selectedCountry}
        isActive={(path: string) => pathname === path}
        cantidadFavoritos={cantidadFavoritos}
        cantidadCarrito={cantidadCarrito}
      />

      {/* ===== MODAL DE PAÍS ===== */}
      <CountryModal
        isOpen={isCountryModalOpen}
        paises={paises}
        selectedCountry={selectedCountry}
        onSelect={onCountrySelect}
        onClose={() => setIsCountryModalOpen(false)}
      />
    </>
  );
};

export default PublicNavBar;
