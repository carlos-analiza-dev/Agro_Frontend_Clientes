"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface PublicacionNoEncontradaSimpleProps {
  mensaje?: string;
}

const PublicacionNoEncontrada = ({
  mensaje,
}: PublicacionNoEncontradaSimpleProps) => {
  const router = useRouter();
  const t = useTranslations("publicacionNoEncontrada");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h2>

      <p className="text-gray-500 text-center max-w-md mb-6">
        {mensaje || t("message")}
      </p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("back")}
        </Button>

        <Link href="/marketplace">
          <Button className="bg-green-600 hover:bg-green-700">
            <ShoppingBag className="w-4 h-4 mr-2" />
            {t("viewMarketplace")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PublicacionNoEncontrada;
