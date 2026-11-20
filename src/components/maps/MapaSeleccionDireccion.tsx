"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";

const Map = dynamic(() => import("@/components/generics/Map"), {
  ssr: false,
  loading: () => <div>{/* Se muestra mediante el estado de carga */}</div>,
});

interface MapaSeleccionDireccionProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (
    direccion: string,
    coords: { latitude: number; longitude: number },
  ) => void;
  initialCoords?: { latitude: number; longitude: number };
}

export default function MapaSeleccionDireccion({
  visible,
  onClose,
  onLocationSelect,
  initialCoords,
}: MapaSeleccionDireccionProps) {
  const t = useTranslations("mapaSeleccionDireccion");

  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [direccion, setDireccion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const defaultCoords = { latitude: 14.0818, longitude: -87.2068 };

  useEffect(() => {
    if (visible) {
      if (initialCoords) {
        setMarker(initialCoords);
        updateDireccion(initialCoords.latitude, initialCoords.longitude);
      } else {
        getCurrentLocation();
      }
    } else {
      setMarker(null);
      setDireccion("");
    }
  }, [visible, initialCoords]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setMarker(coords);
          updateDireccion(coords.latitude, coords.longitude);
          setIsLoading(false);
        },
        () => {
          toast.error(t("messages.locationError"));

          setMarker(defaultCoords);
          updateDireccion(defaultCoords.latitude, defaultCoords.longitude);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    } else {
      toast.error(t("messages.geolocationUnsupported"));

      setMarker(defaultCoords);
      updateDireccion(defaultCoords.latitude, defaultCoords.longitude);
    }
  };

  const updateDireccion = async (latitude: number, longitude: number) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      );

      if (!response.ok) {
        throw new Error(t("messages.addressFetchError"));
      }

      const data = await response.json();

      if (data && data.display_name) {
        setDireccion(data.display_name);
      } else {
        setDireccion(
          t("messages.selectedCoordinates", {
            latitude: latitude.toFixed(4),
            longitude: longitude.toFixed(4),
          }),
        );
      }
    } catch {
      toast.error(t("messages.addressError"));

      setDireccion(
        t("messages.selectedCoordinates", {
          latitude: latitude.toFixed(4),
          longitude: longitude.toFixed(4),
        }),
      );

      toast.error(t("messages.exactAddressUnavailable"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = (coords: { latitude: number; longitude: number }) => {
    setMarker(coords);
    updateDireccion(coords.latitude, coords.longitude);
  };

  const confirmarUbicacion = () => {
    if (direccion && marker) {
      onLocationSelect(direccion, marker);
      onClose();
    } else {
      toast.error(t("messages.selectLocation"));
    }
  };

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="h-64 w-full rounded-md overflow-hidden border relative">
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  <span className="text-sm text-muted-foreground">
                    {t("loading")}
                  </span>
                </div>
              </div>
            )}

            <Map
              center={
                marker
                  ? [marker.latitude, marker.longitude]
                  : [defaultCoords.latitude, defaultCoords.longitude]
              }
              zoom={15}
              marker={marker ? [marker.latitude, marker.longitude] : undefined}
              markerText={t("markerText")}
              onMapClick={handleMapClick}
              className="h-full w-full cursor-pointer"
            />
          </div>

          {direccion && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {t("selectedLocation")}
                    </p>

                    <p className="text-sm text-muted-foreground">{direccion}</p>
                  </div>
                </div>

                {marker && (
                  <p className="text-xs text-muted-foreground">
                    {t("coordinates")}: {marker.latitude.toFixed(6)},{" "}
                    {marker.longitude.toFixed(6)}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              💡 {t("instructions")}
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              {t("buttons.cancel")}
            </Button>

            <Button
              onClick={confirmarUbicacion}
              disabled={!marker || isLoading}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              {isLoading ? t("buttons.loading") : t("buttons.useLocation")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
