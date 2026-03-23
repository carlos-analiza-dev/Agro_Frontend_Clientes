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
import { AlertCircleIcon } from "lucide-react";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { CreateServiciosReproductivo } from "@/api/reproduccion/interfaces/crear-servicio-reproductivo.interface";
import { Celo } from "@/api/reproduccion/interfaces/response-celos-animal,interface";
import { CrearServicioReproductivo } from "@/api/reproduccion/accions/servicios/crear-servicio-reproductivo";
import { EditarServicioReproductivo } from "@/api/reproduccion/accions/servicios/editar-servicio-reproductivo";
import useGetCelosActivosByAnimal from "@/hooks/reproduccion/useGetCelosActivosByAnimal";
import { TipoServicio } from "@/interfaces/enums/servicios-reproductivos.enum";
import { Servicio } from "@/api/reproduccion/interfaces/response-servicio-repoductivo.interface";
import { convertirFechaHora } from "@/helpers/funciones/convertirFechaHoras";

interface Props {
  servicio?: Servicio | null;
  setOpenModal: (open: boolean) => void;
  onSuccess?: () => void;
  hembras: Animal[];
  machos: Animal[];
}

const FormServicioReproductivo = ({
  servicio,
  setOpenModal,
  onSuccess,
  hembras,
  machos,
}: Props) => {
  const [errorMessage, setIsErrorMessage] = useState<string>("");
  const [selectedHembra, setSelectedHembra] = useState<string>("");
  const [machoPerteneceFinca, setMachoPerteneceFinca] = useState<boolean>(true);
  const [mostrarSeccionMacho, setMostrarSeccionMacho] = useState<boolean>(true);

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
      setSelectedHembra(servicio.hembra?.id || "");
    } else {
      reset();
      setMachoPerteneceFinca(true);
    }
  }, [servicio, setValue, reset]);

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

        <div>
          <Label htmlFor="hembra_id">
            Hembra <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(value) => {
              setValue("hembra_id", value);
              setSelectedHembra(value);
            }}
            defaultValue={servicio?.hembra?.id}
            disabled={isSubmitting || isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar hembra" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Hembras</SelectLabel>
                {hembras && hembras.length > 0 ? (
                  hembras.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.identificador}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-hembras" disabled>
                    No hay hembras disponibles
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
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
              <Label htmlFor="macho_id">
                Macho de la Finca <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("macho_id", value)}
                defaultValue={servicio?.macho?.id}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar macho de la finca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Machos de la Finca</SelectLabel>
                    {machos && machos.length > 0 ? (
                      machos.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id}>
                          {animal.identificador}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-machos" disabled>
                        No hay machos disponibles en la finca
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
          <Label htmlFor="costo">Costo (Lps)</Label>
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
