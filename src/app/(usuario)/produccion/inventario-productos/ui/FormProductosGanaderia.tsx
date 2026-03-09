import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Loader2 } from "lucide-react";
import useGetProductoVenta from "@/hooks/productos-venta-ganadero/useGetProductoVenta";
import { AgregarInventarioProducto } from "@/api/inventario-productos/accions/agregar-inventario-producto";
import { EditarInventarioProducto } from "@/api/inventario-productos/accions/editar-inventario-producto";
import { unidades_productos } from "@/helpers/data/medida-productos-ganadero";
import { isAxiosError } from "axios";
import { Inventario } from "@/api/inventario-productos/interfaces/response-inventario.interface";

interface FormProductosGanaderiaProps {
  onSuccess?: () => void;
  isEdit?: boolean;
  inventarioEdit?: Inventario | null;
}

interface InventarioFormData {
  productoId: string;
  fincaId: string;
  cantidad: number;
  unidadMedida: string;
  stockMinimo: number;
}

const FormProductosGanaderia = ({
  onSuccess,
  isEdit = false,
  inventarioEdit = null,
}: FormProductosGanaderiaProps) => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: productosData, isLoading: loadingProductos } =
    useGetProductoVenta();
  const { data: fincasData, isLoading: loadingFincas } =
    useFincasPropietarios(clienteId);

  const productos = productosData || [];
  const fincas = fincasData?.data.fincas || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<InventarioFormData>({
    defaultValues: {
      productoId: "",
      fincaId: "",
      cantidad: 0,
      unidadMedida: "",
      stockMinimo: 0,
    },
  });

  useEffect(() => {
    if (isEdit && inventarioEdit) {
      setValue("productoId", inventarioEdit.producto.id);
      setValue("fincaId", inventarioEdit.finca.id);
      setValue("cantidad", parseFloat(inventarioEdit.cantidad));
      setValue("unidadMedida", inventarioEdit.unidadMedida);
      setValue("stockMinimo", parseFloat(inventarioEdit.stockMinimo));
    }
  }, [isEdit, inventarioEdit, setValue]);

  useEffect(() => {
    if (!isEdit || !inventarioEdit) {
      reset({
        productoId: "",
        fincaId: "",
        cantidad: 0,
        unidadMedida: "",
        stockMinimo: 0,
      });
    }
  }, [isEdit, inventarioEdit, reset]);

  const onSubmit = async (data: InventarioFormData) => {
    try {
      setIsSubmitting(true);

      if (data.cantidad <= 0) {
        toast.error("La cantidad debe ser mayor a 0");
        return;
      }

      if (data.stockMinimo < 0) {
        toast.error("El stock mínimo no puede ser negativo");
        return;
      }

      if (isEdit && inventarioEdit) {
        await EditarInventarioProducto(inventarioEdit.id, {
          cantidad: data.cantidad,
          unidadMedida: data.unidadMedida,
          stockMinimo: data.stockMinimo,
        });
        toast.success("Inventario actualizado exitosamente");
      } else {
        await AgregarInventarioProducto(data);
        toast.success("Producto agregado al inventario exitosamente");
      }

      reset();

      queryClient.invalidateQueries({ queryKey: ["inventario-productos"] });
      if (isEdit && inventarioEdit) {
        queryClient.invalidateQueries({
          queryKey: ["inventario-item", inventarioEdit.id],
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            `Error al ${isEdit ? "actualizar" : "agregar"} el producto al inventario.`,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const productoSeleccionado = watch("productoId");
  const productoInfo = productos.find(
    (p: any) => p.id === productoSeleccionado,
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isEdit && inventarioEdit && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Editando:</span>{" "}
            {inventarioEdit.producto.nombre} -{" "}
            {inventarioEdit.finca.nombre_finca}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Solo puedes modificar cantidad, unidad y stock mínimo
          </p>
        </div>
      )}

      {!isEdit && (
        <>
          <div className="space-y-2">
            <Label htmlFor="productoId">
              Producto <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="productoId"
              control={control}
              rules={{ required: "Debes seleccionar un producto" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting || loadingProductos || isEdit}
                >
                  <SelectTrigger
                    className={errors.productoId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Productos disponibles</SelectLabel>
                      {loadingProductos ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                        </div>
                      ) : productos.length > 0 ? (
                        productos.map((producto: any) => (
                          <SelectItem key={producto.id} value={producto.id}>
                            {producto.nombre} - {producto.categoria}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-4 text-center text-gray-500">
                          No hay productos disponibles
                        </div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.productoId && (
              <p className="text-sm text-red-600">
                {errors.productoId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fincaId">
              Finca <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="fincaId"
              control={control}
              rules={{ required: "Debes seleccionar una finca" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting || loadingFincas || isEdit}
                >
                  <SelectTrigger
                    className={errors.fincaId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecciona una finca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Mis fincas</SelectLabel>
                      {loadingFincas ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                        </div>
                      ) : fincas.length > 0 ? (
                        fincas.map((finca: any) => (
                          <SelectItem key={finca.id} value={finca.id}>
                            {finca.nombre_finca}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-4 text-center text-gray-500">
                          No hay fincas disponibles
                        </div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.fincaId && (
              <p className="text-sm text-red-600">{errors.fincaId.message}</p>
            )}
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="cantidad">
          Cantidad <span className="text-red-500">*</span>
        </Label>
        <Input
          id="cantidad"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          {...register("cantidad", {
            required: "La cantidad es requerida",
            min: {
              value: 0.01,
              message: "La cantidad debe ser mayor a 0",
            },
            valueAsNumber: true,
          })}
          disabled={isSubmitting}
          className={errors.cantidad ? "border-red-500" : ""}
        />
        {errors.cantidad && (
          <p className="text-sm text-red-600">{errors.cantidad.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="unidadMedida">
          Unidad de Medida <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="unidadMedida"
          control={control}
          rules={{ required: "Debes seleccionar una unidad de medida" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={errors.unidadMedida ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecciona una unidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Unidades de medida</SelectLabel>
                  {unidades_productos.map((unidad) => (
                    <SelectItem key={unidad.value} value={unidad.value}>
                      {unidad.nombre}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.unidadMedida && (
          <p className="text-sm text-red-600">{errors.unidadMedida.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stockMinimo">
          Stock Mínimo <span className="text-red-500">*</span>
        </Label>
        <Input
          id="stockMinimo"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register("stockMinimo", {
            required: "El stock mínimo es requerido",
            min: {
              value: 0,
              message: "El stock mínimo no puede ser negativo",
            },
            valueAsNumber: true,
          })}
          disabled={isSubmitting}
          className={errors.stockMinimo ? "border-red-500" : ""}
        />
        {errors.stockMinimo && (
          <p className="text-sm text-red-600">{errors.stockMinimo.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Cantidad mínima para alertas de bajo stock
        </p>
      </div>

      {productoInfo && !isEdit && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Producto seleccionado:</span>{" "}
            {productoInfo.nombre}
          </p>
          <p className="text-sm text-blue-600">
            <span className="font-semibold">Categoría:</span>{" "}
            {productoInfo.categoria}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Actualizando..." : "Agregando..."}
            </>
          ) : isEdit ? (
            "Actualizar Inventario"
          ) : (
            "Agregar al Inventario"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormProductosGanaderia;
