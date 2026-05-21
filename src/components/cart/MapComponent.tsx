import { useEffect, useRef } from "react";

export const MapComponent = ({
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
