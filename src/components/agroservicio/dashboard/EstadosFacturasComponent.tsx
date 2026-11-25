"use client";

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
import { FileText, CheckCircle, XCircle } from "lucide-react";
import { ResponseEstadosFactura } from "@/api/agroservicio/dashboard/interface/response-estados-factura.interface";
import { useTranslations } from "next-intl";

export enum EstadoFactura {
  EMITIDA = "Emitida",
  PROCESADA = "Procesada",
  CANCELADA = "Cancelada",
}

interface EstadosFacturasProps {
  data: ResponseEstadosFactura[];
  isLoading: boolean;
  title?: string;
  description?: string;
}

const ESTADO_COLORS: Record<string, string> = {
  Emitida: "#FFA500",
  Procesada: "#4CAF50",
  Cancelada: "#F44336",
};

const ESTADO_ICONS: Record<string, any> = {
  Emitida: FileText,
  Procesada: CheckCircle,
  Cancelada: XCircle,
};

const ESTADO_BADGE: Record<string, string> = {
  Emitida: "warning",
  Procesada: "success",
  Cancelada: "destructive",
};

const EstadosFacturasComponent = ({
  data,
  isLoading,
  title,
  description,
}: EstadosFacturasProps) => {
  const t = useTranslations("estadosFacturasComponent");

  const titulo = title ?? t("title");
  const descripcion = description ?? t("description");

  const getEstadoTranslation = (estado: string) => {
    const estadoMap: Record<string, string> = {
      Emitida: "statuses.issued",
      Procesada: "statuses.processed",
      Cancelada: "statuses.cancelled",
    };

    const key = estadoMap[estado];

    return key && t.has(key) ? t(key) : estado;
  };

  const getEstadoDescription = (estado: string) => {
    const descriptionMap: Record<string, string> = {
      Emitida: "statusDescriptions.issued",
      Procesada: "statusDescriptions.processed",
      Cancelada: "statusDescriptions.cancelled",
    };

    const key = descriptionMap[estado];

    return key && t.has(key) ? t(key) : t("statusDescriptions.default");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{titulo}</CardTitle>
          <CardDescription>{descripcion}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t("loading")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{titulo}</CardTitle>
          <CardDescription>{descripcion}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>{t("empty.title")}</p>
            <p className="text-sm">{t("empty.description")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalFacturas = data.reduce((sum, item) => sum + item.cantidad, 0);

  const chartData = data.map((item) => ({
    ...item,
    porcentaje:
      totalFacturas > 0
        ? ((item.cantidad / totalFacturas) * 100).toFixed(1)
        : "0",
    color: ESTADO_COLORS[item.estado] || "#8884d8",
    icon: ESTADO_ICONS[item.estado] || FileText,
    badge: ESTADO_BADGE[item.estado] || "default",
    description: getEstadoDescription(item.estado),
    estadoTraducido: getEstadoTranslation(item.estado),
  }));

  const sortedData = [...chartData].sort((a, b) => b.cantidad - a.cantidad);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const Icon = data.icon || FileText;

      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" style={{ color: data.color }} />
            <p className="font-bold text-sm">{data.estadoTraducido}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">{data.description}</p>
          <p className="text-sm text-gray-600 mt-2">
            {t("tooltip.quantity")}: <strong>{data.cantidad}</strong>{" "}
            {t("tooltip.invoices")}
          </p>
          <p className="text-sm text-gray-600">
            {t("tooltip.percentage")}: <strong>{data.porcentaje}%</strong>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {titulo}
            </CardTitle>
            <CardDescription>{descripcion}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {totalFacturas} {t("invoices")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="estadoTraducido" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="cantidad"
                  name={t("invoices")}
                  radius={[4, 4, 0, 0]}
                >
                  {sortedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("table.description")}</TableHead>
                  <TableHead className="text-right">
                    {t("table.quantity")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("table.percentage")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("table.distribution")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedData.map((item) => {
                  const Icon = item.icon;
                  const badgeVariant = item.badge;

                  return (
                    <TableRow key={item.estado}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Icon
                            className="h-4 w-4"
                            style={{ color: item.color }}
                          />
                          <span className="font-medium">
                            {item.estadoTraducido}
                          </span>
                          <Badge variant={badgeVariant as any} className="ml-2">
                            {badgeVariant === "success" && "✓"}
                            {badgeVariant === "destructive" && "✗"}
                            {badgeVariant === "warning" && "!"}
                            {badgeVariant === "default" && "•"}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {item.description}
                        </span>
                      </TableCell>

                      <TableCell className="text-right font-semibold">
                        {item.cantidad}
                      </TableCell>

                      <TableCell className="text-right">
                        <span className="font-medium">{item.porcentaje}%</span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${item.porcentaje}%`,
                                backgroundColor: item.color,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12">
                            {item.porcentaje}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {t("summary.totalInvoices")}
            </p>
            <p className="text-xl font-bold">{totalFacturas}</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              {t("summary.differentStatuses")}
            </p>
            <p className="text-xl font-bold">{data.length}</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              {t("summary.mostFrequentStatus")}
            </p>
            <p
              className="text-xl font-bold truncate"
              title={sortedData[0]?.estadoTraducido}
            >
              {sortedData[0]?.estadoTraducido || "N/A"}
              <span className="text-sm font-normal text-gray-500 ml-1">
                ({sortedData[0]?.porcentaje}%)
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstadosFacturasComponent;
