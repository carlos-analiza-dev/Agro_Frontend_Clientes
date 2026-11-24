"use client";

import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tiposMamtenimientoData } from "@/helpers/data/mantenimientos/dataTiposMantenimientos";
import { XCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  filters: {
    offset: number;
    limit: number;
    tipoMantenimiento: string;
    fechaInicio: string;
    fechaFin: string;
    fincaId: string;
  };
  handleFilterChange: (key: string, value: string) => void;
  isLoadingFincas: boolean;
  clearFilters: () => void;
  hasActiveFilters: string;
  fincas: Finca[] | undefined;
}

const CardFilters = ({
  filters,
  handleFilterChange,
  isLoadingFincas,
  clearFilters,
  hasActiveFilters,
  fincas,
}: Props) => {
  const t = useTranslations("cardFiltersMantenimientos");

  const getTipoLabel = (value: string, fallback: string) => {
    const key = `maintenanceTypes.${value.toLowerCase()}`;

    return t.has(key) ? t(key) : fallback;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t("title")}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("fields.farm")}
            </label>

            <Select
              value={filters.fincaId || "todas"}
              onValueChange={(value) =>
                handleFilterChange("fincaId", value === "todas" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("placeholders.allFarms")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="todas">{t("options.allFarms")}</SelectItem>

                {isLoadingFincas ? (
                  <SelectItem value="loading" disabled>
                    {t("loading")}
                  </SelectItem>
                ) : (
                  fincas?.map((f: Finca) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nombre_finca}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("fields.type")}
            </label>

            <Select
              value={filters.tipoMantenimiento || "todos"}
              onValueChange={(value) =>
                handleFilterChange(
                  "tipoMantenimiento",
                  value === "todos" ? "" : value,
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("placeholders.allTypes")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="todos">{t("options.allTypes")}</SelectItem>

                {tiposMamtenimientoData.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.value}>
                    {getTipoLabel(tipo.value, tipo.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("fields.from")}
            </label>

            <Input
              type="date"
              value={filters.fechaInicio}
              onChange={(e) =>
                handleFilterChange("fechaInicio", e.target.value)
              }
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("fields.to")}
            </label>

            <Input
              type="date"
              value={filters.fechaFin}
              onChange={(e) => handleFilterChange("fechaFin", e.target.value)}
              className="cursor-pointer"
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="w-full gap-2"
            >
              <XCircleIcon className="h-4 w-4" />
              {t("buttons.clearFilters")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardFilters;
