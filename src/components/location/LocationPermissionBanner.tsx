"use client";

import useUserLocation from "@/hooks/location/useUserLocation";

interface LocationPermissionBannerProps {
  onAllow?: () => void;
}

export const LocationPermissionBanner: React.FC<
  LocationPermissionBannerProps
> = ({ onAllow }) => {
  const { error, permissionStatus, retryLocation, location, loading } =
    useUserLocation();

  if (location && !loading) {
    return null;
  }

  if (permissionStatus.isBlocked) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800">
              Ubicación bloqueada
            </h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <button
              onClick={() => {
                // Instrucciones para el usuario
                alert(
                  "Por favor, permite el acceso a la ubicación en la configuración del navegador:\n\nChrome: Click en el candado 🔒 → Permisos → Ubicación → Permitir\nFirefox: Click en el ícono de ubicación → Permitir\nEdge: Click en el candado → Permisos de ubicación → Permitir",
                );
              }}
              className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium"
            >
              Cómo habilitar la ubicación →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error && !permissionStatus.isBlocked) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
          <button
            onClick={retryLocation}
            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm hover:bg-yellow-200 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-sm text-blue-800">Obteniendo ubicación...</p>
        </div>
      </div>
    );
  }

  return null;
};
