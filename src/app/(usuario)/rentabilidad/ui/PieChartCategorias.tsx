import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COLORS_RENTABILIDAD } from "@/helpers/data/rentabilidad_colors";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  title: string;
  data: any[];
  tipo: "ingreso" | "gasto";
  moneda?: string;
}

const PieChartCategorias = ({
  title,
  data = [],
  tipo,
  moneda = "$",
}: Props) => {
  const filteredData = data.filter((c) => c.tipo === tipo);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg md:text-xl">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[280px] sm:h-[320px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                dataKey="monto"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                outerRadius={window.innerWidth < 640 ? 80 : 120}
                labelLine={false}
                label={({ porcentaje }) =>
                  window.innerWidth >= 640 ? `${porcentaje.toFixed(1)}%` : ""
                }
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      COLORS_RENTABILIDAD.categories[
                        index % COLORS_RENTABILIDAD.categories.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value: number) => [
                  `${moneda}${value.toLocaleString()}`,
                  "Monto",
                ]}
              />

              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-2 sm:hidden">
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS_RENTABILIDAD.categories[
                        index % COLORS_RENTABILIDAD.categories.length
                      ],
                  }}
                />
                {item.categoria}
              </div>

              <div className="text-gray-600">
                {moneda}
                {item.monto.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChartCategorias;
