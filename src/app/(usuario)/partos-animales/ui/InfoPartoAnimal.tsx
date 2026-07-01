import { Parto } from "@/api/reproduccion/interfaces/response-partos.interface";
import { MessageError } from "@/components/generics/MessageError";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEstadoBadge } from "@/helpers/funciones/obtenerEstadoParto";
import { getTipoPartoLabel } from "@/helpers/funciones/tipoParto";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Droplets,
  Pencil,
  Scissors,
  Syringe,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ingresarCria } from "@/api/animales/accions/ingresar-cria";
import { CreateAnimalFromCriaData } from "@/api/animales/interfaces/ingresar-cria.interfaz";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/providers/store/useAuthStore";

interface Props {
  partosFiltrados: Parto[] | undefined;
  isLoading: boolean;
  handleRefresh: () => Promise<void>;
  handleEdit: (parto: Parto) => void;
}

const InfoPartoAnimal = ({
  partosFiltrados,
  isLoading,
  handleRefresh,
  handleEdit,
}: Props) => {
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();

  const { data: fincasData } = useFincasPropietarios(cliente?.id ?? "");
  const fincasItems =
    fincasData?.data?.fincas?.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const [selectedCria, setSelectedCria] = useState<{
    partoId: string;
    criaIndex: number;
    hembraId: string;
    fincaMadreId: string;
    identificador: string;
    sexo: string;
    fecha_nacimiento: string;
    peso: number;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fincaId, setFincaId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatearFecha = (fecha: string | Date) => {
    const fechaObj = new Date(fecha);
    return format(fechaObj, "dd/MM/yyyy", { locale: es });
  };

  const mutationCrearAnimal = useMutation({
    mutationFn: (data: CreateAnimalFromCriaData) => ingresarCria(data),
    onSuccess: () => {
      toast.success("Cría registrada como animal exitosamente");
      queryClient.invalidateQueries({ queryKey: ["partos"] });
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      setDialogOpen(false);
      setSelectedCria(null);
      setFincaId("");
      handleRefresh();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al registrar la cría";
        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleRegistrarCria = (cria: any, parto: Parto, index: number) => {
    if (cria.identificador && cria.identificador.includes("ANIMAL-")) {
      toast.info("Esta cría ya ha sido registrada como animal");
      return;
    }

    const fincaMadreId = parto.hembra.finca?.id || "";

    setSelectedCria({
      partoId: parto.id,
      criaIndex: index,
      hembraId: parto.hembra.id,
      fincaMadreId: fincaMadreId,
      identificador: cria.identificador || `CRIA-${Date.now()}`,
      sexo: cria.sexo || "MACHO",
      fecha_nacimiento: cria.fecha_nacimiento || parto.fecha_parto,
      peso: cria.peso || 0,
    });

    setFincaId(fincaMadreId);
    setDialogOpen(true);
  };

  const handleConfirmarRegistro = () => {
    if (!selectedCria) return;
    if (!fincaId) {
      toast.error("Debes seleccionar una finca");
      return;
    }

    const fincaSeleccionada = fincasItems.find((f) => f.value === fincaId);
    if (!fincaSeleccionada) {
      toast.error("La finca seleccionada no es válida");
      return;
    }

    setIsSubmitting(true);

    mutationCrearAnimal.mutate({
      partoId: selectedCria.partoId,
      criaIndex: selectedCria.criaIndex,
      hembraId: selectedCria.hembraId,
      fincaId: fincaId,
      identificador: selectedCria.identificador,
      sexo: selectedCria.sexo,
      fecha_nacimiento: selectedCria.fecha_nacimiento,
      peso: selectedCria.peso,
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Animal</TableHead>
            <TableHead>Finca</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Crías</TableHead>
            <TableHead>Gestación</TableHead>
            <TableHead>Veterinario</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <div className="flex justify-center items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  <span>Cargando partos...</span>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isLoading && (!partosFiltrados || partosFiltrados.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-muted-foreground"
              >
                <MessageError
                  titulo="No se encontraron partos disponibles en este momento"
                  descripcion="En este momento no cuentas con partos disponibles de tus animales, por favor ingresa un parto"
                  onPress={() => handleRefresh()}
                />
              </TableCell>
            </TableRow>
          )}

          {partosFiltrados?.map((parto) => {
            const estadoBadge = getEstadoBadge(parto.estado);

            const criasSinRegistrar = parto.crias?.filter(
              (cria) =>
                !cria.identificador || !cria.identificador.includes("ANIMAL-"),
            );

            return (
              <TableRow key={parto.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div>
                    <span>{parto.hembra.identificador}</span>
                  </div>
                </TableCell>

                <TableCell>{parto.hembra.finca.nombre_finca}</TableCell>

                <TableCell>{formatearFecha(parto.fecha_parto)}</TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {getTipoPartoLabel(parto.tipo_parto)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant={estadoBadge.variant}>
                    {estadoBadge.label}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-green-600" />
                      <span className="font-medium">
                        {parto.numero_crias_vivas}
                      </span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-red-500">
                        {parto.numero_crias_muertas}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({parto.numero_crias} total)
                      </span>
                    </div>

                    {criasSinRegistrar && criasSinRegistrar.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 ml-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              <Badge
                                variant="outline"
                                className="text-yellow-600 border-yellow-400 text-xs"
                              >
                                {criasSinRegistrar.length} pendiente(s)
                              </Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {criasSinRegistrar.length} cría(s) sin registrar
                              como animal
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  {parto.crias && parto.crias.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {parto.crias.map((cria, index) => {
                        const isRegistered =
                          cria.identificador &&
                          cria.identificador.includes("ANIMAL-");
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span>
                                Cría {index + 1}: {cria.sexo || "N/D"}
                              </span>
                              {cria.peso && (
                                <span className="text-muted-foreground">
                                  {cria.peso}kg
                                </span>
                              )}
                              {isRegistered ? (
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-400 text-[10px]"
                                >
                                  ✓ Registrada
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-yellow-600 border-yellow-400 text-[10px]"
                                >
                                  Pendiente
                                </Badge>
                              )}
                            </div>
                            {!isRegistered && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() =>
                                  handleRegistrarCria(cria, parto, index)
                                }
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Registrar
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    <Scissors className="h-3 w-3 text-gray-500" />
                    <span>{parto.dias_gestacion} días</span>
                  </div>
                </TableCell>

                <TableCell>
                  {parto.veterinario_responsable ? (
                    <div className="flex items-center gap-1">
                      <Syringe className="h-3 w-3 text-gray-500" />
                      <span className="text-sm">
                        {parto.veterinario_responsable}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEdit(parto)}
                    variant={"ghost"}
                    className="flex items-center gap-1"
                  >
                    <Pencil className="h-3 w-3 text-gray-500" />
                    <span>Editar</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Cría como Animal</DialogTitle>
            <DialogDescription>
              Completa la información para registrar esta cría como un nuevo
              animal en el sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="identificador">Identificador</Label>
              <Input
                id="identificador"
                value={selectedCria?.identificador || ""}
                onChange={(e) => {
                  if (selectedCria) {
                    setSelectedCria({
                      ...selectedCria,
                      identificador: e.target.value,
                    });
                  }
                }}
                placeholder="Ingresa un identificador único"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sexo">Sexo</Label>
              <Select
                value={selectedCria?.sexo || ""}
                onValueChange={(value) => {
                  if (selectedCria) {
                    setSelectedCria({
                      ...selectedCria,
                      sexo: value,
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MACHO">Macho</SelectItem>
                  <SelectItem value="HEMBRA">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="finca">Finca</Label>
              <Select value={fincaId} onValueChange={setFincaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la finca" />
                </SelectTrigger>
                <SelectContent>
                  {fincasItems.map((finca) => (
                    <SelectItem key={finca.value} value={finca.value}>
                      {finca.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCria?.fincaMadreId && (
                <p className="text-xs text-muted-foreground mt-1">
                  💡 La madre está en la finca:{" "}
                  {fincasItems.find(
                    (f) => f.value === selectedCria.fincaMadreId,
                  )?.label || "No disponible"}
                </p>
              )}
            </div>

            {selectedCria?.peso !== undefined && selectedCria.peso > 0 && (
              <div className="space-y-2">
                <Label>Peso al nacer</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedCria.peso} kg
                </p>
              </div>
            )}

            {selectedCria?.fecha_nacimiento && (
              <div className="space-y-2">
                <Label>Fecha de nacimiento</Label>
                <p className="text-sm text-muted-foreground">
                  {formatearFecha(selectedCria.fecha_nacimiento)}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setSelectedCria(null);
                setFincaId("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarRegistro}
              disabled={
                isSubmitting || !selectedCria?.identificador || !fincaId
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registrando...
                </>
              ) : (
                "Registrar Animal"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InfoPartoAnimal;
