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
  Search,
  Check,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { ESPECIES_EXCLUIDAS } from "@/helpers/data/especies/especiesData";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("marketPlaceFormPublicacion");
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
  const { data: departamentos, isLoading: depto_load } =
    useGetDeptosActivesByPais(paidId);
  const { data: animales, isLoading: animal_load } =
    useGetAnimalesPropietario();

  const isAnimales = tipo_publicacion === TipoPublicacion.ANIMALES;
  const isAlquileres = tipo_publicacion === TipoPublicacion.ALQUILERES;
  const [searchAnimalTerm, setSearchAnimalTerm] = useState("");

  const filteredAnimales = useMemo(() => {
    const animalesPermitidos = (animales || []).filter((animal: Animal) => {
      const especieNombre = animal.especie?.nombre?.trim() || "";
      return !ESPECIES_EXCLUIDAS.includes(especieNombre);
    });

    if (!searchAnimalTerm.trim()) {
      return animalesPermitidos;
    }

    const term = searchAnimalTerm.toLowerCase().trim();
    return animalesPermitidos.filter((animal: Animal) => {
      const identificador = (animal.identificador || "").toLowerCase();
      const nombre = (animal.nombre_animal || "").toLowerCase();
      return identificador.includes(term) || nombre.includes(term);
    });
  }, [animales, searchAnimalTerm]);

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
      toast.error(t("messages.maxImages", { current: currentTotal }));
      return;
    }

    files.forEach((file) => {
      if (file.size > 3 * 1024 * 1024) {
        toast.error(t("messages.imageTooLarge", { name: file.name }));
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
      toast.success(t("messages.locationUpdated"));
    } else {
      toast.error(t("messages.locationUnavailable"));
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
    toast.success(t("messages.locationSelected"));
  };

  const onSubmit = async (data: CreateMarketplaceAnimale) => {
    if (imagePreviews.length === 0) {
      toast.warning(t("validation.imageRequired"));
      return;
    }

    if (!data.nombre || data.nombre.length < 3) {
      toast.error(t("validation.nameMinLength"));
      return;
    }

    if (!data.descripcion || data.descripcion.length < 10) {
      toast.error(t("validation.descriptionMinLength"));
      return;
    }

    if (isAnimales && !data.animalId) {
      toast.error(t("validation.animalRequired"));
      return;
    }

    if (!data.categoriaId) {
      toast.warning(t("validation.categoryRequired"));
      return;
    }

    if (!data.subcategoriaId) {
      toast.error(t("validation.subcategoryRequired"));
      return;
    }

    if (!data.departamentoId) {
      toast.error(t("validation.departmentRequired"));
      return;
    }

    if (!data.direccion_completa) {
      toast.error(t("validation.addressRequired"));
      return;
    }

    if (isAlquileres) {
      const tienePrecioAlquiler =
        (data.precioPorHora && data.precioPorHora > 0) ||
        (data.precioPorDia && data.precioPorDia > 0) ||
        (data.precioPorSemana && data.precioPorSemana > 0) ||
        (data.precioPorMes && data.precioPorMes > 0);

      if (!tienePrecioAlquiler) {
        toast.error(t("validation.rentalPriceRequired"));
        return;
      }

      if (
        data.requiereDeposito &&
        (!data.montoDeposito || data.montoDeposito <= 0)
      ) {
        toast.error(t("validation.depositAmountRequired"));
        return;
      }
    } else {
      if (data.precio <= 0) {
        toast.error(t("validation.priceGreaterThanZero"));
        return;
      }
      if (data.stock < 1) {
        toast.error(t("validation.stockMinimum"));
        return;
      }
    }

    setIsSubmitting(true);

    try {
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
        toast.success(t("messages.updateSuccess"));
      } else {
        response = await crearPublicacionesMarket(formData);
        toast.success(t("messages.createSuccess"));
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
          t("messages.processError");
        toast.error(errorMessage);
      } else {
        toast.error(t("messages.unexpectedError"));
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
                    <span>{t("images.title")}</span>
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
                          alt={t("images.previewAlt", { number: index + 1 })}
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
                        aria-label={t("images.remove")}
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index < existingImages.length && (
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                          {t("images.current")}
                        </div>
                      )}
                    </div>
                  ))}

                  {imagePreviews.length < 10 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors min-h-[100px]">
                      <ImagePlus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      <span className="text-xs sm:text-sm text-gray-500 text-center px-2">
                        {imagePreviews.length === 0
                          ? t("images.upload")
                          : t("images.add")}
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
                    📸 {t("images.limit")}
                  </p>
                  <p className="text-xs text-gray-400">
                    💡 {t("images.coverHint")}
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
                  {t("basic.title")}
                  {isEditing && (
                    <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {t("basic.editMode")}
                    </span>
                  )}
                </h2>

                {isAnimales && (
                  <div className="space-y-2">
                    <Label htmlFor="animalId" className="block">
                      <span className="flex items-center gap-2">
                        <PawPrint className="w-4 h-4" />
                        {t("animal.searchLabel")}
                      </span>
                    </Label>

                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                        <input
                          type="text"
                          id="animalId"
                          placeholder={t("animal.searchPlaceholder")}
                          value={searchAnimalTerm}
                          onChange={(e) => {
                            setSearchAnimalTerm(e.target.value);
                          }}
                          className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {searchAnimalTerm && (
                      <div className="border rounded-md shadow-lg max-h-60 overflow-y-auto bg-white">
                        {filteredAnimales.length > 0 ? (
                          filteredAnimales.map((animal: Animal) => (
                            <div
                              key={animal.id}
                              onClick={() => {
                                setValue("animalId", animal.id);
                                setSearchAnimalTerm("");
                              }}
                              className={cn(
                                "flex items-start gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50",
                                watch("animalId") === animal.id && "bg-blue-50",
                              )}
                            >
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage
                                  src={
                                    animal.profileImages &&
                                    animal.profileImages.length > 0
                                      ? animal.profileImages[0].url
                                      : "/images/Image-not-found.png"
                                  }
                                  alt={
                                    animal.identificador || animal.nombre_animal
                                  }
                                />
                                <AvatarFallback>
                                  {animal.identificador
                                    ?.slice(0, 2)
                                    .toUpperCase() ||
                                    animal.nombre_animal
                                      ?.slice(0, 2)
                                      .toUpperCase() ||
                                    "AN"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-medium text-sm truncate">
                                    {animal.identificador ||
                                      animal.nombre_animal ||
                                      t("animal.unidentified")}
                                  </span>
                                  {watch("animalId") === animal.id && (
                                    <Check className="h-4 w-4 flex-shrink-0 text-blue-600" />
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <span>
                                    {animal.especie?.nombre ||
                                      t("animal.unspecifiedSpecies")}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {animal.sexo || t("animal.unspecifiedSex")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-6 text-center text-sm">
                            <p>{t("animal.notFound")}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {t("animal.tryAnotherSearch")}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      🔍 {t("animal.searchHint")}
                    </p>

                    {watch("animalId") && !searchAnimalTerm && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        {(() => {
                          const selectedAnimal = animales?.find(
                            (animal: Animal) => animal.id === watch("animalId"),
                          );
                          if (!selectedAnimal) return null;
                          return (
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 flex-shrink-0">
                                <AvatarImage
                                  src={
                                    selectedAnimal.profileImages &&
                                    selectedAnimal.profileImages.length > 0
                                      ? selectedAnimal.profileImages[0].url
                                      : "/images/Image-not-found.png"
                                  }
                                  alt={
                                    selectedAnimal.identificador ||
                                    selectedAnimal.nombre_animal
                                  }
                                />
                                <AvatarFallback>
                                  {selectedAnimal.identificador
                                    ?.slice(0, 2)
                                    .toUpperCase() ||
                                    selectedAnimal.nombre_animal
                                      ?.slice(0, 2)
                                      .toUpperCase() ||
                                    "AN"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {selectedAnimal.identificador ||
                                    selectedAnimal.nombre_animal ||
                                    t("animal.defaultName")}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {selectedAnimal.especie?.nombre ||
                                    t("animal.unspecifiedSpecies")}{" "}
                                  •{" "}
                                  {selectedAnimal.sexo ||
                                    t("animal.unspecifiedSex")}
                                  {selectedAnimal.fecha_nacimiento && (
                                    <>
                                      {" "}
                                      • {t("animal.birthDate")}:{" "}
                                      {new Date(
                                        selectedAnimal.fecha_nacimiento,
                                      ).toLocaleDateString()}
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <Label htmlFor="nombre" className="mb-2 block">
                    {t("fields.title")}
                  </Label>
                  <Input
                    id="nombre"
                    placeholder={
                      isAnimales
                        ? t("placeholders.animalTitle")
                        : t("placeholders.productTitle")
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
                    {t("fields.description")}
                  </Label>
                  <Textarea
                    id="descripcion"
                    placeholder={t("placeholders.description")}
                    rows={5}
                    {...register("descripcion")}
                    className="text-sm sm:text-base resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    💡 {t("hints.description")}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoriaId" className="mb-2 block">
                      {t("fields.category")}
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
                        <SelectValue placeholder={t("placeholders.category")} />
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
                      {t("fields.subcategory")}
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
                        <SelectValue
                          placeholder={t("placeholders.subcategory")}
                        />
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
                          {t("fields.brand")}
                        </Label>
                        <Select
                          onValueChange={(value) => setValue("marcaId", value)}
                          value={watch("marcaId")}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("placeholders.brand")}
                            />
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
                          {t("fields.productType")}
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setValue("tipoProductoId", value)
                          }
                          value={watch("tipoProductoId")}
                          disabled={!subcateId}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("placeholders.productType")}
                            />
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
                        {t("fields.model")}
                      </Label>
                      <Input
                        id="modelo"
                        placeholder={t("placeholders.model")}
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
                  {isAlquileres ? t("pricing.rentalTitle") : t("pricing.title")}
                </h2>

                {isAlquileres ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="precioPorHora" className="mb-2 block">
                          {t("pricing.perHour")}
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
                          {t("pricing.perDay")}
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
                          {t("pricing.perWeek")}
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
                          {t("pricing.perMonth")}
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
                          {t("pricing.requiresDeposit")}
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
                            placeholder={t("placeholders.depositAmount")}
                            {...register("montoDeposito", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      💡 {t("pricing.rentalHint")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="precio" className="mb-2 block">
                        {t("pricing.regularPrice")}
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
                        {t("pricing.stock")}
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
                    {t("location.title")}
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
                        {t("location.selectOnMap")}
                      </span>
                      <span className="sm:hidden">
                        {t("location.mapShort")}
                      </span>
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
                        <span className="hidden sm:inline">
                          {t("location.myLocation")}
                        </span>
                        <span className="sm:hidden">
                          {t("location.gpsShort")}
                        </span>
                      </Button>
                    )}
                  </div>
                </div>

                {isUsingUserLocation && location && !isEditing && (
                  <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                    <Navigation className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      {t("location.usingCurrentLocation")}
                    </span>
                  </div>
                )}

                <div>
                  <Label htmlFor="departamentoId" className="mb-2 block">
                    {t("fields.department")}
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("departamentoId", value);
                      setIsUsingUserLocation(false);
                    }}
                    value={watch("departamentoId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("placeholders.department")} />
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
                      {t("fields.detailedAddress")}
                    </Label>
                    {isUsingUserLocation && location && !isEditing && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Navigation className="w-3 h-3" />
                        <span>{t("location.usingCurrentLocation")}</span>
                      </div>
                    )}
                  </div>
                  <Textarea
                    id="direccion_completa"
                    placeholder={t("placeholders.address")}
                    rows={3}
                    {...register("direccion_completa")}
                    onChange={() => setIsUsingUserLocation(false)}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    📍 {t("hints.addressExample")}
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
                    <span>{t("location.gettingLocation")}</span>
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
              {t("buttons.cancel")}
            </Button>
            <Button
              className={`flex-1 sm:flex-none ${isEditing ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {isEditing ? t("buttons.updating") : t("buttons.publishing")}
                </>
              ) : (
                <>
                  {isEditing ? (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      {t("buttons.updatePublication")}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {t("buttons.publish")}
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
