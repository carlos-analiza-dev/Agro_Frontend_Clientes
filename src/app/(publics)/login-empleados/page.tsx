"use client";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import LoginEmpleadosForm from "@/components/Login/LoginEmpleadosForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthRedirect } from "@/helpers/funciones/useAuthRedirect";
import Image from "next/image";

export default function LoginPage() {
  const { isChecking } = useAuthRedirect();

  if (isChecking) {
    return <FullScreenLoader />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Ganaderia.png"
          alt="Campo agrícola"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
          priority
          unoptimized
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-700">
              El Sembrador FDN
            </CardTitle>
            <CardDescription>
              Accede a tu cuenta para gestionar el agroservicio
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginEmpleadosForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
