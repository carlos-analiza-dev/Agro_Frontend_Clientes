"use client";
import { CrearCliente } from "@/api/cliente/interfaces/crear-cliente.interface";
import { crearTrabajador } from "@/api/trabajadores/accions/crear-tranajador";
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
import { sexos } from "@/helpers/data/sexos";
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import usePaisesById from "@/hooks/paises/usePaisesById";
import { TipoCliente } from "@/interfaces/enums/clientes.enums";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Eye, EyeOff, MapPin, CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Asignaciones,
  Trabajador,
} from "@/api/trabajadores/interface/response-trabajadores.interface";
import { actualizarTrabajador } from "@/api/trabajadores/accions/editar-trabajador";
import { dataRoles } from "@/helpers/data/roles/dataRolesTrabajador";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { Badge } from "@/components/ui/badge";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import {
  validateEmail,
  validateIdentification,
} from "@/helpers/funciones/validaciones-form/valid";
import { ID_REGEX } from "@/helpers/data/formularios/identificacion";

interface Props {
  onSuccess: () => void;
  trabajador?: Trabajador | null;
}

const FormTrabajador = ({ onSuccess, trabajador }: Props) => {
  const { cliente } = useAuthStore();
  const paisId = cliente?.pais?.id ?? "";
  const paisNombre = cliente?.pais?.nombre ?? "";
  const isEditing = !!trabajador;
  const { data: fincas, isLoading: isLoadingFincas } = useFincasPropietarios(
    cliente?.id ?? "",
  );
  const queryClient = useQueryClient();
  const [prefijoNumber, setPrefijoNumber] = useState("");
  const [codigoPais, setCodigoPais] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [selectedFincas, setSelectedFincas] = useState<string[]>([]);
  const [isFincasOpen, setIsFincasOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CrearCliente & { rol?: TipoCliente }>({
    defaultValues: {
      email: "",
      password: "",
      nombre: "",
      identificacion: "",
      direccion: "",
      telefono: "",
      pais: paisId,
      departamento: "",
      municipio: "",
      sexo: "",
      rol: TipoCliente.TRABAJADOR,
    },
  });

  const currentDepartamento = watch("departamento");
  const currentMunicipio = watch("municipio");
  const currentSexo = watch("sexo");
  const currentRol = watch("rol");

  const { data: departamentos } = useGetDeptosActivesByPais(paisId);
  const { data: municipios } = useGetMunicipiosActivosByDepto(departamentoId);
  const { data: pais } = usePaisesById(paisId);

  useEffect(() => {
    if (trabajador) {
      setCargandoDatos(true);

      const telefonoLimpio =
        trabajador.telefono?.replace(/^\+\d{3}\s/, "") || "";

      const fincasAsignadas =
        trabajador.asignacionesTrabajador?.map(
          (f: Asignaciones) => f.finca.id,
        ) || [];

      reset({
        email: trabajador.email || "",
        password: "",
        nombre: trabajador.nombre || "",
        identificacion: trabajador.identificacion || "",
        direccion: trabajador.direccion || "",
        telefono: telefonoLimpio,
        pais: trabajador.pais?.id || paisId,
        departamento: trabajador.departamento?.id || "",
        municipio: trabajador.municipio?.id || "",
        sexo: trabajador.sexo || "",
        rol: trabajador.rol || TipoCliente.TRABAJADOR,
      });

      setSelectedFincas(fincasAsignadas);

      if (trabajador.departamento?.id) {
        setDepartamentoId(trabajador.departamento.id);
      }

      setCargandoDatos(false);
    } else {
      reset({
        email: "",
        password: "",
        nombre: "",
        identificacion: "",
        direccion: "",
        telefono: "",
        pais: paisId,
        departamento: "",
        municipio: "",
        sexo: "",
        rol: TipoCliente.TRABAJADOR,
      });
      setSelectedFincas([]);
      setDepartamentoId("");
      setCargandoDatos(false);
    }
  }, [trabajador, reset, paisId]);

  useEffect(() => {
    if (pais) {
      setCodigoPais(pais.data.code);
      setPrefijoNumber(pais.data.code_phone);
    }
    setValue("pais", paisId);
  }, [pais, paisId, setValue]);

  const createMutation = useMutation({
    mutationFn: crearTrabajador,
    onSuccess: () => {
      toast.success("Trabajador Creado Exitosamente");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["trabajadores"] });
      onSuccess();
    },
    onError: (error) => {
      handleMutationError(error, "crear");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CrearCliente & { rol?: TipoCliente }>;
    }) => actualizarTrabajador(id, data),
    onSuccess: () => {
      toast.success("Trabajador Actualizado Exitosamente");
      queryClient.invalidateQueries({ queryKey: ["trabajadores"] });
      onSuccess();
    },
    onError: (error) => {
      handleMutationError(error, "actualizar");
    },
  });

  const resetForm = () => {
    reset({
      email: "",
      password: "",
      nombre: "",
      identificacion: "",
      direccion: "",
      telefono: "",
      pais: paisId,
      departamento: "",
      municipio: "",
      sexo: "",
      rol: TipoCliente.TRABAJADOR,
    });
    setSelectedFincas([]);
    setDepartamentoId("");
  };

  const handleMutationError = (error: unknown, action: string) => {
    if (isAxiosError(error)) {
      const messages = error.response?.data?.message;
      const errorMessage = Array.isArray(messages)
        ? messages[0]
        : typeof messages === "string"
          ? messages
          : `Hubo un error al ${action} el trabajador`;
      toast.error(errorMessage);
    } else {
      toast.error(
        `Hubo un error al ${action} el trabajador. Inténtalo de nuevo.`,
      );
    }
  };

  const validatePassword = (password: string) => {
    if (isEditing && !password) return true;

    const re = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
    return (
      re.test(password) ||
      "La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, una minúscula y una mayúscula"
    );
  };

  const handleFincaToggle = (fincaId: string) => {
    setSelectedFincas((prev) =>
      prev.includes(fincaId)
        ? prev.filter((id) => id !== fincaId)
        : [...prev, fincaId],
    );
  };

  const validateFincas = () => {
    if (selectedFincas.length === 0) {
      toast.warning("Por favor, selecciona al menos una finca");
      return false;
    }
    return true;
  };

  const onSubmit = (data: CrearCliente & { rol?: TipoCliente }) => {
    if (!validateFincas()) return;

    const telefonoConPrefijo = `${prefijoNumber} ${data.telefono}`;

    const payloadWithFincas = {
      ...data,
      telefono: telefonoConPrefijo,
      fincasAsignadas: selectedFincas,
    };

    if (isEditing && trabajador) {
      const payload: Partial<CrearCliente & { rol?: TipoCliente }> = {
        nombre: payloadWithFincas.nombre,
        identificacion: payloadWithFincas.identificacion,
        telefono: payloadWithFincas.telefono,
        direccion: payloadWithFincas.direccion,
        sexo: payloadWithFincas.sexo,
        pais: payloadWithFincas.pais,
        departamento: payloadWithFincas.departamento,
        municipio: payloadWithFincas.municipio,
        rol: payloadWithFincas.rol,
        fincasAsignadas: payloadWithFincas.fincasAsignadas,
      };

      if (data.email !== trabajador.email) {
        payload.email = data.email;
      }

      if (data.password) {
        payload.password = data.password;
      }

      updateMutation.mutate({ id: trabajador.id, data: payload });
    } else {
      createMutation.mutate(payloadWithFincas as any);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (cargandoDatos && isEditing) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const selectedFincasData =
    fincas?.data?.fincas.filter((f: any) => selectedFincas.includes(f.id)) ||
    [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico*</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            disabled={isEditing}
            {...register("email", {
              required: "El correo es requerido",
              validate: validateEmail,
            })}
          />
          {errors.email && (
            <p className="text-sm font-medium text-red-500">
              {errors.email.message as string}
            </p>
          )}
          {isEditing && (
            <p className="text-xs text-muted-foreground">
              El correo electrónico no se puede modificar
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Contraseña {!isEditing && "*"}
            {isEditing && " (dejar en blanco para mantener)"}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={
                isEditing ? "Nueva contraseña (opcional)" : "••••••••"
              }
              {...register("password", {
                required: !isEditing ? "La contraseña es requerida" : false,
                validate: validatePassword,
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm font-medium text-red-500">
              {errors.password.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre Completo*</Label>
          <Input
            id="nombre"
            placeholder="Juan Pérez"
            {...register("nombre", {
              required: "El nombre es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
            })}
          />
          {errors.nombre && (
            <p className="text-sm font-medium text-red-500">
              {errors.nombre.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rol">Rol*</Label>
          <Select
            value={currentRol || ""}
            onValueChange={(value) => {
              setValue("rol", value as TipoCliente);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {dataRoles && dataRoles.length > 0 ? (
                dataRoles.map((rol) => (
                  <SelectItem key={rol.id} value={rol.value}>
                    {rol.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-roles" disabled>
                  No se encontraron roles
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.rol && (
            <p className="text-sm font-medium text-red-500">
              {errors.rol.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pais">País*</Label>
          <div className="relative">
            <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{paisNombre}</span>
              <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
            </div>
            <input type="hidden" {...register("pais")} value={paisId} />
          </div>
          <p className="text-xs text-muted-foreground">
            El país se asigna automáticamente según tu ubicación
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="departamento">Departamento*</Label>
          <Select
            value={currentDepartamento || ""}
            onValueChange={(value) => {
              setValue("departamento", value);
              setDepartamentoId(value);
              setValue("municipio", "");
            }}
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
          {errors.departamento && (
            <p className="text-sm font-medium text-red-500">
              {errors.departamento.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="municipio">Municipio*</Label>
          <Select
            value={currentMunicipio || ""}
            onValueChange={(value) => {
              setValue("municipio", value);
            }}
            disabled={!departamentoId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un municipio" />
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
          {errors.municipio && (
            <p className="text-sm font-medium text-red-500">
              {errors.municipio.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="identificacion">Identificación*</Label>
          <Input
            id="identificacion"
            placeholder="Número de documento"
            disabled={isEditing}
            {...register("identificacion", {
              required: "La identificación es requerida",
              validate: (value) => validateIdentification(value, codigoPais),
            })}
          />
          {errors.identificacion && (
            <p className="text-sm font-medium text-red-500">
              {errors.identificacion.message as string}
              {codigoPais &&
                ID_REGEX[codigoPais as keyof typeof ID_REGEX]?.example && (
                  <span className="block text-xs text-gray-500 mt-1">
                    {ID_REGEX[codigoPais as keyof typeof ID_REGEX]?.example}
                  </span>
                )}
            </p>
          )}
          {isEditing && (
            <p className="text-xs text-muted-foreground">
              La identificación no se puede modificar
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección*</Label>
          <Input
            id="direccion"
            placeholder="Calle 123 # 45-67"
            {...register("direccion", {
              required: "La dirección es requerida",
              minLength: {
                value: 10,
                message: "La dirección debe tener al menos 10 caracteres",
              },
            })}
          />
          {errors.direccion && (
            <p className="text-sm font-medium text-red-500">
              {errors.direccion.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono*</Label>
          <Input
            id="telefono"
            placeholder="0000-0000"
            {...register("telefono", {
              required: "El teléfono es requerido",
              pattern: {
                value: /^\d{4}-\d{4}$/,
                message: "El formato debe ser xxxx-xxxx",
              },
            })}
          />
          {errors.telefono && (
            <p className="text-sm font-medium text-red-500">
              {errors.telefono.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sexo">Sexo*</Label>
          <Select
            value={currentSexo || ""}
            onValueChange={(value) => {
              setValue("sexo", value);
            }}
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
            <p className="text-sm font-medium text-red-500">
              {errors.sexo.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Fincas Asignadas *</Label>

        {isLoadingFincas ? (
          <div className="flex items-center justify-center p-4 border rounded-md bg-gray-50">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando fincas...
            </span>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsFincasOpen(!isFincasOpen)}
              className="w-full p-2 text-left border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {selectedFincas.length > 0
                    ? `${selectedFincas.length} finca${selectedFincas.length > 1 ? "s" : ""} seleccionada${selectedFincas.length > 1 ? "s" : ""}`
                    : "Seleccionar fincas..."}
                </span>
                <span className="text-gray-400">
                  {isFincasOpen ? "▲" : "▼"}
                </span>
              </div>
            </button>

            {isFincasOpen && (
              <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
                {fincas?.data && fincas.data.fincas.length > 0 ? (
                  fincas.data.fincas.map((finca: Finca) => (
                    <label
                      key={finca.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFincas.includes(finca.id)}
                        onChange={() => handleFincaToggle(finca.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm">{finca.nombre_finca}</span>
                        {finca.ubicacion && (
                          <span className="text-xs text-muted-foreground">
                            {finca.ubicacion}
                          </span>
                        )}
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground p-2">
                    No tienes fincas disponibles para asignar.
                  </p>
                )}
              </div>
            )}

            {selectedFincas.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedFincasData.map((finca: Finca) => (
                  <Badge
                    key={finca.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {finca.nombre_finca}
                    <button
                      type="button"
                      onClick={() => handleFincaToggle(finca.id)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}

        <p className="text-xs text-muted-foreground">
          Selecciona las fincas a las que tendrá acceso el trabajador
        </p>
        {selectedFincas.length === 0 && (
          <p className="text-xs text-amber-600">
            ⚠️ Debes seleccionar al menos una finca
          </p>
        )}
      </div>

      <div className="mt-6">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Actualizando trabajador..."
              : "Creando trabajador..."
            : isEditing
              ? "Actualizar Trabajador"
              : "Agregar Trabajador"}
        </Button>
      </div>
    </form>
  );
};

export default FormTrabajador;
