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

  const getLocationInstructions = () => {
    const userAgent = navigator.userAgent;

    if (/iPhone|iPad|iPod/.test(userAgent)) {
      return (
        "Safari (iPhone/iPad):\n" +
        "Opción 1:\n" +
        "1. Toca 'aA' en la barra de direcciones\n" +
        "2. Configuración del sitio web\n" +
        "3. Ubicación → Permitir\n" +
        "4. Recarga la página\n\n" +
        "Si no funciona:\n" +
        "1. Configuración → Privacidad y seguridad\n" +
        "2. Localización → Sitios web de Safari\n" +
        "3. Selecciona 'Mientras se usa la app'\n" +
        "4. Regresa a Safari y recarga la página"
      );
    }

    if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
      return (
        "Safari (Mac):\n" +
        "1. Safari → Configuración (o Preferencias en versiones antiguas)\n" +
        "2. Sitios web → Ubicación\n" +
        "3. Busca este sitio en la lista\n" +
        "4. Cambia el permiso a 'Permitir'\n" +
        "5. Recarga la página"
      );
    }

    if (/Firefox/.test(userAgent)) {
      return "Firefox:\nHaz clic en el ícono de permisos, en la parte superior izquierda de la URL → Permitir ubicación";
    }

    if (/Edg/.test(userAgent)) {
      return "Edge:\nHaz clic en el ícono del sitio, en la parte superior izquierda de la URL → Permisos → Ubicación → Permitir";
    }

    if (/OPR/.test(userAgent)) {
      return (
        "Opera:\n" +
        "Haz clic en el ícono de candado del sitio, parte superior izquierda de la URL → Ubicación → Permitir"
      );
    }

    return (
      "Chrome:\n" +
      "Haz clic en el ícono de configuración del sitio, parte superior izquierda de la URL → Ubicación → Permitir"
    );
  };

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
              El sitio necesita acceder a tu ubicacion para funcionar
            </h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <button
              onClick={() => {
                alert(getLocationInstructions());
              }}
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
