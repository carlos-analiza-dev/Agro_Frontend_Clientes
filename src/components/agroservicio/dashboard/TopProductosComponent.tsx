import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, ShoppingBag } from "lucide-react";
import { ProductosMasVendidosInterface } from "@/api/agroservicio/dashboard/interface/response-productos-vendidos-agro.interface";

interface TopProductosProps {
  data: ProductosMasVendidosInterface[];
  isLoading: boolean;
  title?: string;
  description?: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
];

const TopProductosComponent = ({
  data,
  isLoading,
  title = "Productos Más Vendidos",
  description = "Ranking de productos con mayor cantidad de ventas",
}: TopProductosProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No hay productos vendidos</p>
            <p className="text-sm">
              Los productos aparecerán aquí cuando se realicen ventas
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalVentas = data.reduce((sum, item) => sum + item.cantidadVendida, 0);

  const chartData = data.map((item, index) => ({
    ...item,
    porcentaje: ((item.cantidadVendida / totalVentas) * 100).toFixed(1),
    index,
  }));

  const maxValue = Math.max(...data.map((item) => item.cantidadVendida));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <ShoppingBag className="h-3 w-3" />
            {data.length} productos
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="producto"
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    const item = props.payload;
                    return [
                      `${value} unidades (${item.porcentaje}%)`,
                      "Cantidad",
                    ];
                  }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Legend />
                <Bar
                  dataKey="cantidadVendida"
                  fill="#0088FE"
                  name="Unidades Vendidas"
                  radius={[0, 4, 4, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Unidades</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map((item, index) => (
                  <TableRow key={item.productoId}>
                    <TableCell className="font-medium">
                      <Badge
                        variant={index === 0 ? "default" : "secondary"}
                        className="w-6 h-6 rounded-full flex items-center justify-center p-0"
                      >
                        {index + 1}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        {item.producto}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {item.cantidadVendida}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${item.porcentaje}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12">
                          {item.porcentaje}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Productos</p>
            <p className="text-xl font-bold">{data.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Unidades</p>
            <p className="text-xl font-bold">{totalVentas}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Producto Top</p>
            <p className="text-xl font-bold truncate" title={data[0]?.producto}>
              {data[0]?.producto || "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProductosComponent;
