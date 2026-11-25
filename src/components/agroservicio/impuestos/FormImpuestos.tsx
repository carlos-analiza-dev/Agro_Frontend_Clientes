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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("formImpuestosProductos");

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
        porcentaje: Number(editImpuesto.porcentaje),
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

      toast.success(t("messages.createSuccess"));
      onSuccess?.();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.createError");

        toast.error(errorMessage);
      } else {
        toast.error(t("messages.createUnexpectedError"));
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

      toast.success(t("messages.updateSuccess"));
      onSuccess?.();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.updateError");

        toast.error(errorMessage);
      } else {
        toast.error(t("messages.updateUnexpectedError"));
      }
    },
  });

  const onSubmit = (data: IngresarImpuestoInterface) => {
    if (isEdit && editImpuesto) {
      mutationEditar.mutate({
        ...data,
        porcentaje: Number(data.porcentaje),
      });
    } else {
      mutationCrear.mutate({
        ...data,
        porcentaje: Number(data.porcentaje),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-muted-foreground">
          {t("sections.information")}
        </h3>

        <div className="space-y-2">
          <Label className="font-semibold">
            {t("fields.name")} <span className="text-red-500">*</span>
          </Label>

          <Input
            placeholder={t("placeholders.name")}
            {...register("nombre", {
              required: t("validation.nameRequired"),
              maxLength: {
                value: 100,
                message: t("validation.nameMaxLength"),
              },
            })}
          />

          {errors.nombre && (
            <p className="text-sm text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">
            {t("fields.percentage")} <span className="text-red-500">*</span>
          </Label>

          <Input
            type="number"
            step="0.01"
            min={0}
            max={100}
            placeholder="15.00"
            {...register("porcentaje", {
              required: t("validation.percentageRequired"),
              validate: (value) => {
                const numero = Number(value);

                if (isNaN(numero)) return t("validation.invalidNumber");

                if (numero < 0 || numero > 100)
                  return t("validation.percentageRange");

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
          {t("buttons.cancel")}
        </Button>

        <Button
          type="submit"
          disabled={mutationCrear.isPending || mutationEditar.isPending}
        >
          {mutationCrear.isPending || mutationEditar.isPending
            ? isEdit
              ? t("buttons.updating")
              : t("buttons.creating")
            : isEdit
              ? t("buttons.update")
              : t("buttons.create")}
        </Button>
      </div>
    </form>
  );
};

export default FormImpuestos;
