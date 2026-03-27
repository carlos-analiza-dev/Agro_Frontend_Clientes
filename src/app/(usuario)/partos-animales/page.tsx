"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Filter, X, Baby } from "lucide-react";
import { format, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import useGetPartosAnimales from "@/hooks/reproduccion/useGetPartosAnimales";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { EstadoParto, TipoParto } from "@/interfaces/enums/partos.enums";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import InfoPartoAnimal from "./ui/InfoPartoAnimal";
import DetailsParto from "./ui/DetailsParto";
import CardMobile from "./ui/CardMobile";
import Paginacion from "@/components/generics/Paginacion";
import Modal from "@/components/generics/Modal";
import FormPartoAnimal from "./ui/FormPartoAnimal";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Parto } from "@/api/reproduccion/interfaces/response-partos.interface";

const PartosAnimalesPage = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedParto, setSelectedParto] = useState<Parto | undefined>(
    undefined,
  );
  const handleEdit = (parto: Parto) => {
    setSelectedParto(parto);
    setOpenModal(true);
  };
  const [filtros, setFiltros] = useState({
    finca_id: "",
    hembra_id: "",
    estado: "",
    tipo_parto: "",
    fecha_desde: undefined as Date | undefined,
    fecha_hasta: undefined as Date | undefined,
    limit: 10,
    page: 1,
  });

  const { data: partos, isLoading, refetch } = useGetPartosAnimales();
  const { data: fincas } = useFincasPropietarios(clienteId);
  const { data: animales } = useGetAnimalesPropietario(clienteId);

  const finca = fincas?.data.fincas.find(
    (item: Finca) => item.id === filtros.finca_id,
  );

  const hembras = animales?.data?.filter(
    (a) => a.sexo === "Hembra" && a.finca.id === filtros.finca_id,
  );

  const compararFechas = (
    fechaParto: string,
    fechaDesde?: Date,
    fechaHasta?: Date,
  ) => {
    const fechaPartoObj = new Date(fechaParto);
    const inicioParto = startOfDay(fechaPartoObj);

    if (fechaDesde) {
      const inicioDesde = startOfDay(fechaDesde);
      if (inicioParto < inicioDesde) return false;
    }

    if (fechaHasta) {
      const finHasta = endOfDay(fechaHasta);
      if (inicioParto > finHasta) return false;
    }

    return true;
  };

  useEffect(() => {
    if (
      fincas?.data?.fincas &&
      fincas.data.fincas.length > 0 &&
      !filtros.finca_id
    ) {
      setFiltros((prev) => ({
        ...prev,
        finca_id: fincas.data.fincas[0].id,
        page: 1,
      }));
    }
  }, [fincas]);

  const partosFiltrados = partos?.data?.filter((p) => {
    if (filtros.finca_id && p.hembra.finca.id !== filtros.finca_id)
      return false;
    if (filtros.hembra_id && p.hembra.id !== filtros.hembra_id) return false;
    if (filtros.estado && p.estado !== filtros.estado) return false;
    if (filtros.tipo_parto && p.tipo_parto !== filtros.tipo_parto) return false;

    if (
      !compararFechas(p.fecha_parto, filtros.fecha_desde, filtros.fecha_hasta)
    ) {
      return false;
    }

    return true;
  });

  const totalPartos = partosFiltrados?.length || 0;
  const totalPages = Math.ceil(totalPartos / filtros.limit);
  const startIndex = (filtros.page - 1) * filtros.limit;
  const endIndex = startIndex + filtros.limit;
  const partosPaginaActual = partosFiltrados?.slice(startIndex, endIndex);

  const clearFilters = () => {
    setFiltros({
      estado: "",
      finca_id: fincas?.data?.fincas?.[0]?.id || "",
      hembra_id: "",
      tipo_parto: "",
      fecha_desde: undefined,
      fecha_hasta: undefined,
      limit: 10,
      page: 1,
    });
    if (isMobile) setShowFilters(false);
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.hembra_id) count++;
    if (filtros.estado) count++;
    if (filtros.tipo_parto) count++;
    if (filtros.fecha_desde || filtros.fecha_hasta) count++;
    return count;
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handlePageChange = (page: number) => {
    setFiltros((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseModal = () => {
    setOpenModal(false);

    setTimeout(() => {
      setSelectedParto(undefined);
    }, 300);
  };

  const handleClickNewRegister = () => {
    setSelectedParto(undefined);
    if (isMobile) {
      router.push("/partos-animales/crear-parto");
    } else {
      setOpenModal(true);
    }
  };

  const FiltersContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Finca</Label>
        <Select
          value={filtros.finca_id}
          onValueChange={(value) =>
            setFiltros({ ...filtros, finca_id: value, page: 1 })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar finca" />
          </SelectTrigger>
          <SelectContent>
            {fincas?.data?.fincas?.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.nombre_finca}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Hembra</Label>
        <Select
          value={filtros.hembra_id || "todos"}
          onValueChange={(value) =>
            setFiltros({
              ...filtros,
              hembra_id: value === "todos" ? "" : value,
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las hembras" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las hembras</SelectItem>
            {hembras?.map((h) => (
              <SelectItem key={h.id} value={h.id}>
                {h.identificador}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Estado</Label>
        <Select
          value={filtros.estado || "todos"}
          onValueChange={(value) =>
            setFiltros({
              ...filtros,
              estado: value === "todos" ? "" : value,
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value={EstadoParto.PROGRAMADO}>Programado</SelectItem>
            <SelectItem value={EstadoParto.EN_PROGRESO}>En progreso</SelectItem>
            <SelectItem value={EstadoParto.COMPLETADO}>Completado</SelectItem>
            <SelectItem value={EstadoParto.COMPLICADO}>Complicado</SelectItem>
            <SelectItem value={EstadoParto.ABORTADO}>Abortado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Tipo de parto</Label>
        <Select
          value={filtros.tipo_parto || "todos"}
          onValueChange={(value) =>
            setFiltros({
              ...filtros,
              tipo_parto: value === "todos" ? "" : value,
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value={TipoParto.NORMAL}>Normal</SelectItem>
            <SelectItem value={TipoParto.DISTOCICO}>Distócico</SelectItem>
            <SelectItem value={TipoParto.CESAREA}>Cesárea</SelectItem>
            <SelectItem value={TipoParto.MUERTE_NATAL}>Muerte Natal</SelectItem>
            <SelectItem value={TipoParto.ABORTO}>Aborto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Rango de fechas</Label>
        <div className="flex flex-col gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filtros.fecha_desde && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filtros.fecha_desde
                  ? format(filtros.fecha_desde, "dd/MM/yyyy", { locale: es })
                  : "Fecha desde"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filtros.fecha_desde}
                onSelect={(date) =>
                  setFiltros({ ...filtros, fecha_desde: date, page: 1 })
                }
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filtros.fecha_hasta && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filtros.fecha_hasta
                  ? format(filtros.fecha_hasta, "dd/MM/yyyy", { locale: es })
                  : "Fecha hasta"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filtros.fecha_hasta}
                onSelect={(date) =>
                  setFiltros({ ...filtros, fecha_hasta: date, page: 1 })
                }
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Items por página</Label>
        <Select
          value={filtros.limit.toString()}
          onValueChange={(value) =>
            setFiltros({ ...filtros, limit: parseInt(value), page: 1 })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={clearFilters} className="flex-1">
          <X className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
        {isMobile && (
          <Button onClick={() => setShowFilters(false)} className="flex-1">
            Aplicar filtros
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl md:text-3xl font-bold tracking-tight break-words">
            Control de Partos - {finca?.nombre_finca}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
            Monitorea los partos registrados en tus animales.
            {totalPartos > 0 && ` Total: ${totalPartos} partos`}
          </p>
        </div>
        <Button
          onClick={handleClickNewRegister}
          className="w-full sm:w-auto"
          size={isMobile ? "default" : "default"}
        >
          <Baby className="h-4 w-4 mr-2" />
          Nuevo Registro
        </Button>
      </div>
      {!isMobile ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {contarFiltrosActivos() > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {contarFiltrosActivos()} activos
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Finca</Label>
                <Select
                  value={filtros.finca_id}
                  onValueChange={(value) =>
                    setFiltros({ ...filtros, finca_id: value, page: 1 })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar finca" />
                  </SelectTrigger>
                  <SelectContent>
                    {fincas?.data?.fincas?.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nombre_finca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Hembra</Label>
                <Select
                  value={filtros.hembra_id || "todos"}
                  onValueChange={(value) =>
                    setFiltros({
                      ...filtros,
                      hembra_id: value === "todos" ? "" : value,
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las hembras" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las hembras</SelectItem>
                    {hembras?.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.identificador}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Estado</Label>
                <Select
                  value={filtros.estado || "todos"}
                  onValueChange={(value) =>
                    setFiltros({
                      ...filtros,
                      estado: value === "todos" ? "" : value,
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value={EstadoParto.PROGRAMADO}>
                      Programado
                    </SelectItem>
                    <SelectItem value={EstadoParto.EN_PROGRESO}>
                      En progreso
                    </SelectItem>
                    <SelectItem value={EstadoParto.COMPLETADO}>
                      Completado
                    </SelectItem>
                    <SelectItem value={EstadoParto.COMPLICADO}>
                      Complicado
                    </SelectItem>
                    <SelectItem value={EstadoParto.ABORTADO}>
                      Abortado
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de parto</Label>
                <Select
                  value={filtros.tipo_parto || "todos"}
                  onValueChange={(value) =>
                    setFiltros({
                      ...filtros,
                      tipo_parto: value === "todos" ? "" : value,
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value={TipoParto.NORMAL}>Normal</SelectItem>
                    <SelectItem value={TipoParto.DISTOCICO}>
                      Distócico
                    </SelectItem>
                    <SelectItem value={TipoParto.CESAREA}>Cesárea</SelectItem>
                    <SelectItem value={TipoParto.MUERTE_NATAL}>
                      Muerte Natal
                    </SelectItem>
                    <SelectItem value={TipoParto.ABORTO}>Aborto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                <Label className="text-sm font-medium">Rango de fechas</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !filtros.fecha_desde && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filtros.fecha_desde
                          ? format(filtros.fecha_desde, "dd/MM/yyyy", {
                              locale: es,
                            })
                          : "Fecha desde"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filtros.fecha_desde}
                        onSelect={(date) =>
                          setFiltros({ ...filtros, fecha_desde: date, page: 1 })
                        }
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !filtros.fecha_hasta && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filtros.fecha_hasta
                          ? format(filtros.fecha_hasta, "dd/MM/yyyy", {
                              locale: es,
                            })
                          : "Fecha hasta"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filtros.fecha_hasta}
                        onSelect={(date) =>
                          setFiltros({ ...filtros, fecha_hasta: date, page: 1 })
                        }
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Items por página</Label>
                <Select
                  value={filtros.limit.toString()}
                  onValueChange={(value) =>
                    setFiltros({ ...filtros, limit: parseInt(value), page: 1 })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </div>
            {contarFiltrosActivos() > 0 && (
              <Badge variant="secondary">
                {contarFiltrosActivos()} activos
              </Badge>
            )}
          </Button>

          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
              <SheetHeader className="mb-4">
                <SheetTitle className="text-left">Filtros</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto h-full pb-20">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
          <CardTitle>Historial de Partos</CardTitle>
          {totalPartos > 0 && (
            <span className="text-xs sm:text-sm text-muted-foreground">
              Mostrando {startIndex + 1} - {Math.min(endIndex, totalPartos)} de{" "}
              {totalPartos} partos
            </span>
          )}
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            {isMobile ? (
              <CardMobile
                partosFiltrados={partosPaginaActual}
                isLoading={isLoading}
                handleRefresh={handleRefresh}
                isMobile={isMobile}
              />
            ) : (
              <InfoPartoAnimal
                partosFiltrados={partosPaginaActual}
                isLoading={isLoading}
                handleRefresh={handleRefresh}
                handleEdit={handleEdit}
              />
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Paginacion
                currentPage={filtros.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="justify-center"
              />
            </div>
          )}

          {partosFiltrados && partosFiltrados.length > 0 && (
            <div className="mt-6">
              <DetailsParto partosFiltrados={partosFiltrados} />
            </div>
          )}
        </CardContent>
      </Card>
      <Modal
        open={openModal}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseModal();
          } else {
            setOpenModal(open);
          }
        }}
        title={selectedParto ? "Editar Parto" : "Agregar Nuevo Parto"}
        description={
          selectedParto
            ? "Aquí podrás editar la información del parto"
            : "Aquí podrás ingresar el parto de tu animal"
        }
        size="2xl"
        height="xl"
      >
        <FormPartoAnimal
          hembras={hembras}
          setOpenModal={handleCloseModal}
          parto={selectedParto}
          onSuccess={() => {
            handleRefresh();
          }}
        />
      </Modal>
      s
    </div>
  );
};

export default PartosAnimalesPage;
