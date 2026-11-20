"use client";

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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("formAddProducto");

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
        toast.success(t("messages.updateSuccess"));
      } else {
        await CrearProductoGanadero(data);
        toast.success(t("messages.createSuccess"));
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
          t(isEditing ? "errors.update" : "errors.create"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryLabel = (value: string, fallback: string) => {
    const key = `categories.${value}`;
    return t.has(key) ? t(key) : fallback;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-3 bg-gray-100 shadow-md rounded-md"
    >
      {isEditing && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
          ✏️ {t("editing")}{" "}
          <span className="font-semibold">{productoToEdit?.nombre}</span>
        </div>
      )}

      <div className="mt-3">
        <Label htmlFor="nombre">{t("fields.productName")}</Label>
        <Input
          id="nombre"
          placeholder={t("placeholders.productName")}
          type="text"
          {...register("nombre", {
            required: t("validation.nameRequired"),
            minLength: {
              value: 3,
              message: t("validation.nameMinLength"),
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
        <Label htmlFor="categoria">{t("fields.category")}</Label>

        <Controller
          name="categoria"
          control={control}
          rules={{ required: t("validation.categoryRequired") }}
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
                <SelectValue placeholder={t("placeholders.category")} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("fields.categories")}</SelectLabel>

                  {categorias_productos.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.value}
                      data-state={
                        field.value === cat.value ? "checked" : "unchecked"
                      }
                    >
                      {getCategoryLabel(cat.value, cat.nombre)}
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
                {isEditing ? t("buttons.updating") : t("buttons.creating")}
              </span>
              <span className="animate-spin">⏳</span>
            </>
          ) : isEditing ? (
            t("buttons.update")
          ) : (
            t("buttons.add")
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormAddProducto;
