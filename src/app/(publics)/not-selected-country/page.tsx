"use client";

import { Button } from "@/components/ui/button";
import {
  Globe,
  MapPin,
  ChevronDown,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NotSelecteCountry = () => {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  const handleSelectCountry = () => {
    const countryButton = document.querySelector(".country-dropdown button");
    if (countryButton) {
      (countryButton as HTMLButtonElement).click();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500" />

          <div className="p-8 md:p-12">
            <div className="mb-8 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-orange-100 rounded-full w-28 h-28 animate-ping opacity-20" />
              </div>
              <div className="relative bg-orange-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-lg">
                <Globe className="h-12 w-12 text-orange-600 animate-pulse" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              ¡Selecciona tu país!
            </h1>

            <p className="text-center text-gray-600 mb-8">
              Para acceder a esta página y ver los productos disponibles,
              necesitamos saber desde dónde nos visitas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Precios locales
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Verás los precios en tu moneda local y productos disponibles
                  en tu región.
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 rounded-lg p-2">
                    <AlertCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Disponibilidad real
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Te mostraremos solo productos que se pueden enviar a tu
                  ubicación.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSelectCountry}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="group relative bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Seleccionar país
                  {isHovering ? (
                    <ArrowRight className="h-4 w-4 transition-all" />
                  ) : (
                    <ChevronDown className="h-4 w-4 transition-all" />
                  )}
                </span>
                <div className="absolute inset-0 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>

              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="border-gray-300 hover:border-orange-300 hover:bg-orange-50 px-8 py-3 rounded-full transition-all"
              >
                Ir al inicio
              </Button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-100">
              ¿Problemas para seleccionar tu país?{" "}
              <button
                onClick={() => router.push("/contacto")}
                className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
              >
                Contacta con soporte
              </button>
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-20 -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10" />
      </div>
    </div>
  );
};

export default NotSelecteCountry;
