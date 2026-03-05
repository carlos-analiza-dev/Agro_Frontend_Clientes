// components/control-peso/ui/CardRazas.tsx
import { ResponsePesoByRaza } from "@/api/peso-promedio-animal/interfaces/obtener-pesos-by-raza.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/helpers/funciones/formatDate";
import { Calendar, Scale, TrendingUp, Pencil, ArrowRight } from "lucide-react";

interface Props {
  item: ResponsePesoByRaza;
  onEdit: (item: ResponsePesoByRaza) => void;
}

const CardRazas = ({ item, onEdit }: Props) => {
  const formatNumber = (value: string) => {
    return parseFloat(value).toFixed(2);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow relative group">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              {item.raza.nombre}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {item.raza.abreviatura}
            </p>
          </div>
          <div className="bg-blue-100 p-2 rounded-full">
            <Scale className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Ganancia mínima:</span>
            </div>
            <span className="font-semibold text-green-600">
              {formatNumber(item.gananciaMinima)} lb
            </span>
          </div>

          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Ganancia máxima:</span>
            </div>
            <span className="font-semibold text-blue-600">
              {formatNumber(item.gananciaMaxima)} lb
            </span>
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Rango de ganancia</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {formatNumber(item.gananciaMinima)} lb
              </span>
              <span className="text-xs text-gray-400">
                <ArrowRight />
              </span>
              <span className="text-sm font-medium">
                {formatNumber(item.gananciaMaxima)} lb
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 border-t pt-2">
            <Calendar className="h-3 w-3" />
            <span>Actualizado: {formatDate(item.updatedAt)}</span>
          </div>
        </div>
      </CardContent>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onEdit(item)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </Card>
  );
};

export default CardRazas;
