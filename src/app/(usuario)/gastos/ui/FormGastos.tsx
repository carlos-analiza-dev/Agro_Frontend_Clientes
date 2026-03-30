import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { AlertCircleIcon } from "lucide-react";
import { CrearGastoInterface } from "@/api/finanzas/gastos/interface/crear-gasto.interface";
import { CategoriaGasto, MetodoPago } from "@/interfaces/enums/gastos.enums";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Gastos } from "@/api/finanzas/gastos/interface/gastos-response.interface";
import { AgregarNuevoGasto } from "@/api/finanzas/gastos/accions/agregar-gasto";
import { EditarGasto } from "@/api/finanzas/gastos/accions/editar-gasto";

interface Props {
  gasto?: Gastos | null;
  setOpenModal: (open: boolean) => void;
  onSuccess?: () => void;
}

const FormGastos = ({ gasto, setOpenModal, onSuccess }: Props) => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedEspecieId, setSelectedEspecieId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const { data: fincas } = useFincasPropietarios(clienteId);
  const { data: especies } = useGetEspecies();
  const { data: razas, isLoading: isLoadingRazas } =
    useGetRazasByEspecie(selectedEspecieId);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CrearGastoInterface>({
    defaultValues: {
      categoria: CategoriaGasto.ALIMENTACION,
      fincaId: "",
      especieId: undefined,
      razaId: undefined,
      concepto: "",
      descripcion: "",
      monto: 0,
      fecha_gasto: new Date().toISOString().split("T")[0],
      metodo_pago: MetodoPago.EFECTIVO,
      notas: "",
    },
  });

  const queryClient = useQueryClient();
  const isEditing = !!gasto;
  const selectedCategoria = watch("categoria");
  const isCompraAnimal = selectedCategoria === CategoriaGasto.COMPRA_ANIMAL;

  useEffect(() => {
    if (gasto) {
      setValue("categoria", gasto.categoria || CategoriaGasto.ALIMENTACION);
      setValue("fincaId", gasto.fincaId || "");
      setValue("especieId", gasto.especieId || undefined);
      setValue("razaId", gasto.razaId || undefined);
      setValue("concepto", gasto.concepto || "");
      setValue("descripcion", gasto.descripcion || "");
      setValue("monto", gasto.monto || 0);

      if (gasto.fecha_gasto) {
        const fechaStr =
          typeof gasto.fecha_gasto === "string"
            ? gasto.fecha_gasto.split("T")[0]
            : new Date(gasto.fecha_gasto).toISOString().split("T")[0];
        setValue("fecha_gasto", fechaStr);
      } else {
        setValue("fecha_gasto", new Date().toISOString().split("T")[0]);
      }

      setValue("metodo_pago", gasto.metodo_pago || MetodoPago.EFECTIVO);
      setValue("notas", gasto.notas || "");

      if (gasto.especieId) {
        setSelectedEspecieId(gasto.especieId);
      }
    } else {
      reset({
        categoria: CategoriaGasto.ALIMENTACION,
        fincaId: "",
        especieId: undefined,
        razaId: undefined,
        concepto: "",
        descripcion: "",
        monto: 0,
        fecha_gasto: new Date().toISOString().split("T")[0],
        metodo_pago: MetodoPago.EFECTIVO,
        notas: "",
      });
      setSelectedEspecieId("");
    }
    setIsLoading(false);
  }, [gasto, setValue, reset]);

  const onSubmit = async (data: CrearGastoInterface) => {
    try {
      if (!isCompraAnimal) {
        data.especieId = undefined;
        data.razaId = undefined;
      }

      let response;

      if (isEditing && gasto) {
        response = await EditarGasto(gasto.id, {
          ...data,
          monto: Number(data.monto),
        });
        toast.success("Gasto actualizado correctamente");
      } else {
        response = await AgregarNuevoGasto({
          ...data,
          monto: Number(data.monto),
        });
        toast.success("Gasto registrado correctamente");
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["gastos"] });

      if (onSuccess) {
        onSuccess();
        setErrorMessage("");
      }

      setOpenModal(false);
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al registrar el gasto";
        setErrorMessage(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            Error al {isEditing ? "actualizar" : "registrar"} el Gasto
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="categoria">
            Categoría <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("categoria")}
            onValueChange={(value) => {
              setValue("categoria", value as CategoriaGasto);

              if (value !== CategoriaGasto.COMPRA_ANIMAL) {
                setValue("especieId", undefined);
                setValue("razaId", undefined);
                setSelectedEspecieId("");
              }
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categorías</SelectLabel>
                {Object.values(CategoriaGasto).map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.categoria && (
            <p className="text-sm text-red-500 mt-1">
              {errors.categoria.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="fincaId">
            Finca <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("fincaId")}
            onValueChange={(value) => setValue("fincaId", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar finca" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fincas</SelectLabel>
                {fincas?.data?.fincas?.map((finca) => (
                  <SelectItem key={finca.id} value={finca.id}>
                    {finca.nombre_finca}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.fincaId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fincaId.message}
            </p>
          )}
        </div>

        {isCompraAnimal && (
          <>
            <div>
              <Label htmlFor="especieId">
                Especie <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("especieId") || ""}
                onValueChange={(value) => {
                  setValue("especieId", value);
                  setSelectedEspecieId(value);
                  setValue("razaId", undefined);
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar especie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Especies</SelectLabel>
                    {especies?.data?.map((especie) => (
                      <SelectItem key={especie.id} value={especie.id}>
                        {especie.nombre}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.especieId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.especieId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="razaId">Raza</Label>
              <Select
                value={watch("razaId") || ""}
                onValueChange={(value) => setValue("razaId", value)}
                disabled={isSubmitting || isLoadingRazas || !selectedEspecieId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar raza" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Razas</SelectLabel>
                    {razas?.data?.map((raza) => (
                      <SelectItem key={raza.id} value={raza.id}>
                        {raza.nombre}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {!selectedEspecieId && isCompraAnimal && (
                <p className="text-sm text-yellow-600 mt-1">
                  * Selecciona una especie primero para ver las razas
                </p>
              )}
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <Label htmlFor="concepto">
            Concepto <span className="text-red-500">*</span>
          </Label>
          <Input
            id="concepto"
            {...register("concepto", {
              required: "El concepto es requerido",
              maxLength: {
                value: 200,
                message: "El concepto no puede exceder los 200 caracteres",
              },
            })}
            placeholder="Ej: Compra de concentrado para ganado"
            className={errors.concepto ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.concepto && (
            <p className="text-sm text-red-500 mt-1">
              {errors.concepto.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="monto">
            Monto <span className="text-red-500">*</span>
          </Label>
          <Input
            id="monto"
            type="number"
            step="0.01"
            {...register("monto", {
              required: "El monto es requerido",
              min: {
                value: 0.01,
                message: "El monto debe ser mayor a 0",
              },
            })}
            placeholder="0.00"
            className={errors.monto ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.monto && (
            <p className="text-sm text-red-500 mt-1">{errors.monto.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="fecha_gasto">
            Fecha del Gasto <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fecha_gasto"
            type="date"
            {...register("fecha_gasto", {
              required: "La fecha es requerida",
            })}
            className={errors.fecha_gasto ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.fecha_gasto && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fecha_gasto.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="metodo_pago">
            Método de Pago <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("metodo_pago")}
            onValueChange={(value) =>
              setValue("metodo_pago", value as MetodoPago)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar método de pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Métodos de Pago</SelectLabel>
                {Object.values(MetodoPago).map((metodo) => (
                  <SelectItem key={metodo} value={metodo}>
                    {metodo.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.metodo_pago && (
            <p className="text-sm text-red-500 mt-1">
              {errors.metodo_pago.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            {...register("descripcion", {
              maxLength: {
                value: 500,
                message: "La descripción no puede exceder los 500 caracteres",
              },
            })}
            placeholder="Detalles adicionales del gasto..."
            rows={3}
            disabled={isSubmitting}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-500 mt-1">
              {errors.descripcion.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="notas">Notas adicionales</Label>
          <Textarea
            id="notas"
            {...register("notas", {
              maxLength: {
                value: 500,
                message: "Las notas no pueden exceder los 500 caracteres",
              },
            })}
            placeholder="Notas adicionales..."
            rows={2}
            disabled={isSubmitting}
          />
          {errors.notas && (
            <p className="text-sm text-red-500 mt-1">{errors.notas.message}</p>
          )}
        </div>
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
            "Actualizar Gasto"
          ) : (
            "Registrar Gasto"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormGastos;
