"use client";

import { CrearConsumoInsumoInterface } from "@/api/agroservicio/consumo-insumos/interface/crear-consumo-insumo.interface";
import useGetInsumosDisponibles from "@/hooks/agroservicios/insumos/useGetInsumosDisponibles";
import useGetExistenciasAgroInsumos from "@/hooks/agroservicios/lotes-insumos/useGetExistenciasAgroInsumos";
import useGetAllSucursalesByPropietario from "@/hooks/agroservicios/sucursales/useGetAllSucursalesByPropietario";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Package,
  AlertCircle,
  CheckCircle2,
  Building2,
  Box,
  CalendarDays,
  FileText,
  ArrowRight,
} from "lucide-react";
import {
  ingresarConsumoInsumo,
  ingresarConsumoInsumoEmpleado,
} from "@/api/agroservicio/consumo-insumos/accions/inrgesar-consumo-insumo";
import { AgroInsumo } from "@/api/agroservicio/insumos/interfaces/response-agro-insumos.interface";
import { SucursaleAgro } from "@/api/agroservicio/agro-sucursales/interface/response-sucursales-agro.interface";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { useTranslations } from "next-intl";

interface Props {
  propietarioId: string;
  isPropietario: boolean;
  sucursalId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FormAddConsumoInsumo = ({
  propietarioId,
  isPropietario,
  sucursalId,
  onSuccess,
  onCancel,
}: Props) => {
  const t = useTranslations("formAddConsumoInsumo");

  const queryClient = useQueryClient();

  const { data: insumos } = useGetInsumosDisponibles(propietarioId);
  const { data: sucursales } = useGetAllSucursalesByPropietario(propietarioId);

  const [selectSucursal, setSelectSucursal] = useState(
    isPropietario ? "" : sucursalId,
  );
  const [selectInsumo, setSelectInsumo] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formDataToConfirm, setFormDataToConfirm] =
    useState<CrearConsumoInsumoInterface | null>(null);

  const { data: existenciaData } = useGetExistenciasAgroInsumos(
    selectSucursal ?? "",
    selectInsumo,
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CrearConsumoInsumoInterface>({
    defaultValues: {
      cantidad: 0,
      fecha_consumo: new Date().toISOString().split("T")[0],
      observacion: "",
    },
  });

  useEffect(() => {
    setSelectInsumo("");
    setValue("cantidad", 0);
  }, [selectSucursal, setValue]);

  const cantidadWatch = watch("cantidad");
  const fechaWatch = watch("fecha_consumo");
  const observacionWatch = watch("observacion");

  const mutation = useMutation({
    mutationFn: (data: CrearConsumoInsumoInterface) =>
      isPropietario
        ? ingresarConsumoInsumo(selectSucursal ?? "", selectInsumo, data)
        : ingresarConsumoInsumoEmpleado(
            selectSucursal ?? "",
            selectInsumo,
            data,
          ),
    onSuccess: () => {
      toast.success(t("messages.createSuccess"));
      queryClient.invalidateQueries({ queryKey: ["consumo-insumos"] });
      queryClient.invalidateQueries({ queryKey: ["existencia-agro-insumos"] });
      reset({
        cantidad: 0,
        fecha_consumo: new Date().toISOString().split("T")[0],
        observacion: "",
      });
      setSelectInsumo("");
      setShowConfirmDialog(false);
      setFormDataToConfirm(null);
      onSuccess?.();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.createError");
        toast.error(errorMessage);
      } else {
        toast.error(t("messages.createUnexpectedError"));
      }
    },
  });

  const onSubmit = (data: CrearConsumoInsumoInterface) => {
    if (existenciaData && data.cantidad > existenciaData.cantidad) {
      toast.error(
        t("messages.exceedsAvailability", {
          quantity: existenciaData.cantidad,
        }),
      );
      return;
    }

    setFormDataToConfirm(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    if (formDataToConfirm) {
      mutation.mutate({
        ...formDataToConfirm,
        cantidad: Number(formDataToConfirm.cantidad),
      });
    }
  };

  const insumoSeleccionado = insumos?.find(
    (insumo: AgroInsumo) => insumo.id === selectInsumo,
  );

  const sucursalSeleccionada = sucursales?.find(
    (s: SucursaleAgro) => s.id === (selectSucursal ?? ""),
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {isPropietario && (
          <div className="space-y-2">
            <Label htmlFor="sucursal" className="font-bold">
              {t("fields.branch")}*
            </Label>
            <Select value={selectSucursal} onValueChange={setSelectSucursal}>
              <SelectTrigger id="sucursal">
                <SelectValue placeholder={t("placeholders.branch")} />
              </SelectTrigger>
              <SelectContent>
                {sucursales?.map((sucursal: any) => (
                  <SelectItem key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectSucursal && (
              <p className="text-sm font-medium text-red-500">
                {t("validation.branchRequired")}
              </p>
            )}
          </div>
        )}

        {!isPropietario && (
          <div className="space-y-2">
            <Label className="font-bold">{t("fields.branch")}</Label>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">
                {sucursales?.find((s: SucursaleAgro) => s.id === sucursalId)
                  ?.nombre || t("values.loading")}
              </p>
            </div>
            <input type="hidden" value={sucursalId} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="insumo" className="font-bold">
            {t("fields.supply")}*
          </Label>
          <Select
            value={selectInsumo}
            onValueChange={setSelectInsumo}
            disabled={!selectSucursal}
          >
            <SelectTrigger id="insumo">
              <SelectValue
                placeholder={
                  !selectSucursal
                    ? t("placeholders.selectBranchFirst")
                    : t("placeholders.supply")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {insumos?.map((insumo: AgroInsumo) => (
                <SelectItem key={insumo.id} value={insumo.id}>
                  {insumo.nombre} - {insumo.codigo || t("values.noCode")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!selectInsumo && selectSucursal && (
            <p className="text-sm font-medium text-amber-500">
              {t("validation.supplyRequired")}
            </p>
          )}
        </div>

        {selectInsumo && existenciaData && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {t("availability.title", {
                    name: insumoSeleccionado?.nombre || "",
                  })}
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {existenciaData.cantidad || 0} {t("values.units")}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="cantidad" className="font-bold">
            {t("fields.quantity")}*
          </Label>
          <Input
            id="cantidad"
            type="number"
            step="1"
            min={1}
            {...register("cantidad", {
              required: t("validation.quantityRequired"),
              min: {
                value: 0.01,
                message: t("validation.quantityMin"),
              },
              validate: (value) => {
                if (existenciaData && value > existenciaData.cantidad) {
                  return t("validation.insufficientStock", {
                    quantity: existenciaData.cantidad,
                  });
                }
                return true;
              },
            })}
            placeholder="0.00"
            disabled={!selectInsumo}
          />
          {errors.cantidad && (
            <p className="text-sm font-medium text-red-500">
              {errors.cantidad.message as string}
            </p>
          )}
          {existenciaData && cantidadWatch > existenciaData.cantidad && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t("alerts.quantityExceedsAvailability", {
                  quantity: cantidadWatch,
                  available: existenciaData.cantidad,
                })}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha_consumo" className="font-bold">
            {t("fields.consumptionDate")}*
          </Label>
          <Input
            id="fecha_consumo"
            type="date"
            {...register("fecha_consumo", {
              required: t("validation.dateRequired"),
            })}
          />
          {errors.fecha_consumo && (
            <p className="text-sm font-medium text-red-500">
              {errors.fecha_consumo.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacion" className="font-bold">
            {t("fields.observation")}
          </Label>
          <Textarea
            id="observacion"
            {...register("observacion", {
              maxLength: {
                value: 500,
                message: t("validation.observationMaxLength"),
              },
            })}
            placeholder={t("placeholders.observation")}
            rows={3}
          />
          {errors.observacion && (
            <p className="text-sm font-medium text-red-500">
              {errors.observacion.message as string}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          {onCancel && (
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              disabled={mutation.isPending}
            >
              {t("buttons.cancel")}
            </Button>
          )}
          <Button
            type="submit"
            disabled={
              mutation.isPending ||
              !selectSucursal ||
              !selectInsumo ||
              (existenciaData && cantidadWatch > existenciaData.cantidad)
            }
            className="min-w-[150px] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            {t("buttons.reviewAndConfirm")}
          </Button>
        </div>
      </form>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              {t("confirmation.title")}
            </DialogTitle>
            <DialogDescription>
              {t("confirmation.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Building2 className="h-4 w-4" />
                  <span>{t("fields.branch")}</span>
                </div>
                <p className="font-medium">
                  {sucursalSeleccionada?.nombre || t("values.notSelected")}
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Box className="h-4 w-4" />
                  <span>{t("fields.supply")}</span>
                </div>
                <p className="font-medium">
                  {insumoSeleccionado?.nombre || t("values.notSelected")}
                </p>
                {insumoSeleccionado?.codigo && (
                  <p className="text-xs text-muted-foreground">
                    {t("values.code")}: {insumoSeleccionado.codigo}
                  </p>
                )}
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Package className="h-4 w-4" />
                  <span>{t("fields.quantity")}</span>
                </div>
                <p className="font-medium text-lg">
                  {formDataToConfirm?.cantidad || 0} {t("values.units")}
                </p>
                {existenciaData && (
                  <p className="text-xs text-muted-foreground">
                    {t("availability.available")}: {existenciaData.cantidad}{" "}
                    {t("values.units")}
                  </p>
                )}
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{t("fields.consumptionDate")}</span>
                </div>
                <p className="font-medium">
                  {formDataToConfirm?.fecha_consumo
                    ? formatDateOnly(formDataToConfirm.fecha_consumo)
                    : t("values.notSelected")}
                </p>
              </div>
            </div>

            {formDataToConfirm?.observacion && (
              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <FileText className="h-4 w-4" />
                  <span>{t("fields.observation")}</span>
                </div>
                <p className="text-sm">{formDataToConfirm.observacion}</p>
              </div>
            )}

            {existenciaData && formDataToConfirm && (
              <Alert
                variant={
                  formDataToConfirm.cantidad > existenciaData.cantidad * 0.8
                    ? "destructive"
                    : "default"
                }
                className={
                  formDataToConfirm.cantidad <= existenciaData.cantidad * 0.8
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                    : ""
                }
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {formDataToConfirm.cantidad >
                  existenciaData.cantidad * 0.8 ? (
                    <span className="text-red-600 dark:text-red-400">
                      ⚠️ {t("alerts.highConsumption")}
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400">
                      ✅ {t("alerts.stockAvailable")}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={mutation.isPending}
            >
              {t("buttons.backToForm")}
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={mutation.isPending}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {mutation.isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l-3-2.647z"
                    ></path>
                  </svg>
                  {t("buttons.registering")}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {t("buttons.confirmAndRegister")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormAddConsumoInsumo;
