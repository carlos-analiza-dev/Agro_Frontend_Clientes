"use client";

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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("formProveedores");

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
      toast.success(t("messages.createSuccess"));
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
        toast.error(t("messages.createUnexpectedError"));
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
      toast.success(t("messages.updateSuccess"));
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
        toast.error(t("messages.updateUnexpectedError"));
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
          {t("sections.legalInformation")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="font-bold">{t("fields.legalName")}*</Label>
            <Input
              {...register("nombre_legal", {
                required: t("validation.legalNameRequired"),
              })}
              placeholder={t("placeholders.legalName")}
            />
            {errors.nombre_legal && (
              <p className="text-sm font-medium text-red-500">
                {errors.nombre_legal.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="font-bold">{t("fields.taxId")}*</Label>
            <Input
              {...register("nit_rtn", {
                required: t("validation.taxIdRequired"),
                pattern: {
                  value: /^[0-9-]+$/,
                  message: t("validation.taxIdPattern"),
                },
              })}
              placeholder={t("placeholders.taxId")}
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
            <Label className="font-bold">
              {t("fields.taxRegistrationNumber")}
            </Label>
            <Input
              {...register("nrc")}
              placeholder={t("placeholders.taxRegistrationNumber")}
            />
          </div>

          <div className="space-y-1">
            <Label className="font-bold">{t("fields.paymentTerm")}</Label>
            <Input
              {...register("plazo", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
                min: {
                  value: 0,
                  message: t("validation.paymentTermMin"),
                },
              })}
              type="number"
              placeholder={t("placeholders.paymentTerm")}
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
          {t("sections.contactInformation")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="font-bold">{t("fields.phone")}*</Label>
            <Input
              {...register("telefono", {
                required: t("validation.phoneRequired"),
              })}
              placeholder={t("placeholders.phone")}
            />
            {errors.telefono && (
              <p className="text-sm font-medium text-red-500">
                {errors.telefono.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="font-bold">{t("fields.email")}*</Label>
            <Input
              {...register("correo", {
                required: t("validation.emailRequired"),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t("validation.emailInvalid"),
                },
              })}
              placeholder={t("placeholders.email")}
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
          <Label className="font-bold">{t("fields.contactName")}</Label>
          <Input
            {...register("nombre_contacto")}
            placeholder={t("placeholders.contactName")}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-muted-foreground">
          {t("sections.location")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="font-bold">{t("fields.department")}*</Label>
            <Select
              onValueChange={(value) => setValue("departamentoId", value)}
              defaultValue={editProveedor?.departamento.id}
              disabled={!paisId || cargandoDepartamentos}
            >
              <SelectTrigger>
                {cargandoDepartamentos ? (
                  <SelectValue placeholder={t("placeholders.loading")} />
                ) : (
                  <SelectValue placeholder={t("placeholders.department")} />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("fields.departments")}</SelectLabel>
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
            <Label className="font-bold">{t("fields.municipality")}*</Label>
            <Select
              onValueChange={(value) => setValue("municipioId", value)}
              defaultValue={editProveedor?.municipio.id}
              disabled={!departamentoId || cargandoMunicipios}
            >
              <SelectTrigger>
                {cargandoMunicipios ? (
                  <SelectValue placeholder={t("placeholders.loading")} />
                ) : (
                  <SelectValue
                    placeholder={
                      departamentoId
                        ? t("placeholders.municipality")
                        : t("placeholders.selectDepartmentFirst")
                    }
                  />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("fields.municipalities")}</SelectLabel>
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
          <Label className="font-bold">{t("fields.address")}*</Label>
          <Input
            {...register("complemento_direccion", {
              required: t("validation.addressRequired"),
            })}
            placeholder={t("placeholders.address")}
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
          {t("sections.configuration")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="font-bold">{t("fields.paymentType")}*</Label>
            <Select
              onValueChange={(value) =>
                setValue("tipo_pago_default", value as TipoPagoProveedor)
              }
              defaultValue={editProveedor?.tipo_pago_default}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("placeholders.paymentType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("fields.paymentTypes")}</SelectLabel>
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
            <Label className="font-bold">{t("fields.scaleType")}*</Label>
            <Select
              onValueChange={(value) =>
                setValue("tipo_escala", value as TipoEscala)
              }
              defaultValue={editProveedor?.tipo_escala}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("placeholders.scaleType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("fields.scaleTypes")}</SelectLabel>
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
          {t("buttons.cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isEdit ? t("buttons.update") : t("buttons.create")}
        </Button>
      </div>
    </form>
  );
};

export default FormProveedores;
