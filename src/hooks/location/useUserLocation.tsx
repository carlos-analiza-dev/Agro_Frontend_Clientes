"use client";

import { useEffect, useState } from "react";

interface UserLocation {
  latitud: number;
  longitud: number;
  direccion?: string;
  ciudad?: string;
  pais?: string;
}

const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

          resultado.address_components.forEach((component: any) => {
            if (component.types.includes("locality")) {
              ciudad = component.long_name;
            }

            if (component.types.includes("country")) {
              pais = component.long_name;
            }
          });

          setLocation({
            latitud,
            longitud,
            direccion: resultado?.formatted_address,
            ciudad,
            pais,
          });

          setLoading(false);
        } catch (err) {
          setError("Error obteniendo dirección");
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
