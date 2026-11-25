"use client";

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
import { useTranslations } from "next-intl";
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
  const t = useTranslations("agroClientesPage.form");

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

      toast.success(t("messages.created"));
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
        toast.error(t("messages.createError"));
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

      toast.success(t("messages.updated"));
      onSuccess?.();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.updateError");

        toast.error(errorMessage);
      } else {
        toast.error(t("messages.updateError"));
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
      toast.error(t("validation.locationRequired"));
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

  const sexoLabels: Record<string, string> = {
    Masculino: t("sex.male"),
    Femenino: t("sex.female"),
    Otro: t("sex.other"),
  };

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
              {isEdit ? t("title.edit") : t("title.create")}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEdit ? t("description.edit") : t("description.create")}
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
                {t("sections.personal")}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombre" className="font-semibold text-gray-700">
                  {t("fields.name")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  placeholder={t("placeholders.name")}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register("nombre", {
                    required: t("validation.nameRequired"),
                    minLength: {
                      value: 3,
                      message: t("validation.nameMinLength"),
                    },
                    maxLength: {
                      value: 150,
                      message: t("validation.nameMaxLength"),
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
                    {t("fields.identification")}{" "}
                    <span className="text-red-500">*</span>
                  </div>
                </Label>
                <Input
                  id="identificacion"
                  placeholder={
                    codigoPais && ID_REGEX[codigoPais as keyof typeof ID_REGEX]
                      ? ID_REGEX[codigoPais as keyof typeof ID_REGEX].example
                      : t("placeholders.identification")
                  }
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  disabled={isLoading}
                  {...register("identificacion", {
                    required: t("validation.identificationRequired"),
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
                  {t("fields.gender")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={currentSexo || ""}
                  onValueChange={(value) => setValue("sexo", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("placeholders.gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    {sexos.map((sexo) => (
                      <SelectItem key={sexo.id} value={sexo.value}>
                        {sexoLabels[sexo.sexo] || sexo.sexo}
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
                {t("sections.contact")}
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
                    {t("fields.phone")} <span className="text-red-500">*</span>
                  </div>
                </Label>
                <Input
                  id="telefono"
                  placeholder={t("placeholders.phone")}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  {...register("telefono", {
                    required: t("validation.phoneRequired"),
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
                  {t("hints.phoneFormat")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {t("fields.email")}
                  </div>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("placeholders.email")}
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
                <p className="text-xs text-muted-foreground">
                  {t("hints.optional")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-100">
              <h3 className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t("sections.location")}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pais" className="font-semibold text-gray-700">
                  {t("fields.country")} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {pais?.data?.nombre || t("labels.loading")}
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                  </div>
                  <input type="hidden" {...register("departamentoId")} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("hints.countryAutomatic")}
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="direccion"
                  className="font-semibold text-gray-700"
                >
                  {t("fields.address")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="direccion"
                  placeholder={t("placeholders.address")}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register("direccion", {
                    required: t("validation.addressRequired"),
                    minLength: {
                      value: 10,
                      message: t("validation.addressMinLength"),
                    },
                    maxLength: {
                      value: 200,
                      message: t("validation.addressMaxLength"),
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
                    {t("fields.department")}{" "}
                    <span className="text-red-500">*</span>
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
                    <SelectValue placeholder={t("placeholders.department")} />
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
                        {t("empty.departments")}
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
                    {t("fields.municipality")}{" "}
                    <span className="text-red-500">*</span>
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
                          ? t("placeholders.municipality")
                          : t("placeholders.selectDepartmentFirst")
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
                          ? t("empty.municipalities")
                          : t("placeholders.selectDepartmentFirst")}
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
                  {t("sections.customerStatus")}
                </h3>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="isActive"
                  className="font-semibold text-gray-700"
                >
                  {t("fields.status")}
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
                    <SelectItem value="true">{t("status.active")}</SelectItem>
                    <SelectItem value="false">
                      {t("status.inactive")}
                    </SelectItem>
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
              {t("buttons.cancel")}
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {isEdit ? t("buttons.updating") : t("buttons.creating")}
                </>
              ) : (
                <>
                  {isEdit ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("buttons.update")}
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      {t("buttons.create")}
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
                {t("hints.requiredFields")}{" "}
                <span className="text-red-500">*</span>{" "}
                {t("hints.requiredFieldsSuffix")}
              </span>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormClientesAgro;
