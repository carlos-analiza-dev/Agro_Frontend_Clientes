import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { ingresarSanidad } from "@/api/sanidad-animal/accions/ingresar-sanidad";
import { CreateSanidadAnimal } from "@/api/sanidad-animal/interface/crear-sanidad.interface";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  AlertCircleIcon,
  ChevronDown,
  LucideProps,
  Search,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Sanidad } from "@/api/sanidad-animal/interface/response-sanidad-animal.interface";
import { editarSanidad } from "@/api/sanidad-animal/accions/editar-sanidad-animal";
import { formatDateToISOString } from "@/helpers/funciones/formatDateOnly";
import { useTranslations } from "next-intl";

interface Props {
  opciones_especie: {
    id: number;
    value: string;
    label: string;
    especies: string[];
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  }[];
  setOpenModal?: (open: boolean) => void;
  onSuccess?: () => void;
  especie_animal: string;
  sanidad?: Sanidad | null;
  borderColor?: string;
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
  hoverBgColor?: string;
  selectedBgColor?: string;
  selectedBorderColor?: string;
  selectedTextColor?: string;
  buttonBgColor?: string;
  buttonHoverColor?: string;
  tagBgColor?: string;
  tagTextColor?: string;
  tagBorderColor?: string;
}

const formatearFecha = (fecha: string | Date | undefined): string => {
  if (!fecha) return new Date().toISOString().split("T")[0];

  if (typeof fecha === "string") {
    return fecha.split("T")[0];
  }

  if (fecha instanceof Date) {
    return fecha.toISOString().split("T")[0];
  }

  return new Date().toISOString().split("T")[0];
};

const FormSanidad = ({
  opciones_especie,
  setOpenModal,
  onSuccess,
  especie_animal,
  sanidad = null,
  borderColor = "border-green-200",
  bgColor = "bg-green-50",
  textColor = "text-green-700",
  iconColor = "text-green-600",
  hoverBgColor = "hover:bg-green-50",
  selectedBgColor = "bg-green-50",
  selectedBorderColor = "border-green-500",
  selectedTextColor = "text-green-700",
  buttonBgColor = "bg-green-600",
  buttonHoverColor = "hover:bg-green-700",
  tagBgColor = "bg-green-100",
  tagTextColor = "text-green-700",
  tagBorderColor = "border-green-200",
}: Props) => {
  const t = useTranslations("FormSanidad");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedServiceData, setSelectedServiceData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: animales, isLoading: isLoadingAnimales } =
    useGetAnimalesPropietario();
  const queryClient = useQueryClient();

  const isEditing = !!sanidad;

  const animalesFiltrados = useMemo(() => {
    if (!animales) return [];
    if (!especie_animal) return animales;

    return animales.filter((animal) => {
      const especieAnimal = animal.especie?.nombre?.toLowerCase() || "";
      const especieBusqueda = especie_animal.toLowerCase();
      return especieAnimal === especieBusqueda;
    });
  }, [animales, especie_animal]);

  const resultadosBusqueda = useMemo(() => {
    if (!searchTerm.trim()) return animalesFiltrados;

    const term = searchTerm.toLowerCase().trim();
    return animalesFiltrados.filter((animal) => {
      const nombre = animal.nombre_animal?.toLowerCase() || "";
      const identificador = animal.identificador?.toLowerCase() || "";
      const galpon = animal.galpon?.toLowerCase() || "";
      const lote = animal.lote?.toLowerCase() || "";

      return (
        nombre.includes(term) ||
        identificador.includes(term) ||
        galpon.includes(term) ||
        lote.includes(term)
      );
    });
  }, [animalesFiltrados, searchTerm]);

  const { animalesIndividuales, lotesGalpones } = useMemo(() => {
    const individuales: Animal[] = [];
    const lotes: Animal[] = [];

    resultadosBusqueda.forEach((animal) => {
      if (animal.galpon || animal.lote || animal.cantidad_lote) {
        lotes.push(animal);
      } else {
        individuales.push(animal);
      }
    });

    return { animalesIndividuales: individuales, lotesGalpones: lotes };
  }, [resultadosBusqueda]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateSanidadAnimal>({
    defaultValues: {
      animalId: "",
      tipo_servicio: "",
      responsable: "",
      fecha_evento: new Date().toISOString().slice(0, 16),
      proxima_fecha_evento: null,
      observaciones: "",
      costo_base: 0,
      precio_referencia: 0,
      margen_referencia: 0,
      costo_real: 0,
      valor_estimado: 0,
      tratamiento_aplicado: "",
      motivo: "",
      vacuna_aplicada: "",
      via_aplicacion_vacuna: "",
      dosis_tratamiento: "",
      dosis: 0,
      tipo_desparasitacion: "",
      peso_usado: 0,
      prueba_evento: "",
      cuarto_afectado: "",
      dias_retiro_leche: 0,
      litros_diarios_actuales: 0,
      tipo_atencion: "",
      grado_cojera: "",
      miembro_afectado: "",
      potrero_corral_area: "",
      actividad: "",
      dias_descanso: "",
      producto_maquinaria_utilizada: "",
      carga_animal: 0,
      costo_producto_maquinaria: 0,
      peso_lana: 0,
      calidad_lana: "",
      color_lana: "",
      responsable_esquila: "",
      motivo_baño: "",
      tiempo_baño: 0,
      hallazgos_piel: "",
      procedimiento: "",
      hallazgos: "",
      tipo: "",
      herrador: "",
      tipo_lesion: "",
      zona_afectada: "",
      severidad: "",
      peso_estimado: 0,
      condicion_corporal: "",
      cambio_dieta: "",
      cantidad_bajas: 0,
      causa_baja_probable: "",
      accion_correctiva: "",
      tipo_accion: "",
      material_utilizado: "",
      cantidad_usada: 0,
      huevos_diarios: 0,
      huevos_rotos: 0,
      porcentaje_postura: 0,
      calidad_huevo: "",
      temperatura: 0,
      oxigeno: 0,
      ph: 0,
      amonio: 0,
      nitritos: 0,
      porcentaje_recambio: 0,
      volumen_estimado: 0,
      cantidad_muestreo: 0,
      peso_promedio: 0,
      talla_promedio: 0,
      biomasa_estimada: 0,
      etapa_peces: "",
      area_sifoneo: "",
      equipo_utilizado: "",
      horas_trabajo: 0,
    },
  });

  useEffect(() => {
    if (sanidad) {
      const servicio = opciones_especie.find(
        (op) => op.value === sanidad.tipo_servicio,
      );

      if (servicio) {
        setSelectedService(servicio.value);
        setSelectedServiceData(servicio);
        setValue("tipo_servicio", servicio.value);
      }

      if (sanidad.animal) {
        const animal = sanitizedAnimalData(sanidad.animal);
        setSelectedAnimal(animal);
        setValue("animalId", animal.id);
        setSearchTerm(
          animal.nombre_animal ||
            animal.identificador ||
            animal.galpon ||
            animal.lote ||
            "",
        );

        if (animal.cantidad_lote || animal.cantidad_inicial) {
          const cantidad = animal.cantidad_lote || animal.cantidad_inicial || 0;
          if (cantidad > 0) {
            setValue("carga_animal", cantidad);
          }
        }
      }

      setValue("responsable", sanidad.responsable || "");
      setValue("fecha_evento", formatearFecha(sanidad.fecha_evento));
      setValue(
        "proxima_fecha_evento",
        sanidad.proxima_fecha_evento
          ? formatearFecha(sanidad.proxima_fecha_evento)
          : null,
      );
      setValue("observaciones", sanidad.observaciones || "");
      setValue("costo_base", Number(sanidad.costo_base) || 0);
      setValue("precio_referencia", Number(sanidad.precio_referencia) || 0);
      setValue("costo_real", Number(sanidad.costo_real) || 0);
      setValue("valor_estimado", Number(sanidad.valor_estimado) || 0);
      setValue("tratamiento_aplicado", sanidad.tratamiento_aplicado || "");
      setValue("motivo", sanidad.motivo || "");

      loadSpecificFields(sanidad);
    } else {
      reset({
        ...reset,
        fecha_evento: new Date().toISOString().slice(0, 16),
      });
    }
    setIsLoading(false);
  }, [sanidad, opciones_especie, setValue, reset]);

  const sanitizedAnimalData = (animal: Animal): any => {
    return {
      id: animal.id || "",
      nombre_animal: animal.nombre_animal || "",
      identificador: animal.identificador || "",
      galpon: animal.galpon || "",
      lote: animal.lote || "",
      cantidad_lote: animal.cantidad_lote || 0,
      cantidad_inicial: animal.cantidad_inicial || 0,
      especie: animal.especie || { nombre: "" },
    };
  };

  const loadSpecificFields = (sanidad: Sanidad) => {
    const service = sanidad.tipo_servicio;

    switch (service) {
      case "Vacunacion":
        setValue("vacuna_aplicada", sanidad.vacuna_aplicada || "");
        setValue("via_aplicacion_vacuna", sanidad.via_aplicacion_vacuna || "");
        setValue("dosis", Number(sanidad.dosis) || 0);
        setValue("dosis_tratamiento", sanidad.dosis_tratamiento || "");
        break;

      case "Desparasitacion":
        setValue("tipo_desparasitacion", sanidad.tipo_desparasitacion || "");
        setValue("peso_usado", Number(sanidad.peso_usado) || 0);
        break;

      case "RevisionUbre":
        setValue("prueba_evento", sanidad.prueba_evento || "");
        setValue("cuarto_afectado", sanidad.cuarto_afectado || "");
        setValue("dias_retiro_leche", sanidad.dias_retiro_leche || 0);
        setValue(
          "litros_diarios_actuales",
          Number(sanidad.litros_diarios_actuales) || 0,
        );
        break;

      case "AtencionPezunas":
        setValue("tipo_atencion", sanidad.tipo_atencion || "");
        setValue("grado_cojera", sanidad.grado_cojera || "");
        setValue("miembro_afectado", sanidad.miembro_afectado || "");
        break;

      case "LimpiezaCorral":
      case "LimpiezaGalpon":
        setValue("potrero_corral_area", sanidad.potrero_corral_area || "");
        setValue("actividad", sanidad.actividad || "");
        setValue("dias_descanso", sanidad.dias_descanso || "");
        setValue(
          "producto_maquinaria_utilizada",
          sanidad.producto_maquinaria_utilizada || "",
        );
        setValue("carga_animal", Number(sanidad.carga_animal) || 0);
        setValue(
          "costo_producto_maquinaria",
          Number(sanidad.costo_producto_maquinaria) || 0,
        );
        break;

      case "Esquila":
        setValue("peso_lana", Number(sanidad.peso_lana) || 0);
        setValue("calidad_lana", sanidad.calidad_lana || "");
        setValue("color_lana", sanidad.color_lana || "");
        setValue("responsable_esquila", sanidad.responsable_esquila || "");
        break;

      case "BanoSanitario":
        setValue("motivo_baño", sanidad.motivo_baño || "");
        setValue("tiempo_baño", sanidad.tiempo_baño || 0);
        setValue("hallazgos_piel", sanidad.hallazgos_piel || "");
        break;

      case "Odontologia":
        setValue("procedimiento", sanidad.procedimiento || "");
        setValue("hallazgos", sanidad.hallazgos || "");
        break;

      case "AtencionCascos":
        setValue("tipo", sanidad.tipo || "");
        setValue("herrador", sanidad.herrador || "");
        break;

      case "RevisionLesiones":
        setValue("tipo_lesion", sanidad.tipo_lesion || "");
        setValue("zona_afectada", sanidad.zona_afectada || "");
        setValue("severidad", sanidad.severidad || "");
        break;

      case "EvaluacionCondicionCorporal":
        setValue("peso_estimado", Number(sanidad.peso_estimado) || 0);
        setValue("condicion_corporal", sanidad.condicion_corporal || "");
        setValue("cambio_dieta", sanidad.cambio_dieta || "");
        break;

      case "ControlMortalidad":
        setValue("cantidad_bajas", sanidad.cantidad_bajas || 0);
        setValue("causa_baja_probable", sanidad.causa_baja_probable || "");
        setValue("accion_correctiva", sanidad.accion_correctiva || "");
        break;

      case "CambioCamaNido":
        setValue("tipo_accion", sanidad.tipo_accion || "");
        setValue("material_utilizado", sanidad.material_utilizado || "");
        setValue("cantidad_usada", Number(sanidad.cantidad_usada) || 0);
        break;

      case "ControlProduccion":
        setValue("huevos_diarios", sanidad.huevos_diarios || 0);
        setValue("huevos_rotos", sanidad.huevos_rotos || 0);
        setValue("porcentaje_postura", sanidad.porcentaje_postura || 0);
        setValue("calidad_huevo", sanidad.calidad_huevo || "");
        break;

      case "ControlCalidadAgua":
        setValue("temperatura", Number(sanidad.temperatura) || 0);
        setValue("oxigeno", Number(sanidad.oxigeno) || 0);
        setValue("ph", Number(sanidad.ph) || 0);
        setValue("amonio", Number(sanidad.amonio) || 0);
        setValue("nitritos", Number(sanidad.nitritos) || 0);
        break;

      case "RecambioAgua":
        setValue("porcentaje_recambio", sanidad.porcentaje_recambio || 0);
        setValue("volumen_estimado", Number(sanidad.volumen_estimado) || 0);
        break;

      case "MuestreoBiometrico":
        setValue("cantidad_muestreo", Number(sanidad.cantidad_muestreo) || 0);
        setValue("peso_promedio", Number(sanidad.peso_promedio) || 0);
        setValue("talla_promedio", Number(sanidad.talla_promedio) || 0);
        setValue("biomasa_estimada", Number(sanidad.biomasa_estimada) || 0);
        setValue("etapa_peces", sanidad.etapa_peces || "");
        break;

      case "Sifoneo":
        setValue("area_sifoneo", sanidad.area_sifoneo || "");
        setValue("equipo_utilizado", sanidad.equipo_utilizado || "");
        setValue("horas_trabajo", Number(sanidad.horas_trabajo) || 0);
        break;

      default:
        break;
    }
  };

  const mutation = useMutation({
    mutationFn: (data: CreateSanidadAnimal) => {
      if (isEditing && sanidad) {
        return editarSanidad(sanidad.id, data);
      }
      return ingresarSanidad(data);
    },
    onSuccess: () => {
      toast.success(
        isEditing ? t("messages.updateSuccess") : t("messages.createSuccess"),
      );
      queryClient.invalidateQueries({ queryKey: ["sanidad-animal"] });
      queryClient.invalidateQueries({ queryKey: ["costos-mensuales-sanidad"] });
      queryClient.invalidateQueries({ queryKey: ["sanidad-eliminados"] });
      queryClient.invalidateQueries({ queryKey: ["sanidad-cambios"] });
      reset();
      setSelectedService("");
      setSelectedServiceData(null);
      setErrorMessage("");
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.genericError");
        setErrorMessage(errorMessage);
      } else {
        toast.error(t("messages.unexpectedError"));
      }
    },
  });

  const onSubmit = async (data: CreateSanidadAnimal) => {
    try {
      const dataToSend = {
        ...data,
        fecha_evento: formatDateToISOString(data.fecha_evento as string),
        proxima_fecha_evento: data.proxima_fecha_evento
          ? formatDateToISOString(data.proxima_fecha_evento as string)
          : null,
      };

      dataToSend.tipo_servicio = selectedService;
      mutation.mutate(dataToSend as CreateSanidadAnimal);
    } catch (error) {
      toast.error(t("messages.submitError"));
    }
  };

  const handleSelectAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setValue("animalId", animal.id);
    setSearchTerm(
      animal.nombre_animal ||
        animal.identificador ||
        animal.galpon ||
        animal.lote ||
        "",
    );
    setIsDropdownOpen(false);

    if (animal.cantidad_lote || animal.cantidad_inicial) {
      const cantidad = animal.cantidad_lote || animal.cantidad_inicial || 0;
      if (cantidad > 0) {
        setValue("carga_animal", cantidad);
      }
    }
  };

  const clearSelection = () => {
    setSelectedAnimal(null);
    setValue("animalId", "");
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const getAnimalDisplayInfo = (animal: Animal) => {
    const nombre = animal.nombre_animal || t("animalSearch.noName");
    const identificador = animal.identificador
      ? `#${animal.identificador}`
      : "";
    const galpon = animal.galpon
      ? t("animalSearch.shed", { value: animal.galpon })
      : "";
    const lote = animal.lote
      ? t("animalSearch.batch", { value: animal.lote })
      : "";
    const cantidad = animal.cantidad_lote
      ? t("animalSearch.animalsCount", { count: animal.cantidad_lote })
      : "";

    return { nombre, identificador, galpon, lote, cantidad };
  };

  const renderDynamicFields = () => {
    if (!selectedServiceData) return null;

    const serviceValue = selectedServiceData.value;

    switch (serviceValue) {
      case "Vacunacion":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="vacuna_aplicada">
                {t("services.vacunacion.vaccineApplied")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="vacuna_aplicada"
                {...register("vacuna_aplicada", {
                  required: t("services.vacunacion.vaccineRequired"),
                })}
                placeholder={t("services.vacunacion.vaccinePlaceholder")}
                className={errors.vacuna_aplicada ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.vacuna_aplicada && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.vacuna_aplicada.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="via_aplicacion_vacuna">
                {t("services.vacunacion.applicationRoute")}
              </Label>
              <Select
                value={watch("via_aplicacion_vacuna") || ""}
                onValueChange={(value) =>
                  setValue("via_aplicacion_vacuna", value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.vacunacion.routePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.vacunacion.routesGroup")}
                    </SelectLabel>
                    <SelectItem value="intramuscular">
                      {t("services.vacunacion.routes.intramuscular")}
                    </SelectItem>
                    <SelectItem value="subcutanea">
                      {t("services.vacunacion.routes.subcutaneous")}
                    </SelectItem>
                    <SelectItem value="intradermica">
                      {t("services.vacunacion.routes.intradermal")}
                    </SelectItem>
                    <SelectItem value="oral">
                      {t("services.vacunacion.routes.oral")}
                    </SelectItem>
                    <SelectItem value="nasal">
                      {t("services.vacunacion.routes.nasal")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dosis">{t("services.vacunacion.dose")}</Label>
              <Input
                id="dosis"
                type="number"
                step="0.1"
                {...register("dosis", { valueAsNumber: true })}
                placeholder={t("services.vacunacion.dosePlaceholder")}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="dosis_tratamiento">
                {t("services.vacunacion.doseTreatment")}
              </Label>
              <Input
                id="dosis_tratamiento"
                {...register("dosis_tratamiento")}
                placeholder={t("services.vacunacion.doseTreatmentPlaceholder")}
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "Desparasitacion":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo_desparasitacion">
                {t("services.desparasitacion.type")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("tipo_desparasitacion") || ""}
                onValueChange={(value) =>
                  setValue("tipo_desparasitacion", value)
                }
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.desparasitacion.typePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.desparasitacion.typesGroup")}
                    </SelectLabel>
                    <SelectItem value="interna">
                      {t("services.desparasitacion.types.internal")}
                    </SelectItem>
                    <SelectItem value="externa">
                      {t("services.desparasitacion.types.external")}
                    </SelectItem>
                    <SelectItem value="mixta">
                      {t("services.desparasitacion.types.mixed")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.tipo_desparasitacion && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tipo_desparasitacion.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="peso_usado">
                {t("services.desparasitacion.weightUsed")}
              </Label>
              <Input
                id="peso_usado"
                type="number"
                step="0.1"
                {...register("peso_usado", { valueAsNumber: true })}
                placeholder={t("services.desparasitacion.weightPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        );

      case "RevisionUbre":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="prueba_evento">
                {t("services.revisionUbre.testEvent")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("prueba_evento") || ""}
                onValueChange={(value) => setValue("prueba_evento", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.revisionUbre.testPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.revisionUbre.testsGroup")}
                    </SelectLabel>
                    <SelectItem value="california">
                      {t("services.revisionUbre.tests.california")}
                    </SelectItem>
                    <SelectItem value="conteo_celulas">
                      {t("services.revisionUbre.tests.cellCount")}
                    </SelectItem>
                    <SelectItem value="inspeccion_visual">
                      {t("services.revisionUbre.tests.visualInspection")}
                    </SelectItem>
                    <SelectItem value="cultivo">
                      {t("services.revisionUbre.tests.culture")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.prueba_evento && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.prueba_evento.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cuarto_afectado">
                {t("services.revisionUbre.affectedQuarter")}
              </Label>
              <Select
                value={watch("cuarto_afectado") || ""}
                onValueChange={(value) => setValue("cuarto_afectado", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.revisionUbre.quarterPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.revisionUbre.quartersGroup")}
                    </SelectLabel>
                    <SelectItem value="anterior_izquierdo">
                      {t("services.revisionUbre.quarters.frontLeft")}
                    </SelectItem>
                    <SelectItem value="anterior_derecho">
                      {t("services.revisionUbre.quarters.frontRight")}
                    </SelectItem>
                    <SelectItem value="posterior_izquierdo">
                      {t("services.revisionUbre.quarters.rearLeft")}
                    </SelectItem>
                    <SelectItem value="posterior_derecho">
                      {t("services.revisionUbre.quarters.rearRight")}
                    </SelectItem>
                    <SelectItem value="multiple">
                      {t("services.revisionUbre.quarters.multiple")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dias_retiro_leche">
                {t("services.revisionUbre.milkWithdrawalDays")}
              </Label>
              <Input
                id="dias_retiro_leche"
                type="number"
                {...register("dias_retiro_leche", { valueAsNumber: true })}
                placeholder={t(
                  "services.revisionUbre.milkWithdrawalPlaceholder",
                )}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="litros_diarios_actuales">
                {t("services.revisionUbre.currentDailyLiters")}
              </Label>
              <Input
                id="litros_diarios_actuales"
                type="number"
                step="0.1"
                {...register("litros_diarios_actuales", {
                  valueAsNumber: true,
                })}
                placeholder={t("services.revisionUbre.litersPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        );

      case "AtencionPezunas":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo_atencion">
                {t("services.atencionPezunas.attentionType")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("tipo_atencion") || ""}
                onValueChange={(value) => setValue("tipo_atencion", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.atencionPezunas.typePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.atencionPezunas.typesGroup")}
                    </SelectLabel>
                    <SelectItem value="recorte">
                      {t("services.atencionPezunas.types.trimming")}
                    </SelectItem>
                    <SelectItem value="tratamiento">
                      {t("services.atencionPezunas.types.treatment")}
                    </SelectItem>
                    <SelectItem value="preventivo">
                      {t("services.atencionPezunas.types.preventive")}
                    </SelectItem>
                    <SelectItem value="emergencia">
                      {t("services.atencionPezunas.types.emergency")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.tipo_atencion && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tipo_atencion.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="grado_cojera">
                {t("services.atencionPezunas.lamenessGrade")}
              </Label>
              <Select
                value={watch("grado_cojera") || ""}
                onValueChange={(value) => setValue("grado_cojera", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.atencionPezunas.gradePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.atencionPezunas.gradesGroup")}
                    </SelectLabel>
                    <SelectItem value="leve">
                      {t("services.atencionPezunas.grades.mild")}
                    </SelectItem>
                    <SelectItem value="moderado">
                      {t("services.atencionPezunas.grades.moderate")}
                    </SelectItem>
                    <SelectItem value="severo">
                      {t("services.atencionPezunas.grades.severe")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="miembro_afectado">
                {t("services.atencionPezunas.affectedLimb")}
              </Label>
              <Select
                value={watch("miembro_afectado") || ""}
                onValueChange={(value) => setValue("miembro_afectado", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.atencionPezunas.limbPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.atencionPezunas.limbsGroup")}
                    </SelectLabel>
                    <SelectItem value="anterior_izquierdo">
                      {t("services.atencionPezunas.limbs.frontLeft")}
                    </SelectItem>
                    <SelectItem value="anterior_derecho">
                      {t("services.atencionPezunas.limbs.frontRight")}
                    </SelectItem>
                    <SelectItem value="posterior_izquierdo">
                      {t("services.atencionPezunas.limbs.rearLeft")}
                    </SelectItem>
                    <SelectItem value="posterior_derecho">
                      {t("services.atencionPezunas.limbs.rearRight")}
                    </SelectItem>
                    <SelectItem value="multiple">
                      {t("services.atencionPezunas.limbs.multiple")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "LimpiezaCorral":
      case "LimpiezaGalpon":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="potrero_corral_area">
                {t("services.limpieza.area")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="potrero_corral_area"
                {...register("potrero_corral_area", {
                  required: t("services.limpieza.areaRequired"),
                })}
                placeholder={t("services.limpieza.areaPlaceholder")}
                className={errors.potrero_corral_area ? "border-red-500" : ""}
                disabled={mutation.isPending}
              />
              {errors.potrero_corral_area && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.potrero_corral_area.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="actividad">
                {t("services.limpieza.activity")}
              </Label>
              <Input
                id="actividad"
                {...register("actividad")}
                placeholder={t("services.limpieza.activityPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="dias_descanso">
                {t("services.limpieza.restDays")}
              </Label>
              <Input
                id="dias_descanso"
                {...register("dias_descanso")}
                placeholder={t("services.limpieza.restDaysPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="producto_maquinaria_utilizada">
                {t("services.limpieza.productMachine")}
              </Label>
              <Input
                id="producto_maquinaria_utilizada"
                {...register("producto_maquinaria_utilizada")}
                placeholder={t("services.limpieza.productPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="carga_animal">
                {t("services.limpieza.animalLoad")}
              </Label>
              <Input
                id="carga_animal"
                type="number"
                {...register("carga_animal", { valueAsNumber: true })}
                placeholder={t("services.limpieza.animalLoadPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="costo_producto_maquinaria">
                {t("services.limpieza.productCost")}
              </Label>
              <Input
                id="costo_producto_maquinaria"
                type="number"
                step="0.01"
                {...register("costo_producto_maquinaria", {
                  valueAsNumber: true,
                })}
                placeholder={t("services.limpieza.productCostPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        );

      case "Esquila":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="peso_lana">
                {t("services.esquila.woolWeight")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="peso_lana"
                type="number"
                step="0.1"
                {...register("peso_lana", {
                  required: t("services.esquila.woolWeightRequired"),
                  valueAsNumber: true,
                })}
                placeholder={t("services.esquila.woolWeightPlaceholder")}
                className={errors.peso_lana ? "border-red-500" : ""}
                disabled={mutation.isPending}
              />
              {errors.peso_lana && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.peso_lana.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="calidad_lana">
                {t("services.esquila.woolQuality")}
              </Label>
              <Select
                value={watch("calidad_lana") || ""}
                onValueChange={(value) => setValue("calidad_lana", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.esquila.qualityPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.esquila.qualitiesGroup")}
                    </SelectLabel>
                    <SelectItem value="fina">
                      {t("services.esquila.qualities.fine")}
                    </SelectItem>
                    <SelectItem value="media">
                      {t("services.esquila.qualities.medium")}
                    </SelectItem>
                    <SelectItem value="gruesa">
                      {t("services.esquila.qualities.thick")}
                    </SelectItem>
                    <SelectItem value="mixta">
                      {t("services.esquila.qualities.mixed")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color_lana">
                {t("services.esquila.woolColor")}
              </Label>
              <Input
                id="color_lana"
                {...register("color_lana")}
                placeholder={t("services.esquila.woolColorPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="responsable_esquila">
                {t("services.esquila.shearer")}
              </Label>
              <Input
                id="responsable_esquila"
                {...register("responsable_esquila")}
                placeholder={t("services.esquila.shearerPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        );

      case "BanoSanitario":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="motivo_baño">
                {t("services.banoSanitario.reason")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("motivo_baño") || ""}
                onValueChange={(value) => setValue("motivo_baño", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.banoSanitario.reasonPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.banoSanitario.reasonsGroup")}
                    </SelectLabel>
                    <SelectItem value="parasitos_externos">
                      {t("services.banoSanitario.reasons.externalParasites")}
                    </SelectItem>
                    <SelectItem value="preventivo">
                      {t("services.banoSanitario.reasons.preventive")}
                    </SelectItem>
                    <SelectItem value="tratamiento">
                      {t("services.banoSanitario.reasons.treatment")}
                    </SelectItem>
                    <SelectItem value="sanitario">
                      {t("services.banoSanitario.reasons.sanitary")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.motivo_baño && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.motivo_baño.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="tiempo_baño">
                {t("services.banoSanitario.bathTime")}
              </Label>
              <Input
                id="tiempo_baño"
                type="number"
                {...register("tiempo_baño", { valueAsNumber: true })}
                placeholder={t("services.banoSanitario.bathTimePlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="hallazgos_piel">
                {t("services.banoSanitario.skinFindings")}
              </Label>
              <Input
                id="hallazgos_piel"
                {...register("hallazgos_piel")}
                placeholder={t(
                  "services.banoSanitario.skinFindingsPlaceholder",
                )}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        );

      case "Odontologia":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="procedimiento">
                {t("services.odontologia.procedure")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("procedimiento") || ""}
                onValueChange={(value) => setValue("procedimiento", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.odontologia.procedurePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.odontologia.proceduresGroup")}
                    </SelectLabel>
                    <SelectItem value="raspado">
                      {t("services.odontologia.procedures.scaling")}
                    </SelectItem>
                    <SelectItem value="extraccion">
                      {t("services.odontologia.procedures.extraction")}
                    </SelectItem>
                    <SelectItem value="limpieza">
                      {t("services.odontologia.procedures.deepCleaning")}
                    </SelectItem>
                    <SelectItem value="examen">
                      {t("services.odontologia.procedures.oralExam")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.procedimiento && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.procedimiento.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="hallazgos">
                {t("services.odontologia.findings")}
              </Label>
              <Input
                id="hallazgos"
                {...register("hallazgos")}
                placeholder={t("services.odontologia.findingsPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        );

      case "AtencionCascos":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo">
                {t("services.atencionCascos.type")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("tipo") || ""}
                onValueChange={(value) => setValue("tipo", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.atencionCascos.typePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.atencionCascos.typesGroup")}
                    </SelectLabel>
                    <SelectItem value="recorte">
                      {t("services.atencionCascos.types.trimming")}
                    </SelectItem>
                    <SelectItem value="herrado">
                      {t("services.atencionCascos.types.shoeing")}
                    </SelectItem>
                    <SelectItem value="tratamiento">
                      {t("services.atencionCascos.types.treatment")}
                    </SelectItem>
                    <SelectItem value="preventivo">
                      {t("services.atencionCascos.types.preventive")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.tipo && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tipo.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="herrador">
                {t("services.atencionCascos.farrier")}
              </Label>
              <Input
                id="herrador"
                {...register("herrador")}
                placeholder={t("services.atencionCascos.farrierPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        );

      case "RevisionLesiones":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo_lesion">
                {t("services.revisionLesiones.injuryType")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("tipo_lesion") || ""}
                onValueChange={(value) => setValue("tipo_lesion", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.revisionLesiones.typePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.revisionLesiones.typesGroup")}
                    </SelectLabel>
                    <SelectItem value="herida_abierta">
                      {t("services.revisionLesiones.types.openWound")}
                    </SelectItem>
                    <SelectItem value="contusion">
                      {t("services.revisionLesiones.types.contusion")}
                    </SelectItem>
                    <SelectItem value="fractura">
                      {t("services.revisionLesiones.types.fracture")}
                    </SelectItem>
                    <SelectItem value="infeccion">
                      {t("services.revisionLesiones.types.infection")}
                    </SelectItem>
                    <SelectItem value="quemadura">
                      {t("services.revisionLesiones.types.burn")}
                    </SelectItem>
                    <SelectItem value="otro">
                      {t("services.revisionLesiones.types.other")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.tipo_lesion && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tipo_lesion.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="zona_afectada">
                {t("services.revisionLesiones.affectedArea")}
              </Label>
              <Input
                id="zona_afectada"
                {...register("zona_afectada")}
                placeholder={t("services.revisionLesiones.areaPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="severidad">
                {t("services.revisionLesiones.severity")}
              </Label>
              <Select
                value={watch("severidad") || ""}
                onValueChange={(value) => setValue("severidad", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "services.revisionLesiones.severityPlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.revisionLesiones.severitiesGroup")}
                    </SelectLabel>
                    <SelectItem value="leve">
                      {t("services.revisionLesiones.severities.mild")}
                    </SelectItem>
                    <SelectItem value="moderado">
                      {t("services.revisionLesiones.severities.moderate")}
                    </SelectItem>
                    <SelectItem value="grave">
                      {t("services.revisionLesiones.severities.severe")}
                    </SelectItem>
                    <SelectItem value="critico">
                      {t("services.revisionLesiones.severities.critical")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "EvaluacionCondicionCorporal":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="peso_estimado">
                {t("services.evaluacionCondicionCorporal.estimatedWeight")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="peso_estimado"
                type="number"
                step="0.1"
                {...register("peso_estimado", {
                  required: t(
                    "services.evaluacionCondicionCorporal.weightRequired",
                  ),
                  valueAsNumber: true,
                })}
                placeholder={t(
                  "services.evaluacionCondicionCorporal.weightPlaceholder",
                )}
                className={errors.peso_estimado ? "border-red-500" : ""}
                disabled={mutation.isPending}
              />
              {errors.peso_estimado && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.peso_estimado.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="condicion_corporal">
                {t("services.evaluacionCondicionCorporal.bodyCondition")}
              </Label>
              <Select
                value={watch("condicion_corporal") || ""}
                onValueChange={(value) => setValue("condicion_corporal", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "services.evaluacionCondicionCorporal.conditionPlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t(
                        "services.evaluacionCondicionCorporal.conditionsGroup",
                      )}
                    </SelectLabel>
                    <SelectItem value="1">
                      {t(
                        "services.evaluacionCondicionCorporal.conditions.veryThin",
                      )}
                    </SelectItem>
                    <SelectItem value="2">
                      {t(
                        "services.evaluacionCondicionCorporal.conditions.thin",
                      )}
                    </SelectItem>
                    <SelectItem value="3">
                      {t(
                        "services.evaluacionCondicionCorporal.conditions.normal",
                      )}
                    </SelectItem>
                    <SelectItem value="4">
                      {t(
                        "services.evaluacionCondicionCorporal.conditions.overweight",
                      )}
                    </SelectItem>
                    <SelectItem value="5">
                      {t(
                        "services.evaluacionCondicionCorporal.conditions.obese",
                      )}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cambio_dieta">
                {t("services.evaluacionCondicionCorporal.dietChange")}
              </Label>
              <Input
                id="cambio_dieta"
                {...register("cambio_dieta")}
                placeholder={t(
                  "services.evaluacionCondicionCorporal.dietPlaceholder",
                )}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        );

      case "ControlMortalidad":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cantidad_bajas">
                {t("services.controlMortalidad.lossCount")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cantidad_bajas"
                type="number"
                {...register("cantidad_bajas", {
                  required: t("services.controlMortalidad.countRequired"),
                  valueAsNumber: true,
                })}
                placeholder={t("services.controlMortalidad.countPlaceholder")}
                className={errors.cantidad_bajas ? "border-red-500" : ""}
                disabled={mutation.isPending}
              />
              {errors.cantidad_bajas && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cantidad_bajas.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="causa_baja_probable">
                {t("services.controlMortalidad.probableCause")}
              </Label>
              <Input
                id="causa_baja_probable"
                {...register("causa_baja_probable")}
                placeholder={t("services.controlMortalidad.causePlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="accion_correctiva">
                {t("services.controlMortalidad.correctiveAction")}
              </Label>
              <Input
                id="accion_correctiva"
                {...register("accion_correctiva")}
                placeholder={t("services.controlMortalidad.actionPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        );

      case "CambioCamaNido":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo_accion">
                {t("services.cambioCamaNido.actionType")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("tipo_accion") || ""}
                onValueChange={(value) => setValue("tipo_accion", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.cambioCamaNido.actionPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.cambioCamaNido.actionsGroup")}
                    </SelectLabel>
                    <SelectItem value="cambio_parcial">
                      {t("services.cambioCamaNido.actions.partial")}
                    </SelectItem>
                    <SelectItem value="cambio_total">
                      {t("services.cambioCamaNido.actions.total")}
                    </SelectItem>
                    <SelectItem value="limpieza">
                      {t("services.cambioCamaNido.actions.cleaning")}
                    </SelectItem>
                    <SelectItem value="desinfeccion">
                      {t("services.cambioCamaNido.actions.disinfection")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.tipo_accion && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tipo_accion.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="material_utilizado">
                {t("services.cambioCamaNido.materialUsed")}
              </Label>
              <Input
                id="material_utilizado"
                {...register("material_utilizado")}
                placeholder={t("services.cambioCamaNido.materialPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="cantidad_usada">
                {t("services.cambioCamaNido.quantityUsed")}
              </Label>
              <Input
                id="cantidad_usada"
                type="number"
                step="0.1"
                {...register("cantidad_usada", { valueAsNumber: true })}
                placeholder={t("services.cambioCamaNido.quantityPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        );

      case "ControlProduccion":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="huevos_diarios">
                {t("services.controlProduccion.dailyEggs")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="huevos_diarios"
                type="number"
                {...register("huevos_diarios", {
                  required: t("services.controlProduccion.eggsRequired"),
                  valueAsNumber: true,
                })}
                placeholder={t("services.controlProduccion.eggsPlaceholder")}
                className={errors.huevos_diarios ? "border-red-500" : ""}
                disabled={mutation.isPending}
              />
              {errors.huevos_diarios && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.huevos_diarios.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="huevos_rotos">
                {t("services.controlProduccion.brokenEggs")}
              </Label>
              <Input
                id="huevos_rotos"
                type="number"
                {...register("huevos_rotos", { valueAsNumber: true })}
                placeholder={t(
                  "services.controlProduccion.brokenEggsPlaceholder",
                )}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="porcentaje_postura">
                {t("services.controlProduccion.layingPercentage")}
              </Label>
              <Input
                id="porcentaje_postura"
                type="number"
                step="0.1"
                {...register("porcentaje_postura", { valueAsNumber: true })}
                placeholder={t(
                  "services.controlProduccion.percentagePlaceholder",
                )}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="calidad_huevo">
                {t("services.controlProduccion.eggQuality")}
              </Label>
              <Select
                value={watch("calidad_huevo") || ""}
                onValueChange={(value) => setValue("calidad_huevo", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "services.controlProduccion.qualityPlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.controlProduccion.qualitiesGroup")}
                    </SelectLabel>
                    <SelectItem value="extra">
                      {t("services.controlProduccion.qualities.extra")}
                    </SelectItem>
                    <SelectItem value="primera">
                      {t("services.controlProduccion.qualities.first")}
                    </SelectItem>
                    <SelectItem value="segunda">
                      {t("services.controlProduccion.qualities.second")}
                    </SelectItem>
                    <SelectItem value="tercera">
                      {t("services.controlProduccion.qualities.third")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "ControlCalidadAgua":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="temperatura">
                {t("services.controlCalidadAgua.temperature")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                {...register("temperatura", {
                  required: t(
                    "services.controlCalidadAgua.temperatureRequired",
                  ),
                  valueAsNumber: true,
                })}
                placeholder={t(
                  "services.controlCalidadAgua.temperaturePlaceholder",
                )}
                className={errors.temperatura ? "border-red-500" : ""}
                disabled={mutation.isPending}
              />
              {errors.temperatura && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.temperatura.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="oxigeno">
                {t("services.controlCalidadAgua.oxygen")}
              </Label>
              <Input
                id="oxigeno"
                type="number"
                step="0.1"
                {...register("oxigeno", { valueAsNumber: true })}
                placeholder={t("services.controlCalidadAgua.oxygenPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="ph">{t("services.controlCalidadAgua.ph")}</Label>
              <Input
                id="ph"
                type="number"
                step="0.1"
                {...register("ph", { valueAsNumber: true })}
                placeholder={t("services.controlCalidadAgua.phPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="amonio">
                {t("services.controlCalidadAgua.ammonia")}
              </Label>
              <Input
                id="amonio"
                type="number"
                step="0.1"
                {...register("amonio", { valueAsNumber: true })}
                placeholder={t(
                  "services.controlCalidadAgua.ammoniaPlaceholder",
                )}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="nitritos">
                {t("services.controlCalidadAgua.nitrites")}
              </Label>
              <Input
                id="nitritos"
                type="number"
                step="0.1"
                {...register("nitritos", { valueAsNumber: true })}
                placeholder={t(
                  "services.controlCalidadAgua.nitritesPlaceholder",
                )}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        );

      case "RecambioAgua":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="porcentaje_recambio">
                {t("services.recambioAgua.exchangePercentage")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="porcentaje_recambio"
                type="number"
                step="1"
                {...register("porcentaje_recambio", {
                  required: t("services.recambioAgua.percentageRequired"),
                  valueAsNumber: true,
                })}
                placeholder={t("services.recambioAgua.percentagePlaceholder")}
                className={errors.porcentaje_recambio ? "border-red-500" : ""}
                disabled={mutation.isPending}
              />
              {errors.porcentaje_recambio && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.porcentaje_recambio.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="volumen_estimado">
                {t("services.recambioAgua.estimatedVolume")}
              </Label>
              <Input
                id="volumen_estimado"
                type="number"
                step="0.1"
                {...register("volumen_estimado", { valueAsNumber: true })}
                placeholder={t("services.recambioAgua.volumePlaceholder")}
                disabled={mutation.isPending}
              />
            </div>
          </div>
        );

      case "MuestreoBiometrico":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cantidad_muestreo">
                {t("services.muestreoBiometrico.sampleCount")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cantidad_muestreo"
                type="number"
                {...register("cantidad_muestreo", {
                  required: t("services.muestreoBiometrico.countRequired"),
                  valueAsNumber: true,
                })}
                placeholder={t("services.muestreoBiometrico.countPlaceholder")}
                className={errors.cantidad_muestreo ? "border-red-500" : ""}
                disabled={mutation.isPending}
              />
              {errors.cantidad_muestreo && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cantidad_muestreo.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="peso_promedio">
                {t("services.muestreoBiometrico.averageWeight")}
              </Label>
              <Input
                id="peso_promedio"
                type="number"
                step="0.1"
                {...register("peso_promedio", { valueAsNumber: true })}
                placeholder={t("services.muestreoBiometrico.weightPlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="talla_promedio">
                {t("services.muestreoBiometrico.averageSize")}
              </Label>
              <Input
                id="talla_promedio"
                type="number"
                step="0.1"
                {...register("talla_promedio", { valueAsNumber: true })}
                placeholder={t("services.muestreoBiometrico.sizePlaceholder")}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="biomasa_estimada">
                {t("services.muestreoBiometrico.estimatedBiomass")}
              </Label>
              <Input
                id="biomasa_estimada"
                type="number"
                step="0.1"
                {...register("biomasa_estimada", { valueAsNumber: true })}
                placeholder={t(
                  "services.muestreoBiometrico.biomassPlaceholder",
                )}
                disabled={mutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="etapa_peces">
                {t("services.muestreoBiometrico.fishStage")}
              </Label>
              <Select
                value={watch("etapa_peces") || ""}
                onValueChange={(value) => setValue("etapa_peces", value)}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "services.muestreoBiometrico.stagePlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.muestreoBiometrico.stagesGroup")}
                    </SelectLabel>
                    <SelectItem value="alevino">
                      {t("services.muestreoBiometrico.stages.fry")}
                    </SelectItem>
                    <SelectItem value="juvenil">
                      {t("services.muestreoBiometrico.stages.juvenile")}
                    </SelectItem>
                    <SelectItem value="adulto">
                      {t("services.muestreoBiometrico.stages.adult")}
                    </SelectItem>
                    <SelectItem value="reproductor">
                      {t("services.muestreoBiometrico.stages.breeder")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "Sifoneo":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="area_sifoneo">
                {t("services.sifoneo.siphonedArea")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="area_sifoneo"
                {...register("area_sifoneo", {
                  required: t("services.sifoneo.areaRequired"),
                })}
                placeholder={t("services.sifoneo.areaPlaceholder")}
                className={errors.area_sifoneo ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.area_sifoneo && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.area_sifoneo.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="equipo_utilizado">
                {t("services.sifoneo.equipmentUsed")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("equipo_utilizado") || ""}
                onValueChange={(value) => setValue("equipo_utilizado", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("services.sifoneo.equipmentPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {t("services.sifoneo.equipmentGroup")}
                    </SelectLabel>
                    <SelectItem value="sifon_manual">
                      {t("services.sifoneo.equipment.manual")}
                    </SelectItem>
                    <SelectItem value="sifon_electrico">
                      {t("services.sifoneo.equipment.electric")}
                    </SelectItem>
                    <SelectItem value="bomba_centrifuga">
                      {t("services.sifoneo.equipment.centrifugalPump")}
                    </SelectItem>
                    <SelectItem value="bomba_diafragma">
                      {t("services.sifoneo.equipment.diaphragmPump")}
                    </SelectItem>
                    <SelectItem value="aspiradora_fondos">
                      {t("services.sifoneo.equipment.bottomVacuum")}
                    </SelectItem>
                    <SelectItem value="sifon_comercial">
                      {t("services.sifoneo.equipment.commercial")}
                    </SelectItem>
                    <SelectItem value="otro">
                      {t("services.sifoneo.equipment.other")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.equipo_utilizado && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.equipo_utilizado.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="horas_trabajo">
                {t("services.sifoneo.workHours")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="horas_trabajo"
                type="number"
                step="0.5"
                {...register("horas_trabajo", {
                  required: t("services.sifoneo.hoursRequired"),
                  valueAsNumber: true,
                  min: {
                    value: 0.5,
                    message: t("services.sifoneo.minHours"),
                  },
                })}
                placeholder={t("services.sifoneo.hoursPlaceholder")}
                className={errors.horas_trabajo ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.horas_trabajo && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.horas_trabajo.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="costo_producto_maquinaria">
                {t("services.sifoneo.operationCost")}
              </Label>
              <Input
                id="costo_producto_maquinaria"
                type="number"
                step="0.01"
                {...register("costo_producto_maquinaria", {
                  valueAsNumber: true,
                })}
                placeholder={t("services.sifoneo.costPlaceholder")}
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            {t("alerts.errorTitle", {
              action: isEditing ? t("alerts.update") : t("alerts.register"),
            })}
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div>
        <Label className="text-base font-semibold">
          {t("form.healthService")} <span className="text-red-500">*</span>
        </Label>
        {errors.tipo_servicio && (
          <p className="text-sm text-red-500 mt-1">
            {errors.tipo_servicio.message}
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
          {opciones_especie.map((opcion) => {
            const Icon = opcion.icon;
            const isSelected = selectedService === opcion.value;

            return (
              <div
                key={opcion.id}
                onClick={() => {
                  if (!isSubmitting) {
                    setSelectedService(opcion.value);
                    setValue("tipo_servicio", opcion.value);
                    setSelectedServiceData(opcion);
                  }
                }}
                className={cn(
                  "cursor-pointer rounded-lg border-2 p-4 transition-all duration-200",
                  "hover:shadow-md",
                  isSelected
                    ? `${selectedBorderColor} ${selectedBgColor} shadow-sm ring-2 ${selectedBorderColor.replace("border", "ring")}/20`
                    : "border-gray-200 hover:bg-gray-50",
                  isSubmitting && "cursor-not-allowed opacity-50",
                )}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div
                    className={cn(
                      "rounded-full p-2 transition-colors",
                      isSelected
                        ? `${selectedBgColor} ${iconColor}`
                        : "bg-gray-100 text-gray-600",
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isSelected ? selectedTextColor : "text-gray-700",
                    )}
                  >
                    {opcion.label}
                  </span>
                  {isSelected && (
                    <div
                      className={`h-1 w-6 rounded-full ${selectedBorderColor.replace("border", "bg")}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {t("form.serviceHint")}
        </p>
      </div>

      {selectedServiceData && (
        <div className="border-t pt-4 mt-6">
          <div className="flex items-center gap-2 mb-4">
            {selectedServiceData.icon && (
              <selectedServiceData.icon className={`h-5 w-5 ${iconColor}`} />
            )}
            <h3 className="text-lg font-semibold">
              {selectedServiceData.label}
            </h3>
          </div>
          {renderDynamicFields()}
        </div>
      )}

      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-semibold mb-4">{t("form.generalInfo")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 relative" ref={dropdownRef}>
            <Label htmlFor="buscador">
              {t("form.searchAnimal")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  id="buscador"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                    if (!e.target.value) {
                      setSelectedAnimal(null);
                      setValue("animalId", "");
                    }
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder={t("form.searchPlaceholder")}
                  className="pl-10 pr-20"
                  disabled={isSubmitting}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <ChevronDown
                  className={cn(
                    "absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform",
                    isDropdownOpen && "rotate-180",
                  )}
                />
              </div>
              {errors.animalId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.animalId.message}
                </p>
              )}
            </div>

            {isDropdownOpen && searchTerm && (
              <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {isLoadingAnimales ? (
                  <div className="p-4 text-center text-muted-foreground">
                    {t("animalSearch.loading")}
                  </div>
                ) : resultadosBusqueda.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    {t("animalSearch.noResults")}
                  </div>
                ) : (
                  <>
                    {animalesIndividuales.length > 0 && (
                      <div>
                        <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-muted-foreground uppercase sticky top-0">
                          {t("animalSearch.animals")}
                        </div>
                        {animalesIndividuales.map((animal) => {
                          const info = getAnimalDisplayInfo(animal);
                          return (
                            <div
                              key={animal.id}
                              onClick={() => handleSelectAnimal(animal)}
                              className={`px-4 py-2 ${hoverBgColor} cursor-pointer border-b last:border-b-0 flex items-center justify-between`}
                            >
                              <div>
                                <div className="font-medium">{info.nombre}</div>
                                <div className="text-xs text-muted-foreground flex gap-2">
                                  {info.identificador && (
                                    <span>{info.identificador}</span>
                                  )}
                                  {info.identificador && info.galpon && (
                                    <span>•</span>
                                  )}
                                  {info.galpon && <span>{info.galpon}</span>}
                                  {info.lote && <span>{info.lote}</span>}
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {animal.especie?.nombre ||
                                  t("animalSearch.noSpecies")}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {lotesGalpones.length > 0 && (
                      <div>
                        <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-muted-foreground uppercase sticky top-0">
                          {t("animalSearch.batchesAndSheds")}
                        </div>
                        {lotesGalpones.map((animal) => {
                          const info = getAnimalDisplayInfo(animal);
                          return (
                            <div
                              key={animal.id}
                              onClick={() => handleSelectAnimal(animal)}
                              className={`px-4 py-2 ${hoverBgColor} cursor-pointer border-b last:border-b-0 flex items-center justify-between`}
                            >
                              <div>
                                <div className="font-medium">
                                  {info.galpon || info.lote || info.nombre}
                                </div>
                                <div className="text-xs text-muted-foreground flex gap-2">
                                  {info.cantidad && (
                                    <span>{info.cantidad}</span>
                                  )}
                                  {info.identificador && (
                                    <>
                                      <span>•</span>
                                      <span>{info.identificador}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {animal.cantidad_lote
                                  ? t("animalSearch.batch")
                                  : t("animalSearch.shed")}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {selectedAnimal && (
              <div
                className={`mt-2 p-3 ${bgColor} border ${borderColor} rounded-lg flex items-center justify-between`}
              >
                <div>
                  <span className={`text-sm font-medium ${textColor}`}>
                    {selectedAnimal.nombre_animal ||
                      selectedAnimal.galpon ||
                      selectedAnimal.lote ||
                      t("animalSearch.selected")}
                  </span>
                  <span className={`text-xs ${textColor} ml-2`}>
                    {selectedAnimal.identificador &&
                      t("animalSearch.idPrefix", {
                        value: selectedAnimal.identificador,
                      })}
                    {selectedAnimal.galpon &&
                      t("animalSearch.shedSuffix", {
                        value: selectedAnimal.galpon,
                      })}
                    {selectedAnimal.lote &&
                      t("animalSearch.batchSuffix", {
                        value: selectedAnimal.lote,
                      })}
                    {selectedAnimal.cantidad_lote &&
                      t("animalSearch.animalsSuffix", {
                        count: selectedAnimal.cantidad_lote,
                      })}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearSelection}
                  className={`${iconColor} hover:${textColor}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="responsable">
              {t("form.responsible")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="responsable"
              {...register("responsable", {
                required: t("form.responsibleRequired"),
              })}
              placeholder={t("form.responsiblePlaceholder")}
              className={errors.responsable ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.responsable && (
              <p className="text-sm text-red-500 mt-1">
                {errors.responsable.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="fecha_evento">
              {t("form.eventDate")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fecha_evento"
              type="date"
              {...register("fecha_evento", {
                required: t("form.dateRequired"),
              })}
              className={errors.fecha_evento ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.fecha_evento && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fecha_evento.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="proxima_fecha_evento">
              {t("form.nextEventDate")}
            </Label>
            <Input
              id="proxima_fecha_evento"
              type="date"
              {...register("proxima_fecha_evento")}
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="observaciones">{t("form.observations")}</Label>
            <Textarea
              id="observaciones"
              {...register("observaciones")}
              placeholder={t("form.observationsPlaceholder")}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="costo_base">{t("form.baseCost")}</Label>
            <Input
              id="costo_base"
              type="number"
              step="0.01"
              min="0"
              {...register("costo_base", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: t("form.minZero"),
                },
              })}
              placeholder={t("form.baseCostPlaceholder")}
              className={errors.costo_base ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.costo_base && (
              <p className="text-sm text-red-500 mt-1">
                {errors.costo_base.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="precio_referencia">
              {t("form.referencePrice")}
            </Label>
            <Input
              id="precio_referencia"
              type="number"
              step="0.01"
              min="0"
              {...register("precio_referencia", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: t("form.minZero"),
                },
              })}
              placeholder={t("form.referencePricePlaceholder")}
              className={errors.precio_referencia ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.precio_referencia && (
              <p className="text-sm text-red-500 mt-1">
                {errors.precio_referencia.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="costo_real">{t("form.realCost")}</Label>
            <Input
              id="costo_real"
              type="number"
              step="0.01"
              min="0"
              {...register("costo_real", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: t("form.minZero"),
                },
              })}
              placeholder={t("form.realCostPlaceholder")}
              className={errors.costo_real ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.costo_real && (
              <p className="text-sm text-red-500 mt-1">
                {errors.costo_real.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="valor_estimado">{t("form.estimatedValue")}</Label>
            <Input
              id="valor_estimado"
              type="number"
              step="0.01"
              min="0"
              {...register("valor_estimado", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: t("form.minZero"),
                },
              })}
              placeholder={t("form.estimatedValuePlaceholder")}
              className={errors.valor_estimado ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.valor_estimado && (
              <p className="text-sm text-red-500 mt-1">
                {errors.valor_estimado.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="tratamiento_aplicado">
              {t("form.appliedTreatment")}
            </Label>
            <Input
              id="tratamiento_aplicado"
              {...register("tratamiento_aplicado")}
              placeholder={t("form.appliedTreatmentPlaceholder")}
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="motivo">{t("form.reason")}</Label>
            <Input
              id="motivo"
              {...register("motivo")}
              placeholder={t("form.reasonPlaceholder")}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        {setOpenModal && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess!()}
            disabled={isSubmitting}
          >
            {t("buttons.cancel")}
          </Button>
        )}
        <Button
          className={`${buttonBgColor} ${buttonHoverColor} text-white`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {isEditing ? t("buttons.updating") : t("buttons.saving")}
            </span>
          ) : isEditing ? (
            t("buttons.update")
          ) : (
            t("buttons.save")
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormSanidad;
