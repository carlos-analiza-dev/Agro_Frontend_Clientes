import { Parto } from "@/api/reproduccion/interfaces/response-partos.interface";
import { MessageError } from "@/components/generics/MessageError";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEstadoBadge } from "@/helpers/funciones/obtenerEstadoParto";
import { getTipoPartoLabel } from "@/helpers/funciones/tipoParto";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Baby,
  CalendarDays,
  Droplets,
  MapPin,
  Scissors,
  Syringe,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  partosFiltrados: Parto[] | undefined;
  isLoading: boolean;
  handleRefresh: () => Promise<void>;
  isMobile: boolean;
}

const CardMobile = ({ partosFiltrados, isLoading, handleRefresh }: Props) => {
  const formatearFecha = (fecha: string | Date) => {
    const fechaObj = new Date(fecha);
    return format(fechaObj, "dd/MM/yyyy", { locale: es });
  };
  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2">Cargando partos...</span>
        </div>
      )}

      {!isLoading && (!partosFiltrados || partosFiltrados.length === 0) && (
        <MessageError
          titulo="No se encontraron partos disponibles en este momento"
          descripcion="En este momento no cuentas con partos disponibles de tus animales, por favor ingresa un parto"
          onPress={() => handleRefresh()}
        />
      )}

      {partosFiltrados?.map((parto) => {
        const estadoBadge = getEstadoBadge(parto.estado);
        return (
          <Card key={parto.id} className="overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold text-base">
                      {parto.hembra.identificador}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{parto.hembra.finca.nombre_finca}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={estadoBadge.variant} className="text-xs">
                    {estadoBadge.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getTipoPartoLabel(parto.tipo_parto)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm border-t border-gray-100 pt-2">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Fecha del parto:</span>
                <span className="font-medium">
                  {formatearFecha(parto.fecha_parto)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Baby className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-500">Crías</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-green-600" />
                    <span className="font-medium text-sm">
                      {parto.numero_crias_vivas}
                    </span>
                    <span className="text-gray-400 text-xs">vivas</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-red-500 text-sm">
                      {parto.numero_crias_muertas}
                    </span>
                    <span className="text-gray-400 text-xs">muertas</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Total: {parto.numero_crias}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Scissors className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-500">Gestación</span>
                  </div>
                  <div className="text-sm font-medium">
                    {parto.dias_gestacion} días
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {Math.floor(parto.dias_gestacion / 7)} semanas
                  </div>
                </div>
              </div>

              {parto.veterinario_responsable && (
                <div className="flex items-center gap-2 text-sm pt-1">
                  <Syringe className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Veterinario:</span>
                  <span className="font-medium text-sm truncate">
                    {parto.veterinario_responsable}
                  </span>
                </div>
              )}

              {parto.crias && parto.crias.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Detalle de crías:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {parto.crias.map((cria, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {cria.sexo === "MACHO" ? "♂" : "♀"} {cria.peso}kg
                        {cria.estado === "VIVA" ? " ✓" : " ✗"}
                        {cria.identificador && ` (${cria.identificador})`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {parto.observaciones && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Observaciones:
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {parto.observaciones}
                  </p>
                </div>
              )}

              {parto.complicaciones && parto.complicaciones !== "Ninguna" && (
                <div className="mt-2 pt-2 border-t border-red-100 bg-red-50 rounded-lg p-2">
                  <p className="text-xs font-medium text-red-700 mb-1">
                    ⚠️ Complicaciones:
                  </p>
                  <p className="text-xs text-red-600">{parto.complicaciones}</p>
                  {parto.atencion_veterinaria && (
                    <p className="text-xs text-red-600 mt-1">
                      Atención: {parto.atencion_veterinaria}
                    </p>
                  )}
                </div>
              )}
              <div className="mt-3 flex justify-end">
                <Link href={`/partos-animales/${parto.id}`}>
                  <Button variant={"ghost"}>Editar</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CardMobile;
