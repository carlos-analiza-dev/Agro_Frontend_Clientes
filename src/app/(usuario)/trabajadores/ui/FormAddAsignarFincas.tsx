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
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<AsignarFincaData>({
    defaultValues: {
      trabajadorId: trabajadorId,
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
      setIsErrorMessage("Debe seleccionar una finca para asignar");
      return;
    }

    try {
      await asignarFincaTrabajador(data);

      toast.success("Finca asignada correctamente al trabajador");

      queryClient.invalidateQueries({
        queryKey: ["fincas-trabajador", trabajadorId],
      });
      queryClient.invalidateQueries({ queryKey: ["trabajadores"] });

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
            : "Hubo un error al asignar la finca";
        setIsErrorMessage(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Error al asignar la finca</AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <User className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Información del Trabajador</h3>
        </div>
        <div className="space-y-2">
          {nombre && (
            <div>
              <Label className="text-sm text-muted-foreground">Nombre</Label>
              <p className="font-medium">{nombre}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="fincaId" className="font-semibold">
            Seleccionar Finca <span className="text-red-500">*</span>
          </Label>
        </div>

        <Select
          onValueChange={(value) => {
            setValue("fincaId", value);
            setSelectedFinca(value);
          }}
          disabled={isSubmitting || isLoadingFincas}
          value={selectedFinca}
        >
          <SelectTrigger className={errors.fincaId ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecciona una finca" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fincas disponibles</SelectLabel>
              {isLoadingFincas ? (
                <SelectItem value="loading" disabled>
                  Cargando fincas...
                </SelectItem>
              ) : fincas && fincas.data.fincas.length > 0 ? (
                fincas.data.fincas.map((finca) => (
                  <SelectItem key={finca.id} value={finca.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{finca.nombre_finca}</span>
                      <span className="text-xs text-muted-foreground">
                        {finca.ubicacion} - {finca.cantidad_animales} animales
                      </span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-fincas" disabled>
                  No hay fincas disponibles
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        {errors.fincaId && (
          <p className="text-sm text-red-500 mt-1">{errors.fincaId.message}</p>
        )}

        {fincasError && (
          <p className="text-sm text-red-500 mt-1">
            Error al cargar las fincas. Por favor, recarga la página.
          </p>
        )}
      </div>

      {selectedFinca && fincas && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold text-blue-800">Finca seleccionada</h4>
          </div>
          {fincas.data.fincas.find((f) => f.id === selectedFinca) && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Nombre:</span>
                <span className="font-medium text-blue-900">
                  {
                    fincas.data.fincas.find((f) => f.id === selectedFinca)
                      ?.nombre_finca
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Ubicación:</span>
                <span className="text-blue-900">
                  {
                    fincas.data.fincas.find((f) => f.id === selectedFinca)
                      ?.ubicacion
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Animales:</span>
                <span className="text-blue-900">
                  {
                    fincas.data.fincas.find((f) => f.id === selectedFinca)
                      ?.cantidad_animales
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => setClienteId("")}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !selectedFinca || isLoadingFincas}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Asignando...
            </span>
          ) : (
            "Asignar Finca"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormAddAsignarFincas;
