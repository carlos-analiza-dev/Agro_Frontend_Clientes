"use client";
import { CrearConfigTrabajadorInterface } from "@/api/configuraciones-trabajadores/interface/crear-config.interface";
import { Configuraciones } from "@/api/configuraciones-trabajadores/interface/response-config-trabajadores.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Plus,
  Trash2,
  DollarSign,
  Clock,
  Briefcase,
  Calendar,
  TrendingUp,
  CalendarDays,
  Sun,
  Moon,
  Star,
  CheckSquare,
  DoorClosed,
  DoorOpen,
  CalendarOff,
  Search,
  X,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { CreateConfigTrabajador } from "@/api/configuraciones-trabajadores/accions/crear-configuracion";
import { EditarConfigTrabajador } from "@/api/configuraciones-trabajadores/accions/editar-configuracion";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import {
  DiaSemana,
  TipoTrabajador,
} from "@/interfaces/enums/config-trabajadores.enums";
import {
  diasSemanaOptions,
  tipoTrabajadorOptions,
} from "@/helpers/data/config-trabajadores";
import useGetAllTrabajadores from "@/hooks/trabajadores/useGetAllTrabajadores";
import { formatHora } from "@/helpers/funciones/formatHora";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Props {
  onSuccess: () => void;
  configuracion?: Configuraciones | null;
  setSelectedConfig?: Dispatch<SetStateAction<Configuraciones | null>>;
  moneda: string;
}

const FormConfigTrabajadores = ({
  onSuccess,
  configuracion,
  moneda,
  setSelectedConfig,
}: Props) => {
  const t = useTranslations("FormConfigTrabajadores");
  const isEditing = !!configuracion;
  const queryClient = useQueryClient();
  const { data: trabajadores, isLoading: loadingTrabajadores } =
    useGetAllTrabajadores();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchTrabajadorTerm, setSearchTrabajadorTerm] = useState<string>("");
  const [isTrabajadorSearchOpen, setIsTrabajadorSearchOpen] =
    useState<boolean>(false);

  const [valorHoraNormal, setValorHoraNormal] = useState<number>(0);
  const [valorHoraExtraDiurna, setValorHoraExtraDiurna] = useState<number>(0);
  const [valorHoraExtraNocturna, setValorHoraExtraNocturna] =
    useState<number>(0);
  const [valorHoraExtraFestiva, setValorHoraExtraFestiva] = useState<number>(0);
  const [salarioSemanal, setSalarioSemanal] = useState<number>(0);
  const [salarioMensual, setSalarioMensual] = useState<number>(0);
  const [horasPorDia, setHorasPorDia] = useState<number>(0);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CrearConfigTrabajadorInterface>({
    defaultValues: {
      trabajadorId: "",
      fechaContratacion: new Date().toISOString().split("T")[0],
      tipoTrabajador: TipoTrabajador.PERMANENTE,
      diaDescanso: undefined,
      horaEntrada: "07:00",
      horaSalida: "13:00",
      diasLaborales: [],
      cargo: "",
      salarioDiario: 0,
      factorHoraExtraDiurnas: 1.5,
      factorHoraExtraNocturnas: 1.7,
      factorHoraExtraFestivas: 2.0,
      diasTrabajadosSemanal: 6,
      horasJornadaSemanal: 36,
      bonificacionesFijas: [],
      deduccionesFijas: [],
      activo: true,
    },
  });

  const {
    fields: bonificacionesFields,
    append: appendBonificacion,
    remove: removeBonificacion,
  } = useFieldArray({
    control,
    name: "bonificacionesFijas",
  });

  const {
    fields: deduccionesFields,
    append: appendDeduccion,
    remove: removeDeduccion,
  } = useFieldArray({
    control,
    name: "deduccionesFijas",
  });

  const salarioDiario = watch("salarioDiario");
  const diasTrabajadosSemanal = watch("diasTrabajadosSemanal");
  const horasJornadaSemanal = watch("horasJornadaSemanal");
  const factorHoraExtraDiurnas = watch("factorHoraExtraDiurnas");
  const factorHoraExtraNocturnas = watch("factorHoraExtraNocturnas");
  const factorHoraExtraFestivas = watch("factorHoraExtraFestivas");
  const tipoTrabajador = watch("tipoTrabajador");
  const diaDescanso = watch("diaDescanso");
  const diasLaborales = watch("diasLaborales");
  const currentTrabajadorId = watch("trabajadorId");

  const filteredTrabajadores =
    trabajadores?.filter((trabajador: any) => {
      const searchTerm = searchTrabajadorTerm.toLowerCase().trim();
      if (!searchTerm) return true;

      const nombre = trabajador.nombre?.toLowerCase() || "";
      const identificacion = trabajador.identificacion?.toLowerCase() || "";
      const email = trabajador.email?.toLowerCase() || "";
      const telefono = trabajador.telefono?.toLowerCase() || "";

      return (
        nombre.includes(searchTerm) ||
        identificacion.includes(searchTerm) ||
        email.includes(searchTerm) ||
        telefono.includes(searchTerm)
      );
    }) || [];

  const trabajadoresDisponibles =
    filteredTrabajadores?.filter((trabajador: any) => {
      if (isEditing && configuracion?.trabajadorId === trabajador.id)
        return true;
      return !trabajador.configuracionActiva;
    }) || [];

  const selectedTrabajador = trabajadores?.find(
    (trabajador: any) => trabajador.id === currentTrabajadorId,
  );

  useEffect(() => {
    if (
      tipoTrabajador === TipoTrabajador.PERMANENTE ||
      tipoTrabajador === TipoTrabajador.TEMPORAL
    ) {
      setValue("diasTrabajadosSemanal", 6);
    } else if (tipoTrabajador === TipoTrabajador.PARCIAL) {
      if (diasTrabajadosSemanal >= 6) {
        setValue("diasTrabajadosSemanal", 4);
      }
    }
  }, [tipoTrabajador, setValue, diasTrabajadosSemanal]);

  useEffect(() => {
    if (
      diaDescanso &&
      (tipoTrabajador === TipoTrabajador.PERMANENTE ||
        tipoTrabajador === TipoTrabajador.TEMPORAL)
    ) {
      const todosDias = Object.values(DiaSemana);
      const laborales = todosDias.filter((dia) => dia !== diaDescanso);
      setValue("diasLaborales", laborales);
    }
  }, [diaDescanso, tipoTrabajador, setValue]);

  useEffect(() => {
    if (
      salarioDiario > 0 &&
      diasTrabajadosSemanal > 0 &&
      horasJornadaSemanal > 0
    ) {
      const horasPorDiaCalc = horasJornadaSemanal / diasTrabajadosSemanal;
      setHorasPorDia(horasPorDiaCalc);

      const valorHoraNormalCalc = salarioDiario / horasPorDiaCalc;
      setValorHoraNormal(valorHoraNormalCalc);

      const valorHoraExtraDiurnaCalc =
        valorHoraNormalCalc * factorHoraExtraDiurnas;
      const valorHoraExtraNocturnaCalc =
        valorHoraNormalCalc * factorHoraExtraNocturnas;
      const valorHoraExtraFestivaCalc =
        valorHoraNormalCalc * factorHoraExtraFestivas;

      setValorHoraExtraDiurna(valorHoraExtraDiurnaCalc);
      setValorHoraExtraNocturna(valorHoraExtraNocturnaCalc);
      setValorHoraExtraFestiva(valorHoraExtraFestivaCalc);

      const salarioSemanalCalc = salarioDiario * diasTrabajadosSemanal;
      setSalarioSemanal(salarioSemanalCalc);

      const salarioMensualCalc = salarioSemanalCalc * 4;
      setSalarioMensual(Math.round(salarioMensualCalc));
    } else {
      setHorasPorDia(0);
      setValorHoraNormal(0);
      setValorHoraExtraDiurna(0);
      setValorHoraExtraNocturna(0);
      setValorHoraExtraFestiva(0);
      setSalarioSemanal(0);
      setSalarioMensual(0);
    }
  }, [
    salarioDiario,
    diasTrabajadosSemanal,
    horasJornadaSemanal,
    factorHoraExtraDiurnas,
    factorHoraExtraNocturnas,
    factorHoraExtraFestivas,
  ]);

  useEffect(() => {
    if (configuracion) {
      let tipoTrabajadorValido = TipoTrabajador.PERMANENTE;
      if (
        configuracion.tipoTrabajador &&
        Object.values(TipoTrabajador).includes(
          configuracion.tipoTrabajador as TipoTrabajador,
        )
      ) {
        tipoTrabajadorValido = configuracion.tipoTrabajador as TipoTrabajador;
      }

      let diaDescansoValido: DiaSemana | undefined = undefined;
      if (
        configuracion.diaDescanso &&
        Object.values(DiaSemana).includes(
          configuracion.diaDescanso as DiaSemana,
        )
      ) {
        diaDescansoValido = configuracion.diaDescanso as DiaSemana;
      }

      reset({
        trabajadorId: configuracion.trabajadorId,
        fechaContratacion: configuracion.fechaContratacion,
        tipoTrabajador: tipoTrabajadorValido,
        diaDescanso: diaDescansoValido,
        horaEntrada: formatHora(configuracion.horaEntrada),
        horaSalida: formatHora(configuracion.horaSalida),
        diasLaborales: configuracion.diasLaborales || [],
        cargo: configuracion.cargo || "",
        salarioDiario: Number(configuracion.salarioDiario),
        factorHoraExtraDiurnas:
          Number(configuracion.factorHoraExtraDiurnas) || 1.5,
        factorHoraExtraNocturnas:
          Number(configuracion.factorHoraExtraNocturnas) || 1.7,
        factorHoraExtraFestivas:
          Number(configuracion.factorHoraExtraFestivas) || 2.0,
        diasTrabajadosSemanal: configuracion.diasTrabajadosSemanal,
        horasJornadaSemanal: configuracion.horasJornadaSemanal,
        bonificacionesFijas: configuracion.bonificacionesFijas || [],
        deduccionesFijas: configuracion.deduccionesFijas || [],
        activo: configuracion.activo,
      });

      setTimeout(() => {
        setValue("tipoTrabajador", tipoTrabajadorValido);
        if (diaDescansoValido) {
          setValue("diaDescanso", diaDescansoValido);
        }
        setValue("horaEntrada", configuracion.horaEntrada || "07:00");
        setValue("horaSalida", configuracion.horaSalida || "13:00");
      }, 0);
    }
  }, [configuracion, reset, setValue]);

  const createMutation = useMutation({
    mutationFn: CreateConfigTrabajador,
    onSuccess: () => {
      toast.success(t("messages.createSuccess"));
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["config-trabajadores"] });
      onSuccess();
    },
    onError: (error) => {
      handleMutationError(error, "create");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CrearConfigTrabajadorInterface;
    }) => EditarConfigTrabajador(id, data),
    onSuccess: () => {
      toast.success(t("messages.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["config-trabajadores"] });
      onSuccess();
    },
    onError: (error) => {
      handleMutationError(error, "update");
    },
  });

  const resetForm = () => {
    reset({
      trabajadorId: "",
      fechaContratacion: new Date().toISOString().split("T")[0],
      tipoTrabajador: TipoTrabajador.PERMANENTE,
      diaDescanso: undefined,
      horaEntrada: "07:00",
      horaSalida: "13:00",
      diasLaborales: [],
      cargo: "",
      salarioDiario: 0,
      factorHoraExtraDiurnas: 1.5,
      factorHoraExtraNocturnas: 1.7,
      factorHoraExtraFestivas: 2.0,
      diasTrabajadosSemanal: 6,
      horasJornadaSemanal: 36,
      bonificacionesFijas: [],
      deduccionesFijas: [],
      activo: true,
    });
    setSearchTrabajadorTerm("");
    setIsTrabajadorSearchOpen(false);
  };

  const handleMutationError = (error: unknown, action: "create" | "update") => {
    const actionLabel =
      action === "create"
        ? t("messages.actionCreate")
        : t("messages.actionUpdate");

    if (isAxiosError(error)) {
      const messages = error.response?.data?.message;
      const errorMessage = Array.isArray(messages)
        ? messages[0]
        : typeof messages === "string"
          ? messages
          : t("messages.genericError", { action: actionLabel });
      toast.error(errorMessage);
    } else {
      toast.error(t("messages.retryError", { action: actionLabel }));
    }
  };

  const handleSelectTrabajador = (trabajadorId: string) => {
    setValue("trabajadorId", trabajadorId);
    setSearchTrabajadorTerm("");
    setIsTrabajadorSearchOpen(false);
  };

  const handleClearTrabajador = () => {
    setValue("trabajadorId", "");
    setSearchTrabajadorTerm("");
    setIsTrabajadorSearchOpen(false);
  };

  const onSubmit = (data: CrearConfigTrabajadorInterface) => {
    if (data.tipoTrabajador !== TipoTrabajador.PARCIAL) {
      if (!data.diaDescanso) {
        toast.error(t("validation.restDayRequired"));
        return;
      }
      if (!data.horaEntrada || !data.horaSalida) {
        toast.error(t("validation.scheduleRequired"));
        return;
      }
    }

    if (isEditing && configuracion) {
      data.trabajadorId = configuracion.trabajadorId;
      data.horaEntrada = formatHora(data.horaEntrada);
      data.horaSalida = formatHora(data.horaSalida);
      updateMutation.mutate({ id: configuracion.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const totalBonificaciones =
    watch("bonificacionesFijas")?.reduce(
      (sum, b) => sum + (Number(b.montoMensual) || 0),
      0,
    ) || 0;

  const totalDeducciones =
    watch("deduccionesFijas")?.reduce(
      (sum, d) => sum + (Number(d.montoMensual) || 0),
      0,
    ) || 0;

  const totalNetoMensual =
    salarioMensual + totalBonificaciones - totalDeducciones;

  const handleCancel = () => {
    resetForm();
    if (setSelectedConfig) {
      setSelectedConfig(null);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {t("sections.laborInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="trabajadorSearch"
                className="text-sm md:text-base"
              >
                {t("fields.worker")} <span className="text-red-500">*</span>
              </Label>

              {isEditing ? (
                <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                  <span className="text-sm">
                    {configuracion?.trabajador?.nombre ||
                      t("fields.workerNotAssigned")}
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                    <input
                      type="text"
                      id="trabajadorSearch"
                      placeholder={
                        selectedTrabajador
                          ? `${selectedTrabajador.nombre}`
                          : t("placeholders.workerSearch")
                      }
                      value={searchTrabajadorTerm}
                      onChange={(e) => {
                        setSearchTrabajadorTerm(e.target.value);
                        setIsTrabajadorSearchOpen(true);
                      }}
                      onFocus={() => setIsTrabajadorSearchOpen(true)}
                      className={cn(
                        "w-full pl-9 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                        selectedTrabajador && "bg-blue-50 border-blue-300",
                        errors.trabajadorId && "border-red-500",
                      )}
                      disabled={loadingTrabajadores}
                    />
                    {selectedTrabajador && (
                      <button
                        type="button"
                        onClick={handleClearTrabajador}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {isTrabajadorSearchOpen && searchTrabajadorTerm && (
                    <div className="absolute z-50 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto bg-white">
                      {loadingTrabajadores ? (
                        <div className="py-6 text-center text-sm text-gray-500">
                          {t("workerSearch.loading")}
                        </div>
                      ) : trabajadoresDisponibles.length > 0 ? (
                        trabajadoresDisponibles.map((trabajador: any) => (
                          <div
                            key={trabajador.id}
                            onClick={() =>
                              handleSelectTrabajador(trabajador.id)
                            }
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50",
                              currentTrabajadorId === trabajador.id &&
                                "bg-blue-50",
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {trabajador.nombre}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                                {trabajador.identificacion && (
                                  <span className="truncate">
                                    ID: {trabajador.identificacion}
                                  </span>
                                )}
                                {trabajador.telefono && (
                                  <span>• {trabajador.telefono}</span>
                                )}
                                {trabajador.email && (
                                  <span className="truncate">
                                    • {trabajador.email}
                                  </span>
                                )}
                              </div>
                            </div>
                            {currentTrabajadorId === trabajador.id && (
                              <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center text-sm">
                          <p className="text-gray-500">
                            {t("workerSearch.noAvailable")}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {t("workerSearch.allAssigned")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!isEditing && selectedTrabajador && !searchTrabajadorTerm && (
                <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {selectedTrabajador.nombre}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                        {selectedTrabajador.identificacion && (
                          <span className="truncate">
                            ID: {selectedTrabajador.identificacion}
                          </span>
                        )}
                        {selectedTrabajador.telefono && (
                          <span>• {selectedTrabajador.telefono}</span>
                        )}
                        {selectedTrabajador.email && (
                          <span className="truncate">
                            • {selectedTrabajador.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {errors.trabajadorId && (
                <p className="text-sm font-medium text-red-500">
                  {errors.trabajadorId.message as string}
                </p>
              )}
              {isEditing && (
                <p className="text-xs text-muted-foreground">
                  {t("fields.workerNotEditable")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="fechaContratacion"
                className="text-sm md:text-base"
              >
                {t("fields.hireDate")} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fechaContratacion"
                  type="date"
                  className="pl-10 w-full"
                  {...register("fechaContratacion", {
                    required: t("validation.hireDateRequired"),
                  })}
                />
              </div>
              {errors.fechaContratacion && (
                <p className="text-sm font-medium text-red-500">
                  {errors.fechaContratacion.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoTrabajador" className="text-sm md:text-base">
                {t("fields.workerType")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("tipoTrabajador")}
                onValueChange={(value) =>
                  setValue("tipoTrabajador", value as TipoTrabajador)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("fields.workerTypePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {tipoTrabajadorOptions.map((option) => {
                    const key = option.value.toLowerCase();
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{t(`tipoTrabajador.${key}`)}</span>
                          <span className="text-xs text-muted-foreground">
                            {t(`tipoTrabajador.${key}Desc`)}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {errors.tipoTrabajador && (
                <p className="text-sm font-medium text-red-500">
                  {errors.tipoTrabajador.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo" className="text-sm md:text-base">
                {t("fields.position")}
              </Label>
              <Input
                id="cargo"
                placeholder={t("fields.positionPlaceholder")}
                className="w-full"
                {...register("cargo")}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="diaDescanso"
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <CalendarOff className="h-4 w-4" />
                {t("fields.restDay")}
                {(tipoTrabajador === TipoTrabajador.PERMANENTE ||
                  tipoTrabajador === TipoTrabajador.TEMPORAL) && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Select
                value={watch("diaDescanso") || ""}
                onValueChange={(value) =>
                  setValue("diaDescanso", value as DiaSemana)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("fields.restDayPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {diasSemanaOptions.map((option) => {
                    const key = option.value
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "");

                    return (
                      <SelectItem key={option.value} value={option.value}>
                        {t(`diasSemana.${key}`)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {tipoTrabajador === TipoTrabajador.PARCIAL
                  ? t("fields.restDayOptional")
                  : t("fields.restDayRequired")}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm md:text-base">
                {t("fields.status")}
              </Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="activo"
                  checked={watch("activo")}
                  onCheckedChange={(checked) => setValue("activo", checked)}
                />
                <Label htmlFor="activo" className="cursor-pointer">
                  {watch("activo") ? t("fields.active") : t("fields.inactive")}
                </Label>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-2">
            <Label className="text-sm md:text-base font-semibold mb-3 block">
              <Clock className="h-4 w-4 inline mr-2" />
              {t("sections.workSchedule")}
              {(tipoTrabajador === TipoTrabajador.PERMANENTE ||
                tipoTrabajador === TipoTrabajador.TEMPORAL) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="horaEntrada"
                  className="flex items-center gap-2"
                >
                  <DoorOpen className="h-3 w-3" />
                  {t("fields.entryTime")}
                </Label>
                <Input
                  id="horaEntrada"
                  type="time"
                  step="60"
                  className="w-full"
                  {...register("horaEntrada")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("fields.timeFormat24h")}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaSalida" className="flex items-center gap-2">
                  <DoorClosed className="h-3 w-3" />
                  {t("fields.exitTime")}
                </Label>
                <Input
                  id="horaSalida"
                  type="time"
                  step="60"
                  className="w-full"
                  {...register("horaSalida")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("fields.timeFormat24h")}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("fields.typicalSchedules")}
            </p>
          </div>

          {(tipoTrabajador === TipoTrabajador.PERMANENTE ||
            tipoTrabajador === TipoTrabajador.TEMPORAL) &&
            diasLaborales &&
            diasLaborales.length > 0 && (
              <div className="border-t pt-4 mt-2">
                <Label className="text-sm md:text-base font-semibold mb-3 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  {t("fields.workingDays")}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {diasLaborales.map((dia) => {
                    const key = dia
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "");

                    return (
                      <span
                        key={dia}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm"
                      >
                        {t(`diasSemana.${key}`)}
                      </span>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("fields.workingDaysCount", {
                    count: diasLaborales.length,
                  })}
                </p>
              </div>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t("sections.salaryConfig")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salarioDiario" className="text-sm md:text-base">
                {t("fields.dailySalary", { currency: moneda })}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="salarioDiario"
                  type="number"
                  step="0.01"
                  className="pl-10 w-full"
                  placeholder="0.00"
                  {...register("salarioDiario", {
                    required: t("fields.dailySalaryRequired"),
                    min: {
                      value: 0.01,
                      message: t("fields.dailySalaryMin"),
                    },
                    valueAsNumber: true,
                  })}
                />
              </div>
              {errors.salarioDiario && (
                <p className="text-sm font-medium text-red-500">
                  {errors.salarioDiario.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="diasTrabajadosSemanal"
                className="text-sm md:text-base"
              >
                {t("fields.daysPerWeek")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="diasTrabajadosSemanal"
                  type="number"
                  step="1"
                  className="pl-10 w-full"
                  placeholder="6"
                  {...register("diasTrabajadosSemanal", {
                    required: t("fields.daysRequired"),
                    min: { value: 1, message: t("fields.minOneDay") },
                    max: { value: 7, message: t("fields.maxSevenDays") },
                    valueAsNumber: true,
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {tipoTrabajador === TipoTrabajador.PARCIAL
                  ? t("fields.daysPerWeekPartial")
                  : t("fields.daysPerWeekPermanent")}
              </p>
              {errors.diasTrabajadosSemanal && (
                <p className="text-sm font-medium text-red-500">
                  {errors.diasTrabajadosSemanal.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="horasJornadaSemanal"
                className="text-sm md:text-base"
              >
                {t("fields.weeklyHours")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="horasJornadaSemanal"
                  type="number"
                  step="1"
                  className="pl-10 w-full"
                  placeholder="36"
                  {...register("horasJornadaSemanal", {
                    required: t("fields.hoursRequired"),
                    min: { value: 1, message: t("fields.minOneHour") },
                    max: { value: 80, message: t("fields.maxEightyHours") },
                    valueAsNumber: true,
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t("fields.weeklyHoursHint")}
              </p>
              {errors.horasJornadaSemanal && (
                <p className="text-sm font-medium text-red-500">
                  {errors.horasJornadaSemanal.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <Label
                htmlFor="factorHoraExtraDiurnas"
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <Sun className="h-4 w-4 text-yellow-500" />
                {t("fields.daytimeOTFactor")}
              </Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="factorHoraExtraDiurnas"
                  type="number"
                  step="0.1"
                  className="pl-10 w-full"
                  {...register("factorHoraExtraDiurnas", {
                    required: t("fields.daytimeOTRequired"),
                    min: { value: 1, message: t("fields.minOnePointZero") },
                    max: { value: 3, message: t("fields.maxThreePointZero") },
                    valueAsNumber: true,
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t("fields.daytimeOTHint")}
              </p>
              {errors.factorHoraExtraDiurnas && (
                <p className="text-sm font-medium text-red-500">
                  {errors.factorHoraExtraDiurnas.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="factorHoraExtraNocturnas"
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <Moon className="h-4 w-4 text-blue-500" />
                {t("fields.nighttimeOTFactor")}
              </Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="factorHoraExtraNocturnas"
                  type="number"
                  step="0.1"
                  className="pl-10 w-full"
                  {...register("factorHoraExtraNocturnas", {
                    required: t("fields.nighttimeOTRequired"),
                    min: { value: 1, message: t("fields.minOnePointZero") },
                    max: { value: 3, message: t("fields.maxThreePointZero") },
                    valueAsNumber: true,
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t("fields.nighttimeOTHint")}
              </p>
              {errors.factorHoraExtraNocturnas && (
                <p className="text-sm font-medium text-red-500">
                  {errors.factorHoraExtraNocturnas.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="factorHoraExtraFestivas"
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <Star className="h-4 w-4 text-purple-500" />
                {t("fields.holidayOTFactor")}
              </Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="factorHoraExtraFestivas"
                  type="number"
                  step="0.1"
                  className="pl-10 w-full"
                  {...register("factorHoraExtraFestivas", {
                    required: t("fields.holidayOTRequired"),
                    min: { value: 1, message: t("fields.minOnePointZero") },
                    max: { value: 3, message: t("fields.maxThreePointZero") },
                    valueAsNumber: true,
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t("fields.holidayOTHint")}
              </p>
              {errors.factorHoraExtraFestivas && (
                <p className="text-sm font-medium text-red-500">
                  {errors.factorHoraExtraFestivas.message as string}
                </p>
              )}
            </div>
          </div>

          {salarioDiario > 0 &&
            diasTrabajadosSemanal > 0 &&
            horasJornadaSemanal > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg overflow-x-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("summary.hoursPerDay")}
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {t("summary.hoursPerDayValue", {
                        hours: horasPorDia.toFixed(1),
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("summary.daysPerWeekSuffix", {
                        count: diasTrabajadosSemanal,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("summary.normalHourValue")}
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(valorHoraNormal, moneda)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("summary.perHour")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("summary.weeklySalary")}
                    </p>
                    <p className="text-xl font-bold text-purple-600">
                      {formatCurrency(salarioSemanal, moneda)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("summary.weeklySalaryDetail", {
                        count: diasTrabajadosSemanal,
                        amount: formatCurrency(salarioDiario, moneda),
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("summary.monthlySalary")}
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(salarioMensual, moneda)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("summary.monthlyBase")}
                    </p>
                  </div>
                </div>

                <div className="border-t mt-4 pt-4">
                  <p className="text-sm font-semibold mb-2">
                    {t("summary.overtimeValues")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-2 bg-white/50 dark:bg-black/20 rounded">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{t("summary.daytime")}</span>
                      </div>
                      <span className="font-semibold text-yellow-600">
                        {t("summary.perHourValue", {
                          amount: formatCurrency(valorHoraExtraDiurna, moneda),
                        })}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({factorHoraExtraDiurnas}x)
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-2 bg-white/50 dark:bg-black/20 rounded">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">
                          {t("summary.nighttime")}
                        </span>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {t("summary.perHourValue", {
                          amount: formatCurrency(
                            valorHoraExtraNocturna,
                            moneda,
                          ),
                        })}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({factorHoraExtraNocturnas}x)
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-2 bg-white/50 dark:bg-black/20 rounded">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">{t("summary.holiday")}</span>
                      </div>
                      <span className="font-semibold text-purple-600">
                        {t("summary.perHourValue", {
                          amount: formatCurrency(valorHoraExtraFestiva, moneda),
                        })}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({factorHoraExtraFestivas}x)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            {t("sections.bonuses")}
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size={isMobile ? "default" : "sm"}
            onClick={() =>
              appendBonificacion({ concepto: "", montoMensual: 0 })
            }
            className="gap-1 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" /> {t("buttons.add")}
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          {bonificacionesFields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {t("emptyStates.bonuses")}
            </p>
          ) : (
            <div className="space-y-3">
              {bonificacionesFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row gap-3 items-start"
                >
                  <div className="flex-1 w-full">
                    <Input
                      placeholder={t("placeholders.bonusConcept")}
                      {...register(`bonificacionesFijas.${index}.concepto`, {
                        required: t("validation.conceptRequired"),
                      })}
                    />
                  </div>
                  <div className="w-full sm:w-40">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        step="0.01"
                        className="pl-10 w-full"
                        placeholder={t("placeholders.monthlyAmount")}
                        {...register(
                          `bonificacionesFijas.${index}.montoMensual`,
                          {
                            required: t("validation.amountRequired"),
                            min: {
                              value: 0.01,
                              message: t("validation.amountMin"),
                            },
                            valueAsNumber: true,
                          },
                        )}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBonificacion(index)}
                    className="text-red-500 hover:text-red-700 w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            {t("sections.deductions")}
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size={isMobile ? "default" : "sm"}
            onClick={() => appendDeduccion({ concepto: "", montoMensual: 0 })}
            className="gap-1 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" /> {t("buttons.add")}
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          {deduccionesFields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {t("emptyStates.deductions")}
            </p>
          ) : (
            <div className="space-y-3">
              {deduccionesFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row gap-3 items-start"
                >
                  <div className="flex-1 w-full">
                    <Input
                      placeholder={t("placeholders.deductionConcept")}
                      {...register(`deduccionesFijas.${index}.concepto`, {
                        required: t("validation.conceptRequired"),
                      })}
                      className="w-full"
                    />
                  </div>
                  <div className="w-full sm:w-40">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        step="0.01"
                        className="pl-10 w-full"
                        placeholder={t("placeholders.monthlyAmount")}
                        {...register(`deduccionesFijas.${index}.montoMensual`, {
                          required: t("validation.amountRequired"),
                          min: {
                            value: 0.01,
                            message: t("validation.amountMin"),
                          },
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDeduccion(index)}
                    className="text-red-500 hover:text-red-700 w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {(bonificacionesFields.length > 0 ||
        deduccionesFields.length > 0 ||
        salarioMensual > 0) && (
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">
              {t("sections.monthlySummary")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-gray-600">
                  {t("summary.baseMonthlySalary")}
                </span>
                <span className="font-semibold">
                  {formatCurrency(salarioMensual, moneda)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-gray-500">
                <span>{t("summary.breakdown")}</span>
                <span>
                  {t("summary.breakdownDetail", {
                    daily: formatCurrency(salarioDiario, moneda),
                    days: diasTrabajadosSemanal,
                  })}
                </span>
              </div>
              {bonificacionesFields.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-green-600">
                  <span>{t("summary.totalBonuses")}</span>
                  <span className="font-semibold">
                    {formatCurrency(totalBonificaciones, moneda)}
                  </span>
                </div>
              )}
              {deduccionesFields.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-red-600">
                  <span>{t("summary.totalDeductions")}</span>
                  <span className="font-semibold">
                    {formatCurrency(totalDeducciones, moneda)}
                  </span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-lg font-bold">
                  <span>{t("summary.netMonthlyTotal")}</span>
                  <span className="text-blue-600">
                    {formatCurrency(totalNetoMensual, moneda)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="sticky bottom-0 bg-background border-t pt-4 pb-2 -mb-2 mt-6">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
            className="w-full sm:w-auto order-3 sm:order-1"
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isPending}
            className="w-full sm:w-auto order-2"
          >
            {t("buttons.clear")}
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto order-1 sm:order-3"
          >
            {isPending
              ? isEditing
                ? t("buttons.updating")
                : t("buttons.creating")
              : isEditing
                ? t("buttons.update")
                : t("buttons.create")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormConfigTrabajadores;
