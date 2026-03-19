"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Filter,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useGetServicioReproductivo from "@/hooks/reproduccion/useGetServicioReproductivo";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { FiltrosServicios } from "@/interfaces/filtros/servicios-resproductivos.filtros.interface";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import Paginacion from "@/components/generics/Paginacion";
import TipoServicioBadge from "./ui/TipoServicioBadge";
import EstadoBadge from "./ui/EstadoBadge";
import MobileFilters from "./ui/MobileFilters";
import CardFilters from "./ui/CardFilters";

const ServiciosReproductivosPage = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  const { data: fincasData, isLoading: fincasLoading } =
    useFincasPropietarios(clienteId);
  const { data: animalesData, isLoading: animalesLoading } =
    useGetAnimalesPropietario(clienteId);

  const fincas = fincasData?.data?.fincas || [];
  const hembras =
    animalesData?.data?.filter((animal) => animal.sexo === "Hembra") || [];

  const [filtros, setFiltros] = useState<FiltrosServicios>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (fincas.length > 0 && !filtros.finca_id) {
      setFiltros((prev) => ({
        ...prev,
        finca_id: fincas[0].id,
      }));
    }
  }, [fincas]);

  const [filtrosVisibles, setFiltrosVisibles] = useState(false);
  const [vista, setVista] = useState<"tabla" | "tarjetas">(
    isMobile ? "tarjetas" : "tabla",
  );

  const { data, isLoading, error, refetch, isFetching } =
    useGetServicioReproductivo(filtros);

  const servicios = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.page || 1;

  const handleFilterChange = (key: keyof FiltrosServicios, value: any) => {
    setFiltros((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      page: 1,
      limit: 10,
      finca_id: fincas[0]?.id,
    });
    setFiltrosVisibles(false);
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setFiltros((prev) => ({ ...prev, page: nuevaPagina }));
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const VistaTabla = () => (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hembra</TableHead>
            <TableHead>Macho</TableHead>
            <TableHead className="hidden lg:table-cell">Tipo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="hidden md:table-cell">N°</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="hidden lg:table-cell">Montas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicios.map((servicio) => (
            <TableRow key={servicio.id}>
              <TableCell className="font-medium">
                <div>
                  <p className="truncate max-w-[150px]">
                    {servicio.hembra.identificador}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {servicio.celo_asociado &&
                      format(
                        new Date(servicio.celo_asociado.fechaInicio),
                        "dd/MM/yy",
                      )}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <span className="truncate max-w-[150px] block">
                  {servicio.macho?.identificador || "N/A"}
                </span>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <TipoServicioBadge tipo={servicio.tipo_servicio} />
              </TableCell>
              <TableCell>
                {format(new Date(servicio.fecha_servicio), "dd/MM/yy HH:mm")}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                #{servicio.numero_servicio}
              </TableCell>
              <TableCell>
                <EstadoBadge estado={servicio.estado} />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {servicio.detalles?.length || 0}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Cancelar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const VistaTarjetas = () => (
    <div className="space-y-3">
      {servicios.map((servicio) => (
        <Card key={servicio.id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {servicio.hembra.identificador}
                  {servicio.exitoso ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : servicio.estado === "FALLIDO" ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : null}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  N° Servicio: {servicio.numero_servicio} •{" "}
                  {servicio.tipo_servicio.replace(/_/g, " ")}
                </CardDescription>
              </div>
              <EstadoBadge estado={servicio.estado} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 pb-2">
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div>
                <p className="text-xs text-muted-foreground">Macho</p>
                <p className="text-sm font-medium">
                  {servicio.macho?.identificador || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha</p>
                <p className="text-sm font-medium">
                  {format(new Date(servicio.fecha_servicio), "dd/MM/yy HH:mm")}
                </p>
              </div>
            </div>

            {servicio.celo_asociado && (
              <div className="bg-muted/50 p-2 rounded-md mb-2">
                <p className="text-xs flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Celo:{" "}
                  {format(
                    new Date(servicio.celo_asociado.fechaInicio),
                    "dd/MM/yy HH:mm",
                  )}
                </p>
              </div>
            )}

            {servicio.detalles && servicio.detalles.length > 0 && (
              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-medium mb-1">Montas:</p>
                <div className="flex gap-2 flex-wrap">
                  {servicio.detalles.map((detalle, idx) => (
                    <Badge
                      key={detalle.id}
                      variant="outline"
                      className="text-xs"
                    >
                      {idx + 1}: {detalle.hora_servicio}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm">
              Ver más
            </Button>
            <Button size="sm">Editar</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const fincaSeleccionada = fincas.find((f) => f.id === filtros.finca_id);

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Servicios Reproductivos
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {fincaSeleccionada ? (
                <>
                  Gestiona los servicios en{" "}
                  <span className="font-medium">
                    {fincaSeleccionada.nombre_finca}
                  </span>
                </>
              ) : (
                "Gestiona los servicios de monta e inseminación"
              )}
            </p>
          </div>

          <div className="flex w-full sm:w-auto gap-2">
            {isMobile && (
              <Button
                variant="outline"
                onClick={() => setFiltrosVisibles(true)}
                className="flex-1 sm:flex-none"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            )}

            {isTablet && (
              <Tabs
                value={vista}
                onValueChange={(v) => setVista(v as any)}
                className="mr-2"
              >
                <TabsList>
                  <TabsTrigger value="tabla">Tabla</TabsTrigger>
                  <TabsTrigger value="tarjetas">Tarjetas</TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            <Button className="flex-1 sm:flex-none">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Button>
          </div>
        </div>

        {!isMobile && (
          <CardFilters
            fincaSeleccionada={fincaSeleccionada}
            filtros={filtros}
            fincas={fincas}
            hembras={hembras}
            handleFilterChange={handleFilterChange}
            fincasLoading={fincasLoading}
            animalesLoading={animalesLoading}
            limpiarFiltros={limpiarFiltros}
            refetch={refetch}
            isFetching={isFetching}
          />
        )}

        {isMobile && (
          <MobileFilters
            filtrosVisibles={filtrosVisibles}
            setFiltrosVisibles={setFiltrosVisibles}
            filtros={filtros}
            fincas={fincas}
            hembras={hembras}
            handleFilterChange={handleFilterChange}
            fincasLoading={fincasLoading}
            animalesLoading={animalesLoading}
            limpiarFiltros={limpiarFiltros}
            refetch={refetch}
          />
        )}

        <Card>
          <CardContent className="p-0">
            {error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error al cargar</h3>
                <p className="text-muted-foreground mb-4">
                  No se pudieron cargar los servicios
                </p>
                <Button onClick={() => refetch()}>Reintentar</Button>
              </div>
            ) : servicios.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay servicios registrados
                </p>
                {filtros.finca_id && (
                  <p className="text-sm text-muted-foreground mt-2">
                    en {fincaSeleccionada?.nombre_finca}
                  </p>
                )}
              </div>
            ) : (
              <>
                {isMobile ? (
                  <VistaTarjetas />
                ) : isTablet && vista === "tarjetas" ? (
                  <VistaTarjetas />
                ) : (
                  <VistaTabla />
                )}

                {totalPages > 0 && (
                  <div className="p-4 border-t">
                    <Paginacion
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={cambiarPagina}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {servicios.length > 0 && !isMobile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Servicios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data?.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Exitosos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {servicios.filter((s) => s.exitoso).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Tasa Éxito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {Math.round(
                    (servicios.filter((s) => s.exitoso).length /
                      servicios.length) *
                      100,
                  )}
                  %
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Programados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">
                  {servicios.filter((s) => s.estado === "PROGRAMADO").length}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ServiciosReproductivosPage;
