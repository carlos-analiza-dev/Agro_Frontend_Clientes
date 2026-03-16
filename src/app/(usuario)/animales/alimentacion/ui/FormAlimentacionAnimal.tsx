import { CrearAlimetacionAnimal } from "@/api/alimentacion_animal/accions/crear-alimentacion";
import { AgregarAlimentacionAnimalInterface } from "@/api/alimentacion_animal/interface/crear-alimentacion-animal.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { alimentosOptions, origenAlimentos } from "@/helpers/data/alimentos";
import { unidades_productos } from "@/helpers/data/medida-productos-ganadero";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { Cliente } from "@/interfaces/auth/cliente";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { Alimento } from "@/api/alimentacion_animal/interface/response-alimentacion.interface";
import { EditarAlimetacionAnimal } from "@/api/alimentacion_animal/accions/editar-alimentacion";

interface Props {
  moneda: string | undefined;
  cliente: Cliente | undefined;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  editAlimentacion?: Alimento | null;
  isEdit?: boolean;
}

const FormAlimentacionAnimal = ({
  moneda,
  cliente,
  openModal,
  setOpenModal,
  editAlimentacion,
  isEdit = false,
}: Props) => {
  const clienteId = cliente?.id ?? "";
  const { data: animales, isLoading: isLoadingAnimales } =
    useGetAnimalesPropietario(clienteId);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AgregarAlimentacionAnimalInterface>({
    defaultValues: {
      tipoAlimento: "",
      origen: "",
      cantidad: 0,
      unidad: "",
      costo_diario: 0,
      fecha: new Date().toISOString().split("T")[0],
      animalId: "",
    },
  });

  useEffect(() => {
    if (!openModal) {
      reset();
    }
  }, [openModal, reset]);

  useEffect(() => {
    if (editAlimentacion && isEdit) {
      reset({
        tipoAlimento: editAlimentacion.tipoAlimento,
        origen: editAlimentacion.origen,
        cantidad: Number(editAlimentacion.cantidad),
        unidad: editAlimentacion.unidad,
        costo_diario: Number(editAlimentacion.costo_diario),
        fecha: editAlimentacion.fecha,
      });
    }
  }, [editAlimentacion, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: AgregarAlimentacionAnimalInterface) =>
      isEdit
        ? EditarAlimetacionAnimal(editAlimentacion?.id ?? "", data)
        : CrearAlimetacionAnimal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alimentacion-animales"] });
      toast.success(
        isEdit
          ? "Alimentación actualizada con éxito"
          : "Alimentación agregada con éxito",
      );
      reset();
      setOpenModal(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al procesar el alimento";

        toast.error(errorMessage);
      } else {
        toast.error("Contacte al administrador");
      }
    },
  });

  const onSubmit = (data: AgregarAlimentacionAnimalInterface) => {
    const formattedData = {
      ...data,
      cantidad: Number(data.cantidad),
      costo_diario: Number(data.costo_diario),
    };

    mutation.mutate(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">Tipo de Alimentación*</Label>
        <Select
          onValueChange={(value) => setValue("tipoAlimento", value)}
          defaultValue={editAlimentacion?.tipoAlimento}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo de alimento" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Alimento</SelectLabel>
              {alimentosOptions.map((alimento) => (
                <SelectItem key={alimento.value} value={alimento.value}>
                  {alimento.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.tipoAlimento && (
          <p className="text-sm font-medium text-red-500">
            {errors.tipoAlimento.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Origen de Alimentación*</Label>
        <Select
          onValueChange={(value) => setValue("origen", value)}
          defaultValue={editAlimentacion?.origen}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el origen del alimento" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Origen</SelectLabel>
              {origenAlimentos.map((alimento) => (
                <SelectItem key={alimento.id} value={alimento.value}>
                  {alimento.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.origen && (
          <p className="text-sm font-medium text-red-500">
            {errors.origen.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Cantidad Diaria Consumida*</Label>
        <Input
          type="number"
          step="0.01"
          min={0.1}
          placeholder="Ejem: 20.5, 15, 10"
          {...register("cantidad", {
            required: "La cantidad es requerida",
            min: { value: 0.1, message: "La cantidad debe ser mayor a 0" },
          })}
        />
        {errors.cantidad && (
          <p className="text-sm font-medium text-red-500">
            {errors.cantidad.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Unidad de Medida*</Label>
        <Select
          onValueChange={(value) => setValue("unidad", value)}
          defaultValue={editAlimentacion?.unidad}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona la unidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Unidad</SelectLabel>
              {unidades_productos.map((unidad) => (
                <SelectItem key={unidad.value} value={unidad.value}>
                  {unidad.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.unidad && (
          <p className="text-sm font-medium text-red-500">
            {errors.unidad.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Costo Diario ({moneda})*</Label>
        <Input
          type="number"
          step="0.01"
          min={0.01}
          placeholder={`Cantidad Diaria Invertida (${moneda})`}
          {...register("costo_diario", {
            required: "El costo diario es requerido",
            min: { value: 0.01, message: "El costo debe ser mayor a 0" },
          })}
        />
        {errors.costo_diario && (
          <p className="text-sm font-medium text-red-500">
            {errors.costo_diario.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Fecha de Ingreso*</Label>
        <Input
          type="date"
          {...register("fecha", { required: "La fecha es requerida" })}
        />
        {errors.fecha && (
          <p className="text-sm font-medium text-red-500">
            {errors.fecha.message as string}
          </p>
        )}
      </div>

      {!isEdit && (
        <div className="space-y-1">
          <Label className="font-bold">Animal*</Label>
          <Select
            onValueChange={(value) => setValue("animalId", value)}
            disabled={isLoadingAnimales}
          >
            <SelectTrigger className="py-6">
              <SelectValue
                placeholder={
                  isLoadingAnimales
                    ? "Cargando animales..."
                    : "Selecciona el Animal"
                }
              />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectGroup>
                <SelectLabel>Animales Disponibles</SelectLabel>
                {animales && animales?.data.length > 0 ? (
                  animales?.data.map((animal) => (
                    <SelectItem
                      key={animal.id}
                      value={animal.id}
                      className="py-2"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              animal.profileImages &&
                              animal.profileImages.length > 0
                                ? animal.profileImages[0].url
                                : "/images/Image-not-found.png"
                            }
                            alt={animal.identificador}
                          />
                          <AvatarFallback className="text-xs">
                            {animal.identificador?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{animal.identificador}</p>
                          <p className="text-xs text-muted-foreground">
                            {animal.razas?.[0]?.nombre || "Sin raza"} •{" "}
                            {animal.sexo}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No se encontraron animales
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.animalId && (
            <p className="text-sm font-medium text-red-500">
              {errors.animalId.message as string}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Actualizando..." : "Agregando..."}
            </>
          ) : isEdit ? (
            "Actualizar Alimentación"
          ) : (
            "Agregar Alimentación"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormAlimentacionAnimal;
