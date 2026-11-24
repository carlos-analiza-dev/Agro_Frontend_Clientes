import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EstadoMaquinaria } from "@/interfaces/enums/maquinaria/maquinaria.enums";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";

interface Props {
  filters: { fincaId: string; estado: string; offset: number; limit: number };
  setFilters: Dispatch<
    SetStateAction<{
      fincaId: string;
      estado: string;
      offset: number;
      limit: number;
    }>
  >;
  fincas: Finca[] | undefined;
  handleLimitChange: (newLimit: number) => void;
  handleClearFilters: () => void;
}

const CardFilters = ({
  filters,
  setFilters,
  fincas,
  handleLimitChange,
  handleClearFilters,
}: Props) => {
  const t = useTranslations("cardFiltersEquipos");

  const getEstadoLabel = (estado: EstadoMaquinaria) => {
    switch (estado) {
      case EstadoMaquinaria.ACTIVO:
        return t("statuses.active");
      case EstadoMaquinaria.MANTENIMIENTO:
        return t("statuses.maintenance");
      case EstadoMaquinaria.INCACTIVO:
        return t("statuses.inactive");
      default:
        return estado;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row gap-4">
        <Select
          value={filters.fincaId || "todas"}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              fincaId: value === "todas" ? "" : value,
              offset: 0,
            })
          }
        >
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder={t("placeholders.selectFarm")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">{t("options.allFarms")}</SelectItem>
            {fincas?.map((finca) => (
              <SelectItem key={finca.id} value={finca.id}>
                {finca.nombre_finca}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.estado || "todos"}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              estado: value === "todos" ? "" : value,
              offset: 0,
            })
          }
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder={t("placeholders.allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">{t("options.allStatuses")}</SelectItem>
            {Object.values(EstadoMaquinaria).map((estado) => (
              <SelectItem key={estado} value={estado}>
                {getEstadoLabel(estado)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.limit.toString()}
          onValueChange={(value) => handleLimitChange(Number(value))}
        >
          <SelectTrigger className="w-full md:w-[120px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15, 20, 50].map((limit) => (
              <SelectItem key={limit} value={limit.toString()}>
                {t("pagination.perPage", { count: limit })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={handleClearFilters}>
          {t("buttons.clearFilters")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardFilters;
