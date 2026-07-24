import { Badge } from "@/components/ui/badge";

export const getAccionBadge = (accion: string) => {
  const variants: Record<
    string,
    {
      variant: "default" | "destructive" | "outline" | "secondary";
      label: string;
    }
  > = {
    "PRODUCTO CREADO": { variant: "default", label: "Producto Creado" },
    "PRODUCTO ACTUALIZADO": {
      variant: "secondary",
      label: "Producto Actualizado",
    },
    "PRODUCTO ELIMINADO": {
      variant: "destructive",
      label: "Producto Eliminado",
    },
    "COMPRA CREADO": { variant: "default", label: "Compra Creada" },
    "COMPRA ACTUALIZADO": {
      variant: "secondary",
      label: "Compra Actualizada",
    },
    "COMPRA ELIMINADO": { variant: "destructive", label: "Compra Eliminada" },
    CREAR: { variant: "default", label: "Creación" },
    ACTUALIZAR: { variant: "secondary", label: "Actualización" },
    ELIMINAR: { variant: "destructive", label: "Eliminación" },
  };
  const config = variants[accion] || { variant: "outline", label: accion };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
