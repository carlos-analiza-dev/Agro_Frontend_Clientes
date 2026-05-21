import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Loader2, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDistanceCalculator } from "@/hooks/location/useDistanceCalculator";

interface DeliveryCostCalculatorProps {
  sucursalLat: number;
  sucursalLng: number;
  destinoLat: number;
  destinoLng: number;
  onCostCalculated: (cost: number, distance: number, duration: number) => void;
  simboloMoneda: string;
  autoCalculate?: boolean;
  precioPorKm?: number;
}

declare global {
  interface Window {
    google: any;
    googleMapsLoaded?: boolean;
  }
}

export const DeliveryCostCalculator = ({
  sucursalLat,
  sucursalLng,
  destinoLat,
  destinoLng,
  onCostCalculated,
  simboloMoneda,
  autoCalculate = true,
  precioPorKm = 1.5,
}: DeliveryCostCalculatorProps) => {
  const [calculado, setCalculado] = useState(false);
  const [googleMapsReady, setGoogleMapsReady] = useState(false);
  const { calcularCostoDelivery, isCalculating, distanceResult } =
    useDistanceCalculator({
      precioPorKm,
    });
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setGoogleMapsReady(true);
        return true;
      }
      return false;
    };

    if (checkGoogleMaps()) return;

    const interval = setInterval(() => {
      if (checkGoogleMaps()) {
        clearInterval(interval);
      }
    }, 500);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleCalculate = async () => {
    const key = `${sucursalLat}-${sucursalLng}-${destinoLat}-${destinoLng}`;

    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    if (!googleMapsReady) {
      return;
    }

    if (!sucursalLat || !sucursalLng || !destinoLat || !destinoLng) {
      return;
    }

    const cost = await calcularCostoDelivery(
      sucursalLat,
      sucursalLng,
      destinoLat,
      destinoLng,
    );

    if (cost > 0 && distanceResult) {
      onCostCalculated(cost, distanceResult.distance, distanceResult.duration);
      setCalculado(true);
    }
  };

  useEffect(() => {
    if (!autoCalculate) return;
    if (!googleMapsReady) return;
    if (!sucursalLat || !sucursalLng || !destinoLat || !destinoLng) return;

    handleCalculate();
  }, [
    sucursalLat,
    sucursalLng,
    destinoLat,
    destinoLng,
    autoCalculate,
    googleMapsReady,
  ]);

  if (!googleMapsReady) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Cargando Google Maps...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sucursalLat || !sucursalLng || !destinoLat || !destinoLng) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">
              Faltan coordenadas para calcular el costo de envío
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isCalculating) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Calculando costo de envío...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!calculado && !autoCalculate) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={handleCalculate}
        className="w-full"
      >
        <Truck className="h-4 w-4 mr-2" />
        Calcular costo de envío
      </Button>
    );
  }

  if (distanceResult) {
    return (
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-800">
              <Truck className="h-5 w-5" />
              <span className="font-medium">Costo de Envío</span>
            </div>
            <span className="text-xl font-bold text-orange-800">
              {simboloMoneda} {distanceResult.cost.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-orange-700">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Distancia: {distanceResult.distance.toFixed(1)} km</span>
            </div>
            <span>
              Tiempo estimado: {Math.round(distanceResult.duration)} min
            </span>
          </div>

          <p className="text-xs text-orange-600 mt-1">
            *Costo calculado basado en la distancia desde la sucursal hasta el
            punto de entrega
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};
