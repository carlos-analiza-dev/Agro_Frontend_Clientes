import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
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
import { AlertCircleIcon, Plus, Trash2, Baby } from "lucide-react";
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
  const [errorMessage, setIsErrorMessage] = useState<string>("");
  const [selectedHembra, setSelectedHembra] = useState<string>("");
  const [selectedServicio, setSelectedServicio] = useState<string>("");

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

  const onSubmit = async (data: CrearPartoInterface) => {
    try {
      if (!data.crias || data.crias.length === 0) {
        setIsErrorMessage("Debe registrar al menos una cría");
        return;
      }

      for (let i = 0; i < data.crias.length; i++) {
        if (!data.crias[i].fecha_nacimiento) {
          setIsErrorMessage(`La cría ${i + 1} debe tener fecha de nacimiento`);
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
        toast.success("Parto actualizado correctamente");
      } else {
        await CrearPartoAnimal(payload);
        toast.success("Parto registrado correctamente");
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
            : "Hubo un error al registrar el parto";
        setIsErrorMessage(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
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
            Error al {isEditing ? "actualizar" : "registrar"} el Parto
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isEditing ? (
          <div>
            <Label htmlFor="hembra_id">
              Hembra <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) => {
                setValue("hembra_id", value);
                setSelectedHembra(value);
              }}
              disabled={isSubmitting}
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
        ) : (
          <div>
            <Label>Hembra</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              {parto?.hembra?.identificador || "No especificada"}
            </div>
          </div>
        )}

        {!isEditing ? (
          <div>
            <Label htmlFor="servicio_id">Servicio Asociado</Label>
            <Select
              value={selectedServicio}
              onValueChange={(value) => {
                setValue("servicio_id", value);
                setSelectedServicio(value);
              }}
              disabled={isSubmitting || !selectedHembra}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Servicios de la hembra</SelectLabel>
                  {servicios_hembra && servicios_hembra.length > 0 ? (
                    servicios_hembra.map((servicio) => (
                      <SelectItem key={servicio.id} value={servicio.id}>
                        {`${new Date(servicio.fecha_servicio).toLocaleDateString()} - ${servicio.tipo_servicio}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-servicios" disabled>
                      No hay servicios registrados para esta hembra
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div>
            <Label>Servicio Asociado</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              {parto?.servicio_asociado ? (
                <>
                  <div>
                    {new Date(
                      parto.servicio_asociado.fecha_servicio,
                    ).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {parto.servicio_asociado.tipo_servicio}
                  </div>
                </>
              ) : (
                "No asociado"
              )}
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="fecha_parto">
            Fecha del Parto <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fecha_parto"
            {...register("fecha_parto", {
              required: "La fecha del parto es requerida",
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
            Número de Parto <span className="text-red-500">*</span>
          </Label>
          <Input
            id="numero_parto"
            {...register("numero_parto", {
              required: "El número de parto es requerido",
              min: { value: 1, message: "Mínimo 1" },
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
            Tipo de Parto <span className="text-red-500">*</span>
          </Label>
          <Select
            value={tipoParto}
            onValueChange={(value) =>
              setValue("tipo_parto", value as TipoParto)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TipoParto.NORMAL}>Normal</SelectItem>
              <SelectItem value={TipoParto.DISTOCICO}>Distócico</SelectItem>
              <SelectItem value={TipoParto.CESAREA}>Cesárea</SelectItem>
              <SelectItem value={TipoParto.MUERTE_NATAL}>
                Muerte Natal
              </SelectItem>
              <SelectItem value={TipoParto.ABORTO}>Aborto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="estado">
            Estado <span className="text-red-500">*</span>
          </Label>
          <Select
            value={estadoParto}
            onValueChange={(value) => setValue("estado", value as EstadoParto)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EstadoParto.PROGRAMADO}>Programado</SelectItem>
              <SelectItem value={EstadoParto.EN_PROGRESO}>
                En progreso
              </SelectItem>
              <SelectItem value={EstadoParto.COMPLETADO}>Completado</SelectItem>
              <SelectItem value={EstadoParto.COMPLICADO}>Complicado</SelectItem>
              <SelectItem value={EstadoParto.ABORTADO}>Abortado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-4 mt-2">
        <div className="flex justify-between items-center mb-4">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Baby className="h-5 w-5" />
            Registro de Crías
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={agregarCria}
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar Cría
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded-lg p-4 space-y-3 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Cría #{index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Sexo</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue(`crias.${index}.sexo`, value as SexoCria)
                    }
                    defaultValue={field.sexo}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SexoCria.MACHO}>Macho</SelectItem>
                      <SelectItem value={SexoCria.HEMBRA}>Hembra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Peso (kg)</Label>
                  <Input
                    {...register(`crias.${index}.peso`, {
                      required: "El peso es requerido",
                      min: { value: 0.1, message: "Mínimo 0.1 kg" },
                      valueAsNumber: true,
                    })}
                    type="number"
                    step="0.1"
                    placeholder="Ej: 35.5"
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
                  <Label>Estado</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue(`crias.${index}.estado`, value)
                    }
                    defaultValue={field.estado}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIVA">Viva</SelectItem>
                      <SelectItem value="MUERTA">Muerta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Fecha de Nacimiento</Label>
                  <Input
                    {...register(`crias.${index}.fecha_nacimiento`, {
                      required: "La fecha de nacimiento es requerida",
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
                  <Label>Identificador (Opcional)</Label>
                  <Input
                    {...register(`crias.${index}.identificador`)}
                    placeholder="Ej: CRIA-001"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label>Observaciones (Opcional)</Label>
                  <Input
                    {...register(`crias.${index}.observaciones`)}
                    placeholder="Observaciones sobre la cría..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Baby className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No hay crías registradas</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarCria}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar cría
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
        <div>
          <Label htmlFor="veterinario_responsable">
            Veterinario Responsable
          </Label>
          <Input
            id="veterinario_responsable"
            {...register("veterinario_responsable")}
            placeholder="Nombre del veterinario"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="complicaciones">Complicaciones</Label>
          <Input
            id="complicaciones"
            {...register("complicaciones")}
            placeholder="Describir complicaciones si las hubo"
            disabled={isSubmitting}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="atencion_veterinaria">Atención Veterinaria</Label>
          <Textarea
            id="atencion_veterinaria"
            {...register("atencion_veterinaria")}
            placeholder="Describir la atención veterinaria brindada..."
            rows={2}
            disabled={isSubmitting}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="observaciones">Observaciones Generales</Label>
          <Textarea
            id="observaciones"
            {...register("observaciones")}
            placeholder="Observaciones adicionales sobre el parto..."
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {crias.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-3 text-sm">
          <p className="font-medium text-blue-800">Resumen de crías:</p>
          <p className="text-blue-700">
            Total: {crias.length} | Vivas:{" "}
            {crias.filter((c) => c.estado === "VIVA").length} | Muertas:{" "}
            {crias.filter((c) => c.estado === "MUERTA").length}
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
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              {isEditing ? "Actualizando..." : "Guardando..."}
            </span>
          ) : isEditing ? (
            "Actualizar Parto"
          ) : (
            "Registrar Parto"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormPartoAnimal;
