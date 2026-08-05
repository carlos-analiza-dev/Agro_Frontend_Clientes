"use client";
import { CrearAgroInsumoInterface } from "@/api/agroservicio/insumos/interfaces/crear-agro-insumo.interface";
import { AgroInsumo } from "@/api/agroservicio/insumos/interfaces/response-agro-insumos.interface";
import { UnidadVenta } from "@/api/agroservicio/insumos/interfaces/response-agro-insumos.interface";
import {
  ingresarAgroInsumo,
  ingresarAgroInsumoEmpleados,
} from "@/api/agroservicio/insumos/accions/ingresar-insumo";
import {
  editarAgroInsumo,
  editarAgroInsumoEmpleados,
} from "@/api/agroservicio/insumos/accions/editar-insumo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetAllProveedores from "@/hooks/agroservicios/proveedores/useGetAllProveedores";
import useGetMarcasActivas from "@/hooks/marcas/useGetMarcasActivas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  propietarioId: string;
  isEmpleado: boolean;
  editInsumo: AgroInsumo | null;
  isEdit?: boolean;
  Success?: () => void;
}

const FormAgroInsumos = ({
  propietarioId,
  isEmpleado,
  editInsumo,
  isEdit = false,
  Success,
}: Props) => {
  const queryClient = useQueryClient();

  const { data: marcasActivas } = useGetMarcasActivas({
    is_market: false,
  });
  const { data: proveedoresActivos } = useGetAllProveedores(propietarioId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearAgroInsumoInterface>({
    defaultValues: {
      unidad_venta: UnidadVenta.UNIDAD,
    },
  });

  useEffect(() => {
    if (isEdit && editInsumo) {
      reset({
        nombre: editInsumo.nombre,
        costo: Number(editInsumo.costo),
        marcaId: editInsumo.marca?.id || "",
        proveedorId: editInsumo.proveedor?.id || "",
        unidad_venta: editInsumo.unidad_venta || UnidadVenta.UNIDAD,
      });
    }
  }, [isEdit, editInsumo, reset]);

  const mutation = useMutation({
    mutationFn: (data: CrearAgroInsumoInterface) => {
      const payload = {
        ...data,
        costo: Number(data.costo),
      };
      return isEmpleado
        ? ingresarAgroInsumoEmpleados(payload)
        : ingresarAgroInsumo(payload);
    },
    onSuccess: () => {
      toast.success("Insumo creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["agro-insumos"] });
      reset();
      Success?.();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el insumo";
        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al crear el insumo. Inténtalo de nuevo.");
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearAgroInsumoInterface) => {
      const payload = {
        ...data,
        costo: Number(data.costo),
      };
      return isEmpleado
        ? editarAgroInsumoEmpleados(editInsumo?.id || "", payload)
        : editarAgroInsumo(editInsumo?.id || "", payload);
    },
    onSuccess: () => {
      toast.success("Insumo actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["agro-insumos"] });
      reset();
      Success?.();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el insumo";
        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al actualizar el insumo. Inténtalo de nuevo.",
        );
      }
    },
  });

  const onSubmit = (data: CrearAgroInsumoInterface) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate(data);
    }
  };

  const unidadesMedida = Object.values(UnidadVenta).map((value) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nombre" className="font-bold">
          Nombre del Insumo*
        </Label>
        <Input
          id="nombre"
          {...register("nombre", {
            required: "El nombre del insumo es requerido",
            minLength: {
              value: 3,
              message: "El nombre debe tener al menos 3 caracteres",
            },
            maxLength: {
              value: 100,
              message: "El nombre no puede tener más de 100 caracteres",
            },
          })}
          placeholder="Ej: Fertilizante NPK 15-15-15"
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="costo" className="font-bold">
          Costo*
        </Label>
        <Input
          id="costo"
          type="number"
          step="0.01"
          min={1}
          {...register("costo", {
            required: "El costo es requerido",
            min: { value: 0, message: "El costo no puede ser negativo" },
          })}
          placeholder="0.00"
        />
        {errors.costo && (
          <p className="text-sm font-medium text-red-500">
            {errors.costo.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="marcaId" className="font-bold">
          Marca
        </Label>
        <Select
          onValueChange={(value) => setValue("marcaId", value)}
          defaultValue={isEdit ? editInsumo?.marca?.id : ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una marca" />
          </SelectTrigger>
          <SelectContent>
            {marcasActivas?.map((marca) => (
              <SelectItem key={marca.id} value={marca.id}>
                {marca.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="proveedorId" className="font-bold">
          Proveedor*
        </Label>
        <Select
          onValueChange={(value) => setValue("proveedorId", value)}
          defaultValue={isEdit ? editInsumo?.proveedor?.id : ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un proveedor" />
          </SelectTrigger>
          <SelectContent>
            {proveedoresActivos?.map((proveedor) => (
              <SelectItem key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre_legal} - {proveedor.nit_rtn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.proveedorId && (
          <p className="text-sm font-medium text-red-500">
            {errors.proveedorId.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="unidad_venta" className="font-bold">
          Unidad de Venta*
        </Label>
        <Select
          defaultValue={isEdit ? editInsumo?.unidad_venta : UnidadVenta.UNIDAD}
          onValueChange={(value) =>
            setValue("unidad_venta", value as UnidadVenta)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona la unidad" />
          </SelectTrigger>
          <SelectContent>
            {unidadesMedida.map((unidad) => (
              <SelectItem key={unidad.value} value={unidad.value}>
                {unidad.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.unidad_venta && (
          <p className="text-sm font-medium text-red-500">
            {errors.unidad_venta.message as string}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {isEdit && (
          <Button
            variant={"outline"}
            type="button"
            onClick={() => {
              if (isEdit && editInsumo) {
                Success?.();
              }
            }}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
          className="min-w-[150px]"
        >
          {mutation.isPending || mutationUpdate.isPending ? (
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
              {isEdit ? "Actualizando..." : "Creando..."}
            </>
          ) : (
            <>{isEdit ? "Actualizar Insumo" : "Crear Insumo"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormAgroInsumos;
