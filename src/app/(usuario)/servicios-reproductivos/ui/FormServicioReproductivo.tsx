import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (isMontaNatural) {
      setMostrarSeccionMacho(true);
    } else if (isIATF || isTransferencia || isFIV) {
      setMostrarSeccionMacho(true);
    } else {
      setMostrarSeccionMacho(false);
    }
  }, [tipoServicio]);

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
          setIsErrorMessage(
            "Si seleccionaste que el macho pertenece a tu finca, es obligatorio que selecciones el macho",
          );
          return;
        }

        if (
          payload.macho_pertenece_finca === false &&
          payload.macho_externo_nombre === ""
        ) {
          setIsErrorMessage(
            "Si seleccionaste que el macho no pertenece a tu finca, es obligatorio que selecciones el nombre del macho",
          );
          return;
        }

        response = await EditarServicioReproductivo(servicio.id, payload);
        toast.success("Servicio actualizado correctamente");
      } else {
        response = await CrearServicioReproductivo(payload);
        toast.success("Servicio registrado correctamente");
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
            : "Hubo un error al registrar el servicio";
        setIsErrorMessage(errorMessage);
        toast.error(errorMessage);
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
            Error al {isEditing ? "actualizar" : "registrar"} el Servicio
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tipo_servicio">
            Tipo de Servicio <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(value) =>
              setValue("tipo_servicio", value as TipoServicio)
            }
            defaultValue={servicio?.tipo_servicio}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TipoServicio.MONTA_NATURAL}>
                Monta Natural
              </SelectItem>
              <SelectItem value={TipoServicio.INSEMINACION_ARTIFICIAL}>
                Inseminación Artificial (IATF)
              </SelectItem>
              <SelectItem value={TipoServicio.TRANSFERENCIA_EMBRIONES}>
                Transferencia de Embriones
              </SelectItem>
              <SelectItem value={TipoServicio.FERTILIZACION_INVITRO}>
                Fecundación in vitro (FIV)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fecha_servicio">
            Fecha del Servicio <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fecha_servicio"
            {...register("fecha_servicio", {
              required: "La fecha del servicio es requerida",
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
            Hembra <span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
              <input
                type="text"
                id="hembraSearch"
                placeholder={
                  selectedHembraAnimal
                    ? `${selectedHembraAnimal.identificador || selectedHembraAnimal.nombre_animal || "Animal"} seleccionado`
                    : "Buscar hembra por identificador, nombre o especie..."
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
                      {hembraId === animal.id && (
                        <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm">
                    <p className="text-gray-500">No se encontraron hembras</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Intenta con otro término de búsqueda
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
                      "Animal"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {selectedHembraAnimal.especie?.nombre ||
                      "Especie no especificada"}
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
                      "Animal"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {selectedHembraAnimal.especie?.nombre ||
                      "Especie no especificada"}
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
              El macho pertenece a mi finca
            </Label>
          </div>

          {machoPerteneceFincaValue ? (
            <div>
              <Label htmlFor="machoSearch">
                Macho de la Finca <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                  <input
                    type="text"
                    id="machoSearch"
                    placeholder={
                      selectedMachoAnimal
                        ? `${selectedMachoAnimal.identificador || selectedMachoAnimal.nombre_animal || "Animal"} seleccionado`
                        : "Buscar macho por identificador, nombre o especie..."
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
                              {animal.especie?.nombre ||
                                "Especie no especificada"}
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
                        <p className="text-gray-500">
                          No se encontraron machos
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Intenta con otro término de búsqueda
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
                      alt={`animal-${selectedMachoAnimal.identificador}`}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                      unoptimized
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {selectedMachoAnimal.identificador ||
                          selectedMachoAnimal.nombre_animal ||
                          "Animal"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedMachoAnimal.especie?.nombre ||
                          "Especie no especificada"}
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
                  * El macho seleccionado será utilizado como donante de
                  semen/embriones
                </p>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="macho_externo_nombre">
                Nombre del Macho Externo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="macho_externo_nombre"
                {...register("macho_externo_nombre", {
                  required: "Debe ingresar el nombre del macho externo",
                })}
                placeholder={
                  isMontaNatural
                    ? "Ej: Toro de Don José - Raza Brahman"
                    : "Ej: Toro Don José (Raza Brahman) - Finca El Rosario"
                }
                disabled={isSubmitting}
                className={errors.macho_externo_nombre ? "border-red-500" : ""}
              />
              <p className="text-sm text-gray-500 mt-1">
                * Ingrese el nombre completo del macho y su procedencia
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
          <Label htmlFor="celo_id">Celo Asociado</Label>
          <Select
            onValueChange={(value) => setValue("celo_id", value)}
            disabled={isSubmitting || !selectedHembra || isLoadingCelos}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isLoadingCelos
                    ? "Cargando celos..."
                    : !selectedHembra
                      ? "Seleccione una hembra primero"
                      : "Seleccionar celo"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Celos Activos</SelectLabel>
                {celosActivos && celosActivos.length > 0 ? (
                  celosActivos.map((celo: Celo) => (
                    <SelectItem key={celo.id} value={celo.id}>
                      {`Celo #${celo.numeroCelo} - Inicio: ${new Date(celo.fechaInicio).toLocaleDateString()}`}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-celos" disabled>
                    No hay celos activos para esta hembra
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            * Seleccione el celo al que pertenece este servicio
          </p>
        </div>
      )}

      {(isIATF || isTransferencia || isFIV) && (
        <>
          <div>
            <Label htmlFor="proveedor_semen">
              Proveedor de Semen/Embriones
            </Label>
            <Input
              id="proveedor_semen"
              {...register("proveedor_semen")}
              placeholder="Nombre del proveedor"
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500 mt-1">
              * Ingrese el nombre del proveedor si el semen/embriones son
              externos
            </p>
          </div>

          <div>
            <Label htmlFor="tecnico_responsable">Técnico Responsable</Label>
            <Input
              id="tecnico_responsable"
              {...register("tecnico_responsable")}
              placeholder="Nombre del técnico"
              disabled={isSubmitting}
            />
          </div>
        </>
      )}

      {isIATF && (
        <div>
          <Label htmlFor="dosis_semen">Dosis de Semen</Label>
          <Input
            id="dosis_semen"
            {...register("dosis_semen")}
            placeholder="Ej: 0.5 ml"
            disabled={isSubmitting}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="costo">Costo ({moneda})</Label>
          <Input
            id="costo"
            {...register("metadata.costo", { valueAsNumber: true })}
            type="number"
            placeholder="0.00"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="duracion_minutos">Duración (minutos)</Label>
          <Input
            id="duracion_minutos"
            {...register("metadata.duracion_minutos", { valueAsNumber: true })}
            type="number"
            placeholder="Ej: 30"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="condiciones_climaticas">Condiciones Climáticas</Label>
          <Select
            onValueChange={(value) =>
              setValue("metadata.condiciones_climaticas", value)
            }
            defaultValue={servicio?.metadata?.condiciones_climaticas}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar condición" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soleado">Soleado</SelectItem>
              <SelectItem value="nublado">Nublado</SelectItem>
              <SelectItem value="lluvioso">Lluvioso</SelectItem>
              <SelectItem value="ventoso">Ventoso</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="evaluacion_macho">Evaluación del Macho</Label>
          <Select
            onValueChange={(value) =>
              setValue("metadata.evaluacion_macho", value)
            }
            defaultValue={servicio?.metadata?.evaluacion_macho}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar evaluación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excelente">Excelente</SelectItem>
              <SelectItem value="bueno">Bueno</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="malo">Malo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          {...register("observaciones")}
          placeholder="Observaciones adicionales sobre el servicio..."
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
            "Actualizar Servicio"
          ) : (
            "Registrar Servicio"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormServicioReproductivo;
