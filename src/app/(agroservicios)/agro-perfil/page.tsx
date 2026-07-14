"use client";
import TitlePage from "@/components/generics/TitlePage";
import useGetInfoAgro from "@/hooks/agroservicios/mi-agro/useGetInfoAgro";
import { Store } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Pencil,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { IngresarInfoAgro } from "@/api/agroservicio/mi-agroservicio/interface/ingresar-info-agro.interface";
import { ingresarInfoAgro } from "@/api/agroservicio/mi-agroservicio/accions/ingresar-info-agro";
import AgroPerfilSkeleton from "./ui/AgroPerfilSkeleton";
import { editarInfoAgro } from "@/api/agroservicio/mi-agroservicio/accions/editar-info-agro";
import Image from "next/image";
import { subirLogoAgro } from "@/api/agroservicio/mi-agroservicio/accions/subir-logo";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";

const AgroPerfilPage = () => {
  const { cliente } = useAuthStore();
  const { data: info_agro, isLoading } = useGetInfoAgro();
  const prefijo_tel = cliente?.pais.code_phone ?? "+504";
  const queryClient = useQueryClient();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<IngresarInfoAgro>({
    defaultValues: {
      nombre_agroservicio: "",
      rtn: "",
      correo: "",
      telefono: "",
      direccion: "",
    },
  });

  useEffect(() => {
    if (info_agro) {
      let phoneNumber = info_agro.telefono || "";

      if (phoneNumber.startsWith(prefijo_tel)) {
        phoneNumber = phoneNumber.replace(prefijo_tel, "").trim();
      }

      phoneNumber = phoneNumber.trim();

      reset({
        nombre_agroservicio: info_agro.nombre_agroservicio || "",
        rtn: info_agro.rtn || "",
        correo: info_agro.correo || "",
        telefono: phoneNumber,
        direccion: info_agro.direccion || "",
      });

      if (info_agro.logo) {
        setLogoPreview(info_agro.logo.url);
      }
    }
  }, [info_agro, reset, prefijo_tel]);

  const [isEditing, setIsEditing] = React.useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor selecciona una imagen válida");
        return;
      }

      if (file.size > 1024 * 1024) {
        toast.error("La imagen no debe superar los 1MB");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("logo", file);
      return subirLogoAgro(info_agro?.id ?? "", formData);
    },
    onSuccess: () => {
      toast.success("Logo actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["info-agro"] });
      setLogoFile(null);
      setIsUploadingLogo(false);
    },
    onError: (error) => {
      setIsUploadingLogo(false);
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al subir el logo";
        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de subir el logo. Inténtalo de nuevo.",
        );
      }
    },
  });

  const handleUploadLogo = async () => {
    if (!logoFile) {
      toast.warning("Por favor selecciona una imagen");
      return;
    }
    if (!info_agro?.id) {
      toast.warning("Primero debes crear la información del agroservicio");
      return;
    }
    setIsUploadingLogo(true);
    await uploadLogoMutation.mutateAsync(logoFile);
  };

  const create_mutation = useMutation({
    mutationFn: (data: IngresarInfoAgro) => ingresarInfoAgro(data),
    onSuccess: () => {
      toast.success("Información del agroservicio creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["info-agro"] });
      setIsEditing(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear la información del agroservicio";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear la información del agroservicio. Inténtalo de nuevo.",
        );
      }
    },
  });

  const update_mutation = useMutation({
    mutationFn: (data: IngresarInfoAgro) =>
      editarInfoAgro(info_agro?.id ?? "", data),
    onSuccess: () => {
      toast.success("Información actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["info-agro"] });
      setIsEditing(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar la información";
        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar la información. Inténtalo de nuevo.",
        );
      }
    },
  });

  const onSubmit = async (data: IngresarInfoAgro) => {
    const cleanPhone = data.telefono.replace(/[-\s()]/g, "");

    const formattedPhone = `${cleanPhone.slice(0, 4)}-${cleanPhone.slice(4, 8)}`;

    const formattedData = {
      ...data,
      telefono: `${prefijo_tel} ${formattedPhone}`,
    };

    if (info_agro?.id) {
      await update_mutation.mutateAsync(formattedData);
    } else {
      await create_mutation.mutateAsync(formattedData);
    }
  };

  const handleCancel = () => {
    if (info_agro) {
      let phoneNumber = info_agro.telefono || "";
      if (phoneNumber.startsWith(prefijo_tel)) {
        phoneNumber = phoneNumber.replace(prefijo_tel, "").trim();
      }
      phoneNumber = phoneNumber.trim();

      reset({
        nombre_agroservicio: info_agro.nombre_agroservicio || "",
        rtn: info_agro.rtn || "",
        correo: info_agro.correo || "",
        telefono: phoneNumber,
        direccion: info_agro.direccion || "",
      });
      if (info_agro.logo) {
        setLogoPreview(info_agro.logo.url);
      } else {
        setLogoPreview(null);
      }
      setLogoFile(null);
    }
    setIsEditing(false);
  };

  const isMutationPending =
    create_mutation.isPending || update_mutation.isPending;

  const getButtonText = () => {
    if (create_mutation.isPending) return "Creando...";
    if (update_mutation.isPending) return "Guardando...";
    return !info_agro?.id ? "Crear Información" : "Guardar Cambios";
  };

  if (isLoading) {
    return <AgroPerfilSkeleton />;
  }

  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <TitlePage Icon={Store} title="Mi Agroservicio" />
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Pencil className="h-4 w-4" />
            {!info_agro?.id ? "Crear Información" : "Editar Información"}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="gap-2"
              disabled={isMutationPending}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              className="gap-2 bg-green-600 hover:bg-green-700"
              disabled={isMutationPending || (!isDirty && !!info_agro?.id)}
            >
              <Save className="h-4 w-4" />
              {getButtonText()}
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Información del Agroservicio</CardTitle>
            <CardDescription>
              {isEditing
                ? !info_agro?.id
                  ? "Completa los datos de tu agroservicio"
                  : "Modifica los datos de tu agroservicio"
                : "Información básica del agroservicio"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Logo del Agroservicio</Label>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 border-2 border-dashed rounded-lg overflow-hidden flex items-center justify-center bg-muted/20">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo del agroservicio"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  {info_agro?.id ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Label
                          htmlFor="logo-upload"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Seleccionar Imagen</span>
                          <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                            disabled={isUploadingLogo}
                          />
                        </Label>
                        {logoFile && (
                          <Button
                            type="button"
                            onClick={handleUploadLogo}
                            disabled={isUploadingLogo}
                            className="gap-2"
                          >
                            {isUploadingLogo ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Subiendo...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4" />
                                Subir Logo
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Formatos: JPG, PNG. Máximo 1MB
                      </p>
                      {logoFile && (
                        <p className="text-xs text-green-600">
                          Archivo seleccionado: {logoFile.name}
                        </p>
                      )}
                      {info_agro.logo && !logoFile && (
                        <p className="text-xs text-blue-600">
                          Logo actual: {info_agro.logo.mimeType}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Primero crea la información del agroservicio para poder
                        subir el logo
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre_agroservicio">
                  Nombre del Agroservicio
                </Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="nombre_agroservicio"
                      {...register("nombre_agroservicio", {
                        required: "El nombre del agroservicio es requerido",
                        minLength: {
                          value: 2,
                          message: "El nombre debe tener al menos 2 caracteres",
                        },
                      })}
                      placeholder="Ingrese el nombre del agroservicio"
                    />
                    {errors.nombre_agroservicio && (
                      <p className="text-sm text-red-500">
                        {errors.nombre_agroservicio.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                    {info_agro?.nombre_agroservicio || "No especificado"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rtn">RTN</Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="rtn"
                      {...register("rtn", {
                        required: "El RTN es requerido",
                        pattern: {
                          value: /^[0-9]{14}$/,
                          message: "El RTN debe tener 14 dígitos",
                        },
                      })}
                      placeholder="Ingrese el RTN"
                    />
                    {errors.rtn && (
                      <p className="text-sm text-red-500">
                        {errors.rtn.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                    {info_agro?.rtn || "No especificado"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="correo"
                      type="email"
                      {...register("correo", {
                        required: "El correo electrónico es requerido",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Correo electrónico inválido",
                        },
                      })}
                      placeholder="Ingrese el correo electrónico"
                    />
                    {errors.correo && (
                      <p className="text-sm text-red-500">
                        {errors.correo.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                    {info_agro?.correo || "No especificado"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="telefono"
                      {...register("telefono", {
                        required: "El teléfono es requerido",
                        pattern: {
                          value: /^[0-9]{4}-[0-9]{4}$/,
                          message: "Formato inválido. Debe ser xxxx-xxxx",
                        },
                      })}
                      placeholder="Ej: 9999-8888"
                    />
                    {errors.telefono && (
                      <p className="text-sm text-red-500">
                        {errors.telefono.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                    {info_agro?.telefono || "No especificado"}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              {isEditing ? (
                <div className="space-y-1">
                  <Textarea
                    id="direccion"
                    {...register("direccion", {
                      required: "La dirección es requerida",
                      minLength: {
                        value: 10,
                        message:
                          "La dirección debe tener al menos 10 caracteres",
                      },
                    })}
                    placeholder="Ingrese la dirección completa"
                    rows={3}
                  />
                  {errors.direccion && (
                    <p className="text-sm text-red-500">
                      {errors.direccion.message}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                  {info_agro?.direccion || "No especificado"}
                </p>
              )}
            </div>

            {!isEditing && info_agro && info_agro.id && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Creado
                  </Label>
                  <p className="text-sm">
                    {formatDateLocal(info_agro.created_at)}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Última actualización
                  </Label>
                  <p className="text-sm">
                    {formatDateLocal(info_agro.updated_at)}
                  </p>
                </div>
              </div>
            )}

            {!isEditing && info_agro && info_agro.propietario && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Propietario
                  </Label>
                  <p className="text-sm font-medium">
                    {info_agro.propietario.nombre}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">País</Label>
                  <p className="text-sm">
                    {info_agro.propietario.pais?.nombre || "No especificado"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Departamento
                  </Label>
                  <p className="text-sm">
                    {info_agro.propietario.departamento?.nombre ||
                      "No especificado"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Municipio
                  </Label>
                  <p className="text-sm">
                    {info_agro.propietario.municipio?.nombre ||
                      "No especificado"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AgroPerfilPage;
