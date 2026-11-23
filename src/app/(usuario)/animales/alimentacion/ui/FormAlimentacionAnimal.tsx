"use client";

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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("formAlimentacionAnimal");

  const { data: animales, isLoading: isLoadingAnimales } =
    useGetAnimalesPropietario();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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
        isEdit ? t("messages.updateSuccess") : t("messages.createSuccess"),
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
            : t("errors.processFood");

        toast.error(errorMessage);
      } else {
        toast.error(t("errors.contactAdmin"));
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

  const getOriginLabel = (value: string, label: string) => {
    if (value === "producido") {
      return t("catalog.origin.produced");
    }

    if (value === "comprado") {
      return t("catalog.origin.purchased");
    }

    return label;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">{t("fields.foodType")}*</Label>

        <Select
          onValueChange={(value) => setValue("tipoAlimento", value)}
          defaultValue={editAlimentacion?.tipoAlimento}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder={t("placeholders.foodType")} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("selectLabels.food")}</SelectLabel>

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
        <Label className="font-bold">{t("fields.foodOrigin")}*</Label>

        <Select
          onValueChange={(value) => setValue("origen", value)}
          defaultValue={editAlimentacion?.origen}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder={t("placeholders.foodOrigin")} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("selectLabels.origin")}</SelectLabel>

              {origenAlimentos.map((alimento) => (
                <SelectItem key={alimento.id} value={alimento.value}>
                  {getOriginLabel(alimento.value, alimento.label)}
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
        <Label className="font-bold">{t("fields.dailyQuantity")}*</Label>

        <Input
          type="number"
          step="0.01"
          min={0.1}
          placeholder={t("placeholders.quantity")}
          {...register("cantidad", {
            required: t("validation.quantityRequired"),
            min: {
              value: 0.1,
              message: t("validation.quantityMin"),
            },
          })}
        />

        {errors.cantidad && (
          <p className="text-sm font-medium text-red-500">
            {errors.cantidad.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">{t("fields.unit")}*</Label>

        <Select
          onValueChange={(value) => setValue("unidad", value)}
          defaultValue={editAlimentacion?.unidad}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("placeholders.unit")} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("selectLabels.unit")}</SelectLabel>

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
        <Label className="font-bold">
          {t("fields.dailyCost", { currency: moneda || "$" })}*
        </Label>

        <Input
          type="number"
          step="0.01"
          min={0.01}
          placeholder={t("placeholders.dailyCost", {
            currency: moneda || "$",
          })}
          {...register("costo_diario", {
            required: t("validation.dailyCostRequired"),
            min: {
              value: 0.01,
              message: t("validation.dailyCostMin"),
            },
          })}
        />

        {errors.costo_diario && (
          <p className="text-sm font-medium text-red-500">
            {errors.costo_diario.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">{t("fields.entryDate")}*</Label>

        <Input
          type="date"
          {...register("fecha", {
            required: t("validation.dateRequired"),
          })}
        />

        {errors.fecha && (
          <p className="text-sm font-medium text-red-500">
            {errors.fecha.message as string}
          </p>
        )}
      </div>

      {!isEdit && (
        <div className="space-y-1">
          <Label className="font-bold">{t("fields.animal")}*</Label>

          <Select
            onValueChange={(value) => setValue("animalId", value)}
            disabled={isLoadingAnimales}
          >
            <SelectTrigger className="py-6">
              <SelectValue
                placeholder={
                  isLoadingAnimales
                    ? t("placeholders.loadingAnimals")
                    : t("placeholders.selectAnimal")
                }
              />
            </SelectTrigger>

            <SelectContent className="max-h-[300px]">
              <SelectGroup>
                <SelectLabel>{t("selectLabels.availableAnimals")}</SelectLabel>

                {animales && animales.length > 0 ? (
                  animales.map((animal) => (
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
                            {animal.razas?.[0]?.nombre || t("animal.noBreed")} •{" "}
                            {animal.sexo}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    {t("empty.animals")}
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
              {isEdit ? t("buttons.updating") : t("buttons.adding")}
            </>
          ) : isEdit ? (
            t("buttons.updateFeeding")
          ) : (
            t("buttons.addFeeding")
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormAlimentacionAnimal;
