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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  Calendar,
  MapPin,
  Tag,
  ChevronRight,
  Trash,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";
import RenderIntensidadBadge from "./RenderIntensidadBadge";
import {
  Celo,
  ResponseCelosAnimalInterface,
} from "@/api/reproduccion/interfaces/response-celos-animal,interface";
import Modal from "@/components/generics/Modal";
import DetailsCelo from "./DetailsCelo";
import FormCelosAnimal from "./FormCelosAnimal";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { eliminarCelo } from "@/api/reproduccion/accions/celos/eliminar-celo";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";

interface Props {
  data: ResponseCelosAnimalInterface | undefined;
  setSelectedCelo: Dispatch<SetStateAction<Celo | null>>;
  setDetalleOpen: Dispatch<SetStateAction<boolean>>;
  detalleOpen: boolean;
  selectedCelo: Celo | null;
  hembras: Animal[] | undefined;
}

const TableCelos = ({
  data,
  setSelectedCelo,
  setDetalleOpen,
  detalleOpen,
  selectedCelo,
  hembras,
}: Props) => {
  const isExtraSmall = useMediaQuery("(max-width: 400px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const queryClient = useQueryClient();
  const [celoAEliminar, setCeloAEliminar] = useState<Celo | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [celoAEditar, setCeloAEditar] = useState<Celo | null>(null);

  const mutationDelete = useMutation({
    mutationFn: (id: string) => eliminarCelo(id),
    onSuccess: () => {
      toast.success("Celo eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["celos-animal"] });
      setConfirmDeleteOpen(false);
      setCeloAEliminar(null);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al eliminar el celo";
        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    },
  });

  const handleDeleteClick = (celo: Celo) => {
    setCeloAEliminar(celo);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (celoAEliminar) {
      mutationDelete.mutate(celoAEliminar.id);
    }
  };

  const handleEditClick = (celo: Celo) => {
    setCeloAEditar(celo);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setCeloAEditar(null);
  };

  const MobileView = () => (
    <div className="space-y-3 p-4">
      {data?.celos?.map((celo) => (
        <Card key={celo.id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {celo.animal.identificador}
                  <Badge variant="outline" className="text-xs">
                    N° {celo.numeroCelo}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  {celo.animal.especie.nombre} •{" "}
                  {celo.animal.finca.nombre_finca}
                </CardDescription>
              </div>
              <RenderIntensidadBadge intensidad={celo.intensidad} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 pb-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">Inicio</span>
                </div>
                <p className="text-xs font-medium">
                  {format(new Date(celo.fechaInicio), "dd/MM/yy HH:mm")}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">Fin</span>
                </div>
                {celo.fechaFin ? (
                  <p className="text-xs font-medium">
                    {format(new Date(celo.fechaFin), "dd/MM/yy HH:mm")}
                  </p>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Activo
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {celo.metodo_deteccion}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    setSelectedCelo(celo);
                    setDetalleOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => handleEditClick(celo)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteClick(celo)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const TabletView = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Animal</TableHead>
            <TableHead>Especie/Finca</TableHead>
            <TableHead>Periodo</TableHead>
            <TableHead>N°</TableHead>
            <TableHead>Intensidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.celos?.map((celo) => (
            <TableRow key={celo.id}>
              <TableCell className="font-medium">
                {celo.animal.identificador}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{celo.animal.especie.nombre}</div>
                  <div className="text-xs text-muted-foreground">
                    {celo.animal.finca.nombre_finca}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{format(new Date(celo.fechaInicio), "dd/MM HH:mm")}</div>
                  <div className="text-xs text-muted-foreground">
                    {celo.fechaFin ? (
                      format(new Date(celo.fechaFin), "dd/MM HH:mm")
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Activo
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{celo.numeroCelo}</TableCell>
              <TableCell>
                <RenderIntensidadBadge intensidad={celo.intensidad} />
              </TableCell>
              <TableCell>
                <Badge>{celo.estado}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCelo(celo);
                    setDetalleOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => handleEditClick(celo)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteClick(celo)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const DesktopView = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Animal</TableHead>
            <TableHead>Especie</TableHead>
            <TableHead>Finca</TableHead>
            <TableHead>Inicio</TableHead>
            <TableHead>Fin</TableHead>
            <TableHead>N° Celo</TableHead>
            <TableHead>Intensidad</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.celos?.map((celo) => (
            <TableRow key={celo.id}>
              <TableCell className="font-medium whitespace-nowrap">
                {celo.animal.identificador}
              </TableCell>
              <TableCell>{celo.animal.especie.nombre}</TableCell>
              <TableCell className="whitespace-nowrap">
                {celo.animal.finca.nombre_finca}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {format(new Date(celo.fechaInicio), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {celo.fechaFin ? (
                  format(new Date(celo.fechaFin), "dd/MM/yyyy HH:mm")
                ) : (
                  <Badge variant="secondary">Activo</Badge>
                )}
              </TableCell>
              <TableCell>{celo.numeroCelo}</TableCell>
              <TableCell>
                <RenderIntensidadBadge intensidad={celo.intensidad} />
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {celo.metodo_deteccion}
              </TableCell>
              <TableCell>
                <Badge>{celo.estado}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCelo(celo);
                    setDetalleOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => handleEditClick(celo)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteClick(celo)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const ExtraSmallMobileView = () => (
    <div className="space-y-2 p-2">
      {data?.celos?.map((celo) => (
        <div
          key={celo.id}
          className="bg-card border rounded-lg p-3"
          onClick={() => {
            setSelectedCelo(celo);
            setDetalleOpen(true);
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="font-medium text-sm">
                {celo.animal.identificador}
              </div>
              <Badge variant="outline" className="text-[10px] px-1">
                #{celo.numeroCelo}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <RenderIntensidadBadge intensidad={celo.intensidad} />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(celo);
                }}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(celo);
                }}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground mb-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{celo.animal.finca.nombre_finca}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span className="truncate">{celo.animal.especie.nombre}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span>{format(new Date(celo.fechaInicio), "dd/MM")}</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <span>
                {celo.fechaFin
                  ? format(new Date(celo.fechaFin), "dd/MM")
                  : "Actual"}
              </span>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              {celo.metodo_deteccion}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {isExtraSmall ? (
        <ExtraSmallMobileView />
      ) : isMobile ? (
        <MobileView />
      ) : isTablet ? (
        <TabletView />
      ) : (
        <DesktopView />
      )}

      <Modal
        open={detalleOpen}
        onOpenChange={setDetalleOpen}
        title="Detalles del Celo"
        description="Información completa del registro de celo"
        size={isMobile ? "full" : "xl"}
        height="md"
        className={isMobile ? "p-4" : ""}
      >
        {selectedCelo && <DetailsCelo selectedCelo={selectedCelo} />}
      </Modal>

      <Modal
        open={editModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open);
          if (!open) setCeloAEditar(null);
        }}
        title="Editar Celo"
        description="Edita los datos del registro de celo"
        size={isMobile ? "full" : "xl"}
        height="auto"
        className={isMobile ? "p-4" : ""}
      >
        {celoAEditar && (
          <FormCelosAnimal
            celo={celoAEditar}
            setOpenModal={setEditModalOpen}
            onSuccess={handleEditSuccess}
            hembras={hembras}
          />
        )}
      </Modal>

      <Modal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar el celo N° ${celoAEliminar?.numeroCelo} del animal ${celoAEliminar?.animal.identificador}?`}
        size="md"
        height="auto"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              <span className="font-semibold">Advertencia:</span> Esta acción no
              se puede deshacer. Se eliminará permanentemente el registro de
              celo.
            </p>
            {celoAEliminar && (
              <div className="mt-2 text-xs text-red-600 space-y-1">
                <p>
                  <span className="font-medium">Animal:</span>{" "}
                  {celoAEliminar.animal.identificador}
                </p>
                <p>
                  <span className="font-medium">Fecha de inicio:</span>{" "}
                  {format(
                    new Date(celoAEliminar.fechaInicio),
                    "dd/MM/yyyy HH:mm",
                  )}
                </p>
                <p>
                  <span className="font-medium">Intensidad:</span>{" "}
                  {celoAEliminar.intensidad}
                </p>
                <p>
                  <span className="font-medium">Método:</span>{" "}
                  {celoAEliminar.metodo_deteccion}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfirmDeleteOpen(false);
                setCeloAEliminar(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={mutationDelete.isPending}
            >
              {mutationDelete.isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TableCelos;
