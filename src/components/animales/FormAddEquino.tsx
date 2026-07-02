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
import { Checkbox } from "../ui/checkbox";
import { purezaOptions } from "@/helpers/data/purezaOptions";
import { CrearAnimalByFinca } from "@/api/animales/interfaces/crear-animal.interface";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowRight, InfoIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { useForm } from "react-hook-form";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { SexoAnimal } from "@/interfaces/enums/animales/sexo-animal.enum";
import { toast } from "react-toastify";
import { sexoOptions } from "@/helpers/data/sexo_animales";
import { CreateAnimal } from "@/api/animales/accions/crear-animal";
import { isAxiosError } from "axios";
import { Switch } from "../ui/switch";
import { UsoEquinoEnum } from "@/interfaces/enums/animales/use-equino.enum";
import { alimentosEquinosOptions } from "@/helpers/data/alimentos";
import { tipoReproduccionOptions } from "@/helpers/data/tipoReproduccionOptions";
import SummaryList from "../generics/SummaryList";

interface Props {
  setActiveTab: Dispatch<SetStateAction<string>>;
  selectedEspecieId: string;
}
const FormAddEquino = ({ selectedEspecieId, setActiveTab }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
  const [historialReproductivoInput, setHistorialReproductivoInput] =
    useState("");
  const [competenciasInput, setCompetenciasInput] = useState("");
  const [historialReproductivoList, setHistorialReproductivoList] = useState<
    string[]
  >([]);
  const [competenciasList, setCompetenciasList] = useState<string[]>([]);
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
    }
  >({
    defaultValues: {
      identificador: "",
    },
  });

  const especieId = selectedEspecieId;

  const { data: razas } = useGetRazasByEspecie(especieId);
  const { data: fincas } = useFincasPropietarios(cliente?.id ?? "");
  const { data: machos } = useGetAnimalesPropietario({
    sexo: SexoAnimal.Macho,
    especieId,
  });

  const { data: hembras } = useGetAnimalesPropietario({
    sexo: SexoAnimal.Hembra,
    especieId,
  });

  const agregarHistorialReproductivo = () => {
    if (!historialReproductivoInput.trim()) return;

    const nuevoItem = historialReproductivoInput.trim();

    const currentHistorial = watch("historial_reproductivo") || [];

    if (currentHistorial.includes(nuevoItem)) {
      toast.info("Este elemento ya fue agregado");
      setHistorialReproductivoInput("");
      return;
    }

    const historialActualizado = [...currentHistorial, nuevoItem];

    setValue("historial_reproductivo", historialActualizado);

    setHistorialReproductivoList(historialActualizado);
    setHistorialReproductivoInput("");
  };

  const eliminarHistorialReproductivo = (index: number) => {
    const currentHistorial = watch("historial_reproductivo") || [];
    const nuevosItems = currentHistorial.filter((_, i) => i !== index);

    setValue("historial_reproductivo", nuevosItems);
    setHistorialReproductivoList(nuevosItems);
  };

  const agregarCompetencia = () => {
    if (!competenciasInput.trim()) return;

    const nuevoItem = competenciasInput.trim();

    const currentCompetencias = watch("resultados_competencias") || [];

    if (currentCompetencias.includes(nuevoItem)) {
      toast.info("Este elemento ya fue agregado");
      setCompetenciasInput("");
      return;
    }

    const competenciasActualizadas = [...currentCompetencias, nuevoItem];

    setValue("resultados_competencias", competenciasActualizadas);
    setCompetenciasList(competenciasActualizadas);
    setCompetenciasInput("");
  };

  const eliminarCompetencia = (index: number) => {
    const currentCompetencias = watch("resultados_competencias") || [];
    const nuevosItems = currentCompetencias.filter((_, i) => i !== index);

    setValue("resultados_competencias", nuevosItems);
    setCompetenciasList(nuevosItems);
  };

  const limpiarHistorialReproductivo = () => {
    setValue("historial_reproductivo", []);
    setHistorialReproductivoList([]);
    setHistorialReproductivoInput("");
  };

  const limpiarCompetencias = () => {
    setValue("resultados_competencias", []);
    setCompetenciasList([]);
    setCompetenciasInput("");
  };

  const handleHistorialKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      agregarHistorialReproductivo();
    }
  };

  const handleCompetenciaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      agregarCompetencia();
    }
  };

  const selectedSexo = watch("sexo");

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

  const fechaNacimiento = watch("fecha_nacimiento");

  useEffect(() => {
    if (!fechaNacimiento) {
      setEdadAnimal(0);
      setValue("edad_promedio", 0);
      return;
    }

    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const mes = hoy.getMonth() - nacimiento.getMonth();
    const dia = hoy.getDate() - nacimiento.getDate();

    if (mes < 0 || (mes === 0 && dia < 0)) {
      edad--;
    }

    setEdadAnimal(edad);
    setValue("edad_promedio", edad, {
      shouldValidate: true,
    });
  }, [fechaNacimiento]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + selectedImages.length > 5) {
      toast.error("Máximo 5 imágenes permitidas");
      return;
    }

    const MAX_SIZE = 1024 * 1024;

    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= MAX_SIZE;

      if (!isValidType) {
        toast.error(`El archivo ${file.name} no es una imagen válida`);
        return false;
      }

      if (!isValidSize) {
        toast.error(`La imagen ${file.name} excede el límite de 1 MB`);
        return false;
      }

      return true;
    });

    setSelectedImages((prev) => [...prev, ...validFiles]);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const sexoItems = sexoOptions.map((sexo) => ({
    label: sexo.label,
    value: sexo.value,
  }));

  useEffect(() => {
    if (selectedSexo === "Macho") {
      setValue("esterelizado", false);
    } else if (selectedSexo === "Hembra") {
      setValue("castrado", false);
    }
  }, [selectedSexo, setValue]);

  const fincasItems =
    fincas?.data.fincas.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const mutation = useMutation({
    mutationFn: (data: FormData) => CreateAnimal(data),
    onSuccess: () => {
      toast.success("Animal creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      reset();
      router.push("/animales");
      setSelectedMadreId("");
      setSelectedPadreId("");
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

    if (isMadreFinca && !selectedMadreId) {
      toast.error("Debes seleccionar la madre para poder crear el animal");
      return;
    }

    if (isPadreFinca && !selectedPadreId) {
      toast.error("Debes seleccionar el padre para poder crear el animal");
      return;
    }

    const animalData = {
      ...data,
      propietarioId: cliente.id,
    };

    const formData = new FormData();

    Object.entries(animalData).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        key === "razaIds" ||
        key === "razas_padre" ||
        key === "razas_madre" ||
        key === "fecha_nacimiento" ||
        key === "numero_parto_madre" ||
        key === "tipo_alimentacion" ||
        key === "edad_promedio" ||
        key === "historial_reproductivo" ||
        key === "resultados_competencias"
      ) {
        return;
      }

      if (Array.isArray(value)) {
        if (value.length > 0) {
          formData.append(key, JSON.stringify(value));
        }
        return;
      }

      if (typeof value === "boolean") {
        formData.append(key, String(value));
      } else {
        formData.append(key, String(value));
      }
    });

    formData.append("especie", String(especieId));
    formData.append("castrado", String(data.castrado || false));
    formData.append("esterelizado", String(data.esterelizado || false));

    if (
      data.numero_parto_madre !== undefined &&
      data.numero_parto_madre !== null
    ) {
      formData.append("numero_parto_madre", String(data.numero_parto_madre));
    }

    if (data.fecha_nacimiento) {
      formData.append("fecha_nacimiento", data.fecha_nacimiento);
    }

    if (data.razaIds && data.razaIds.length > 0) {
      formData.append("razaIds", JSON.stringify(data.razaIds));
    }

    if (data.razas_padre && data.razas_padre.length > 0) {
      formData.append("razas_padre", JSON.stringify(data.razas_padre));
    }

    if (data.razas_madre && data.razas_madre.length > 0) {
      formData.append("razas_madre", JSON.stringify(data.razas_madre));
    }
    if (data.historial_reproductivo && data.historial_reproductivo.length > 0) {
      formData.append(
        "historial_reproductivo",
        JSON.stringify(data.historial_reproductivo),
      );
    }

    if (
      data.resultados_competencias &&
      data.resultados_competencias.length > 0
    ) {
      formData.append(
        "resultados_competencias",
        JSON.stringify(data.resultados_competencias),
      );
    }
    data.tipo_alimentacion.forEach((item, index) => {
      formData.append(`tipo_alimentacion[${index}][alimento]`, item.alimento);
      formData.append(`tipo_alimentacion[${index}][origen]`, item.origen);

      if (item.porcentaje_comprado != null) {
        formData.append(
          `tipo_alimentacion[${index}][porcentaje_comprado]`,
          String(item.porcentaje_comprado),
        );
      }

      if (item.porcentaje_producido != null) {
        formData.append(
          `tipo_alimentacion[${index}][porcentaje_producido]`,
          String(item.porcentaje_producido),
        );
      }
    });

    const edadParaEnviar =
      edadAnimal !== undefined && edadAnimal !== null && edadAnimal !== 0
        ? edadAnimal
        : data.edad_promedio || 0;
    formData.append("edad_promedio", String(edadParaEnviar));

    if (selectedMadreId) {
      formData.append("madreId", selectedMadreId);
    }
    if (selectedPadreId) {
      formData.append("padreId", selectedPadreId);
    }

    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    mutation.mutate(formData as any);
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
                    Arete/Código <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        {...register("identificador")}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 6);
                          e.target.value = value;
                          setValue("identificador", value);
                        }}
                        placeholder="Ej: 123ABC, A1B2C3, etc."
                        maxLength={6}
                        className="w-full font-mono text-lg tracking-wider uppercase"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <span className="text-xs text-muted-foreground">
                          6 caracteres
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
                            Código de identificación del arete (máximo 6
                            caracteres)
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
                    Registro Genealógico <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        {...register("registro_genealogico")}
                        placeholder="Ej: ARG-12345-2024, BR-9876, etc."
                        className="w-full font-mono uppercase"
                      />
                    </div>
                    <TooltipProvider>
                      <Tooltip>
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
                            Número de registro genealógico del animal. Puede
                            incluir letras, números y guiones.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {errors.registro_genealogico && (
                    <p className="text-sm text-red-500">
                      {errors.registro_genealogico.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Código / Microchip <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        {...register("microchip")}
                        placeholder="Ej: 985141001234567, 900123456789012, etc."
                        className="w-full font-mono"
                      />
                    </div>
                    <TooltipProvider>
                      <Tooltip>
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
                            Código de identificación del microchip (15 dígitos
                            recomendado)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {errors.microchip && (
                    <p className="text-sm text-red-500">
                      {errors.microchip.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                  Imágenes del Animal
                </h3>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-2">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Arrastra y suelta imágenes o haz clic para seleccionar
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        disabled={selectedImages.length >= 5}
                        className="w-full max-w-xs cursor-pointer text-sm file:mr-2 file:py-2 file:px-3 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 file:border-none file:rounded-md hover:file:bg-blue-100 disabled:opacity-50"
                      />
                      <p className="text-xs text-gray-500 mt-3">
                        <span className="font-medium">Máximo 5 imágenes</span> ·
                        Formatos: JPG, PNG, GIF · Máximo 1MB cada una
                        <br />
                        <span className="text-blue-600">
                          {selectedImages.length}/5 imágenes seleccionadas
                        </span>
                      </p>
                    </div>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square"
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all shadow-md active:scale-95 opacity-0 group-hover:opacity-100"
                            aria-label="Eliminar imagen"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs">
                              Imagen {index + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                CARACTERÍSTICAS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Sexo <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={watch("sexo") || ""}
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

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Capa / Color (opcional)
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
                    value={watch("pureza") || ""}
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

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Peso actual (kg) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("peso_actual")}
                    placeholder="Ej: 450.5"
                    className="w-full"
                  />
                  {errors.peso_actual && (
                    <p className="text-sm text-red-500">
                      {errors.peso_actual.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Alzada (opcional)
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        step="0.01"
                        {...register("alzada")}
                        placeholder="Ej: 150"
                        className="w-full"
                      />
                    </div>
                    <div className="w-32">
                      <Select
                        value={watch("unidad_alzada") || "cm"}
                        onValueChange={(value) =>
                          setValue("unidad_alzada", value as "cm" | "manos")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Unidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">cm</SelectItem>
                          <SelectItem value="manos">Manos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {errors.alzada && (
                    <p className="text-sm text-red-500">
                      {errors.alzada.message}
                    </p>
                  )}
                  {watch("unidad_alzada") === "manos" && (
                    <p className="text-xs text-muted-foreground">
                      1 mano = 4 pulgadas (10.16 cm)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Condición corporal <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("condicion_corporal") || ""}
                    onValueChange={(value) =>
                      setValue(
                        "condicion_corporal",
                        value as
                          | "excelente"
                          | "muy_buena"
                          | "buena"
                          | "regular"
                          | "mala"
                          | "muy_mala"
                          | "caquexica"
                          | "obesa",
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una condición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excelente">Excelente</SelectItem>
                      <SelectItem value="muy_buena">Muy Buena</SelectItem>
                      <SelectItem value="buena">Buena</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="mala">Mala</SelectItem>
                      <SelectItem value="muy_mala">Muy Mala</SelectItem>
                      <SelectItem value="caquexica">Caquéxica</SelectItem>
                      <SelectItem value="obesa">Obesa</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condicion_corporal && (
                    <p className="text-sm text-red-500">
                      {errors.condicion_corporal.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                USO
              </h3>
              <div className="space-y-2">
                <Label>Uso del Equino</Label>
                <Select
                  value={watch("uso_equino") || ""}
                  onValueChange={(value) =>
                    setValue("uso_equino", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el uso del equino" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UsoEquinoEnum.TRABAJO}>
                      Trabajo
                    </SelectItem>
                    <SelectItem value={UsoEquinoEnum.DEPORTE}>
                      Deporte
                    </SelectItem>
                    <SelectItem value={UsoEquinoEnum.REPRODUCCION}>
                      Reproducción
                    </SelectItem>
                    <SelectItem value={UsoEquinoEnum.PASEO}>Paseo</SelectItem>
                    <SelectItem value={UsoEquinoEnum.CARGA}>Carga</SelectItem>
                    <SelectItem value={UsoEquinoEnum.GANADERIA}>
                      Ganadería
                    </SelectItem>
                    <SelectItem value={UsoEquinoEnum.POLICIA}>
                      Policía
                    </SelectItem>
                    <SelectItem value={UsoEquinoEnum.TERAPIA}>
                      Terapia
                    </SelectItem>
                    <SelectItem value={UsoEquinoEnum.COMPANIA}>
                      Compañía
                    </SelectItem>
                    <SelectItem value={UsoEquinoEnum.OTRO}>Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                SANIDAD
              </h3>

              <div className="space-y-4">
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Vacunas (opcional)
                  </Label>
                  <Input
                    {...register("vacunas")}
                    placeholder="Ej:  Vitamina A, Vitamina B, etc."
                    className="w-full"
                  />
                  {errors.vacunas && (
                    <p className="text-sm text-red-500">
                      {errors.vacunas.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Desparasitado</Label>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={watch("desparasitado")}
                    onCheckedChange={(checked) =>
                      setValue("desparasitado", checked)
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {watch("desparasitado") ? "Sí" : "No"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Lesiones (opcional)
                </Label>
                <Input
                  {...register("lesiones")}
                  placeholder="Lesiones del animal"
                  className=" w-full"
                />
                {errors.lesiones && (
                  <p className="text-sm text-red-500">
                    {errors.lesiones.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Alergias (opcional)
                </Label>
                <Input
                  {...register("alergias")}
                  placeholder="Alergias del Animal"
                  className=" w-full"
                />
                {errors.alergias && (
                  <p className="text-sm text-red-500">
                    {errors.alergias.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Odontologia (opcional)
                </Label>
                <Input
                  {...register("odontologia")}
                  placeholder="Odontologia del animal"
                  className=" w-full"
                />
                {errors.odontologia && (
                  <p className="text-sm text-red-500">
                    {errors.odontologia.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Veterinario (opcional)
                </Label>
                <Input
                  {...register("veterinario")}
                  placeholder="Nombre de veterinario del animal"
                  className=" w-full"
                />
                {errors.veterinario && (
                  <p className="text-sm text-red-500">
                    {errors.veterinario.message}
                  </p>
                )}
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
                    value={watch("tipo_reproduccion") || ""}
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
                <Label className="flex items-center gap-2">
                  Historial reproductivo
                  <span className="text-xs text-muted-foreground font-normal">
                    (Agrega eventos uno por uno)
                  </span>
                </Label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Textarea
                    placeholder="Ej: Servicio con toro X - 15/01/2024, Parto gemelar - 10/06/2024, etc."
                    className={`min-h-[80px] w-full sm:flex-1`}
                    value={historialReproductivoInput}
                    onChange={(e) =>
                      setHistorialReproductivoInput(e.target.value)
                    }
                    onKeyDown={handleHistorialKeyDown}
                  />

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={agregarHistorialReproductivo}
                      className="flex-1 sm:flex-none h-10"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar
                    </Button>

                    {historialReproductivoList.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={limpiarHistorialReproductivo}
                        className="flex-1 sm:flex-none h-10 text-red-500 hover:text-red-600"
                      >
                        Limpiar
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Escribe un evento y presiona Enter o haz clic en "Agregar"
                </p>

                {errors.historial_reproductivo && (
                  <p className="text-sm text-red-500">
                    {errors.historial_reproductivo.message}
                  </p>
                )}

                {historialReproductivoList.length > 0 && (
                  <SummaryList
                    items={historialReproductivoList}
                    onRemoveItem={eliminarHistorialReproductivo}
                    label="Eventos registrados"
                    emptyMessage="No hay eventos registrados"
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                Alimentación <span className="text-red-500">*</span>
              </h3>

              <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                {alimentosEquinosOptions.map((alimento) => {
                  const alimentoSeleccionado = watch("tipo_alimentacion")?.find(
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
                PRODUCCION / DESEMPEÑO
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
              <div className="space-y-2">
                <Label>Nivel de entrenamiento</Label>
                <Input
                  {...register("nivel_entrenamiento")}
                  placeholder="Básico, Intermedio, Avanzado..."
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Competencias / Resultados
                  <span className="text-xs text-muted-foreground font-normal">
                    (Agrega participaciones una por una)
                  </span>
                </Label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Textarea
                    placeholder="Ej: Campeonato Nacional - 1er lugar 2023, Feria Regional - Mejor ejemplar 2024, etc."
                    className={`min-h-[80px] w-full sm:flex-1`}
                    value={competenciasInput}
                    onChange={(e) => setCompetenciasInput(e.target.value)}
                    onKeyDown={handleCompetenciaKeyDown}
                  />

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={agregarCompetencia}
                      className="flex-1 sm:flex-none h-10"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar
                    </Button>

                    {competenciasList.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={limpiarCompetencias}
                        className="flex-1 sm:flex-none h-10 text-red-500 hover:text-red-600"
                      >
                        Limpiar
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Escribe una competencia y presiona Enter o haz clic en
                  "Agregar"
                </p>

                {errors.resultados_competencias && (
                  <p className="text-sm text-red-500">
                    {errors.resultados_competencias.message}
                  </p>
                )}

                {competenciasList.length > 0 && (
                  <SummaryList
                    items={competenciasList}
                    onRemoveItem={eliminarCompetencia}
                    label="Competencias registradas"
                    emptyMessage="No hay competencias registradas"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Precio de compra</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("precio_compra")}
                    placeholder="Ej: 150000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor estimado</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("valor_estimado")}
                    placeholder="Ej: 150000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Asegurado</Label>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={watch("asegurado")}
                      onCheckedChange={(checked) =>
                        setValue("asegurado", checked)
                      }
                    />
                    <span>{watch("asegurado") ? "Sí" : "No"}</span>
                  </div>
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

            <div className="pt-4 border-t flex justify-end">
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
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-red-400">⚠</span>{" "}
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

                {/* Campo de número de parto cuando la madre está en la finca */}
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
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-red-400">⚠</span>{" "}
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
                    Crear Animal
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

export default FormAddEquino;
