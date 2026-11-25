"use client";

import { useTranslations } from "next-intl";
import {
  CrearAgroProducto,
  UnidadVenta,
} from "@/api/agroservicio/productos/interface/crear-agroproducto.interface";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import useGetAllProveedores from "@/hooks/agroservicios/proveedores/useGetAllProveedores";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import useGetMarcasActivas from "@/hooks/marcas/useGetMarcasActivas";
import useGetSubCategoriaByCat from "@/hooks/subcategorias/useGetSubCategoriaByCat";
import useGetTipoProductoBySubCategoria from "@/hooks/tipo-producto/useGetTipoProductoBySubCategoria";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { X, Plus } from "lucide-react";
import {
  ingresarAgroProducto,
  ingresarAgroProductoEmpleados,
} from "@/api/agroservicio/productos/accions/ingresar-producto";
import {
  editarAgroProducto,
  editarAgroProductoEmpleados,
} from "@/api/agroservicio/productos/accions/editar-producto";
import { AgroProducto } from "@/api/agroservicio/productos/interface/response-productos-agro.interface";
import useGetImpuestosByAgroservicio from "@/hooks/agroservicios/impuestos/useGetImpuestosByAgroservicio";

interface Props {
  propietarioId: string;
  isEmpleado: boolean;
  editProducto: AgroProducto | null;
  isEdit?: boolean;
  Success?: () => void;
  paisId: string;
}

const FormAgroProductos = ({
  propietarioId,
  isEmpleado,
  editProducto,
  isEdit = false,
  Success,
  paisId,
}: Props) => {
  const t = useTranslations("formAgroProductos");

  const queryClient = useQueryClient();
  const [unidadVentaSeleccionada, setUnidadVentaSeleccionada] = useState("");
  const [nuevoTipoUso, setNuevoTipoUso] = useState("");
  const [nuevaIndicacion, setNuevaIndicacion] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("");
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] =
    useState<string>("");

  const { data: marcasActivas } = useGetMarcasActivas({
    is_market: false,
  });
  const { data: proveedoresActivos } = useGetAllProveedores(propietarioId);
  const { data: categorias } = useGetCategorias({
    limit: 100,
    offset: 0,
    is_market: false,
  });

  const { data: impuestos } = useGetImpuestosByAgroservicio(propietarioId);

  const { data: subcategorias, refetch: refetchSubcategorias } =
    useGetSubCategoriaByCat(categoriaSeleccionada);
  const { data: tiposProducto, refetch: refetchTiposProducto } =
    useGetTipoProductoBySubCategoria(subcategoriaSeleccionada);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CrearAgroProducto>({
    defaultValues: {
      componentes: [],
      tipos_uso: [],
      indicaciones: [],
      disponible: true,
      isActive: true,
      es_compra_bodega: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "componentes",
  });

  const unidadVenta = watch("unidad_venta");
  const tiposUso = watch("tipos_uso");
  const indicaciones = watch("indicaciones");
  const categoriaId = watch("categoriaId");
  const subcategoriaId = watch("subcategoriaId");

  useEffect(() => {
    if (categoriaId) {
      setCategoriaSeleccionada(categoriaId);
    } else {
      setCategoriaSeleccionada("");
      setSubcategoriaSeleccionada("");
      setValue("subcategoriaId", "");
      setValue("tipo_producto_id", "");
    }
  }, [categoriaId, setValue]);

  useEffect(() => {
    if (subcategoriaId) {
      setSubcategoriaSeleccionada(subcategoriaId);
    } else {
      setSubcategoriaSeleccionada("");
      setValue("tipo_producto_id", "");
    }
  }, [subcategoriaId, setValue]);

  useEffect(() => {
    if (categoriaSeleccionada) {
      refetchSubcategorias();
    }
  }, [categoriaSeleccionada, refetchSubcategorias]);

  useEffect(() => {
    if (subcategoriaSeleccionada) {
      refetchTiposProducto();
    }
  }, [subcategoriaSeleccionada, refetchTiposProducto]);

  useEffect(() => {
    setUnidadVentaSeleccionada(unidadVenta || "");
  }, [unidadVenta]);

  useEffect(() => {
    if (isEdit && editProducto) {
      if (editProducto.categoria?.id) {
        setCategoriaSeleccionada(editProducto.categoria.id);
      }
      if (editProducto.subcategoria?.id) {
        setSubcategoriaSeleccionada(editProducto.subcategoria.id);
      }

      reset({
        nombre: editProducto.nombre,
        unidad_venta: editProducto.unidad_venta,
        tipo_fraccionamiento: editProducto.tipo_fraccionamiento,
        isActive: editProducto.isActive,
        disponible: editProducto.disponible,
        marcaId: editProducto.marca?.id || "",
        proveedorId: editProducto.proveedor?.id || "",
        categoriaId: editProducto.categoria?.id || "",
        subcategoriaId: editProducto.subcategoria?.id || "",
        tipo_producto_id: editProducto.tipo_producto?.id || "",
        taxId: editProducto.tax?.id || "",
        codigo_barra: editProducto.codigo_barra || "",
        atributos: editProducto.atributos || "",
        precio: Number(editProducto.precio),
        costo: Number(editProducto.costo),
        es_compra_bodega: editProducto.es_compra_bodega || false,
        compra_minima: Number(editProducto.compra_minima) || 1,
        distribucion_minima: Number(editProducto.distribucion_minima) || 1,
        venta_minima: Number(editProducto.venta_minima) || 1,
        unidad_fraccionamiento:
          Number(editProducto.unidad_fraccionamiento) || 1,
        contenido: Number(editProducto.contenido) || 1,
        componentes: editProducto.componentes || [],
        tipos_uso: editProducto.tipos_uso || [],
        forma_uso: editProducto.forma_uso || "",
        indicaciones: editProducto.indicaciones || [],
      });
      setUnidadVentaSeleccionada(
        editProducto.unidad_venta || UnidadVenta.UNIDAD,
      );
    } else {
      setValue("unidad_venta", UnidadVenta.UNIDAD as UnidadVenta);
      setUnidadVentaSeleccionada(UnidadVenta.UNIDAD);
    }
  }, [isEdit, editProducto, reset]);

  const mutation = useMutation({
    mutationFn: (data: CrearAgroProducto) => {
      const payload = {
        ...data,
        precio: Number(data.precio),
        costo: Number(data.costo),
        compra_minima: Number(data.compra_minima),
        distribucion_minima: Number(data.distribucion_minima),
        venta_minima: Number(data.venta_minima),
        contenido: Number(data.contenido) || 1,
      };
      return isEmpleado
        ? ingresarAgroProductoEmpleados(payload)
        : ingresarAgroProducto(payload);
    },
    onSuccess: () => {
      toast.success(t("notifications.createSuccess"));
      queryClient.invalidateQueries({ queryKey: ["agro-productos"] });
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
            : t("notifications.createError");
        toast.error(errorMessage);
      } else {
        toast.error(t("notifications.createErrorRetry"));
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearAgroProducto) => {
      const payload = {
        ...data,
        precio: Number(data.precio),
        costo: Number(data.costo),
        compra_minima: Number(data.compra_minima),
        distribucion_minima: Number(data.distribucion_minima),
        venta_minima: Number(data.venta_minima),
        contenido: Number(data.contenido) || 1,
      };
      return isEmpleado
        ? editarAgroProductoEmpleados(editProducto?.id || "", payload)
        : editarAgroProducto(editProducto?.id || "", payload);
    },
    onSuccess: () => {
      toast.success(t("notifications.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["agro-productos"] });
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
            : t("notifications.updateError");
        toast.error(errorMessage);
      } else {
        toast.error(t("notifications.updateErrorRetry"));
      }
    },
  });

  const agregarTipoUso = () => {
    if (nuevoTipoUso.trim() && !tiposUso?.includes(nuevoTipoUso.trim())) {
      const nuevosTipos = [...(tiposUso || []), nuevoTipoUso.trim()];
      setValue("tipos_uso", nuevosTipos);
      setNuevoTipoUso("");
    }
  };

  const eliminarTipoUso = (tipoUso: string) => {
    const nuevosTipos = (tiposUso || []).filter((t) => t !== tipoUso);
    setValue("tipos_uso", nuevosTipos);
  };

  const agregarIndicacion = () => {
    if (
      nuevaIndicacion.trim() &&
      !indicaciones?.includes(nuevaIndicacion.trim())
    ) {
      const nuevasIndicaciones = [
        ...(indicaciones || []),
        nuevaIndicacion.trim(),
      ];
      setValue("indicaciones", nuevasIndicaciones);
      setNuevaIndicacion("");
    }
  };

  const eliminarIndicacion = (indicacion: string) => {
    const nuevasIndicaciones = (indicaciones || []).filter(
      (i) => i !== indicacion,
    );
    setValue("indicaciones", nuevasIndicaciones);
  };

  const onSubmit = (data: CrearAgroProducto) => {
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
          {t("fields.productName")}*
        </Label>
        <Input
          id="nombre"
          {...register("nombre", {
            required: t("validation.productNameRequired"),
            minLength: {
              value: 3,
              message: t("validation.productNameMin"),
            },
            maxLength: {
              value: 100,
              message: t("validation.productNameMax"),
            },
          })}
          placeholder={t("placeholders.productName")}
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="codigo_barra" className="font-bold">
          {t("fields.barcode")}*
        </Label>
        <Input
          id="codigo_barra"
          {...register("codigo_barra", {
            required: t("validation.barcodeRequired"),
            maxLength: {
              value: 20,
              message: t("validation.barcodeMax"),
            },
          })}
          placeholder={t("placeholders.barcode")}
        />
        {errors.codigo_barra && (
          <p className="text-sm font-medium text-red-500">
            {errors.codigo_barra.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="marcaId" className="font-bold">
          {t("fields.brand")}
        </Label>
        <Select
          onValueChange={(value) => setValue("marcaId", value)}
          defaultValue={isEdit ? editProducto?.marca?.id : ""}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("placeholders.brand")} />
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
        <Label htmlFor="categoriaId" className="font-bold">
          {t("fields.category")}*
        </Label>
        <Select
          onValueChange={(value) => {
            setValue("categoriaId", value);
            setValue("subcategoriaId", "");
            setValue("tipo_producto_id", "");
          }}
          defaultValue={isEdit ? editProducto?.categoria?.id : ""}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("placeholders.category")} />
          </SelectTrigger>
          <SelectContent>
            {categorias?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoriaId && (
          <p className="text-sm font-medium text-red-500">
            {errors.categoriaId.message as string}
          </p>
        )}
      </div>

      {categoriaSeleccionada && (
        <div className="space-y-2">
          <Label htmlFor="subcategoriaId" className="font-bold">
            {t("fields.subcategory")}
          </Label>
          <Select
            onValueChange={(value) => {
              setValue("subcategoriaId", value);
              setValue("tipo_producto_id", "");
            }}
            defaultValue={isEdit ? editProducto?.subcategoria?.id : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("placeholders.subcategory")} />
            </SelectTrigger>
            <SelectContent>
              {subcategorias?.map((subcat) => (
                <SelectItem key={subcat.id} value={subcat.id}>
                  {subcat.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {subcategoriaSeleccionada && (
        <div className="space-y-2">
          <Label htmlFor="tipo_producto_id" className="font-bold">
            {t("fields.productType")}
          </Label>
          <Select
            onValueChange={(value) => setValue("tipo_producto_id", value)}
            defaultValue={isEdit ? editProducto?.tipo_producto?.id : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("placeholders.productType")} />
            </SelectTrigger>
            <SelectContent>
              {tiposProducto?.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="unidad_venta" className="font-bold">
          {t("fields.salesUnit")}*
        </Label>
        <Select
          defaultValue={isEdit ? editProducto?.unidad_venta : "unidad"}
          onValueChange={(value) => {
            setValue("unidad_venta", value as UnidadVenta);
            setUnidadVentaSeleccionada(value);
            setValue("unidad_fraccionamiento", 1);
            setValue("contenido", 1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("placeholders.salesUnit")} />
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

      {unidadVentaSeleccionada && unidadVentaSeleccionada !== "unidad" && (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-bold text-lg">{t("fractioning.title")}</h3>

          <div className="space-y-2">
            <Label htmlFor="tipo_fraccionamiento" className="font-bold">
              {t("fractioning.type")}
            </Label>
            <Select
              defaultValue={
                isEdit && editProducto?.tipo_fraccionamiento
                  ? editProducto.tipo_fraccionamiento
                  : undefined
              }
              onValueChange={(value) =>
                setValue("tipo_fraccionamiento", value as UnidadVenta)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("placeholders.fractioningUnit")} />
              </SelectTrigger>
              <SelectContent>
                {unidadesMedida.map((unidad) => (
                  <SelectItem key={unidad.value} value={unidad.value}>
                    {unidad.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidad_fraccionamiento" className="font-bold">
              {t("fractioning.unit")}
            </Label>
            <Input
              id="unidad_fraccionamiento"
              type="number"
              step="0.0001"
              {...register("unidad_fraccionamiento", {
                min: {
                  value: 0.0001,
                  message: t("validation.fractioningUnitMin"),
                },
              })}
              placeholder={t("placeholders.fractioningExample")}
            />
            {errors.unidad_fraccionamiento && (
              <p className="text-sm font-medium text-red-500">
                {errors.unidad_fraccionamiento.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contenido" className="font-bold">
              {t("fractioning.content")}
            </Label>
            <Input
              id="contenido"
              type="number"
              step="0.0001"
              {...register("contenido", {
                min: {
                  value: 0.0001,
                  message: t("validation.contentMin"),
                },
              })}
              placeholder={t("placeholders.contentExample")}
            />
            {errors.contenido && (
              <p className="text-sm font-medium text-red-500">
                {errors.contenido.message as string}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {t("fractioning.contentDescription")}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-bold text-lg">{t("components.title")}</h3>
        <p className="text-sm text-gray-500">{t("components.description")}</p>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end p-3 border rounded"
          >
            <div className="col-span-2">
              <Label>{t("components.name")}</Label>
              <Input
                {...register(`componentes.${index}.nombre`, {
                  required: t("validation.componentNameRequired"),
                })}
                placeholder={t("placeholders.componentName")}
              />
            </div>
            <div>
              <Label>{t("components.quantity")}</Label>
              <Input
                {...register(`componentes.${index}.cantidad`)}
                placeholder={t("placeholders.componentQuantity")}
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label>{t("components.unit")}</Label>
                <Input
                  {...register(`componentes.${index}.unidad`)}
                  placeholder={t("placeholders.componentUnit")}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
                aria-label={t("buttons.removeComponent")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ nombre: "", cantidad: "", unidad: "" })}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("buttons.addComponent")}
        </Button>
      </div>

      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-bold text-lg">{t("usageTypes.title")}</h3>
        <p className="text-sm text-gray-500">{t("usageTypes.description")}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {tiposUso?.map((tipo, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tipo}
              <button
                type="button"
                onClick={() => eliminarTipoUso(tipo)}
                className="hover:text-blue-600"
                aria-label={t("buttons.removeUsageType", { value: tipo })}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={nuevoTipoUso}
            onChange={(e) => setNuevoTipoUso(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), agregarTipoUso())
            }
            placeholder={t("placeholders.usageType")}
            className="flex-1"
          />
          <Button type="button" onClick={agregarTipoUso}>
            <Plus className="h-4 w-4 mr-2" />
            {t("buttons.add")}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="forma_uso" className="font-bold">
          {t("fields.usageInstructions")}
        </Label>
        <Textarea
          id="forma_uso"
          {...register("forma_uso")}
          placeholder={t("placeholders.usageInstructions")}
          className="min-h-[100px]"
        />
        <p className="text-xs text-gray-500">
          {t("usageTypes.instructionsDescription")}
        </p>
      </div>

      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-bold text-lg">{t("indications.title")}</h3>
        <p className="text-sm text-gray-500">{t("indications.description")}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {indicaciones?.map((indicacion, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              {indicacion}
              <button
                type="button"
                onClick={() => eliminarIndicacion(indicacion)}
                className="hover:text-green-600"
                aria-label={t("buttons.removeIndication", {
                  value: indicacion,
                })}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={nuevaIndicacion}
            onChange={(e) => setNuevaIndicacion(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), agregarIndicacion())
            }
            placeholder={t("placeholders.indication")}
            className="flex-1"
          />
          <Button type="button" onClick={agregarIndicacion}>
            <Plus className="h-4 w-4 mr-2" />
            {t("buttons.add")}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="atributos" className="font-bold">
          {t("fields.attributes")}*
        </Label>
        <Textarea
          id="atributos"
          {...register("atributos", {
            required: t("validation.attributesRequired"),
            maxLength: {
              value: 250,
              message: t("validation.attributesMax"),
            },
          })}
          placeholder={t("placeholders.attributes")}
          className="min-h-[80px]"
        />
        {errors.atributos && (
          <p className="text-sm font-medium text-red-500">
            {errors.atributos.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="compra_minima" className="font-bold">
            {t("fields.minimumPurchase")}*
          </Label>
          <Input
            id="compra_minima"
            type="number"
            min="1"
            step="1"
            {...register("compra_minima", {
              required: t("validation.minimumPurchaseRequired"),
              min: {
                value: 1,
                message: t("validation.minimumPurchaseMin"),
              },
            })}
            placeholder={t("placeholders.minimumPurchase")}
          />
          {errors.compra_minima && (
            <p className="text-sm font-medium text-red-500">
              {errors.compra_minima.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="distribucion_minima" className="font-bold">
            {t("fields.minimumDistribution")}*
          </Label>
          <Input
            id="distribucion_minima"
            type="number"
            min="1"
            step="1"
            {...register("distribucion_minima", {
              required: t("validation.minimumDistributionRequired"),
              min: {
                value: 1,
                message: t("validation.minimumDistributionMin"),
              },
            })}
            placeholder={t("placeholders.minimumDistribution")}
          />
          {errors.distribucion_minima && (
            <p className="text-sm font-medium text-red-500">
              {errors.distribucion_minima.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="venta_minima" className="font-bold">
            {t("fields.minimumSale")}*
          </Label>
          <Input
            id="venta_minima"
            type="number"
            min="1"
            step="1"
            {...register("venta_minima", {
              required: t("validation.minimumSaleRequired"),
              min: {
                value: 1,
                message: t("validation.minimumSaleMin"),
              },
            })}
            placeholder={t("placeholders.minimumSale")}
          />
          {errors.venta_minima && (
            <p className="text-sm font-medium text-red-500">
              {errors.venta_minima.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-bold">{t("purchaseType.title")}</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="es_compra_bodega"
            checked={watch("es_compra_bodega")}
            onCheckedChange={(checked) =>
              setValue("es_compra_bodega", checked as boolean)
            }
          />
          <Label htmlFor="es_compra_bodega" className="text-sm font-normal">
            {t("purchaseType.directPurchase")}
          </Label>
        </div>
        <p className="text-sm text-gray-500">{t("purchaseType.description")}</p>
      </div>

      {!isEdit ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="costo" className="font-bold">
              {t("fields.cost")}*
            </Label>
            <Input
              id="costo"
              type="number"
              step="0.01"
              {...register("costo", {
                required: t("validation.costRequired"),
                min: { value: 0, message: t("validation.costMin") },
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
            <Label htmlFor="precio" className="font-bold">
              {t("fields.price")}*
            </Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              {...register("precio", {
                required: t("validation.priceRequired"),
                min: { value: 0, message: t("validation.priceMin") },
              })}
              placeholder="0.00"
            />
            {errors.precio && (
              <p className="text-sm font-medium text-red-500">
                {errors.precio.message as string}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="costo" className="font-bold">
              {t("fields.cost")}
            </Label>
            <Input
              id="costo"
              type="number"
              step="0.01"
              {...register("costo")}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="precio" className="font-bold">
              {t("fields.price")}
            </Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              {...register("precio")}
              placeholder="0.00"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="taxId" className="font-bold">
          {t("fields.tax")}
        </Label>
        <Select
          onValueChange={(value) => setValue("taxId", value)}
          defaultValue={isEdit ? editProducto?.tax?.id : ""}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("placeholders.tax")} />
          </SelectTrigger>
          <SelectContent>
            {impuestos?.map((imp) => (
              <SelectItem key={imp.id} value={imp.id}>
                {imp.nombre} - {imp.porcentaje}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="proveedorId" className="font-bold">
          {t("fields.supplier")}*
        </Label>
        <Select
          onValueChange={(value) => setValue("proveedorId", value)}
          defaultValue={isEdit ? editProducto?.proveedor?.id : ""}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("placeholders.supplier")} />
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

      {isEdit && (
        <>
          <div className="space-y-2">
            <Label className="font-bold">{t("status.title")}</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="disponible"
                checked={watch("disponible")}
                onCheckedChange={(checked) =>
                  setValue("disponible", checked as boolean)
                }
              />
              <Label htmlFor="disponible" className="text-sm font-normal">
                {t("status.available")}
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold">{t("status.activity")}</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={watch("isActive")}
                onCheckedChange={(checked) =>
                  setValue("isActive", checked as boolean)
                }
              />
              <Label htmlFor="isActive" className="text-sm font-normal">
                {t("status.active")}
              </Label>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        {isEdit && (
          <Button
            variant={"outline"}
            type="button"
            onClick={() => {
              if (isEdit && editProducto) {
                Success?.();
              }
            }}
          >
            {t("buttons.cancel")}
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
              {isEdit ? t("buttons.updating") : t("buttons.creating")}
            </>
          ) : (
            <>
              {isEdit ? t("buttons.updateProduct") : t("buttons.createProduct")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormAgroProductos;
