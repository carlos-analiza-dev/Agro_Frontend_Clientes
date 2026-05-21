import { useState, useCallback } from "react";
import { toast } from "react-toastify";

interface DistanceResult {
  distance: number;
  duration: number;
  cost: number;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

interface UseDistanceCalculatorProps {
  precioPorKm?: number;
  precioBase?: number;
}

interface DistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      status: string;
      distance: {
        value: number;
        text: string;
      };
      duration: {
        value: number;
        text: string;
      };
    }>;
  }>;
}

type DistanceMatrixStatus =
  | "OK"
  | "INVALID_REQUEST"
  | "MAX_ELEMENTS_EXCEEDED"
  | "OVER_DAILY_LIMIT"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "UNKNOWN_ERROR";

export const useDistanceCalculator = (props?: UseDistanceCalculatorProps) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [distanceResult, setDistanceResult] = useState<DistanceResult | null>(
    null,
  );

  const precioPorKm = props?.precioPorKm ?? 1.5;
  const precioBase = props?.precioBase ?? 0;

  const calcularDistancia = useCallback(
    (
      originLat: number,
      originLng: number,
      destLat: number,
      destLng: number,
    ): Promise<{ distance: number; duration: number }> => {
      return new Promise((resolve, reject) => {
        if (!window.google) {
          reject(new Error("Google Maps no está cargado"));
          return;
        }

        const service = new window.google.maps.DistanceMatrixService();

        service.getDistanceMatrix(
          {
            origins: [{ lat: originLat, lng: originLng }],
            destinations: [{ lat: destLat, lng: destLng }],
            travelMode: window.google.maps.TravelMode.DRIVING,
            unitSystem: window.google.maps.UnitSystem.METRIC,
          },
          (response: DistanceMatrixResponse, status: DistanceMatrixStatus) => {
            if (status === "OK" && response) {
              const element = response.rows[0].elements[0];

              if (element.status === "OK") {
                const distance = element.distance.value / 1000;
                const duration = element.duration.value / 60;

                resolve({ distance, duration });
              } else {
                reject(new Error("No se pudo calcular la distancia"));
              }
            } else {
              reject(new Error("Error al calcular la distancia"));
            }
          },
        );
      });
    },
    [],
  );

  const calcularCostoDelivery = useCallback(
    async (
      originLat: number,
      originLng: number,
      destLat: number,
      destLng: number,
    ): Promise<number> => {
      setIsCalculating(true);

      try {
        const { distance, duration } = await calcularDistancia(
          originLat,
          originLng,
          destLat,
          destLng,
        );

        const cost = precioBase + distance * precioPorKm;

        setDistanceResult({
          distance,
          duration,
          cost,
          origin: { lat: originLat, lng: originLng },
          destination: { lat: destLat, lng: destLng },
        });

        return cost;
      } catch (error) {
        toast.error("No se pudo calcular el costo de envío");
        return 0;
      } finally {
        setIsCalculating(false);
      }
    },
    [calcularDistancia, precioBase, precioPorKm],
  );

  return {
    calcularCostoDelivery,
    calcularDistancia,
    isCalculating,
    distanceResult,
  };
};
