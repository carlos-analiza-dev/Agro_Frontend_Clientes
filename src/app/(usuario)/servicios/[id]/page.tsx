"use client";

import useGetAnimalesByFincaEspRaza from "@/hooks/animales/useGetAnimalesByFincaEspRaza";
import useGetEspecies from "@/hooks/especies/useGetEspecies";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Loader2,
  PawPrint,
  MapPin,
  Clock,
  DollarSign,
  Stethoscope,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { CrearCitaInterface } from "@/api/citas/interfaces/crear-cita.interface";
import useGetSubServiciosByServicioId from "@/hooks/sub-servicios/useGetSubServiciosByServicioId";
import useGetSubServicioPaisCantidad from "@/hooks/sub-servicios/useGetSubServicioByIdPaisCantidad";
import userGetMedicoByEspecialidadesByPais from "@/hooks/medicos/userGetMedicoByEspecialidadesByPais";
import useGetHorasMedicoByFecha from "@/hooks/horarios/useGetHorasMedicoByFecha";
import { toast } from "react-toastify";
import { CreateCita } from "@/api/citas/accions/crear-cita";
import ThemedAnimalPicker from "@/components/generics/ThemedAnimalPicker";

interface HoraDisponibleItem {
  value: string;
  label: string;
  horaInicio: string;
  horaFin: string;
  duracionDisponible: number;
  puedeAcomodarServicio?: boolean;
}

const AgregarCitaServicioPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoriaId = params.id as string;
  const servicioNombre = searchParams.get("nombre") || "Servicio";

  const { cliente } = useAuthStore();
  const clienteId = cliente?.id || "";
  const paisId = cliente?.pais.id || "";

  const [especieId, setEspecieId] = useState("");
  const [razaId, setRazaId] = useState("");
  const [filteredHours, setFilteredHours] = useState<HoraDisponibleItem[]>([]);
  const [duracion, setDuracion] = useState(1);
  const [cantidadAnimales, setCantidadAnimales] = useState(0);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<CrearCitaInterface>();

  useEffect(() => {
    const animalesIds = watch("animalesId") || [];
    setCantidadAnimales(animalesIds.length);
  }, [watch("animalesId")]);

  const { data: especies } = useGetEspecies();
  const { data: razas } = useGetRazasByEspecie(especieId);
  const { data: fincas } = useFincasPropietarios(clienteId);
  const fincaId = watch("fincaId");
  const { data: animales } = useGetAnimalesByFincaEspRaza(
    fincaId,
    especieId,
    razaId,
  );
  const { data: servicios } = useGetSubServiciosByServicioId(categoriaId);

  const subServicioId = watch("subServicioId");
  const { data: medicos } = userGetMedicoByEspecialidadesByPais(
    paisId,
    subServicioId,
  );

  const { data: servicios_pais_cantidad } = useGetSubServicioPaisCantidad(
    subServicioId,
    paisId,
    cantidadAnimales,
  );

  const medicoId = watch("medicoId");
  const fecha = watch("fecha");

  const { data: horas_disponibles } = useGetHorasMedicoByFecha(
    medicoId,
    fecha,
    String(duracion),
  );

  useEffect(() => {
    setValue("subServicioId", "");
    setValue("medicoId", "");
  }, [categoriaId]);

  useEffect(() => {
    setSelectedAnimals([]);
  }, [fincaId]);

  useEffect(() => {
    setSelectedAnimals([]);
  }, [especieId]);

  useEffect(() => {
    setSelectedAnimals([]);
  }, [razaId]);

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    if (
      servicios_pais_cantidad?.data &&
      subServicioId &&
      paisId &&
      horas_disponibles
    ) {
      if (servicios_pais_cantidad.data.id === subServicioId) {
        const precioPais = servicios_pais_cantidad.data.preciosPorPais.find(
          (pp) => pp.pais.id === paisId,
        );

        if (precioPais) {
          const duracionTotal = precioPais.tiempo;
          const precioTotal = Number(precioPais.costo);

          setValue("duracion", duracionTotal);
          setValue("totalPagar", precioTotal);
          setDuracion(duracionTotal);

          const horasFiltradas = horas_disponibles
            .map((hora) => {
              const inicio = timeToMinutes(hora.horaInicio);
              const fin = timeToMinutes(hora.horaFin);
              return {
                ...hora,
                duracionDisponible: fin - inicio,
                puedeAcomodarServicio: fin - inicio >= duracionTotal,
              };
            })
            .filter((hora) => hora.puedeAcomodarServicio);

          setFilteredHours(
            horasFiltradas.map((hora) => ({
              value: hora.horaInicio,
              label: `${hora.horaInicio} - ${hora.horaFin} (${Math.floor(
                duracionTotal / 60,
              )}h ${duracionTotal % 60}hrs)`,
              horaInicio: hora.horaInicio,
              horaFin: hora.horaFin,
              duracionDisponible: hora.duracionDisponible,
            })),
          );
        } else {
          setValue("duracion", 0);
          setValue("totalPagar", 0);
          setDuracion(0);
          setFilteredHours([]);
        }
      }
    }
  }, [
    subServicioId,
    horas_disponibles,
    servicios_pais_cantidad?.data,
    paisId,
    cantidadAnimales,
    setValue,
  ]);

  useEffect(() => {
    if (!subServicioId) {
      setValue("duracion", 0);
      setValue("totalPagar", 0);
      setDuracion(0);
      setFilteredHours([]);
      setValue("horaInicio", "");
      setValue("horaFin", "");
    }
  }, [subServicioId, setValue]);

  const handleHoraChange = (horaInicioSeleccionada: string) => {
    const duracionServicio = watch("duracion") || 0;
    const horaSeleccionada = filteredHours.find(
      (h) => h.horaInicio === horaInicioSeleccionada,
    );

    if (horaSeleccionada) {
      const inicioMinutos = timeToMinutes(horaSeleccionada.horaInicio);
      const finMinutos = inicioMinutos + duracionServicio;

      const rangoCompletoDisponible = filteredHours.some((hora) => {
        const horaFinDisponible = timeToMinutes(hora.horaFin);
        return (
          timeToMinutes(hora.horaInicio) <= inicioMinutos &&
          horaFinDisponible >= finMinutos
        );
      });

      if (rangoCompletoDisponible) {
        const horasFin = Math.floor(finMinutos / 60);
        const minutosFin = finMinutos % 60;
        const horaFinFormateada = `${horasFin.toString().padStart(2, "0")}:${minutosFin.toString().padStart(2, "0")}`;

        setValue("horaInicio", horaSeleccionada.horaInicio);
        setValue("horaFin", horaFinFormateada);
      } else {
        toast.error(
          "El rango completo no está disponible para esta hora de inicio",
        );
      }
    }
  };

  const mutation = useMutation({
    mutationFn: CreateCita,
    onSuccess: () => {
      toast.success("Cita agendada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["citas-user"] });
      reset();
      router.back();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear la cita";

        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    },
  });

  const onSubmit = (data: CrearCitaInterface) => {
    mutation.mutate({
      ...data,
      cantidadAnimales: cantidadAnimales,
    });
  };

  const handleServicioChange = (value: string) => {
    setValue("subServicioId", value);
    setValue("medicoId", "");
    setValue("duracion", 0);
    setValue("totalPagar", 0);
    setDuracion(0);
    setFilteredHours([]);
    setValue("horaInicio", "");
    setValue("horaFin", "");
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const allFincas =
    fincas?.data.fincas.map((finca) => ({
      value: finca.id,
      label: finca.nombre_finca,
    })) || [];

  const allEspecies =
    especies?.data.map((especie) => ({
      value: especie.id,
      label: especie.nombre,
    })) || [];

  const allRazas =
    razas?.data.map((raza) => ({
      value: raza.id,
      label: raza.nombre,
    })) || [];

  const allServicios =
    servicios?.data.map((servicio) => ({
      value: servicio.id,
      label: servicio.nombre,
    })) || [];

  const allMedicos =
    medicos?.map((medico) => ({
      value: medico.id,
      label: medico.usuario.name,
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/servicios")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nueva cita para {servicioNombre}
          </h1>
          <p className="text-gray-600">
            Complete la información requerida para agendar la cita
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Información de la Cita
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Información General
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="fincaId">Finca</Label>
                  <Select
                    onValueChange={(value) => setValue("fincaId", value)}
                    value={watch("fincaId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una finca" />
                    </SelectTrigger>
                    <SelectContent>
                      {allFincas.map((finca) => (
                        <SelectItem key={finca.value} value={finca.value}>
                          {finca.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mt-6">
                  <PawPrint className="h-5 w-5" />
                  Datos del Animal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="especie">Especie</Label>
                    <Select onValueChange={setEspecieId} value={especieId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la especie" />
                      </SelectTrigger>
                      <SelectContent>
                        {allEspecies.map((especie) => (
                          <SelectItem key={especie.value} value={especie.value}>
                            {especie.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="raza">Raza</Label>
                    <Select
                      onValueChange={setRazaId}
                      value={razaId}
                      disabled={!especieId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la raza" />
                      </SelectTrigger>
                      <SelectContent>
                        {allRazas.map((raza) => (
                          <SelectItem key={raza.value} value={raza.value}>
                            {raza.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Seleccione los animales</Label>
                  <ThemedAnimalPicker
                    animals={animales?.data || []}
                    selectedAnimals={watch("animalesId") || []}
                    onSelectionChange={(selectedIds) =>
                      setValue("animalesId", selectedIds)
                    }
                    multiple={true}
                  />
                </div>

                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mt-6">
                  <Stethoscope className="h-5 w-5" />
                  Servicio Veterinario
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subServicioId">Servicio específico</Label>
                    <Select
                      onValueChange={handleServicioChange}
                      value={watch("subServicioId")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {allServicios.map((servicio) => (
                          <SelectItem
                            key={servicio.value}
                            value={servicio.value}
                          >
                            {servicio.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicoId">Veterinario</Label>
                    <Select
                      onValueChange={(value) => setValue("medicoId", value)}
                      value={watch("medicoId")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el veterinario" />
                      </SelectTrigger>
                      <SelectContent>
                        {allMedicos.map((medico) => (
                          <SelectItem key={medico.value} value={medico.value}>
                            Dr. {medico.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha de la cita</Label>
                  <Input
                    id="fecha"
                    type="date"
                    min={getMinDate()}
                    {...register("fecha", {
                      required: "La fecha es requerida",
                    })}
                    className="w-full"
                  />
                  {errors.fecha && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fecha.message}
                    </p>
                  )}
                </div>

                {filteredHours && filteredHours.length > 0 ? (
                  <div className="space-y-2">
                    <Label
                      htmlFor="horaInicio"
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Horarios Disponibles ({filteredHours.length} opciones)
                    </Label>
                    <Select
                      onValueChange={handleHoraChange}
                      value={watch("horaInicio")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un horario" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredHours.map((hora) => (
                          <SelectItem key={hora.value} value={hora.value}>
                            {hora.label} (Duración: {hora.duracionDisponible}{" "}
                            min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800 text-sm text-center">
                      {watch("subServicioId") &&
                      watch("medicoId") &&
                      watch("fecha")
                        ? "No hay horarios disponibles que puedan acomodar la duración del servicio seleccionado."
                        : "Completa la información del servicio para ver los horarios disponibles."}
                    </p>
                  </div>
                )}

                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mt-6">
                  <DollarSign className="h-5 w-5" />
                  Detalles del Servicio
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duracion">Duración estimada</Label>
                    <Input
                      id="duracion"
                      value={
                        watch("duracion") ? `${watch("duracion")} hrs` : ""
                      }
                      readOnly
                      placeholder="Duración se calculará automáticamente"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalPagar">Costo total</Label>
                    <Input
                      id="totalPagar"
                      value={
                        watch("totalPagar")
                          ? `${cliente?.pais.simbolo_moneda}${watch("totalPagar")}`
                          : ""
                      }
                      readOnly
                      placeholder="Costo se calculará automáticamente"
                    />
                  </div>
                </div>

                {watch("totalPagar") > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-xs text-center italic">
                      LOS PRECIOS PUEDEN VARIAR DEPENDIENDO DE LOS INSUMOS QUE
                      SE UTILICEN
                    </p>
                  </div>
                )}

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      "Confirmar Cita"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgregarCitaServicioPage;
