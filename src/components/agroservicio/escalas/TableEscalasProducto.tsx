import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Save, X, Loader2, MoreVertical } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AgroProducto } from "@/api/agroservicio/productos/interface/response-productos-agro.interface";
import { Escala } from "@/api/agroservicio/escala-producto/interfaces/response-escala-producto.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetEscalasProducto from "@/hooks/agroservicios/escalas-producto/useGetEscalasProducto";
import useGetAllProveedores from "@/hooks/agroservicios/proveedores/useGetAllProveedores";
import { CrearEscalaProductoInterface } from "@/api/agroservicio/escala-producto/interfaces/crear-escala-producto.interface";
import { CrearEscalaProducto } from "@/api/agroservicio/escala-producto/accions/crear-escala-producto";
import { ActualizarEscalaProducto } from "@/api/agroservicio/escala-producto/accions/actualizar-escala-producto";
import SkeletonTable from "@/components/generics/SkeletonTable";
import { MessageError } from "@/components/generics/MessageError";

interface Props {
  paisId: string;
  propietarioId: string;
  moneda: string;
  selectedProducto: AgroProducto | null;
}

interface EscalaLocal extends Escala {
  editing?: boolean;
}

interface ActualizarEscalaInterface {
  cantidad_comprada: number;
  bonificacion: number;
  costo: number;
  isActive?: boolean;
}

interface StatusUpdate {
  isActive?: boolean;
}

const TableEscalasProducto = ({
  paisId,
  propietarioId,
  moneda,
  selectedProducto,
}: Props) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const limit = 10;
  const offset = page * limit;
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedEscala, setSelectedEscala] = useState<EscalaLocal | null>(
    null,
  );
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const { data: escalasData, isLoading } = useGetEscalasProducto(
    limit,
    offset,
    selectedProducto?.id ?? "",
  );

  const { data: proveedores } = useGetAllProveedores(propietarioId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearEscalaProductoInterface>();

  const [escalas, setEscalas] = useState<EscalaLocal[]>([]);

  const createMutation = useMutation({
    mutationFn: CrearEscalaProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["escalas-producto", limit, offset, selectedProducto?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["escalas-proveedor-producto"],
      });
      toast.success("Escala creada exitosamente");
      reset();
      setSelectedProveedor("");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear la escala";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear la escala. Inténtalo de nuevo.",
        );
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      cantidad_comprada: number;
      bonificacion: number;
      costo: number;
    }) => {
      const updateData: ActualizarEscalaInterface = {
        cantidad_comprada: data.cantidad_comprada,
        bonificacion: data.bonificacion,
        costo: data.costo,
      };
      return ActualizarEscalaProducto(data.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["escalas-producto", limit, offset, selectedProducto?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["escalas-proveedor-producto"],
      });
      toast.success("Escala actualizada exitosamente");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar la escala";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar la escala. Inténtalo de nuevo.",
        );
      }
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (data: { id: string; isActive: boolean }) => {
      const updateData: StatusUpdate = {
        isActive: data.isActive,
      };
      return ActualizarEscalaProducto(data.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["escalas-producto", limit, offset, selectedProducto?.id],
      });
      toast.success("Estado de la escala actualizado exitosamente");
      setIsStatusModalOpen(false);
      setSelectedEscala(null);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el estado de la escala";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el estado de la escala. Inténtalo de nuevo.",
        );
      }
      setIsStatusModalOpen(false);
      setSelectedEscala(null);
    },
  });

  React.useEffect(() => {
    if (escalasData?.data) {
      setEscalas(
        escalasData.data.map((escala) => ({
          ...escala,
          editing: false,
        })),
      );
    }
  }, [escalasData]);

  const totalPages = Math.ceil((escalasData?.total || 0) / limit);

  const onSubmit = (data: CrearEscalaProductoInterface) => {
    if (!selectedProducto) {
      toast.error("Debe seleccionar un producto");
      return;
    }

    createMutation.mutate({
      ...data,
      productoId: selectedProducto.id,
      paisId: paisId,
    });
  };

  const toggleEdit = (id: string) => {
    setEscalas(
      escalas.map((escala) =>
        escala.id === id
          ? { ...escala, editing: !escala.editing }
          : { ...escala, editing: false },
      ),
    );
  };

  const handleSave = (id: string) => {
    const escalaEditada = escalas.find((e) => e.id === id);
    if (!escalaEditada) return;

    updateMutation.mutate({
      id: escalaEditada.id,
      cantidad_comprada: escalaEditada.cantidad_comprada,
      bonificacion: escalaEditada.bonificacion,
      costo: escalaEditada.costo,
    });

    toggleEdit(id);
  };

  const openStatusModal = (escala: EscalaLocal) => {
    setSelectedEscala(escala);
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = (newStatus: boolean) => {
    if (!selectedEscala) return;

    toggleStatusMutation.mutate({
      id: selectedEscala.id,
      isActive: newStatus,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleCantidadChange = (id: string, value: string) => {
    const numericValue = parseInt(value) || 1;
    setEscalas(
      escalas.map((e) =>
        e.id === id ? { ...e, cantidad_comprada: numericValue } : e,
      ),
    );
  };

  const handleBonificacionChange = (id: string, value: string) => {
    const numericValue = parseInt(value) || 0;
    setEscalas(
      escalas.map((e) =>
        e.id === id ? { ...e, bonificacion: numericValue } : e,
      ),
    );
  };

  const handleCostoChange = (id: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setEscalas(
      escalas.map((e) => (e.id === id ? { ...e, costo: numericValue } : e)),
    );
  };

  if (isLoading) {
    return <SkeletonTable />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Agregar Nueva Escala</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
        >
          <div className="space-y-2">
            <Label htmlFor="proveedorId" className="font-bold">
              Proveedor
            </Label>
            <Select
              value={selectedProveedor}
              onValueChange={(value) => {
                setValue("proveedorId", value);
                setSelectedProveedor(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un proveedor" />
              </SelectTrigger>
              <SelectContent>
                {proveedores?.map((proveedor) => (
                  <SelectItem key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre_legal} - {proveedor.nit_rtn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.proveedorId && (
              <p className="text-destructive text-xs mt-1">
                {errors.proveedorId.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Compra Mínima
            </label>
            <Input
              type="number"
              min="1"
              {...register("cantidad_comprada", {
                required: "La compra mínima es requerida",
                min: {
                  value: 1,
                  message: "La compra mínima debe ser al menos 1",
                },
                valueAsNumber: true,
              })}
              placeholder="Cantidad mínima"
              className={errors.cantidad_comprada ? "border-destructive" : ""}
            />
            {errors.cantidad_comprada && (
              <p className="text-destructive text-xs mt-1">
                {errors.cantidad_comprada.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Bonificación
            </label>
            <Input
              type="number"
              min="0"
              {...register("bonificacion", {
                required: "La bonificación es requerida",
                min: {
                  value: 0,
                  message: "La bonificación no puede ser negativa",
                },
                valueAsNumber: true,
              })}
              placeholder="Unidades bonus"
              className={errors.bonificacion ? "border-destructive" : ""}
            />
            {errors.bonificacion && (
              <p className="text-destructive text-xs mt-1">
                {errors.bonificacion.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Costo {moneda}
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              {...register("costo", {
                required: "El costo es requerido",
                min: { value: 0, message: "El costo no puede ser negativo" },
                valueAsNumber: true,
              })}
              placeholder="0.00"
              className={errors.costo ? "border-destructive" : ""}
            />
            {errors.costo && (
              <p className="text-destructive text-xs mt-1">
                {errors.costo.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending || !selectedProducto}
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-1" />
            )}
            {createMutation.isPending ? "Creando..." : "Agregar"}
          </Button>
        </form>
      </div>

      <Table>
        <TableCaption>Escalas de precios por volumen de compra</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Producto</TableHead>
            <TableHead className="text-center">Proveedor</TableHead>
            <TableHead className="text-center">Compra Mínima</TableHead>
            <TableHead className="text-center">Bonificación</TableHead>
            <TableHead className="text-center">Costo Unitario</TableHead>
            <TableHead className="text-center">Activa</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {escalas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                <MessageError
                  titulo="No se encontraron escalas"
                  descripcion="En este momento no se encontraron escalas configuradas para el producto seleccionado"
                />
              </TableCell>
            </TableRow>
          ) : (
            escalas.map((escala) => (
              <TableRow key={escala.id}>
                <TableCell className="font-medium text-center">
                  {escala.producto.nombre}
                </TableCell>
                <TableCell className="text-center">
                  {escala.proveedor?.nombre_legal || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Input
                      type="number"
                      min="1"
                      value={escala.cantidad_comprada}
                      onChange={(e) =>
                        handleCantidadChange(escala.id, e.target.value)
                      }
                      className="w-20"
                      disabled={!escala.editing || updateMutation.isPending}
                    />
                  </div>
                </TableCell>
                <TableCell className="flex justify-center">
                  <Input
                    type="number"
                    min="0"
                    value={escala.bonificacion}
                    onChange={(e) =>
                      handleBonificacionChange(escala.id, e.target.value)
                    }
                    className="w-20 text-right"
                    disabled={!escala.editing || updateMutation.isPending}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm">{moneda}</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={escala.costo}
                      onChange={(e) =>
                        handleCostoChange(escala.id, e.target.value)
                      }
                      className="w-24 text-right"
                      disabled={!escala.editing || updateMutation.isPending}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      escala.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {escala.isActive ? "Sí" : "No"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    {!escala.editing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEdit(escala.id)}
                          disabled={updateMutation.isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => openStatusModal(escala)}
                            >
                              Cambiar Estado
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEdit(escala.id)}
                          disabled={updateMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSave(escala.id)}
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cambiar Estado de la Escala</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres{" "}
              {selectedEscala?.isActive ? "desactivar" : "activar"} esta escala?
              <br />
              <br />
              <strong>Producto:</strong> {selectedEscala?.producto.nombre}
              <br />
              <strong>Proveedor:</strong>{" "}
              {selectedEscala?.proveedor?.nombre_legal}
              <br />
              <strong>Compra Mínima:</strong>{" "}
              {selectedEscala?.cantidad_comprada} unidades
              <br />
              <strong>Bonificación:</strong> {selectedEscala?.bonificacion}{" "}
              unidades
              <br />
              <strong>Costo:</strong> {moneda} {selectedEscala?.costo}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={toggleStatusMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusChange(!selectedEscala?.isActive)}
              disabled={toggleStatusMutation.isPending}
              className={
                selectedEscala?.isActive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {toggleStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {selectedEscala?.isActive ? "Desactivar" : "Activar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {totalPages > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(page - 1)}
                className={page === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber =
                Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
              if (pageNumber >= totalPages) return null;

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(page + 1)}
                className={
                  page >= totalPages - 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {escalasData && escalasData.total > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Mostrando {escalas.length} de {escalasData.total} escalas
        </div>
      )}
    </div>
  );
};

export default TableEscalasProducto;
