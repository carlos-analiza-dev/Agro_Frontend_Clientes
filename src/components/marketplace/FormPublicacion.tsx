"use client";

import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { Categoria } from "@/api/categorias/interfaces/response-categorias";
import { crearPublicacionesMarket } from "@/api/market-animales/accions/crear-publicacion-market";
import { editarPublicacionesMarket } from "@/api/market-animales/accions/editar-publicacion-market";
import { CreateMarketplaceAnimale } from "@/api/market-animales/interfaces/crear-publicacion.interface";
import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";
import { SubCategoria } from "@/api/subcategorias/interface/get-subcategorias.interface";
import MapaSeleccionDireccion from "@/components/maps/MapaSeleccionDireccion";
import SkeletonPublicacion from "@/components/marketplace/SkeletonPublicacion";
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
  Edit,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
  tipo_publicacion: TipoPublicacion;
  cliente: Cliente | undefined;
  publicacion?: ProductoAnimal | undefined;
  isLoading?: boolean;
}

const FormPublicacion = ({
  tipo_publicacion,
  cliente,
  publicacion,
  isLoading,
}: Props) => {
  const paidId = cliente?.pais.id ?? "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const { location, loading: locationLoading } = useUserLocation();
  const [categoriaId, setCategoriaId] = useState("");
  const [subcateId, setSubcateId] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<
    { id: string; url: string }[]
  >([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isUsingUserLocation, setIsUsingUserLocation] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const { data: categorias, isLoading: cat_load } = useGetCategorias({
    is_market: true,
  });
  const { data: subcategorias, isLoading: sub_load } =
    useGetSubCategoriaByCat(categoriaId);
  const { data: marcas, isLoading: marcas_load } = useGetMarcasActivas({
    is_market: true,
  });
  const { data: tipo_producto, isLoading: tipo_load } =
    useGetTipoProductoBySubCategoria(subcateId, {
      is_market: true,
    });
  const { data: animales, isLoading: animal_load } =
    useGetAnimalesPropietario();
  const { data: departamentos, isLoading: depto_load } =
    useGetDeptosActivesByPais(paidId);

  const isAnimales = tipo_publicacion === TipoPublicacion.ANIMALES;
  const isAlquileres = tipo_publicacion === TipoPublicacion.ALQUILERES;

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
      stock: 1,
      precioPorHora: 0,
      precioPorDia: 0,
      precioPorSemana: 0,
      precioPorMes: 0,
      requiereDeposito: false,
      montoDeposito: 0,
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
    if (publicacion && !initialDataLoaded) {
      setIsEditing(true);
      setInitialDataLoaded(true);

      if (publicacion.animal?.id) {
        setValue("animalId", publicacion.animal.id);
      }

      setValue("nombre", publicacion.nombre);
      setValue("descripcion", publicacion.descripcion);

      setValue("precio", parseFloat(publicacion?.precio ?? "0"));
      setValue("precioPorHora", parseFloat(publicacion?.precioHora ?? "0"));
      setValue("precioPorDia", parseFloat(publicacion?.precioDia ?? "0"));
      setValue("precioPorSemana", parseFloat(publicacion?.precioSemana ?? "0"));
      setValue("precioPorMes", parseFloat(publicacion?.precioMes ?? "0"));
      setValue("requiereDeposito", publicacion.deposito);
      setValue("montoDeposito", parseFloat(publicacion?.montoDeposito ?? "0"));
      if (
        publicacion.precio_oferta &&
        parseFloat(publicacion.precio_oferta) > 0
      ) {
        setValue("precio_oferta", parseFloat(publicacion.precio_oferta));
      }

      setValue("stock", publicacion.stock);

      setValue("direccion_completa", publicacion.direccion);
      if (publicacion.latitud) {
        setValue("latitud", parseFloat(publicacion.latitud));
      }
      if (publicacion.longitud) {
        setValue("longitud", parseFloat(publicacion.longitud));
      }

      if (publicacion.categoria?.id) {
        setValue("categoriaId", publicacion.categoria.id);
        setCategoriaId(publicacion.categoria.id);
      }

      if (publicacion.subcategoria?.id) {
        setValue("subcategoriaId", publicacion.subcategoria.id);
        setSubcateId(publicacion.subcategoria.id);
      }

      if (publicacion.marca?.id) {
        setValue("marcaId", publicacion.marca.id);
      }

      if (publicacion.tipo_producto?.id) {
        setValue("tipoProductoId", publicacion.tipo_producto.id);
      }

      if (publicacion.modelo) {
        setValue("modelo", publicacion.modelo);
      }

      if (publicacion.ubicacion?.departamento && departamentos) {
        const deptoEncontrado = departamentos.data.find(
          (depto) => depto.nombre === publicacion.ubicacion.departamento,
        );
        if (deptoEncontrado) {
          setValue("departamentoId", deptoEncontrado.id);
        }
      }

      if (publicacion.imagenes && publicacion.imagenes.length > 0) {
        const imagesList = publicacion.imagenes.map((img) => ({
          id: img.id,
          url: img.url,
        }));
        setExistingImages(imagesList);
        setImagePreviews(imagesList.map((img) => img.url));
      }

      if (publicacion.latitud && publicacion.longitud) {
        setIsUsingUserLocation(false);
      }
    }
  }, [publicacion, setValue, departamentos, initialDataLoaded]);

  useEffect(() => {
    if (publicacion?.subcategoria?.id && subcategorias?.length) {
      setValue("subcategoriaId", publicacion.subcategoria.id);

      setSubcateId(publicacion.subcategoria.id);
    }
  }, [publicacion, subcategorias, setValue]);

  useEffect(() => {
    if (publicacion?.animal?.id && animales?.length) {
      setValue("animalId", publicacion.animal.id);
    }
  }, [publicacion, animales, setValue]);

  useEffect(() => {
    if (location && isUsingUserLocation && !isEditing && !initialDataLoaded) {
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
  }, [
    location,
    setValue,
    isUsingUserLocation,
    departamentos,
    isEditing,
    initialDataLoaded,
  ]);

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
    const currentTotal = imagePreviews.length;

    if (currentTotal + files.length > 10) {
      toast.error(
        `Máximo 10 imágenes permitidas. Actualmente tienes ${currentTotal}`,
      );
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
    if (index < existingImages.length) {
      const imageToDelete = existingImages[index];
      setImagesToDelete((prev) => [...prev, imageToDelete.id]);
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newImageIndex = index - existingImages.length;
      if (newImageIndex >= 0 && newImageIndex < images.length) {
        URL.revokeObjectURL(imagePreviews[index]);
        setImages((prev) => prev.filter((_, i) => i !== newImageIndex));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      }
    }
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
    if (imagePreviews.length === 0) {
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

    if (isAlquileres) {
      const tienePrecioAlquiler =
        (data.precioPorHora && data.precioPorHora > 0) ||
        (data.precioPorDia && data.precioPorDia > 0) ||
        (data.precioPorSemana && data.precioPorSemana > 0) ||
        (data.precioPorMes && data.precioPorMes > 0);

      if (!tienePrecioAlquiler) {
        toast.error("Debes especificar al menos un precio de alquiler");
        return;
      }

      if (
        data.requiereDeposito &&
        (!data.montoDeposito || data.montoDeposito <= 0)
      ) {
        toast.error("Debes especificar el monto del depósito");
        return;
      }
    } else {
      if (data.precio <= 0) {
        toast.error("El precio debe ser mayor a 0");
        return;
      }
      if (data.stock < 1) {
        toast.error("El stock debe ser al menos 1");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      console.log("DATA", data);

      const formData = new FormData();

      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion);
      formData.append("direccion_completa", data.direccion_completa);
      formData.append("categoriaId", data.categoriaId);
      formData.append("subcategoriaId", data.subcategoriaId);
      formData.append("departamentoId", data.departamentoId);
      formData.append("tipo_publicacion", data.tipo_publicacion);

      if (isAlquileres) {
        if (data.precioPorHora && data.precioPorHora > 0) {
          formData.append("precioPorHora", String(data.precioPorHora));
        }
        if (data.precioPorDia && data.precioPorDia > 0) {
          formData.append("precioPorDia", String(data.precioPorDia));
        }
        if (data.precioPorSemana && data.precioPorSemana > 0) {
          formData.append("precioPorSemana", String(data.precioPorSemana));
        }
        if (data.precioPorMes && data.precioPorMes > 0) {
          formData.append("precioPorMes", String(data.precioPorMes));
        }

        if (data.requiereDeposito !== undefined) {
          formData.append("requiereDeposito", String(data.requiereDeposito));
        }
        if (data.montoDeposito && data.montoDeposito > 0) {
          formData.append("montoDeposito", String(data.montoDeposito));
        }
      } else {
        formData.append("precio", String(data.precio));
        formData.append("stock", String(data.stock));

        if (isAnimales && data.animalId) {
          formData.append("animalId", data.animalId);
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

      imagesToDelete.forEach((imageId) => {
        formData.append("imagenesEliminar", imageId);
      });

      let response;
      if (publicacion) {
        response = await editarPublicacionesMarket(publicacion.id, formData);
        toast.success("Publicación actualizada correctamente");
      } else {
        response = await crearPublicacionesMarket(formData);
        toast.success("Publicación creada correctamente");
      }

      queryClient.invalidateQueries({ queryKey: ["animales-market"] });
      queryClient.invalidateQueries({
        queryKey: ["animales-market-sugerencias"],
      });
      queryClient.invalidateQueries({ queryKey: ["mis-publicaciones"] });
      if (publicacion?.id) {
        queryClient.invalidateQueries({
          queryKey: ["animal-market-id", publicacion.id],
        });
      }

      router.push("/marketplace/mis-publicaciones");
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al procesar la publicación";
        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado al procesar la publicación");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (
    isLoading ||
    cat_load ||
    sub_load ||
    marcas_load ||
    animal_load ||
    tipo_load ||
    depto_load
  ) {
    return <SkeletonPublicacion />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/5">
            <Card className="sticky top-6">
              <CardContent className="p-4 sm:p-6">
                <Label className="text-base font-semibold flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <ImagePlus className="w-5 h-5" />
                    <span>Fotos</span>
                  </div>
                  <span className="text-sm text-gray-500 font-normal">
                    {imagePreviews.length}/10
                  </span>
                </Label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={200}
                          height={200}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Eliminar imagen"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index < existingImages.length && (
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                          Actual
                        </div>
                      )}
                    </div>
                  ))}

                  {imagePreviews.length < 10 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors min-h-[100px]">
                      <ImagePlus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      <span className="text-xs sm:text-sm text-gray-500 text-center px-2">
                        {imagePreviews.length === 0 ? "Subir foto" : "Agregar"}
                      </span>
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

                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-500">
                    📸 Sube hasta 10 imágenes (máx. 5MB cada una)
                  </p>
                  <p className="text-xs text-gray-400">
                    💡 La primera imagen será la portada
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-3/5 space-y-6">
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-5">
                <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-3">
                  <Tag className="w-5 h-5" />
                  Información básica
                  {isEditing && (
                    <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Modo edición
                    </span>
                  )}
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
                        {animales && animales.length > 0 ? (
                          animales?.map((animal: Animal) => (
                            <SelectItem key={animal.id} value={animal.id}>
                              <div className="flex gap-2 items-center">
                                <Avatar>
                                  <AvatarImage
                                    src={
                                      animal.profileImages &&
                                      animal.profileImages.length > 0
                                        ? animal.profileImages[0].url
                                        : "/images/Image-not-found.png"
                                    }
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                  <span className="font-medium">
                                    {animal.identificador}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {animal.especie?.nombre} - {animal.sexo}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <p>No hay animales disponibles</p>
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1.5">
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
                    className="text-sm sm:text-base"
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-sm mt-1.5">
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
                    rows={5}
                    {...register("descripcion")}
                    className="text-sm sm:text-base resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    💡 Incluye características, condiciones y detalles
                    importantes
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="marcaId" className="mb-2 block">
                          Marca (opcional)
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
                        Modelo (opcional)
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
              <CardContent className="p-4 sm:p-6 space-y-5">
                <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-3">
                  <DollarSign className="w-5 h-5" />
                  {isAlquileres
                    ? "Precios de alquiler"
                    : "Precio y disponibilidad"}
                </h2>

                {isAlquileres ? (
                  // Sección de precios de alquiler
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="precioPorHora" className="mb-2 block">
                          Precio por hora
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="precioPorHora"
                            type="number"
                            step="0.01"
                            min={0}
                            className="pl-9"
                            placeholder="0.00"
                            {...register("precioPorHora", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="precioPorDia" className="mb-2 block">
                          Precio por día
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="precioPorDia"
                            type="number"
                            step="0.01"
                            min={0}
                            className="pl-9"
                            placeholder="0.00"
                            {...register("precioPorDia", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="precioPorSemana" className="mb-2 block">
                          Precio por semana
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="precioPorSemana"
                            type="number"
                            step="0.01"
                            min={0}
                            className="pl-9"
                            placeholder="0.00"
                            {...register("precioPorSemana", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="precioPorMes" className="mb-2 block">
                          Precio por mes
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="precioPorMes"
                            type="number"
                            step="0.01"
                            min={0}
                            className="pl-9"
                            placeholder="0.00"
                            {...register("precioPorMes", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="checkbox"
                          id="requiereDeposito"
                          {...register("requiereDeposito")}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <Label
                          htmlFor="requiereDeposito"
                          className="cursor-pointer"
                        >
                          Requiere depósito de garantía
                        </Label>
                      </div>

                      {watch("requiereDeposito") && (
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="montoDeposito"
                            type="number"
                            step="0.01"
                            min={0}
                            className="pl-9"
                            placeholder="Monto del depósito"
                            {...register("montoDeposito", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      💡 Al menos uno de los precios de alquiler debe ser mayor
                      a 0
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="precio" className="mb-2 block">
                        Precio regular *
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
                      <Label htmlFor="stock" className="mb-2 block">
                        Cantidad / Stock *
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
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Ubicación
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMapModal(true)}
                      className="flex items-center gap-2 text-sm"
                    >
                      <MapIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        Seleccionar en mapa
                      </span>
                      <span className="sm:hidden">Mapa</span>
                    </Button>
                    {location && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={resetToUserLocation}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Navigation className="w-4 h-4" />
                        <span className="hidden sm:inline">Mi ubicación</span>
                        <span className="sm:hidden">GPS</span>
                      </Button>
                    )}
                  </div>
                </div>

                {isUsingUserLocation && location && !isEditing && (
                  <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                    <Navigation className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Utilizando tu ubicación actual
                    </span>
                  </div>
                )}

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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <Label htmlFor="direccion_completa" className="block">
                      Dirección detallada *
                    </Label>
                    {isUsingUserLocation && location && !isEditing && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Navigation className="w-3 h-3" />
                        <span>Usando tu ubicación actual</span>
                      </div>
                    )}
                  </div>
                  <Textarea
                    id="direccion_completa"
                    placeholder="Dirección detallada, referencias, etc..."
                    rows={3}
                    {...register("direccion_completa")}
                    onChange={() => setIsUsingUserLocation(false)}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    📍 Ej: Zona 10, cerca del obelisco, Casa #123
                  </p>
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
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <Navigation className="w-4 h-4 animate-spin" />
                    <span>Obteniendo tu ubicación...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50 lg:relative lg:bg-transparent lg:border-t-0 lg:p-0 lg:shadow-none">
          <div className="flex gap-3 justify-end max-w-7xl mx-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              className={`flex-1 sm:flex-none ${isEditing ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {isEditing ? "Actualizando..." : "Publicando..."}
                </>
              ) : (
                <>
                  {isEditing ? (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Actualizar Publicación
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Publicar
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="h-20 lg:hidden"></div>
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
