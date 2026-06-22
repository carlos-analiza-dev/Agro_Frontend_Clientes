import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useRouter } from "next/navigation";
import { FullScreenLoader } from "../generics/FullScreenLoader";
import { Eye, EyeOff } from "lucide-react";
import { LoginInterface } from "@/interfaces/auth/login.interface";
import { isAxiosError } from "axios";
import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";

const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInterface>();

  const validateEmail = (value: string) => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return "Correo electrónico inválido";
    }
    return true;
  };

  const onSubmit = async (data: LoginInterface) => {
    try {
      setIsPosting(true);
      const { email, password } = data;

      const authResponse = await login(email, password);

      if (!authResponse) {
        toast.error(
          "Usuario o contraseña incorrectos. Contacte al administrador.",
        );
        return;
      }

      const { cliente, token } = authResponse;

      if (!cliente || !cliente.id) {
        toast.error("Credenciales inválidas");
        return;
      }

      if (!cliente.isActive) {
        toast.error("Su cuenta está desactivada. Contacte al administrador.");
        return;
      }

      if (!token) {
        toast.error("Error de autenticación: token no recibido");
        return;
      }

      if (cliente.paqueteActivo?.paquete.tipo === TipoPaquete.AGRO_GESTION) {
        router.replace("/select-destination");
      } else {
        router.replace("/panel");
      }

      toast.success("¡Inicio de sesión exitoso!");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Credenciales incorrectas");
        } else if (error.response?.status === 403) {
          toast.error("Usuario no autorizado");
        } else if (error.response?.status === 404) {
          toast.error("Usuario no encontrado");
        } else if (error.code === "NETWORK_ERROR") {
          toast.error("Error de conexión. Verifique su internet");
        } else {
          toast.error("Ocurrió un error durante el inicio de sesión");
        }
      }
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@correo.com"
            {...register("email", {
              required: "El correo es requerido",
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
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
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
          {isPosting ? <FullScreenLoader /> : "Iniciar Sesión"}
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
