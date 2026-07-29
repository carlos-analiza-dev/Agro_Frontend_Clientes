"use client";

import { CrearRangoAgroInterface } from "@/api/agroservicio/facturacion/interface/crear-agro-rango.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  ingresarAgroRangosFactura,
  ingresarAgroRangosFacturaEmpleado,
} from "@/api/agroservicio/facturacion/accions/ingresar-agro-rangos";
import {
  editarAgroRangosFactura,
  editarAgroRangosFacturaEmpleado,
} from "@/api/agroservicio/facturacion/accions/editar-agro-rangos";
import { Rangos } from "@/api/agroservicio/facturacion/interface/response-agro-rangos-factura.interface";

interface Props {
  onSuccess?: () => void;
  isEdit?: boolean;
  isPropietario: boolean;
  editRango?: Rangos | null;
}

const FormAgroRangosFactura = ({
  onSuccess,
  isEdit = false,
  isPropietario,
  editRango,
}: Props) => {
  const {
    reset,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearRangoAgroInterface>({
    defaultValues: {
      is_active: true,
      rango_inicial: 1,
      rango_final: 1,
    },
  });

  const queryClient = useQueryClient();
  const fechaRecepcion = watch("fecha_recepcion");
  const fechaLimite = watch("fecha_limite_emision");

  useEffect(() => {
    if (isEdit && editRango) {
      reset({
        cai: editRango.cai,
        prefijo: editRango.prefijo,
        rango_inicial: editRango.rango_inicial,
        rango_final: editRango.rango_final,
        fecha_recepcion: format(
          new Date(editRango.fecha_recepcion),
          "yyyy-MM-dd",
        ),
        fecha_limite_emision: format(
          new Date(editRango.fecha_limite_emision),
          "yyyy-MM-dd",
        ),
        is_active: editRango.is_active,
      });
    }
  }, [editRango, isEdit, reset]);

  const mutationCrear = useMutation({
    mutationFn: (data: CrearRangoAgroInterface) =>
      isPropietario
        ? ingresarAgroRangosFactura(data)
        : ingresarAgroRangosFacturaEmpleado(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agro-rangos"],
      });

      toast.success("Rango de factura creado exitosamente");
      onSuccess?.();
      reset();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el rango";

        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al crear el rango.");
      }
    },
  });

  const mutationEditar = useMutation({
    mutationFn: (data: CrearRangoAgroInterface) =>
      isPropietario
        ? editarAgroRangosFactura(editRango?.id ?? "", data)
        : editarAgroRangosFacturaEmpleado(editRango?.id ?? "", data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agro-rangos"],
      });

      toast.success("Rango de factura actualizado exitosamente");
      onSuccess?.();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el rango";

        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al actualizar el rango.");
      }
    },
  });

  const onSubmit = (data: CrearRangoAgroInterface) => {
    const formattedData = {
      ...data,
      fecha_recepcion: new Date(data.fecha_recepcion).toISOString(),
      fecha_limite_emision: new Date(data.fecha_limite_emision).toISOString(),
    };

    if (isEdit && editRango) {
      mutationEditar.mutate(formattedData);
    } else {
      mutationCrear.mutate(formattedData);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-muted-foreground">
          Información del Rango de Facturación
        </h3>

        <div className="space-y-2">
          <Label className="font-semibold">
            CAI <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Ej. A1B2C3-D4E5F6-G7H8I9-J0K1L2"
            {...register("cai", {
              required: "El CAI es requerido",
              minLength: {
                value: 10,
                message: "El CAI debe tener al menos 10 caracteres",
              },
              maxLength: {
                value: 100,
                message: "Máximo 100 caracteres",
              },
            })}
          />
          {errors.cai && (
            <p className="text-sm text-red-500">{errors.cai.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">
            Prefijo <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Ej. 001-001-01"
            {...register("prefijo", {
              required: "El prefijo es requerido",
              pattern: {
                value: /^\d{3}-\d{3}-\d{2}$/,
                message: "Formato inválido. Ejemplo: 001-001-01",
              },
            })}
          />
          {errors.prefijo && (
            <p className="text-sm text-red-500">{errors.prefijo.message}</p>
          )}
          <p className="text-xs text-gray-500">Formato: 001-001-01</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-semibold">
              Rango Inicial <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min={1}
              placeholder="1"
              {...register("rango_inicial", {
                required: "El rango inicial es requerido",
                min: {
                  value: 1,
                  message: "Debe ser mayor a 0",
                },
                valueAsNumber: true,
              })}
            />
            {errors.rango_inicial && (
              <p className="text-sm text-red-500">
                {errors.rango_inicial.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">
              Rango Final <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min={1}
              placeholder="5000"
              {...register("rango_final", {
                required: "El rango final es requerido",
                min: {
                  value: 1,
                  message: "Debe ser mayor a 0",
                },
                valueAsNumber: true,
                validate: (value) => {
                  const inicial = watch("rango_inicial");
                  if (value <= inicial) {
                    return "El rango final debe ser mayor al rango inicial";
                  }
                  return true;
                },
              })}
            />
            {errors.rango_final && (
              <p className="text-sm text-red-500">
                {errors.rango_final.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-semibold">
              Fecha de Recepción <span className="text-red-500">*</span>
            </Label>

            <Input
              type="date"
              {...register("fecha_recepcion", {
                required: "La fecha de recepción es requerida",
              })}
            />

            {errors.fecha_recepcion && (
              <p className="text-sm text-red-500">
                {errors.fecha_recepcion.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">
              Fecha Límite de Emisión <span className="text-red-500">*</span>
            </Label>

            <Input
              type="date"
              {...register("fecha_limite_emision", {
                required: "La fecha límite de emisión es requerida",
              })}
            />

            {errors.fecha_limite_emision && (
              <p className="text-sm text-red-500">
                {errors.fecha_limite_emision.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <Switch
            id="is_active"
            checked={watch("is_active")}
            onCheckedChange={(checked) => setValue("is_active", checked)}
          />
          <Label htmlFor="is_active" className="font-semibold cursor-pointer">
            {watch("is_active") ? "Rango Activo" : "Rango Inactivo"}
          </Label>
        </div>

        {watch("rango_inicial") && watch("rango_final") && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Resumen:</span> Rango de{" "}
              <span className="font-bold">{watch("rango_inicial")}</span> a{" "}
              <span className="font-bold">{watch("rango_final")}</span> ={" "}
              <span className="font-bold">
                {watch("rango_final") - watch("rango_inicial") + 1}
              </span>{" "}
              facturas disponibles
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={mutationCrear.isPending || mutationEditar.isPending}
        >
          {mutationCrear.isPending || mutationEditar.isPending
            ? "Guardando..."
            : isEdit
              ? "Actualizar Rango"
              : "Crear Rango"}
        </Button>
      </div>
    </form>
  );
};

export default FormAgroRangosFactura;
