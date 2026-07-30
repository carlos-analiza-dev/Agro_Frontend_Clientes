import { CrearClienteAgroInterface } from "@/api/agroservicio/clientes/interfaces/crear-cliente-agro.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  UserPlus,
  RefreshCw,
  User,
  Phone,
  Mail,
  MapPin,
  IdCard,
  Users,
  X,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import { ClienteAgro } from "@/api/agroservicio/clientes/interfaces/response-clientes-ago.interface";
import {
  ingresarAgroCliente,
  ingresarAgroClienteEmpleado,
} from "@/api/agroservicio/clientes/accions/ingresar-cliente-agro";
import {
  editarAgroCliente,
  editarAgroClienteEmpleado,
} from "@/api/agroservicio/clientes/accions/editar-cliente-agro";
import usePaisesById from "@/hooks/paises/usePaisesById";
import { ID_REGEX } from "@/helpers/data/formularios/identificacion";
import { sexos } from "@/helpers/data/sexos";
import {
  validateEmail,
  validateIdentification,
  validatePhone,
} from "@/helpers/funciones/validaciones-form/valid";

interface Props {
  paisId: string;
  editCliente?: ClienteAgro | null;
  isEdit?: boolean;
  onSuccess: () => void;
  isPropietario: boolean;
}

const FormClientesAgro = ({
  paisId,
  editCliente,
  isEdit = false,
  onSuccess,
  isPropietario,
}: Props) => {
  const [prefijoNumber, setPrefijoNumber] = useState("");
  const [codigoPais, setCodigoPais] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [municipioIdInicial, setMunicipioIdInicial] = useState("");

  const { data: pais } = usePaisesById(paisId);

  useEffect(() => {
    if (pais) {
      setCodigoPais(pais.data.code);
      setPrefijoNumber(pais.data.code_phone);
    }
  }, [pais]);

  const { data: departamentos } = useGetDeptosActivesByPais(paisId);
  const { data: municipios } = useGetMunicipiosActivosByDepto(departamentoId);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CrearClienteAgroInterface>({
    defaultValues: {
      isActive: true,
      sexo: "Masculino",
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isEdit && editCliente) {
      setCargandoDatos(true);

      const telefonoLimpio =
        editCliente.telefono?.replace(/^\+\d{3}\s/, "") || "";

      const municipioId = editCliente.municipio?.id || "";
      setMunicipioIdInicial(municipioId);

      const deptoId = editCliente.departamento?.id || "";
      setDepartamentoId(deptoId);

      reset({
        nombre: editCliente.nombre,
        identificacion: editCliente.identificacion,
        telefono: telefonoLimpio,
        email: editCliente.email || "",
        direccion: editCliente.direccion,
        sexo: editCliente.sexo,
        departamentoId: deptoId,
        municipioId: municipioId,
        isActive: editCliente.isActive,
      });

      setCargandoDatos(false);
    } else {
      reset({
        nombre: "",
        identificacion: "",
        telefono: "",
        email: "",
        direccion: "",
        sexo: "Masculino",
        departamentoId: "",
        municipioId: "",
        isActive: true,
      });
      setDepartamentoId("");
      setMunicipioIdInicial("");
      setCargandoDatos(false);
    }
  }, [editCliente, isEdit, reset]);

  useEffect(() => {
    if (
      isEdit &&
      municipioIdInicial &&
      municipios &&
      municipios?.data.length > 0
    ) {
      const municipioExiste = municipios.data.some(
        (m) => m.id === municipioIdInicial,
      );
      if (municipioExiste) {
        setValue("municipioId", municipioIdInicial);
      }
    }
  }, [municipios, municipioIdInicial, isEdit, setValue]);

  useEffect(() => {
    if (!isEdit) {
      setValue("municipioId", "");
    }
  }, [departamentoId, setValue, isEdit]);

  const mutationCrear = useMutation({
    mutationFn: (data: CrearClienteAgroInterface) =>
      isPropietario
        ? ingresarAgroCliente(data)
        : ingresarAgroClienteEmpleado(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agro-clientes"],
      });

      toast.success("Cliente creado exitosamente");
      onSuccess?.();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el cliente";

        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al crear el cliente.");
      }
    },
  });

  const mutationEditar = useMutation({
    mutationFn: (data: CrearClienteAgroInterface) =>
      isPropietario
        ? editarAgroCliente(editCliente?.id ?? "", data)
        : editarAgroClienteEmpleado(editCliente?.id ?? "", data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agro-clientes"],
      });

      toast.success("Cliente actualizado exitosamente");
      onSuccess?.();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el cliente";

        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al actualizar el cliente.");
      }
    },
  });

  const onSubmit = (data: CrearClienteAgroInterface) => {
    const idValidation = validateIdentification(
      data.identificacion,
      codigoPais,
    );
    if (idValidation !== true) {
      toast.error(idValidation as string);
      return;
    }

    if (data.email && data.email.trim() !== "") {
      const emailValidation = validateEmail(data.email);
      if (emailValidation !== true) {
        toast.error(emailValidation as string);
        return;
      }
    }

    const phoneValidation = validatePhone(data.telefono);
    if (phoneValidation !== true) {
      toast.error(phoneValidation as string);
      return;
    }

    if (!departamentoId || !data.municipioId) {
      toast.error("Debe seleccionar un departamento y municipio");
      return;
    }

    const telefonoConPrefijo = `${prefijoNumber} ${data.telefono}`;

    const formData = {
      ...data,
      telefono: telefonoConPrefijo,
      departamentoId: departamentoId,
      municipioId: data.municipioId,
      isActive: data.isActive ?? true,
    };

    if (isEdit && editCliente) {
      mutationEditar.mutate(formData);
    } else {
      mutationCrear.mutate(formData);
    }
  };

  const isLoading = mutationCrear.isPending || mutationEditar.isPending;

  const currentSexo = watch("sexo");
  const currentDepartamento = watch("departamentoId");
  const currentMunicipio = watch("municipioId");

  if (cargandoDatos && isEdit) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              {isEdit ? "Editar Cliente" : "Nuevo Cliente"}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEdit
                ? "Actualiza la información del cliente"
                : "Registra un nuevo cliente en tu agroservicio"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Información Personal
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombre" className="font-semibold text-gray-700">
                  Nombre Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ej. Juan Carlos Pérez López"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register("nombre", {
                    required: "El nombre es requerido",
                    minLength: {
                      value: 3,
                      message: "Mínimo 3 caracteres",
                    },
                    maxLength: {
                      value: 150,
                      message: "Máximo 150 caracteres",
                    },
                  })}
                  disabled={isLoading}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500 flex items-center gap-1.5 mt-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="identificacion"
                  className="font-semibold text-gray-700"
                >
                  <div className="flex items-center gap-1">
                    <IdCard className="h-4 w-4" />
                    Identificación <span className="text-red-500">*</span>
                  </div>
                </Label>
                <Input
                  id="identificacion"
                  placeholder={
                    codigoPais && ID_REGEX[codigoPais as keyof typeof ID_REGEX]
                      ? ID_REGEX[codigoPais as keyof typeof ID_REGEX].example
                      : "Número de documento"
                  }
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  disabled={isLoading}
                  {...register("identificacion", {
                    required: "La identificación es requerida",
                    validate: (value) => {
                      const result = validateIdentification(value, codigoPais);
                      return result === true || result;
                    },
                  })}
                />
                {errors.identificacion && (
                  <p className="text-sm text-red-500">
                    {errors.identificacion.message as string}
                    {codigoPais &&
                      ID_REGEX[codigoPais as keyof typeof ID_REGEX]
                        ?.example && (
                        <span className="block text-xs text-gray-500 mt-1">
                          {
                            ID_REGEX[codigoPais as keyof typeof ID_REGEX]
                              ?.example
                          }
                        </span>
                      )}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexo" className="font-semibold text-gray-700">
                  Sexo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={currentSexo || ""}
                  onValueChange={(value) => setValue("sexo", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {sexos.map((sexo) => (
                      <SelectItem key={sexo.id} value={sexo.value}>
                        {sexo.sexo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sexo && (
                  <p className="text-sm text-red-500">{errors.sexo.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50/50 rounded-lg p-4 border border-green-100">
              <h3 className="text-sm font-semibold text-green-700 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Información de Contacto
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="telefono"
                  className="font-semibold text-gray-700"
                >
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Teléfono <span className="text-red-500">*</span>
                  </div>
                </Label>
                <Input
                  id="telefono"
                  placeholder="9876-5432"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  {...register("telefono", {
                    required: "El teléfono es requerido",
                    validate: validatePhone,
                  })}
                  disabled={isLoading}
                />
                {errors.telefono && (
                  <p className="text-sm text-red-500">
                    {errors.telefono.message as string}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Formato: xxxx-xxxx (ej: 9876-5432)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Correo Electrónico
                  </div>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                  {...register("email", {
                    validate: (value) => {
                      if (!value || value.trim() === "") return true;
                      return validateEmail(value);
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">
                    {errors.email.message as string}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">* Opcional</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-100">
              <h3 className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ubicación
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pais" className="font-semibold text-gray-700">
                  País <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {pais?.data?.nombre || "Cargando..."}
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                  </div>
                  <input type="hidden" {...register("departamentoId")} />
                </div>
                <p className="text-xs text-muted-foreground">
                  El país se asigna automáticamente
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="direccion"
                  className="font-semibold text-gray-700"
                >
                  Dirección <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="direccion"
                  placeholder="Calle 123 # 45-67"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register("direccion", {
                    required: "La dirección es requerida",
                    minLength: {
                      value: 10,
                      message: "La dirección debe tener al menos 10 caracteres",
                    },
                    maxLength: {
                      value: 200,
                      message: "Máximo 200 caracteres",
                    },
                  })}
                  disabled={isLoading}
                />
                {errors.direccion && (
                  <p className="text-sm text-red-500">
                    {errors.direccion.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="departamento"
                  className="font-semibold text-gray-700"
                >
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Departamento <span className="text-red-500">*</span>
                  </div>
                </Label>
                <Select
                  value={currentDepartamento || ""}
                  onValueChange={(value) => {
                    setValue("departamentoId", value);
                    setDepartamentoId(value);
                    if (!isEdit) {
                      setValue("municipioId", "");
                    }
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos && departamentos.data.length > 0 ? (
                      departamentos.data.map((depto) => (
                        <SelectItem key={depto.id} value={depto.id}>
                          {depto.nombre}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-deptos" disabled>
                        No se encontraron departamentos
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.departamentoId && (
                  <p className="text-sm text-red-500">
                    {errors.departamentoId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="municipio"
                  className="font-semibold text-gray-700"
                >
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Municipio <span className="text-red-500">*</span>
                  </div>
                </Label>
                <Select
                  value={currentMunicipio || ""}
                  onValueChange={(value) => setValue("municipioId", value)}
                  disabled={!departamentoId || isLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        departamentoId
                          ? "Selecciona un municipio"
                          : "Selecciona un departamento primero"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {municipios && municipios.data.length > 0 ? (
                      municipios.data.map((mun) => (
                        <SelectItem key={mun.id} value={mun.id}>
                          {mun.nombre}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-municipios" disabled>
                        {departamentoId
                          ? "No se encontraron municipios"
                          : "Selecciona un departamento primero"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.municipioId && (
                  <p className="text-sm text-red-500">
                    {errors.municipioId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isEdit && (
            <div className="space-y-4">
              <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Estado del Cliente
                </h3>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="isActive"
                  className="font-semibold text-gray-700"
                >
                  Estado
                </Label>
                <Select
                  value={watch("isActive") ? "true" : "false"}
                  onValueChange={(value) =>
                    setValue("isActive", value === "true")
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-4 border-t border-gray-100 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess?.()}
              disabled={isLoading}
              className="w-full sm:w-auto hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {isEdit ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  {isEdit ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Actualizar Cliente
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Crear Cliente
                    </>
                  )}
                </>
              )}
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-700 flex items-start gap-2">
              <span className="inline-block w-1 h-1 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>
                Todos los campos marcados con{" "}
                <span className="text-red-500">*</span> son obligatorios.
                Asegúrate de ingresar la información correctamente según el
                formato de tu país.
              </span>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormClientesAgro;
