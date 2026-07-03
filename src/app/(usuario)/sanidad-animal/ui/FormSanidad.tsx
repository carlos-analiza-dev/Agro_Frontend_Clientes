"use client";

import { CreateSanidadAnimal } from "@/api/sanidad-animal/interface/crear-sanidad.interface";
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
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
}

const FormSanidad = ({ opciones_especie, setOpenModal, onSuccess }: Props) => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedServiceData, setSelectedServiceData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateSanidadAnimal>({
    defaultValues: {
      animalId: "",
      tipo_Servicio: "",
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
      dias_descanso: [],
      producto_maquinaria_utilizada: [],
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
    },
  });

  const onSubmit = async (data: CreateSanidadAnimal) => {
    setIsSubmitting(true);
    try {
      data.tipo_Servicio = selectedService;

      toast.success("Sanidad registrada correctamente");
      reset();
      setSelectedService("");
      setSelectedServiceData(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Error al registrar la sanidad");
    } finally {
      setIsSubmitting(false);
    }
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
                Vacuna aplicada <span className="text-red-500">*</span>
              </Label>
              <Input
                id="vacuna_aplicada"
                {...register("vacuna_aplicada", {
                  required: "La vacuna es requerida",
                })}
                placeholder="Ej: Rabia, Fiebre aftosa"
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
              <Label htmlFor="via_aplicacion_vacuna">Vía de aplicación</Label>
              <Select
                value={watch("via_aplicacion_vacuna") || ""}
                onValueChange={(value) =>
                  setValue("via_aplicacion_vacuna", value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar vía" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Vías de aplicación</SelectLabel>
                    <SelectItem value="intramuscular">Intramuscular</SelectItem>
                    <SelectItem value="subcutanea">Subcutánea</SelectItem>
                    <SelectItem value="intradermica">Intradérmica</SelectItem>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="nasal">Nasal</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dosis">Dosis</Label>
              <Input
                id="dosis"
                type="number"
                step="0.1"
                {...register("dosis", { valueAsNumber: true })}
                placeholder="Ej: 2.5"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="dosis_tratamiento">Dosis/Tratamiento</Label>
              <Input
                id="dosis_tratamiento"
                {...register("dosis_tratamiento")}
                placeholder="Ej: 2ml, 1 comprimido"
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
                Tipo de desparasitación <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("tipo_desparasitacion") || ""}
                onValueChange={(value) =>
                  setValue("tipo_desparasitacion", value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipos</SelectLabel>
                    <SelectItem value="interna">Interna</SelectItem>
                    <SelectItem value="externa">Externa</SelectItem>
                    <SelectItem value="mixta">Mixta</SelectItem>
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
              <Label htmlFor="peso_usado">Peso usado (kg)</Label>
              <Input
                id="peso_usado"
                type="number"
                step="0.1"
                {...register("peso_usado", { valueAsNumber: true })}
                placeholder="Peso del animal para calcular dosis"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "RevisionUbre":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="prueba_evento">
                Prueba/Evento <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("prueba_evento") || ""}
                onValueChange={(value) => setValue("prueba_evento", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prueba" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pruebas</SelectLabel>
                    <SelectItem value="california">
                      California Mastitis Test
                    </SelectItem>
                    <SelectItem value="conteo_celulas">
                      Conteo de células somáticas
                    </SelectItem>
                    <SelectItem value="inspeccion_visual">
                      Inspección visual
                    </SelectItem>
                    <SelectItem value="cultivo">
                      Cultivo bacteriológico
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
              <Label htmlFor="cuarto_afectado">Cuarto afectado</Label>
              <Select
                value={watch("cuarto_afectado") || ""}
                onValueChange={(value) => setValue("cuarto_afectado", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cuarto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cuartos</SelectLabel>
                    <SelectItem value="anterior_izquierdo">
                      Anterior izquierdo
                    </SelectItem>
                    <SelectItem value="anterior_derecho">
                      Anterior derecho
                    </SelectItem>
                    <SelectItem value="posterior_izquierdo">
                      Posterior izquierdo
                    </SelectItem>
                    <SelectItem value="posterior_derecho">
                      Posterior derecho
                    </SelectItem>
                    <SelectItem value="multiple">Múltiple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dias_retiro_leche">Días de retiro de leche</Label>
              <Input
                id="dias_retiro_leche"
                type="number"
                {...register("dias_retiro_leche", { valueAsNumber: true })}
                placeholder="Días sin consumo de leche"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="litros_diarios_actuales">
                Litros diarios actuales
              </Label>
              <Input
                id="litros_diarios_actuales"
                type="number"
                step="0.1"
                {...register("litros_diarios_actuales", {
                  valueAsNumber: true,
                })}
                placeholder="Producción diaria actual"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "AtencionPezunas":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo_atencion">
                Tipo de atención <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("tipo_atencion") || ""}
                onValueChange={(value) => setValue("tipo_atencion", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipos</SelectLabel>
                    <SelectItem value="recorte">Recorte</SelectItem>
                    <SelectItem value="tratamiento">Tratamiento</SelectItem>
                    <SelectItem value="preventivo">Preventivo</SelectItem>
                    <SelectItem value="emergencia">Emergencia</SelectItem>
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
              <Label htmlFor="grado_cojera">Grado de cojera</Label>
              <Select
                value={watch("grado_cojera") || ""}
                onValueChange={(value) => setValue("grado_cojera", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar grado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Grados</SelectLabel>
                    <SelectItem value="leve">Leve (1-2)</SelectItem>
                    <SelectItem value="moderado">Moderado (3-4)</SelectItem>
                    <SelectItem value="severo">Severo (5)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="miembro_afectado">Miembro afectado</Label>
              <Select
                value={watch("miembro_afectado") || ""}
                onValueChange={(value) => setValue("miembro_afectado", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar miembro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Miembros</SelectLabel>
                    <SelectItem value="anterior_izquierdo">
                      Anterior izquierdo
                    </SelectItem>
                    <SelectItem value="anterior_derecho">
                      Anterior derecho
                    </SelectItem>
                    <SelectItem value="posterior_izquierdo">
                      Posterior izquierdo
                    </SelectItem>
                    <SelectItem value="posterior_derecho">
                      Posterior derecho
                    </SelectItem>
                    <SelectItem value="multiple">Múltiple</SelectItem>
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
                Potrero/Corral/Área <span className="text-red-500">*</span>
              </Label>
              <Input
                id="potrero_corral_area"
                {...register("potrero_corral_area", {
                  required: "El área es requerida",
                })}
                placeholder="Nombre del área o potrero"
                className={errors.potrero_corral_area ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.potrero_corral_area && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.potrero_corral_area.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="actividad">Actividad</Label>
              <Input
                id="actividad"
                {...register("actividad")}
                placeholder="Ej: Limpieza profunda, desinfección"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="dias_descanso">Días de descanso</Label>
              <Input
                id="dias_descanso"
                {...register("dias_descanso")}
                placeholder="Ej: 30, 45, 60 (separados por coma)"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="producto_maquinaria_utilizada">
                Producto/Maquinaria utilizada
              </Label>
              <Input
                id="producto_maquinaria_utilizada"
                {...register("producto_maquinaria_utilizada")}
                placeholder="Ej: Cal, Hidrolavadora"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="carga_animal">Carga animal</Label>
              <Input
                id="carga_animal"
                type="number"
                {...register("carga_animal", { valueAsNumber: true })}
                placeholder="Cantidad de animales en el área"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="costo_producto_maquinaria">
                Costo producto/maquinaria
              </Label>
              <Input
                id="costo_producto_maquinaria"
                type="number"
                step="0.01"
                {...register("costo_producto_maquinaria", {
                  valueAsNumber: true,
                })}
                placeholder="Costo en $"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "Esquila":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="peso_lana">
                Peso de lana (kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="peso_lana"
                type="number"
                step="0.1"
                {...register("peso_lana", {
                  required: "El peso de lana es requerido",
                  valueAsNumber: true,
                })}
                placeholder="Peso en kilogramos"
                className={errors.peso_lana ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.peso_lana && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.peso_lana.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="calidad_lana">Calidad de lana</Label>
              <Select
                value={watch("calidad_lana") || ""}
                onValueChange={(value) => setValue("calidad_lana", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar calidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Calidades</SelectLabel>
                    <SelectItem value="fina">Fina</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="gruesa">Gruesa</SelectItem>
                    <SelectItem value="mixta">Mixta</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color_lana">Color de lana</Label>
              <Input
                id="color_lana"
                {...register("color_lana")}
                placeholder="Ej: Blanca, Negra, Marrón"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="responsable_esquila">
                Responsable de esquila
              </Label>
              <Input
                id="responsable_esquila"
                {...register("responsable_esquila")}
                placeholder="Nombre del esquilador"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "BanoSanitario":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="motivo_baño">
                Motivo del baño <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("motivo_baño") || ""}
                onValueChange={(value) => setValue("motivo_baño", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Motivos</SelectLabel>
                    <SelectItem value="parasitos_externos">
                      Parásitos externos
                    </SelectItem>
                    <SelectItem value="preventivo">Preventivo</SelectItem>
                    <SelectItem value="tratamiento">Tratamiento</SelectItem>
                    <SelectItem value="sanitario">Sanitario</SelectItem>
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
              <Label htmlFor="tiempo_baño">Tiempo de baño (minutos)</Label>
              <Input
                id="tiempo_baño"
                type="number"
                {...register("tiempo_baño", { valueAsNumber: true })}
                placeholder="Tiempo en minutos"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="hallazgos_piel">Hallazgos en piel</Label>
              <Input
                id="hallazgos_piel"
                {...register("hallazgos_piel")}
                placeholder="Ej: Irritación, heridas, parásitos"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "Odontologia":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="procedimiento">
                Procedimiento <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("procedimiento") || ""}
                onValueChange={(value) => setValue("procedimiento", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar procedimiento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Procedimientos</SelectLabel>
                    <SelectItem value="raspado">Raspado dental</SelectItem>
                    <SelectItem value="extraccion">Extracción</SelectItem>
                    <SelectItem value="limpieza">Limpieza profunda</SelectItem>
                    <SelectItem value="examen">Examen oral</SelectItem>
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
              <Label htmlFor="hallazgos">Hallazgos</Label>
              <Input
                id="hallazgos"
                {...register("hallazgos")}
                placeholder="Ej: Caries, desgaste, inflamación"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "AtencionCascos":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo">
                Tipo <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("tipo") || ""}
                onValueChange={(value) => setValue("tipo", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipos</SelectLabel>
                    <SelectItem value="recorte">Recorte</SelectItem>
                    <SelectItem value="herrado">Herrado</SelectItem>
                    <SelectItem value="tratamiento">Tratamiento</SelectItem>
                    <SelectItem value="preventivo">Preventivo</SelectItem>
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
              <Label htmlFor="herrador">Herrador</Label>
              <Input
                id="herrador"
                {...register("herrador")}
                placeholder="Nombre del herrador"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "RevisionLesiones":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo_lesion">
                Tipo de lesión <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("tipo_lesion") || ""}
                onValueChange={(value) => setValue("tipo_lesion", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipos</SelectLabel>
                    <SelectItem value="herida_abierta">
                      Herida abierta
                    </SelectItem>
                    <SelectItem value="contusion">Contusión</SelectItem>
                    <SelectItem value="fractura">Fractura</SelectItem>
                    <SelectItem value="infeccion">Infección</SelectItem>
                    <SelectItem value="quemadura">Quemadura</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
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
              <Label htmlFor="zona_afectada">Zona afectada</Label>
              <Input
                id="zona_afectada"
                {...register("zona_afectada")}
                placeholder="Ej: Pata delantera, lomo, cabeza"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="severidad">Severidad</Label>
              <Select
                value={watch("severidad") || ""}
                onValueChange={(value) => setValue("severidad", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Severidades</SelectLabel>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="moderado">Moderado</SelectItem>
                    <SelectItem value="grave">Grave</SelectItem>
                    <SelectItem value="critico">Crítico</SelectItem>
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
                Peso estimado (kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="peso_estimado"
                type="number"
                step="0.1"
                {...register("peso_estimado", {
                  required: "El peso estimado es requerido",
                  valueAsNumber: true,
                })}
                placeholder="Peso en kilogramos"
                className={errors.peso_estimado ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.peso_estimado && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.peso_estimado.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="condicion_corporal">Condición corporal</Label>
              <Select
                value={watch("condicion_corporal") || ""}
                onValueChange={(value) => setValue("condicion_corporal", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar condición" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Condiciones</SelectLabel>
                    <SelectItem value="1">1 - Muy delgado</SelectItem>
                    <SelectItem value="2">2 - Delgado</SelectItem>
                    <SelectItem value="3">3 - Normal</SelectItem>
                    <SelectItem value="4">4 - Sobrepeso</SelectItem>
                    <SelectItem value="5">5 - Obeso</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cambio_dieta">Cambio de dieta</Label>
              <Input
                id="cambio_dieta"
                {...register("cambio_dieta")}
                placeholder="Ej: Aumento de concentrado, cambio de forraje"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "ControlMortalidad":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cantidad_bajas">
                Cantidad de bajas <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cantidad_bajas"
                type="number"
                {...register("cantidad_bajas", {
                  required: "La cantidad de bajas es requerida",
                  valueAsNumber: true,
                })}
                placeholder="Número de animales"
                className={errors.cantidad_bajas ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.cantidad_bajas && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cantidad_bajas.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="causa_baja_probable">
                Causa probable de la baja
              </Label>
              <Input
                id="causa_baja_probable"
                {...register("causa_baja_probable")}
                placeholder="Ej: Enfermedad, accidente, edad"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="accion_correctiva">Acción correctiva</Label>
              <Input
                id="accion_correctiva"
                {...register("accion_correctiva")}
                placeholder="Ej: Aislamiento, vacunación, cambio de dieta"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "CambioCamaNido":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo_accion">
                Tipo de acción <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("tipo_accion") || ""}
                onValueChange={(value) => setValue("tipo_accion", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar acción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Acciones</SelectLabel>
                    <SelectItem value="cambio_parcial">
                      Cambio parcial
                    </SelectItem>
                    <SelectItem value="cambio_total">Cambio total</SelectItem>
                    <SelectItem value="limpieza">Limpieza</SelectItem>
                    <SelectItem value="desinfeccion">Desinfección</SelectItem>
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
              <Label htmlFor="material_utilizado">Material utilizado</Label>
              <Input
                id="material_utilizado"
                {...register("material_utilizado")}
                placeholder="Ej: Viruta, Paja, Aserrín"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="cantidad_usada">Cantidad usada</Label>
              <Input
                id="cantidad_usada"
                type="number"
                step="0.1"
                {...register("cantidad_usada", { valueAsNumber: true })}
                placeholder="Cantidad en kg o m²"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "ControlProduccion":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="huevos_diarios">
                Huevos diarios <span className="text-red-500">*</span>
              </Label>
              <Input
                id="huevos_diarios"
                type="number"
                {...register("huevos_diarios", {
                  required: "Los huevos diarios son requeridos",
                  valueAsNumber: true,
                })}
                placeholder="Cantidad de huevos por día"
                className={errors.huevos_diarios ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.huevos_diarios && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.huevos_diarios.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="huevos_rotos">Huevos rotos</Label>
              <Input
                id="huevos_rotos"
                type="number"
                {...register("huevos_rotos", { valueAsNumber: true })}
                placeholder="Cantidad de huevos rotos"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="porcentaje_postura">Porcentaje de postura</Label>
              <Input
                id="porcentaje_postura"
                type="number"
                step="0.1"
                {...register("porcentaje_postura", { valueAsNumber: true })}
                placeholder="Porcentaje (0-100)"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="calidad_huevo">Calidad del huevo</Label>
              <Select
                value={watch("calidad_huevo") || ""}
                onValueChange={(value) => setValue("calidad_huevo", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar calidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Calidades</SelectLabel>
                    <SelectItem value="extra">Extra</SelectItem>
                    <SelectItem value="primera">Primera</SelectItem>
                    <SelectItem value="segunda">Segunda</SelectItem>
                    <SelectItem value="tercera">Tercera</SelectItem>
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
                Temperatura (°C) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                {...register("temperatura", {
                  required: "La temperatura es requerida",
                  valueAsNumber: true,
                })}
                placeholder="Temperatura del agua"
                className={errors.temperatura ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.temperatura && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.temperatura.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="oxigeno">Oxígeno (mg/L)</Label>
              <Input
                id="oxigeno"
                type="number"
                step="0.1"
                {...register("oxigeno", { valueAsNumber: true })}
                placeholder="Nivel de oxígeno disuelto"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="ph">pH</Label>
              <Input
                id="ph"
                type="number"
                step="0.1"
                {...register("ph", { valueAsNumber: true })}
                placeholder="pH del agua"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="amonio">Amonio (mg/L)</Label>
              <Input
                id="amonio"
                type="number"
                step="0.1"
                {...register("amonio", { valueAsNumber: true })}
                placeholder="Nivel de amonio"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="nitritos">Nitritos (mg/L)</Label>
              <Input
                id="nitritos"
                type="number"
                step="0.1"
                {...register("nitritos", { valueAsNumber: true })}
                placeholder="Nivel de nitritos"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "RecambioAgua":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="porcentaje_recambio">
                Porcentaje de recambio (%){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="porcentaje_recambio"
                type="number"
                step="1"
                {...register("porcentaje_recambio", {
                  required: "El porcentaje es requerido",
                  valueAsNumber: true,
                })}
                placeholder="Porcentaje (0-100)"
                className={errors.porcentaje_recambio ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.porcentaje_recambio && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.porcentaje_recambio.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="volumen_estimado">Volumen estimado (m³)</Label>
              <Input
                id="volumen_estimado"
                type="number"
                step="0.1"
                {...register("volumen_estimado", { valueAsNumber: true })}
                placeholder="Volumen en metros cúbicos"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case "MuestreoBiometrico":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cantidad_muestreo">
                Cantidad muestreada <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cantidad_muestreo"
                type="number"
                {...register("cantidad_muestreo", {
                  required: "La cantidad es requerida",
                  valueAsNumber: true,
                })}
                placeholder="Número de peces muestreados"
                className={errors.cantidad_muestreo ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.cantidad_muestreo && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cantidad_muestreo.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="peso_promedio">Peso promedio (g)</Label>
              <Input
                id="peso_promedio"
                type="number"
                step="0.1"
                {...register("peso_promedio", { valueAsNumber: true })}
                placeholder="Peso en gramos"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="talla_promedio">Talla promedio (cm)</Label>
              <Input
                id="talla_promedio"
                type="number"
                step="0.1"
                {...register("talla_promedio", { valueAsNumber: true })}
                placeholder="Talla en centímetros"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="biomasa_estimada">Biomasa estimada (kg)</Label>
              <Input
                id="biomasa_estimada"
                type="number"
                step="0.1"
                {...register("biomasa_estimada", { valueAsNumber: true })}
                placeholder="Biomasa total estimada"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="etapa_peces">Etapa de los peces</Label>
              <Select
                value={watch("etapa_peces") || ""}
                onValueChange={(value) => setValue("etapa_peces", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Etapas</SelectLabel>
                    <SelectItem value="alevino">Alevino</SelectItem>
                    <SelectItem value="juvenil">Juvenil</SelectItem>
                    <SelectItem value="adulto">Adulto</SelectItem>
                    <SelectItem value="reproductor">Reproductor</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label className="text-base font-semibold">
          Servicio de Sanidad <span className="text-red-500">*</span>
        </Label>
        {errors.tipo_Servicio && (
          <p className="text-sm text-red-500 mt-1">
            {errors.tipo_Servicio.message}
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
                    setValue("tipo_Servicio", opcion.value);
                    setSelectedServiceData(opcion);
                  }
                }}
                className={cn(
                  "cursor-pointer rounded-lg border-2 p-4 transition-all duration-200",
                  "hover:shadow-md hover:border-primary/50",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20"
                    : "border-gray-200 hover:bg-gray-50",
                  isSubmitting && "cursor-not-allowed opacity-50",
                )}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div
                    className={cn(
                      "rounded-full p-2 transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-600",
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isSelected ? "text-primary" : "text-gray-700",
                    )}
                  >
                    {opcion.label}
                  </span>
                  {isSelected && (
                    <div className="h-1 w-6 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          * Haz clic en una tarjeta para seleccionar el servicio
        </p>
      </div>

      {selectedServiceData && (
        <div className="border-t pt-4 mt-6">
          <div className="flex items-center gap-2 mb-4">
            {selectedServiceData.icon && (
              <selectedServiceData.icon className="h-5 w-5 text-green-600" />
            )}
            <h3 className="text-lg font-semibold">
              {selectedServiceData.label}
            </h3>
          </div>
          {renderDynamicFields()}
        </div>
      )}

      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-semibold mb-4">Información General</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="responsable">
              Responsable <span className="text-red-500">*</span>
            </Label>
            <Input
              id="responsable"
              {...register("responsable", {
                required: "El responsable es requerido",
              })}
              placeholder="Nombre del responsable"
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
              Fecha del evento <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fecha_evento"
              type="datetime-local"
              {...register("fecha_evento", {
                required: "La fecha es requerida",
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
              Próxima fecha del evento
            </Label>
            <Input
              id="proxima_fecha_evento"
              type="datetime-local"
              {...register("proxima_fecha_evento")}
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              {...register("observaciones")}
              placeholder="Observaciones adicionales"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="costo_base">Costo base ($)</Label>
            <Input
              id="costo_base"
              type="number"
              step="0.01"
              {...register("costo_base", { valueAsNumber: true })}
              placeholder="Costo base"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="precio_referencia">Precio de referencia ($)</Label>
            <Input
              id="precio_referencia"
              type="number"
              step="0.01"
              {...register("precio_referencia", { valueAsNumber: true })}
              placeholder="Precio de referencia"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="costo_real">Costo real ($)</Label>
            <Input
              id="costo_real"
              type="number"
              step="0.01"
              {...register("costo_real", { valueAsNumber: true })}
              placeholder="Costo real"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="valor_estimado">Valor estimado ($)</Label>
            <Input
              id="valor_estimado"
              type="number"
              step="0.01"
              {...register("valor_estimado", { valueAsNumber: true })}
              placeholder="Valor estimado"
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="tratamiento_aplicado">Tratamiento aplicado</Label>
            <Input
              id="tratamiento_aplicado"
              {...register("tratamiento_aplicado")}
              placeholder="Tratamiento aplicado"
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="motivo">Motivo</Label>
            <Input
              id="motivo"
              {...register("motivo")}
              placeholder="Motivo del servicio"
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
            onClick={() => setOpenModal(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button
          className="bg-green-600 hover:bg-green-700"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
};

export default FormSanidad;
