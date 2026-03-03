import { CrearProductoGanadero } from "@/api/productos-ganadero/accions/crear-producto-ganadero";
import { EditarProductoGanadero } from "@/api/productos-ganadero/accions/editar-producto";
import { CrearProductoGanaderoInterface } from "@/api/productos-ganadero/interfaces/crear-producto-ganadero.interface";
import { ResponseProductosVenta } from "@/api/productos-ganadero/interfaces/obtener-productos-precios.interface";
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
import { categorias_productos } from "@/helpers/data/categorias-producto-ganadero";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

interface FormAddProductoProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  productoToEdit?: ResponseProductosVenta | null;
  onSuccess?: () => void;
}

const FormAddProducto = ({
  openModal,
  setOpenModal,
  productoToEdit,
  onSuccess,
}: FormAddProductoProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!productoToEdit;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearProductoGanaderoInterface>({
    defaultValues: {
      nombre: "",
      categoria: undefined,
    },
  });

  useEffect(() => {
    if (productoToEdit && openModal) {
      const categoriaEncontrada = categorias_productos.find(
        (cat) =>
          cat.value.toUpperCase() === productoToEdit.categoria.toUpperCase(),
      );

      setValue("nombre", productoToEdit.nombre);
      setValue(
        "categoria",
        categoriaEncontrada?.value || productoToEdit.categoria,
      );
    } else if (!openModal) {
      reset({
        nombre: "",
        categoria: undefined,
      });
    }
  }, [productoToEdit, openModal, setValue, reset]);

  useEffect(() => {
    if (productoToEdit && openModal) {
      const timeout = setTimeout(() => {
        const categoriaEncontrada = categorias_productos.find(
          (cat) =>
            cat.value.toUpperCase() === productoToEdit.categoria.toUpperCase(),
        );
        if (categoriaEncontrada) {
          setValue("categoria", categoriaEncontrada.value);
        }
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [productoToEdit, openModal, setValue]);

  const onSubmit = async (data: CrearProductoGanaderoInterface) => {
    try {
      setIsSubmitting(true);

      if (isEditing && productoToEdit) {
        await EditarProductoGanadero(productoToEdit.id, data);
        toast.success(`Producto actualizado con éxito`);
      } else {
        await CrearProductoGanadero(data);
        toast.success("Producto creado exitosamente");
      }

      reset({
        nombre: "",
        categoria: undefined,
      });

      setOpenModal(false);
      queryClient.invalidateQueries({ queryKey: ["productos-venta"] });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          `Error al ${isEditing ? "actualizar" : "crear"} el producto. Por favor, intenta de nuevo.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-3 bg-gray-100 shadow-md rounded-md"
    >
      {isEditing && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
          ✏️ Editando producto:{" "}
          <span className="font-semibold">{productoToEdit?.nombre}</span>
        </div>
      )}

      <div className="mt-3">
        <Label htmlFor="nombre">Nombre del Producto</Label>
        <Input
          id="nombre"
          placeholder="Ejem: Leche, Queso, Mantequilla, Carne Molida ..."
          type="text"
          {...register("nombre", {
            required: "El nombre del producto es requerido",
            minLength: {
              value: 3,
              message: "El nombre debe tener al menos 3 caracteres",
            },
          })}
          disabled={isSubmitting}
          className={errors.nombre ? "border-red-500" : ""}
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
        )}
      </div>

      <div className="mt-3">
        <Label htmlFor="categoria">Categoría</Label>
        <Controller
          name="categoria"
          control={control}
          rules={{ required: "La categoría es requerida" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isSubmitting}
              key={field.value}
            >
              <SelectTrigger
                className={errors.categoria ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecciona la Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categorías</SelectLabel>
                  {categorias_productos.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.value}
                      data-state={
                        field.value === cat.value ? "checked" : "unchecked"
                      }
                    >
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoria && (
          <p className="mt-1 text-sm text-red-600">
            {errors.categoria.message}
          </p>
        )}
      </div>

      <div className="mt-6">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="mr-2">
                {isEditing ? "Actualizando..." : "Creando..."}
              </span>
              <span className="animate-spin">⏳</span>
            </>
          ) : isEditing ? (
            "Actualizar Producto"
          ) : (
            "Agregar Producto"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormAddProducto;
