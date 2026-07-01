import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { ArrowRight, InfoIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { complementosOptions } from "@/helpers/data/complementos";
import {
  CrearAnimalByFinca,
  TipoComplemento,
} from "@/api/animales/interfaces/crear-animal.interface";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import useAnimalById from "@/hooks/animales/useAnimalById";
import { useForm } from "react-hook-form";
import { extractNumberFromIdentifier } from "@/helpers/funciones/extractNumberFromIdentifier ";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { SexoAnimal } from "@/interfaces/enums/animales/sexo-animal.enum";
import { sexoOptions } from "@/helpers/data/sexo_animales";
import { dataTipoProduccion } from "@/helpers/data/dataTipoProduccion";
import { ActualizarAnimal } from "@/api/animales/accions/update-animal";
import { isAxiosError } from "axios";
import { purezaOptions } from "@/helpers/data/purezaOptions";
import { alimentosOptions } from "@/helpers/data/alimentos";
import { tipoReproduccionOptions } from "@/helpers/data/tipoReproduccionOptions";

interface Props {
  animalId: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  animal: Animal;
}

const FormEditAnimales = ({ animal, animalId, setActiveTab }: Props) => {
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [showIdentifierHelpPadre, setShowIdentifierHelpPadre] = useState(false);
  const [showIdentifierHelpMadre, setShowIdentifierHelpMadre] = useState(false);
  const [edadAnimal, setEdadAnimal] = useState(0);
  const [isPadreFinca, setIsPadreFinca] = useState(false);
  const [isMadreFinca, setIsMadreFinca] = useState(false);
  const [selectedMadreId, setSelectedMadreId] = useState("");
  const [selectedPadreId, setSelectedPadreId] = useState("");
  const [searchPadreTerm, setSearchPadreTerm] = useState("");
  const [searchMadreTerm, setSearchMadreTerm] = useState("");
  const [filteredMachos, setFilteredMachos] = useState<Animal[]>([]);
  const [filteredHembras, setFilteredHembras] = useState<Animal[]>([]);
  const [isPadreDropdownOpen, setIsPadreDropdownOpen] = useState(false);
  const [isMadreDropdownOpen, setIsMadreDropdownOpen] = useState(false);
  const [tipoAlimentacion, setTipoAlimentacion] = useState<
    {
      alimento: string;
      origen: string;
      porcentaje_comprado?: number;
      porcentaje_producido?: number;
    }[]
  >([]);
  const [complementoSeleccionados, setComplementoSeleccionados] = useState<
    string[]
  >([]);

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
  3;

  useEffect(() => {
    if (animal) {
      reset({
        especie: animal?.especie?.id || "",
        sexo: animal?.sexo || "",
        color: animal?.color || "",
        nombre_animal: animal?.nombre_animal || "",
        tipo_produccion: animal?.tipo_produccion || "",
        identificador_temp: extractNumberFromIdentifier(animal?.identificador),
        identificador_temp_madre: extractNumberFromIdentifier(
          animal?.arete_madre ?? "",
        ),
        identificador_temp_padre: extractNumberFromIdentifier(
          animal?.arete_padre ?? "",
        ),
        identificador: animal?.identificador || "",
        arete_madre: animal?.arete_madre || "",
        arete_padre: animal?.arete_padre || "",
        razaIds: animal?.razas?.map((raza) => raza.id) || [],
        pureza: animal?.pureza,
        edad_promedio: Number(animal?.edad_promedio) || 0,
        fecha_nacimiento: animal?.fecha_nacimiento || "",
        castrado: animal?.castrado || false,
        esterelizado: animal?.esterelizado || false,
        observaciones: animal?.observaciones || "",
        fincaId: animal?.finca?.id || "",
        propietarioId: animal?.propietario?.id || "",
        medicamento: animal?.medicamento || "",
        compra_animal: animal?.compra_animal,
        nombre_criador_origen_animal: animal?.nombre_criador_origen_animal,
        tipo_reproduccion: animal?.tipo_reproduccion || "",
        tipo_alimentacion: animal?.tipo_alimentacion || "",
        nombre_padre: animal?.nombre_padre || "",
        razas_padre: animal?.razas_padre?.map((raza) => raza.id) || [],
        pureza_padre: animal?.pureza_padre,
        nombre_criador_padre: animal?.nombre_criador_padre || "",
        nombre_propietario_padre: animal?.nombre_propietario_padre || "",
        nombre_finca_origen_padre: animal?.nombre_finca_origen_padre || "",
        nombre_madre: animal?.nombre_madre || "",
        razas_madre: animal?.razas_madre?.map((raza) => raza.id) || [],
        pureza_madre: animal?.pureza_madre,
        nombre_criador_madre: animal?.nombre_criador_madre || "",
        nombre_propietario_madre: animal?.nombre_propietario_madre || "",
        nombre_finca_origen_madre: animal?.nombre_finca_origen_madre || "",
        numero_parto_madre: animal?.numero_parto_madre || 0,
      });

      if (animal?.tipo_alimentacion) {
        setTipoAlimentacion(animal.tipo_alimentacion);
      }

      if (animal?.complementos && animal.complementos.length > 0) {
        const complementosArray = animal.complementos.map((c) => ({
          complemento: c.complemento,
        }));
        setValue("complementos", complementosArray);
        setComplementoSeleccionados(
          animal.complementos.map((c) => c.complemento),
        );
      } else {
        setValue("complementos", []);
        setComplementoSeleccionados([]);
      }
      if (animal.fecha_nacimiento) {
        const nacimiento = new Date(animal.fecha_nacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        const dia = hoy.getDate() - nacimiento.getDate();

        if (mes < 0 || (mes === 0 && dia < 0)) {
          edad--;
        }
        edad = Math.max(0, edad);
        setEdadAnimal(edad);
        setValue("edad_promedio", edad);
      } else if (animal.edad_promedio) {
        setEdadAnimal(Number(animal.edad_promedio));
        setValue("edad_promedio", Number(animal.edad_promedio));
      }
      if (animal.padre) {
        setSelectedPadreId(animal.padre.id);
        setSearchPadreTerm(
          `${animal.padre.identificador} - ${animal.padre.nombre_animal || "Sin nombre"}`,
        );
        setIsPadreFinca(true);
      }

      if (animal.madre) {
        setSelectedMadreId(animal.madre.id);
        setSearchMadreTerm(
          `${animal.madre.identificador} - ${animal.madre.nombre_animal || "Sin nombre"}`,
        );
        setIsMadreFinca(true);
      }
    }
  }, [animal, reset]);

  const { data: especies } = useGetEspecies();
  const especieId = watch("especie");
  const { data: razas } = useGetRazasByEspecie(especieId);
  const { data: fincas } = useFincasPropietarios(cliente?.id ?? "");
  const selectedSexo = watch("sexo");
  const { data: machos } = useGetAnimalesPropietario({
    sexo: SexoAnimal.Macho,
    especieId,
  });

  const { data: hembras } = useGetAnimalesPropietario({
    sexo: SexoAnimal.Hembra,
    especieId,
  });
  const fechaNacimiento = watch("fecha_nacimiento");

  useEffect(() => {
    if (fechaNacimiento) {
      const nacimiento = new Date(fechaNacimiento);
      const hoy = new Date();

      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      const dia = hoy.getDate() - nacimiento.getDate();

      if (mes < 0 || (mes === 0 && dia < 0)) {
        edad--;
      }

      edad = Math.max(0, edad);

      setEdadAnimal(edad);
      setValue("edad_promedio", edad, {
        shouldValidate: true,
      });
    }
  }, [fechaNacimiento, setValue]);

  useEffect(() => {
    if (machos) {
      const filtered = machos.filter(
        (macho) =>
          macho.identificador
            .toLowerCase()
            .includes(searchPadreTerm.toLowerCase()) ||
          (macho.nombre_animal &&
            macho.nombre_animal
              .toLowerCase()
              .includes(searchPadreTerm.toLowerCase())),
      );
      setFilteredMachos(filtered);
    }
  }, [searchPadreTerm, machos, especieId]);

  useEffect(() => {
    if (hembras) {
      const filtered = hembras.filter(
        (hembra) =>
          hembra.identificador
            .toLowerCase()
            .includes(searchMadreTerm.toLowerCase()) ||
          (hembra.nombre_animal &&
            hembra.nombre_animal
              .toLowerCase()
              .includes(searchMadreTerm.toLowerCase())),
      );
      setFilteredHembras(filtered);
    }
  }, [searchMadreTerm, hembras, especieId]);

  useEffect(() => {
    setSearchPadreTerm("");
    setSearchMadreTerm("");
    setSelectedPadreId("");
    setSelectedMadreId("");
    setIsPadreDropdownOpen(false);
    setIsMadreDropdownOpen(false);
    setFilteredMachos([]);
    setFilteredHembras([]);
  }, [especieId]);

  const especiesItmes =
    especies?.data.map((especie) => ({
      label: especie.nombre,
      value: especie.id,
    })) || [];

  const sexoItems = sexoOptions.map((sexo) => ({
    label: sexo.label,
    value: sexo.value,
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
        razas?.data.find((r) => r.id === id)?.abreviatura?.toUpperCase(),
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
        razas?.data.find((r) => r.id === id)?.abreviatura?.toUpperCase(),
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
        razas?.data.find((r) => r.id === id)?.abreviatura?.toUpperCase(),
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
    mutationFn: (data: CrearAnimalByFinca) => ActualizarAnimal(animalId, data),
    onSuccess: () => {
      toast.success("Animal actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      queryClient.invalidateQueries({ queryKey: ["animal-id", animalId] });
      window.location.reload();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el animal";

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

    if (isPadreFinca && !selectedPadreId) {
      toast.error("Debes seleccionar un padre de la finca");
      return;
    }

    if (isMadreFinca && !selectedMadreId) {
      toast.error("Debes seleccionar una madre de la finca");
      return;
    }

    const animalData = {
      ...data,
      propietarioId: cliente.id,
      padreId: isPadreFinca ? selectedPadreId : undefined,
      madreId: isMadreFinca ? selectedMadreId : undefined,
    };

    if (animalData.fecha_nacimiento) {
      const fecha = new Date(animalData.fecha_nacimiento);
      fecha.setDate(fecha.getDate() + 1);

      animalData.fecha_nacimiento = fecha.toISOString().split("T")[0];
    }

    delete (animalData as any).identificador_temp;
    delete (animalData as any).identificador_temp_padre;
    delete (animalData as any).identificador_temp_madre;

    mutation.mutate(animalData);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TabsContent value="animal">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Datos del Animal
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa la información del animal. Los campos con{" "}
              <span className="text-red-500">*</span> son obligatorios.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                Identificación
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Especie <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={
                      watch("especie") || (animal ? animal.especie.id : "")
                    }
                    onValueChange={(value) => setValue("especie", value)}
                    className="grid grid-cols-2 gap-2"
                  >
                    {especiesItmes.map((especie) => (
                      <div
                        key={especie.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={especie.value}
                          id={`especie-${especie.value}`}
                        />
                        <Label
                          htmlFor={`especie-${especie.value}`}
                          className="text-sm"
                        >
                          {especie.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.especie && (
                    <p className="text-sm text-red-500">
                      {errors.especie.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Sexo <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={watch("sexo") || (animal ? animal.sexo : "")}
                    onValueChange={(value) => setValue("sexo", value)}
                    className="grid grid-cols-2 gap-2"
                  >
                    {sexoItems.map((sexo) => (
                      <div
                        key={sexo.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={sexo.value}
                          id={`sexo-${sexo.value}`}
                        />
                        <Label
                          htmlFor={`sexo-${sexo.value}`}
                          className="text-sm"
                        >
                          {sexo.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.sexo && (
                    <p className="text-sm text-red-500">
                      {errors.sexo.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Nombre (opcional)
                  </Label>
                  <Input
                    {...register("nombre_animal")}
                    placeholder="Ej: Lucero, Toro, etc."
                    className="w-full"
                  />
                  {errors.nombre_animal && (
                    <p className="text-sm text-red-500">
                      {errors.nombre_animal.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Color (opcional)
                  </Label>
                  <Input
                    {...register("color")}
                    placeholder="Ej: Negro, Blanco, Café"
                    className="w-full"
                  />
                  {errors.color && (
                    <p className="text-sm text-red-500">
                      {errors.color.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Arete <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={watch("identificador_temp") || ""}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full font-mono text-lg tracking-wider"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <span className="text-xs text-muted-foreground">
                        6 dígitos
                      </span>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip
                      open={showIdentifierHelp}
                      onOpenChange={setShowIdentifierHelp}
                    >
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                        >
                          <InfoIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-xs">
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
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                Razas y Pureza
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Razas <span className="text-red-500">*</span>
                  </Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                    {razas?.data.map((raza) => (
                      <div
                        key={raza.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={watch("razaIds")?.includes(raza.id) || false}
                          onCheckedChange={(checked) => {
                            const currentValues = watch("razaIds") || [];
                            if (checked) {
                              setValue("razaIds", [...currentValues, raza.id]);
                            } else {
                              setValue(
                                "razaIds",
                                currentValues.filter((id) => id !== raza.id),
                              );
                            }
                          }}
                          id={`raza-${raza.id}`}
                        />
                        <Label htmlFor={`raza-${raza.id}`} className="text-sm">
                          {raza.nombre}
                        </Label>
                      </div>
                    ))}
                    {(!razas?.data || razas.data.length === 0) && (
                      <p className="text-sm text-muted-foreground">
                        No hay razas disponibles
                      </p>
                    )}
                  </div>
                  {errors.razaIds && (
                    <p className="text-sm text-red-500">
                      {errors.razaIds.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Nivel de Pureza (opcional)
                  </Label>
                  <RadioGroup
                    value={watch("pureza") || (animal ? animal.pureza : "")}
                    onValueChange={(value) => setValue("pureza", value)}
                    className="space-y-2"
                  >
                    {purezaOptions.map((pureza) => (
                      <div
                        key={pureza.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={pureza.value}
                          id={`pureza-${pureza.value}`}
                        />
                        <Label
                          htmlFor={`pureza-${pureza.value}`}
                          className="text-sm"
                        >
                          {pureza.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                Reproducción y Producción
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Tipo de Reproducción <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={
                      watch("tipo_reproduccion") ||
                      (animal ? animal.tipo_reproduccion : "")
                    }
                    onValueChange={(value) =>
                      setValue("tipo_reproduccion", value)
                    }
                    className="space-y-2"
                  >
                    {tipoReproduccionOptions.map((tipo) => (
                      <div
                        key={tipo.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={tipo.value}
                          id={`reproduccion-${tipo.value}`}
                        />
                        <Label
                          htmlFor={`reproduccion-${tipo.value}`}
                          className="text-sm"
                        >
                          {tipo.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.tipo_reproduccion && (
                    <p className="text-sm text-red-500">
                      {errors.tipo_reproduccion.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Tipo de Producción <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={
                    watch("tipo_produccion") ||
                    (animal ? animal.tipo_produccion : "")
                  }
                  onValueChange={(value) => setValue("tipo_produccion", value)}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                >
                  {tipoProduccionItems.map((item) => (
                    <div
                      key={item.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={item.value}
                        id={`tipo-produccion-${item.value}`}
                      />
                      <Label
                        htmlFor={`tipo-produccion-${item.value}`}
                        className="text-sm"
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.tipo_produccion && (
                  <p className="text-sm text-red-500">
                    {errors.tipo_produccion.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                Edad y Nacimiento
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="fecha_nacimiento"
                    className="text-sm font-medium"
                  >
                    Fecha de Nacimiento (opcional)
                  </Label>
                  <Input
                    id="fecha_nacimiento"
                    type="date"
                    {...register("fecha_nacimiento")}
                    onChange={(e) =>
                      setValue("fecha_nacimiento", e.target.value)
                    }
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
                  <Label className="text-sm font-medium">
                    Edad Promedio <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={edadAnimal}
                    disabled={!!fechaNacimiento}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : Number(e.target.value);
                      setEdadAnimal(value);
                      setValue("edad_promedio", value, {
                        shouldValidate: true,
                      });
                    }}
                    placeholder="Edad en años"
                    className="w-full"
                  />
                  {errors.edad_promedio && (
                    <p className="text-sm text-red-500">
                      {errors.edad_promedio.message}
                    </p>
                  )}
                  {fechaNacimiento && (
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <span>ℹ️</span> La edad se calcula automáticamente
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                Alimentación <span className="text-red-500">*</span>
              </h3>

              <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                {alimentosOptions.map((alimento) => {
                  const tipoAlimentacion = watch("tipo_alimentacion") || [];
                  const alimentoSeleccionado = tipoAlimentacion.find(
                    (a: any) => a.alimento === alimento.value,
                  );

                  return (
                    <div
                      key={alimento.value}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
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
                                    (a: any) => a.alimento !== alimento.value,
                                  ),
                                );
                              }
                            }}
                          />
                          <Label className="font-medium">
                            {alimento.label}
                          </Label>
                        </div>
                      </div>

                      {alimentoSeleccionado && (
                        <div className="pl-6 space-y-3">
                          <RadioGroup
                            value={alimentoSeleccionado.origen}
                            onValueChange={(origen) => {
                              const updated = (
                                watch("tipo_alimentacion") || []
                              ).map((item: any) =>
                                item.alimento === alimento.value
                                  ? { ...item, origen }
                                  : item,
                              );
                              setValue("tipo_alimentacion", updated);
                            }}
                            className="flex flex-wrap gap-4"
                          >
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
                          </RadioGroup>

                          {alimentoSeleccionado.origen ===
                            "comprado y producido" && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">% Comprado</Label>
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
                                        : item,
                                    );
                                    setValue("tipo_alimentacion", updated);
                                  }}
                                  placeholder="Ej: 60"
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">% Producido</Label>
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
                                        : item,
                                    );
                                    setValue("tipo_alimentacion", updated);
                                  }}
                                  placeholder="Ej: 40"
                                  className="w-full"
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
                                    ⚠️ La suma de porcentajes debe ser 100%
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

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                Complementos y Medicamentos
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Tipo de Complemento <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {complementosOptions.map((complemento) => (
                      <div
                        key={complemento.value}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50"
                      >
                        <Checkbox
                          checked={
                            watch("complementos")?.some(
                              (c: TipoComplemento) =>
                                c.complemento === complemento.value,
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
                                    c.complemento !== complemento.value,
                                ),
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
                  <Label className="text-sm font-medium">
                    Medicamentos (opcional)
                  </Label>
                  <Input
                    {...register("medicamento")}
                    placeholder="Ej: Ivermectina, Vitaminas, etc."
                    className="w-full"
                  />
                  {errors.medicamento && (
                    <p className="text-sm text-red-500">
                      {errors.medicamento.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                Características Especiales
              </h3>

              <div className="space-y-4">
                {watch("sexo") === "Macho" && (
                  <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-md">
                    <Checkbox
                      checked={watch("castrado") || false}
                      onCheckedChange={(checked) =>
                        setValue("castrado", checked === true)
                      }
                    />
                    <Label className="font-medium">Castrado</Label>
                  </div>
                )}

                {watch("sexo") === "Hembra" && (
                  <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-md">
                    <Checkbox
                      checked={watch("esterelizado") || false}
                      onCheckedChange={(checked) =>
                        setValue("esterelizado", checked === true)
                      }
                    />
                    <Label className="font-medium">Esterilizado</Label>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Características</Label>
                  <Textarea
                    {...register("observaciones")}
                    placeholder="Describe las características, comportamiento o cualquier observación relevante"
                    className="min-h-[120px] w-full"
                  />
                  {errors.observaciones && (
                    <p className="text-sm text-red-500">
                      {errors.observaciones.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                Ubicación y Origen
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Finca</Label>
                  <Select
                    value={watch("fincaId") || animal?.finca?.id || ""}
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

                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-md">
                  <Checkbox
                    checked={watch("compra_animal") || false}
                    onCheckedChange={(checked) =>
                      setValue("compra_animal", checked === true)
                    }
                  />
                  <Label className="font-medium">
                    ¿El animal fue comprado?
                  </Label>
                </div>

                {watch("compra_animal") && (
                  <div className="space-y-2 pl-6 border-l-2 border-green-200">
                    <Label className="text-sm font-medium">
                      Nombre del criador (origen)
                    </Label>
                    <Input
                      {...register("nombre_criador_origen_animal")}
                      placeholder="Nombre del criador o lugar de origen"
                      className="w-full"
                    />
                    {errors.nombre_criador_origen_animal && (
                      <p className="text-sm text-red-500">
                        {errors.nombre_criador_origen_animal.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t flex gap-4 justify-end">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Actualizando..." : "Actualizar Animal"}
              </Button>
              <Button
                type="button"
                onClick={() => setActiveTab("padre")}
                className="group"
              >
                <span>Datos del Padre</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* PESTAÑA DATOS PADRE */}
      <TabsContent value="padre">
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="bg-primary/10 text-primary p-1 rounded-md">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </span>
              Datos del Padre
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="flex items-start space-x-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <Checkbox
                id="padreFinca"
                checked={isPadreFinca}
                onCheckedChange={(checked) => {
                  setIsPadreFinca(checked === true);
                  if (checked === false) {
                    setSelectedPadreId("");
                    setSearchPadreTerm("");
                  }
                }}
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor="padreFinca"
                  className="font-medium text-blue-900"
                >
                  El padre pertenece a esta finca
                </Label>
                <p className="text-xs text-blue-700/70 mt-0.5">
                  Marca esta opción si el padre está registrado en tu ganadería
                </p>
              </div>
            </div>

            {isPadreFinca ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Buscar Padre <span className="text-red-500">*</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      (Selecciona un macho registrado)
                    </span>
                  </Label>

                  <div className="relative">
                    <div className="relative">
                      <Input
                        placeholder="Buscar por identificador o nombre..."
                        value={searchPadreTerm}
                        onChange={(e) => {
                          setSearchPadreTerm(e.target.value);
                          setIsPadreDropdownOpen(true);
                        }}
                        onFocus={() => {
                          if (searchPadreTerm) {
                            setIsPadreDropdownOpen(true);
                          }
                        }}
                        className="w-full pr-10"
                      />
                      {searchPadreTerm && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchPadreTerm("");
                            setSelectedPadreId("");
                            setIsPadreDropdownOpen(false);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {isPadreDropdownOpen && searchPadreTerm && (
                      <>
                        <div
                          className="fixed inset-0 z-0"
                          onClick={() => setIsPadreDropdownOpen(false)}
                        />
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredMachos.length > 0 ? (
                            <div className="py-1">
                              <div className="px-3 py-1.5 text-xs text-muted-foreground bg-gray-50 border-b">
                                {filteredMachos.length} resultado
                                {filteredMachos.length > 1 ? "s" : ""}
                              </div>
                              {filteredMachos.map((macho) => (
                                <div
                                  key={macho.id}
                                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
                                  onClick={() => {
                                    setSelectedPadreId(macho.id);
                                    setSearchPadreTerm(
                                      `${macho.identificador} - ${macho.nombre_animal || "Sin nombre"}`,
                                    );
                                    setIsPadreDropdownOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium text-sm">
                                      {macho.identificador}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {macho.nombre_animal || "Sin nombre"}
                                    </span>
                                  </div>
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    Seleccionar
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-6 text-center text-gray-500">
                              <svg
                                className="w-8 h-8 mx-auto text-gray-300 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p>No se encontraron machos</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Intenta con otro término de búsqueda
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {selectedPadreId && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-green-700 flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span className="font-medium">
                              Padre seleccionado:
                            </span>
                          </p>
                          <p className="text-sm font-semibold text-green-800 mt-1">
                            {searchPadreTerm}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1"
                          onClick={() => {
                            setSelectedPadreId("");
                            setSearchPadreTerm("");
                          }}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Cambiar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Nombre Padre
                      <span className="text-xs text-muted-foreground font-normal">
                        (opcional)
                      </span>
                    </Label>
                    <Input
                      {...register("nombre_padre")}
                      placeholder="Nombre del padre"
                      className="focus:ring-2 focus:ring-blue-500/20"
                    />
                    {errors.nombre_padre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_padre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Arete Padre
                      <span className="text-xs text-muted-foreground font-normal">
                        (6 dígitos - opcional)
                      </span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          value={watch("identificador_temp_padre") || ""}
                          onChange={(e) =>
                            handleIdentifierChangePadre(e.target.value)
                          }
                          placeholder="000000"
                          maxLength={6}
                          className="flex-1 font-mono tracking-wider focus:ring-2 focus:ring-blue-500/20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          {watch("identificador_temp_padre")?.length || 0}/6
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip
                          open={showIdentifierHelpPadre}
                          onOpenChange={setShowIdentifierHelpPadre}
                        >
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="shrink-0 hover:bg-blue-50"
                            >
                              <InfoIcon className="h-4 w-4 text-blue-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-xs">
                              PRIMEROS SEIS DÍGITOS DE IDENTIFICACIÓN DEL ARETE
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {errors.arete_padre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.arete_padre.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Razas del Padre <span className="text-red-500">*</span>
                  </Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto bg-gray-50">
                    {razas?.data.map((raza) => (
                      <div
                        key={raza.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={
                            watch("razas_padre")?.includes(raza.id) || false
                          }
                          onCheckedChange={(checked) => {
                            const currentValues = watch("razas_padre") || [];
                            if (checked) {
                              setValue("razas_padre", [
                                ...currentValues,
                                raza.id,
                              ]);
                            } else {
                              setValue(
                                "razas_padre",
                                currentValues.filter((id) => id !== raza.id),
                              );
                            }
                          }}
                          id={`raza-padre-${raza.id}`}
                        />
                        <Label
                          htmlFor={`raza-padre-${raza.id}`}
                          className="text-sm"
                        >
                          {raza.nombre}
                        </Label>
                      </div>
                    ))}
                    {(!razas?.data || razas.data.length === 0) && (
                      <p className="text-sm text-muted-foreground">
                        No hay razas disponibles
                      </p>
                    )}
                  </div>
                  {errors.razas_padre && (
                    <p className="text-sm text-red-500">
                      {errors.razas_padre.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Nivel de Pureza del Padre
                      <span className="text-xs text-muted-foreground font-normal">
                        (opcional)
                      </span>
                    </Label>
                    <RadioGroup
                      value={watch("pureza_padre") || ""}
                      onValueChange={(value) => setValue("pureza_padre", value)}
                      className="space-y-2"
                    >
                      {purezaOptions.map((pureza) => (
                        <div
                          key={pureza.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={pureza.value}
                            id={`pureza-padre-${pureza.value}`}
                          />
                          <Label
                            htmlFor={`pureza-padre-${pureza.value}`}
                            className="text-sm"
                          >
                            {pureza.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.pureza_padre && (
                      <p className="text-sm text-red-500">
                        {errors.pureza_padre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Nombre Criador del Padre{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("nombre_criador_padre")}
                      placeholder="Nombre del criador"
                      className="focus:ring-2 focus:ring-blue-500/20"
                    />
                    {errors.nombre_criador_padre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_criador_padre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Nombre Propietario del Padre{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("nombre_propietario_padre")}
                      placeholder="Nombre del propietario"
                      className="focus:ring-2 focus:ring-blue-500/20"
                    />
                    {errors.nombre_propietario_padre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_propietario_padre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Finca de Origen del Padre{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("nombre_finca_origen_padre")}
                      placeholder="Nombre de la finca de origen"
                      className="focus:ring-2 focus:ring-blue-500/20"
                    />
                    {errors.nombre_finca_origen_padre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_finca_origen_padre.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("animal")}
                className="flex-1 sm:flex-none hover:bg-gray-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Anterior
              </Button>
              <Button
                type="button"
                onClick={() => setActiveTab("madre")}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
              >
                Datos de la Madre
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* PESTAÑA DATOS MADRE */}
      <TabsContent value="madre">
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="bg-pink-100 text-pink-700 p-1 rounded-md">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </span>
              Datos de la Madre
              {watch("numero_parto_madre") && (
                <span className="ml-auto text-xs font-normal bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Parto #{watch("numero_parto_madre")}
                </span>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="flex items-start space-x-3 p-3 bg-pink-50/50 rounded-lg border border-pink-100">
              <Checkbox
                id="madreFinca"
                checked={isMadreFinca}
                onCheckedChange={(checked) => {
                  setIsMadreFinca(checked === true);
                  if (checked === false) {
                    setSelectedMadreId("");
                    setSearchMadreTerm("");
                  }
                }}
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor="madreFinca"
                  className="font-medium text-pink-900"
                >
                  La madre pertenece a esta finca
                </Label>
                <p className="text-xs text-pink-700/70 mt-0.5">
                  Marca esta opción si la madre está registrada en tu ganadería
                </p>
              </div>
            </div>

            {isMadreFinca ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Buscar Madre <span className="text-red-500">*</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      (Selecciona una hembra registrada)
                    </span>
                  </Label>

                  <div className="relative">
                    <div className="relative">
                      <Input
                        placeholder="Buscar por identificador o nombre..."
                        value={searchMadreTerm}
                        onChange={(e) => {
                          setSearchMadreTerm(e.target.value);
                          setIsMadreDropdownOpen(true);
                        }}
                        onFocus={() => {
                          if (searchMadreTerm) {
                            setIsMadreDropdownOpen(true);
                          }
                        }}
                        className="w-full pr-10"
                      />
                      {searchMadreTerm && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchMadreTerm("");
                            setSelectedMadreId("");
                            setIsMadreDropdownOpen(false);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {isMadreDropdownOpen && searchMadreTerm && (
                      <>
                        <div
                          className="fixed inset-0 z-0"
                          onClick={() => setIsMadreDropdownOpen(false)}
                        />
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredHembras.length > 0 ? (
                            <div className="py-1">
                              <div className="px-3 py-1.5 text-xs text-muted-foreground bg-gray-50 border-b">
                                {filteredHembras.length} resultado
                                {filteredHembras.length > 1 ? "s" : ""}
                              </div>
                              {filteredHembras.map((hembra) => (
                                <div
                                  key={hembra.id}
                                  className="px-4 py-2 hover:bg-pink-50 cursor-pointer flex items-center justify-between transition-colors"
                                  onClick={() => {
                                    setSelectedMadreId(hembra.id);
                                    setSearchMadreTerm(
                                      `${hembra.identificador} - ${hembra.nombre_animal || "Sin nombre"}`,
                                    );
                                    setIsMadreDropdownOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium text-sm">
                                      {hembra.identificador}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {hembra.nombre_animal || "Sin nombre"}
                                    </span>
                                  </div>
                                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                                    Seleccionar
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-6 text-center text-gray-500">
                              <svg
                                className="w-8 h-8 mx-auto text-gray-300 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p>No se encontraron hembras</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Intenta con otro término de búsqueda
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {selectedMadreId && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-green-700 flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span className="font-medium">
                              Madre seleccionada:
                            </span>
                          </p>
                          <p className="text-sm font-semibold text-green-800 mt-1">
                            {searchMadreTerm}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1"
                          onClick={() => {
                            setSelectedMadreId("");
                            setSearchMadreTerm("");
                          }}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Cambiar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Nombre Madre
                      <span className="text-xs text-muted-foreground font-normal">
                        (opcional)
                      </span>
                    </Label>
                    <Input
                      value={watch("nombre_madre") || ""}
                      onChange={(e) => setValue("nombre_madre", e.target.value)}
                      placeholder="Nombre de la madre"
                      className="focus:ring-2 focus:ring-pink-500/20"
                    />
                    {errors.nombre_madre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_madre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Arete Madre
                      <span className="text-xs text-muted-foreground font-normal">
                        (6 dígitos - opcional)
                      </span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          value={watch("identificador_temp_madre") || ""}
                          onChange={(e) =>
                            handleIdentifierChangeMadre(e.target.value)
                          }
                          placeholder="000000"
                          maxLength={6}
                          className="flex-1 font-mono tracking-wider focus:ring-2 focus:ring-pink-500/20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          {watch("identificador_temp_madre")?.length || 0}/6
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip
                          open={showIdentifierHelpMadre}
                          onOpenChange={setShowIdentifierHelpMadre}
                        >
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="shrink-0 hover:bg-pink-50"
                            >
                              <InfoIcon className="h-4 w-4 text-pink-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-xs">
                              PRIMEROS SEIS DÍGITOS DE IDENTIFICACIÓN DEL ARETE
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {errors.arete_madre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.arete_madre.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Razas de la Madre <span className="text-red-500">*</span>
                  </Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto bg-gray-50">
                    {razas?.data.map((raza) => (
                      <div
                        key={raza.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={
                            watch("razas_madre")?.includes(raza.id) || false
                          }
                          onCheckedChange={(checked) => {
                            const currentValues = watch("razas_madre") || [];
                            if (checked) {
                              setValue("razas_madre", [
                                ...currentValues,
                                raza.id,
                              ]);
                            } else {
                              setValue(
                                "razas_madre",
                                currentValues.filter((id) => id !== raza.id),
                              );
                            }
                          }}
                          id={`raza-madre-${raza.id}`}
                        />
                        <Label
                          htmlFor={`raza-madre-${raza.id}`}
                          className="text-sm"
                        >
                          {raza.nombre}
                        </Label>
                      </div>
                    ))}
                    {(!razas?.data || razas.data.length === 0) && (
                      <p className="text-sm text-muted-foreground">
                        No hay razas disponibles
                      </p>
                    )}
                  </div>
                  {errors.razas_madre && (
                    <p className="text-sm text-red-500">
                      {errors.razas_madre.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Nivel de pureza
                      <span className="text-xs text-muted-foreground font-normal">
                        (opcional)
                      </span>
                    </Label>
                    <RadioGroup
                      value={watch("pureza_madre") || ""}
                      onValueChange={(value) => setValue("pureza_madre", value)}
                      className="space-y-2"
                    >
                      {purezaOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`pureza-madre-${option.value}`}
                          />
                          <Label
                            htmlFor={`pureza-madre-${option.value}`}
                            className="text-sm"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.pureza_madre && (
                      <p className="text-sm text-red-500">
                        {errors.pureza_madre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Número de parto <span className="text-red-500">*</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        (Último parto)
                      </span>
                    </Label>
                    <div className="relative">
                      <Input
                        min={1}
                        {...register("numero_parto_madre")}
                        required
                        placeholder="Ej: 1, 2, 3..."
                        maxLength={2}
                        className="flex-1 font-medium focus:ring-2 focus:ring-pink-500/20"
                        type="number"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        #
                      </span>
                    </div>
                    {errors.numero_parto_madre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.numero_parto_madre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Nombre Criador <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={watch("nombre_criador_madre") || ""}
                      onChange={(e) =>
                        setValue("nombre_criador_madre", e.target.value)
                      }
                      placeholder="Nombre del criador"
                      className="focus:ring-2 focus:ring-pink-500/20"
                    />
                    {errors.nombre_criador_madre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_criador_madre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Nombre Propietario <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={watch("nombre_propietario_madre") || ""}
                      onChange={(e) =>
                        setValue("nombre_propietario_madre", e.target.value)
                      }
                      placeholder="Nombre del propietario"
                      className="focus:ring-2 focus:ring-pink-500/20"
                    />
                    {errors.nombre_propietario_madre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_propietario_madre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2">
                      Nombre de la finca de origen{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={watch("nombre_finca_origen_madre") || ""}
                      onChange={(e) =>
                        setValue("nombre_finca_origen_madre", e.target.value)
                      }
                      placeholder="Nombre de la finca de origen"
                      className="focus:ring-2 focus:ring-pink-500/20"
                    />
                    {errors.nombre_finca_origen_madre && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="text-red-400">⚠</span>{" "}
                        {errors.nombre_finca_origen_madre.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("padre")}
                className="flex-1 sm:flex-none hover:bg-gray-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Anterior
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 sm:flex-none bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creando...
                  </>
                ) : (
                  <>
                    Actualizar Animal
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </form>
  );
};

export default FormEditAnimales;
