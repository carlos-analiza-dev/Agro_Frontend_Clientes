import { ResponseRangoEdad } from "@/api/peso-promedio-animal/interfaces/calcular-rango-peso.interface";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import React from "react";

interface Props {
  pesoPromedio: number;
  pesos: ResponseRangoEdad;
}

const ResumenCalc = ({ pesoPromedio, pesos }: Props) => {
  return (
    <Card className="bg-gradient-to-br from-gray-50 to-white">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Resumen del cálculo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-xs text-gray-500 mb-1">Peso promedio</p>
            <p className="text-xl font-bold text-gray-800">{pesoPromedio} Kg</p>
            <p className="text-xs text-gray-400 mt-1">
              Estimado para la edad consultada
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <p className="text-xs text-gray-500 mb-1">Rango de edad</p>
            <p className="text-xl font-bold text-gray-800">{pesos.rangoEdad}</p>
            <p className="text-xs text-gray-400 mt-1">
              Categoría de referencia
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumenCalc;
