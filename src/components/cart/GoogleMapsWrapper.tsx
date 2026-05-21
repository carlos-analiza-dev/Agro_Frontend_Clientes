import { Loader2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MapComponent } from "./MapComponent";

export const GoogleMapsWrapper = ({
  onLocationSelect,
  initialLocation,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation: { lat: number; lng: number };
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      toast.error("Google Maps API key no encontrada");
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
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

    return () => {};
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
        <MapPin className="h-12 w-12 text-gray-400 mb-2" />
        <span className="text-gray-600 text-center">
          Error al cargar el mapa. <br />
          Verifica tu conexión a internet.
        </span>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando mapa...</span>
      </div>
    );
  }

  return (
    <MapComponent
      onLocationSelect={onLocationSelect}
      initialLocation={initialLocation}
    />
  );
};
