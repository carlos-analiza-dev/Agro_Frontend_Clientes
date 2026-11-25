"use client";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Truck,
  Search,
  Filter,
  Package,
  Building,
  AlertCircle,
  ArrowLeftRight,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Paginacion from "@/components/generics/Paginacion";
import useGetMovimientosInventario from "@/hooks/agroservicios/movimientos-inventario/useGetMovimientosInventario";
import useGetAllSucursales from "@/hooks/agroservicios/sucursales/useGetAllSucursales";
import CardDetails from "@/components/agroservicio/lotes-movimientos/CardDetails";
import TableTraslados from "@/components/agroservicio/traslados/TableTraslados";
import TitlePage from "@/components/generics/TitlePage";
import { useTranslations } from "next-intl";

const LotesTrasladosPage = () => {
  const t = useTranslations("lotesTrasladosPage");
  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSucursal, setSelectedSucursal] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const itemsPerPage = 10;

  const offset = (currentPage - 1) * itemsPerPage;

  const { data: sucursales, isLoading: cargandoSucursales } =
    useGetAllSucursales();

  const {
    data: trasladosData,
    isLoading,
    refetch,
  } = useGetMovimientosInventario(propietarioId, {
    limit: itemsPerPage,
    offset: offset,
    sucursal: selectedSucursal || undefined,
    fechaInicio: fechaInicio || undefined,
    fechaFin: fechaFin || undefined,
  });

  const movimientos = trasladosData?.movimientos || [];
  const totalItems = trasladosData?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const handleAplicarFiltros = () => {
    setCurrentPage(1);
    refetch();
  };

  const handleLimpiarFiltros = () => {
    setSelectedSucursal("");
    setFechaInicio("");
    setFechaFin("");
    setCurrentPage(1);
    setTimeout(() => refetch(), 100);
  };

  const filteredMovimientos = searchTerm
    ? movimientos.filter((mov) => {
        const productoNombre = mov.lote?.producto?.nombre || "";
        const productoCodigo = mov.lote?.producto?.codigo || "";
        return (
          productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          productoCodigo.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : movimientos;

  const totalProductosTransferidos = movimientos.reduce(
    (sum, m) => sum + Number(m.cantidad),
    0,
  );

  const sucursalesUnicas = new Set<string>();
  movimientos.forEach((m) => {
    if (m.sucursalOrigen?.nombre) sucursalesUnicas.add(m.sucursalOrigen.nombre);
    if (m.sucursalDestino?.nombre)
      sucursalesUnicas.add(m.sucursalDestino.nombre);
  });

  return (
    <div id="traslados-page" className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="md:flex justify-between items-center gap-4">
        <TitlePage
          Icon={ArrowLeftRight}
          title={t("title")}
          description={t("description")}
        />
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div id="buscador-traslados" className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("search.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">
          <Search className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {t("buttons.filters")}
        </Button>
      </form>

      {mostrarFiltros && (
        <Card id="filters-tralados">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  {t("filters.branch")}
                </Label>
                {cargandoSucursales ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={selectedSucursal || "todas"}
                    onValueChange={(value) => {
                      setSelectedSucursal(value === "todas" ? "" : value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("filters.allBranches")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">
                        {t("filters.allBranches")}
                      </SelectItem>
                      {sucursales?.map((sucursal) => (
                        <SelectItem key={sucursal.id} value={sucursal.id}>
                          {sucursal.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  {t("filters.startDate")}
                </Label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  {t("filters.endDate")}
                </Label>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleLimpiarFiltros}>
                {t("buttons.clearFilters")}
              </Button>
              <Button onClick={handleAplicarFiltros}>
                {t("buttons.applyFilters")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div
        id="metricas-traslados"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <CardDetails
          title={t("statistics.totalTransfers")}
          total={totalItems}
          Icon={Truck}
          color="blue"
        />

        <CardDetails
          title={t("statistics.transferredProducts")}
          total={totalProductosTransferidos}
          Icon={Package}
          color="green"
        />

        <CardDetails
          title={t("statistics.involvedBranches")}
          total={sucursalesUnicas.size}
          Icon={Building}
          color="purple"
        />
      </div>

      <Card id="historial-traslados">
        <CardHeader>
          <CardTitle className="text-xl">{t("history.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredMovimientos.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{t("empty.description")}</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <TableTraslados
                filteredMovimientos={filteredMovimientos}
                moneda={moneda}
              />
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6">
              <Paginacion
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500">
        {t("pagination.showing", {
          shown: filteredMovimientos.length,
          total: totalItems,
        })}
      </div>
    </div>
  );
};

export default LotesTrasladosPage;
