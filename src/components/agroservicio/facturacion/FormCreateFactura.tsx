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
  Plus,
  AlertTriangle,
  Search,
  DollarSign,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
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
import { CrearFacturaAgro } from "@/api/agroservicio/facturacion/accions/crear-factura";
import { FormaPago } from "@/helpers/data/agroservicio/facturacion/formaPago";
import SelectorProductos from "./SelectorProductoServicio";

interface Props {
  onSuccess: () => void;
  simbolo: string;
  propietarioId: string;
  sucursal_id: string;
}

const FormCreateFactura = ({
  onSuccess,
  simbolo,
  propietarioId,
  sucursal_id,
}: Props) => {
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
  const [isOpen, setIsOpen] = useState(false);
  const [productoNoVendido, setProductoNoVendido] = useState<
    AgroProducto | undefined
  >(undefined);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [descuentos, setDescuentos] = useState(0);

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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CrearFacturaAgroInterface>({
    defaultValues: {
      detalles: [{ id_producto: "", cantidad: 1, precio: 0, total: 0 }],
      sub_total: 0,
      importe_exento: 0,
      importe_exonerado: 0,
      cargos_extra: 0,
      descuento_id: "",
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
      required: "La cantidad es requerida",
      min: { value: 1, message: "Mínimo 1" },
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
          nombre: producto?.nombre || "Producto desconocido",
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
      }
    } else {
      setDescuentos(0);
    }
  }, [subTotal, watch("descuento_id"), descuentos_clientes]);

  const handleDescuentoChange = (value: string) => {
    if (value === "ninguno") {
      setDescuentos(0);
      setValue("descuento_id", "");
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
      } else {
        setDescuentos(0);
        setValue("descuento_id", "");
      }
    }
  };

  const calcularTotalLinea = (cantidad: number, precio: number) => {
    return (Number(cantidad) || 0) * (Number(precio) || 0);
  };

  const mutation = useMutation({
    mutationFn: (data: CrearFacturaAgroInterface) => CrearFacturaAgro(data),
    onSuccess: () => {
      toast.success("Factura creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      reset();

      setProductosSeleccionadosPersistentes([]);
      onSuccess();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear la factura";
        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear la factura. Inténtalo de nuevo.",
        );
      }
    },
  });

  const onSubmit = (data: CrearFacturaAgroInterface) => {
    if (!data.detalles || data.detalles.length === 0) {
      toast.error("Debe agregar al menos un producto");
      return;
    }

    const detallesInvalidos = data.detalles.some(
      (detalle) => !detalle.id_producto,
    );
    if (detallesInvalidos) {
      toast.error("Todos los productos deben estar seleccionados");
      return;
    }

    if (hayProductosDuplicados) {
      const productosDuplicadosNombres = productosDuplicados
        .map((productoId) => {
          const producto =
            productosSeleccionadosPersistentes.find(
              (p) => p.id === productoId,
            ) || productosDisponibles.find((p) => p.id === productoId);
          return producto?.nombre || "Producto desconocido";
        })
        .join(", ");

      toast.error(
        `No puede agregar el mismo producto más de una vez: ${productosDuplicadosNombres}`,
      );
      return;
    }

    if (!tieneExistenciaSuficiente) {
      const productosLista = infoProductosSinExistencia
        .map(
          (p) =>
            `${p.nombre} (necesita: ${p.cantidadRequerida}, tiene: ${p.existenciaActual})`,
        )
        .join(", ");

      toast.error(`Productos con existencia insuficiente: ${productosLista}`);
      return;
    }

    mutation.mutate({ ...data, sucursal_id: sucursal_id });
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
    return <p>cargando...</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input type="hidden" {...register("descuento_id")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">Cliente*</Label>
                <BuscadorClientes
                  value={watch("id_cliente") || ""}
                  onValueChange={(value) => setValue("id_cliente", value)}
                  clientes={clientes || []}
                  placeholder="Buscar cliente por nombre o identificación..."
                  className={errors.id_cliente ? "border-red-300" : ""}
                />
                {errors.id_cliente && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.id_cliente.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-bold">Forma de Pago*</Label>
                <Select
                  onValueChange={(value) => setValue("forma_pago", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione forma de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FormaPago.CONTADO}>Contado</SelectItem>
                    <SelectItem value={FormaPago.CREDITO}>Crédito</SelectItem>
                    <SelectItem value={FormaPago.TRANSFERENCIA}>
                      Transferencia
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
              <CardTitle className="text-lg">Totales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-bold">Sub Total</Label>
                  <Input
                    value={subTotal.toFixed(2)}
                    disabled
                    className="font-bold text-lg text-right bg-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    Cargos Extra
                  </Label>
                  <Input
                    type="number"
                    min="0.0"
                    step="1"
                    {...register("cargos_extra", {
                      min: { value: 0, message: "No puede ser negativo" },
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
                  <Label>Importe Exento</Label>
                  <Input
                    type="number"
                    min="0.0"
                    step="1"
                    {...register("importe_exento", {
                      min: { value: 0, message: "No puede ser negativo" },
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
                  <Label>Importe Exonerado</Label>
                  <Input
                    type="number"
                    min="0.0"
                    step="1"
                    {...register("importe_exonerado", {
                      min: { value: 0, message: "No puede ser negativo" },
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
                  <Label className="font-bold">Total General</Label>
                  <Input
                    value={totalGeneral.toFixed(2)}
                    disabled
                    className="font-bold text-2xl text-green-600 text-right bg-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descuentos y Rebajas</Label>
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
                          ? "Agregue productos primero"
                          : "Seleccione un descuento"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ninguno">Sin descuento</SelectItem>
                    {descuentos_clientes?.map(
                      (descuento: ResponseDescuentosAgroInterface) => (
                        <SelectItem key={descuento.id} value={descuento.id}>
                          {descuento.nombre} - {descuento.porcentaje}%
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos
            </CardTitle>
            <div className="flex items-center gap-2">
              {(hayProductosDuplicados || !tieneExistenciaSuficiente) && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Problemas detectados
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
                    Productos duplicados detectados:
                  </span>
                </div>
                <ul className="mt-1 text-sm text-red-600">
                  {productosDuplicados.map((productoId) => {
                    const producto =
                      productosSeleccionadosPersistentes.find(
                        (p) => p.id === productoId,
                      ) ||
                      productosDisponibles.find((p) => p.id === productoId);
                    return (
                      <li key={productoId}>
                        • {producto?.nombre || "Producto desconocido"}
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
                    Productos con existencia insuficiente:
                  </span>
                </div>
                <ul className="mt-1 text-sm text-orange-600">
                  {infoProductosSinExistencia.map((p, index) => (
                    <li key={index}>
                      • {p.nombre} (necesita: {p.cantidadRequerida}, tiene:{" "}
                      {p.existenciaActual})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Existencia</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
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
                        sinSuficienteExistencia || esDuplicado
                          ? "bg-red-50"
                          : ""
                      }
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {producto?.nombre || "Producto no disponible"}
                            </span>
                            <Badge variant="default">Producto</Badge>
                          </div>
                          {!producto && (
                            <span className="text-xs text-amber-600">
                              ⚠️ Producto no disponible en el filtro actual
                            </span>
                          )}
                          {esDuplicado && (
                            <Badge variant="destructive" className="mt-1 w-fit">
                              Producto duplicado
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
                            required: "El precio es requerido",
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
                              {existencia} unidades
                            </span>
                            {sinSuficienteExistencia && (
                              <span className="text-xs text-red-500">
                                Faltan {cantidad - existencia}
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
                            title="Eliminar"
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
                <p>No hay productos seleccionados</p>
                <p className="text-sm">
                  Use el buscador arriba para agregar productos
                </p>
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

        <div className="flex justify-end pt-4">
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
                Creando Factura...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Crear Factura
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormCreateFactura;
