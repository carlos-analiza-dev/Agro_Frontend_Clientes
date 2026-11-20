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
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function LoginPageEmpleados() {
  const { isChecking } = useAuthRedirect();
  const t = useTranslations("loginEmpleados");

  if (isChecking) {
    return <FullScreenLoader />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Ganaderia.png"
          alt="Campo agrícola"
          fill
          className="object-cover opacity-20"
          priority
          unoptimized
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-700">
              {t("title")}
            </CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>

          <CardContent>
            <LoginEmpleadosForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
