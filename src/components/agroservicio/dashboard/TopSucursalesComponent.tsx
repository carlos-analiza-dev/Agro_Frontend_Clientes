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
import { Building2, Store, Award, MapPin } from "lucide-react";
import { ResponseMejoresSucursales } from "@/api/agroservicio/dashboard/interface/response-sucursal-mas-ventas.interface";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";

interface TopSucursalesProps {
  data: ResponseMejoresSucursales[];
  isLoading: boolean;
  title?: string;
  description?: string;
  moneda: string;
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#FF8A5C",
  "#A29BFE",
  "#FD79A8",
  "#00CEC9",
];

const TopSucursalesComponent = ({
  data,
  isLoading,
  title = "Top Sucursales",
  description = "Ranking de sucursales con mayores ventas",
  moneda,
}: TopSucursalesProps) => {
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
            <p className="mt-4 text-gray-600">Cargando sucursales...</p>
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
            <Store className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No hay sucursales registradas</p>
            <p className="text-sm">
              Las sucursales aparecerán aquí cuando realicen ventas
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalFacturas = data.reduce(
    (sum, item) => sum + item.cantidadFacturas,
    0,
  );
  const totalVentasGlobal = data.reduce(
    (sum, item) => sum + item.totalVentas,
    0,
  );

  const chartData = data.map((item, index) => ({
    ...item,
    porcentajeFacturas:
      totalFacturas > 0
        ? ((item.cantidadFacturas / totalFacturas) * 100).toFixed(1)
        : "0",
    porcentajeVentas:
      totalVentasGlobal > 0
        ? ((item.totalVentas / totalVentasGlobal) * 100).toFixed(1)
        : "0",
    index,
  }));

  const getMedal = (index: number) => {
    if (index === 0) return <Award className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Award className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-bold text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            {data.sucursal}
          </p>
          <p className="text-sm text-gray-600">
            Total Ventas: {formatCurrency(data.totalVentas, moneda)}
          </p>
          <p className="text-sm text-gray-600">
            Facturas: {data.cantidadFacturas}
          </p>
          <p className="text-sm text-gray-600">
            Participación: {data.porcentajeVentas}%
          </p>
        </div>
      );
    }
    return null;
  };

  const pieData = chartData.map((item) => ({
    name: item.sucursal,
    value: item.totalVentas,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Store className="h-3 w-3" />
            {data.length} sucursales
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
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(value) => formatCurrency(value, moneda)}
                />
                <YAxis
                  type="category"
                  dataKey="sucursal"
                  tick={{ fontSize: 12 }}
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="totalVentas"
                  fill="#4ECDC4"
                  name="Total Ventas"
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
          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead className="text-right">Facturas</TableHead>
                  <TableHead className="text-right">Total Ventas</TableHead>
                  <TableHead className="text-right">Ticket Promedio</TableHead>
                  <TableHead className="text-right">% Ventas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map((item, index) => (
                  <TableRow key={item.sucursalId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center justify-center">
                        {getMedal(index) || (
                          <Badge
                            variant="secondary"
                            className="w-6 h-6 rounded-full flex items-center justify-center p-0"
                          >
                            {index + 1}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="font-medium">{item.sucursal}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono">
                        {item.cantidadFacturas}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {formatCurrency(item.totalVentas, moneda)}
                    </TableCell>
                    <TableCell className="text-right text-blue-600">
                      {formatCurrency(
                        item.totalVentas / item.cantidadFacturas,
                        moneda,
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${item.porcentajeVentas}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12">
                          {item.porcentajeVentas}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Sucursales</p>
            <p className="text-xl font-bold">{data.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Facturas</p>
            <p className="text-xl font-bold">{totalFacturas}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Ventas</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(totalVentasGlobal, moneda)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Sucursal Líder</p>
            <p className="text-xl font-bold truncate" title={data[0]?.sucursal}>
              {data[0]?.sucursal || "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopSucursalesComponent;
