"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { AlertCircleIcon, Plus, Trash2, Baby, Search, X } from "lucide-react";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { CrearPartoInterface } from "@/api/reproduccion/interfaces/crear-parto.interface";
import { CrearPartoAnimal } from "@/api/reproduccion/accions/partos/crear-parto";
import { EditarPartoAnimal } from "@/api/reproduccion/accions/partos/editar-parto";
import {
  EstadoParto,
  SexoCria,
  TipoParto,
} from "@/interfaces/enums/partos.enums";
import { convertirFechaHora } from "@/helpers/funciones/convertirFechaHoras";
import { Parto } from "@/api/reproduccion/interfaces/response-partos.interface";
import useGetServicioByHembraId from "@/hooks/reproduccion/useGetServicioByHembraId";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  parto?: Parto | null;
  setOpenModal: (open: boolean) => void;
  onSuccess?: () => void;
  hembras: Animal[] | undefined;
}

const FormPartoAnimal = ({
  parto,
  setOpenModal,
  onSuccess,
  hembras,
}: Props) => {
  const t = useTranslations("formPartoAnimal");
  const locale = useLocale();

  const [errorMessage, setIsErrorMessage] = useState<string>("");
  const [selectedHembra, setSelectedHembra] = useState<string>("");
  const [selectedServicio, setSelectedServicio] = useState<string>("");
  const [searchHembraTerm, setSearchHembraTerm] = useState<string>("");
  const [isHembraSearchOpen, setIsHembraSearchOpen] = useState<boolean>(false);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CrearPartoInterface>({
    defaultValues: {
      hembra_id: "",
      servicio_id: "",
      fecha_parto: "",
      numero_parto: 1,
      tipo_parto: TipoParto.NORMAL,
      estado: EstadoParto.COMPLETADO,
      numero_crias: 1,
      numero_crias_vivas: 0,
      numero_crias_muertas: 0,
      observaciones: "",
      complicaciones: "",
      atencion_veterinaria: "",
      veterinario_responsable: "",
      crias: [
        {
          sexo: SexoCria.MACHO,
          peso: 0,
          estado: "VIVA",
          observaciones: "",
          identificador: "",
          fecha_nacimiento: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "crias",
  });

  const queryClient = useQueryClient();
  const isEditing = !!parto;

  const numeroCrias = watch("numero_crias");
  const crias = watch("crias");
  const hembraId = watch("hembra_id");
  const tipoParto = watch("tipo_parto");
  const estadoParto = watch("estado");

  const { data: servicios_hembra } = useGetServicioByHembraId(hembraId);

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

  const selectedHembraAnimal = hembras?.find(
    (animal) => animal.id === hembraId,
  );

  const formatServiceDate = (date: string | Date) =>
    new Date(date).toLocaleDateString(locale);

  useEffect(() => {
    if (crias.length !== numeroCrias) {
      setValue("numero_crias", crias.length);
    }
  }, [crias.length, numeroCrias, setValue]);

  useEffect(() => {
    const vivas = crias.filter((cria) => cria.estado === "VIVA").length;
    const muertas = crias.filter((cria) => cria.estado === "MUERTA").length;
    setValue("numero_crias_vivas", vivas);
    setValue("numero_crias_muertas", muertas);
  }, [crias, setValue]);

  useEffect(() => {
    if (parto) {
      setValue("hembra_id", parto.hembra?.id || "");
      setValue("servicio_id", parto.servicio_asociado?.id || "");
      setValue("fecha_parto", convertirFechaHora(parto.fecha_parto));
      setValue("numero_parto", parto.numero_parto);
      setValue("tipo_parto", parto.tipo_parto as TipoParto);
      setValue("estado", parto.estado as EstadoParto);
      setValue("numero_crias", parto.numero_crias);
      setValue("numero_crias_vivas", parto.numero_crias_vivas);
      setValue("numero_crias_muertas", parto.numero_crias_muertas);
      setValue("observaciones", parto.observaciones || "");
      setValue("complicaciones", parto.complicaciones || "");
      setValue("atencion_veterinaria", parto.atencion_veterinaria || "");
      setValue("veterinario_responsable", parto.veterinario_responsable || "");

      if (parto.crias && parto.crias.length > 0) {
        const criasConvertidas = parto.crias.map((cria) => ({
          ...cria,
          fecha_nacimiento: convertirFechaHora(cria.fecha_nacimiento),
        }));
        setValue("crias", criasConvertidas);
      }

      setSelectedHembra(parto.hembra?.id || "");
      setSelectedServicio(parto.servicio_asociado?.id || "");
    } else {
      reset();
      setSelectedHembra("");
      setSelectedServicio("");
    }
  }, [parto, setValue, reset]);

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

  const onSubmit = async (data: CrearPartoInterface) => {
    try {
      if (!data.crias || data.crias.length === 0) {
        setIsErrorMessage(t("validation.atLeastOneOffspring"));
        return;
      }

      for (let i = 0; i < data.crias.length; i++) {
        if (!data.crias[i].fecha_nacimiento) {
          setIsErrorMessage(
            t("validation.offspringBirthDateRequired", { number: i + 1 }),
          );
          return;
        }
      }

      const payload = {
        ...data,
        fecha_parto: new Date(data.fecha_parto).toISOString(),
        crias: data.crias.map((cria) => ({
          ...cria,
          fecha_nacimiento: new Date(cria.fecha_nacimiento).toISOString(),
        })),
      };

      if (isEditing && parto) {
        await EditarPartoAnimal(parto.id, payload);
        toast.success(t("messages.updateSuccess"));
      } else {
        await CrearPartoAnimal(payload);
        toast.success(t("messages.createSuccess"));
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["partos-animal"] });
      queryClient.invalidateQueries({ queryKey: ["parto-id"] });
      queryClient.invalidateQueries({
        queryKey: ["servicio-reproductivo-hembra-id"],
      });

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
            : t("errors.registrationFailed");

        setIsErrorMessage(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error(t("errors.unexpected"));
      }
    }
  };

  const agregarCria = () => {
    append({
      sexo: SexoCria.MACHO,
      peso: 0,
      estado: "VIVA",
      observaciones: "",
      identificador: "",
      fecha_nacimiento: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-h-[80vh] overflow-y-auto px-1"
    >
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            {t(isEditing ? "errors.updateTitle" : "errors.createTitle")}
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isEditing ? (
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
                      ? t("placeholders.selectedAnimal", {
                          animal:
                            selectedHembraAnimal.identificador ||
                            selectedHembraAnimal.nombre_animal ||
                            t("fallbacks.animal"),
                        })
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
                  disabled={isSubmitting}
                />

                {selectedHembraAnimal && (
                  <button
                    type="button"
                    onClick={handleClearHembra}
                    aria-label={t("buttons.clearFemale")}
                    title={t("buttons.clearFemale")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {isHembraSearchOpen && searchHembraTerm && (
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
                          alt={`animal-${animal.identificador}`}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                          unoptimized
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {animal.identificador ||
                              animal.nombre_animal ||
                              t("fallbacks.unidentified")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {animal.especie?.nombre ||
                              t("fallbacks.unspecifiedSpecies")}
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

            {selectedHembraAnimal && !searchHembraTerm && (
              <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      selectedHembraAnimal.profileImages.length > 0
                        ? selectedHembraAnimal.profileImages[0].url
                        : "/images/Image-not-found.png"
                    }
                    alt={`animal-${selectedHembraAnimal.identificador}`}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                    unoptimized
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {selectedHembraAnimal.identificador ||
                        selectedHembraAnimal.nombre_animal ||
                        t("fallbacks.animal")}
                    </p>
                    <p className="text-xs text-gray-600">
                      {selectedHembraAnimal.especie?.nombre ||
                        t("fallbacks.unspecifiedSpecies")}
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
        ) : (
          <div className="md:col-span-2">
            <Label>{t("fields.female")}</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              {parto?.hembra?.identificador || t("fallbacks.notSpecified")}
            </div>
          </div>
        )}

        {!isEditing ? (
          <div className="md:col-span-2">
            <Label htmlFor="servicio_id">{t("fields.associatedService")}</Label>
            <Select
              value={selectedServicio}
              onValueChange={(value) => {
                setValue("servicio_id", value);
                setSelectedServicio(value);
              }}
              disabled={isSubmitting || !selectedHembra}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("placeholders.selectService")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("fields.femaleServices")}</SelectLabel>
                  {servicios_hembra && servicios_hembra.length > 0 ? (
                    servicios_hembra.map((servicio) => (
                      <SelectItem key={servicio.id} value={servicio.id}>
                        {`${formatServiceDate(servicio.fecha_servicio)} - ${servicio.tipo_servicio}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-servicios" disabled>
                      {t("messages.noServices")}
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>

            {!selectedHembra && (
              <p className="text-sm text-gray-500 mt-1">
                {t("messages.selectFemaleFirst")}
              </p>
            )}
          </div>
        ) : (
          <div>
            <Label>{t("fields.associatedService")}</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              {parto?.servicio_asociado ? (
                <>
                  <div>
                    {formatServiceDate(parto.servicio_asociado.fecha_servicio)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {parto.servicio_asociado.tipo_servicio}
                  </div>
                </>
              ) : (
                t("fallbacks.notAssociated")
              )}
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="fecha_parto">
            {t("fields.birthDate")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fecha_parto"
            {...register("fecha_parto", {
              required: t("validation.birthDateRequired"),
            })}
            type="datetime-local"
            className={errors.fecha_parto ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.fecha_parto && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fecha_parto.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="numero_parto">
            {t("fields.birthNumber")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="numero_parto"
            {...register("numero_parto", {
              required: t("validation.birthNumberRequired"),
              min: { value: 1, message: t("validation.minimumOne") },
            })}
            type="number"
            min={1}
            className={errors.numero_parto ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.numero_parto && (
            <p className="text-sm text-red-500 mt-1">
              {errors.numero_parto.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="tipo_parto">
            {t("fields.birthType")} <span className="text-red-500">*</span>
          </Label>
          <Select
            value={tipoParto}
            onValueChange={(value) =>
              setValue("tipo_parto", value as TipoParto)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("placeholders.selectType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TipoParto.NORMAL}>
                {t("birthTypes.normal")}
              </SelectItem>
              <SelectItem value={TipoParto.DISTOCICO}>
                {t("birthTypes.dystocic")}
              </SelectItem>
              <SelectItem value={TipoParto.CESAREA}>
                {t("birthTypes.cesarean")}
              </SelectItem>
              <SelectItem value={TipoParto.MUERTE_NATAL}>
                {t("birthTypes.stillbirth")}
              </SelectItem>
              <SelectItem value={TipoParto.ABORTO}>
                {t("birthTypes.abortion")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="estado">
            {t("fields.status")} <span className="text-red-500">*</span>
          </Label>
          <Select
            value={estadoParto}
            onValueChange={(value) => setValue("estado", value as EstadoParto)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("placeholders.selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EstadoParto.PROGRAMADO}>
                {t("statuses.scheduled")}
              </SelectItem>
              <SelectItem value={EstadoParto.EN_PROGRESO}>
                {t("statuses.inProgress")}
              </SelectItem>
              <SelectItem value={EstadoParto.COMPLETADO}>
                {t("statuses.completed")}
              </SelectItem>
              <SelectItem value={EstadoParto.COMPLICADO}>
                {t("statuses.complicated")}
              </SelectItem>
              <SelectItem value={EstadoParto.ABORTADO}>
                {t("statuses.aborted")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-4 mt-2">
        <div className="flex justify-between items-center mb-4">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Baby className="h-5 w-5" />
            {t("offspring.title")}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={agregarCria}
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" />
            {t("buttons.addOffspring")}
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded-lg p-4 space-y-3 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  {t("offspring.itemTitle", { number: index + 1 })}
                </h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                    aria-label={t("buttons.removeOffspring", {
                      number: index + 1,
                    })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>{t("offspring.fields.sex")}</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue(`crias.${index}.sexo`, value as SexoCria)
                    }
                    defaultValue={field.sexo}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("placeholders.selectSex")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SexoCria.MACHO}>
                        {t("sex.male")}
                      </SelectItem>
                      <SelectItem value={SexoCria.HEMBRA}>
                        {t("sex.female")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t("offspring.fields.weight")}</Label>
                  <Input
                    {...register(`crias.${index}.peso`, {
                      required: t("validation.weightRequired"),
                      min: {
                        value: 0.1,
                        message: t("validation.minimumWeight"),
                      },
                      valueAsNumber: true,
                    })}
                    type="number"
                    step="0.1"
                    placeholder={t("placeholders.weightExample")}
                    disabled={isSubmitting}
                    className={
                      errors.crias?.[index]?.peso ? "border-red-500" : ""
                    }
                  />
                  {errors.crias?.[index]?.peso && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.crias[index]?.peso?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>{t("offspring.fields.status")}</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue(`crias.${index}.estado`, value)
                    }
                    defaultValue={field.estado}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("placeholders.selectStatus")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIVA">
                        {t("offspring.statuses.alive")}
                      </SelectItem>
                      <SelectItem value="MUERTA">
                        {t("offspring.statuses.dead")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t("offspring.fields.birthDate")}</Label>
                  <Input
                    {...register(`crias.${index}.fecha_nacimiento`, {
                      required: t("validation.offspringDateRequired"),
                    })}
                    type="datetime-local"
                    disabled={isSubmitting}
                    className={
                      errors.crias?.[index]?.fecha_nacimiento
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.crias?.[index]?.fecha_nacimiento && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.crias[index]?.fecha_nacimiento?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>{t("offspring.fields.identifier")}</Label>
                  <Input
                    {...register(`crias.${index}.identificador`)}
                    placeholder={t("placeholders.identifierExample")}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label>{t("offspring.fields.observations")}</Label>
                  <Input
                    {...register(`crias.${index}.observaciones`)}
                    placeholder={t("placeholders.offspringObservations")}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Baby className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">{t("offspring.empty")}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarCria}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                {t("buttons.addOffspring")}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
        <div>
          <Label htmlFor="veterinario_responsable">
            {t("fields.responsibleVeterinarian")}
          </Label>
          <Input
            id="veterinario_responsable"
            {...register("veterinario_responsable")}
            placeholder={t("placeholders.veterinarianName")}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="complicaciones">{t("fields.complications")}</Label>
          <Input
            id="complicaciones"
            {...register("complicaciones")}
            placeholder={t("placeholders.complications")}
            disabled={isSubmitting}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="atencion_veterinaria">
            {t("fields.veterinaryCare")}
          </Label>
          <Textarea
            id="atencion_veterinaria"
            {...register("atencion_veterinaria")}
            placeholder={t("placeholders.veterinaryCare")}
            rows={2}
            disabled={isSubmitting}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="observaciones">
            {t("fields.generalObservations")}
          </Label>
          <Textarea
            id="observaciones"
            {...register("observaciones")}
            placeholder={t("placeholders.generalObservations")}
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {crias.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-3 text-sm">
          <p className="font-medium text-blue-800">
            {t("offspring.summaryTitle")}
          </p>
          <p className="text-blue-700">
            {t("offspring.summary", {
              total: crias.length,
              alive: crias.filter((c) => c.estado === "VIVA").length,
              dead: crias.filter((c) => c.estado === "MUERTA").length,
            })}
          </p>
        </div>
      )}

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
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              {isEditing ? t("buttons.updating") : t("buttons.saving")}
            </span>
          ) : isEditing ? (
            t("buttons.updateBirth")
          ) : (
            t("buttons.registerBirth")
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormPartoAnimal;
