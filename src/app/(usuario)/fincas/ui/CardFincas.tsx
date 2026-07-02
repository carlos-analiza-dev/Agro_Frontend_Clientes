"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Box,
  PawPrint,
  Activity,
  MapPinned,
  Trees,
  LandPlot,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import GoogleMapViewer from "@/components/generics/GoogleMapViewer";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { cn } from "@/lib/utils";

interface CardFincasProps {
  finca: Finca;
  onPress: () => void;
}

const CloudBadge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
}) => {
  const variants = {
    default: "bg-green-50/80 text-green-700 border-green-200/50",
    secondary: "bg-gray-50/80 text-gray-600 border-gray-200/50",
    outline:
      "bg-white/50 text-gray-600 border-gray-200/50 hover:border-green-200/50",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm border transition-all duration-200",
        variants[variant],
      )}
    >
      {children}
    </span>
  );
};

const StatusIndicator = ({ isActive }: { isActive: boolean }) => (
  <div className="flex items-center gap-2">
    <div
      className={cn("relative flex h-2.5 w-2.5", isActive && "animate-pulse")}
    >
      <span
        className={cn(
          "absolute inline-flex h-full w-full rounded-full opacity-75",
          isActive ? "bg-green-400" : "bg-gray-300",
        )}
      />
      <span
        className={cn(
          "relative inline-flex rounded-full h-2.5 w-2.5",
          isActive ? "bg-green-500" : "bg-gray-400",
        )}
      />
    </div>
    <span
      className={cn(
        "text-sm font-medium",
        isActive ? "text-green-600" : "text-gray-400",
      )}
    >
      {isActive ? "Activa" : "Inactiva"}
    </span>
  </div>
);

const StatCard = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100/50 transition-all duration-200 hover:bg-white/80 hover:border-green-200/50",
      className,
    )}
  >
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50/80 text-green-600">
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-700">{value}</span>
    </div>
  </div>
);

export const CardFincas = ({ finca, onPress }: CardFincasProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return (
    <div className="mb-6 mx-2">
      <div
        className={cn(
          "transition-all duration-300",
          isPressed ? "scale-[0.98]" : "scale-100",
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onClick={onPress}
      >
        <Card className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 bg-white/80 backdrop-blur-sm border border-white/40">
          <CardHeader className="pb-3 bg-gradient-to-br from-white via-green-50/20 to-white border-b border-gray-100/50">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                {finca.nombre_finca}
              </span>
              <StatusIndicator isActive={finca.isActive} />
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={Activity}
                label="Animales"
                value={finca.cantidad_animales}
              />
              <StatCard
                icon={MapPinned}
                label="Ubicación"
                value={`${finca.municipio.nombre}, ${finca.departamento.nombre}`}
                className="col-span-2"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-gray-50/50 backdrop-blur-sm border border-gray-100/50 text-center transition-all duration-200 hover:bg-green-50/50 hover:border-green-200/50">
                <div className="flex items-center justify-center gap-1 text-gray-500">
                  <LandPlot className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Total</span>
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {finca.tamaño_total} {finca.medida_finca}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50/50 backdrop-blur-sm border border-gray-100/50 text-center transition-all duration-200 hover:bg-green-50/50 hover:border-green-200/50">
                <div className="flex items-center justify-center gap-1 text-gray-500">
                  <Trees className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Ganadería</span>
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {finca.area_ganaderia} {finca.medida_finca}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50/50 backdrop-blur-sm border border-gray-100/50 text-center transition-all duration-200 hover:bg-green-50/50 hover:border-green-200/50 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-center gap-1 text-gray-500">
                  <Box className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Agricultura</span>
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {finca.area_agricola} {finca.medida_finca}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2">
                <Box className="h-3.5 w-3.5" />
                Tipos de Explotación
              </span>
              <div className="flex flex-wrap gap-2">
                {finca.tipo_explotacion.map(({ tipo_explotacion }, index) => (
                  <CloudBadge key={index} variant="outline">
                    {tipo_explotacion}
                  </CloudBadge>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2">
                <PawPrint className="h-3.5 w-3.5" />
                Especies
              </span>
              <div className="flex flex-wrap gap-2">
                {finca.especies_maneja.map(({ especie, cantidad }, index) => (
                  <CloudBadge key={index} variant="secondary">
                    {especie}{" "}
                    <span className="ml-1 text-green-600 font-semibold">
                      {cantidad}
                    </span>
                  </CloudBadge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50/80 text-gray-400">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs text-gray-400">
                Registrada:{" "}
                <span className="text-gray-600 font-medium">
                  {formatDateOnly(finca.fecha_registro)}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50/80 text-green-600">
            <MapPin className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
            Ubicación - {finca.nombre_finca}
          </h3>
          <Badge
            variant="outline"
            className="ml-auto bg-white/50 backdrop-blur-sm border-gray-200/50 text-xs"
          >
            {finca.latitud.toFixed(4)}, {finca.longitud.toFixed(4)}
          </Badge>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-white/40 bg-white/80 backdrop-blur-sm">
          <GoogleMapViewer
            latitud={finca.latitud}
            longitud={finca.longitud}
            titulo={finca.nombre_finca}
            direccion={finca.ubicacion}
            height="h-64"
            showDirectionsButton={true}
            className="w-full"
          />

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
