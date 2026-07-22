"use client";
import {
  ShoppingBag,
  Truck,
  Warehouse,
  Package,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statsData = [
  {
    title: "Ventas Totales",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Pedidos Pendientes",
    value: "12",
    change: "-2.5%",
    trend: "down",
    icon: Package,
  },
  {
    title: "Productos en Stock",
    value: "1,234",
    change: "+5.4%",
    trend: "up",
    icon: Warehouse,
  },
  {
    title: "Empleados Activos",
    value: "89",
    change: "+12.3%",
    trend: "up",
    icon: Users,
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    cliente: "Juan Pérez",
    total: "$156.00",
    estado: "Completado",
    fecha: "2024-01-15",
  },
  {
    id: "ORD-002",
    cliente: "María García",
    total: "$89.50",
    estado: "Pendiente",
    fecha: "2024-01-15",
  },
  {
    id: "ORD-003",
    cliente: "Carlos López",
    total: "$234.00",
    estado: "En Proceso",
    fecha: "2024-01-14",
  },
  {
    id: "ORD-004",
    cliente: "Ana Martínez",
    total: "$67.25",
    estado: "Completado",
    fecha: "2024-01-14",
  },
];

const lowStockProducts = [
  {
    name: "Alimento para Perros",
    stock: 5,
    maxStock: 50,
    category: "Alimentos",
  },
  {
    name: "Vacuna Antirrábica",
    stock: 3,
    maxStock: 20,
    category: "Veterinaria",
  },
  {
    name: "Collar Antipulgas",
    stock: 8,
    maxStock: 30,
    category: "Accesorios",
  },
];

const AgroservicioPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido de vuelta, aquí está tu resumen de agroservicio
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === "up";
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          const trendColor = isPositive ? "text-green-600" : "text-red-600";

          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`flex items-center text-xs ${trendColor}`}>
                  <TrendIcon className="mr-1 h-3 w-3" />
                  {stat.change} desde el mes pasado
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pedidos Recientes</span>
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => {
                  let statusColor;
                  let StatusIcon;

                  switch (order.estado) {
                    case "Completado":
                      statusColor = "bg-green-100 text-green-800";
                      StatusIcon = CheckCircle;
                      break;
                    case "Pendiente":
                      statusColor = "bg-yellow-100 text-yellow-800";
                      StatusIcon = Clock;
                      break;
                    case "En Proceso":
                      statusColor = "bg-blue-100 text-blue-800";
                      StatusIcon = AlertCircle;
                      break;
                    default:
                      statusColor = "bg-gray-100 text-gray-800";
                      StatusIcon = Clock;
                  }

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.cliente}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <Badge className={`${statusColor} border-none`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {order.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.fecha}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Stock Bajo</span>
              <Badge variant="destructive">¡Atención!</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => {
                const stockPercentage =
                  (product.stock / product.maxStock) * 100;
                const isCritical = stockPercentage < 20;
                const isWarning = stockPercentage < 40;

                let progressColor;
                if (isCritical) progressColor = "bg-red-500";
                else if (isWarning) progressColor = "bg-yellow-500";
                else progressColor = "bg-green-500";

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{product.stock} unidades</p>
                        <p className="text-xs text-muted-foreground">
                          Máx: {product.maxStock}
                        </p>
                      </div>
                    </div>

                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${progressColor}`}
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                      />
                    </div>
                    {isCritical && (
                      <p className="text-xs text-red-500 flex items-center">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Stock crítico, reabastecer pronto
                      </p>
                    )}
                    {isWarning && !isCritical && (
                      <p className="text-xs text-yellow-500 flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        Stock bajo, considerar reabastecimiento
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium">Nuevo Producto</h4>
              <p className="text-sm text-muted-foreground">
                Agregar al inventario
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">Nuevo Empleado</h4>
              <p className="text-sm text-muted-foreground">
                Registrar empleado
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium">Nuevo Proveedor</h4>
              <p className="text-sm text-muted-foreground">Agregar proveedor</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium">Nueva Factura</h4>
              <p className="text-sm text-muted-foreground">Generar factura</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgroservicioPage;
