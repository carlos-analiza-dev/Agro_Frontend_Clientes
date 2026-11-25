"use client";

import { editarAgroSucursal } from "@/api/agroservicio/agro-sucursales/accions/editar-agro-sucursal";
import { ingresarAgroSucursal } from "@/api/agroservicio/agro-sucursales/accions/ingresar-agro-sucursal";
import {
  CreateAgroSucursale,
  TipoSucursal,
} from "@/api/agroservicio/agro-sucursales/interface/crear-sucursal.interface";
import { SucursaleAgro } from "@/api/agroservicio/agro-sucursales/interface/response-sucursales-agro.interface";
import { GoogleAddressInput } from "@/components/location/GoogleAddressInput";
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
import { tiposSucursal } from "@/helpers/data/agroservicio/sucursales/tiposSucursales";
import useGetEmpleadosAgro from "@/hooks/agroservicios/empleados/useGetEmpleadosAgro";
import useGetDepartamentosByPais from "@/hooks/departamentos/useGetDepartamentosByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

interface Props {
  onSuccess?: () => void;
  editSucursal?: SucursaleAgro | null;
  isEdit?: boolean;
  paisId?: string;
}

const FormAddSucursalAgro = ({
  onSuccess,
  editSucursal,
  isEdit = false,
  paisId = "",
}: Props) => {
  const t = useTranslations("agroSucursalesPage");

  const { data: departamentos, isLoading: cargandoDepartamentos } =
    useGetDepartamentosByPais(paisId || "");
  const { data: gerentes } = useGetEmpleadosAgro({ rol: "Gerente Sucursal" });
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const { data: municipios, isLoading: cargandoMunicipios } =
    useGetMunicipiosActivosByDepto(departamentoSeleccionado);
  const queryClient = useQueryClient();

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAgroSucursale>();

  const departamentoId = watch("departamentoId");
  const direccionComplemento = watch("direccion_complemento");

  useEffect(() => {
    if (departamentoId) {
      setDepartamentoSeleccionado(departamentoId);
    }
  }, [departamentoId]);

  useEffect(() => {
    if (editSucursal && isEdit) {
      const latitud = editSucursal.latitud
        ? parseFloat(editSucursal.latitud)
        : undefined;
      const longitud = editSucursal.longitud
        ? parseFloat(editSucursal.longitud)
        : undefined;

      reset({
        nombre: editSucursal.nombre,
        tipo: editSucursal.tipo,
        direccion_complemento: editSucursal.direccion_complemento || "",
        municipioId: editSucursal.municipio.id,
        departamentoId: editSucursal.departamento.id,
        paisId: editSucursal.pais.id,
        gerenteId: editSucursal.gerente?.id || "",
        latitud: latitud,
        longitud: longitud,
      });

      setDepartamentoSeleccionado(editSucursal.departamento.id);

      if (editSucursal.latitud && editSucursal.longitud) {
        setCoordinates({
          lat: parseFloat(editSucursal.latitud),
          lng: parseFloat(editSucursal.longitud),
        });
      }
    } else {
      setValue("paisId", paisId);
    }
  }, [editSucursal, isEdit, reset, setValue, paisId]);

  const handleAddressChange = (address: string, lat?: number, lng?: number) => {
    setValue("direccion_complemento", address);

    if (lat !== undefined && lng !== undefined) {
      setCoordinates({ lat, lng });
      setValue("latitud", lat);
      setValue("longitud", lng);
    }
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    setValue("latitud", lat);
    setValue("longitud", lng);
  };

  const mutation = useMutation({
    mutationFn: (data: CreateAgroSucursale) => ingresarAgroSucursal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agro-sucursales"] });
      onSuccess?.();
      toast.success(t("form.messages.created"));
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("form.messages.createError");
        toast.error(errorMessage);
      } else {
        toast.error(t("form.messages.createUnexpectedError"));
      }
    },
  });

  const mutationEdit = useMutation({
    mutationFn: (data: CreateAgroSucursale) =>
      editarAgroSucursal(editSucursal?.id ?? "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agro-sucursales"] });
      onSuccess?.();
      toast.success(t("form.messages.updated"));
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("form.messages.updateError");
        toast.error(errorMessage);
      } else {
        toast.error(t("form.messages.updateUnexpectedError"));
      }
    },
  });

  const onSubmit = (data: CreateAgroSucursale) => {
    data.paisId = paisId || "";

    if (coordinates) {
      data.latitud = coordinates.lat;
      data.longitud = coordinates.lng;
    }

    if (isEdit && editSucursal) {
      mutationEdit.mutate(data);
    } else {
      mutation.mutate(data);
    }
  };

  const isPending = mutationEdit.isPending || mutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">{t("form.fields.name")}*</Label>
        <Input
          {...register("nombre", {
            required: t("form.validation.nameRequired"),
          })}
          placeholder={t("form.placeholders.name")}
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">{t("form.fields.type")}*</Label>
        <Select
          onValueChange={(value) => setValue("tipo", value as TipoSucursal)}
          defaultValue={editSucursal?.tipo}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("form.placeholders.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("form.labels.branchTypes")}</SelectLabel>
              {tiposSucursal.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.tipo && (
          <p className="text-sm font-medium text-red-500">
            {errors.tipo.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="font-bold">{t("form.fields.department")}*</Label>
          <Select
            onValueChange={(value) => setValue("departamentoId", value)}
            defaultValue={editSucursal?.departamento.id}
            disabled={!paisId || cargandoDepartamentos}
          >
            <SelectTrigger>
              {cargandoDepartamentos ? (
                <SelectValue placeholder={t("form.labels.loading")} />
              ) : (
                <SelectValue placeholder={t("form.placeholders.department")} />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("form.labels.departments")}</SelectLabel>
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
          <Label className="font-bold">{t("form.fields.municipality")}*</Label>
          <Select
            onValueChange={(value) => setValue("municipioId", value)}
            defaultValue={editSucursal?.municipio.id}
            disabled={!departamentoId || cargandoMunicipios}
          >
            <SelectTrigger>
              {cargandoMunicipios ? (
                <SelectValue placeholder={t("form.labels.loading")} />
              ) : (
                <SelectValue
                  placeholder={
                    departamentoId
                      ? t("form.placeholders.municipality")
                      : t("form.placeholders.selectDepartmentFirst")
                  }
                />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("form.labels.municipalities")}</SelectLabel>
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
        <GoogleAddressInput
          value={direccionComplemento || ""}
          onChange={handleAddressChange}
          onCoordinatesChange={handleCoordinatesChange}
          placeholder={t("form.placeholders.address")}
          label={t("form.fields.address") + "*"}
          required={true}
          error={errors.direccion_complemento?.message as string}
          initialLat={
            editSucursal?.latitud ? parseFloat(editSucursal.latitud) : null
          }
          initialLng={
            editSucursal?.longitud ? parseFloat(editSucursal.longitud) : null
          }
        />
      </div>

      <div className="space-y-1">
        <Label className="font-bold">{t("form.fields.manager")}</Label>
        <Select
          onValueChange={(value) => setValue("gerenteId", value)}
          defaultValue={editSucursal?.gerente?.id}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("form.placeholders.manager")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("form.labels.managers")}</SelectLabel>
              {gerentes?.empleados.map((gerente) => (
                <SelectItem key={gerente.id} value={gerente.id}>
                  {gerente.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end pt-4 gap-3">
        <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
          {t("form.buttons.cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isEdit ? t("form.buttons.update") : t("form.buttons.create")}
        </Button>
      </div>
    </form>
  );
};

export default FormAddSucursalAgro;
