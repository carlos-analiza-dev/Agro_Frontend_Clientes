"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface UserLocation {
  latitud: number;
  longitud: number;
  direccion?: string;
  ciudad?: string;
  pais?: string;
}

interface PermissionState {
  canRequest: boolean;
  isBlocked: boolean;
  isPrompt: boolean;
  needsUserInteraction: boolean;
}

const STORAGE_KEY = "user_location";
const EXPIRATION_TIME = 1000 * 60 * 30;

const isSafari = (): boolean => {
  const ua = navigator.userAgent;
  const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(ua);
  const isNotChrome = !ua.includes("Chrome");
  return isSafariBrowser && isNotChrome;
};

const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [permissionStatus, setPermissionStatus] = useState<PermissionState>({
    canRequest: true,
    isBlocked: false,
    isPrompt: true,
    needsUserInteraction: isSafari(),
  });

  const locationRequestedRef = useRef(false);
  const isSafariBrowser = useRef(isSafari());

  const checkSafariPermission = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!isSafariBrowser.current) {
        resolve(true);
        return;
      }

      const timeoutId = setTimeout(() => {
        resolve(false);
      }, 100);

      navigator.geolocation.getCurrentPosition(
        () => {
          clearTimeout(timeoutId);
          resolve(true);
        },
        () => {
          clearTimeout(timeoutId);
          resolve(false);
        },
        { timeout: 100 },
      );
    });
  }, []);

  const checkPermission = useCallback(async () => {
    if (
      !navigator.permissions ||
      !navigator.permissions.query ||
      isSafariBrowser.current
    ) {
      const hasPermission = await checkSafariPermission();
      const state = {
        canRequest: !permissionStatus.isBlocked,
        isBlocked: permissionStatus.isBlocked,
        isPrompt: !hasPermission && !permissionStatus.isBlocked,
        needsUserInteraction: isSafariBrowser.current,
      };
      setPermissionStatus(state);
      return state;
    }

    try {
      const result = await navigator.permissions.query({ name: "geolocation" });

      const state = {
        canRequest: result.state !== "denied",
        isBlocked: result.state === "denied",
        isPrompt: result.state === "prompt",
        needsUserInteraction: false,
      };

      setPermissionStatus(state);

      result.addEventListener("change", () => {
        const newState = {
          canRequest: result.state !== "denied",
          isBlocked: result.state === "denied",
          isPrompt: result.state === "prompt",
          needsUserInteraction: false,
        };
        setPermissionStatus(newState);

        if (result.state === "granted") {
          requestLocation();
        }
      });

      return state;
    } catch (err) {
      return {
        canRequest: true,
        isBlocked: false,
        isPrompt: true,
        needsUserInteraction: isSafariBrowser.current,
      };
    }
  }, [checkSafariPermission, permissionStatus.isBlocked]);

  const requestLocation = useCallback(
    async (byUserInteraction = false) => {
      setLoading(true);
      setError("");

      if (
        isSafariBrowser.current &&
        !byUserInteraction &&
        !locationRequestedRef.current
      ) {
        setError(
          "Para Safari, por favor haz clic en 'Usar mi ubicación' para continuar",
        );
        setLoading(false);
        setPermissionStatus((prev) => ({
          ...prev,
          needsUserInteraction: true,
        }));
        return;
      }

      const permission = await checkPermission();

      if (permission.isBlocked) {
        setError(
          "La ubicación está bloqueada. Por favor, habilítala en Configuración de Safari > Sitios Web > Ubicación",
        );
        setLoading(false);
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 30000,
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const latitud = position.coords.latitude;
            const longitud = position.coords.longitude;

            let ciudad = "";
            let pais = "";
            let direccion = "";

            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000);

              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
                { signal: controller.signal },
              );

              clearTimeout(timeoutId);
              const data = await response.json();

              const resultado = data.results?.[0];
              direccion = resultado?.formatted_address || "";

              resultado?.address_components?.forEach((component: any) => {
                if (
                  component.types.includes("locality") ||
                  component.types.includes("administrative_area_level_2")
                ) {
                  ciudad = component.long_name;
                }
                if (component.types.includes("country")) {
                  pais = component.long_name;
                }
              });
            } catch (geocodeError) {}

            const userLocation: UserLocation = {
              latitud,
              longitud,
              direccion: direccion || `${latitud}, ${longitud}`,
              ciudad:
                ciudad ||
                `${Math.round(latitud * 100) / 100}, ${Math.round(longitud * 100) / 100}`,
              pais: pais || "Ubicación obtenida",
            };

            try {
              localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                  location: userLocation,
                  timestamp: Date.now(),
                }),
              );
            } catch (storageError) {}

            setLocation(userLocation);
            setError("");
            locationRequestedRef.current = true;
          } catch (err) {
            const userLocation: UserLocation = {
              latitud: position.coords.latitude,
              longitud: position.coords.longitude,
              ciudad: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
              pais: "Coordenadas obtenidas",
            };
            setLocation(userLocation);
            setError("Ubicación obtenida correctamente");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError(
                "Permiso denegado. En Safari: Ve a Configuración > Safari > Ubicación > Permitir",
              );
              setPermissionStatus((prev) => ({
                ...prev,
                isBlocked: true,
                canRequest: false,
              }));
              break;
            case err.POSITION_UNAVAILABLE:
              setError(
                "Ubicación no disponible. Verifica que los servicios de ubicación estén activados en Sistema > Privacidad > Ubicación",
              );
              break;
            case err.TIMEOUT:
              setError(
                "Tiempo de espera agotado. Intenta nuevamente o verifica tu conexión",
              );
              break;
            default:
              setError(`Error: ${err.message}. Intenta nuevamente`);
          }

          setLoading(false);
        },
        options,
      );
    },
    [checkPermission, permissionStatus.isBlocked],
  );

  const retryLocation = useCallback(() => {
    setError("");
    requestLocation(true);
  }, [requestLocation]);

  useEffect(() => {
    const cachedLocation = localStorage.getItem(STORAGE_KEY);
    const hasCachedValidLocation = (() => {
      if (!cachedLocation) return false;

      try {
        const parsed = JSON.parse(cachedLocation);
        const isValid = Date.now() - parsed.timestamp < EXPIRATION_TIME;

        if (isValid) {
          setLocation(parsed.location);
          setLoading(false);
          return true;
        }

        localStorage.removeItem(STORAGE_KEY);
        return false;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        return false;
      }
    })();

    if (!hasCachedValidLocation && !isSafariBrowser.current) {
      const timer = setTimeout(() => {
        requestLocation(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!hasCachedValidLocation && isSafariBrowser.current) {
      setLoading(false);
      setError("Para continuar, permite el acceso a tu ubicación");
      setPermissionStatus((prev) => ({ ...prev, needsUserInteraction: true }));
    }
  }, [requestLocation]);

  return {
    location,
    loading,
    error,
    permissionStatus,
    retryLocation,
    requestLocation: () => requestLocation(true),
  };
};

export default useUserLocation;
