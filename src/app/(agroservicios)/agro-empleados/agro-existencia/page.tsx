"use client";
import TableExistencia from "@/components/agroservicio/existencias/TableExistencia";
import SkeletonTable from "@/components/generics/SkeletonTable";
import TitlePage from "@/components/generics/TitlePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import useGetExistenciaProductos from "@/hooks/agroservicios/existencias/useGetExistenciaProductos";
import useGetSucursalByEmpleado from "@/hooks/agroservicios/sucursales/useGetSucursalByEmpleado";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import { AlertCircle, Filter, Search, Warehouse } from "lucide-react";
import { useMemo, useState } from "react";

const ExistenciaProductosPage = () => {
  const { empleado } = useAuthEmpleadoStore();
  const propietarioId = empleado?.agroservicio.propietario.id ?? "";
  const [selectedProducto, setSelectedProducto] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const productoId = selectedProducto === "all" ? "" : selectedProducto;
  const { data: sucursal } = useGetSucursalByEmpleado();
  const { data: existencia_productos, isLoading } = useGetExistenciaProductos(
    propietarioId,
    { producto: productoId, sucursal: sucursal?.id },
  );

  const productosUnicos = useMemo(() => {
    if (!existencia_productos) return [];

    const productosMap = new Map();
    existencia_productos.forEach((item) => {
      if (!productosMap.has(item.productoId)) {
        productosMap.set(item.productoId, {
          id: item.productoId,
          nombre: item.productoNombre,
        });
      }
    });
    return Array.from(productosMap.values());
  }, [existencia_productos]);

  const filteredData = useMemo(() => {
    if (!existencia_productos) return [];

    if (!searchTerm.trim()) return existencia_productos;

    const searchLower = searchTerm.toLowerCase().trim();
    return existencia_productos.filter(
      (item) =>
        item.productoNombre.toLowerCase().includes(searchLower) ||
        item.sucursalNombre.toLowerCase().includes(searchLower) ||
        item.productoId.toLowerCase().includes(searchLower),
    );
  }, [existencia_productos, searchTerm]);

  const totalExistencia = useMemo(() => {
    return filteredData.reduce(
      (total, item) => total + parseFloat(item.existenciaTotal || "0"),
      0,
    );
  }, [filteredData]);

  const totalRegistros = existencia_productos?.length || 0;

  const handleClearFilters = () => {
    setSelectedProducto("all");

    setSearchTerm("");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" || selectedProducto !== "all";

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="mt-5 mb-5">
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="mt-5 mb-5">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="mt-12">
          <SkeletonTable />
          <div className="mt-2">
            <SkeletonTable />
          </div>
        </div>
      </div>
    );
  }

  if (existencia_productos?.length === 0) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          No se encontraron resultados
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          {hasActiveFilters
            ? "No hay productos que coincidan con los filtros seleccionados. Intenta ajustar tu búsqueda."
            : "No hay datos de existencia disponibles para este propietario."}
        </p>
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="mt-4"
          >
            <Filter className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TitlePage Icon={Warehouse} title="Existencia de Productos" />
        {!isLoading && totalRegistros > 0 && (
          <div className="text-sm bg-primary/10 px-4 py-2 rounded-full">
            Total:{" "}
            <span className="font-bold text-primary">
              {totalExistencia.toFixed(2)}
            </span>{" "}
            unidades
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar producto o sucursal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={selectedProducto}
              onValueChange={setSelectedProducto}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por producto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los productos</SelectItem>
                {productosUnicos.map((producto) => (
                  <SelectItem key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className="w-full md:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <TableExistencia filteredData={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExistenciaProductosPage;
