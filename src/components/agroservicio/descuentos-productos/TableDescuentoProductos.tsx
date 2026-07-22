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
import {
  Plus,
  Edit,
  Save,
  X,
  Trash2,
  Percent,
  Loader2,
  MoreVertical,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
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
import { ResponseDescuentoInterface } from "@/api/agroservicio/descuentos_producto/interface/response-descuento-producto.interface";
import { AgroProducto } from "@/api/agroservicio/productos/interface/response-productos-agro.interface";
import useGetDescuentoProducto from "@/hooks/agroservicios/descuento-productos/useGetDescuentoProducto";
import useGetAllProveedores from "@/hooks/agroservicios/proveedores/useGetAllProveedores";
import { CrearDescuentoInterface } from "@/api/agroservicio/descuentos_producto/interface/crear-descuento-producto.interface";
import { CrearDescuentoProducto } from "@/api/agroservicio/descuentos_producto/accions/crear-descuento-producto";
import { ActualizarDescuentoProducto } from "@/api/agroservicio/descuentos_producto/accions/actualizar-descuentos";
import { MessageError } from "@/components/generics/MessageError";

interface Props {
  paisId: string;
  propietarioId: string;
  selectedProducto: AgroProducto | null;
}

interface DescuentoLocal extends ResponseDescuentoInterface {
  editing?: boolean;
}

interface ActualizarDescuentoInterface {
  cantidad_comprada: number;
  descuentos: number;
  isActive?: boolean;
}

interface StatusUpdate {
  isActive?: boolean;
}

const TableDescuentoProductos = ({
  selectedProducto,
  paisId,
  propietarioId,
}: Props) => {
  const queryClient = useQueryClient();
  const { data: descuentosData, isLoading } = useGetDescuentoProducto(
    selectedProducto?.id ?? "",
  );
  const { data: proveedores } = useGetAllProveedores(propietarioId);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedDescuento, setSelectedDescuento] =
    useState<DescuentoLocal | null>(null);
  const [selectedProveedor, setSelectedProveedor] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearDescuentoInterface>();
  const [descuentos, setDescuentos] = useState<DescuentoLocal[]>([]);

  const createMutation = useMutation({
    mutationFn: CrearDescuentoProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["descuento-producto", selectedProducto?.id],
      });
      toast.success("Descuento creado exitosamente");
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
            : "Hubo un error al crear los descuentos";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear los descuentos. Inténtalo de nuevo.",
        );
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      cantidad_comprada: number;
      descuentos: number;
    }) => {
      const updateData: ActualizarDescuentoInterface = {
        cantidad_comprada: data.cantidad_comprada,
        descuentos: data.descuentos,
      };
      return ActualizarDescuentoProducto(data.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["descuento-producto", selectedProducto?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["descuento-proveedor-producto", selectedProducto?.id],
      });
      toast.success("Descuento actualizado exitosamente");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al editar los descuentos";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de editar los descuentos. Inténtalo de nuevo.",
        );
      }
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (data: { id: string; isActive: boolean }) => {
      const updateData: StatusUpdate = {
        isActive: data.isActive,
      };
      return ActualizarDescuentoProducto(data.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["descuento-producto", selectedProducto?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["descuento-proveedor-producto", selectedProducto?.id],
      });
      toast.success("Estado del descuento actualizado exitosamente");
      setIsStatusModalOpen(false);
      setSelectedDescuento(null);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el estado del descuento";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el estado del descuento. Inténtalo de nuevo.",
        );
      }
      setIsStatusModalOpen(false);
      setSelectedDescuento(null);
    },
  });

  React.useEffect(() => {
    if (descuentosData) {
      setDescuentos(
        descuentosData.map((descuento) => ({
          ...descuento,
          editing: false,
        })),
      );
    }
  }, [descuentosData]);

  const toggleEdit = (id: string) => {
    setDescuentos(
      descuentos.map((descuento) =>
        descuento.id === id
          ? { ...descuento, editing: !descuento.editing }
          : { ...descuento, editing: false },
      ),
    );
  };

  const handleSave = (id: string) => {
    const descuentoEditado = descuentos.find((d) => d.id === id);
    if (!descuentoEditado) return;

    updateMutation.mutate({
      id: descuentoEditado.id,
      cantidad_comprada: descuentoEditado.cantidad_comprada,
      descuentos: descuentoEditado.descuentos,
    });

    toggleEdit(id);
  };

  const openStatusModal = (descuento: DescuentoLocal) => {
    setSelectedDescuento(descuento);
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = (newStatus: boolean) => {
    if (!selectedDescuento) return;

    toggleStatusMutation.mutate({
      id: selectedDescuento.id,
      isActive: newStatus,
    });
  };

  const onSubmit = (data: CrearDescuentoInterface) => {
    if (!selectedProducto) return;

    createMutation.mutate({
      ...data,
      productoId: selectedProducto.id,
      paisId: paisId,
    });
  };

  if (isLoading) {
    return <TableUsersSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Agregar Nuevo Descuento</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
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
              Cantidad Mínima
            </label>
            <Input
              type="number"
              min="1"
              {...register("cantidad_comprada", {
                required: "La cantidad es requerida",
                min: { value: 1, message: "La cantidad mínima es 1" },
                valueAsNumber: true,
              })}
              placeholder="Cantidad"
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
              Descuento (%)
            </label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="100"
                {...register("descuentos", {
                  required: "El descuento es requerido",
                  min: { value: 0, message: "El descuento mínimo es 0%" },
                  max: { value: 100, message: "El descuento máximo es 100%" },
                  valueAsNumber: true,
                })}
                placeholder="0"
                className={`pr-8 ${errors.descuentos ? "border-destructive" : ""}`}
              />
              <Percent className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.descuentos && (
              <p className="text-destructive text-xs mt-1">
                {errors.descuentos.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedProducto || createMutation.isPending}
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
        <TableCaption>Descuentos por volumen de compra</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Producto</TableHead>
            <TableHead className="text-center">Proveedor</TableHead>
            <TableHead className="text-center">Cantidad Mínima</TableHead>
            <TableHead className="text-center">Descuento</TableHead>
            <TableHead className="text-center">Activa</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {descuentos && descuentos.length > 0 ? (
            descuentos.map((descuento) => (
              <TableRow key={descuento.id}>
                <TableCell className="text-center">
                  {descuento.producto?.nombre || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  {descuento.proveedor.nombre_legal || "N/A"}
                </TableCell>
                <TableCell className="flex justify-center">
                  <Input
                    type="number"
                    min="1"
                    value={descuento.cantidad_comprada}
                    onChange={(e) =>
                      setDescuentos(
                        descuentos.map((d) =>
                          d.id === descuento.id
                            ? {
                                ...d,
                                cantidad_comprada:
                                  parseInt(e.target.value) || 1,
                              }
                            : d,
                        ),
                      )
                    }
                    className="w-20 text-right"
                    disabled={!descuento.editing}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={descuento.descuentos}
                      onChange={(e) =>
                        setDescuentos(
                          descuentos.map((d) =>
                            d.id === descuento.id
                              ? {
                                  ...d,
                                  descuentos: parseInt(e.target.value) || 0,
                                }
                              : d,
                          ),
                        )
                      }
                      className="w-20 text-right"
                      disabled={!descuento.editing}
                    />
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      descuento.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {descuento.isActive ? "Sí" : "No"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    {!descuento.editing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEdit(descuento.id)}
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
                              onClick={() => openStatusModal(descuento)}
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
                          onClick={() => toggleEdit(descuento.id)}
                          disabled={updateMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSave(descuento.id)}
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
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                <MessageError
                  titulo="No se encontraron descuentos"
                  descripcion="En este momento no se encuentran descuentos disponibles para este producto"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cambiar Estado del Descuento</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres{" "}
              {selectedDescuento?.isActive ? "desactivar" : "activar"} este
              descuento?
              <br />
              <br />
              <strong>Producto:</strong> {selectedDescuento?.producto?.nombre}
              <br />
              <strong>Proveedor:</strong>{" "}
              {selectedDescuento?.proveedor?.nombre_legal}
              <br />
              <strong>Cantidad Mínima:</strong>{" "}
              {selectedDescuento?.cantidad_comprada} unidades
              <br />
              <strong>Descuento:</strong> {selectedDescuento?.descuentos}%
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={toggleStatusMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusChange(!selectedDescuento?.isActive)}
              disabled={toggleStatusMutation.isPending}
              className={
                selectedDescuento?.isActive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {toggleStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {selectedDescuento?.isActive ? "Desactivar" : "Activar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TableDescuentoProductos;
