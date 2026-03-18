import { CrearPesoAnimal } from "@/api/peso-promedio-animal/accions/crear-peso-animal";
import { EditarPesoAnimal } from "@/api/peso-promedio-animal/accions/editar-peso-animal";
import { CrearPesoAnimalInterface } from "@/api/peso-promedio-animal/interfaces/crear-peso-animal.interface";
import { ResponseHistorialAnimal } from "@/api/peso-promedio-animal/interfaces/obtener-historial-pesos-animal.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  animalId: string;
  registro?: ResponseHistorialAnimal | null;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  onSuccess?: () => void;
}

const FormAddPeso = ({
  animalId,
  openModal,
  setOpenModal,
  registro,
  onSuccess,
}: Props) => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CrearPesoAnimalInterface>({
    defaultValues: {
      peso: undefined,
      fecha: "",
      observaciones: "",
    },
  });
  const queryClient = useQueryClient();
  const isEditing = !!registro;

  useEffect(() => {
    if (registro) {
      setValue("peso", Number(registro.peso));

      const fecha = registro.fecha;

      setValue("fecha", fecha);
      setValue("observaciones", registro.observaciones || "");
    } else {
      reset({
        peso: undefined,
        fecha: "",
        observaciones: "",
      });
    }
  }, [registro, setValue, reset]);

  const onSubmit = async (data: CrearPesoAnimalInterface) => {
    try {
      const payload = {
        ...data,
        animalId,
        peso: Number(data.peso),
      };

      let response;

      if (isEditing && registro) {
        response = await EditarPesoAnimal(registro.id, payload);
        toast.success("Peso actualizado correctamente");
      } else {
        response = await CrearPesoAnimal(payload);
        toast.success("Peso agregado correctamente");
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["historial-peso", animalId] });

      if (onSuccess) {
        onSuccess();
      }

      setOpenModal(false);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          (isEditing ? "Error al actualizar" : "Error al agregar");
        toast.error(errorMessage);
      } else {
        toast.error(
          isEditing
            ? "Error al actualizar el peso"
            : "Error al agregar el peso",
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="peso">
          Peso del Animal (Kg) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="peso"
          {...register("peso", {
            required: "El peso es requerido",
            min: { value: 0.1, message: "El peso debe ser mayor a 0" },
            max: {
              value: 2000,
              message: "El peso no puede ser mayor a 2000 kg",
            },
          })}
          placeholder="Ej: 450.5"
          type="number"
          step="0.1"
          min={0.1}
          max={2000}
          className={errors.peso ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.peso && (
          <p className="text-sm text-red-500 mt-1">{errors.peso.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="fecha">
          Fecha de Registro <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fecha"
          {...register("fecha", {
            required: "La fecha es requerida",
            validate: (value) => {
              const fecha = new Date(value);
              const hoy = new Date();
              if (fecha > hoy) {
                return "La fecha no puede ser futura";
              }
              return true;
            },
          })}
          type="date"
          max={new Date().toISOString().split("T")[0]}
          className={errors.fecha ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.fecha && (
          <p className="text-sm text-red-500 mt-1">{errors.fecha.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          {...register("observaciones")}
          placeholder="Observaciones adicionales (opcional)"
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
            "Actualizar Peso"
          ) : (
            "Guardar Peso"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormAddPeso;
