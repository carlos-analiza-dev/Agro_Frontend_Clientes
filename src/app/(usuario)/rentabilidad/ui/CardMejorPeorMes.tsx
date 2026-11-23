import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  periodo: string;
  moneda: string;
  rentabilidad: string;
  margen: string;
  icon: LucideIcon;
  variant: "success" | "danger";
}

const variantStyles = {
  success: {
    card: "border-green-200 bg-green-50",
    title: "text-green-700",
    value: "text-green-600",
  },
  danger: {
    card: "border-red-200 bg-red-50",
    title: "text-red-700",
    value: "text-red-600",
  },
};

const CardMejorPeorMes = ({
  title,
  periodo,
  moneda,
  rentabilidad,
  margen,
  icon: Icon,
  variant,
}: Props) => {
  const t = useTranslations("cardMejorPeorMes");
  const styles = variantStyles[variant];

  return (
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle className={`${styles.title} flex items-center gap-2`}>
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600">
          {t("period")}: {periodo}
        </p>

        <p className={`text-lg font-semibold ${styles.value}`}>
          {t("profitability")}: {moneda}
          {rentabilidad}
        </p>

        <p className="text-sm text-gray-500">
          {t("margin")}: {margen}%
        </p>
      </CardContent>
    </Card>
  );
};

export default CardMejorPeorMes;
