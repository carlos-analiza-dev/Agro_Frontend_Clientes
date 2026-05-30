"use client";

import { useEffect, useState } from "react";

interface UserLocation {
  latitud: number;
  longitud: number;
  direccion?: string;
  ciudad?: string;
  pais?: string;
}

const STORAGE_KEY = "user_location";
const EXPIRATION_TIME = 1000 * 60 * 30;

const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cachedLocation = localStorage.getItem(STORAGE_KEY);

    if (cachedLocation) {
      const parsed = JSON.parse(cachedLocation);

      const isValid = Date.now() - parsed.timestamp < EXPIRATION_TIME;

      if (isValid) {
        setLocation(parsed.location);
        setLoading(false);
        return;
      }

      localStorage.removeItem(STORAGE_KEY);
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitud = position.coords.latitude;
          const longitud = position.coords.longitude;

          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
          );

          const data = await response.json();

          const resultado = data.results?.[0];

          let ciudad = "";
          let pais = "";

          resultado?.address_components?.forEach((component: any) => {
            if (component.types.includes("locality")) {
              ciudad = component.long_name;
            }

            if (component.types.includes("country")) {
              pais = component.long_name;
            }
          });

          const userLocation: UserLocation = {
            latitud,
            longitud,
            direccion: resultado?.formatted_address,
            ciudad,
            pais,
          };

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              location: userLocation,
              timestamp: Date.now(),
            }),
          );

          setLocation(userLocation);
        } catch {
          setError("Error obteniendo dirección");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
      },
    );
  }, []);

  return {
    location,
    loading,
    error,
  };
};

export default useUserLocation;
