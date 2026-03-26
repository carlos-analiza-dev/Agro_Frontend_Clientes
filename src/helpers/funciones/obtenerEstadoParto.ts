export const getEstadoBadge = (estado: string) => {
  const estados: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    PROGRAMADO: { label: "Programado", variant: "secondary" },
    EN_PROGRESO: { label: "En Progreso", variant: "outline" },
    COMPLETADO: { label: "Completado", variant: "default" },
    COMPLICADO: { label: "Complicado", variant: "destructive" },
    ABORTADO: { label: "Abortado", variant: "destructive" },
  };
  return estados[estado] || { label: estado, variant: "secondary" };
};
