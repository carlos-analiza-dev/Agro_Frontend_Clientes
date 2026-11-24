"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Search, X } from "lucide-react";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { CreateServiciosReproductivo } from "@/api/reproduccion/interfaces/crear-servicio-reproductivo.interface";
import { CrearServicioReproductivo } from "@/api/reproduccion/accions/servicios/crear-servicio-reproductivo";
import { EditarServicioReproductivo } from "@/api/reproduccion/accions/servicios/editar-servicio-reproductivo";
import useGetCelosActivosByAnimal from "@/hooks/reproduccion/useGetCelosActivosByAnimal";
import { TipoServicio } from "@/interfaces/enums/servicios-reproductivos.enum";
import { Servicio } from "@/api/reproduccion/interfaces/response-servicio-repoductivo.interface";
import { convertirFechaHora } from "@/helpers/funciones/convertirFechaHoras";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Celo } from "@/api/reproduccion/interfaces/response-celos-animal,interface";

interface Props {
  servicio?: Servicio | null;
  setOpenModal: (open: boolean) => void;
  onSuccess?: () => void;
  hembras: Animal[];
  machos: Animal[];
  moneda: string;
}

const FormServicioReproductivo = ({
  servicio,
  setOpenModal,
  onSuccess,
  hembras,
  machos,
  moneda,
}: Props) => {
  const t = useTranslations("formServicioReproductivo");

  const [errorMessage, setIsErrorMessage] = useState<string>("");
  const [selectedHembra, setSelectedHembra] = useState<string>("");
  const [machoPerteneceFinca, setMachoPerteneceFinca] = useState<boolean>(true);
  const [mostrarSeccionMacho, setMostrarSeccionMacho] = useState<boolean>(true);
  const [searchHembraTerm, setSearchHembraTerm] = useState<string>("");
  const [isHembraSearchOpen, setIsHembraSearchOpen] = useState<boolean>(false);
  const [searchMachoTerm, setSearchMachoTerm] = useState<string>("");
  const [isMachoSearchOpen, setIsMachoSearchOpen] = useState<boolean>(false);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiciosReproductivo>({
    defaultValues: {
      hembra_id: "",
      macho_id: "",
      macho_externo_nombre: "",
      macho_pertenece_finca: true,
      tipo_servicio: TipoServicio.MONTA_NATURAL,
      fecha_servicio: "",
      celo_id: "",
      dosis_semen: "",
      proveedor_semen: "",
      tecnico_responsable: "",
      observaciones: "",
      detalles: [],
      metadata: {
        costo: 0,
        duracion_minutos: 0,
        condiciones_climaticas: "",
        evaluacion_macho: "",
      },
    },
  });

  const queryClient = useQueryClient();
  const isEditing = !!servicio;

  const { data: celosActivos, isLoading: isLoadingCelos } =
    useGetCelosActivosByAnimal(selectedHembra);

  const tipoServicio = watch("tipo_servicio");
  const isIATF = tipoServicio === TipoServicio.INSEMINACION_ARTIFICIAL;
  const isTransferencia = tipoServicio === TipoServicio.TRANSFERENCIA_EMBRIONES;
  const isFIV = tipoServicio === TipoServicio.FERTILIZACION_INVITRO;
  const isMontaNatural = tipoServicio === TipoServicio.MONTA_NATURAL;
  const machoPerteneceFincaValue = watch("macho_pertenece_finca");
  const hembraId = watch("hembra_id");
  const machoId = watch("macho_id");

  const filteredHembras =
    hembras?.filter((animal) => {
      const searchTerm = searchHembraTerm.toLowerCase().trim();
      if (!searchTerm) return true;

      const identificador = animal.identificador?.toLowerCase() || "";
      const nombre = animal.nombre_animal?.toLowerCase() || "";
      const especie = animal.especie?.nombre?.toLowerCase() || "";

      return (
        identificador.includes(searchTerm) ||
        nombre.includes(searchTerm) ||
        especie.includes(searchTerm)
      );
    }) || [];

  const filteredMachos =
    machos?.filter((animal) => {
      const searchTerm = searchMachoTerm.toLowerCase().trim();
      if (!searchTerm) return true;

      const identificador = animal.identificador?.toLowerCase() || "";
      const nombre = animal.nombre_animal?.toLowerCase() || "";
      const especie = animal.especie?.nombre?.toLowerCase() || "";

      return (
        identificador.includes(searchTerm) ||
        nombre.includes(searchTerm) ||
        especie.includes(searchTerm)
      );
    }) || [];

  const selectedHembraAnimal = hembras?.find(
    (animal) => animal.id === hembraId,
  );
  const selectedMachoAnimal = machos?.find((animal) => animal.id === machoId);

  const getAnimalName = (animal: Animal | undefined) =>
    animal?.identificador || animal?.nombre_animal || t("animal.generic");

  const getAnimalSpecies = (animal: Animal) =>
    animal.especie?.nombre || t("animal.unspecifiedSpecies");

  const getAnimalIdentifier = (animal: Animal) =>
    animal.identificador || animal.nombre_animal || t("animal.unidentified");

  const getServiceTypeLabel = (value: TipoServicio) => {
    const labels: Record<string, string> = {
      [TipoServicio.MONTA_NATURAL]: "serviceTypes.naturalMating",
      [TipoServicio.INSEMINACION_ARTIFICIAL]:
        "serviceTypes.artificialInsemination",
      [TipoServicio.TRANSFERENCIA_EMBRIONES]: "serviceTypes.embryoTransfer",
      [TipoServicio.FERTILIZACION_INVITRO]: "serviceTypes.inVitroFertilization",
    };

    const key = labels[value];
    return key ? t(key) : value;
  };

  useEffect(() => {
    if (isMontaNatural) {
      setMostrarSeccionMacho(true);
    } else if (isIATF || isTransferencia || isFIV) {
      setMostrarSeccionMacho(true);
    } else {
      setMostrarSeccionMacho(false);
    }
  }, [tipoServicio, isMontaNatural, isIATF, isTransferencia, isFIV]);

  useEffect(() => {
    if (servicio) {
      setValue("hembra_id", servicio.hembra?.id || "");
      setSelectedHembra(servicio.hembra?.id || "");

      const tieneMachoFinca = !!servicio.macho?.id;
      setValue("macho_pertenece_finca", tieneMachoFinca);
      setMachoPerteneceFinca(tieneMachoFinca);

      if (tieneMachoFinca) {
        setValue("macho_id", servicio.macho?.id || "");
        setValue("macho_externo_nombre", "");
      } else {
        setValue("macho_id", "");
        setValue("macho_externo_nombre", servicio.macho_externo_nombre || "");
      }

      setValue(
        "tipo_servicio",
        servicio.tipo_servicio || TipoServicio.MONTA_NATURAL,
      );

      setValue("fecha_servicio", convertirFechaHora(servicio.fecha_servicio));
      setValue("celo_id", servicio.celo_asociado?.id || "");
      setValue("dosis_semen", servicio.dosis_semen || "");
      setValue("proveedor_semen", servicio.proveedor_semen || "");
      setValue("tecnico_responsable", servicio.tecnico_responsable || "");
      setValue("observaciones", servicio.observaciones || "");
      setValue("metadata", servicio.metadata || {});
    } else {
      reset();
      setMachoPerteneceFinca(true);
    }
  }, [servicio, setValue, reset]);

  const handleSelectHembra = (animalId: string) => {
    setValue("hembra_id", animalId);
    setSelectedHembra(animalId);
    setSearchHembraTerm("");
    setIsHembraSearchOpen(false);
  };

  const handleClearHembra = () => {
    setValue("hembra_id", "");
    setSelectedHembra("");
    setSearchHembraTerm("");
    setIsHembraSearchOpen(false);
  };

  const handleSelectMacho = (animalId: string) => {
    setValue("macho_id", animalId);
    setSearchMachoTerm("");
    setIsMachoSearchOpen(false);
  };

  const handleClearMacho = () => {
    setValue("macho_id", "");
    setSearchMachoTerm("");
    setIsMachoSearchOpen(false);
  };

  const onSubmit = async (data: CreateServiciosReproductivo) => {
    try {
      const payload = {
        ...data,
        fecha_servicio: new Date(data.fecha_servicio).toISOString(),
        macho_id:
          data.macho_pertenece_finca && data.macho_id
            ? data.macho_id
            : undefined,
      };

      let response;

      if (isEditing && servicio) {
        if (
          payload.macho_pertenece_finca === true &&
          payload.macho_id === undefined
        ) {
          setIsErrorMessage(t("validation.maleRequired"));
          return;
        }

        if (
          payload.macho_pertenece_finca === false &&
          payload.macho_externo_nombre === ""
        ) {
          setIsErrorMessage(t("validation.externalMaleRequired"));
          return;
        }

        response = await EditarServicioReproductivo(servicio.id, payload);
        toast.success(t("messages.updateSuccess"));
      } else {
        response = await CrearServicioReproductivo(payload);
        toast.success(t("messages.createSuccess"));
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["servicios-reproductivos"] });
      queryClient.invalidateQueries({ queryKey: ["servicios-by-animal"] });
      queryClient.invalidateQueries({ queryKey: ["celos-by-animal"] });

      if (onSuccess) {
        onSuccess();
        setIsErrorMessage("");
      }

      setOpenModal(false);
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.registerError");

        setIsErrorMessage(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error(t("messages.unexpectedError"));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            {t("errors.service", {
              action: t(isEditing ? "actions.update" : "actions.register"),
            })}
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tipo_servicio">
            {t("fields.serviceType")} <span className="text-red-500">*</span>
          </Label>
          <Select
            value={tipoServicio}
            onValueChange={(value) =>
              setValue("tipo_servicio", value as TipoServicio)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("placeholders.selectType")} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TipoServicio).map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {getServiceTypeLabel(tipo)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fecha_servicio">
            {t("fields.serviceDate")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fecha_servicio"
            {...register("fecha_servicio", {
              required: t("validation.dateRequired"),
            })}
            type="datetime-local"
            className={errors.fecha_servicio ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.fecha_servicio && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fecha_servicio.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="hembraSearch">
            {t("fields.female")} <span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
              <input
                type="text"
                id="hembraSearch"
                placeholder={
                  selectedHembraAnimal
                    ? `${getAnimalName(selectedHembraAnimal)} ${t("animal.selected")}`
                    : t("placeholders.searchFemale")
                }
                value={searchHembraTerm}
                onChange={(e) => {
                  setSearchHembraTerm(e.target.value);
                  setIsHembraSearchOpen(true);
                }}
                onFocus={() => setIsHembraSearchOpen(true)}
                className={cn(
                  "w-full pl-9 pr-10 py-3 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  selectedHembraAnimal && "bg-blue-50 border-blue-300",
                )}
                disabled={isSubmitting || isEditing}
              />
              {selectedHembraAnimal && !isEditing && (
                <button
                  type="button"
                  onClick={handleClearHembra}
                  aria-label={t("buttons.clearFemale")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {isHembraSearchOpen && searchHembraTerm && !isEditing && (
              <div className="absolute z-50 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto bg-white">
                {filteredHembras.length > 0 ? (
                  filteredHembras.map((animal) => (
                    <div
                      key={animal.id}
                      onClick={() => handleSelectHembra(animal.id)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50",
                        hembraId === animal.id && "bg-blue-50",
                      )}
                    >
                      <Image
                        src={
                          animal.profileImages.length > 0
                            ? animal.profileImages[0].url
                            : "/images/Image-not-found.png"
                        }
                        alt={t("animal.imageAlt", {
                          identifier: animal.identificador || "",
                        })}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                        unoptimized
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {getAnimalIdentifier(animal)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getAnimalSpecies(animal)}
                          {animal.sexo && ` • ${animal.sexo}`}
                        </p>
                      </div>
                      {hembraId === animal.id && (
                        <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm">
                    <p className="text-gray-500">{t("search.noFemales")}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t("search.tryAnotherTerm")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedHembraAnimal && !searchHembraTerm && !isEditing && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex items-center gap-3">
                <Image
                  src={
                    selectedHembraAnimal.profileImages.length > 0
                      ? selectedHembraAnimal.profileImages[0].url
                      : "/images/Image-not-found.png"
                  }
                  alt={t("animal.imageAlt", {
                    identifier: selectedHembraAnimal.identificador || "",
                  })}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                  unoptimized
                />
                <div>
                  <p className="text-sm font-medium">
                    {getAnimalName(selectedHembraAnimal)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {getAnimalSpecies(selectedHembraAnimal)}
                    {selectedHembraAnimal.sexo &&
                      ` • ${selectedHembraAnimal.sexo}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isEditing && selectedHembraAnimal && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex items-center gap-3">
                <Image
                  src={
                    selectedHembraAnimal.profileImages.length > 0
                      ? selectedHembraAnimal.profileImages[0].url
                      : "/images/Image-not-found.png"
                  }
                  alt={t("animal.imageAlt", {
                    identifier: selectedHembraAnimal.identificador || "",
                  })}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                  unoptimized
                />
                <div>
                  <p className="text-sm font-medium">
                    {getAnimalName(selectedHembraAnimal)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {getAnimalSpecies(selectedHembraAnimal)}
                    {selectedHembraAnimal.sexo &&
                      ` • ${selectedHembraAnimal.sexo}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {errors.hembra_id && (
            <p className="text-sm text-red-500 mt-1">
              {errors.hembra_id.message}
            </p>
          )}
        </div>
      </div>

      {mostrarSeccionMacho && (
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="macho_pertenece_finca"
              checked={machoPerteneceFincaValue}
              onCheckedChange={(checked) => {
                setValue("macho_pertenece_finca", checked as boolean);
                setMachoPerteneceFinca(checked as boolean);

                if (checked) {
                  setValue("macho_externo_nombre", "");
                } else {
                  setValue("macho_id", "");
                  setSearchMachoTerm("");
                }
              }}
              disabled={isSubmitting}
            />
            <Label
              htmlFor="macho_pertenece_finca"
              className="text-sm font-normal"
            >
              {t("fields.maleBelongsToFarm")}
            </Label>
          </div>

          {machoPerteneceFincaValue ? (
            <div>
              <Label htmlFor="machoSearch">
                {t("fields.farmMale")} <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                  <input
                    type="text"
                    id="machoSearch"
                    placeholder={
                      selectedMachoAnimal
                        ? `${getAnimalName(selectedMachoAnimal)} ${t("animal.selected")}`
                        : t("placeholders.searchMale")
                    }
                    value={searchMachoTerm}
                    onChange={(e) => {
                      setSearchMachoTerm(e.target.value);
                      setIsMachoSearchOpen(true);
                    }}
                    onFocus={() => setIsMachoSearchOpen(true)}
                    className={cn(
                      "w-full pl-9 pr-10 py-3 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                      selectedMachoAnimal && "bg-blue-50 border-blue-300",
                    )}
                    disabled={isSubmitting}
                  />
                  {selectedMachoAnimal && (
                    <button
                      type="button"
                      onClick={handleClearMacho}
                      aria-label={t("buttons.clearMale")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {isMachoSearchOpen && searchMachoTerm && (
                  <div className="absolute z-50 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto bg-white">
                    {filteredMachos.length > 0 ? (
                      filteredMachos.map((animal) => (
                        <div
                          key={animal.id}
                          onClick={() => handleSelectMacho(animal.id)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50",
                            machoId === animal.id && "bg-blue-50",
                          )}
                        >
                          <Image
                            src={
                              animal.profileImages.length > 0
                                ? animal.profileImages[0].url
                                : "/images/Image-not-found.png"
                            }
                            alt={t("animal.imageAlt", {
                              identifier: animal.identificador || "",
                            })}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                            unoptimized
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {getAnimalIdentifier(animal)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getAnimalSpecies(animal)}
                              {animal.sexo && ` • ${animal.sexo}`}
                            </p>
                          </div>
                          {machoId === animal.id && (
                            <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm">
                        <p className="text-gray-500">{t("search.noMales")}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {t("search.tryAnotherTerm")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedMachoAnimal && !searchMachoTerm && (
                <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        selectedMachoAnimal.profileImages.length > 0
                          ? selectedMachoAnimal.profileImages[0].url
                          : "/images/Image-not-found.png"
                      }
                      alt={t("animal.imageAlt", {
                        identifier: selectedMachoAnimal.identificador || "",
                      })}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                      unoptimized
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {getAnimalName(selectedMachoAnimal)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {getAnimalSpecies(selectedMachoAnimal)}
                        {selectedMachoAnimal.sexo &&
                          ` • ${selectedMachoAnimal.sexo}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {errors.macho_id && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.macho_id.message}
                </p>
              )}
              {!isMontaNatural && (
                <p className="text-sm text-blue-500 mt-1">
                  {t("messages.maleDonor")}
                </p>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="macho_externo_nombre">
                {t("fields.externalMaleName")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="macho_externo_nombre"
                {...register("macho_externo_nombre", {
                  required: t("validation.externalMaleNameRequired"),
                })}
                placeholder={
                  isMontaNatural
                    ? t("placeholders.externalMaleNatural")
                    : t("placeholders.externalMaleOther")
                }
                disabled={isSubmitting}
                className={errors.macho_externo_nombre ? "border-red-500" : ""}
              />
              <p className="text-sm text-gray-500 mt-1">
                {t("messages.externalMaleOrigin")}
              </p>
              {errors.macho_externo_nombre && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.macho_externo_nombre.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {!servicio && (
        <div>
          <Label htmlFor="celo_id">{t("fields.associatedHeat")}</Label>
          <Select
            value={watch("celo_id") || ""}
            onValueChange={(value) => setValue("celo_id", value)}
            disabled={isSubmitting || !selectedHembra || isLoadingCelos}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isLoadingCelos
                    ? t("placeholders.loadingHeats")
                    : !selectedHembra
                      ? t("placeholders.selectFemaleFirst")
                      : t("placeholders.selectHeat")
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("fields.activeHeats")}</SelectLabel>
                {celosActivos && celosActivos.length > 0 ? (
                  celosActivos.map((celo: Celo) => (
                    <SelectItem key={celo.id} value={celo.id}>
                      {t("animal.heatOption", {
                        number: celo.numeroCelo,
                        date: new Date(celo.fechaInicio).toLocaleDateString(),
                      })}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-celos" disabled>
                    {t("messages.noActiveHeats")}
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            {t("messages.selectAssociatedHeat")}
          </p>
        </div>
      )}

      {(isIATF || isTransferencia || isFIV) && (
        <>
          <div>
            <Label htmlFor="proveedor_semen">{t("fields.semenProvider")}</Label>
            <Input
              id="proveedor_semen"
              {...register("proveedor_semen")}
              placeholder={t("placeholders.providerName")}
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500 mt-1">
              {t("messages.externalProvider")}
            </p>
          </div>

          <div>
            <Label htmlFor="tecnico_responsable">
              {t("fields.responsibleTechnician")}
            </Label>
            <Input
              id="tecnico_responsable"
              {...register("tecnico_responsable")}
              placeholder={t("placeholders.technicianName")}
              disabled={isSubmitting}
            />
          </div>
        </>
      )}

      {isIATF && (
        <div>
          <Label htmlFor="dosis_semen">{t("fields.semenDose")}</Label>
          <Input
            id="dosis_semen"
            {...register("dosis_semen")}
            placeholder={t("placeholders.semenDose")}
            disabled={isSubmitting}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="costo">
            {t("fields.cost")} ({moneda})
          </Label>
          <Input
            id="costo"
            {...register("metadata.costo", { valueAsNumber: true })}
            type="number"
            placeholder="0.00"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="duracion_minutos">{t("fields.duration")}</Label>
          <Input
            id="duracion_minutos"
            {...register("metadata.duracion_minutos", { valueAsNumber: true })}
            type="number"
            placeholder={t("placeholders.duration")}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="condiciones_climaticas">
            {t("fields.weatherConditions")}
          </Label>
          <Select
            value={watch("metadata.condiciones_climaticas") || ""}
            onValueChange={(value) =>
              setValue("metadata.condiciones_climaticas", value)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("placeholders.selectCondition")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soleado">{t("weather.sunny")}</SelectItem>
              <SelectItem value="nublado">{t("weather.cloudy")}</SelectItem>
              <SelectItem value="lluvioso">{t("weather.rainy")}</SelectItem>
              <SelectItem value="ventoso">{t("weather.windy")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="evaluacion_macho">{t("fields.maleEvaluation")}</Label>
          <Select
            value={watch("metadata.evaluacion_macho") || ""}
            onValueChange={(value) =>
              setValue("metadata.evaluacion_macho", value)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("placeholders.selectEvaluation")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excelente">
                {t("evaluations.excellent")}
              </SelectItem>
              <SelectItem value="bueno">{t("evaluations.good")}</SelectItem>
              <SelectItem value="regular">{t("evaluations.fair")}</SelectItem>
              <SelectItem value="malo">{t("evaluations.poor")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="observaciones">{t("fields.observations")}</Label>
        <Textarea
          id="observaciones"
          {...register("observaciones")}
          placeholder={t("placeholders.observations")}
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpenModal(false)}
          disabled={isSubmitting}
        >
          {t("buttons.cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t(isEditing ? "buttons.updating" : "buttons.saving")
            : t(
                isEditing ? "buttons.updateService" : "buttons.registerService",
              )}
        </Button>
      </div>
    </form>
  );
};

export default FormServicioReproductivo;
