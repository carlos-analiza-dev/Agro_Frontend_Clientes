import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export const useGetTrabajoBadge = () => {
  const t = useTranslations("JornadasTrabajadoresPage");

  return (trabajo: boolean) => {
    if (trabajo) {
      return (
        <Badge variant="default" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          {t("table.worked")}
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        {t("table.notWorked")}
      </Badge>
    );
  };
};
