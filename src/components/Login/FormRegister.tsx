import { CreateCliente } from "@/api/cliente/accions/crear-cliente";
import { CrearCliente } from "@/api/cliente/interfaces/crear-cliente.interface";
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
import { ID_REGEX } from "@/helpers/data/formularios/identificacion";
import { sexos } from "@/helpers/data/sexos";
import {
  validateEmail,
  validateIdentification,
} from "@/helpers/funciones/validaciones-form/valid";
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import useGetPaisesActivos from "@/hooks/paises/useGetPaisesActivos";
import usePaisesById from "@/hooks/paises/usePaisesById";

import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const FormRegister = () => {
  const t = useTranslations("registerForm");
  const [prefijoNumber, setPrefijoNumber] = useState("");
  const router = useRouter();
  const [codigoPais, setCodigoPais] = useState("");
  const [paisId, setPaisId] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CrearCliente>({
    defaultValues: {
      email: "",
      password: "",
      nombre: "",
      identificacion: "",
      direccion: "",
      telefono: "",
      pais: "",
      departamento: "",
      municipio: "",
      sexo: "",
    },
  });

  const { data: paises } = useGetPaisesActivos();

  const { data: departamentos } = useGetDeptosActivesByPais(paisId);

  const { data: municipios } = useGetMunicipiosActivosByDepto(departamentoId);

  const { data: pais } = usePaisesById(paisId);

  useEffect(() => {
    if (pais) {
      setCodigoPais(pais.data.code);
      setPrefijoNumber(pais.data.code_phone);
    }
  }, [pais]);

  const mutation = useMutation({
    mutationFn: CreateCliente,
    onSuccess: () => {
      toast.success(t("success"));

      reset({
        email: "",
        password: "",
        nombre: "",
        identificacion: "",
        direccion: "",
        telefono: "",
        pais: "",
        departamento: "",
        municipio: "",
        sexo: "",
      });

      setPaisId("");
      setDepartamentoId("");
      setCodigoPais("");
      setPrefijoNumber("");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("errors.create");

        toast.error(errorMessage);
      } else {
        toast.error(t("errors.general"));
      }
    },
  });

  const validatePassword = (password: string) => {
    const re = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;

    return re.test(password) || t("validation.passwordInvalid");
  };

  const onSubmit = (data: CrearCliente) => {
    const telefonoConPrefijo = `${prefijoNumber} ${data.telefono}`;

    const payload: CrearCliente = {
      ...data,
      telefono: telefonoConPrefijo,
    };

    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}*</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            {...register("email", {
              required: t("validation.emailRequired"),
              validate: validateEmail,
            })}
          />
          {errors.email && (
            <p className="text-sm font-medium text-red-500">
              {errors.email.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}s*</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "password" : "text"}
              placeholder="••••••••"
              {...register("password", {
                required: t("validation.passwordRequired"),
                validate: validatePassword,
              })}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm font-medium text-red-500">
              {errors.password.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nombre">{t("name")}*</Label>
          <Input
            id="nombre"
            placeholder="Juan Pérez"
            {...register("nombre", {
              required: t("validation.nameRequired"),
              minLength: {
                value: 3,
                message: t("validation.nameMinLength"),
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
          <Label htmlFor="pais">{t("country")}*</Label>
          <Select
            onValueChange={(value) => {
              setValue("pais", value);
              setPaisId(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("countryPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {paises?.data.map((pais) => (
                <SelectItem key={pais.id} value={pais.id}>
                  {pais.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.pais && (
            <p className="text-sm font-medium text-red-500">
              {errors.pais.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="departamento">{t("department")}*</Label>
          <Select
            onValueChange={(value) => {
              setValue("departamento", value);
              setDepartamentoId(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("departmentPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {departamentos && departamentos.data.length > 0 ? (
                departamentos?.data.map((depto) => (
                  <SelectItem key={depto.id} value={depto.id}>
                    {depto.nombre}
                  </SelectItem>
                ))
              ) : (
                <p>{t("noDepartments")}</p>
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
          <Label htmlFor="municipio">{t("municipality")}*</Label>
          <Select
            onValueChange={(value) => {
              setValue("municipio", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("municipalityPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {municipios && municipios.data.length > 0 ? (
                municipios?.data.map((mun) => (
                  <SelectItem key={mun.id} value={mun.id}>
                    {mun.nombre}
                  </SelectItem>
                ))
              ) : (
                <p>{t("noMunicipalities")}</p>
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
          <Label htmlFor="identificacion">{t("identification")}*</Label>
          <Input
            id="identificacion"
            placeholder="Número de documento"
            {...register("identificacion", {
              required: t("validation.identificationRequired"),
              validate: (value) => validateIdentification(value, codigoPais),
            })}
          />
          {errors.identificacion && (
            <p className="text-sm font-medium text-red-500">
              {errors.identificacion.message as string}
              {codigoPais &&
                ID_REGEX[codigoPais as keyof typeof ID_REGEX]?.example && (
                  <span className="block text-xs text-gray-500">
                    {ID_REGEX[codigoPais as keyof typeof ID_REGEX]?.example}
                  </span>
                )}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion">{t("address")}*</Label>
          <Input
            id="direccion"
            placeholder="Calle 123 # 45-67"
            {...register("direccion", {
              required: t("validation.addressRequired"),
              minLength: {
                value: 10,
                message: t("validation.addressMinLength"),
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
          <Label htmlFor="telefono">{t("phone")}*</Label>
          <Input
            id="telefono"
            placeholder="0000-0000"
            {...register("telefono", {
              required: t("validation.phoneRequired"),
              pattern: {
                value: /^\d{4}-\d{4}$/,
                message: t("validation.phoneFormat"),
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
          <Label htmlFor="sexo">{t("sex")}*</Label>
          <Select
            onValueChange={(value) => {
              setValue("sexo", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("sexPlaceholder")} />
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

      <div className="mt-6">
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {t("submit")}
        </Button>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
        <Link
          href="/reset-password"
          className="text-green-600 hover:underline text-center sm:text-left"
        >
          {t("forgotPassword")}
        </Link>

        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
          <p className="text-gray-600">{t("hasAccount")}</p>
          <Link
            href="/login"
            className="text-green-600 hover:underline font-medium"
          >
            {t("login")}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default FormRegister;
