import { CrearPesoAnimal } from "@/api/peso-promedio-animal/accions/crear-peso-animal";
import { CrearPesoAnimalInterface } from "@/api/peso-promedio-animal/interfaces/crear-peso-animal.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  animalId: string;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

const FormAddPeso = ({ animalId, openModal, setOpenModal }: Props) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CrearPesoAnimalInterface>();
  const queryClient = useQueryClient();

  const onSubmit = async (data: CrearPesoAnimalInterface) => {
    try {
      data.animalId = animalId;
      data.peso = Number(data.peso);

      await CrearPesoAnimal(data);
      reset();
      queryClient.invalidateQueries({ queryKey: ["historial-peso", animalId] });
      setOpenModal(!openModal);
      toast.success("Peso Agregado Correctamente");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Error al agregar el peso del animal",
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      <div className="mt-3">
        <Label>Peso del Animal (Kg)</Label>
        <Input
          {...register("peso", { required: true })}
          placeholder="Peso del Animal"
          type="number"
          min={1}
        />
      </div>
      <div className="mt-3">
        <Label>Fecha de Ingreso</Label>
        <Input
          {...register("fecha", { required: true })}
          placeholder="Fecha de Ingreso"
          type="date"
        />
      </div>
      <div className="mt-3">
        <Label>Observaciones</Label>
        <Textarea
          {...register("observaciones")}
          placeholder="Observaciones del peso"
        />
      </div>
      <div className="mt-3 flex justify-center ">
        <Button className="w-full">Ingresar Peso</Button>
      </div>
    </form>
  );
};

export default FormAddPeso;
