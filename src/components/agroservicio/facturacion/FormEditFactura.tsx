import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Save,
  AlertTriangle,
  Search,
  DollarSign,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import useGetSubCategoriaByCat from "@/hooks/subcategorias/useGetSubCategoriaByCat";
import useGetTipoProductoBySubCategoria from "@/hooks/tipo-producto/useGetTipoProductoBySubCategoria";
import { useDebounceFacturas } from "@/hooks/agroservicios/facturacion/useDebounceFacturas";
import useGetProductosDisponibles from "@/hooks/agroservicios/productos/useGetProductosDisponibles";
import useGetAllCategorias from "@/hooks/categorias/useGetAllCategorias";
import useGetClientesActivos from "@/hooks/agroservicios/clientes/useGetClientesActivos";
import useGetDescuentosByAgroservicio from "@/hooks/agroservicios/descuentos/useGetDescuentosByAgroservicio";
import { AgroProducto } from "@/api/agroservicio/productos/interface/response-productos-agro.interface";
import { CrearFacturaAgroInterface } from "@/api/agroservicio/facturacion/interface/crear-factura-agro.interface";
import { obtenerExistenciaProductos } from "@/api/agroservicio/existencia_productos/accions/obtener-existencia-productos";
import BuscadorClientes from "./BuscadorClientes";
import ResumenFactura from "./ResumenFactura";
import { ResponseDescuentosAgroInterface } from "@/api/agroservicio/descuentos/interface/response-descuentos-agro.interface";
import { FormaPago } from "@/helpers/data/agroservicio/facturacion/formaPago";
import SelectorProductos from "./SelectorProductoServicio";
import { AgroFactura } from "@/api/agroservicio/facturacion/interface/response-facturas-agro.interface";
import { EditarFacturaAgro } from "@/api/agroservicio/facturacion/accions/editar-factura";

interface Props {
  factura: AgroFactura | null;
  onSuccess: () => void;
  onCancel: () => void;
  simbolo: string;
  propietarioId: string;
  sucursal_id: string;
}

const FormEditFactura = ({
  factura,
  onSuccess,
  onCancel,
  simbolo,
  propietarioId,
  sucursal_id,
}: Props) => {
  const t = useTranslations("formEditFactura");
  const queryClient = useQueryClient();

  const [categoriaId, setCategoriaId] = useState("");
  const [subcategoriaId, setSubcategoriaId] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [tipo_uso, setTipoUso] = useState("");
  const [tipoId, setTipoId] = useState("");

  const debouncedIndicaciones = useDebounceFacturas(indicaciones, 1000);
  const debouncedTipoUso = useDebounceFacturas(tipo_uso, 1000);

  const { data: productos, isLoading: loadingProductos } =
    useGetProductosDisponibles(propietarioId, {
      categoria: categoriaId,
      subcategoria: subcategoriaId,
      tipo_producto: tipoId,
      indicaciones: debouncedIndicaciones,
      tipo_uso: debouncedTipoUso,
    });

  const { data: categorias } = useGetAllCategorias();
  const { data: subcategorias } = useGetSubCategoriaByCat(categoriaId);
  const { data: tipo_producto } =
    useGetTipoProductoBySubCategoria(subcategoriaId);
  const { data: clientes, isLoading: loadingClientes } =
    useGetClientesActivos(propietarioId);
  const { data: descuentos_clientes } =
    useGetDescuentosByAgroservicio(propietarioId);

  const [
    productosSeleccionadosPersistentes,
    setProductosSeleccionadosPersistentes,
  ] = useState<AgroProducto[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<
    AgroProducto[]
  >([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [descuentos, setDescuentos] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!productos) {
      setProductosDisponibles([]);
      return;
    }

    if (Array.isArray(productos)) {
      setProductosDisponibles(productos);
    } else {
      setProductosDisponibles(productos || []);
    }
  }, [productos]);

  useEffect(() => {
    if (!factura?.detalles || factura.detalles.length === 0) return;
    if (productosDisponibles.length === 0) return;
    if (initialized) return;

    const productosIds = factura.detalles.map(
      (d: any) => d.id_producto || d.producto_id,
    );

    const productosIniciales = productosIds
      .filter((id: string) => id)
      .map((id: string) => {
        const producto = productosDisponibles.find((p) => p.id === id);
        if (producto) {
          return producto;
        }

        const detalle = factura.detalles.find(
          (d: any) => (d.id_producto || d.producto_id) === id,
        );
        return {
          id,
          nombre:
            detalle?.producto?.nombre ||
            detalle?.producto.nombre ||
            `Producto ${id}`,
          precio: detalle?.precio || 0,
        } as AgroProducto;
      })
      .filter(Boolean);

    if (productosIniciales.length > 0) {
      setProductosSeleccionadosPersistentes(productosIniciales);
      setInitialized(true);
    }
  }, [factura, productosDisponibles, initialized]);

  useEffect(() => {
    setInitialized(false);
  }, [factura?.id]);

  const detallesFormateados = factura?.detalles?.map((detalle: any) => ({
    id_producto: detalle.id_producto || detalle.producto_id || "",
    cantidad: detalle.cantidad || 1,
    precio: parseFloat(detalle.precio) || 0,
    total: (detalle.cantidad || 1) * (parseFloat(detalle.precio) || 0),
  })) || [{ id_producto: "", cantidad: 1, precio: 0, total: 0 }];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CrearFacturaAgroInterface>({
    defaultValues: {
      id_cliente: factura?.id_cliente || "",
      forma_pago: factura?.forma_pago || FormaPago.CONTADO,
      detalles: detallesFormateados,
      sub_total: parseFloat(factura?.sub_total ?? "") || 0,
      importe_exento: parseFloat(factura?.importe_exento ?? "") || 0,
      importe_exonerado: parseFloat(factura?.importe_exonerado ?? "") || 0,
      importe_gravado_15: parseFloat(factura?.importe_gravado_15 ?? "") || 0,
      importe_gravado_18: parseFloat(factura?.importe_gravado_18 ?? "") || 0,
      isv_15: parseFloat(factura?.isv_15 ?? "") || 0,
      isv_18: parseFloat(factura?.isv_18 ?? "") || 0,
      descuentos_rebajas: parseFloat(factura?.descuentos_rebajas ?? "") || 0,
      cargos_extra: parseFloat(factura?.cargos_extra || "0") || 0,
      descuento_id: factura?.descuento?.id || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  const detalles = watch("detalles") ?? [];

  const importeExento = watch("importe_exento") || 0;
  const importeExonerado = watch("importe_exonerado") || 0;
  const cargosExtra = watch("cargos_extra") || 0;

  useEffect(() => {
    if (productosSeleccionadosPersistentes.length > 0 && detalles.length > 0) {
      productosSeleccionadosPersistentes.forEach((producto) => {
        const index = detalles.findIndex((d) => d.id_producto === producto.id);
        if (index !== -1) {
          const detalle = detalles[index];
          if (detalle.precio !== Number(producto.precio)) {
            setValue(`detalles.${index}.precio`, Number(producto.precio));
            const cantidad = detalle.cantidad || 1;
            setValue(
              `detalles.${index}.total`,
              Number(producto.precio) * cantidad,
            );
          }
        }
      });
    }
  }, [productosSeleccionadosPersistentes, detalles, setValue]);

  const actualizarExistencias = () => {
    setForceUpdate((prev) => prev + 1);
  };

  const productosSeleccionadosIds = useMemo(() => {
    return detalles
      .filter((detalle) => detalle.id_producto)
      .map((detalle) => detalle.id_producto);
  }, [JSON.stringify(detalles)]);

  const hayProductosDuplicados = useMemo(() => {
    const productosIds = detalles
      .filter((detalle) => detalle.id_producto)
      .map((detalle) => detalle.id_producto);

    return new Set(productosIds).size !== productosIds.length;
  }, [JSON.stringify(detalles)]);

  const productosDuplicados = useMemo(() => {
    const counts: { [key: string]: number } = {};
    const duplicates: string[] = [];

    detalles.forEach((detalle) => {
      if (detalle.id_producto) {
        counts[detalle.id_producto] = (counts[detalle.id_producto] || 0) + 1;
      }
    });

    Object.keys(counts).forEach((productoId) => {
      if (counts[productoId] > 1) {
        duplicates.push(productoId);
      }
    });

    return duplicates;
  }, [JSON.stringify(detalles)]);

  const handleProductoChange = (index: number, value: string) => {
    const itemSeleccionado = productosDisponibles.find((p) => p.id === value);

    if (itemSeleccionado) {
      const precio = Number(itemSeleccionado.precio);
      const cantidad = watch(`detalles.${index}.cantidad`) || 1;

      setValue(`detalles.${index}.id_producto`, value);
      setValue(`detalles.${index}.precio`, precio);
      setValue(`detalles.${index}.total`, precio * cantidad);

      setProductosSeleccionadosPersistentes((prev) => {
        const existe = prev.some((p) => p.id === itemSeleccionado.id);
        if (!existe) {
          return [...prev, itemSeleccionado];
        }
        return prev;
      });
    }

    setTimeout(actualizarExistencias, 100);
  };

  const useCantidadChange = (index: number) => {
    const { onChange, ...rest } = register(`detalles.${index}.cantidad`, {
      required: t("validation.quantityRequired"),
      min: { value: 1, message: t("validation.minimumQuantity") },
      valueAsNumber: true,
    });

    return {
      ...rest,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        const cantidad = Number(e.target.value) || 0;
        const precio = watch(`detalles.${index}.precio`) || 0;
        setValue(`detalles.${index}.total`, cantidad * precio);
        setTimeout(actualizarExistencias, 300);
      },
    };
  };

  const productosParaVerificar = useMemo(() => {
    return detalles
      .filter((detalle) => detalle.id_producto)
      .map((detalle) => ({
        productoId: detalle.id_producto,
        cantidad: detalle.cantidad || 0,
        forceUpdate: forceUpdate,
      }));
  }, [detalles, forceUpdate]);

  const existenciasQueries = useQueries({
    queries: productosParaVerificar.map((producto) => ({
      queryKey: [
        "existencia-productos",
        producto.productoId,
        sucursal_id,
        producto.cantidad,
        producto.forceUpdate,
      ],
      queryFn: () =>
        obtenerExistenciaProductos(propietarioId, {
          producto: producto.productoId,
          sucursal: sucursal_id,
        }),
      enabled: !!producto.productoId && !!sucursal_id,
      retry: false,
      staleTime: 0,
    })),
  });

  const mapaExistencias = useMemo(() => {
    const mapa: { [key: string]: number } = {};
    existenciasQueries.forEach((query, index) => {
      const productoId = productosParaVerificar[index]?.productoId;
      if (productoId && query.data && query.data.length > 0) {
        const existenciaData = query.data[0];
        mapa[productoId] = parseInt(existenciaData.existenciaTotal) || 0;
      }
    });
    return mapa;
  }, [existenciasQueries, productosParaVerificar]);

  const productosSinExistencia = useMemo(() => {
    return detalles.filter((detalle) => {
      if (!detalle.id_producto || detalle.id_producto === "") {
        return false;
      }

      const existencia = mapaExistencias[detalle.id_producto] || 0;
      const cantidadRequerida = detalle.cantidad || 0;
      return existencia < cantidadRequerida;
    });
  }, [detalles, mapaExistencias]);

  const tieneExistenciaSuficiente = productosSinExistencia.length === 0;

  const infoProductosSinExistencia = useMemo(() => {
    return productosSinExistencia
      .filter((detalle) => detalle.id_producto && detalle.id_producto !== "")
      .map((detalle) => {
        const producto =
          productosSeleccionadosPersistentes.find(
            (p) => p.id === detalle.id_producto,
          ) || productosDisponibles.find((p) => p.id === detalle.id_producto);
        const existencia = mapaExistencias[detalle.id_producto] || 0;

        return {
          nombre: producto?.nombre || t("fallback.unknownProduct"),
          cantidadRequerida: detalle.cantidad || 0,
          existenciaActual: existencia,
          productoId: detalle.id_producto,
        };
      });
  }, [
    productosSinExistencia,
    productosSeleccionadosPersistentes,
    productosDisponibles,
    mapaExistencias,
    t,
  ]);

  const subTotal = useMemo(() => {
    return (
      detalles?.reduce((total, detalle) => {
        const cantidad = Number(detalle.cantidad) || 0;
        const precio = Number(detalle.precio) || 0;
        return total + cantidad * precio;
      }, 0) || 0
    );
  }, [JSON.stringify(detalles)]);

  const totalGeneral = useMemo(() => {
    return (
      subTotal - descuentos + importeExento + importeExonerado + cargosExtra
    );
  }, [subTotal, descuentos, importeExento, importeExonerado, cargosExtra]);

  useEffect(() => {
    setValue("sub_total", subTotal);
  }, [subTotal, setValue]);

  useEffect(() => {
    const descuentoId = watch("descuento_id");

    if (descuentoId && descuentoId !== "ninguno") {
      const descuentoSeleccionado = descuentos_clientes?.find(
        (d: ResponseDescuentosAgroInterface) => d.id === descuentoId,
      );

      if (descuentoSeleccionado) {
        const descuento_calculado =
          Number(descuentoSeleccionado.porcentaje) / 100;
        const descuento_final = subTotal * descuento_calculado;
        setDescuentos(descuento_final);
        setValue("descuentos_rebajas", descuento_final);
      }
    } else {
      setDescuentos(0);
      setValue("descuentos_rebajas", 0);
    }
  }, [subTotal, watch("descuento_id"), descuentos_clientes, setValue]);

  const handleDescuentoChange = (value: string) => {
    if (value === "ninguno") {
      setDescuentos(0);
      setValue("descuento_id", "");
      setValue("descuentos_rebajas", 0);
    } else {
      const descuentoSeleccionado = descuentos_clientes?.find(
        (d: ResponseDescuentosAgroInterface) => d.id === value,
      );
      if (descuentoSeleccionado) {
        const descuento_calculado =
          Number(descuentoSeleccionado.porcentaje) / 100;
        const descuento_final = subTotal * descuento_calculado;
        setDescuentos(descuento_final);
        setValue("descuento_id", descuentoSeleccionado.id);
        setValue("descuentos_rebajas", descuento_final);
      } else {
        setDescuentos(0);
        setValue("descuento_id", "");
        setValue("descuentos_rebajas", 0);
      }
    }
  };

  const calcularTotalLinea = (cantidad: number, precio: number) => {
    return (Number(cantidad) || 0) * (Number(precio) || 0);
  };

  const mutation = useMutation({
    mutationFn: (data: Partial<CrearFacturaAgroInterface>) =>
      EditarFacturaAgro(factura?.id ?? "", { ...data, sucursal_id }),
    onSuccess: () => {
      toast.success(t("notifications.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["factura", factura?.id] });
      onSuccess();
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

  const onSubmit = (data: CrearFacturaAgroInterface) => {
    if (!data.detalles || data.detalles.length === 0) {
      toast.error(t("validation.addAtLeastOneProduct"));
      return;
    }

    const detallesInvalidos = data.detalles.some(
      (detalle) => !detalle.id_producto,
    );
    if (detallesInvalidos) {
      toast.error(t("validation.selectAllProducts"));
      return;
    }

    if (hayProductosDuplicados) {
      const productosDuplicadosNombres = productosDuplicados
        .map((productoId) => {
          const producto =
            productosSeleccionadosPersistentes.find(
              (p) => p.id === productoId,
            ) || productosDisponibles.find((p) => p.id === productoId);
          return producto?.nombre || t("fallback.unknownProduct");
        })
        .join(", ");

      toast.error(
        t("validation.duplicateProducts", {
          products: productosDuplicadosNombres,
        }),
      );
      return;
    }

    if (!tieneExistenciaSuficiente) {
      const productosLista = infoProductosSinExistencia
        .map((p) =>
          t("validation.insufficientStockItem", {
            name: p.nombre,
            required: p.cantidadRequerida,
            available: p.existenciaActual,
          }),
        )
        .join(", ");

      toast.error(
        t("validation.insufficientStock", { products: productosLista }),
      );
      return;
    }

    const payload: Partial<CrearFacturaAgroInterface> = {
      ...data,
      importe_gravado_15: data.importe_gravado_15 || 0,
      importe_gravado_18: data.importe_gravado_18 || 0,
      isv_15: data.isv_15 || 0,
      isv_18: data.isv_18 || 0,
      descuentos_rebajas: data.descuentos_rebajas || 0,
    };

    mutation.mutate(payload);
  };

  const eliminarDetalle = (index: number) => {
    const productoId = watch(`detalles.${index}.id_producto`);
    remove(index);

    const otrosDetalles = detalles.filter((_, i) => i !== index);
    const existeOtro = otrosDetalles.some((d) => d.id_producto === productoId);

    if (!existeOtro && productoId) {
      setProductosSeleccionadosPersistentes((prev) =>
        prev.filter((p) => p.id !== productoId),
      );
    }

    setTimeout(actualizarExistencias, 100);
  };

  if (loadingProductos || loadingClientes) {
    return <p>{t("loading")}</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register("descuento_id")} />
      <input type="hidden" {...register("descuentos_rebajas")} />

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <Label className="font-semibold">{t("invoice.number")}</Label>
              <p className="font-bold">{factura?.numero_factura}</p>
            </div>
            <div>
              <Label className="font-semibold">{t("invoice.status")}</Label>
              <Badge variant="default">{factura?.estado}</Badge>
            </div>
            <div>
              <Label className="font-semibold">
                {t("invoice.receivedDate")}
              </Label>
              <p>
                {new Date(factura?.fecha_recepcion ?? "").toLocaleDateString(
                  "es-ES",
                )}
              </p>
            </div>
            <div>
              <Label className="font-semibold">{t("invoice.dueDate")}</Label>
              <p>
                {new Date(
                  factura?.fecha_limite_emision ?? "",
                ).toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("client.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold">{t("client.clientRequired")}</Label>
              <BuscadorClientes
                value={watch("id_cliente") || ""}
                onValueChange={(value) => setValue("id_cliente", value)}
                clientes={clientes || []}
                placeholder={t("client.searchPlaceholder")}
                className={errors.id_cliente ? "border-red-300" : ""}
              />
              {errors.id_cliente && (
                <p className="text-sm font-medium text-red-500">
                  {errors.id_cliente.message as string}
                </p>
              )}
              {watch("id_cliente") && (
                <div className="text-xs text-gray-500 mt-1">
                  {t("client.selected")}:{" "}
                  {clientes?.find((c) => c.id === watch("id_cliente"))?.nombre}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-bold">{t("payment.title")}</Label>
              <Select
                onValueChange={(value) => setValue("forma_pago", value)}
                defaultValue={factura?.forma_pago || FormaPago.CONTADO}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("payment.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FormaPago.CONTADO}>
                    {t("payment.methods.cash")}
                  </SelectItem>
                  <SelectItem value={FormaPago.CREDITO}>
                    {t("payment.methods.credit")}
                  </SelectItem>
                  <SelectItem value={FormaPago.TRANSFERENCIA}>
                    {t("payment.methods.transfer")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.forma_pago && (
                <p className="text-sm font-medium text-red-500">
                  {errors.forma_pago?.message as string}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("totals.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-bold">{t("totals.subtotal")}</Label>
                <Input
                  value={subTotal.toFixed(2)}
                  disabled
                  className="font-bold text-lg text-right bg-gray-100"
                />
              </div>

              <div className="space-y-1">
                <Label className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  {t("totals.extraCharges")}
                </Label>
                <Input
                  type="number"
                  min="0.0"
                  step="1"
                  {...register("cargos_extra", {
                    min: { value: 0, message: t("validation.nonNegative") },
                    valueAsNumber: true,
                  })}
                  placeholder="0.00"
                  className="text-right border-blue-200 bg-blue-50"
                />
                {errors.cargos_extra && (
                  <p className="text-sm text-red-500">
                    {errors.cargos_extra.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label>{t("totals.exemptAmount")}</Label>
                <Input
                  type="number"
                  min="0.0"
                  step="1"
                  {...register("importe_exento", {
                    min: { value: 0, message: t("validation.nonNegative") },
                    valueAsNumber: true,
                  })}
                  placeholder="0.00"
                  className="text-right"
                />
                {errors.importe_exento && (
                  <p className="text-sm text-red-500">
                    {errors.importe_exento.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label>{t("totals.exoneratedAmount")}</Label>
                <Input
                  type="number"
                  min="0.0"
                  step="1"
                  {...register("importe_exonerado", {
                    min: { value: 0, message: t("validation.nonNegative") },
                    valueAsNumber: true,
                  })}
                  placeholder="0.00"
                  className="text-right"
                />
                {errors.importe_exonerado && (
                  <p className="text-sm text-red-500">
                    {errors.importe_exonerado.message}
                  </p>
                )}
              </div>

              <div className="border-t pt-4 md:col-span-2">
                <Label className="font-bold">{t("totals.grandTotal")}</Label>
                <Input
                  value={totalGeneral.toFixed(2)}
                  disabled
                  className="font-bold text-2xl text-green-600 text-right bg-gray-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("discounts.title")}</Label>
              <Select
                onValueChange={handleDescuentoChange}
                disabled={
                  !productosSeleccionadosIds ||
                  productosSeleccionadosIds.length === 0
                }
                value={watch("descuento_id") || "ninguno"}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !productosSeleccionadosIds ||
                      productosSeleccionadosIds.length === 0
                        ? t("discounts.addProductsFirst")
                        : t("discounts.selectDiscount")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ninguno">
                    {t("discounts.noDiscount")}
                  </SelectItem>
                  {descuentos_clientes?.map(
                    (descuento: ResponseDescuentosAgroInterface) => (
                      <SelectItem key={descuento.id} value={descuento.id}>
                        {descuento.nombre} - {descuento.porcentaje}%
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              {watch("descuentos_rebajas") > 0 && (
                <p className="text-sm text-green-600">
                  {t("discounts.applied")}: {simbolo}{" "}
                  {watch("descuentos_rebajas").toFixed(2)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t("products.title")}
          </CardTitle>
          <div className="flex items-center gap-2">
            {(hayProductosDuplicados || !tieneExistenciaSuficiente) && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {t("products.problemsDetected")}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <SelectorProductos
            onAgregar={(productoId) => {
              const emptyFieldIndex = fields.findIndex(
                (field, index) => !watch(`detalles.${index}.id_producto`),
              );

              if (emptyFieldIndex !== -1) {
                handleProductoChange(emptyFieldIndex, productoId);
              } else {
                append({ id_producto: "", cantidad: 1, precio: 0, total: 0 });
                setTimeout(() => {
                  const newIndex = fields.length;
                  handleProductoChange(newIndex, productoId);
                }, 100);
              }
            }}
            productos={productosDisponibles}
            productosSeleccionados={productosSeleccionadosIds}
            disabled={
              productosDisponibles.length ===
                productosSeleccionadosIds.length || hayProductosDuplicados
            }
            categorias={categorias}
            subcategorias={subcategorias}
            tipo_producto={tipo_producto}
            setCategoriaId={setCategoriaId}
            setSubcategoriaId={setSubcategoriaId}
            categoriaId={categoriaId}
            subcategoriaId={subcategoriaId}
            setTipoId={setTipoId}
            tipoId={tipoId}
            simbolo={simbolo}
            setIndicaciones={setIndicaciones}
            setTipoUso={setTipoUso}
            tipo_uso={tipo_uso}
            indicaciones={indicaciones}
            isLoading={loadingProductos}
          />

          {hayProductosDuplicados && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">
                  {t("products.duplicateProductsDetected")}
                </span>
              </div>
              <ul className="mt-1 text-sm text-red-600">
                {productosDuplicados.map((productoId) => {
                  const producto =
                    productosSeleccionadosPersistentes.find(
                      (p) => p.id === productoId,
                    ) || productosDisponibles.find((p) => p.id === productoId);
                  return (
                    <li key={productoId}>
                      • {producto?.nombre || t("fallback.unknownProduct")}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {!tieneExistenciaSuficiente && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">
                  {t("products.insufficientStock")}
                </span>
              </div>
              <ul className="mt-1 text-sm text-orange-600">
                {infoProductosSinExistencia.map((p, index) => (
                  <li key={index}>
                    •{" "}
                    {t("products.stockDetail", {
                      name: p.nombre,
                      required: p.cantidadRequerida,
                      available: p.existenciaActual,
                    })}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.product")}</TableHead>
                <TableHead>{t("table.quantity")}</TableHead>
                <TableHead>{t("table.unitPrice")}</TableHead>
                <TableHead>{t("table.stock")}</TableHead>
                <TableHead>{t("table.total")}</TableHead>
                <TableHead>{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => {
                const productoId = watch(`detalles.${index}.id_producto`);
                const cantidad = watch(`detalles.${index}.cantidad`) || 0;
                const precio = watch(`detalles.${index}.precio`) || 0;

                const producto =
                  productosSeleccionadosPersistentes.find(
                    (p) => p.id === productoId,
                  ) || productosDisponibles.find((p) => p.id === productoId);

                const existencia = mapaExistencias[productoId];
                const sinSuficienteExistencia =
                  existencia !== undefined && existencia < cantidad;
                const esDuplicado = productosDuplicados.includes(productoId);

                const cantidadInputProps = useCantidadChange(index);

                if (!productoId) return null;

                return (
                  <TableRow
                    key={field.id}
                    className={
                      sinSuficienteExistencia || esDuplicado ? "bg-red-50" : ""
                    }
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {producto?.nombre ||
                              t("fallback.unavailableProduct")}
                          </span>
                          <Badge variant="default">
                            {t("products.productBadge")}
                          </Badge>
                        </div>
                        {!producto && (
                          <span className="text-xs text-amber-600">
                            ⚠️ {t("products.unavailableInCurrentFilter")}
                          </span>
                        )}
                        {esDuplicado && (
                          <Badge variant="destructive" className="mt-1 w-fit">
                            {t("products.duplicateBadge")}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min="1"
                        className={
                          sinSuficienteExistencia ? "border-red-300" : ""
                        }
                        {...cantidadInputProps}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Tab"
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        readOnly
                        value={precio}
                        {...register(`detalles.${index}.precio`, {
                          required: t("validation.priceRequired"),
                          valueAsNumber: true,
                        })}
                      />
                    </TableCell>

                    <TableCell>
                      {existencia !== undefined && (
                        <div className="flex flex-col">
                          <span
                            className={
                              sinSuficienteExistencia
                                ? "text-red-600 font-medium"
                                : "text-green-600 font-medium"
                            }
                          >
                            {t("products.stockUnits", { count: existencia })}
                          </span>
                          {sinSuficienteExistencia && (
                            <span className="text-xs text-red-500">
                              {t("products.missingUnits", {
                                count: cantidad - existencia,
                              })}
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="font-medium">
                      {simbolo}{" "}
                      {calcularTotalLinea(cantidad, precio).toFixed(2)}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-around gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          title={t("table.delete")}
                          onClick={() => eliminarDetalle(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {productosSeleccionadosIds.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>{t("products.empty.title")}</p>
              <p className="text-sm">{t("products.empty.description")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ResumenFactura
        subTotal={subTotal}
        fields={fields}
        totalGeneral={totalGeneral}
        cargosExtra={cargosExtra}
        simbolo={simbolo}
      />

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={mutation.isPending}
        >
          {t("buttons.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={
            mutation.isPending ||
            hayProductosDuplicados ||
            !tieneExistenciaSuficiente
          }
          className="flex items-center gap-2"
          size="lg"
        >
          {mutation.isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
              {t("buttons.updating")}
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              {t("buttons.update")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormEditFactura;
