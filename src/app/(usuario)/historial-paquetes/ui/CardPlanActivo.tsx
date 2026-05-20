import { PaqueteInterface } from "@/api/paquetes/interface/paquete.interface";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";
import {
  getPlanColor,
  getPlanIcon,
} from "@/helpers/funciones/paquetes/get-infos";
import { CheckCircle2, Clock } from "lucide-react";
import React from "react";

interface Props {
  planActivo: PaqueteInterface;
  calcularDuracionDias: (fechaInicio: string, fechaFin: string) => number;
}

const CardPlanActivo = ({ planActivo, calcularDuracionDias }: Props) => {
  return (
    <Card
      className={`overflow-hidden border-2 ${getPlanColor(planActivo.paquete.tipo)} shadow-lg`}
    >
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {getPlanIcon(planActivo.paquete.tipo)}
            <div>
              <CardTitle className="text-2xl font-bold">
                {planActivo.paquete.nombre}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge className="bg-green-500 hover:bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Activo
                </Badge>
                <span className="text-sm">
                  Desde {formatDateLocal(planActivo.fechaInicio)}
                </span>
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Válido hasta</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatDateLocal(planActivo.fechaFin)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Máximo Fincas</div>
            <div className="text-2xl font-bold text-gray-900">
              {planActivo.paquete.maxFincas}
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Máximo Animales</div>
            <div className="text-2xl font-bold text-gray-900">
              {planActivo.paquete.maxAnimales}
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">
              Máximo Trabajadores
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {planActivo.paquete.maxTrabajadores}
            </div>
          </div>
        </div>
        <div className="bg-blue-100/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Clock className="h-4 w-4" />
            <span>
              Duración total:{" "}
              <strong>
                {calcularDuracionDias(
                  planActivo.fechaInicio,
                  planActivo.fechaFin,
                )}{" "}
                días
              </strong>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardPlanActivo;
