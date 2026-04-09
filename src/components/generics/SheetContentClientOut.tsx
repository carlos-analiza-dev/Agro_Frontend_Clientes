import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { Globe, Heart, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onProductsClick: () => void;
  onServicesClick: () => void;
  hasSelectedCountry: boolean;
  selectedCountry: any;
  isActive: (href: string) => boolean;
  cantidadFavoritos: number;
  cantidadCarrito: number;
}

const SheetContentClientOut = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onProductsClick,
  onServicesClick,
  hasSelectedCountry,
  selectedCountry,
  isActive,
  cantidadFavoritos,
  cantidadCarrito,
}: Props) => {
  const router = useRouter();

  const mobileNavLinks = [
    {
      name: "Productos",
      href: "/productos-agroservicios",
      icon: null,
      onClick: onProductsClick,
    },
    {
      name: "Servicios",
      href: "/servicios-sembrador",
      icon: null,
      onClick: onServicesClick,
    },
  ];

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetContent
        side="left"
        className="w-72 p-0 h-screen flex flex-col overflow-hidden"
      >
        <SheetHeader className="border-b border-gray-200 flex-shrink-0">
          <div className="flex h-16 items-center justify-between px-6">
            <SheetTitle className="text-xl font-bold text-green-700">
              El Sembrador
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <div className="space-y-1">
              {mobileNavLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    link.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {hasSelectedCountry && (
              <>
                <div className="my-4">
                  <Separator />
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      router.push("/favs");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <Heart className="mr-3 h-5 w-5" />
                    Favoritos
                    {cantidadFavoritos > 0 && (
                      <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                        {cantidadFavoritos}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      router.push("/carrito");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    Carrito
                    {cantidadCarrito > 0 && (
                      <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                        {cantidadCarrito}
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-100 space-y-3">
            {hasSelectedCountry && (
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">País:</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {selectedCountry?.nombre}
                </span>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <button
                onClick={() => {
                  router.push("/login");
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <User className="mr-3 h-5 w-5" />
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  router.push("/register");
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Crear cuenta nueva
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetContentClientOut;
