import { CrearEmpleadoAgroInterface } from "@/api/agroservicio/empleados/interface/crear-empleado-agro.interface";
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
import useGetRolesAgro from "@/hooks/agroservicios/roles-agro/useGetRolesAgro";
import useGetSucursalesAgro from "@/hooks/agroservicios/sucursales/useGetSucursalesAgro";
import useGetDepartamentosByPais from "@/hooks/departamentos/useGetDepartamentosByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { EmpleadoAgro } from "@/api/agroservicio/empleados/interface/response-empleados-agro.interface";
import { Eye, EyeOff } from "lucide-react";
import { sexos } from "@/helpers/data/sexos";
import usePaisesById from "@/hooks/paises/usePaisesById";
import { ingresarAgroEmpleado } from "@/api/agroservicio/empleados/accions/ingresar-empleado";
import { editarAgroEmpleado } from "@/api/agroservicio/empleados/accions/editar-empleado";
import { ID_REGEX } from "@/helpers/data/formularios/identificacion";
import {
  validateEmail,
  validateIdentification,
} from "@/helpers/funciones/validaciones-form/valid";

interface Props {
  onSuccess?: () => void;
  editEmpleado?: EmpleadoAgro | null;
  isEdit?: boolean;
  paisId?: string;
}

const FormEmpleadosAgro = ({
  onSuccess,
  editEmpleado,
  isEdit = false,
  paisId = "",
}: Props) => {
  const queryClient = useQueryClient();
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [codigoPais, setCodigoPais] = useState("");
  const [prefijoNumber, setPrefijoNumber] = useState("");
  const { data: departamentos, isLoading: cargandoDepartamentos } =
    useGetDepartamentosByPais(paisId || "");
  const { data: municipios, isLoading: cargandoMunicipios } =
    useGetMunicipiosActivosByDepto(departamentoSeleccionado);
  const { data: roles, isLoading: cargandoRoles } = useGetRolesAgro();
  const { data: sucursales, isLoading: cargandoSucursales } =
    useGetSucursalesAgro({
      limit: 100,
      offset: 0,
    });
  const { data: pais } = usePaisesById(paisId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearEmpleadoAgroInterface>();

  const departamentoId = watch("departamentoId");

  useEffect(() => {
    if (departamentoId) {
      setDepartamentoSeleccionado(departamentoId);
    }
  }, [departamentoId]);

  useEffect(() => {
    if (pais) {
      setCodigoPais(pais.data.code);
      setPrefijoNumber(pais.data.code_phone);
    }
  }, [pais]);

  useEffect(() => {
    if (editEmpleado && isEdit) {
      const telefonoLimpio =
        editEmpleado.telefono?.replace(/^\+\d{3}\s/, "") || "";

      reset({
        nombre: editEmpleado.nombre,
        identificacion: editEmpleado.identificacion,
        telefono: telefonoLimpio,
        email: editEmpleado.email,
        password: "",
        direccion: editEmpleado.direccion || "",
        sexo: editEmpleado.sexo,
        roleId: editEmpleado.role.id,
        paisId: editEmpleado.pais.id,
        departamentoId: editEmpleado.departamento.id,
        municipioId: editEmpleado.municipio.id,
        sucursalId: editEmpleado.sucursal?.id || "",
      });
      setDepartamentoSeleccionado(editEmpleado.departamento.id);
    } else {
      setValue("paisId", paisId);
    }
  }, [editEmpleado, isEdit, reset, setValue, paisId]);

  const mutation = useMutation({
    mutationFn: (data: CrearEmpleadoAgroInterface) =>
      ingresarAgroEmpleado(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados-agro"] });
      toast.success("Empleado creado exitosamente");
      reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el empleado";
        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al crear el empleado. Inténtalo de nuevo.");
      }
    },
  });

  const mutationEdit = useMutation({
    mutationFn: (data: CrearEmpleadoAgroInterface) =>
      editarAgroEmpleado(editEmpleado?.id ?? "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados-agro"] });
      toast.success("Empleado actualizado exitosamente");
      reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el empleado";
        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al actualizar el empleado. Inténtalo de nuevo.",
        );
      }
    },
  });

  const onSubmit = (data: CrearEmpleadoAgroInterface) => {
    data.paisId = paisId || "";

    if (prefijoNumber && data.telefono) {
      data.telefono = `${prefijoNumber} ${data.telefono}`;
    }

    if (isEdit && editEmpleado) {
      const payload = { ...data };
      if (!payload.password) {
        delete payload.password;
      }
      mutationEdit.mutate(payload);
    } else {
      mutation.mutate(data);
    }
  };

  const isPending = mutationEdit.isPending || mutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="font-bold">Nombre Completo*</Label>
          <Input
            {...register("nombre", {
              required: "El campo nombre es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
            })}
            placeholder="Escriba el nombre completo del empleado"
          />
          {errors.nombre && (
            <p className="text-sm font-medium text-red-500">
              {errors.nombre.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Identificación*</Label>
          <Input
            {...register("identificacion", {
              required: "El campo identificación es requerido",
              validate: (value) => validateIdentification(value, codigoPais),
            })}
            placeholder={
              codigoPais
                ? ID_REGEX[codigoPais as keyof typeof ID_REGEX]?.example ||
                  "Número de documento"
                : "Número de documento"
            }
            disabled={isEdit}
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
          {isEdit && (
            <p className="text-xs text-muted-foreground">
              La identificación no se puede modificar
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Email*</Label>
          <Input
            {...register("email", {
              required: "El campo email es requerido",
              validate: validateEmail,
            })}
            type="email"
            placeholder="ejemplo@correo.com"
            disabled={isEdit}
          />
          {errors.email && (
            <p className="text-sm font-medium text-red-500">
              {errors.email.message as string}
            </p>
          )}
          {isEdit && (
            <p className="text-xs text-muted-foreground">
              El email no se puede modificar
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Teléfono*</Label>
          <Input
            {...register("telefono", {
              required: "El campo teléfono es requerido",
              pattern: {
                value: /^\d{4}-\d{4}$/,
                message: "El formato debe ser xxxx-xxxx",
              },
            })}
            placeholder={`${prefijoNumber || "+XXX"} 0000-0000`}
          />
          {errors.telefono && (
            <p className="text-sm font-medium text-red-500">
              {errors.telefono.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">
            {isEdit ? "Nueva Contraseña (opcional)" : "Contraseña*"}
          </Label>
          <div className="relative">
            <Input
              {...register("password", {
                required: !isEdit ? "El campo contraseña es requerido" : false,
              })}
              type={showPassword ? "text" : "password"}
              placeholder={
                isEdit
                  ? "Dejar en blanco para mantener la actual"
                  : "Ingrese una contraseña"
              }
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
          {isEdit && (
            <p className="text-xs text-muted-foreground">
              Dejar en blanco para mantener la contraseña actual
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Sexo*</Label>
          <Select
            onValueChange={(value) => setValue("sexo", value)}
            defaultValue={editEmpleado?.sexo}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sexo</SelectLabel>
                {sexos.map((sexo) => (
                  <SelectItem key={sexo.id} value={sexo.value}>
                    {sexo.sexo}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.sexo && (
            <p className="text-sm font-medium text-red-500">
              {errors.sexo.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label className="font-bold">Dirección*</Label>
          <Input
            {...register("direccion", {
              required: "El campo dirección es requerido",
              minLength: {
                value: 10,
                message: "La dirección debe tener al menos 10 caracteres",
              },
            })}
            placeholder="Dirección completa del empleado"
          />
          {errors.direccion && (
            <p className="text-sm font-medium text-red-500">
              {errors.direccion.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Departamento*</Label>
          <Select
            onValueChange={(value) => {
              setValue("departamentoId", value);
              setDepartamentoSeleccionado(value);
              setValue("municipioId", "");
            }}
            defaultValue={editEmpleado?.departamento.id}
            disabled={!paisId || cargandoDepartamentos}
          >
            <SelectTrigger>
              {cargandoDepartamentos ? (
                <SelectValue placeholder="Cargando..." />
              ) : (
                <SelectValue placeholder="Selecciona un departamento" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Departamentos</SelectLabel>
                {departamentos?.data?.departamentos?.map((depto) => (
                  <SelectItem key={depto.id} value={depto.id}>
                    {depto.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.departamentoId && (
            <p className="text-sm font-medium text-red-500">
              {errors.departamentoId.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Municipio*</Label>
          <Select
            onValueChange={(value) => setValue("municipioId", value)}
            defaultValue={editEmpleado?.municipio.id}
            disabled={!departamentoId || cargandoMunicipios}
          >
            <SelectTrigger>
              {cargandoMunicipios ? (
                <SelectValue placeholder="Cargando..." />
              ) : (
                <SelectValue
                  placeholder={
                    departamentoId
                      ? "Selecciona un municipio"
                      : "Primero selecciona un departamento"
                  }
                />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Municipios</SelectLabel>
                {municipios?.data?.map((mun) => (
                  <SelectItem key={mun.id} value={mun.id}>
                    {mun.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.municipioId && (
            <p className="text-sm font-medium text-red-500">
              {errors.municipioId.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Rol*</Label>
          <Select
            onValueChange={(value) => setValue("roleId", value)}
            defaultValue={editEmpleado?.role.id}
            disabled={cargandoRoles}
          >
            <SelectTrigger>
              {cargandoRoles ? (
                <SelectValue placeholder="Cargando..." />
              ) : (
                <SelectValue placeholder="Selecciona un rol" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                {roles?.map((rol) => (
                  <SelectItem key={rol.id} value={rol.id}>
                    {rol.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.roleId && (
            <p className="text-sm font-medium text-red-500">
              {errors.roleId.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Sucursal*</Label>
          <Select
            onValueChange={(value) => setValue("sucursalId", value)}
            defaultValue={editEmpleado?.sucursal?.id}
            disabled={cargandoSucursales}
          >
            <SelectTrigger>
              {cargandoSucursales ? (
                <SelectValue placeholder="Cargando..." />
              ) : (
                <SelectValue placeholder="Selecciona una sucursal" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sucursales</SelectLabel>
                {sucursales?.sucursales?.map((sucursal) => (
                  <SelectItem key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.sucursalId && (
            <p className="text-sm font-medium text-red-500">
              {errors.sucursalId.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess && onSuccess()}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center">
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {isEdit ? "Actualizando..." : "Creando..."}
            </span>
          ) : (
            <span>{isEdit ? "Actualizar Empleado" : "Crear Empleado"}</span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormEmpleadosAgro;
