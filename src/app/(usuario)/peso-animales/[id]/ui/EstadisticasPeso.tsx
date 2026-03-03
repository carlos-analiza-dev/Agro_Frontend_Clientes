import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus, Calendar } from "lucide-react";

interface Props {
  estadisticas: {
    totalRegistros: number;
    pesoActual: number;
    pesoMinimo: number;
    pesoMaximo: number;
    pesoPromedio: number;
    variacion: number;
    fechaUltimoRegistro: string;
  };
}

const EstadisticasPeso = ({ estadisticas }: Props) => {
  const VariacionIcon =
    estadisticas.variacion > 0
      ? TrendingUp
      : estadisticas.variacion < 0
        ? TrendingDown
        : Minus;

  const variacionColor =
    estadisticas.variacion > 0
      ? "text-green-600"
      : estadisticas.variacion < 0
        ? "text-red-600"
        : "text-gray-600";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Peso Actual</p>
          <p className="text-2xl font-bold">{estadisticas.pesoActual} Kg</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Promedio</p>
          <p className="text-2xl font-bold">{estadisticas.pesoPromedio} Kg</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Rango</p>
          <p className="text-lg font-semibold">
            {estadisticas.pesoMinimo} - {estadisticas.pesoMaximo} Kg
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Último registro
          </p>
          <p className="text-sm font-medium">
            {new Date(estadisticas.fechaUltimoRegistro).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstadisticasPeso;
