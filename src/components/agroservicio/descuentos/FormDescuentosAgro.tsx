import { CreateDescuentoAgro } from "@/api/agroservicio/descuentos/interface/crear-descuento.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { BadgePercent, Plus, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ResponseDescuentosAgroInterface } from "@/api/agroservicio/descuentos/interface/response-descuentos-agro.interface";
import {
  CrearDescuentoCliente,
  CrearEmpleadoDescuentoCliente,
} from "@/api/agroservicio/descuentos/accions/crear-descuento";
import {
  EditarDescuentoCliente,
  EditarEmpleadoDescuentoCliente,
} from "@/api/agroservicio/descuentos/accions/editar-descuento";

interface Props {
  editDescuento: ResponseDescuentosAgroInterface | null;
  isEdit: boolean;
  onSuccess: () => void;
  isPropietario: boolean;
}

const FormDescuentosAgro = ({
  editDescuento,
  isEdit,
  onSuccess,
  isPropietario,
}: Props) => {
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<CreateDescuentoAgro>();

  const queryClient = useQueryClient();
  const porcentajeValue = watch("porcentaje");

  useEffect(() => {
    if (isEdit && editDescuento) {
      reset({
        nombre: editDescuento.nombre,
        porcentaje: editDescuento.porcentaje,
      });
    }
  }, [editDescuento, isEdit, reset]);

  const mutationCrear = useMutation({
    mutationFn: (data: CreateDescuentoAgro) =>
      isPropietario
        ? CrearDescuentoCliente(data)
        : CrearEmpleadoDescuentoCliente(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["descuentos-agro"],
      });

      toast.success("Descuento creado exitosamente");
      onSuccess?.();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el descuento";

        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al crear el descuento.");
      }
    },
  });

  const mutationEditar = useMutation({
    mutationFn: (data: CreateDescuentoAgro) =>
      isPropietario
        ? EditarDescuentoCliente(editDescuento?.id ?? "", data)
        : EditarEmpleadoDescuentoCliente(editDescuento?.id ?? "", data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["descuentos-agro"],
      });

      toast.success("Descuento actualizado exitosamente");
      onSuccess?.();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el descuento";

        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al actualizar el descuento.");
      }
    },
  });

  const onSubmit = (data: CreateDescuentoAgro) => {
    if (isEdit && editDescuento) {
      mutationEditar.mutate({ ...data, porcentaje: Number(data.porcentaje) });
    } else {
      mutationCrear.mutate({ ...data, porcentaje: Number(data.porcentaje) });
    }
  };

  const isLoading = mutationCrear.isPending || mutationEditar.isPending;

  return (
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-green-500/20">
            <BadgePercent className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              {isEdit ? "Editar Descuento" : "Nuevo Descuento"}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEdit
                ? "Actualiza la información del descuento"
                : "Registra un nuevo descuento para tus clientes"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                Información del Descuento
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre" className="font-semibold text-gray-700">
                Nombre del Descuento <span className="text-red-500">*</span>
              </Label>

              <Input
                id="nombre"
                placeholder="Ej. Descuento por Cliente Frecuente"
                className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register("nombre", {
                  required: "El nombre del descuento es requerido",
                  minLength: {
                    value: 3,
                    message: "Mínimo 3 caracteres",
                  },
                  maxLength: {
                    value: 100,
                    message: "Máximo 100 caracteres",
                  },
                })}
                disabled={isLoading}
              />

              {errors.nombre && (
                <p className="text-sm text-red-500 flex items-center gap-1.5 mt-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="porcentaje"
                className="font-semibold text-gray-700"
              >
                Porcentaje de Descuento (%){" "}
                <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  id="porcentaje"
                  type="number"
                  step="0.01"
                  min={0}
                  max={100}
                  placeholder="10.00"
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  {...register("porcentaje", {
                    required: "El porcentaje es requerido",
                    validate: (value) => {
                      const numero = Number(value);

                      if (isNaN(numero))
                        return "Debe ingresar un número válido";

                      if (numero < 0 || numero > 100)
                        return "El porcentaje debe estar entre 0 y 100";

                      return true;
                    },
                  })}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BadgePercent className="h-4 w-4 text-gray-400" />
                </div>
                {porcentajeValue && !errors.porcentaje && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-sm font-semibold text-green-600">
                      {Number(porcentajeValue).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>

              {porcentajeValue && !errors.porcentaje && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        Number(porcentajeValue) > 50
                          ? "bg-gradient-to-r from-green-500 to-emerald-600"
                          : "bg-gradient-to-r from-blue-500 to-green-500"
                      }`}
                      style={{
                        width: `${Math.min(Number(porcentajeValue), 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {errors.porcentaje && (
                <p className="text-sm text-red-500 flex items-center gap-1.5 mt-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.porcentaje.message}
                </p>
              )}

              <p className="text-xs text-gray-400 mt-1">
                * El porcentaje debe ser un valor entre 0% y 100%
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-4 border-t border-gray-100 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess?.()}
              disabled={isLoading}
              className="w-full sm:w-auto hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {isEdit ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  {isEdit ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Actualizar Descuento
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Descuento
                    </>
                  )}
                </>
              )}
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-700 flex items-start gap-2">
              <span className="inline-block w-1 h-1 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>
                Los descuentos se aplicarán automáticamente a los clientes según
                las reglas configuradas. Asegúrate de que el porcentaje sea el
                correcto.
              </span>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormDescuentosAgro;
