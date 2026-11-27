"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import { useRouter } from "next/navigation";

const PageNotFound = () => {
  const t = useTranslations("pageNotFound");

  const { cliente, token: clienteToken } = useAuthStore();
  const { empleado, token: empleadoToken } = useAuthEmpleadoStore();

  const router = useRouter();

  const isAuthenticated =
    (!!cliente && !!clienteToken) || (!!empleado && !!empleadoToken);

  const handleNotFound = () => {
    if (isAuthenticated) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center px-6">
        <h1 className="text-9xl font-extrabold text-gray-700 dark:text-gray-200">
          404
        </h1>

        <p className="text-2xl md:text-3xl font-semibold text-gray-600 dark:text-gray-400 mt-4">
          {t("title")}
        </p>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t("description")}
        </p>

        <Button
          onClick={handleNotFound}
          className="mt-6 rounded-2xl bg-green-600 px-6 py-3 text-white shadow-md transition hover:bg-green-700"
        >
          {isAuthenticated ? t("buttons.back") : t("buttons.goHome")}
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;
