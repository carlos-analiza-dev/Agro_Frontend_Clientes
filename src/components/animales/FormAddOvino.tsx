import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowRight, InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useForm } from "react-hook-form";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { SexoAnimal } from "@/interfaces/enums/animales/sexo-animal.enum";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { CreateAnimalOvino } from "@/api/animales/accions/crear-animal";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { FormOvinoData } from "@/api/animales/interfaces/crear-ovino.interface";
import { purezaOptions } from "@/helpers/data/purezaOptions";
import {
  categoriaEdadOptions,
  condicionCorporalOptions,
  edadOvinoOptions,
  propositoOvinoOptions,
  tipoAlimentacionCaprinoOptions,
  tipoNacimientoOptions,
} from "@/helpers/data/animales/animales-data";
import { PurezaEnum } from "@/interfaces/enums/animales/animales-enums";
import { useTranslations } from "next-intl";

interface Props {
  setActiveTab: Dispatch<SetStateAction<string>>;
  selectedEspecieId: string;
}

const FormAddOvino = ({ setActiveTab, selectedEspecieId }: Props) => {
  const t = useTranslations("FormAddOvino");

  const router = useRouter();
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [showIdentifierHelpPadre, setShowIdentifierHelpPadre] = useState(false);
  const [showIdentifierHelpMadre, setShowIdentifierHelpMadre] = useState(false);
  const [isPadreFinca, setIsPadreFinca] = useState(false);
  const [selectedPadreId, setSelectedPadreId] = useState("");
  const [searchPadreTerm, setSearchPadreTerm] = useState("");
  const [filteredMachos, setFilteredMachos] = useState<Animal[]>([]);
  const [isPadreDropdownOpen, setIsPadreDropdownOpen] = useState(false);
  const [isMadreFinca, setIsMadreFinca] = useState(false);
  const [selectedMadreId, setSelectedMadreId] = useState("");
  const [searchMadreTerm, setSearchMadreTerm] = useState("");
  const [filteredHembras, setFilteredHembras] = useState<Animal[]>([]);
  const [isMadreDropdownOpen, setIsMadreDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<
    FormOvinoData & {
      identificador_temp: string;
      identificador_temp_padre: string;
      identificador_temp_madre: string;
    }
  >({
    defaultValues: {
      identificador: "",
      arete_padre: "",
      arete_madre: "",
    },
  });

  const { data: especies } = useGetEspecies();
  const { data: razas } = useGetRazasByEspecie(selectedEspecieId);
  const { data: fincas } = useFincasPropietarios(cliente?.id ?? "");
  const { data: machos } = useGetAnimalesPropietario({
    sexo: SexoAnimal.Macho,
    especie: selectedEspecieId,
  });
  const { data: hembras } = useGetAnimalesPropietario({
    sexo: SexoAnimal.Hembra,
    especie: selectedEspecieId,
  });

  const sexoItems = [
    { value: "macho", label: t("fields.sexoMacho") },
    { value: "hembra", label: t("fields.sexoHembra") },
  ];

  useEffect(() => {
    if (machos) {
      const filtered = machos.filter(
        (macho) =>
          macho.identificador
            .toLowerCase()
            .includes(searchPadreTerm.toLowerCase()) ||
          (macho.nombre_animal &&
            macho.nombre_animal
              .toLowerCase()
              .includes(searchPadreTerm.toLowerCase())),
      );
      setFilteredMachos(filtered);
    }
  }, [searchPadreTerm, machos]);

  useEffect(() => {
    if (hembras) {
      const filtered = hembras.filter(
        (hembra) =>
          hembra.identificador
            .toLowerCase()
            .includes(searchMadreTerm.toLowerCase()) ||
          (hembra.nombre_animal &&
            hembra.nombre_animal
              .toLowerCase()
              .includes(searchMadreTerm.toLowerCase())),
      );
      setFilteredHembras(filtered);
    }
  }, [searchMadreTerm, hembras]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + selectedImages.length > 5) {
      toast.error(t("messages.maxImagenes"));
      return;
    }

    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 1024 * 1024;

      if (!isValidType) {
        toast.error(t("messages.imagenInvalida", { name: file.name }));
        return false;
      }
      if (!isValidSize) {
        toast.error(t("messages.imagenExcede", { name: file.name }));
        return false;
      }
      return true;
    });

    setSelectedImages((prev) => [...prev, ...validFiles]);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const fincasItems =
    fincas?.data.fincas.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const getIdentifierPrefix = () => {
    const especie = especies?.data.find((e) => e.id === selectedEspecieId);
    const razaIds: string[] = watch("razaIds");
    const sexo = watch("sexo");

    if (!especie || !razaIds || razaIds.length === 0 || !sexo) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();

    const razaCodes = razaIds
      .map((id) =>
        razas?.data.find((r) => r.id === id)?.abreviatura?.toUpperCase(),
      )
      .filter(Boolean);

    if (razaCodes.length === 0) return null;

    const combinedRazaCode =
      razaCodes.length === 1 ? razaCodes[0] : `${razaCodes[0]}${razaCodes[1]}`;

    const sexoCode = sexo === "Macho" ? "1" : "2";

    return `${especieCode}${combinedRazaCode}${sexoCode}`;
  };

  const getIdentifierPrefixPadre = () => {
    const especie = especies?.data.find((e) => e.id === selectedEspecieId);
    const razaIdsPadre: string[] = watch("razas_padre") || [];
    const sexo = "1";

    if (!especie || !razaIdsPadre || razaIdsPadre.length === 0) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();

    const razaCodes = razaIdsPadre
      .map((id) =>
        razas?.data.find((r) => r.id === id)?.abreviatura?.toUpperCase(),
      )
      .filter(Boolean);

    if (razaCodes.length === 0) return null;

    const combinedRazaCode =
      razaCodes.length === 1 ? razaCodes[0] : `${razaCodes[0]}${razaCodes[1]}`;

    return `${especieCode}${combinedRazaCode}${sexo}`;
  };

  const getIdentifierPrefixMadre = () => {
    const especie = especies?.data.find((e) => e.id === selectedEspecieId);
    const razaIdsMadre: string[] = watch("razas_madre") || [];
    const sexo = "2";

    if (!especie || !razaIdsMadre || razaIdsMadre.length === 0) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();

    const razaCodes = razaIdsMadre
      .map((id) =>
        razas?.data.find((r) => r.id === id)?.abreviatura?.toUpperCase(),
      )
      .filter(Boolean);

    if (razaCodes.length === 0) return null;

    const combinedRazaCode =
      razaCodes.length === 1 ? razaCodes[0] : `${razaCodes[0]}${razaCodes[1]}`;

    return `${especieCode}${combinedRazaCode}${sexo}`;
  };

  const formatNumber = (num: string) => {
    return num.padStart(6, "0");
  };

  useEffect(() => {
    const temp = watch("identificador_temp");
    if (temp && temp.length === 6) {
      const prefix = getIdentifierPrefix();
      if (prefix) {
        const identificadorCompleto = `${prefix}-${formatNumber(temp)}`;
        setValue("identificador", identificadorCompleto);
      }
    }
  }, [
    watch("identificador_temp"),
    selectedEspecieId,
    watch("razaIds"),
    watch("sexo"),
  ]);

  useEffect(() => {
    const temp = watch("identificador_temp_padre");
    if (temp && temp.length === 6) {
      const prefix = getIdentifierPrefixPadre();
      if (prefix) {
        const aretePadreCompleto = `${prefix}-${formatNumber(temp)}`;
        setValue("arete_padre", aretePadreCompleto);
      }
    }
  }, [
    watch("identificador_temp_padre"),
    selectedEspecieId,
    watch("razas_padre"),
  ]);

  useEffect(() => {
    const temp = watch("identificador_temp_madre");
    if (temp && temp.length === 6) {
      const prefix = getIdentifierPrefixMadre();
      if (prefix) {
        const areteMadreCompleto = `${prefix}-${formatNumber(temp)}`;
        setValue("arete_madre", areteMadreCompleto);
      }
    }
  }, [
    watch("identificador_temp_madre"),
    selectedEspecieId,
    watch("razas_madre"),
  ]);

  const handleIdentifierChange = (input: string) => {
    const numbersOnly = input.replace(/\D/g, "").slice(0, 6);
    setValue("identificador_temp", numbersOnly);
  };

  const handleIdentifierChangePadre = (input: string) => {
    const numbersOnly = input.replace(/\D/g, "").slice(0, 6);
    setValue("identificador_temp_padre", numbersOnly);
  };

  const handleIdentifierChangeMadre = (input: string) => {
    const numbersOnly = input.replace(/\D/g, "").slice(0, 6);
    setValue("identificador_temp_madre", numbersOnly);
  };

  const numeroPartoMadre = watch("numero_parto_madre");

  const mutation = useMutation({
    mutationFn: (data: FormData) => CreateAnimalOvino(data),
    onSuccess: () => {
      toast.success(t("messages.ovinoCreado"));
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      reset();
      setSelectedMadreId("");
      setSelectedPadreId("");
      setSelectedImages([]);
      setImagePreviews([]);
      router.push("/animales");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.errorCrear");
        toast.error(errorMessage);
      } else {
        toast.error(t("messages.errorInesperado"));
      }
    },
  });

  const onSubmit = (data: FormOvinoData) => {
    if (!cliente?.id) return;

    if (isMadreFinca && !selectedMadreId) {
      toast.error(t("validation.seleccionarMadre"));
      return;
    }

    if (isPadreFinca && !selectedPadreId) {
      toast.error(t("validation.seleccionarPadre"));
      return;
    }

    const animalData = {
      ...data,
      propietarioId: cliente.id,
    };

    delete (animalData as any).identificador_temp;
    delete (animalData as any).identificador_temp_padre;
    delete (animalData as any).identificador_temp_madre;

    const formData = new FormData();

    Object.entries(animalData).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        key === "razaIds" ||
        key === "razas_padre" ||
        key === "razas_madre" ||
        key === "tipo_alimentacion" ||
        key === "fecha_nacimiento" ||
        key === "edad_promedio" ||
        key === "categoria_edad" ||
        key === "tipo_nacimiento" ||
        key === "peso_nacimiento" ||
        key === "peso_destete" ||
        key === "peso" ||
        key === "lana" ||
        key === "famacha" ||
        key === "parasitos"
      ) {
        return;
      }

      if (typeof value === "boolean") {
        formData.append(key, String(value));
      } else {
        formData.append(key, String(value));
      }
    });

    formData.append("especie", String(selectedEspecieId));

    if (data.fecha_nacimiento) {
      formData.append("fecha_nacimiento", data.fecha_nacimiento);
    }

    if (data.razaIds && data.razaIds.length > 0) {
      formData.append("razaIds", JSON.stringify(data.razaIds));
    }

    if (data.razas_padre && data.razas_padre.length > 0) {
      formData.append("razas_padre", JSON.stringify(data.razas_padre));
    }

    if (data.razas_madre && data.razas_madre.length > 0) {
      formData.append("razas_madre", JSON.stringify(data.razas_madre));
    }

    if (data.tipo_alimentacion && data.tipo_alimentacion.length > 0) {
      data.tipo_alimentacion.forEach((item, index) => {
        formData.append(`tipo_alimentacion[${index}][alimento]`, item.alimento);
        formData.append(`tipo_alimentacion[${index}][origen]`, item.origen);

        if (item.porcentaje_comprado != null) {
          formData.append(
            `tipo_alimentacion[${index}][porcentaje_comprado]`,
            String(item.porcentaje_comprado),
          );
        }

        if (item.porcentaje_producido != null) {
          formData.append(
            `tipo_alimentacion[${index}][porcentaje_producido]`,
            String(item.porcentaje_producido),
          );
        }
      });
    }

    formData.append("vacunas", data.vacunas || "");
    formData.append("tratamientos", data.tratamientos || "");
    if (data.observaciones) {
      formData.append("observaciones", data.observaciones || "");
    }

    formData.append("edad_promedio", String(data.edad_promedio));

    if (data.peso_nacimiento) {
      formData.append("peso_nacimiento", String(data.peso_nacimiento));
    }

    if (data.peso_destete) {
      formData.append("peso_destete", String(data.peso_destete));
    }

    if (data.categoria_edad) {
      formData.append("categoria_edad", String(data.categoria_edad));
    }

    if (data.tipo_nacimiento) {
      formData.append("tipo_nacimiento", data.tipo_nacimiento);
    }

    if (data.famacha) {
      formData.append("famacha", String(data.famacha));
    }

    if (data.lana) {
      Object.entries(data.lana).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(`lana[${key}]`, String(value));
        }
      });
    }

    if (data.historial_esquila && data.historial_esquila.length > 0) {
      data.historial_esquila.forEach((item, index) => {
        if (item.fecha_esquila) {
          formData.append(
            `historial_esquila[${index}][fecha_esquila]`,
            item.fecha_esquila,
          );
        }
        if (item.peso_vellon_kg) {
          formData.append(
            `historial_esquila[${index}][peso_vellon_kg]`,
            String(item.peso_vellon_kg),
          );
        }
        if (item.calidad_clasificacion) {
          formData.append(
            `historial_esquila[${index}][calidad_clasificacion]`,
            item.calidad_clasificacion,
          );
        }
        if (item.esquilador_responsable) {
          formData.append(
            `historial_esquila[${index}][esquilador_responsable]`,
            item.esquilador_responsable,
          );
        }
        if (item.observaciones) {
          formData.append(
            `historial_esquila[${index}][observaciones]`,
            item.observaciones,
          );
        }
      });
    }

    if (data.parasitos && data.parasitos.length > 0) {
      data.parasitos.forEach((item, index) => {
        if (item.famacha) {
          formData.append(`parasitos[${index}][famacha]`, String(item.famacha));
        }
        if (item.tratamiento) {
          formData.append(`parasitos[${index}][tratamiento]`, item.tratamiento);
        }
        if (item.fecha_tratamiento) {
          formData.append(
            `parasitos[${index}][fecha_tratamiento]`,
            item.fecha_tratamiento,
          );
        }
        if (item.observaciones) {
          formData.append(
            `parasitos[${index}][observaciones]`,
            item.observaciones,
          );
        }
      });
    }

    if (selectedMadreId) {
      formData.append("madreId", selectedMadreId);
    }

    if (selectedPadreId) {
      formData.append("padreId", selectedPadreId);
    }

    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    mutation.mutate(formData as any);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TabsContent value="animal">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              {t("header.title")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t.rich("header.subtitle", {
                red: (chunks) => <span className="text-red-500">{chunks}</span>,
              })}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Identificación */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                {t("sections.identificacion")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.sexo")} <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={watch("sexo") || ""}
                    onValueChange={(value) => setValue("sexo", value)}
                    className="space-y-2"
                  >
                    {sexoItems.map((sexo) => (
                      <div
                        key={sexo.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={sexo.value}
                          id={`sexo-${sexo.value}`}
                        />
                        <Label
                          htmlFor={`sexo-${sexo.value}`}
                          className="text-sm"
                        >
                          {sexo.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.sexo && (
                    <p className="text-sm text-red-500">
                      {errors.sexo.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.areteCodigo")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        value={watch("identificador_temp") || ""}
                        onChange={(e) => handleIdentifierChange(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full font-mono text-lg tracking-wider"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {t("fields.digits6")}
                      </span>
                    </div>
                    <TooltipProvider>
                      <Tooltip
                        open={showIdentifierHelp}
                        onOpenChange={setShowIdentifierHelp}
                      >
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                          >
                            <InfoIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-xs">
                            {t("fields.areteCodigoHelp")}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {errors.identificador && (
                    <p className="text-sm text-red-500">
                      {errors.identificador.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.nombre")}
                  </Label>
                  <Input
                    {...register("nombre_animal")}
                    placeholder={t("fields.nombrePlaceholder")}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.finca")} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("fincaId") || ""}
                    onValueChange={(value) => setValue("fincaId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("fields.fincaPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {fincasItems.map((finca) => (
                        <SelectItem key={finca.value} value={finca.value}>
                          {finca.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fincaId && (
                    <p className="text-sm text-red-500">
                      {errors.fincaId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.potrero")}
                  </Label>
                  <Input
                    {...register("potrero")}
                    placeholder={t("fields.potreroPlaceholder")}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.foto")}
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    disabled={selectedImages.length >= 5}
                    className="w-full cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {t("imagenes.maxInfo")}
                  </p>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={preview}
                          alt={t("imagenes.alt", { index: index + 1 })}
                          className="w-full h-full object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Características */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                {t("sections.caracteristicas")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.raza")} <span className="text-red-500">*</span>
                  </Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                    {razas?.data.map((raza) => (
                      <div
                        key={raza.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={watch("razaIds")?.includes(raza.id) || false}
                          onCheckedChange={(checked) => {
                            const currentValues = watch("razaIds") || [];
                            if (checked) {
                              setValue("razaIds", [...currentValues, raza.id]);
                            } else {
                              setValue(
                                "razaIds",
                                currentValues.filter((id) => id !== raza.id),
                              );
                            }
                          }}
                          id={`raza-${raza.id}`}
                        />
                        <Label htmlFor={`raza-${raza.id}`} className="text-sm">
                          {raza.nombre}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.razaIds && (
                    <p className="text-sm text-red-500">
                      {errors.razaIds.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.edad")} <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={watch("edad_promedio")?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("edad_promedio", Number(value), {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    className="space-y-2"
                  >
                    {edadOvinoOptions.map((edad) => (
                      <div
                        key={edad.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={edad.value.toString()}
                          id={`edad-${edad.value}`}
                        />
                        <Label
                          htmlFor={`edad-${edad.value}`}
                          className="text-sm"
                        >
                          {edad.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.edad_promedio && (
                    <p className="text-sm text-red-500">
                      {errors.edad_promedio.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.fechaNacimiento")}
                  </Label>
                  <Input
                    type="date"
                    {...register("fecha_nacimiento")}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.color")}
                  </Label>
                  <Input
                    {...register("color")}
                    placeholder={t("fields.colorPlaceholder")}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.peso")}
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("peso")}
                    placeholder={t("fields.pesoPlaceholder")}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.condicionCorporal")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={watch("condicion_corporal") || ""}
                  onValueChange={(value) =>
                    setValue("condicion_corporal", value)
                  }
                  className="grid grid-cols-2 md:grid-cols-3 gap-2"
                >
                  {condicionCorporalOptions.map((cond) => (
                    <div
                      key={cond.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={cond.value}
                        id={`cond-${cond.value}`}
                      />
                      <Label htmlFor={`cond-${cond.value}`} className="text-sm">
                        {cond.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.condicion_corporal && (
                  <p className="text-sm text-red-500">
                    {errors.condicion_corporal.message}
                  </p>
                )}
              </div>
            </div>

            {/* Propósito */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                {t("sections.proposito")}{" "}
                <span className="text-red-500">*</span>
              </h3>

              <div className="space-y-2">
                <RadioGroup
                  value={watch("proposito") || ""}
                  onValueChange={(value) => setValue("proposito", value)}
                  className="grid grid-cols-2 md:grid-cols-3 gap-2"
                >
                  {propositoOvinoOptions.map((prop) => (
                    <div
                      key={prop.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={prop.value}
                        id={`prop-${prop.value}`}
                      />
                      <Label htmlFor={`prop-${prop.value}`} className="text-sm">
                        {prop.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.proposito && (
                  <p className="text-sm text-red-500">
                    {errors.proposito.message}
                  </p>
                )}
              </div>
            </div>

            {/* Categoría y Nacimiento */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                {t("sections.categoriaNacimiento")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.categoriaEdad")}
                  </Label>
                  <Select
                    value={watch("categoria_edad") || ""}
                    onValueChange={(value) => setValue("categoria_edad", value)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("fields.categoriaEdadPlaceholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriaEdadOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.tipoNacimiento")}
                  </Label>
                  <Select
                    value={watch("tipo_nacimiento") || ""}
                    onValueChange={(value) =>
                      setValue("tipo_nacimiento", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("fields.tipoNacimientoPlaceholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {tipoNacimientoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.pesoNacimiento")}
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("peso_nacimiento")}
                    placeholder={t("fields.pesoNacimientoPlaceholder")}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.pesoDestete")}
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("peso_destete")}
                    placeholder={t("fields.pesoDestetePlaceholder")}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Genealogía */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                {t("sections.genealogia")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.criador")}
                  </Label>
                  <Input
                    {...register("nombre_criador_origen_animal")}
                    placeholder={t("fields.criadorPlaceholder")}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Producción de Lana */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                {t("sections.lana")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.fechaEsquila")}
                  </Label>
                  <Input
                    type="date"
                    {...register("lana.fecha_esquila")}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.calidadMicras")}
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("lana.calidad_micras")}
                    placeholder={t("fields.calidadMicrasPlaceholder")}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.colorLana")}
                  </Label>
                  <Input
                    {...register("lana.color_lana")}
                    placeholder={t("fields.colorLanaPlaceholder")}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.pesoVellon")}
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("lana.peso_vellon")}
                    placeholder={t("fields.pesoVellonPlaceholder")}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Sanidad */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                {t("sections.sanidad")}
              </h3>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="desparasitacion"
                  checked={watch("desparasitado")}
                  onCheckedChange={(checked) =>
                    setValue("desparasitado", checked === true, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
                <Label
                  htmlFor="desparasitado"
                  className="text-sm font-medium cursor-pointer"
                >
                  {t("fields.desparasitado")}
                </Label>
              </div>

              {errors.desparasitado && (
                <p className="text-sm text-red-500">
                  {errors.desparasitado.message}
                </p>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.vacunas")}
                </Label>
                <Input
                  {...register("vacunas")}
                  placeholder={t("fields.vacunasPlaceholder")}
                  className="w-full"
                />
                {errors.vacunas && (
                  <p className="text-sm text-red-500">
                    {errors.vacunas.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.tratamientos")}
                </Label>
                <Textarea
                  {...register("tratamientos")}
                  placeholder={t("fields.tratamientosPlaceholder")}
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Alimentación */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                {t("sections.alimentacion")}
              </h3>

              <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                {tipoAlimentacionCaprinoOptions.map((alimento) => {
                  const alimentoSeleccionado = watch("tipo_alimentacion")?.find(
                    (a: any) => a.alimento === alimento.value,
                  );

                  return (
                    <div
                      key={alimento.value}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={!!alimentoSeleccionado}
                            onCheckedChange={(checked) => {
                              const isChecked = checked === true;
                              const currentAlimentacion =
                                watch("tipo_alimentacion") || [];

                              if (isChecked) {
                                setValue("tipo_alimentacion", [
                                  ...currentAlimentacion,
                                  {
                                    alimento: alimento.value,
                                    origen: "comprado",
                                  },
                                ]);
                              } else {
                                setValue(
                                  "tipo_alimentacion",
                                  currentAlimentacion.filter(
                                    (a: any) => a.alimento !== alimento.value,
                                  ),
                                );
                              }
                            }}
                          />
                          <Label className="font-medium">
                            {alimento.label}
                          </Label>
                        </div>
                      </div>

                      {alimentoSeleccionado && (
                        <div className="pl-6 space-y-3">
                          <RadioGroup
                            value={alimentoSeleccionado.origen}
                            onValueChange={(origen) => {
                              const updated = (
                                watch("tipo_alimentacion") || []
                              ).map((item: any) =>
                                item.alimento === alimento.value
                                  ? { ...item, origen }
                                  : item,
                              );
                              setValue("tipo_alimentacion", updated);
                            }}
                            className="flex flex-wrap gap-4"
                          >
                            {[
                              "comprado",
                              "producido",
                              "comprado y producido",
                            ].map((origen) => (
                              <div
                                key={origen}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={origen}
                                  id={`${alimento.value}-${origen}`}
                                />
                                <Label
                                  htmlFor={`${alimento.value}-${origen}`}
                                  className="text-sm"
                                >
                                  {origen === "comprado"
                                    ? t("alimentacion.origenComprado")
                                    : origen === "producido"
                                      ? t("alimentacion.origenProducido")
                                      : t("alimentacion.origenAmbos")}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>

                          {alimentoSeleccionado.origen ===
                            "comprado y producido" && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">
                                  {t("alimentacion.porcentajeComprado")}
                                </Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={
                                    alimentoSeleccionado.porcentaje_comprado ||
                                    ""
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined;
                                    const updated = (
                                      watch("tipo_alimentacion") || []
                                    ).map((item: any) =>
                                      item.alimento === alimento.value
                                        ? {
                                            ...item,
                                            porcentaje_comprado: value,
                                          }
                                        : item,
                                    );
                                    setValue("tipo_alimentacion", updated);
                                  }}
                                  placeholder={t(
                                    "alimentacion.porcentajeEjemplo",
                                    { value: 60 },
                                  )}
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">
                                  {t("alimentacion.porcentajeProducido")}
                                </Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={
                                    alimentoSeleccionado.porcentaje_producido ||
                                    ""
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined;
                                    const updated = (
                                      watch("tipo_alimentacion") || []
                                    ).map((item: any) =>
                                      item.alimento === alimento.value
                                        ? {
                                            ...item,
                                            porcentaje_producido: value,
                                          }
                                        : item,
                                    );
                                    setValue("tipo_alimentacion", updated);
                                  }}
                                  placeholder={t(
                                    "alimentacion.porcentajeEjemplo",
                                    { value: 40 },
                                  )}
                                  className="w-full"
                                />
                              </div>
                              {alimentoSeleccionado.porcentaje_comprado !==
                                undefined &&
                                alimentoSeleccionado.porcentaje_producido !==
                                  undefined &&
                                alimentoSeleccionado.porcentaje_comprado +
                                  alimentoSeleccionado.porcentaje_producido !==
                                  100 && (
                                  <p className="text-xs text-red-500 col-span-2">
                                    {t("alimentacion.porcentajeSumaError")}
                                  </p>
                                )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Famacha y Parásitos */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                {t("sections.famachaParasitos")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.famacha")}
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    {...register("famacha")}
                    placeholder={t("fields.famachaPlaceholder")}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("fields.famachaInfo")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.tratamiento")}
                  </Label>
                  <Input
                    {...register("parasitos.0.tratamiento")}
                    placeholder={t("fields.tratamientoPlaceholder")}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.fechaTratamiento")}
                  </Label>
                  <Input
                    type="date"
                    {...register("parasitos.0.fecha_tratamiento")}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.observacionesParasitos")}
                  </Label>
                  <Input
                    {...register("parasitos.0.observaciones")}
                    placeholder={t("fields.observacionesParasitosPlaceholder")}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.observaciones")}
              </Label>
              <Textarea
                {...register("observaciones")}
                placeholder={t("fields.observacionesPlaceholder")}
                className="min-h-[100px]"
              />
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button
                type="button"
                onClick={() => setActiveTab("padre")}
                className="group"
              >
                <span>{t("buttons.siguientePadre")}</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* PESTAÑA DATOS PADRE */}
      <TabsContent value="padre">
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="bg-primary/10 text-primary p-1 rounded-md">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </span>
              {t("sections.datosPadre")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="flex items-start space-x-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <Checkbox
                id="padreFinca"
                checked={isPadreFinca}
                onCheckedChange={(checked) => {
                  setIsPadreFinca(checked === true);
                  if (checked === false) setSelectedPadreId("");
                }}
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor="padreFinca"
                  className="font-medium text-blue-900"
                >
                  {t("padre.esDeFinca")}
                </Label>
                <p className="text-xs text-blue-700/70 mt-0.5">
                  {t("padre.esDeFincaDesc")}
                </p>
              </div>
            </div>

            {isPadreFinca ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {t("padre.buscarPadre")}{" "}
                    <span className="text-red-500">*</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {t("padre.buscarPadreDesc")}
                    </span>
                  </Label>

                  <div className="relative">
                    <div className="relative">
                      <Input
                        placeholder={t("padre.buscarPlaceholder")}
                        value={searchPadreTerm}
                        onChange={(e) => {
                          setSearchPadreTerm(e.target.value);
                          setIsPadreDropdownOpen(true);
                        }}
                        onFocus={() => {
                          if (searchPadreTerm) setIsPadreDropdownOpen(true);
                        }}
                        className="w-full pr-10"
                      />
                      {searchPadreTerm && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchPadreTerm("");
                            setSelectedPadreId("");
                            setIsPadreDropdownOpen(false);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {isPadreDropdownOpen && searchPadreTerm && (
                      <>
                        <div
                          className="fixed inset-0 z-0"
                          onClick={() => setIsPadreDropdownOpen(false)}
                        />
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredMachos.length > 0 ? (
                            <div className="py-1">
                              <div className="px-3 py-1.5 text-xs text-muted-foreground bg-gray-50 border-b">
                                {t("padre.resultados", {
                                  count: filteredMachos.length,
                                })}
                              </div>
                              {filteredMachos.map((macho) => (
                                <div
                                  key={macho.id}
                                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
                                  onClick={() => {
                                    setSelectedPadreId(macho.id);
                                    setSearchPadreTerm(
                                      `${macho.identificador} - ${macho.nombre_animal || t("padre.sinNombre")}`,
                                    );
                                    setIsPadreDropdownOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium text-sm">
                                      {macho.identificador}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {macho.nombre_animal ||
                                        t("padre.sinNombre")}
                                    </span>
                                  </div>
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    {t("padre.seleccionar")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-6 text-center text-gray-500">
                              <svg
                                className="w-8 h-8 mx-auto text-gray-300 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p>{t("padre.noMachos")}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {t("padre.noMachosDesc")}
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {selectedPadreId && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-green-700 flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span className="font-medium">
                              {t("padre.padreSeleccionado")}
                            </span>
                          </p>
                          <p className="text-sm font-semibold text-green-800 mt-1">
                            {searchPadreTerm}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1"
                          onClick={() => {
                            setSelectedPadreId("");
                            setSearchPadreTerm("");
                          }}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          {t("padre.cambiar")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {t("padre.nombrePadre")}
                      <span className="text-xs text-muted-foreground font-normal">
                        (opcional)
                      </span>
                    </Label>
                    <Input
                      {...register("nombre_padre")}
                      placeholder={t("padre.nombrePadrePlaceholder")}
                      className="focus:ring-2 focus:ring-blue-500/20"
                    />
                    {errors.nombre_padre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_padre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {t("padre.aretePadre")}
                      <span className="text-xs text-muted-foreground font-normal">
                        {t("padre.aretePadreDesc")}
                      </span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          value={watch("identificador_temp_padre") || ""}
                          onChange={(e) =>
                            handleIdentifierChangePadre(e.target.value)
                          }
                          placeholder="000000"
                          maxLength={6}
                          className="flex-1 font-mono tracking-wider focus:ring-2 focus:ring-blue-500/20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          {watch("identificador_temp_padre")?.length || 0}/6
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip
                          open={showIdentifierHelpPadre}
                          onOpenChange={setShowIdentifierHelpPadre}
                        >
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="shrink-0 hover:bg-blue-50"
                            >
                              <InfoIcon className="h-4 w-4 text-blue-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-xs">
                              {t("fields.areteCodigoHelp")}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {errors.arete_padre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.arete_padre.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {t("padre.razasPadre")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto bg-gray-50">
                    {razas?.data.map((raza) => (
                      <div
                        key={raza.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={
                            watch("razas_padre")?.includes(raza.id) || false
                          }
                          onCheckedChange={(checked) => {
                            const currentValues = watch("razas_padre") || [];
                            if (checked) {
                              setValue("razas_padre", [
                                ...currentValues,
                                raza.id,
                              ]);
                            } else {
                              setValue(
                                "razas_padre",
                                currentValues.filter((id) => id !== raza.id),
                              );
                            }
                          }}
                          id={`raza-padre-${raza.id}`}
                        />
                        <Label
                          htmlFor={`raza-padre-${raza.id}`}
                          className="text-sm"
                        >
                          {raza.nombre}
                        </Label>
                      </div>
                    ))}
                    {(!razas?.data || razas.data.length === 0) && (
                      <p className="text-sm text-muted-foreground">
                        {t("padre.noRazas")}
                      </p>
                    )}
                  </div>
                  {errors.razas_padre && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-red-400">⚠</span>{" "}
                      {errors.razas_padre.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {t("padre.purezaPadre")}
                      <span className="text-xs text-muted-foreground font-normal">
                        (opcional)
                      </span>
                    </Label>
                    <Select
                      value={watch("pureza_padre") || "none"}
                      onValueChange={(value) =>
                        setValue(
                          "pureza_padre",
                          value === "none" ? undefined : (value as PurezaEnum),
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("padre.purezaPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          {t("padre.purezaNoEspecificado")}
                        </SelectItem>
                        {purezaOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.pureza_padre && (
                      <p className="text-sm text-red-500">
                        {errors.pureza_padre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {t("padre.nombreCriadorPadre")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("nombre_criador_padre")}
                      placeholder={t("padre.nombreCriadorPadrePlaceholder")}
                      className="focus:ring-2 focus:ring-blue-500/20"
                    />
                    {errors.nombre_criador_padre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_criador_padre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {t("padre.nombrePropietarioPadre")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("nombre_propietario_padre")}
                      placeholder={t("padre.nombrePropietarioPadrePlaceholder")}
                      className="focus:ring-2 focus:ring-blue-500/20"
                    />
                    {errors.nombre_propietario_padre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_propietario_padre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {t("padre.fincaOrigenPadre")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("nombre_finca_origen_padre")}
                      placeholder={t("padre.fincaOrigenPadrePlaceholder")}
                      className="focus:ring-2 focus:ring-blue-500/20"
                    />
                    {errors.nombre_finca_origen_padre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_finca_origen_padre.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("animal")}
                className="flex-1 sm:flex-none hover:bg-gray-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                {t("buttons.anterior")}
              </Button>
              <Button
                type="button"
                onClick={() => setActiveTab("madre")}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("buttons.siguienteMadre")}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* PESTAÑA DATOS MADRE */}
      <TabsContent value="madre">
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="bg-pink-100 text-pink-700 p-1 rounded-md">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </span>
              {t("sections.datosMadre")}
              {numeroPartoMadre && (
                <span className="ml-auto text-xs font-normal bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {t("madre.parto", { numero: numeroPartoMadre })}
                </span>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="flex items-start space-x-3 p-3 bg-pink-50/50 rounded-lg border border-pink-100">
              <Checkbox
                id="madreFinca"
                checked={isMadreFinca}
                onCheckedChange={(checked) => {
                  setIsMadreFinca(checked === true);
                  if (checked === false) setSelectedMadreId("");
                }}
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor="madreFinca"
                  className="font-medium text-pink-900"
                >
                  {t("madre.esDeFinca")}
                </Label>
                <p className="text-xs text-pink-700/70 mt-0.5">
                  {t("madre.esDeFincaDesc")}
                </p>
              </div>
            </div>

            {isMadreFinca ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {t("madre.buscarMadre")}{" "}
                    <span className="text-red-500">*</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {t("madre.buscarMadreDesc")}
                    </span>
                  </Label>

                  <div className="relative">
                    <div className="relative">
                      <Input
                        placeholder={t("padre.buscarPlaceholder")}
                        value={searchMadreTerm}
                        onChange={(e) => {
                          setSearchMadreTerm(e.target.value);
                          setIsMadreDropdownOpen(true);
                        }}
                        onFocus={() => {
                          if (searchMadreTerm) setIsMadreDropdownOpen(true);
                        }}
                        className="w-full pr-10"
                      />
                      {searchMadreTerm && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchMadreTerm("");
                            setSelectedMadreId("");
                            setIsMadreDropdownOpen(false);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {isMadreDropdownOpen && searchMadreTerm && (
                      <>
                        <div
                          className="fixed inset-0 z-0"
                          onClick={() => setIsMadreDropdownOpen(false)}
                        />
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredHembras.length > 0 ? (
                            <div className="py-1">
                              <div className="px-3 py-1.5 text-xs text-muted-foreground bg-gray-50 border-b">
                                {t("padre.resultados", {
                                  count: filteredHembras.length,
                                })}
                              </div>
                              {filteredHembras.map((hembra) => (
                                <div
                                  key={hembra.id}
                                  className="px-4 py-2 hover:bg-pink-50 cursor-pointer flex items-center justify-between transition-colors"
                                  onClick={() => {
                                    setSelectedMadreId(hembra.id);
                                    setSearchMadreTerm(
                                      `${hembra.identificador} - ${hembra.nombre_animal || t("padre.sinNombre")}`,
                                    );
                                    setIsMadreDropdownOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium text-sm">
                                      {hembra.identificador}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {hembra.nombre_animal ||
                                        t("padre.sinNombre")}
                                    </span>
                                  </div>
                                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                                    {t("padre.seleccionar")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-6 text-center text-gray-500">
                              <svg
                                className="w-8 h-8 mx-auto text-gray-300 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p>{t("madre.noHembras")}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {t("madre.noHembrasDesc")}
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {selectedMadreId && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-green-700 flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span className="font-medium">
                              {t("madre.madreSeleccionada")}
                            </span>
                          </p>
                          <p className="text-sm font-semibold text-green-800 mt-1">
                            {searchMadreTerm}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1"
                          onClick={() => {
                            setSelectedMadreId("");
                            setSearchMadreTerm("");
                          }}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          {t("padre.cambiar")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {t("madre.numeroParto")}{" "}
                    <span className="text-red-500">*</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {t("madre.numeroPartoDesc")}
                    </span>
                  </Label>
                  <div className="relative">
                    <Input
                      min={1}
                      {...register("numero_parto_madre")}
                      required
                      placeholder={t("madre.numeroPartoPlaceholder")}
                      maxLength={2}
                      className="flex-1 font-medium focus:ring-2 focus:ring-pink-500/20"
                      type="number"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      #
                    </span>
                  </div>
                  {errors.numero_parto_madre && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-red-400">⚠</span>{" "}
                      {errors.numero_parto_madre.message}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {t("madre.nombreMadre")}
                      <span className="text-xs text-muted-foreground font-normal">
                        (opcional)
                      </span>
                    </Label>
                    <Input
                      {...register("nombre_madre")}
                      placeholder={t("madre.nombreMadrePlaceholder")}
                      className="focus:ring-2 focus:ring-pink-500/20"
                    />
                    {errors.nombre_madre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_madre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {t("madre.areteMadre")}
                      <span className="text-xs text-muted-foreground font-normal">
                        {t("madre.areteMadreDesc")}
                      </span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          value={watch("identificador_temp_madre") || ""}
                          onChange={(e) =>
                            handleIdentifierChangeMadre(e.target.value)
                          }
                          placeholder="000000"
                          maxLength={6}
                          className="flex-1 font-mono tracking-wider focus:ring-2 focus:ring-pink-500/20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          {watch("identificador_temp_madre")?.length || 0}/6
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip
                          open={showIdentifierHelpMadre}
                          onOpenChange={setShowIdentifierHelpMadre}
                        >
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="shrink-0 hover:bg-pink-50"
                            >
                              <InfoIcon className="h-4 w-4 text-pink-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-xs">
                              {t("fields.areteCodigoHelp")}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {errors.arete_madre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.arete_madre.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {t("madre.razasMadre")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto bg-gray-50">
                    {razas?.data.map((raza) => (
                      <div
                        key={raza.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={
                            watch("razas_madre")?.includes(raza.id) || false
                          }
                          onCheckedChange={(checked) => {
                            const currentValues = watch("razas_madre") || [];
                            if (checked) {
                              setValue("razas_madre", [
                                ...currentValues,
                                raza.id,
                              ]);
                            } else {
                              setValue(
                                "razas_madre",
                                currentValues.filter((id) => id !== raza.id),
                              );
                            }
                          }}
                          id={`raza-madre-${raza.id}`}
                        />
                        <Label
                          htmlFor={`raza-madre-${raza.id}`}
                          className="text-sm"
                        >
                          {raza.nombre}
                        </Label>
                      </div>
                    ))}
                    {(!razas?.data || razas.data.length === 0) && (
                      <p className="text-sm text-muted-foreground">
                        {t("padre.noRazas")}
                      </p>
                    )}
                  </div>
                  {errors.razas_madre && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-red-400">⚠</span>{" "}
                      {errors.razas_madre.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {t("madre.purezaMadre")}
                      <span className="text-xs text-muted-foreground font-normal">
                        (opcional)
                      </span>
                    </Label>
                    <Select
                      value={watch("pureza_madre") || "none"}
                      onValueChange={(value) =>
                        setValue(
                          "pureza_madre",
                          value === "none" ? undefined : (value as PurezaEnum),
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("padre.purezaPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          {t("padre.purezaNoEspecificado")}
                        </SelectItem>
                        {purezaOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.pureza_madre && (
                      <p className="text-sm text-red-500">
                        {errors.pureza_madre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {t("madre.numeroParto")}{" "}
                      <span className="text-red-500">*</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {t("madre.numeroPartoDesc")}
                      </span>
                    </Label>
                    <div className="relative">
                      <Input
                        min={1}
                        {...register("numero_parto_madre")}
                        required
                        placeholder={t("madre.numeroPartoPlaceholder")}
                        maxLength={2}
                        className="flex-1 font-medium focus:ring-2 focus:ring-pink-500/20"
                        type="number"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        #
                      </span>
                    </div>
                    {errors.numero_parto_madre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.numero_parto_madre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {t("madre.nombreCriadorMadre")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("nombre_criador_madre")}
                      placeholder={t("madre.nombreCriadorMadrePlaceholder")}
                      className="focus:ring-2 focus:ring-pink-500/20"
                    />
                    {errors.nombre_criador_madre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_criador_madre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {t("madre.nombrePropietarioMadre")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("nombre_propietario_madre")}
                      placeholder={t("madre.nombrePropietarioMadrePlaceholder")}
                      className="focus:ring-2 focus:ring-pink-500/20"
                    />
                    {errors.nombre_propietario_madre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_propietario_madre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2">
                      {t("madre.fincaOrigenMadre")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("nombre_finca_origen_madre")}
                      placeholder={t("madre.fincaOrigenMadrePlaceholder")}
                      className="focus:ring-2 focus:ring-pink-500/20"
                    />
                    {errors.nombre_finca_origen_madre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_finca_origen_madre.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("padre")}
                className="flex-1 sm:flex-none hover:bg-gray-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                {t("buttons.anterior")}
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 sm:flex-none bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? (
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
                    {t("buttons.creando")}
                  </>
                ) : (
                  <>
                    {t("buttons.crearOvino")}
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </form>
  );
};

export default FormAddOvino;
