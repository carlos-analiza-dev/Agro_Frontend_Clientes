"use client";

import { AsignarFincaData } from "@/api/fincas-trabajador/interface/asignar-finca.interface";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/providers/store/useAuthStore";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Building2, User, CheckCircle2 } from "lucide-react";
import { asignarFincaTrabajador } from "@/api/fincas-trabajador/accions/asignar-finca-trabajador";
import { useTranslations } from "next-intl";

interface Props {
  trabajadorId: string;
  setClienteId: Dispatch<SetStateAction<string>>;
  setNombreTrabajador: Dispatch<SetStateAction<string>>;
  nombre: string;
  onSuccess: () => void;
}

const FormAddAsignarFincas = ({
  trabajadorId,
  setClienteId,
  setNombreTrabajador,
  nombre,
  onSuccess,
}: Props) => {
  const t = useTranslations("formAddAsignarFincas");

  const [errorMessage, setIsErrorMessage] = useState<string>("");
  const [selectedFinca, setSelectedFinca] = useState<string>("");

  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const queryClient = useQueryClient();

  const {
    data: fincas,
    isLoading: isLoadingFincas,
    error: fincasError,
  } = useFincasPropietarios(propietarioId);

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<AsignarFincaData>({
    defaultValues: {
      trabajadorId,
      fincaId: "",
    },
  });

  useEffect(() => {
    if (trabajadorId) {
      setValue("trabajadorId", trabajadorId);
    }
  }, [trabajadorId, setValue]);

  const onSubmit = async (data: AsignarFincaData) => {
    if (!data.fincaId) {
      setIsErrorMessage(t("validation.farmRequired"));
      return;
    }

    try {
      await asignarFincaTrabajador(data);

      toast.success(t("messages.assignSuccess"));

      queryClient.invalidateQueries({
        queryKey: ["fincas-trabajador", trabajadorId],
      });

      queryClient.invalidateQueries({
        queryKey: ["trabajadores"],
      });

      reset();
      setSelectedFinca("");
      setIsErrorMessage("");
      setClienteId("");
      setNombreTrabajador("");

      if (onSuccess) {
        onSuccess();
      }

      setClienteId("");
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("errors.assignFarm");

        setIsErrorMessage(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error(t("errors.unexpected"));
      }
    }
  };

  const fincaSeleccionada = fincas?.data.fincas.find(
    (f) => f.id === selectedFinca,
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>{t("errors.title")}</AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <User className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">{t("workerInformation.title")}</h3>
        </div>

        <div className="space-y-2">
          {nombre && (
            <div>
              <Label className="text-sm text-muted-foreground">
                {t("workerInformation.name")}
              </Label>
              <p className="font-medium">{nombre}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="fincaId" className="font-semibold">
            {t("fields.selectFarm")} <span className="text-red-500">*</span>
          </Label>
        </div>

        <Select
          onValueChange={(value) => {
            setValue("fincaId", value);
            setSelectedFinca(value);
            setIsErrorMessage("");
          }}
          disabled={isSubmitting || isLoadingFincas}
          value={selectedFinca}
        >
          <SelectTrigger className={errors.fincaId ? "border-red-500" : ""}>
            <SelectValue placeholder={t("placeholders.selectFarm")} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("fields.availableFarms")}</SelectLabel>

              {isLoadingFincas ? (
                <SelectItem value="loading" disabled>
                  {t("loading.farms")}
                </SelectItem>
              ) : fincas && fincas.data.fincas.length > 0 ? (
                fincas.data.fincas.map((finca) => (
                  <SelectItem
                    key={finca.id}
                    value={finca.id}
                    className="h-[55px] flex items-center"
                  >
                    <div className="flex flex-col justify-center h-full overflow-hidden">
                      <span className="font-medium truncate">
                        {finca.nombre_finca}
                      </span>

                      <span className="text-xs text-muted-foreground truncate">
                        {finca.ubicacion} - {finca.cantidad_animales}{" "}
                        {t("labels.animals")}
                      </span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-fincas" disabled>
                  {t("empty.noFarms")}
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        {errors.fincaId && (
          <p className="text-sm text-red-500 mt-1">{errors.fincaId.message}</p>
        )}

        {fincasError && (
          <p className="text-sm text-red-500 mt-1">{t("errors.loadFarms")}</p>
        )}
      </div>

      {selectedFinca && fincaSeleccionada && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold text-blue-800">
              {t("selectedFarm.title")}
            </h4>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">{t("selectedFarm.name")}:</span>
              <span className="font-medium text-blue-900">
                {fincaSeleccionada.nombre_finca}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-blue-700">
                {t("selectedFarm.location")}:
              </span>
              <span className="text-blue-900">
                {fincaSeleccionada.ubicacion}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-blue-700">
                {t("selectedFarm.animals")}:
              </span>
              <span className="text-blue-900">
                {fincaSeleccionada.cantidad_animales}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onSuccess();
            setClienteId("");
          }}
          disabled={isSubmitting}
        >
          {t("buttons.cancel")}
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || !selectedFinca || isLoadingFincas}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t("buttons.assigning")}
            </span>
          ) : (
            t("buttons.assignFarm")
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormAddAsignarFincas;
