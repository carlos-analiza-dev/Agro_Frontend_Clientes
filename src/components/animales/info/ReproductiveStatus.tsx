"use client";

import { useTranslations } from "next-intl";

interface Props {
  sexo: "Macho" | "Hembra";
  valor: boolean | undefined;
}

const ReproductiveStatus = ({ sexo, valor }: Props) => {
  const t = useTranslations("reproductiveStatus");

  const label = sexo === "Macho" ? t("castrated") : t("sterilized");
  const texto = valor === true ? t("yes") : t("no");

  return (
    <div className="flex items-center gap-2 rounded-md bg-background p-2 my-1">
      <span className="text-sm font-medium">{label}:</span>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          valor ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800"
        }`}
      >
        {texto}
      </span>
    </div>
  );
};

export default ReproductiveStatus;
