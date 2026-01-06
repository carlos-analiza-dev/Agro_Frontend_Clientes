"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { tipoReproduccionOptions } from "@/helpers/data/tipoReproduccionOptions";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, InfoIcon, PawPrintIcon } from "lucide-react";
import { useAuthStore } from "@/providers/store/useAuthStore";
import {
  CrearAnimalByFinca,
  TipoComplemento,
} from "@/api/animales/interfaces/crear-animal.interface";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { CreateAnimal } from "@/api/animales/accions/crear-animal";
import { toast } from "react-toastify";
import { sexoOptions } from "@/helpers/data/sexo_animales";
import { purezaOptions } from "@/helpers/data/purezaOptions";
import { complementosOptions } from "@/helpers/data/complementos";
import { alimentosOptions } from "@/helpers/data/alimentos";
import { dataProduccion } from "@/helpers/data/dataProduccion";
import { dataTipoProduccion } from "@/helpers/data/dataTipoProduccion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const CrearAnimalPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();
  const [activeTab, setActiveTab] = useState("animal");
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [showIdentifierHelpPadre, setShowIdentifierHelpPadre] = useState(false);
  const [showIdentifierHelpMadre, setShowIdentifierHelpMadre] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<
    CrearAnimalByFinca & {
      identificador_temp: string;
      identificador_temp_padre: string;
      identificador_temp_madre: string;
    }
  >({
    defaultValues: {
      identificador: "",
      arete_padre: "",
      arete_madre: "",
    },
  });

  const { data: especies } = useGetEspecies();
  const especieId = watch("especie");
  const { data: razas } = useGetRazasByEspecie(especieId);
  const { data: fincas } = useFincasPropietarios(cliente?.id ?? "");
  const selectedSexo = watch("sexo");

  const especiesItmes =
    especies?.data.map((especie) => ({
      label: especie.nombre,
      value: especie.id,
    })) || [];

  const sexoItems = sexoOptions.map((sexo) => ({
    label: sexo.label,
    value: sexo.value,
  }));

  const produccionItems = dataProduccion.map((produccion) => ({
    label: produccion.label,
    value: produccion.value,
  }));

  const tipoProduccionItems = dataTipoProduccion.map((produccion) => ({
    label: produccion.label,
    value: produccion.value,
  }));

  useEffect(() => {
    if (selectedSexo === "Macho") {
      setValue("esterelizado", false);
    } else if (selectedSexo === "Hembra") {
      setValue("castrado", false);
    }
  }, [selectedSexo, setValue]);

  const getIdentifierPrefix = () => {
    const especie = especies?.data.find((e) => e.id === watch("especie"));
    const razaIds: string[] = watch("razaIds");
    const sexo = watch("sexo");

    if (!especie || !razaIds || razaIds.length === 0 || !sexo) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();

    const razaCodes = razaIds
      .map((id) =>
        razas?.data.find((r) => r.id === id)?.abreviatura?.toUpperCase()
      )
      .filter(Boolean);

    if (razaCodes.length === 0) return null;

    const combinedRazaCode =
      razaCodes.length === 1 ? razaCodes[0] : `${razaCodes[0]}${razaCodes[1]}`;

    const sexoCode = sexo === "Macho" ? "1" : "2";

    return `${especieCode}${combinedRazaCode}${sexoCode}`;
  };

  const getIdentifierPrefixPadre = () => {
    const especie = especies?.data.find((e) => e.id === watch("especie"));
    const razaIdsPadre: string[] = watch("razas_padre") || [];
    const sexo = "1";

    if (!especie || !razaIdsPadre || razaIdsPadre.length === 0) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();

    const razaCodes = razaIdsPadre
      .map((id) =>
        razas?.data.find((r) => r.id === id)?.abreviatura?.toUpperCase()
      )
      .filter(Boolean);

    if (razaCodes.length === 0) return null;

    const combinedRazaCode =
      razaCodes.length === 1 ? razaCodes[0] : `${razaCodes[0]}${razaCodes[1]}`;

    return `${especieCode}${combinedRazaCode}${sexo}`;
  };

  const getIdentifierPrefixMadre = () => {
    const especie = especies?.data.find((e) => e.id === watch("especie"));
    const razaIdsMadre: string[] = watch("razas_madre") || [];
    const sexo = "2";

    if (!especie || !razaIdsMadre || razaIdsMadre.length === 0) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();

    const razaCodes = razaIdsMadre
      .map((id) =>
        razas?.data.find((r) => r.id === id)?.abreviatura?.toUpperCase()
      )
      .filter(Boolean);

    if (razaCodes.length === 0) return null;

    const combinedRazaCode =
      razaCodes.length === 1 ? razaCodes[0] : `${razaCodes[0]}${razaCodes[1]}`;

    return `${especieCode}${combinedRazaCode}${sexo}`;
  };

  const formatNumber = (num: string) => {
    return num.padStart(6, "0");
  };

  useEffect(() => {
    const temp = watch("identificador_temp");
    if (temp && temp.length === 6) {
      const prefix = getIdentifierPrefix();
      if (prefix) {
        const identificadorCompleto = `${prefix}-${formatNumber(temp)}`;
        setValue("identificador", identificadorCompleto);
      }
    }
  }, [
    watch("identificador_temp"),
    watch("especie"),
    watch("razaIds"),
    watch("sexo"),
  ]);

  useEffect(() => {
    const temp = watch("identificador_temp_padre");
    if (temp && temp.length === 6) {
      const prefix = getIdentifierPrefixPadre();
      if (prefix) {
        const aretePadreCompleto = `${prefix}-${formatNumber(temp)}`;
        setValue("arete_padre", aretePadreCompleto);
      }
    }
  }, [
    watch("identificador_temp_padre"),
    watch("especie"),
    watch("razas_padre"),
  ]);

  useEffect(() => {
    const temp = watch("identificador_temp_madre");
    if (temp && temp.length === 6) {
      const prefix = getIdentifierPrefixMadre();
      if (prefix) {
        const areteMadreCompleto = `${prefix}-${formatNumber(temp)}`;
        setValue("arete_madre", areteMadreCompleto);
      }
    }
  }, [
    watch("identificador_temp_madre"),
    watch("especie"),
    watch("razas_madre"),
  ]);

  const handleIdentifierChange = (input: string) => {
    const numbersOnly = input.replace(/\D/g, "").slice(0, 6);
    setValue("identificador_temp", numbersOnly);
  };

  const handleIdentifierChangePadre = (input: string) => {
    const numbersOnly = input.replace(/\D/g, "").slice(0, 6);
    setValue("identificador_temp_padre", numbersOnly);
  };

  const handleIdentifierChangeMadre = (input: string) => {
    const numbersOnly = input.replace(/\D/g, "").slice(0, 6);
    setValue("identificador_temp_madre", numbersOnly);
  };

  const fincasItems =
    fincas?.data.fincas.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const mutation = useMutation({
    mutationFn: (data: CrearAnimalByFinca) => CreateAnimal(data),
    onSuccess: () => {
      toast.success("Animal creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      reset();
      router.push("/animales");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el animal";

        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    },
  });

  const onSubmit = (data: CrearAnimalByFinca) => {
    if (!cliente?.id) return;

    if (!data.especie) {
      toast.error("Debes seleccionar una especie");
      return;
    }

    if (!data.razaIds || data.razaIds.length === 0) {
      toast.error("Debes seleccionar al menos una raza");
      return;
    }

    if (!data.sexo) {
      toast.error("Debes seleccionar un sexo");
      return;
    }

    if (
      !data.identificador ||
      !/^[A-ZÁÉÍÓÚÑ]{2}[A-ZÁÉÍÓÚÑ]{3,7}[12]-\d{6}$/.test(data.identificador)
    ) {
      toast.error("El identificador debe tener 6 dígitos");
      return;
    }

    const animalData = {
      ...data,
      propietarioId: cliente.id,
    };

    delete (animalData as any).identificador_temp;
    delete (animalData as any).identificador_temp_padre;
    delete (animalData as any).identificador_temp_madre;

    mutation.mutate(animalData);
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/animales")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>
      <div className="flex items-center mb-6">
        <PawPrintIcon className="h-8 w-8 mr-2" />
        <h1 className="text-3xl font-bold">Crear Nuevo Animal</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="animal">Datos Animal</TabsTrigger>
          <TabsTrigger value="padre">Datos Padre</TabsTrigger>
          <TabsTrigger value="madre">Datos Madre</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TabsContent value="animal">
            <Card>
              <CardHeader>
                <CardTitle>Datos del Animal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Especie *</Label>
                  <Select
                    value={watch("especie") || ""}
                    onValueChange={(value) => setValue("especie", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una especie" />
                    </SelectTrigger>
                    <SelectContent>
                      {especiesItmes.map((especie) => (
                        <SelectItem key={especie.value} value={especie.value}>
                          {especie.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.especie && (
                    <p className="text-sm text-red-500">
                      {errors.especie.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Sexo *</Label>
                  <Select
                    value={watch("sexo") || ""}
                    onValueChange={(value) => setValue("sexo", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      {sexoItems.map((sexo) => (
                        <SelectItem key={sexo.value} value={sexo.value}>
                          {sexo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sexo && (
                    <p className="text-sm text-red-500">
                      {errors.sexo.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    {...register("color")}
                    placeholder="Color del animal"
                  />
                  {errors.color && (
                    <p className="text-sm text-red-500">
                      {errors.color.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Arete (6 dígitos) *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={watch("identificador_temp") || ""}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      className="flex-1"
                    />
                    <TooltipProvider>
                      <Tooltip
                        open={showIdentifierHelp}
                        onOpenChange={setShowIdentifierHelp}
                      >
                        <TooltipTrigger asChild>
                          <Button type="button" variant="outline" size="icon">
                            <InfoIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            PRIMEROS SEIS DÍGITOS DE IDENTIFICACIÓN DEL ARETE
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {errors.identificador && (
                    <p className="text-sm text-red-500">
                      {errors.identificador.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Razas del Animal</Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      const currentValues = watch("razaIds") || [];
                      if (!currentValues.includes(value)) {
                        setValue("razaIds", [...currentValues, value]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una o más razas" />
                    </SelectTrigger>
                    <SelectContent>
                      {razas?.data
                        .filter((raza) => !watch("razaIds")?.includes(raza.id))
                        .map((raza) => (
                          <SelectItem key={raza.id} value={raza.id}>
                            {raza.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {watch("razaIds")?.map((razaId) => {
                      const raza = razas?.data.find((r) => r.id === razaId);
                      return raza ? (
                        <span
                          key={razaId}
                          className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm flex items-center gap-1"
                        >
                          {raza.nombre}
                          <button
                            type="button"
                            onClick={() => {
                              const currentValues = watch("razaIds") || [];
                              setValue(
                                "razaIds",
                                currentValues.filter((v) => v !== razaId)
                              );
                            }}
                            className="ml-1 rounded-full hover:bg-primary-foreground hover:text-primary"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>

                  {errors.razaIds && (
                    <p className="text-sm text-red-500">
                      {errors.razaIds.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nivel de Pureza</Label>
                  <Select
                    value={watch("pureza") || ""}
                    onValueChange={(value) => setValue("pureza", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona nivel de pureza" />
                    </SelectTrigger>
                    <SelectContent>
                      {purezaOptions.map((pureza) => (
                        <SelectItem key={pureza.value} value={pureza.value}>
                          {pureza.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Reproducción</Label>
                  <Select
                    value={watch("tipo_reproduccion") || ""}
                    onValueChange={(value) =>
                      setValue("tipo_reproduccion", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo de reproducción" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipoReproduccionOptions.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tipo_reproduccion && (
                    <p className="text-sm text-red-500">
                      {errors.tipo_reproduccion.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Producción</Label>
                  <Select
                    value={watch("produccion") || ""}
                    onValueChange={(value) => setValue("produccion", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la producción" />
                    </SelectTrigger>
                    <SelectContent>
                      {produccionItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.produccion && (
                    <p className="text-sm text-red-500">
                      {errors.produccion.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Producción</Label>
                  <Select
                    value={watch("tipo_produccion") || ""}
                    onValueChange={(value) =>
                      setValue("tipo_produccion", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo de producción" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipoProduccionItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tipo_produccion && (
                    <p className="text-sm text-red-500">
                      {errors.tipo_produccion.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fecha_nacimiento"
                    type="date"
                    {...register("fecha_nacimiento")}
                    onChange={(e) => {
                      setValue("fecha_nacimiento", e.target.value);
                    }}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full"
                  />
                  {errors.fecha_nacimiento && (
                    <p className="text-sm text-red-500">
                      {errors.fecha_nacimiento.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Alimentación</Label>
                  <div className="border rounded-md p-3 space-y-3">
                    {alimentosOptions.map((alimento) => {
                      const alimentoSeleccionado = watch(
                        "tipo_alimentacion"
                      )?.find((a: any) => a.alimento === alimento.value);

                      return (
                        <div key={alimento.value} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={!!alimentoSeleccionado}
                                onCheckedChange={(checked) => {
                                  const isChecked = checked === true;
                                  const currentAlimentacion =
                                    watch("tipo_alimentacion") || [];

                                  if (isChecked) {
                                    setValue("tipo_alimentacion", [
                                      ...currentAlimentacion,
                                      {
                                        alimento: alimento.value,
                                        origen: "comprado",
                                      },
                                    ]);
                                  } else {
                                    setValue(
                                      "tipo_alimentacion",
                                      currentAlimentacion.filter(
                                        (a: any) =>
                                          a.alimento !== alimento.value
                                      )
                                    );
                                  }
                                }}
                              />
                              <span className="text-sm">{alimento.label}</span>
                            </div>
                          </div>

                          {alimentoSeleccionado && (
                            <div className="pl-6 space-y-2">
                              <RadioGroup
                                value={alimentoSeleccionado.origen}
                                onValueChange={(origen) => {
                                  const updated = (
                                    watch("tipo_alimentacion") || []
                                  ).map((item: any) =>
                                    item.alimento === alimento.value
                                      ? { ...item, origen }
                                      : item
                                  );
                                  setValue("tipo_alimentacion", updated);
                                }}
                              >
                                <div className="flex flex-col space-y-2">
                                  {[
                                    "comprado",
                                    "producido",
                                    "comprado y producido",
                                  ].map((origen) => (
                                    <div
                                      key={origen}
                                      className="flex items-center space-x-2"
                                    >
                                      <RadioGroupItem
                                        value={origen}
                                        id={`${alimento.value}-${origen}`}
                                      />
                                      <Label
                                        htmlFor={`${alimento.value}-${origen}`}
                                        className="text-sm"
                                      >
                                        {origen === "comprado"
                                          ? "Comprado"
                                          : origen === "producido"
                                            ? "Producido"
                                            : "Comprado y producido"}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </RadioGroup>

                              {alimentoSeleccionado.origen ===
                                "comprado y producido" && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <Label className="text-xs">
                                      % Comprado
                                    </Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={
                                        alimentoSeleccionado.porcentaje_comprado ||
                                        ""
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined;
                                        const updated = (
                                          watch("tipo_alimentacion") || []
                                        ).map((item: any) =>
                                          item.alimento === alimento.value
                                            ? {
                                                ...item,
                                                porcentaje_comprado: value,
                                              }
                                            : item
                                        );
                                        setValue("tipo_alimentacion", updated);
                                      }}
                                      placeholder="Ej: 60"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">
                                      % Producido
                                    </Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={
                                        alimentoSeleccionado.porcentaje_producido ||
                                        ""
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined;
                                        const updated = (
                                          watch("tipo_alimentacion") || []
                                        ).map((item: any) =>
                                          item.alimento === alimento.value
                                            ? {
                                                ...item,
                                                porcentaje_producido: value,
                                              }
                                            : item
                                        );
                                        setValue("tipo_alimentacion", updated);
                                      }}
                                      placeholder="Ej: 40"
                                    />
                                  </div>
                                  {alimentoSeleccionado.porcentaje_comprado !==
                                    undefined &&
                                    alimentoSeleccionado.porcentaje_producido !==
                                      undefined &&
                                    alimentoSeleccionado.porcentaje_comprado +
                                      alimentoSeleccionado.porcentaje_producido !==
                                      100 && (
                                      <p className="text-xs text-red-500 col-span-2">
                                        La suma de porcentajes debe ser 100%
                                      </p>
                                    )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Complemento</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {complementosOptions.map((complemento) => (
                      <div
                        key={complemento.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={
                            watch("complementos")?.some(
                              (c: TipoComplemento) =>
                                c.complemento === complemento.value
                            ) || false
                          }
                          onCheckedChange={(checked) => {
                            const isChecked = checked === true;
                            const currentComplementos =
                              watch("complementos") || [];

                            if (isChecked) {
                              setValue("complementos", [
                                ...currentComplementos,
                                { complemento: complemento.value },
                              ]);
                            } else {
                              setValue(
                                "complementos",
                                currentComplementos.filter(
                                  (c: TipoComplemento) =>
                                    c.complemento !== complemento.value
                                )
                              );
                            }
                          }}
                        />
                        <Label className="text-sm">{complemento.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Medicamentos (opcional)</Label>
                  <Input
                    {...register("medicamento")}
                    placeholder="Medicamentos"
                  />
                  {errors.medicamento && (
                    <p className="text-sm text-red-500">
                      {errors.medicamento.message}
                    </p>
                  )}
                </div>

                {watch("sexo") === "Macho" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={watch("castrado") || false}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        setValue("castrado", isChecked);
                      }}
                    />
                    <Label>Castrado</Label>
                  </div>
                )}

                {watch("sexo") === "Hembra" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={watch("esterelizado") || false}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        setValue("esterelizado", isChecked);
                      }}
                    />
                    <Label>Esterilizado</Label>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Características</Label>
                  <Textarea
                    {...register("observaciones")}
                    placeholder="Características del animal"
                    className="min-h-[100px]"
                  />
                  {errors.observaciones && (
                    <p className="text-sm text-red-500">
                      {errors.observaciones.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Finca</Label>
                  <Select
                    value={watch("fincaId") || ""}
                    onValueChange={(value) => setValue("fincaId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una finca" />
                    </SelectTrigger>
                    <SelectContent>
                      {fincasItems.map((finca) => (
                        <SelectItem key={finca.value} value={finca.value}>
                          {finca.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fincaId && (
                    <p className="text-sm text-red-500">
                      {errors.fincaId.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={watch("compra_animal") || false}
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true;
                      setValue("compra_animal", isChecked);
                    }}
                  />
                  <Label>¿Animal fue comprado?</Label>
                </div>

                {watch("compra_animal") && (
                  <div className="space-y-2">
                    <Label>Nombre del criador (origen)</Label>
                    <Input
                      {...register("nombre_criador_origen_animal")}
                      placeholder="Nombre del criador"
                    />
                    {errors.nombre_criador_origen_animal && (
                      <p className="text-sm text-red-500">
                        {errors.nombre_criador_origen_animal.message}
                      </p>
                    )}
                  </div>
                )}

                <Button type="button" onClick={() => setActiveTab("padre")}>
                  Siguiente: Datos del Padre
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PESTAÑA DATOS PADRE */}
          <TabsContent value="padre">
            <Card>
              <CardHeader>
                <CardTitle>Datos del Padre</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre Padre (opcional)</Label>
                  <Input
                    {...register("nombre_padre")}
                    placeholder="Nombre del padre"
                  />
                  {errors.nombre_padre && (
                    <p className="text-sm text-red-500">
                      {errors.nombre_padre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Arete Padre (6 dígitos)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={watch("identificador_temp_padre") || ""}
                      onChange={(e) =>
                        handleIdentifierChangePadre(e.target.value)
                      }
                      placeholder="000000"
                      maxLength={6}
                      className="flex-1"
                    />
                    <TooltipProvider>
                      <Tooltip
                        open={showIdentifierHelpPadre}
                        onOpenChange={setShowIdentifierHelpPadre}
                      >
                        <TooltipTrigger asChild>
                          <Button type="button" variant="outline" size="icon">
                            <InfoIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            PRIMEROS SEIS DÍGITOS DE IDENTIFICACIÓN DEL ARETE
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {errors.arete_padre && (
                    <p className="text-sm text-red-500">
                      {errors.arete_padre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Razas del Padre</Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      const currentValues = watch("razas_padre") || [];
                      if (!currentValues.includes(value)) {
                        setValue("razas_padre", [...currentValues, value]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una o más razas" />
                    </SelectTrigger>
                    <SelectContent>
                      {razas?.data
                        .filter(
                          (raza) => !watch("razas_padre")?.includes(raza.id)
                        )
                        .map((raza) => (
                          <SelectItem key={raza.id} value={raza.id}>
                            {raza.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {watch("razas_padre")?.map((razaId) => {
                      const raza = razas?.data.find((r) => r.id === razaId);
                      return raza ? (
                        <span
                          key={razaId}
                          className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm flex items-center gap-1"
                        >
                          {raza.nombre}
                          <button
                            type="button"
                            onClick={() => {
                              const currentValues = watch("razas_padre") || [];
                              setValue(
                                "razas_padre",
                                currentValues.filter((v) => v !== razaId)
                              );
                            }}
                            className="ml-1 rounded-full hover:bg-primary-foreground hover:text-primary"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>

                  {errors.razas_padre && (
                    <p className="text-sm text-red-500">
                      {errors.razas_padre.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Nivel de Pureza del Padre</Label>
                  <Select
                    value={watch("pureza_padre") || ""}
                    onValueChange={(value) => setValue("pureza_padre", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona nivel de pureza" />
                    </SelectTrigger>
                    <SelectContent>
                      {purezaOptions.map((pureza) => (
                        <SelectItem key={pureza.value} value={pureza.value}>
                          {pureza.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pureza_padre && (
                    <p className="text-sm text-red-500">
                      {errors.pureza_padre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nombre Criador del Padre</Label>
                  <Input
                    {...register("nombre_criador_padre")}
                    placeholder="Nombre del criador"
                  />
                  {errors.nombre_criador_padre && (
                    <p className="text-sm text-red-500">
                      {errors.nombre_criador_padre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nombre Propietario del Padre</Label>
                  <Input
                    {...register("nombre_propietario_padre")}
                    placeholder="Nombre del propietario"
                  />
                  {errors.nombre_propietario_padre && (
                    <p className="text-sm text-red-500">
                      {errors.nombre_propietario_padre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nombre de la Finca de Origen del Padre</Label>
                  <Input
                    {...register("nombre_finca_origen_padre")}
                    placeholder="Nombre de la finca"
                  />
                  {errors.nombre_finca_origen_padre && (
                    <p className="text-sm text-red-500">
                      {errors.nombre_finca_origen_padre.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("animal")}
                  >
                    Anterior
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("madre")}>
                    Siguiente: Datos de la Madre
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PESTAÑA DATOS MADRE */}
          <TabsContent value="madre">
            <Card>
              <CardHeader>
                <CardTitle>Datos de la Madre</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre Madre (opcional)</Label>
                  <Input
                    value={watch("nombre_madre") || ""}
                    onChange={(e) => setValue("nombre_madre", e.target.value)}
                    placeholder="Nombre de la madre"
                    className="flex-1"
                  />
                  {errors.nombre_madre && (
                    <p className="text-sm text-red-500">
                      {errors.nombre_madre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Arete Madre (6 dígitos)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={watch("identificador_temp_madre") || ""}
                      onChange={(e) =>
                        handleIdentifierChangeMadre(e.target.value)
                      }
                      placeholder="000000"
                      maxLength={6}
                      className="flex-1"
                    />
                    <TooltipProvider>
                      <Tooltip
                        open={showIdentifierHelpMadre}
                        onOpenChange={setShowIdentifierHelpMadre}
                      >
                        <TooltipTrigger asChild>
                          <Button type="button" variant="outline" size="icon">
                            <InfoIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            PRIMEROS SEIS DÍGITOS DE IDENTIFICACIÓN DEL ARETE
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {errors.arete_madre && (
                    <p className="text-sm text-red-500">
                      {errors.arete_madre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Razas de la Madre</Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      const currentValues = watch("razas_madre") || [];
                      if (!currentValues.includes(value)) {
                        setValue("razas_madre", [...currentValues, value]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una o más razas" />
                    </SelectTrigger>
                    <SelectContent>
                      {razas?.data
                        .filter(
                          (raza) => !watch("razas_madre")?.includes(raza.id)
                        )
                        .map((raza) => (
                          <SelectItem key={raza.id} value={raza.id}>
                            {raza.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {watch("razas_madre")?.map((razaId) => {
                      const raza = razas?.data.find((r) => r.id === razaId);
                      return raza ? (
                        <span
                          key={razaId}
                          className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm flex items-center gap-1"
                        >
                          {raza.nombre}
                          <button
                            type="button"
                            onClick={() => {
                              const currentValues = watch("razas_madre") || [];
                              setValue(
                                "razas_madre",
                                currentValues.filter((v) => v !== razaId)
                              );
                            }}
                            className="ml-1 rounded-full hover:bg-primary-foreground hover:text-primary"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>

                  {errors.razas_madre && (
                    <p className="text-sm text-red-500">
                      {errors.razas_madre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nivel de pureza</Label>
                  <Select
                    value={watch("pureza_madre") || ""}
                    onValueChange={(value) => setValue("pureza_madre", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona nivel de pureza" />
                    </SelectTrigger>
                    <SelectContent>
                      {purezaOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pureza_madre && (
                    <p className="text-sm text-red-500">
                      {errors.pureza_madre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nombre Criador</Label>
                  <Input
                    value={watch("nombre_criador_madre") || ""}
                    onChange={(e) =>
                      setValue("nombre_criador_madre", e.target.value)
                    }
                    placeholder="Nombre del criador"
                    className="flex-1"
                  />
                  {errors.nombre_criador_madre && (
                    <p className="text-sm text-red-500">
                      {errors.nombre_criador_madre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nombre Propietario</Label>
                  <Input
                    value={watch("nombre_propietario_madre") || ""}
                    onChange={(e) =>
                      setValue("nombre_propietario_madre", e.target.value)
                    }
                    placeholder="Nombre del propietario"
                    className="flex-1"
                  />
                  {errors.nombre_propietario_madre && (
                    <p className="text-sm text-red-500">
                      {errors.nombre_propietario_madre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Número de parto</Label>
                  <Input
                    value={watch("numero_parto_madre") || ""}
                    min={1}
                    onChange={(e) => {
                      const value = e.target.value;

                      const numericValue = value ? Number(value) : undefined;
                      setValue(
                        "numero_parto_madre",
                        numericValue !== undefined && !isNaN(numericValue)
                          ? numericValue
                          : undefined
                      );
                    }}
                    placeholder="Número de parto"
                    maxLength={2}
                    className="flex-1"
                    type="number"
                  />
                  {errors.numero_parto_madre && (
                    <p className="text-sm text-red-500">
                      {errors.numero_parto_madre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nombre de la finca</Label>
                  <Input
                    value={watch("nombre_finca_origen_madre") || ""}
                    onChange={(e) =>
                      setValue("nombre_finca_origen_madre", e.target.value)
                    }
                    placeholder="Nombre de la finca de origen"
                    className="flex-1"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("padre")}
                  >
                    Anterior
                  </Button>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Creando..." : "Crear Animal"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
};

export default CrearAnimalPage;
