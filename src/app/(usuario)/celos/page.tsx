"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Filter, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useGetCelosAnimal from "@/hooks/reproduccion/useGetCelosAnimal";
import { FiltrosCelos } from "@/interfaces/filtros/celos.filtros.interface";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { MessageError } from "@/components/generics/MessageError";
import TableCelos from "./ui/TableCelos";
import { Celo } from "@/api/reproduccion/interfaces/response-celos-animal,interface";
import Paginacion from "@/components/generics/Paginacion";
import Modal from "@/components/generics/Modal";
import FormCelosAnimal from "./ui/FormCelosAnimal";

const CelosAnimalPage = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";

  const [filtros, setFiltros] = useState<FiltrosCelos>({
    offset: 1,
    limit: 10,
  });

  const [tempFiltros, setTempFiltros] = useState<FiltrosCelos>(filtros);

  const [fincaSeleccionada, setFincaSeleccionada] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCelo, setSelectedCelo] = useState<Celo | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [filtrosVisibles, setFiltrosVisibles] = useState(false);

  const { data: fincas, isLoading: fincasLoading } =
    useFincasPropietarios(clienteId);
  const { data: animales, isLoading: animalesLoading } =
    useGetAnimalesPropietario(clienteId);
  const hembras = animales?.data.filter((animal) => animal.sexo === "Hembra");

  const { data: especies, isLoading: especiesLoading } = useGetEspecies();

  const { data, isLoading, error, refetch } = useGetCelosAnimal(filtros);

  useEffect(() => {
    if (tempFiltros.fincaId) {
      setFincaSeleccionada(tempFiltros.fincaId);
    }
  }, [tempFiltros.fincaId]);

  const handleFilterChange = (key: keyof FiltrosCelos, value: any) => {
    if (key === "fincaId") {
      setTempFiltros((prev) => ({
        ...prev,
        fincaId: value === "todas" ? "" : value,
        animalId: "",
      }));
      setFincaSeleccionada(value === "todas" ? "" : value);
    } else if (key === "especie") {
      setTempFiltros((prev) => ({
        ...prev,
        [key]: value === "todas" ? "" : value,
      }));
    } else if (key === "intensidad") {
      setTempFiltros((prev) => ({
        ...prev,
        [key]: value === "todas" ? "" : value,
      }));
    } else {
      setTempFiltros((prev) => ({ ...prev, [key]: value }));
    }
  };

  const aplicarFiltros = () => {
    setFiltros({ ...tempFiltros, offset: 1 });
    refetch();
  };

  const limpiarFiltros = () => {
    const filtrosLimpios = { offset: 1, limit: 10 };
    setTempFiltros(filtrosLimpios);
    setFiltros(filtrosLimpios);
    setFincaSeleccionada("");
    refetch();
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setFiltros((prev) => ({ ...prev, offset: nuevaPagina }));
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Control de Celos
          </h1>
          <p className="text-muted-foreground">
            Gestiona y da seguimiento a los celos de tus animales
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setFiltrosVisibles(!filtrosVisibles)}
            className="md:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => setOpenModal(true)}>Nuevo Registro</Button>
        </div>
      </div>

      <Card className={cn("hidden md:block", filtrosVisibles && "block")}>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtra los registros de celo por diferentes criterios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fincaId">Finca</Label>
              <Select
                value={tempFiltros.fincaId || "todas"}
                onValueChange={(value) => handleFilterChange("fincaId", value)}
                disabled={fincasLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar finca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las fincas</SelectItem>
                  {fincas?.data.fincas.map((finca) => (
                    <SelectItem key={finca.id} value={finca.id}>
                      {finca.nombre_finca}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="animalId">Animal</Label>
              <Select
                value={tempFiltros.animalId || "todos"}
                onValueChange={(value) =>
                  handleFilterChange("animalId", value === "todos" ? "" : value)
                }
                disabled={animalesLoading || !tempFiltros.fincaId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !tempFiltros.fincaId
                        ? "Primero selecciona una finca"
                        : "Seleccionar animal"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los animales</SelectItem>
                  {hembras?.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.identificador} - {animal.color} ({animal.sexo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!tempFiltros.fincaId && (
                <p className="text-xs text-muted-foreground">
                  Selecciona una finca primero
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="especie">Especie</Label>
              <Select
                value={tempFiltros.especie || "todas"}
                onValueChange={(value) => handleFilterChange("especie", value)}
                disabled={especiesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las especies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las especies</SelectItem>
                  {especies?.data.map((especie) => (
                    <SelectItem key={especie.id} value={especie.nombre}>
                      {especie.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="intensidad">Intensidad</Label>
              <Select
                value={tempFiltros.intensidad || "todas"}
                onValueChange={(value) =>
                  handleFilterChange("intensidad", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las intensidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="BAJO">Bajo</SelectItem>
                  <SelectItem value="MEDIO">Medio</SelectItem>
                  <SelectItem value="ALTO">Alto</SelectItem>
                  <SelectItem value="MUY_ALTO">Muy Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha Inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tempFiltros.fechaInicio && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tempFiltros.fechaInicio ? (
                      format(new Date(tempFiltros.fechaInicio), "PPP", {
                        locale: es,
                      })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      tempFiltros.fechaInicio
                        ? new Date(tempFiltros.fechaInicio)
                        : undefined
                    }
                    onSelect={(date) =>
                      handleFilterChange("fechaInicio", date?.toISOString())
                    }
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tempFiltros.fechaFin && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tempFiltros.fechaFin ? (
                      format(new Date(tempFiltros.fechaFin), "PPP", {
                        locale: es,
                      })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      tempFiltros.fechaFin
                        ? new Date(tempFiltros.fechaFin)
                        : undefined
                    }
                    onSelect={(date) =>
                      handleFilterChange("fechaFin", date?.toISOString())
                    }
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end space-x-2 pt-8">
              <Button onClick={aplicarFiltros} className="flex-1">
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={limpiarFiltros} size="icon">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <MessageError
              titulo="No se encontraron registros de celo"
              descripcion=" Error al cargar los datos. Por favor intenta de nuevo."
            />
          ) : (
            <>
              <TableCelos
                data={data}
                setSelectedCelo={setSelectedCelo}
                setDetalleOpen={setDetalleOpen}
                detalleOpen={detalleOpen}
                selectedCelo={selectedCelo}
              />

              {(!data?.celos || data.celos.length === 0) && (
                <MessageError
                  titulo="No se encontraron registros de celo"
                  descripcion=" Error al cargar los datos. Por favor intenta de nuevo."
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {data && data.totalPages > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Paginacion
            currentPage={data.offset}
            totalPages={data.totalPages}
            onPageChange={cambiarPagina}
          />
        </div>
      )}

      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title="Agregar Nuevo Celo"
        description="Aqui podras agregar el timpo de celo de tus vacas"
        size="xl"
      >
        <FormCelosAnimal
          setOpenModal={setOpenModal}
          onSuccess={() => setOpenModal(false)}
          hembras={hembras}
        />
      </Modal>
    </div>
  );
};

export default CelosAnimalPage;
