"use client";

import {
  CrearEmpleadoImpuestoProducto,
  CrearImpuestoProducto,
} from "@/api/agroservicio/impuestos/accions/crear-impuesto";
import {
  EditarEmpleadoImpuestoProducto,
  EditarImpuestoProducto,
} from "@/api/agroservicio/impuestos/accions/editar-impuesto";
import { IngresarImpuestoInterface } from "@/api/agroservicio/impuestos/interface/crear-impuesto.interface";
import { ImpuestosAgroProductosInterface } from "@/api/agroservicio/impuestos/interface/response-impuestos-agroservicio.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  onSuccess?: () => void;
  isEdit?: boolean;
  isPropietario: boolean;
  editImpuesto?: ImpuestosAgroProductosInterface | null;
}

const FormImpuestos = ({
  onSuccess,
  isEdit = false,
  isPropietario,
  editImpuesto,
}: Props) => {
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IngresarImpuestoInterface>();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (isEdit && editImpuesto) {
      reset({
        nombre: editImpuesto.nombre,
        porcentaje: editImpuesto.porcentaje,
      });
    }
  }, [editImpuesto, isEdit, reset]);

  const mutationCrear = useMutation({
    mutationFn: (data: IngresarImpuestoInterface) =>
      isPropietario
        ? CrearImpuestoProducto(data)
        : CrearEmpleadoImpuestoProducto(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["impuestos-agro"],
      });

      toast.success("Impuesto creado exitosamente");
      onSuccess?.();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el impuesto";

        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al crear el impuesto.");
      }
    },
  });

  const mutationEditar = useMutation({
    mutationFn: (data: IngresarImpuestoInterface) =>
      isPropietario
        ? EditarImpuestoProducto(editImpuesto?.id ?? "", data)
        : EditarEmpleadoImpuestoProducto(editImpuesto?.id ?? "", data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["impuestos-agro"],
      });

      toast.success("Impuesto actualizado exitosamente");
      onSuccess?.();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el impuesto";

        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al actualizar el impuesto.");
      }
    },
  });

  const onSubmit = (data: IngresarImpuestoInterface) => {
    if (isEdit && editImpuesto) {
      mutationEditar.mutate({ ...data, porcentaje: Number(data.porcentaje) });
    } else {
      mutationCrear.mutate({ ...data, porcentaje: Number(data.porcentaje) });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-muted-foreground">
          Información del Impuesto
        </h3>

        <div className="space-y-2">
          <Label className="font-semibold">
            Nombre <span className="text-red-500">*</span>
          </Label>

          <Input
            placeholder="Ej. ISV 15%"
            {...register("nombre", {
              required: "El nombre del impuesto es requerido",
              maxLength: {
                value: 100,
                message: "Máximo 100 caracteres",
              },
            })}
          />

          {errors.nombre && (
            <p className="text-sm text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">
            Porcentaje (%) <span className="text-red-500">*</span>
          </Label>

          <Input
            type="number"
            step="0.01"
            min={0}
            max={100}
            placeholder="15.00"
            {...register("porcentaje", {
              required: "El porcentaje es requerido",
              validate: (value) => {
                const numero = Number(value);

                if (isNaN(numero)) return "Debe ingresar un número";

                if (numero < 0 || numero > 100)
                  return "Debe estar entre 0 y 100";

                return true;
              },
            })}
          />

          {errors.porcentaje && (
            <p className="text-sm text-red-500">{errors.porcentaje.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
          Cancelar
        </Button>

        <Button type="submit">
          {isEdit ? "Actualizar Impuesto" : "Crear Impuesto"}
        </Button>
      </div>
    </form>
  );
};

export default FormImpuestos;
