"use client";

import TitlePage from "@/components/generics/TitlePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetAgroFacturas from "@/hooks/agroservicios/facturacion/useGetAgroFacturas";
import useGetAllSucursalesByPropietario from "@/hooks/agroservicios/sucursales/useGetAllSucursalesByPropietario";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Building, Calendar, FileText, Filter, X } from "lucide-react";
import { useState, useMemo } from "react";
import Paginacion from "@/components/generics/Paginacion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import TableFacturas from "@/components/agroservicio/facturacion/TableFacturas";
import { MessageError } from "@/components/generics/MessageError";
import { useTranslations } from "next-intl";

const FacturasAgroPage = () => {
  const t = useTranslations("facturasAgroPage");

  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const moneda = cliente?.pais?.simbolo_moneda ?? "L";
  const [offset, setOffset] = useState(0);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const limit = 10;

  const { data: sucursales, isLoading: isLoadingSucursales } =
    useGetAllSucursalesByPropietario(propietarioId);

  const params = useMemo(() => {
    const baseParams = {
      limit,
      offset,
    };

    const filters: any = { ...baseParams };

    if (sucursalSeleccionada && sucursalSeleccionada.trim() !== "") {
      filters.sucursal = sucursalSeleccionada;
    }

    if (fechaInicio && fechaInicio.trim() !== "") {
      filters.fechaInicio = fechaInicio;
    }

    if (fechaFin && fechaFin.trim() !== "") {
      filters.fechaFin = fechaFin;
    }

    return filters;
  }, [limit, offset, sucursalSeleccionada, fechaInicio, fechaFin]);

  const {
    data: facturas,
    isLoading,
    refetch,
  } = useGetAgroFacturas(propietarioId, params);

  const totalPages = facturas ? Math.ceil(facturas.total / limit) : 0;
  const currentPage = Math.floor(offset / limit) + 1;

  const hasActiveFilters = useMemo(() => {
    return sucursalSeleccionada || fechaInicio || fechaFin;
  }, [sucursalSeleccionada, fechaInicio, fechaFin]);

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * limit);
    document
      .getElementById("tabla-facturas")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const limpiarFiltros = () => {
    setSucursalSeleccionada("");
    setFechaInicio("");
    setFechaFin("");
    setOffset(0);
  };

  const sucursalesValidas =
    sucursales?.filter((s) => s.id?.trim() !== "") || [];

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (sucursalSeleccionada) count++;
    if (fechaInicio) count++;
    if (fechaFin) count++;
    return count;
  }, [sucursalSeleccionada, fechaInicio, fechaFin]);

  return (
    <div
      id="modulo-facturas"
      className="container mx-auto p-4 md:p-6 space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <TitlePage Icon={FileText} title={t("ownerTitle")} />
      </div>

      {(sucursalSeleccionada || fechaInicio || fechaFin) && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            {t("appliedFilters")}{" "}
            {sucursalSeleccionada && (
              <span className="font-medium">
                {t("filters.branch")}:{" "}
                {sucursalesValidas.find((s) => s.id === sucursalSeleccionada)
                  ?.nombre || t("filters.selected")}
              </span>
            )}
            {fechaInicio && (
              <span className="ml-2">
                {t("dates.from")}{" "}
                <span className="font-medium">
                  {new Date(fechaInicio).toLocaleDateString("es-HN")}
                </span>
              </span>
            )}
            {fechaFin && (
              <span className="ml-2">
                {t("dates.to")}{" "}
                <span className="font-medium">
                  {new Date(fechaFin).toLocaleDateString("es-HN")}
                </span>
              </span>
            )}
          </p>
        </div>
      )}

      <Card id="filters-facturacion" className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              {t("filters.title")}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={limpiarFiltros}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                {t("buttons.clearAll")}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div id="sucusal-facturacion" className="space-y-2">
              <Label
                htmlFor="sucursal"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Building className="h-4 w-4 text-gray-500" />
                {t("filters.branch")}
              </Label>
              <Select
                value={sucursalSeleccionada || "all"}
                onValueChange={(value) => {
                  setSucursalSeleccionada(value === "all" ? "" : value);
                  setOffset(0);
                }}
                disabled={isLoadingSucursales}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder={t("filters.allBranches")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("filters.allBranches")}
                  </SelectItem>
                  {sucursalesValidas.map((sucursal) => (
                    <SelectItem key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div id="fechaIn-facturacion" className="space-y-2">
              <Label
                htmlFor="fechaInicio"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Calendar className="h-4 w-4 text-gray-500" />
                {t("dates.startDate")}
              </Label>
              <Input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => {
                  setFechaInicio(e.target.value);
                  setOffset(0);
                }}
                className="bg-white"
                max={fechaFin || undefined}
              />
            </div>

            <div id="fechaFin-facturacion" className="space-y-2">
              <Label
                htmlFor="fechaFin"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Calendar className="h-4 w-4 text-gray-500" />
                {t("dates.endDate")}
              </Label>
              <Input
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => {
                  setFechaFin(e.target.value);
                  setOffset(0);
                }}
                className="bg-white"
                min={fechaInicio || undefined}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500 font-medium">
                {t("filters.active")}
              </span>
              {sucursalSeleccionada && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {sucursalesValidas.find((s) => s.id === sucursalSeleccionada)
                    ?.nombre || t("filters.selected")}
                  <button
                    onClick={() => {
                      setSucursalSeleccionada("");
                      setOffset(0);
                    }}
                    className="ml-1 hover:text-gray-700"
                    aria-label={t("filters.removeBranch")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {fechaInicio && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {t("dates.from")}:{" "}
                  {new Date(fechaInicio).toLocaleDateString("es-HN")}
                  <button
                    onClick={() => {
                      setFechaInicio("");
                      setOffset(0);
                    }}
                    className="ml-1 hover:text-gray-700"
                    aria-label={t("dates.removeStartDate")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {fechaFin && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {t("dates.to")}:{" "}
                  {new Date(fechaFin).toLocaleDateString("es-HN")}
                  <button
                    onClick={() => {
                      setFechaFin("");
                      setOffset(0);
                    }}
                    className="ml-1 hover:text-gray-700"
                    aria-label={t("dates.removeEndDate")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-sm">
          {t("summary.total", { total: facturas?.total || 0 })}
          {hasActiveFilters && ` (${t("summary.filtered")})`}
        </Badge>
      </div>

      <div id="tabla-facturas" className="space-y-4">
        {isLoading ? (
          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border shadow-sm overflow-hidden">
              {facturas && facturas.data.length > 0 ? (
                <TableFacturas
                  facturas={facturas}
                  onFacturaActualizada={refetch}
                  isPropietario={true}
                  propietarioId={propietarioId}
                  moneda={moneda}
                />
              ) : (
                <MessageError
                  titulo={t("empty.searchTitle")}
                  descripcion={t("empty.searchDescription")}
                />
              )}
            </Card>

            {facturas && facturas.total > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                <div className="text-sm text-gray-500 order-2 sm:order-1">
                  {t("pagination.showing", {
                    from: Math.min(offset + 1, facturas.total),
                    to: Math.min(offset + limit, facturas.total),
                    total: facturas.total,
                  })}
                </div>
                <div className="order-1 sm:order-2">
                  <Paginacion
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {!isLoading && facturas && facturas.data?.length === 0 && (
          <Card className="border shadow-sm">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("empty.title")}
              </h3>
              <p className="text-gray-500">
                {hasActiveFilters
                  ? t("empty.filteredDescription")
                  : t("empty.description")}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={limpiarFiltros}
                  className="mt-4"
                >
                  {t("buttons.clearFilters")}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FacturasAgroPage;
