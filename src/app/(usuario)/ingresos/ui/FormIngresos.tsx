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
import { MetodoPago } from "@/interfaces/enums/gastos.enums";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Ingreso } from "@/api/finanzas/ingresos/interface/response-ingresos.interface";
import { CategoriaIngreso } from "@/interfaces/enums/ingresos.enums";
import { CrearIngresoInterface } from "@/api/finanzas/ingresos/interface/crear-ingreso.interface";
import { EditarIngreso } from "@/api/finanzas/ingresos/accions/editar-ingreso";
import { AgregarNuevoIngreso } from "@/api/finanzas/ingresos/accions/crear-ingreso";

interface Props {
  ingreso?: Ingreso | null;
  setOpenModal: (open: boolean) => void;
  onSuccess?: () => void;
}

const FormIngresos = ({ ingreso, setOpenModal, onSuccess }: Props) => {
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
  } = useForm<CrearIngresoInterface>({
    defaultValues: {
      categoria: CategoriaIngreso.SERVICIOS,
      fincaId: "",
      especieId: undefined,
      razaId: undefined,
      concepto: "",
      descripcion: "",
      monto: 0,
      fecha_ingreso: new Date().toISOString().split("T")[0],
      metodo_pago: MetodoPago.EFECTIVO,
      notas: "",
    },
  });

  const queryClient = useQueryClient();
  const isEditing = !!ingreso;
  const selectedCategoria = watch("categoria");
  const isVentaAnimal = selectedCategoria === CategoriaIngreso.VENTA_ANIMAL;

  useEffect(() => {
    if (ingreso) {
      setValue("categoria", ingreso.categoria || CategoriaIngreso.SERVICIOS);
      setValue("fincaId", ingreso.fincaId || "");
      setValue("especieId", ingreso.especieId || undefined);
      setValue("razaId", ingreso.razaId || undefined);
      setValue("concepto", ingreso.concepto || "");
      setValue("descripcion", ingreso.descripcion || "");
      setValue("monto", ingreso.monto || 0);

      if (ingreso.fecha_ingreso) {
        const fechaStr =
          typeof ingreso.fecha_ingreso === "string"
            ? ingreso.fecha_ingreso.split("T")[0]
            : new Date(ingreso.fecha_ingreso).toISOString().split("T")[0];
        setValue("fecha_ingreso", fechaStr);
      } else {
        setValue("fecha_ingreso", new Date().toISOString().split("T")[0]);
      }

      setValue("metodo_pago", ingreso.metodo_pago || MetodoPago.EFECTIVO);
      setValue("notas", ingreso.notas || "");

      if (ingreso.especieId) {
        setSelectedEspecieId(ingreso.especieId);
      }
    } else {
      reset({
        categoria: CategoriaIngreso.SERVICIOS,
        fincaId: "",
        especieId: undefined,
        razaId: undefined,
        concepto: "",
        descripcion: "",
        monto: 0,
        fecha_ingreso: new Date().toISOString().split("T")[0],
        metodo_pago: MetodoPago.EFECTIVO,
        notas: "",
      });
      setSelectedEspecieId("");
    }
    setIsLoading(false);
  }, [ingreso, setValue, reset]);

  const onSubmit = async (data: CrearIngresoInterface) => {
    try {
      if (!isVentaAnimal) {
        data.especieId = undefined;
        data.razaId = undefined;
      }

      let response;

      if (isEditing && ingreso) {
        response = await EditarIngreso(ingreso.id, {
          ...data,
          monto: Number(data.monto),
        });
        toast.success("Ingreso actualizado correctamente");
      } else {
        response = await AgregarNuevoIngreso({
          ...data,
          monto: Number(data.monto),
        });
        toast.success("Ingreso registrado correctamente");
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["ingresos"] });
      queryClient.invalidateQueries({ queryKey: ["rentabilidad-general"] });
      queryClient.invalidateQueries({ queryKey: ["rentabilidad-categorias"] });
      queryClient.invalidateQueries({ queryKey: ["rentabilidad-fincas"] });
      queryClient.invalidateQueries({ queryKey: ["rentabilidad-periodo"] });

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
            : "Hubo un error al registrar el ingreso";
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
            Error al {isEditing ? "actualizar" : "registrar"} el Ingreso
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
              setValue("categoria", value as CategoriaIngreso);

              if (value !== CategoriaIngreso.SERVICIOS) {
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
                {Object.values(CategoriaIngreso).map((categoria) => (
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

        {isVentaAnimal && (
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
              {!selectedEspecieId && isVentaAnimal && (
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
            min={1}
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
          <Label htmlFor="fecha_ingreso">
            Fecha del Ingreso <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fecha_ingreso"
            type="date"
            {...register("fecha_ingreso", {
              required: "La fecha es requerida",
            })}
            className={errors.fecha_ingreso ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.fecha_ingreso && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fecha_ingreso.message}
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
            placeholder="Detalles adicionales del ingreso..."
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
            "Actualizar Ingreso"
          ) : (
            "Registrar Ingreso"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormIngresos;
