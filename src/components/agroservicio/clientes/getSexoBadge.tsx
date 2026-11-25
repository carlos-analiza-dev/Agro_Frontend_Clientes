import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export const useSexoBadge = () => {
  const t = useTranslations("agroClientesPage.table.gender");

  const getSexoBadge = (sexo: string) => {
    const sexoMap: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      M: { label: t("male"), variant: "default" },
      F: { label: t("female"), variant: "secondary" },
      Otro: { label: t("other"), variant: "outline" },
    };

    const info = sexoMap[sexo] || { label: sexo, variant: "outline" };

    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  return { getSexoBadge };
};
