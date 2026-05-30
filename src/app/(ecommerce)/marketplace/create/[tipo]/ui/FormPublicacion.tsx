"use client";

import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { Categoria } from "@/api/categorias/interfaces/response-categorias";
import { crearPublicacionesMarket } from "@/api/market-animales/accions/crear-publicacion-market";
import { CreateMarketplaceAnimale } from "@/api/market-animales/interfaces/crear-publicacion.interface";
import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";
import { SubCategoria } from "@/api/subcategorias/interface/get-subcategorias.interface";
import MapaSeleccionDireccion from "@/components/maps/MapaSeleccionDireccion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import useUserLocation from "@/hooks/location/useUserLocation";
import useGetMarcasActivas from "@/hooks/marcas/useGetMarcasActivas";
import useGetSubCategoriaByCat from "@/hooks/subcategorias/useGetSubCategoriaByCat";
import useGetTipoProductoBySubCategoria from "@/hooks/tipo-producto/useGetTipoProductoBySubCategoria";
import { Cliente } from "@/interfaces/auth/cliente";
import { TipoPublicacion } from "@/interfaces/enums/market/tipo_publicacion.enum";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  DollarSign,
  ImagePlus,
  MapPin,
  Package,
  PawPrint,
  Tag,
  X,
  Navigation,
  Map as MapIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  tipo_publicacion: TipoPublicacion;
  cliente: Cliente | undefined;
  publicacion?: ProductoAnimal | undefined;
}

const FormPublicacion = ({ tipo_publicacion, cliente, publicacion }: Props) => {
  const paidId = cliente?.pais.id ?? "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const { location, loading: locationLoading } = useUserLocation();
  const [categoriaId, setCategoriaId] = useState("");
  const [subcateId, setSubcateId] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isUsingUserLocation, setIsUsingUserLocation] = useState(true);

  const { data: categorias } = useGetCategorias({ is_market: true });
  const { data: subcategorias } = useGetSubCategoriaByCat(categoriaId);
  const { data: marcas } = useGetMarcasActivas({ is_market: true });
  const { data: tipo_producto } = useGetTipoProductoBySubCategoria(subcateId, {
    is_market: true,
  });
  const { data: animales } = useGetAnimalesPropietario();
  const { data: departamentos } = useGetDeptosActivesByPais(paidId);

  const isAnimales = tipo_publicacion === TipoPublicacion.ANIMALES;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateMarketplaceAnimale>({
    defaultValues: {
      animalId: "",
      nombre: "",
      descripcion: "",
      precio: 0,
      precio_oferta: undefined,
      stock: 1,
      direccion_completa: "",
      categoriaId: "",
      subcategoriaId: "",
      marcaId: "",
      tipoProductoId: "",
      departamentoId: "",
      modelo: "",
      latitud: undefined,
      longitud: undefined,
      disponible: true,
      vendido: false,
      tipo_publicacion: tipo_publicacion as TipoPublicacion,
    },
  });

  useEffect(() => {
    if (location && isUsingUserLocation) {
      setValue("latitud", location.latitud);
      setValue("longitud", location.longitud);
      if (location.direccion) {
        setValue("direccion_completa", location.direccion);
      }

      if (departamentos && location.ciudad) {
        const deptoEncontrado = departamentos.data.find(
          (depto) =>
            depto.nombre.toLowerCase() === location.ciudad?.toLowerCase() ||
            location.ciudad?.toLowerCase().includes(depto.nombre.toLowerCase()),
        );
        if (deptoEncontrado) {
          setValue("departamentoId", deptoEncontrado.id);
        }
      }
    }
  }, [location, setValue, isUsingUserLocation, departamentos]);

  useEffect(() => {
    if (isAnimales) {
      setValue("marcaId", undefined);
      setValue("tipoProductoId", undefined);
      setValue("modelo", undefined);
    } else {
      setValue("animalId", "");
    }
  }, [isAnimales, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      toast.error("Máximo 10 imágenes permitidas");
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`La imagen ${file.name} excede 5MB`);
        return;
      }
      setImages((prev) => [...prev, file]);
      const preview = URL.createObjectURL(file);
      setImagePreviews((prev) => [...prev, preview]);
    });
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetToUserLocation = () => {
    if (location) {
      setValue("latitud", location.latitud);
      setValue("longitud", location.longitud);
      if (location.direccion) {
        setValue("direccion_completa", location.direccion);
      }
      setIsUsingUserLocation(true);
      toast.success("Ubicación actualizada con tu ubicación actual");
    } else {
      toast.error("No se pudo obtener tu ubicación");
    }
  };

  const handleLocationSelect = (
    direccion: string,
    coords: { latitude: number; longitude: number },
  ) => {
    setValue("direccion_completa", direccion);
    setValue("latitud", coords.latitude);
    setValue("longitud", coords.longitude);
    setIsUsingUserLocation(false);
    toast.success("Ubicación seleccionada correctamente");
  };

  const onSubmit = async (data: CreateMarketplaceAnimale) => {
    if (images.length === 0) {
      toast.warning("Debes subir al menos una imagen");
      return;
    }

    if (!data.nombre || data.nombre.length < 3) {
      toast.error("El nombre debe tener al menos 3 caracteres");
      return;
    }

    if (!data.descripcion || data.descripcion.length < 10) {
      toast.error("La descripción debe tener al menos 10 caracteres");
      return;
    }

    if (isAnimales && !data.animalId) {
      toast.error("Debes seleccionar un animal");
      return;
    }

    if (!data.categoriaId) {
      toast.warning("Selecciona una categoría");
      return;
    }

    if (!data.subcategoriaId) {
      toast.error("Selecciona una subcategoría");
      return;
    }

    if (!data.departamentoId) {
      toast.error("Selecciona un departamento");
      return;
    }

    if (!data.direccion_completa) {
      toast.error("La dirección es requerida");
      return;
    }

    if (data.precio <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return;
    }

    if (data.stock < 1) {
      toast.error("El stock debe ser al menos 1");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("animalId", data.animalId);
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion);
      formData.append("direccion_completa", data.direccion_completa);
      formData.append("precio", String(data.precio));
      formData.append("stock", String(data.stock));
      formData.append("categoriaId", data.categoriaId);
      formData.append("subcategoriaId", data.subcategoriaId);
      formData.append("departamentoId", data.departamentoId);
      formData.append("tipo_publicacion", data.tipo_publicacion);

      if (data.precio_oferta) {
        formData.append("precio_oferta", String(data.precio_oferta));
      }

      if (data.modelo) {
        formData.append("modelo", data.modelo);
      }

      if (data.marcaId) {
        formData.append("marcaId", data.marcaId);
      }

      if (data.tipoProductoId) {
        formData.append("tipoProductoId", data.tipoProductoId);
      }

      if (data.latitud) {
        formData.append("latitud", String(data.latitud));
      }

      if (data.longitud) {
        formData.append("longitud", String(data.longitud));
      }

      formData.append("disponible", String(data.disponible ?? true));

      images.forEach((image) => {
        formData.append("files", image);
      });

      await crearPublicacionesMarket(formData);
      queryClient.invalidateQueries({ queryKey: ["animales-market"] });
      queryClient.invalidateQueries({
        queryKey: ["animales-market-sugerencias"],
      });
      queryClient.invalidateQueries({ queryKey: ["mis-publicaciones"] });
      toast.success("Publicación creada correctamente");
      router.push("/marketplace/mis-publicaciones");
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al ingresar la publicacion";
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <Label className="text-base font-semibold flex items-center gap-2 mb-4">
              <ImagePlus className="w-5 h-5" />
              Fotos
            </Label>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {imagePreviews.length < 10 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                  <ImagePlus className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Subir foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Sube hasta 10 imágenes (máx. 5MB cada una)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Información básica
            </h2>

            {isAnimales && (
              <div>
                <Label htmlFor="animalId" className="mb-2 block">
                  <span className="flex items-center gap-2">
                    <PawPrint className="w-4 h-4" />
                    Seleccionar animal *
                  </span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("animalId", value)}
                  value={watch("animalId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un animal de tu registro" />
                  </SelectTrigger>
                  <SelectContent>
                    {animales?.map((animal: Animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        <div className="flex items-center gap-2">
                          <PawPrint className="w-4 h-4 text-gray-500" />
                          <span>{animal.identificador}</span>
                          <span className="text-xs text-gray-400">
                            {animal.especie.nombre} - {animal.sexo}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Selecciona el animal que deseas publicar
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="nombre" className="mb-2 block">
                Título *
              </Label>
              <Input
                id="nombre"
                placeholder={
                  isAnimales
                    ? "Ej: Vendo Golden Retriever"
                    : "Ej: Venta de alimento balanceado"
                }
                {...register("nombre")}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="descripcion" className="mb-2 block">
                Descripción *
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Describe tu publicación en detalle..."
                rows={4}
                {...register("descripcion")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoriaId" className="mb-2 block">
                  Categoría *
                </Label>
                <Select
                  onValueChange={(value) => {
                    setValue("categoriaId", value);
                    setCategoriaId(value);
                    setValue("subcategoriaId", "");
                  }}
                  value={watch("categoriaId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias?.map((cat: Categoria) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subcategoriaId" className="mb-2 block">
                  Subcategoría *
                </Label>
                <Select
                  onValueChange={(value) => {
                    setValue("subcategoriaId", value);
                    setSubcateId(value);
                  }}
                  value={watch("subcategoriaId")}
                  disabled={!categoriaId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una subcategoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategorias?.map((sub: SubCategoria) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!isAnimales && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marcaId" className="mb-2 block">
                      Marca
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("marcaId", value)}
                      value={watch("marcaId")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {marcas?.map((marca: any) => (
                          <SelectItem key={marca.id} value={marca.id}>
                            {marca.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tipoProductoId" className="mb-2 block">
                      Tipo de producto
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("tipoProductoId", value)
                      }
                      value={watch("tipoProductoId")}
                      disabled={!subcateId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipo_producto?.map((tp: any) => (
                          <SelectItem key={tp.id} value={tp.id}>
                            {tp.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="modelo" className="mb-2 block">
                    Modelo
                  </Label>
                  <Input
                    id="modelo"
                    placeholder="Modelo del producto"
                    {...register("modelo")}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Precio y disponibilidad
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="precio" className="mb-2 block">
                  Precio *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    min={1}
                    className="pl-9"
                    placeholder="0.00"
                    {...register("precio", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="precio_oferta" className="mb-2 block">
                  Precio en oferta
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="precio_oferta"
                    type="number"
                    step="0.01"
                    min={1}
                    className="pl-9"
                    placeholder="0.00"
                    {...register("precio_oferta", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stock" className="mb-2 block">
                  Stock *
                </Label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="stock"
                    min={1}
                    type="number"
                    className="pl-9"
                    {...register("stock", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Ubicación
              </h2>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMapModal(true)}
                  className="flex items-center gap-2"
                >
                  <MapIcon className="w-4 h-4" />
                  Seleccionar en mapa
                </Button>
                {location && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetToUserLocation}
                    className="flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Usar mi ubicación
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="departamentoId" className="mb-2 block">
                Departamento *
              </Label>
              <Select
                onValueChange={(value) => {
                  setValue("departamentoId", value);
                  setIsUsingUserLocation(false);
                }}
                value={watch("departamentoId")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departamentos?.data.map((depto) => (
                    <SelectItem key={depto.id} value={depto.id}>
                      {depto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="direccion_completa" className="block">
                  Dirección detallada *
                </Label>
                {isUsingUserLocation && location && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Navigation className="w-3 h-3" />
                    <span>Usando tu ubicación actual</span>
                  </div>
                )}
              </div>
              <Textarea
                id="direccion_completa"
                placeholder="Dirección detallada..."
                {...register("direccion_completa")}
                onChange={() => setIsUsingUserLocation(false)}
              />
            </div>

            <input
              type="hidden"
              {...register("latitud", { valueAsNumber: true })}
            />
            <input
              type="hidden"
              {...register("longitud", { valueAsNumber: true })}
            />

            {locationLoading && (
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Navigation className="w-4 h-4 animate-pulse" />
                Obteniendo tu ubicación...
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end  bg-white p-4 rounded-lg shadow-lg">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            className="bg-green-500"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </form>

      <MapaSeleccionDireccion
        visible={showMapModal}
        onClose={() => setShowMapModal(false)}
        onLocationSelect={handleLocationSelect}
        initialCoords={
          watch("latitud") && watch("longitud")
            ? {
                latitude: watch("latitud")!,
                longitude: watch("longitud")!,
              }
            : undefined
        }
      />
    </>
  );
};

export default FormPublicacion;
