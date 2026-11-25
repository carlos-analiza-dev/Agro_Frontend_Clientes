"use client";

import SkeletonPage from "@/components/generics/SkeletonPage";
import TitlePage from "@/components/generics/TitlePage";
import useGetMovimientosLotes from "@/hooks/agroservicios/movimientos-lotes/useGetMovimientosLotes";
import useGetAllSucursalesByPropietario from "@/hooks/agroservicios/sucursales/useGetAllSucursalesByPropietario";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { History, Search, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subMonths, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Paginacion from "@/components/generics/Paginacion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MovimientoLote } from "@/api/agroservicio/movimientos-lotes/interface/response-movimientos-lotes.interface";
import TableMovimientosLotes from "@/components/agroservicio/movimientos-lotes/TableMovimientosLotes";

const MovimientosLotesPage = () => {
  const t = useTranslations("movimientosLotesPage");

  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const today = new Date();
  const lastMonth = subMonths(today, 1);

  const [sucursalSelected, setSucursalSelected] = useState("all");
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(
    startOfDay(lastMonth),
  );
  const [fechaFin, setFechaFin] = useState<Date | undefined>(endOfDay(today));
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("all");

  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { data: sucursales } = useGetAllSucursalesByPropietario(propietarioId);
  const { data: movimientos, isLoading } = useGetMovimientosLotes(
    propietarioId,
    {
      limit,
      offset,
      fechaInicio: fechaInicio ? fechaInicio.toISOString() : "",
      fechaFin: fechaFin ? fechaFin.toISOString() : "",
      sucursal: sucursalSelected === "all" ? "" : sucursalSelected,
    },
  );

  const movimientosFiltrados =
    movimientos?.movimientos?.filter((mov: MovimientoLote) => {
      const matchSearch =
        mov.producto?.nombre
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        mov.factura?.numero_factura
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        mov.lote?.id_compra?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTipo = filtroTipo === "all" ? true : mov.tipo === filtroTipo;

      return matchSearch && matchTipo;
    }) || [];

  const totalPages = Math.ceil((movimientos?.total || 0) / limit);

  const handleLimpiarFiltros = () => {
    const today = new Date();
    const lastMonth = subMonths(today, 1);
    setSucursalSelected("all");
    setFechaInicio(startOfDay(lastMonth));
    setFechaFin(endOfDay(today));
    setSearchTerm("");
    setFiltroTipo("all");
    setCurrentPage(1);
  };

  if (isLoading) {
    return <SkeletonPage />;
  }

  return (
    <div
      id="movimientos-lotes-page"
      className="container mx-auto p-4 md:p-6 space-y-6"
    >
      <div className="md:flex justify-between items-start gap-4">
        <TitlePage
          Icon={History}
          title={t("title")}
          description={t("description")}
        />
      </div>

      <Card id="filtros-movimientos-lotes">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sucursal" className="text-sm font-medium">
                {t("filters.branch")}
              </Label>
              <Select
                value={sucursalSelected}
                onValueChange={setSucursalSelected}
              >
                <SelectTrigger id="sucursal" className="w-full">
                  <SelectValue placeholder={t("placeholders.allBranches")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("placeholders.allBranches")}
                  </SelectItem>
                  {sucursales?.map((sucursal: any) => (
                    <SelectItem key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-sm font-medium">
                {t("filters.movementType")}
              </Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger id="tipo" className="w-full">
                  <SelectValue placeholder={t("placeholders.allTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("placeholders.allTypes")}
                  </SelectItem>
                  <SelectItem value="DEVOLUCION">
                    {t("movementTypes.return")}
                  </SelectItem>
                  <SelectItem value="SALIDA">
                    {t("movementTypes.exit")}
                  </SelectItem>
                  <SelectItem value="ENTRADA">
                    {t("movementTypes.entry")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("filters.startDate")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fechaInicio && "text-muted-foreground",
                    )}
                  >
                    {fechaInicio
                      ? format(fechaInicio, "dd/MM/yyyy")
                      : t("placeholders.selectDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaInicio}
                    onSelect={setFechaInicio}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("filters.endDate")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fechaFin && "text-muted-foreground",
                    )}
                  >
                    {fechaFin
                      ? format(fechaFin, "dd/MM/yyyy")
                      : t("placeholders.selectDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaFin}
                    onSelect={setFechaFin}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div id="buscador-movimientos" className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("placeholders.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleLimpiarFiltros}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                {t("buttons.clear")}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {sucursalSelected !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {t("activeFilters.branch")}:{" "}
                {
                  sucursales?.find((s: any) => s.id === sucursalSelected)
                    ?.nombre
                }
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => setSucursalSelected("all")}
                />
              </Badge>
            )}
            {filtroTipo !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {t("activeFilters.type")}:{" "}
                {t(
                  `movementTypes.${filtroTipo === "DEVOLUCION" ? "return" : filtroTipo === "SALIDA" ? "exit" : "entry"}`,
                )}
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => setFiltroTipo("all")}
                />
              </Badge>
            )}
            {fechaInicio && (
              <Badge variant="secondary" className="gap-1">
                {t("activeFilters.from")}: {format(fechaInicio, "dd/MM/yyyy")}
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => setFechaInicio(undefined)}
                />
              </Badge>
            )}
            {fechaFin && (
              <Badge variant="secondary" className="gap-1">
                {t("activeFilters.to")}: {format(fechaFin, "dd/MM/yyyy")}
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => setFechaFin(undefined)}
                />
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card id="tabla-movimientos-lotes">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-lg">{t("results.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("results.found", { count: movimientosFiltrados.length })}
              </p>
            </div>
          </div>

          <ScrollArea className="w-full">
            <div id="resultados-movimientos" className="min-w-[800px]">
              <TableMovimientosLotes
                movimientosFiltrados={movimientosFiltrados}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {t("pagination.showing", {
                  from: offset + 1,
                  to: Math.min(offset + limit, movimientos?.total || 0),
                  total: movimientos?.total || 0,
                })}
              </div>
              <Paginacion
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MovimientosLotesPage;
