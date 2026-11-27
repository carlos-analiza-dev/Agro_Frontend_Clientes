"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

declare global {
  interface Window {
    google: any;
    googleMapsLoaded?: boolean;
  }
}

interface GoogleMapViewerProps {
  latitud: number | string;
  longitud: number | string;
  titulo?: string;
  direccion?: string;
  className?: string;
  height?: string;
  showDirectionsButton?: boolean;
}

const GoogleMapViewer = ({
  latitud,
  longitud,
  titulo = "Ubicación",
  direccion,
  className = "w-full rounded-lg border",
  height = "h-48",
  showDirectionsButton = true,
}: GoogleMapViewerProps) => {
  const t = useTranslations("googleMapViewer");

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const safeParseFloat = (
    value: string | number | null | undefined,
  ): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      toast.error(t("errors.apiKeyNotFound"));

      setLoadError(true);
      return;
    }

    if (window.google) {
      setMapLoaded(true);
      return;
    }

    if (window.googleMapsLoaded) {
      return;
    }

    window.googleMapsLoaded = true;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setMapLoaded(true);
    };

    script.onerror = () => {
      setLoadError(true);
      window.googleMapsLoaded = false;
    };

    document.head.appendChild(script);
  }, [t]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google) return;

    const lat = safeParseFloat(latitud);
    const lng = safeParseFloat(longitud);

    if (!lat || !lng) {
      setLoadError(true);
      return;
    }

    const initialLocation = { lat, lng };

    try {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: 15,
        streetViewControl: true,
        mapTypeControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
        ],
      });

      markerRef.current = new window.google.maps.Marker({
        position: initialLocation,
        map: mapInstanceRef.current,
        draggable: false,
        title: titulo,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C11.58 2 8 5.58 8 10C8 17 16 30 16 30C16 30 24 17 24 10C24 5.58 20.42 2 16 2Z" fill="#EA4335"/>
              <path d="M16 14C17.1046 14 18 13.1046 18 12C18 10.8954 17.1046 10 16 10C14.8954 10 14 10.8954 14 12C14 13.1046 14.8954 14 16 14Z" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32),
        },
      });

      const infoContent = `
        <div class="p-2 max-w-xs">
          <h3 class="font-semibold text-sm text-gray-900">${titulo}</h3>
          ${direccion ? `<p class="text-xs text-gray-600 mt-1">${direccion}</p>` : ""}
          <p class="text-xs text-gray-500 mt-1">
            ${t("map.latitude")}: ${lat.toFixed(6)}, ${t("map.longitude")}: ${lng.toFixed(6)}
          </p>
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
      });

      markerRef.current.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current, markerRef.current);
      });

      setTimeout(() => {
        infoWindow.open(mapInstanceRef.current, markerRef.current);
      }, 1000);
    } catch (error) {
      toast.error(t("errors.initializeMap"));

      setLoadError(true);
    }
  }, [mapLoaded, latitud, longitud, titulo, direccion, t]);

  const openGoogleMapsDirections = () => {
    const lat = safeParseFloat(latitud);
    const lng = safeParseFloat(longitud);

    if (lat && lng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
      window.open(url, "_blank");
    }
  };

  const openGoogleMaps = () => {
    const lat = safeParseFloat(latitud);
    const lng = safeParseFloat(longitud);

    if (lat && lng) {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, "_blank");
    }
  };

  if (loadError) {
    return (
      <div
        className={`${className} ${height} bg-gray-100 flex flex-col items-center justify-center`}
      >
        <MapPin className="h-8 w-8 text-gray-400 mb-2" />
        <span className="text-gray-600 text-center text-sm">
          {t("states.loadError")}
        </span>
        <button
          onClick={openGoogleMaps}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
        >
          {t("buttons.openGoogleMaps")}
        </button>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div
        className={`${className} ${height} bg-gray-100 flex items-center justify-center`}
      >
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 text-sm">
          {t("states.loading")}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={mapRef} className={`${className} ${height}`} />
      <div className="flex justify-between items-center">
        <button
          onClick={openGoogleMaps}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          {t("buttons.openGoogleMaps")}
        </button>

        {showDirectionsButton && (
          <button
            onClick={openGoogleMapsDirections}
            className="flex items-center text-xs text-green-600 hover:text-green-800 underline"
          >
            <Navigation className="h-3 w-3 mr-1" />
            {t("buttons.getDirections")}
          </button>
        )}
      </div>
    </div>
  );
};

export default GoogleMapViewer;
