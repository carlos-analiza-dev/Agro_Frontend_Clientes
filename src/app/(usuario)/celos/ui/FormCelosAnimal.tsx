import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CrearCeloInterface } from "@/api/reproduccion/interfaces/crear-celo.response.interface";
import {
  Celo,
  SignosObservados,
} from "@/api/reproduccion/interfaces/response-celos-animal,interface";
import { CrearCeloAnimal } from "@/api/reproduccion/accions/celos/crear-celo-animal";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Search, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ActualizarCeloAnimal } from "@/api/reproduccion/accions/celos/actualizar-celo";
import {
  DeteccionCelo,
  IntensidadCelosAnimal,
} from "@/interfaces/enums/celos/celos-enums";

interface Props {
  celo?: Celo | null;
  setOpenModal: (open: boolean) => void;
  onSuccess?: () => void;
  hembras: Animal[] | undefined;
}

const FormCelosAnimal = ({ celo, setOpenModal, onSuccess, hembras }: Props) => {
  const [errorMessage, setIsErrorMessage] = useState<string>("");
  const [searchAnimalTerm, setSearchAnimalTerm] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CrearCeloInterface>({
    defaultValues: {
      animalId: "",
      fechaInicio: "",
      fechaFin: "",
      intensidad: IntensidadCelosAnimal.MEDIO,
      metodo_deteccion: DeteccionCelo.VISUAL,
      observaciones: "",
      signos_observados: {
        monta_otros: false,
        acepta_monta: false,
        inquietud: false,
        secreciones: "",
        vulva_inflamada: false,
        otros: [],
      },
    },
  });

  const queryClient = useQueryClient();
  const isEditing = !!celo;

  const signosObservados = watch("signos_observados");
  const selectedAnimalId = watch("animalId");

  const filteredAnimales =
    hembras?.filter((animal) => {
      const searchTerm = searchAnimalTerm.toLowerCase().trim();
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

  const selectedAnimal = hembras?.find(
    (animal) => animal.id === selectedAnimalId,
  );

  useEffect(() => {
    if (celo) {
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
          console.error("Error formateando fecha:", error);
          return "";
        }
      };

      setValue("animalId", celo.animal?.id || "");
      setValue("fechaInicio", formatDateForInput(celo.fechaInicio));
      setValue(
        "fechaFin",
        celo.fechaFin ? formatDateForInput(celo.fechaFin) : "",
      );
      setValue("intensidad", celo.intensidad || IntensidadCelosAnimal.MEDIO);
      setValue(
        "metodo_deteccion",
        celo.metodo_deteccion || DeteccionCelo.VISUAL,
      );
      setValue("observaciones", celo.observaciones || "");

      if (celo.signos_observados) {
        setValue("signos_observados", {
          monta_otros: celo.signos_observados.monta_otros || false,
          acepta_monta: celo.signos_observados.acepta_monta || false,
          inquietud: celo.signos_observados.inquietud || false,
          secreciones: celo.signos_observados.secreciones || "",
          vulva_inflamada: celo.signos_observados.vulva_inflamada || false,
          otros: celo.signos_observados.otros || [],
        });
      }

      if (celo.animal) {
        setSearchAnimalTerm(`${celo.animal.identificador || ""}`);
      }
    } else {
      reset({
        animalId: "",
        fechaInicio: "",
        fechaFin: "",
        intensidad: IntensidadCelosAnimal.MEDIO,
        metodo_deteccion: DeteccionCelo.VISUAL,
        observaciones: "",
        signos_observados: {
          monta_otros: false,
          acepta_monta: false,
          inquietud: false,
          secreciones: "",
          vulva_inflamada: false,
          otros: [],
        },
      });
      setSearchAnimalTerm("");
    }
  }, [celo, setValue, reset]);

  const handleCheckboxChange = (
    field: keyof SignosObservados,
    checked: boolean,
  ) => {
    setValue(`signos_observados.${field}`, checked, { shouldValidate: true });
  };

  const handleOtrosChange = (value: string) => {
    const otrosArray = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setValue("signos_observados.otros", otrosArray, { shouldValidate: true });
  };

  const handleSelectAnimal = (animalId: string) => {
    setValue("animalId", animalId);
    const animal = hembras?.find((a) => a.id === animalId);
    if (animal) {
      setSearchAnimalTerm(
        `${animal.identificador || ""} - ${animal.nombre_animal || "Sin nombre"}`,
      );
    }
    setIsSearchOpen(false);
  };

  const handleClearAnimal = () => {
    if (!isEditing) {
      setValue("animalId", "");
      setSearchAnimalTerm("");
      setIsSearchOpen(false);
    }
  };

  const onSubmit = async (data: CrearCeloInterface) => {
    try {
      const payload = {
        ...data,

        fechaInicio: data.fechaInicio
          ? new Date(data.fechaInicio).toISOString()
          : "",
        fechaFin: data.fechaFin ? new Date(data.fechaFin).toISOString() : "",
      };

      let response;

      if (isEditing && celo) {
        response = await ActualizarCeloAnimal(celo.id, payload);
        toast.success("Celo actualizado correctamente");
      } else {
        response = await CrearCeloAnimal(payload);
        toast.success("Celo registrado correctamente");
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["celos-animal"] });
      queryClient.invalidateQueries({ queryKey: ["celos-activos"] });

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
            : "Hubo un error al crear el celo del animal";
        setIsErrorMessage(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            Error al {isEditing ? "actualizar" : "registrar"} el Celo
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="animalSearch">
            Selecciona el animal en Celo <span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
              <input
                type="text"
                id="animalSearch"
                placeholder={
                  selectedAnimal
                    ? `${selectedAnimal.identificador || selectedAnimal.nombre_animal || "Animal"} seleccionado`
                    : "Buscar animal por identificador, nombre o especie..."
                }
                value={searchAnimalTerm}
                onChange={(e) => {
                  if (!isEditing) {
                    setSearchAnimalTerm(e.target.value);
                    setIsSearchOpen(true);
                  }
                }}
                onFocus={() => {
                  if (!isEditing && searchAnimalTerm) {
                    setIsSearchOpen(true);
                  }
                }}
                className={cn(
                  "w-full pl-9 pr-10 py-3 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  selectedAnimal && "bg-blue-50 border-blue-300",
                  isEditing && "bg-gray-100 cursor-not-allowed",
                )}
                disabled={isSubmitting || isEditing}
              />
              {selectedAnimal && isEditing && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Badge variant="secondary" className="text-xs">
                    Bloqueado
                  </Badge>
                </div>
              )}
              {selectedAnimal && !isEditing && (
                <button
                  type="button"
                  onClick={handleClearAnimal}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {!isEditing && isSearchOpen && searchAnimalTerm && (
              <div className="absolute z-50 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto bg-white">
                {filteredAnimales.length > 0 ? (
                  filteredAnimales.map((animal) => (
                    <div
                      key={animal.id}
                      onClick={() => handleSelectAnimal(animal.id)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50",
                        selectedAnimalId === animal.id && "bg-blue-50",
                      )}
                    >
                      <Image
                        src={
                          animal.profileImages &&
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
                            "Sin identificar"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {animal.especie?.nombre || "Especie no especificada"}
                          {animal.sexo && ` • ${animal.sexo}`}
                        </p>
                      </div>
                      {selectedAnimalId === animal.id && (
                        <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm">
                    <p className="text-gray-500">No se encontraron animales</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Intenta con otro término de búsqueda
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedAnimal && !searchAnimalTerm && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex items-center gap-3">
                <Image
                  src={
                    selectedAnimal.profileImages &&
                    selectedAnimal.profileImages.length > 0
                      ? selectedAnimal.profileImages[0].url
                      : "/images/Image-not-found.png"
                  }
                  alt={`animal-${selectedAnimal.identificador}`}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                  unoptimized
                />
                <div>
                  <p className="text-sm font-medium">
                    {selectedAnimal.identificador ||
                      selectedAnimal.nombre_animal ||
                      "Animal"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {selectedAnimal.especie?.nombre ||
                      "Especie no especificada"}
                    {selectedAnimal.sexo && ` • ${selectedAnimal.sexo}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {errors.animalId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.animalId.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="fechaInicio">
            Fecha de Inicio de celo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fechaInicio"
            {...register("fechaInicio", {
              required: "La fecha de inicio es requerida",
            })}
            type="datetime-local"
            className={errors.fechaInicio ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.fechaInicio && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fechaInicio.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="fechaFin">Fecha de Fin de celo</Label>
          <Input
            id="fechaFin"
            {...register("fechaFin")}
            type="datetime-local"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="intensidad">
            Intensidad <span className="text-red-500">*</span>
          </Label>
          <Select
            defaultValue={celo?.intensidad || IntensidadCelosAnimal.MEDIO}
            onValueChange={(value) => {
              setValue("intensidad", value as IntensidadCelosAnimal);
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar intensidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BAJO">Bajo</SelectItem>
              <SelectItem value="MEDIO">Medio</SelectItem>
              <SelectItem value="ALTO">Alto</SelectItem>
              <SelectItem value="MUY_ALTO">Muy Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="metodo_deteccion">
            Método de Detección <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(value) =>
              setValue("metodo_deteccion", value as DeteccionCelo)
            }
            value={watch("metodo_deteccion") || DeteccionCelo.VISUAL}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VISUAL">Visual</SelectItem>
              <SelectItem value="PARCHE">Parche</SelectItem>
              <SelectItem value="PODOMETRO">Podómetro</SelectItem>
              <SelectItem value="COLLAR_ACTIVIDAD">
                Collar de Actividad
              </SelectItem>
              <SelectItem value="ULTRASONIDO">Ultrasonido</SelectItem>
              <SelectItem value="MONTA_NATURAL">Monta Natural</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Signos Observados</Label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="monta_otros"
              checked={signosObservados?.monta_otros || false}
              onCheckedChange={(checked) =>
                handleCheckboxChange("monta_otros", checked as boolean)
              }
              disabled={isSubmitting}
            />
            <Label htmlFor="monta_otros" className="text-sm font-normal">
              Monta a otros
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="acepta_monta"
              checked={signosObservados?.acepta_monta || false}
              onCheckedChange={(checked) =>
                handleCheckboxChange("acepta_monta", checked as boolean)
              }
              disabled={isSubmitting}
            />
            <Label htmlFor="acepta_monta" className="text-sm font-normal">
              Acepta la monta
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="inquietud"
              checked={signosObservados?.inquietud || false}
              onCheckedChange={(checked) =>
                handleCheckboxChange("inquietud", checked as boolean)
              }
              disabled={isSubmitting}
            />
            <Label htmlFor="inquietud" className="text-sm font-normal">
              Inquietud/Nerviosismo
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="vulva_inflamada"
              checked={signosObservados?.vulva_inflamada || false}
              onCheckedChange={(checked) =>
                handleCheckboxChange("vulva_inflamada", checked as boolean)
              }
              disabled={isSubmitting}
            />
            <Label htmlFor="vulva_inflamada" className="text-sm font-normal">
              Vulva inflamada
            </Label>
          </div>
        </div>

        <div>
          <Label htmlFor="secreciones">Secreciones</Label>
          <Select
            onValueChange={(value) =>
              setValue("signos_observados.secreciones", value)
            }
            value={watch("signos_observados.secreciones") || ""}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de secreción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ninguna">Ninguna</SelectItem>
              <SelectItem value="clara">Clara</SelectItem>
              <SelectItem value="turbia">Turbia</SelectItem>
              <SelectItem value="sanguinolenta">Sanguinolenta</SelectItem>
              <SelectItem value="viscosa">Viscosa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="otros">Otros signos (separados por coma)</Label>
          <Input
            id="otros"
            type="text"
            placeholder="Ej: brama, inquietud, etc."
            value={signosObservados?.otros?.join(", ") || ""}
            onChange={(e) => handleOtrosChange(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="observaciones">Observaciones Generales</Label>
        <Textarea
          id="observaciones"
          {...register("observaciones")}
          placeholder="Observaciones adicionales sobre el celo..."
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
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              {isEditing ? "Actualizando..." : "Guardando..."}
            </span>
          ) : isEditing ? (
            "Actualizar Celo"
          ) : (
            "Registrar Celo"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormCelosAnimal;
