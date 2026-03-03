import { CrearPrecioProducto } from "@/api/precios-producto-ganadero/accions/crear-precio-producto";
import { EditarPrecioProducto } from "@/api/precios-producto-ganadero/accions/editar-precio-producto";
import { CrearPrecioProductoInterface } from "@/api/precios-producto-ganadero/interface/crear-precio-producto.interface";
import { ResponseProductosVenta } from "@/api/productos-ganadero/interfaces/obtener-productos-precios.interface";
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
import { unidades_productos } from "@/helpers/data/medida-productos-ganadero";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  producto: ResponseProductosVenta;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  precioToEdit?: ResponseProductosVenta["ventas"][0] | null;
  onSuccess?: () => void;
}

const FormPreciosProducto = ({
  producto,
  openModal,
  setOpenModal,
  precioToEdit,
  onSuccess,
}: Props) => {
  const { cliente } = useAuthStore();
  const queryClient = useQueryClient();
  const moneda = cliente?.pais.simbolo_moneda ?? "L";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!precioToEdit;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearPrecioProductoInterface>({
    defaultValues: {
      unidadMedida: "",
      precio: 0,
      moneda: moneda,
      productoId: producto.id,
    },
  });

  useEffect(() => {
    if (precioToEdit && openModal) {
      const unidadEncontrada = unidades_productos.find(
        (u) =>
          u.value.toUpperCase() === precioToEdit.unidadMedida.toUpperCase(),
      );

      setValue(
        "unidadMedida",
        unidadEncontrada?.value || precioToEdit.unidadMedida,
      );
      setValue("precio", parseFloat(precioToEdit.precio));
      setValue("moneda", precioToEdit.moneda);
      setValue("productoId", producto.id);
    } else if (!openModal) {
      reset({
        unidadMedida: "",
        precio: 0,
        moneda: moneda,
        productoId: producto.id,
      });
    }
  }, [precioToEdit, openModal, setValue, reset, producto.id, moneda]);

  useEffect(() => {
    if (precioToEdit && openModal) {
      const timeout = setTimeout(() => {
        const unidadEncontrada = unidades_productos.find(
          (u) =>
            u.value.toUpperCase() === precioToEdit.unidadMedida.toUpperCase(),
        );
        if (unidadEncontrada) {
          setValue("unidadMedida", unidadEncontrada.value);
        }
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [precioToEdit, openModal, setValue]);

  const onSubmit = async (data: CrearPrecioProductoInterface) => {
    if (!producto) return;

    try {
      setIsSubmitting(true);

      const dataToSend = {
        ...data,
        moneda: moneda,
        productoId: producto.id,
        precio: Number(data.precio),
      };

      if (isEditing && precioToEdit) {
        await EditarPrecioProducto(precioToEdit.id, dataToSend);
        toast.success(`Precio actualizado con éxito para: ${producto.nombre}`);
      } else {
        await CrearPrecioProducto(dataToSend);
        toast.success(`Precio agregado con éxito para: ${producto.nombre}`);
      }

      reset({
        unidadMedida: "",
        precio: 0,
        moneda: moneda,
        productoId: producto.id,
      });

      queryClient.invalidateQueries({ queryKey: ["productos-venta"] });

      setOpenModal(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          `Error al ${isEditing ? "actualizar" : "agregar"} el precio. Por favor, intenta de nuevo.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    reset({
      unidadMedida: "",
      precio: 0,
      moneda: moneda,
      productoId: producto.id,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="unidadMedida">
          Unidad de Medida <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="unidadMedida"
          control={control}
          rules={{ required: "La unidad de medida es requerida" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isSubmitting}
              key={field.value}
            >
              <SelectTrigger
                className={errors.unidadMedida ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecciona la unidad" />
              </SelectTrigger>
              <SelectContent>
                {unidades_productos.map((unidad) => (
                  <SelectItem key={unidad.value} value={unidad.value}>
                    {unidad.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.unidadMedida && (
          <p className="text-sm text-red-600">{errors.unidadMedida.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="precio">
          Precio ({moneda}) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="precio"
          type="number"
          step="0.01"
          min="0"
          placeholder={`0.00 ${moneda}`}
          {...register("precio", {
            required: "El precio es requerido",
            min: {
              value: 0.01,
              message: "El precio debe ser mayor a 0",
            },
            valueAsNumber: true,
          })}
          disabled={isSubmitting}
          className={errors.precio ? "border-red-500" : ""}
        />
        {errors.precio && (
          <p className="text-sm text-red-600">{errors.precio.message}</p>
        )}
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <p>
          Producto: <span className="font-medium">{producto.nombre}</span>
        </p>
        <p>
          Categoría: <span className="font-medium">{producto.categoria}</span>
        </p>
        {isEditing && (
          <p className="mt-1 text-blue-600 font-medium">
            ✏️ Editando precio existente
          </p>
        )}
      </div>

      <input type="hidden" {...register("productoId")} value={producto.id} />
      <input type="hidden" {...register("moneda")} value={moneda} />

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCloseModal}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="mr-2">
                {isEditing ? "Actualizando..." : "Agregando..."}
              </span>
              <span className="animate-spin">⏳</span>
            </>
          ) : isEditing ? (
            "Actualizar Precio"
          ) : (
            "Agregar Precio"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormPreciosProducto;
