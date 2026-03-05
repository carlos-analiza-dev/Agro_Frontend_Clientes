import { CrearPesoRazaInterface } from "@/api/peso-promedio-animal/interfaces/crear-peso-raza.interface";
import { ResponsePesoByRaza } from "@/api/peso-promedio-animal/interfaces/obtener-pesos-by-raza.interface";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { CrearPesoByRaza } from "@/api/peso-promedio-animal/accions/crear-peso-prom-by-raza";
import { EditarPesoByRaza } from "@/api/peso-promedio-animal/accions/editar-peso-raza";

interface Props {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  pesoData?: ResponsePesoByRaza | null;
  onSuccess?: () => void;
}

interface FormData extends CrearPesoRazaInterface {
  especieId: string;
}

const FormAddPesoRaza = ({
  openModal,
  setOpenModal,
  pesoData,
  onSuccess,
}: Props) => {
  const [selectedEspecie, setSelectedEspecie] = useState<string>("");
  const isEditing = !!pesoData;

  const { data: especies } = useGetEspecies();
  const { data: razas } = useGetRazasByEspecie(selectedEspecie);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (pesoData && openModal) {
      const especieId = (pesoData.raza as any).especieId || "";
      setSelectedEspecie(especieId);
      setValue("especieId", especieId);
      setValue("razaId", pesoData.raza.id);
      setValue("gananciaMinima", Number(pesoData.gananciaMinima));
      setValue("gananciaMaxima", Number(pesoData.gananciaMaxima));
    }
  }, [pesoData, openModal, setValue]);

  useEffect(() => {
    if (!openModal) {
      reset();
      setSelectedEspecie("");
    }
  }, [openModal, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && pesoData) {
        const payload = {
          gananciaMinima: Number(data.gananciaMinima),
          gananciaMaxima: Number(data.gananciaMaxima),
        };

        await EditarPesoByRaza(pesoData.id, payload);
        toast.success("Rango de peso actualizado correctamente");
      } else {
        const payload: CrearPesoRazaInterface = {
          razaId: data.razaId,
          gananciaMinima: Number(data.gananciaMinima),
          gananciaMaxima: Number(data.gananciaMaxima),
        };

        await CrearPesoByRaza(payload);
        toast.success("Rango de peso registrado correctamente");
      }

      reset();
      setSelectedEspecie("");
      queryClient.invalidateQueries({ queryKey: ["pesos-by-razas"] });
      setOpenModal(false);
      onSuccess?.();
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : `Error al ${isEditing ? "actualizar" : "registrar"} el rango de peso`;

        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!isEditing && (
        <>
          <div className="space-y-2">
            <Label htmlFor="especie">Especie</Label>
            <Select
              onValueChange={(value) => {
                setSelectedEspecie(value);
                setValue("especieId", value);
                setValue("razaId", "");
              }}
              value={selectedEspecie}
              disabled={isEditing}
            >
              <SelectTrigger
                className={errors.especieId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Seleccionar especie" />
              </SelectTrigger>
              <SelectContent>
                {especies?.data?.map((especie) => (
                  <SelectItem key={especie.id} value={especie.id}>
                    {especie.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.especieId && (
              <p className="text-sm text-red-500">{errors.especieId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="raza">Raza del Animal</Label>
            <Select
              onValueChange={(value) => setValue("razaId", value)}
              disabled={!selectedEspecie}
            >
              <SelectTrigger className={errors.razaId ? "border-red-500" : ""}>
                <SelectValue
                  placeholder={
                    !selectedEspecie
                      ? "Primero selecciona una especie"
                      : "Seleccionar raza"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {razas?.data?.map((raza) => (
                  <SelectItem key={raza.id} value={raza.id}>
                    {raza.nombre} {raza.abreviatura && `(${raza.abreviatura})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.razaId && (
              <p className="text-sm text-red-500">{errors.razaId.message}</p>
            )}
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="gananciaMinima">Ganancia Mínima Por Día (Lb)</Label>
        <Input
          {...register("gananciaMinima", {
            required: "La ganancia mínima es requerida",
            min: { value: 0, message: "La ganancia mínima debe ser mayor a 0" },
          })}
          placeholder="Ej: 1.5"
          type="number"
          step="0.01"
          min={0}
          className={errors.gananciaMinima ? "border-red-500" : ""}
        />
        {errors.gananciaMinima && (
          <p className="text-sm text-red-500">
            {errors.gananciaMinima.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gananciaMaxima">Ganancia Máxima Por Día (Lb)</Label>
        <Input
          {...register("gananciaMaxima", {
            required: "La ganancia máxima es requerida",
            min: { value: 0, message: "La ganancia máxima debe ser mayor a 0" },
          })}
          placeholder="Ej: 2.5"
          type="number"
          step="0.01"
          min={0}
          className={errors.gananciaMaxima ? "border-red-500" : ""}
        />
        {errors.gananciaMaxima && (
          <p className="text-sm text-red-500">
            {errors.gananciaMaxima.message}
          </p>
        )}
      </div>

      <div className="pt-4 flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setOpenModal(false)}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditing
              ? "Actualizando..."
              : "Registrando..."
            : isEditing
              ? "Actualizar Rango"
              : "Registrar Rango"}
        </Button>
      </div>
    </form>
  );
};

export default FormAddPesoRaza;
