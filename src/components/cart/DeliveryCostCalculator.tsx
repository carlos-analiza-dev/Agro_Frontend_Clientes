"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("deliveryCostCalculator");

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
            <span className="text-sm">{t("states.loadingMaps")}</span>
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
            <span className="text-sm">{t("states.missingCoordinates")}</span>
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
            <span className="text-sm">{t("states.calculating")}</span>
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
        {t("buttons.calculate")}
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
              <span className="font-medium">{t("results.shippingCost")}</span>
            </div>
            <span className="text-xl font-bold text-orange-800">
              {simboloMoneda} {distanceResult.cost.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm text-orange-700">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>
                {t("results.distance", {
                  distance: distanceResult.distance.toFixed(1),
                })}
              </span>
            </div>
            <span>
              {t("results.estimatedTime", {
                duration: Math.round(distanceResult.duration),
              })}
            </span>
          </div>

          <p className="text-xs text-orange-600 mt-1">
            {t("results.calculationNote")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};
