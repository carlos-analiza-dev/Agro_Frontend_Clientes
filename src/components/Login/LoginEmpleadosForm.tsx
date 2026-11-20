"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FullScreenLoader } from "../generics/FullScreenLoader";
import { Eye, EyeOff } from "lucide-react";
import { LoginInterface } from "@/interfaces/auth/login.interface";
import { isAxiosError } from "axios";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import { useTranslations } from "next-intl";

const LoginEmpleadosForm = () => {
  const router = useRouter();
  const { login } = useAuthEmpleadoStore();
  const t = useTranslations("loginEmpleadosForm");

  const [isPosting, setIsPosting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInterface>();

  const validateEmail = (value: string) => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return t("validation.emailInvalid");
    }

    return true;
  };

  const onSubmit = async (data: LoginInterface) => {
    try {
      setIsPosting(true);

      const { email, password } = data;

      const authResponse = await login(email, password);

      if (!authResponse) {
        toast.error(t("errors.invalidCredentialsAdmin"));
        return;
      }

      const { empleado, token } = authResponse;

      if (!empleado || !empleado.id) {
        toast.error(t("errors.invalidCredentials"));
        return;
      }

      if (!empleado.isActive) {
        toast.error(t("errors.inactiveAccount"));
        return;
      }

      if (!token) {
        toast.error(t("errors.tokenMissing"));
        return;
      }

      if (empleado) {
        router.replace("/agro-empleados/agro-servicios");
        toast.success(t("success"));
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error(t("errors.invalidCredentials"));
        } else if (error.response?.status === 403) {
          toast.error(t("errors.unauthorized"));
        } else if (error.response?.status === 404) {
          toast.error(t("errors.userNotFound"));
        } else if (error.code === "NETWORK_ERROR") {
          toast.error(t("errors.network"));
        } else {
          toast.error(t("errors.general"));
        }
      } else {
        toast.error(t("errors.general"));
      }
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>

        <Input
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          {...register("email", {
            required: t("validation.emailRequired"),
            validate: validateEmail,
          })}
          disabled={isPosting}
        />

        {errors.email && (
          <p className="text-sm font-medium text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("passwordPlaceholder")}
            {...register("password", {
              required: t("validation.passwordRequired"),
              minLength: {
                value: 6,
                message: t("validation.passwordMinLength"),
              },
            })}
            disabled={isPosting}
          />

          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <p className="text-sm font-medium text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isPosting}
      >
        {isPosting ? <FullScreenLoader /> : t("submit")}
      </Button>
    </form>
  );
};

export default LoginEmpleadosForm;
