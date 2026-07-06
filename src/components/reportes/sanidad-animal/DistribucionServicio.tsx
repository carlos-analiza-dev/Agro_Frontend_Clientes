import { COLORS_SANIDAD } from "@/helpers/data/sanidad/tipos_servicios_sanidad";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import React from "react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Tooltip,
  Cell,
} from "recharts";

interface Props {
  datosCostosProcesados: any[];
  moneda: string;
}

const DistribucionServicio = ({ moneda, datosCostosProcesados }: Props) => {
  return (
    <div className="h-[300px]">
      <h4 className="text-sm font-medium mb-2">Distribución por servicio</h4>
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={datosCostosProcesados}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ nombre, percent }) =>
              `${nombre} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884D8"
            dataKey="total"
            nameKey="nombre"
          >
            {datosCostosProcesados.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS_SANIDAD[index % COLORS_SANIDAD.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value, moneda)}
          />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistribucionServicio;
