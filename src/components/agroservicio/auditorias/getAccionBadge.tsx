import { Badge } from "@/components/ui/badge";

type Translate = (key: string) => string;

export const getAccionBadge = (accion: string, t: Translate) => {
  const variants: Record<
    string,
    {
      variant: "default" | "destructive" | "outline" | "secondary";
      label: string;
    }
  > = {
    "PRODUCTO CREADO": {
      variant: "default",
      label: t("actions.productCreated"),
    },
    "PRODUCTO ACTUALIZADO": {
      variant: "secondary",
      label: t("actions.productUpdated"),
    },
    "PRODUCTO ELIMINADO": {
      variant: "destructive",
      label: t("actions.productDeleted"),
    },
    "COMPRA CREADO": {
      variant: "default",
      label: t("actions.purchaseCreated"),
    },
    "COMPRA ACTUALIZADO": {
      variant: "secondary",
      label: t("actions.purchaseUpdated"),
    },
    "COMPRA ELIMINADO": {
      variant: "destructive",
      label: t("actions.purchaseDeleted"),
    },
    CREAR: {
      variant: "default",
      label: t("actions.create"),
    },
    ACTUALIZAR: {
      variant: "secondary",
      label: t("actions.update"),
    },
    ELIMINAR: {
      variant: "destructive",
      label: t("actions.delete"),
    },
  };

  const config = variants[accion] || {
    variant: "outline" as const,
    label: accion,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
