"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import {
  Heart,
  ShoppingCart,
  ChevronDown,
  Globe,
  Menu,
  X,
  UserPlus,
  Search,
  LogIn,
  Sparkles,
  Leaf,
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
import { cn } from "@/lib/utils";

const BadgeCounter = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-[10px] text-white font-bold shadow-[0_2px_8px_rgba(34,197,94,0.4)] animate-in zoom-in-50 duration-200 border border-white/20">
      {count > 9 ? "9+" : count}
    </span>
  );
};

const ActionButton = ({
  icon: Icon,
  count,
  onClick,
  title,
  color = "text-gray-600",
  className,
}: {
  icon: React.ElementType;
  count: number;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  color?: string;
  className?: string;
}) => (
  <Button
    onClick={onClick}
    variant="ghost"
    className={cn(
      "relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-green-50/80 transition-all duration-300 hover:scale-105 active:scale-95 group",
      count > 0 && "hover:bg-green-50",
      className,
    )}
    title={title}
  >
    <Icon
      className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:scale-110 ${color}`}
    />
    <BadgeCounter count={count} />
  </Button>
);

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
        if (isOpen) onToggle();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div ref={dropdownRef} className="relative hidden sm:block">
      <Button
        variant="ghost"
        className={cn(
          "flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1.5 h-9 sm:h-10 text-xs sm:text-sm font-medium transition-all duration-300",
          "bg-white/50 hover:bg-green-50/80 backdrop-blur-sm",
          "border border-gray-200/50 hover:border-green-200/50",
          hasSelectedCountry
            ? "text-gray-700 hover:text-green-600"
            : "text-green-600 bg-green-50/80 hover:bg-green-100/80 border-green-200/50 animate-pulse",
        )}
        onClick={onToggle}
        disabled={isLoading}
      >
        <Globe
          className={cn(
            "h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors",
            !hasSelectedCountry && "text-green-500",
          )}
        />
        <span className="font-medium truncate max-w-[80px] sm:max-w-[120px]">
          {hasSelectedCountry ? selectedCountry?.nombre : "Seleccionar país"}
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </Button>

      {isOpen && paises?.data?.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40 py-2 z-50 max-h-96 overflow-y-auto animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="px-4 py-3 border-b border-gray-100/50">
            <p className="text-sm font-semibold text-gray-900">Tu país</p>
            <p className="text-xs text-gray-400">Ver precios en tu moneda</p>
          </div>
          <div className="py-1">
            {paises.data.map((pais: any) => (
              <button
                key={pais.id}
                onClick={() => onSelect(pais)}
                className={cn(
                  "w-full text-left px-4 py-2.5 transition-all duration-200",
                  selectedCountry?.id === pais.id
                    ? "bg-green-50/80 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50/80 hover:text-green-600",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{pais.nombre}</span>
                    <span className="text-xs text-gray-400">
                      {pais.simbolo_moneda} {pais.nombre_moneda}
                    </span>
                  </div>
                  {selectedCountry?.id === pais.id && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10 text-green-500 text-xs">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
    className={cn(
      "sm:hidden flex items-center gap-1 rounded-full px-2.5 h-8 text-xs font-medium transition-all",
      "bg-white/50 hover:bg-green-50/80",
      hasSelectedCountry
        ? "text-gray-600 hover:text-green-600"
        : "text-green-600 bg-green-50/80 animate-pulse",
    )}
    onClick={onClick}
    disabled={isLoading}
  >
    <Globe className="h-3.5 w-3.5" />
    <span className="font-medium truncate max-w-[60px]">
      {hasSelectedCountry ? selectedCountry?.nombre?.substring(0, 10) : "País"}
    </span>
    <ChevronDown className="h-2.5 w-2.5" />
  </Button>
);

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
    <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl rounded-t-3xl sm:rounded-2xl w-full max-w-md sm:max-w-lg animate-in slide-in-from-bottom-10 duration-300 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] border border-white/20">
        <div className="flex justify-between items-center p-5 border-b border-gray-100/50">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Selecciona tu país
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              Precios en moneda local
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/80 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          {paises.data.map((pais: any) => (
            <button
              key={pais.id}
              onClick={() => onSelect(pais)}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all duration-200",
                selectedCountry?.id === pais.id
                  ? "bg-green-50/80 text-green-700 border border-green-200/50 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50/80 border border-transparent hover:border-gray-200/50",
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-base">{pais.nombre}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {pais.simbolo_moneda} {pais.nombre_moneda}
                  </p>
                </div>
                {selectedCountry?.id === pais.id && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const UserActionsDesktop = ({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) => (
  <div className="hidden sm:flex items-center gap-1.5">
    <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-200 to-transparent mx-1" />
    <Button
      onClick={onLogin}
      variant="ghost"
      className="rounded-full px-4 text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50/50 transition-all duration-300"
    >
      <LogIn className="h-4 w-4 mr-1.5 transition-transform group-hover:scale-110" />
      Iniciar Sesión
    </Button>
    <Button
      onClick={onRegister}
      className="rounded-full px-5 text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-[0_4px_16px_rgba(34,197,94,0.35)] hover:shadow-[0_6px_24px_rgba(34,197,94,0.45)] transition-all duration-300 transform hover:scale-[1.02]"
    >
      <Leaf className="h-3.5 w-3.5 mr-1.5" />
      Registrarse
    </Button>
  </div>
);

const UserActionsMobile = ({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) => (
  <div className="flex sm:hidden items-center gap-0.5">
    <Button
      onClick={onRegister}
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full hover:bg-green-50/80 transition-colors"
      title="Registrarse"
    >
      <UserPlus className="h-4 w-4 text-gray-600" />
    </Button>
    <Button
      onClick={onLogin}
      className="rounded-full px-3 py-1.5 h-8 text-xs font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)] transition-all duration-300"
    >
      Iniciar Sesión
    </Button>
  </div>
);

const useScrollEffect = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
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

  useEffect(() => {
    const saved = localStorage.getItem("selectedCountry");
    if (saved && paises) {
      try {
        const parsed = JSON.parse(saved);
        const exists = paises.data.some((p: any) => p.id === parsed.id);
        if (exists) {
          setSelectedCountry(parsed);
          setHasSelectedCountry(true);
          setPreviousCountryId(parsed.id);
        }
      } catch (e) {
        localStorage.removeItem("selectedCountry");
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
        className: "rounded-xl shadow-lg",
      });
      clearCart();
      limpiarFavoritos();
      setTimeout(() => window.location.reload(), 100);
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

const PublicNavBar = () => {
  const { data: paises, isLoading: paisesLoading } = useGetPaisesActivos();
  const { cantidadFavoritos } = useFavoritos();
  const { totalItems } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();

  const isScrolled = useScrollEffect();
  const { selectedCountry, hasSelectedCountry, handleCountrySelect } =
    useCountrySelection(paises);

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cantidadCarrito = totalItems();

  const ensureCountrySelected = (): boolean => {
    if (!hasSelectedCountry) {
      toast.info(
        "🌍 Para ver los productos disponibles, primero debes seleccionar tu país",
        {
          position: "top-center",
          autoClose: 4000,
          className: "rounded-xl shadow-lg",
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

  const navItems = [
    { label: "Productos", path: "/productos-agroservicios", icon: Search },
    { label: "Servicios", path: "/servicios-sembrador", icon: Sparkles },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-[0_4px_32px_rgba(0,0,0,0.06)] border-b border-white/40"
            : "bg-white/80 backdrop-blur-sm border-b border-white/20",
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-green-50/80 rounded-full h-9 w-9 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Abrir menú"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </Button>

              <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                <Image
                  alt="Logo El Sembrador"
                  src="/images/logo.png"
                  unoptimized
                  width={200}
                  height={100}
                  className="h-12 sm:h-16 lg:h-20 w-auto object-contain transition-all duration-500 group-hover:scale-105 group-hover:rotate-[-2deg]"
                  priority
                />
                <div className="hidden sm:flex flex-col">
                  <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent leading-none tracking-tight">
                    El Sembrador
                  </span>
                  <span className="text-[10px] lg:text-xs text-gray-400 font-medium tracking-[0.2em] uppercase">
                    Agroservicios
                  </span>
                </div>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-1 bg-white/40 backdrop-blur-sm rounded-full px-2 py-1 border border-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              {navItems.map(({ label, path, icon: Icon }) => {
                const isActive = pathname === path;
                return (
                  <button
                    key={path}
                    onClick={handleNavigation(path)}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-2",
                      isActive
                        ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-[0_4px_16px_rgba(34,197,94,0.35)]"
                        : "text-gray-600 hover:text-green-600 hover:bg-green-50/50",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
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

              {hasSelectedCountry && (
                <>
                  <ActionButton
                    icon={Heart}
                    count={cantidadFavoritos}
                    onClick={handleNavigation("/favs")}
                    title="Favoritos"
                    color="text-red-400 hover:text-red-500"
                  />
                  <ActionButton
                    icon={ShoppingCart}
                    count={cantidadCarrito}
                    onClick={handleNavigation("/carrito")}
                    title="Carrito"
                    color="text-green-500 hover:text-green-600"
                  />
                </>
              )}

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
