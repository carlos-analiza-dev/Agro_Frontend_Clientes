import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Truck,
  Store,
  Navigation,
  Search,
  Loader2,
} from "lucide-react";
import { TipoEntrega } from "@/api/pedidos/interface/crear-pedido.interface";
import { Cliente } from "@/interfaces/auth/cliente";
import { toast } from "react-toastify";

declare global {
  interface Window {
    google: any;
    googleMapsLoaded?: boolean;
  }
}

const MapComponent = ({
  onLocationSelect,
  initialLocation,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation: { lat: number; lng: number };
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: initialLocation,
      zoom: 13,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });

    markerRef.current = new window.google.maps.Marker({
      position: initialLocation,
      map: mapInstanceRef.current,
      draggable: true,
      title: "Ubicación de entrega",
    });

    markerRef.current.addListener("dragend", () => {
      const position = markerRef.current?.getPosition();
      if (position) {
        onLocationSelect(position.lat(), position.lng());
      }
    });

    mapInstanceRef.current.addListener("click", (event: any) => {
      if (event.latLng && markerRef.current) {
        markerRef.current.setPosition(event.latLng);
        onLocationSelect(event.latLng.lat(), event.latLng.lng());
      }
    });
  }, [onLocationSelect, initialLocation]);

  return <div ref={mapRef} className="w-full h-64 rounded-lg" />;
};

const GoogleMapsWrapper = ({
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

interface Finca {
  id: string;
  nombre_finca: string;
  ubicacion: string;
  latitud: number;
  longitud: number;
}

interface SeleccionUbicacionProps {
  fincas?: Finca[];
  onUbicacionSeleccionada: (ubicacion: {
    tipo: "finca" | "sucursal" | "otra";
    fincaId?: string;
    tipoEntrega: TipoEntrega;
    costoDelivery?: number;
    direccion_entrega?: string;
    latitud?: number;
    longitud?: number;
    nombre_finca?: string;
  }) => void;
  cliente: Cliente | undefined;
}

const SeleccionUbicacion = ({
  fincas = [],
  onUbicacionSeleccionada,
  cliente,
}: SeleccionUbicacionProps) => {
  const hasFincas = fincas && fincas.length > 0;

  const getInitialTipoUbicacion = (): "finca" | "sucursal" | "otra" => {
    if (hasFincas) {
      return "finca";
    }
    return "otra";
  };

  const [tipoUbicacion, setTipoUbicacion] = useState<
    "finca" | "sucursal" | "otra"
  >(getInitialTipoUbicacion());
  const [fincaSeleccionada, setFincaSeleccionada] = useState<string>(
    fincas[0]?.id || "",
  );
  const simbolo = cliente?.pais.simbolo_moneda;
  const [direccionPersonalizada, setDireccionPersonalizada] = useState("");
  const [latitudPersonalizada, setLatitudPersonalizada] = useState("14.0818");
  const [longitudPersonalizada, setLongitudPersonalizada] =
    useState("-87.2068");
  const [buscandoDireccion, setBuscandoDireccion] = useState(false);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  const costoDelivery = cliente?.pais.simbolo_moneda === "$" ? 5.0 : 100.0;

  useEffect(() => {
    if (!hasFincas && tipoUbicacion === "finca") {
      setTipoUbicacion("otra");
    }
  }, [hasFincas, tipoUbicacion]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitudPersonalizada(lat.toString());
    setLongitudPersonalizada(lng.toString());
    reverseGeocode(lat, lng);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!window.google) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(lat, lng);

      geocoder.geocode(
        { location: latLng },
        (results: any[], status: string) => {
          if (status === "OK" && results && results[0]) {
            setDireccionPersonalizada(results[0].formatted_address);
          }
        },
      );
    } catch (error) {
      toast.error("Ocurrio un error");
    }
  };

  const buscarDireccion = async () => {
    if (!direccionPersonalizada.trim() || !window.google) return;

    setBuscandoDireccion(true);
    try {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode(
        { address: direccionPersonalizada },
        (results: any[], status: string) => {
          setBuscandoDireccion(false);

          if (status === "OK" && results && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            setLatitudPersonalizada(lat.toString());
            setLongitudPersonalizada(lng.toString());
            setDireccionPersonalizada(results[0].formatted_address);
          } else {
            toast.warning(
              "No se pudo encontrar la dirección. Intenta con una descripción más específica.",
            );
          }
        },
      );
    } catch (error) {
      setBuscandoDireccion(false);
      toast.error("Error al buscar dirección");
    }
  };

  const obtenerUbicacionActual = () => {
    if (!navigator.geolocation) {
      toast.warn("La geolocalización no es compatible con este navegador");
      return;
    }

    setCargandoUbicacion(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitudPersonalizada(lat.toString());
        setLongitudPersonalizada(lng.toString());
        reverseGeocode(lat, lng);
        setCargandoUbicacion(false);
      },
      (error) => {
        setCargandoUbicacion(false);
        toast.warning("Error al obtener la ubicación: " + error.message);
      },
    );
  };

  const handleConfirmar = () => {
    if (tipoUbicacion === "finca" && !fincaSeleccionada) {
      toast.warning("Por favor selecciona una finca");
      return;
    }

    if (tipoUbicacion === "otra") {
      if (!direccionPersonalizada.trim()) {
        toast.warning("Por favor ingresa una dirección");
        return;
      }
      if (!latitudPersonalizada || !longitudPersonalizada) {
        toast.warning("Por favor selecciona una ubicación en el mapa");
        return;
      }
    }

    const tipoEntrega =
      tipoUbicacion === "sucursal" ? TipoEntrega.RECOGER : TipoEntrega.DELIVERY;
    const costo = tipoUbicacion === "sucursal" ? 0 : costoDelivery;

    let ubicacionData;

    switch (tipoUbicacion) {
      case "finca":
        const fincaData = fincas.find((f) => f.id === fincaSeleccionada);
        ubicacionData = {
          tipo: tipoUbicacion,
          fincaId: fincaSeleccionada,
          tipoEntrega,
          costoDelivery: costo,
          direccion_entrega: fincaData?.ubicacion,
          latitud: fincaData?.latitud,
          longitud: fincaData?.longitud,
          nombre_finca: fincaData?.nombre_finca,
        };
        break;

      case "sucursal":
        ubicacionData = {
          tipo: tipoUbicacion,
          tipoEntrega,
          costoDelivery: costo,
          direccion_entrega: "Recoger en sucursal",
        };
        break;

      case "otra":
        ubicacionData = {
          tipo: tipoUbicacion,
          tipoEntrega,
          costoDelivery: costo,
          direccion_entrega: direccionPersonalizada,
          latitud: parseFloat(latitudPersonalizada),
          longitud: parseFloat(longitudPersonalizada),
          nombre_finca: "Ubicación personalizada",
        };
        break;
    }

    onUbicacionSeleccionada(ubicacionData);
  };

  const initialLocation = {
    lat: parseFloat(latitudPersonalizada) || 14.0818,
    lng: parseFloat(longitudPersonalizada) || -87.2068,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Ubicación de Entrega
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Tipo de Ubicación</Label>
          <RadioGroup
            value={tipoUbicacion}
            onValueChange={(value: "finca" | "sucursal" | "otra") =>
              setTipoUbicacion(value)
            }
          >
            {hasFincas && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="finca" id="finca" />
                <Label htmlFor="finca" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Enviar a una de mis fincas
                  <span className="text-orange-600 text-sm ml-2">
                    +{simbolo}
                    {costoDelivery.toFixed(2)} delivery
                  </span>
                </Label>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sucursal" id="sucursal" />
              <Label htmlFor="sucursal" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Recoger en sucursal
                <span className="text-green-600 text-sm ml-2">Gratis</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="otra" id="otra" />
              <Label htmlFor="otra" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Otra ubicación
                <span className="text-orange-600 text-sm ml-2">
                  +{simbolo}
                  {costoDelivery.toFixed(2)} delivery
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {!hasFincas && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">
                No tienes fincas registradas
              </span>
            </div>
            <p className="text-blue-600 text-xs mt-1">
              Puedes agregar una finca en tu perfil para recibir envíos a tus
              fincas registradas.
            </p>
          </div>
        )}

        {tipoUbicacion === "finca" && hasFincas && (
          <div className="space-y-3">
            <Label>Selecciona una finca para delivery</Label>
            <RadioGroup
              value={fincaSeleccionada}
              onValueChange={setFincaSeleccionada}
            >
              {fincas.map((finca) => (
                <div
                  key={finca.id}
                  className="flex items-center space-x-2 border p-3 rounded-lg"
                >
                  <RadioGroupItem value={finca.id} id={`finca-${finca.id}`} />
                  <Label
                    htmlFor={`finca-${finca.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{finca.nombre_finca}</div>
                    <div className="text-sm text-gray-600">
                      {finca.ubicacion}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Lat: {finca.latitud.toFixed(6)}, Lng:{" "}
                      {finca.longitud.toFixed(6)}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800">
                <Truck className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Delivery incluido: {simbolo}
                  {costoDelivery.toFixed(2)}
                </span>
              </div>
              <p className="text-blue-600 text-xs mt-1">
                El producto será entregado en la finca seleccionada con sus
                coordenadas GPS
              </p>
            </div>
          </div>
        )}

        {tipoUbicacion === "otra" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="direccion">Buscar dirección</Label>
              <div className="flex gap-2">
                <Input
                  id="direccion"
                  value={direccionPersonalizada}
                  onChange={(e) => setDireccionPersonalizada(e.target.value)}
                  placeholder="Ingresa una dirección..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && buscarDireccion()}
                />
                <Button
                  onClick={buscarDireccion}
                  disabled={buscandoDireccion || !direccionPersonalizada.trim()}
                  size="sm"
                >
                  {buscandoDireccion ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Selecciona la ubicación en el mapa</Label>
              <GoogleMapsWrapper
                onLocationSelect={handleLocationSelect}
                initialLocation={initialLocation}
              />
              <p className="text-xs text-gray-600">
                Haz click en el mapa o arrastra el marcador para seleccionar la
                ubicación exacta
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitud">Latitud</Label>
                <Input
                  id="latitud"
                  type="number"
                  step="any"
                  value={latitudPersonalizada}
                  onChange={(e) => setLatitudPersonalizada(e.target.value)}
                  placeholder="Latitud"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitud">Longitud</Label>
                <Input
                  id="longitud"
                  type="number"
                  step="any"
                  value={longitudPersonalizada}
                  onChange={(e) => setLongitudPersonalizada(e.target.value)}
                  placeholder="Longitud"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={obtenerUbicacionActual}
              disabled={cargandoUbicacion}
              className="w-full"
            >
              {cargandoUbicacion ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Navigation className="h-4 w-4 mr-2" />
              )}
              {cargandoUbicacion
                ? "Obteniendo ubicación..."
                : "Usar mi ubicación actual"}
            </Button>

            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 text-orange-800">
                <Truck className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Delivery incluido: {simbolo}
                  {costoDelivery.toFixed(2)}
                </span>
              </div>
              <p className="text-orange-600 text-xs mt-1">
                El producto será entregado en la ubicación especificada en el
                mapa
              </p>
            </div>
          </div>
        )}

        {tipoUbicacion === "sucursal" && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <Store className="h-4 w-4" />
              <span className="text-sm font-medium">
                Recogida en sucursal sin costo adicional
              </span>
            </div>
            <p className="text-green-600 text-xs mt-1">
              Podrás recoger tu pedido en la sucursal más cercana
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Resumen de Entrega</Label>
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="font-medium">Tipo de entrega:</span>
              <span
                className={`font-bold ${
                  tipoUbicacion === "sucursal"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {tipoUbicacion === "finca"
                  ? "Delivery a Finca"
                  : tipoUbicacion === "otra"
                    ? "Delivery a Ubicación"
                    : "Recoger en Sucursal"}
              </span>
            </div>

            {tipoUbicacion === "finca" && fincaSeleccionada && hasFincas && (
              <>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium">Finca:</span>
                  <span className="text-sm text-right">
                    {
                      fincas.find((f) => f.id === fincaSeleccionada)
                        ?.nombre_finca
                    }
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  {fincas.find((f) => f.id === fincaSeleccionada)?.ubicacion}
                </div>
              </>
            )}

            {tipoUbicacion === "otra" && direccionPersonalizada && (
              <>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium">Dirección:</span>
                  <span className="text-sm text-right">
                    Ubicación personalizada
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  {direccionPersonalizada}
                </div>
              </>
            )}

            <div className="flex justify-between items-center mt-2">
              <span className="font-medium">Costo de envío:</span>
              <span
                className={`font-bold ${
                  tipoUbicacion === "sucursal"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {tipoUbicacion === "sucursal"
                  ? "Gratis"
                  : `+${simbolo}${costoDelivery.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        <Button onClick={handleConfirmar} className="w-full">
          Confirmar Ubicación y Entrega
        </Button>
      </CardContent>
    </Card>
  );
};

export default SeleccionUbicacion;
