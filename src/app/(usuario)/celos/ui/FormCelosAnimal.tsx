// FormCelosAnimal.tsx
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CrearCeloInterface } from "@/api/reproduccion/interfaces/crear-celo.response.interface";
import {
  Celo,
  SignosObservados,
} from "@/api/reproduccion/interfaces/response-celos-animal,interface";
import { CrearCeloAnimal } from "@/api/reproduccion/accions/celos/crear-celo-animal";
import { EditarCeloAnimal } from "@/api/reproduccion/accions/celos/editar-celo-animal";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface Props {
  celo?: Celo | null;
  setOpenModal: (open: boolean) => void;
  onSuccess?: () => void;
  hembras: Animal[] | undefined;
}

const FormCelosAnimal = ({ celo, setOpenModal, onSuccess, hembras }: Props) => {
  const [errorMessage, setIsErrorMessage] = useState<string>("");
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
      intensidad: "MEDIO",
      metodo_deteccion: "VISUAL",
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

  useEffect(() => {
    if (celo) {
      setValue("animalId", celo.animal?.id || "");
      setValue("fechaInicio", celo.fechaInicio.split("T")[0]);
      setValue("fechaFin", celo.fechaFin?.split("T")[0] || "");
      setValue("intensidad", celo.intensidad || "MEDIO");
      setValue("metodo_deteccion", celo.metodo_deteccion || "VISUAL");
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
    } else {
      reset({
        animalId: "",
        fechaInicio: "",
        fechaFin: "",

        intensidad: "MEDIO",
        metodo_deteccion: "VISUAL",
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

  const onSubmit = async (data: CrearCeloInterface) => {
    try {
      const payload = {
        ...data,
      };

      let response;

      if (isEditing && celo) {
        response = await EditarCeloAnimal(celo.id, payload);
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
          <Label htmlFor="fechaInicio">
            Selecciona el animal en Celo <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(value) => setValue("animalId", value)}
            defaultValue={celo?.animal.id}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar vaca en celo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Animales</SelectLabel>
                {hembras && hembras.length > 0 ? (
                  hembras.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.identificador}
                    </SelectItem>
                  ))
                ) : (
                  <p>No se encontraron animales</p>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.fechaInicio && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fechaInicio.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="fechaInicio">
            Fecha de Inicio <span className="text-red-500">*</span>
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
          <Label htmlFor="fechaFin">Fecha de Fin</Label>
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
            onValueChange={(value) => setValue("intensidad", value)}
            defaultValue={celo?.intensidad || "MEDIO"}
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
            onValueChange={(value) => setValue("metodo_deteccion", value)}
            defaultValue={celo?.metodo_deteccion || "VISUAL"}
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
            defaultValue={celo?.signos_observados?.secreciones || ""}
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
            defaultValue={celo?.signos_observados?.otros?.join(", ") || ""}
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
