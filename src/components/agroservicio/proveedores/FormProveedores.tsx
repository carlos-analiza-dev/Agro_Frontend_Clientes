import {
  editarAgroProveedor,
  editarAgroProveedorEmpleados,
} from "@/api/agroservicio/proveedores/accions/editar-proveedores";
import {
  ingresarAgroProveedor,
  ingresarAgroProveedorEmpleados,
} from "@/api/agroservicio/proveedores/accions/ingresar-proveedores";
import { CrearProveedoresAgro } from "@/api/agroservicio/proveedores/interface/crear-proveedores.interface";
import {
  ProveedoreAgro,
  TipoEscala,
  TipoPagoProveedor,
} from "@/api/agroservicio/proveedores/interface/response-agro-proveedores.interface";
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
import {
  tiposEscala,
  tiposPagoProveedor,
} from "@/helpers/data/agroservicio/proveedores/escalas_pagos";
import useGetDepartamentosByPais from "@/hooks/departamentos/useGetDepartamentosByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  onSuccess?: () => void;
  editProveedor?: ProveedoreAgro | null;
  isEdit?: boolean;
  paisId?: string;
  isEmpleado?: boolean;
}

const FormProveedores = ({
  onSuccess,
  editProveedor,
  isEdit = false,
  paisId = "",
  isEmpleado = false,
}: Props) => {
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");

  const { data: departamentos, isLoading: cargandoDepartamentos } =
    useGetDepartamentosByPais(paisId || "");
  const { data: municipios, isLoading: cargandoMunicipios } =
    useGetMunicipiosActivosByDepto(departamentoSeleccionado);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearProveedoresAgro>();

  const departamentoId = watch("departamentoId");

  useEffect(() => {
    if (departamentoId) {
      setDepartamentoSeleccionado(departamentoId);
    }
  }, [departamentoId]);

  useEffect(() => {
    if (editProveedor && isEdit) {
      reset({
        nit_rtn: editProveedor.nit_rtn,
        nrc: editProveedor.nrc || "",
        nombre_legal: editProveedor.nombre_legal,
        complemento_direccion: editProveedor.complemento_direccion,
        telefono: editProveedor.telefono,
        correo: editProveedor.correo,
        plazo: editProveedor.plazo || undefined,
        nombre_contacto: editProveedor.nombre_contacto || "",
        departamentoId: editProveedor.departamento.id,
        municipioId: editProveedor.municipio.id,
        tipo_escala: editProveedor.tipo_escala,
        tipo_pago_default: editProveedor.tipo_pago_default,
      });
      setDepartamentoSeleccionado(editProveedor.departamento.id);
    }
  }, [editProveedor, isEdit, reset]);

  const mutationCrear = useMutation({
    mutationFn: (data: CrearProveedoresAgro) =>
      isEmpleado
        ? ingresarAgroProveedorEmpleados(data)
        : ingresarAgroProveedor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agro-proveedores"] });
      onSuccess?.();
      toast.success("Proveedor creado exitosamente");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el proveedor";
        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al crear el proveedor. Inténtalo de nuevo.");
      }
    },
  });

  const mutationEditar = useMutation({
    mutationFn: (data: CrearProveedoresAgro) =>
      isEmpleado
        ? editarAgroProveedorEmpleados(editProveedor?.id ?? "", data)
        : editarAgroProveedor(editProveedor?.id ?? "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agro-proveedores"] });
      onSuccess?.();
      toast.success("Proveedor actualizado exitosamente");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el proveedor";
        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al actualizar el proveedor. Inténtalo de nuevo.",
        );
      }
    },
  });

  const onSubmit = (data: CrearProveedoresAgro) => {
    if (!data.nrc) data.nrc = "";
    if (!data.nombre_contacto) data.nombre_contacto = "";

    if (isEdit && editProveedor) {
      mutationEditar.mutate(data);
    } else {
      mutationCrear.mutate(data);
    }
  };

  const isPending = mutationEditar.isPending || mutationCrear.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-muted-foreground">
          Información Legal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="font-bold">Nombre Legal*</Label>
            <Input
              {...register("nombre_legal", {
                required: "El nombre legal es requerido",
              })}
              placeholder="Nombre legal de la empresa"
            />
            {errors.nombre_legal && (
              <p className="text-sm font-medium text-red-500">
                {errors.nombre_legal.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="font-bold">NIT/RTN*</Label>
            <Input
              {...register("nit_rtn", {
                required: "El NIT/RTN es requerido",
                pattern: {
                  value: /^[0-9-]+$/,
                  message: "Solo números y guiones",
                },
              })}
              placeholder="Ej: 0801-2003-12345"
            />
            {errors.nit_rtn && (
              <p className="text-sm font-medium text-red-500">
                {errors.nit_rtn.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="font-bold">NRC</Label>
            <Input
              {...register("nrc")}
              placeholder="Número de Registro de Contribuyente (opcional)"
            />
          </div>

          <div className="space-y-1">
            <Label className="font-bold">Plazo (días)</Label>
            <Input
              {...register("plazo", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
                min: {
                  value: 0,
                  message: "El plazo debe ser mayor o igual a 0",
                },
              })}
              type="number"
              placeholder="Días de plazo (opcional)"
            />
            {errors.plazo && (
              <p className="text-sm font-medium text-red-500">
                {errors.plazo.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-muted-foreground">
          Información de Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="font-bold">Teléfono*</Label>
            <Input
              {...register("telefono", {
                required: "El teléfono es requerido",
              })}
              placeholder="Ej: 2234-5678"
            />
            {errors.telefono && (
              <p className="text-sm font-medium text-red-500">
                {errors.telefono.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="font-bold">Correo Electrónico*</Label>
            <Input
              {...register("correo", {
                required: "El correo es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido",
                },
              })}
              placeholder="correo@proveedor.com"
              type="email"
            />
            {errors.correo && (
              <p className="text-sm font-medium text-red-500">
                {errors.correo.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Nombre de Contacto</Label>
          <Input
            {...register("nombre_contacto")}
            placeholder="Nombre de la persona de contacto (opcional)"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-muted-foreground">
          Ubicación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="font-bold">Departamento*</Label>
            <Select
              onValueChange={(value) => setValue("departamentoId", value)}
              defaultValue={editProveedor?.departamento.id}
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
              defaultValue={editProveedor?.municipio.id}
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
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Dirección*</Label>
          <Input
            {...register("complemento_direccion", {
              required: "La dirección es requerida",
            })}
            placeholder="Dirección completa del proveedor"
          />
          {errors.complemento_direccion && (
            <p className="text-sm font-medium text-red-500">
              {errors.complemento_direccion.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-muted-foreground">
          Configuración
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="font-bold">Tipo de Pago*</Label>
            <Select
              onValueChange={(value) =>
                setValue("tipo_pago_default", value as TipoPagoProveedor)
              }
              defaultValue={editProveedor?.tipo_pago_default}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipos de Pago</SelectLabel>
                  {tiposPagoProveedor.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.tipo_pago_default && (
              <p className="text-sm font-medium text-red-500">
                {errors.tipo_pago_default.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="font-bold">Tipo de Escala*</Label>
            <Select
              onValueChange={(value) =>
                setValue("tipo_escala", value as TipoEscala)
              }
              defaultValue={editProveedor?.tipo_escala}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de escala" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipos de Escala</SelectLabel>
                  {tiposEscala.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.tipo_escala && (
              <p className="text-sm font-medium text-red-500">
                {errors.tipo_escala.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 gap-3">
        <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isEdit ? "Actualizar Proveedor" : "Crear Proveedor"}
        </Button>
      </div>
    </form>
  );
};

export default FormProveedores;
