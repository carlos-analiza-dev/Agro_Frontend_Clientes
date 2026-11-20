"use client";

import { calidadHuevosData } from "@/helpers/data/calidadHuevos";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Beef,
  Drumstick,
  Feather,
  Leaf,
  Droplet,
  Milk,
  Egg,
} from "lucide-react";

import { TipoProduccionGanadera } from "@/api/produccion/interface/crear-produccion-finca.interface";
import { unidadLeche } from "@/helpers/data/dataProduccionFinca";
import { Ganadera } from "@/api/produccion/interface/obter-producciones-userId.interface";
import { tiposProduccion } from "@/helpers/data/dataProduccionFinca copy";

interface Props {
  produccionGanadera: Ganadera | null;
  onDataChange?: (data: Ganadera) => void;
}

const ProduccionGanaderaForm = ({
  produccionGanadera,
  onDataChange,
}: Props) => {
  const t = useTranslations("produccionGanaderaForm");

  const initialFormData: Ganadera = {
    id: "",
    tiposProduccion: [],
    produccionLecheCantidad: undefined,
    produccionLecheUnidad: undefined,
    vacasOrdeño: 0,
    vacasSecas: 0,
    terneros: 0,
    fechaPromedioSecado: "",
    cabezasEngordeBovino: null,
    kilosSacrificioBovino: null,
    cerdosEngorde: null,
    pesoPromedioCerdo: null,
    mortalidadLoteAves: null,
    huevosPorDia: null,
    gallinasPonedoras: null,
    calidadHuevo: undefined,
    animalesEngordeCaprino: null,
    pesoPromedioCaprino: null,
    edadSacrificioCaprino: null,
    animalesDisponibles: null,
    pesoPromedioCabeza: null,
    otroProductoNombre: undefined,
    otroProductoUnidadMedida: undefined,
    otroProductoProduccionMensual: null,
  };

  const [formData, setFormData] = useState<Ganadera>(initialFormData);

  useEffect(() => {
    if (produccionGanadera) {
      setFormData(produccionGanadera);
    } else {
      setFormData(initialFormData);
    }
  }, [produccionGanadera]);

  const handleTipoProduccionChange = (
    tipo: TipoProduccionGanadera,
    checked: boolean,
  ) => {
    const currentTipos = formData.tiposProduccion || [];
    let nuevosTipos: TipoProduccionGanadera[];

    if (checked) {
      nuevosTipos = [...currentTipos, tipo];
    } else {
      nuevosTipos = currentTipos.filter((t) => t !== tipo);
    }

    const updatedData = {
      ...formData,
      tiposProduccion: nuevosTipos,
    };

    setFormData(updatedData);
    onDataChange?.(updatedData);
  };

  const handleFieldChange = (field: keyof Ganadera, value: any) => {
    const updatedData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedData);
    onDataChange?.(updatedData);
  };

  const handleNumberChange = (field: keyof Ganadera, value: string) => {
    const numericValue = value === "" ? null : Number(value);

    const updatedData = {
      ...formData,
      [field]: numericValue,
    };

    setFormData(updatedData);
    onDataChange?.(updatedData);
  };

  const itemsHuevos = calidadHuevosData.map((calidad) => ({
    label: calidad.label,
    value: calidad.value.toString(),
  }));

  const sectionIcons = {
    [TipoProduccionGanadera.LECHE]: Milk,
    [TipoProduccionGanadera.CARNE_BOVINA]: Beef,
    [TipoProduccionGanadera.CARNE_PORCINA]: Drumstick,
    [TipoProduccionGanadera.CARNE_AVE]: Feather,
    [TipoProduccionGanadera.HUEVO]: Egg,
    [TipoProduccionGanadera.CARNE_CAPRINO]: Droplet,
    [TipoProduccionGanadera.GANADO_PIE]: Beef,
    [TipoProduccionGanadera.OTRO]: Beef,
  };

  const getTipoProduccionLabel = (tipo: TipoProduccionGanadera | string) => {
    switch (tipo) {
      case TipoProduccionGanadera.LECHE:
        return t("productionTypes.milk");
      case TipoProduccionGanadera.CARNE_BOVINA:
        return t("productionTypes.beef");
      case TipoProduccionGanadera.CARNE_PORCINA:
        return t("productionTypes.pork");
      case TipoProduccionGanadera.CARNE_AVE:
        return t("productionTypes.poultry");
      case TipoProduccionGanadera.HUEVO:
        return t("productionTypes.eggs");
      case TipoProduccionGanadera.CARNE_CAPRINO:
        return t("productionTypes.goat");
      case TipoProduccionGanadera.GANADO_PIE:
        return t("productionTypes.liveCattle");
      case TipoProduccionGanadera.OTRO:
        return t("productionTypes.other");
      default:
        return tipo;
    }
  };

  const getSectionTitle = (tipo: TipoProduccionGanadera) => {
    switch (tipo) {
      case TipoProduccionGanadera.LECHE:
        return t("sections.milk");
      case TipoProduccionGanadera.CARNE_BOVINA:
        return t("sections.beef");
      case TipoProduccionGanadera.CARNE_PORCINA:
        return t("sections.pork");
      case TipoProduccionGanadera.CARNE_AVE:
        return t("sections.poultry");
      case TipoProduccionGanadera.HUEVO:
        return t("sections.eggs");
      case TipoProduccionGanadera.CARNE_CAPRINO:
        return t("sections.goat");
      case TipoProduccionGanadera.GANADO_PIE:
        return t("sections.liveCattle");
      case TipoProduccionGanadera.OTRO:
        return t("sections.other");
      default:
        return tipo;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Beef className="h-5 w-5" />
            {t("title")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              {t("fields.productionTypes")}:
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tiposProduccion.map((tipo) => {
                const IconComponent =
                  sectionIcons[tipo as TipoProduccionGanadera];

                return (
                  <div key={tipo} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tipo-${tipo}`}
                      checked={(formData.tiposProduccion || []).includes(tipo)}
                      onCheckedChange={(checked) =>
                        handleTipoProduccionChange(tipo, checked as boolean)
                      }
                    />

                    <Label
                      htmlFor={`tipo-${tipo}`}
                      className="flex items-center gap-2 text-sm font-normal cursor-pointer"
                    >
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      {getTipoProduccionLabel(tipo)}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            {/* Sección LECHE */}
            {(formData.tiposProduccion || []).includes(
              TipoProduccionGanadera.LECHE,
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Milk className="h-4 w-4" />
                    {getSectionTitle(TipoProduccionGanadera.LECHE)}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="produccionLecheCantidad">
                        {t("fields.productionQuantity")}
                      </Label>
                      <Input
                        id="produccionLecheCantidad"
                        type="number"
                        placeholder={t("placeholders.quantity")}
                        value={formData.produccionLecheCantidad || ""}
                        onChange={(e) =>
                          handleNumberChange(
                            "produccionLecheCantidad",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="produccionLecheUnidad">
                        {t("fields.measurementUnit")}
                      </Label>
                      <Select
                        value={formData.produccionLecheUnidad || ""}
                        onValueChange={(value) =>
                          handleFieldChange("produccionLecheUnidad", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("placeholders.selectUnit")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {unidadLeche.map((unidad) => (
                            <SelectItem key={unidad} value={unidad}>
                              {unidad}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vacasOrdeño">
                        {t("fields.milkingCows")}
                      </Label>
                      <Input
                        id="vacasOrdeño"
                        type="number"
                        placeholder={t("placeholders.quantity")}
                        value={formData.vacasOrdeño || ""}
                        onChange={(e) =>
                          handleNumberChange("vacasOrdeño", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vacasSecas">{t("fields.dryCows")}</Label>
                      <Input
                        id="vacasSecas"
                        type="number"
                        placeholder={t("placeholders.quantity")}
                        value={formData.vacasSecas || ""}
                        onChange={(e) =>
                          handleNumberChange("vacasSecas", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="terneros">{t("fields.calves")}</Label>
                      <Input
                        id="terneros"
                        type="number"
                        placeholder={t("placeholders.quantity")}
                        value={formData.terneros || ""}
                        onChange={(e) =>
                          handleNumberChange("terneros", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("fields.averageDryingDate")}</Label>
                    <Input
                      type="date"
                      value={formData.fechaPromedioSecado || ""}
                      onChange={(e) =>
                        handleFieldChange("fechaPromedioSecado", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sección CARNE BOVINA */}
            {(formData.tiposProduccion || []).includes(
              TipoProduccionGanadera.CARNE_BOVINA,
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Beef className="h-4 w-4" />
                    {getSectionTitle(TipoProduccionGanadera.CARNE_BOVINA)}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cabezasEngordeBovino">
                        {t("fields.fatteningHeads")}
                      </Label>
                      <Input
                        id="cabezasEngordeBovino"
                        type="number"
                        placeholder={t("placeholders.quantity")}
                        value={formData.cabezasEngordeBovino || ""}
                        onChange={(e) =>
                          handleNumberChange(
                            "cabezasEngordeBovino",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kilosSacrificioBovino">
                        {t("fields.slaughterWeight")}
                      </Label>
                      <Input
                        id="kilosSacrificioBovino"
                        type="number"
                        placeholder={t("placeholders.kilos")}
                        value={formData.kilosSacrificioBovino || ""}
                        onChange={(e) =>
                          handleNumberChange(
                            "kilosSacrificioBovino",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sección CARNE PORCINA */}
            {(formData.tiposProduccion || []).includes(
              TipoProduccionGanadera.CARNE_PORCINA,
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Drumstick className="h-4 w-4" />
                    {getSectionTitle(TipoProduccionGanadera.CARNE_PORCINA)}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cerdosEngorde">
                        {t("fields.fatteningHeads")}
                      </Label>
                      <Input
                        id="cerdosEngorde"
                        type="number"
                        placeholder={t("placeholders.quantity")}
                        value={formData.cerdosEngorde || ""}
                        onChange={(e) =>
                          handleNumberChange("cerdosEngorde", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pesoPromedioCerdo">
                        {t("fields.averageWeightKg")}
                      </Label>
                      <Input
                        id="pesoPromedioCerdo"
                        type="number"
                        placeholder={t("placeholders.weight")}
                        value={formData.pesoPromedioCerdo || ""}
                        onChange={(e) =>
                          handleNumberChange(
                            "pesoPromedioCerdo",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edadSacrificioCaprino">
                        {t("fields.slaughterAge")}
                      </Label>
                      <Input
                        id="edadSacrificioCaprino"
                        type="number"
                        placeholder={t("placeholders.age")}
                        value={formData.edadSacrificioCaprino || ""}
                        onChange={(e) =>
                          handleNumberChange(
                            "edadSacrificioCaprino",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sección CARNE AVE */}
            {(formData.tiposProduccion || []).includes(
              TipoProduccionGanadera.CARNE_AVE,
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Feather className="h-4 w-4" />
                    {getSectionTitle(TipoProduccionGanadera.CARNE_AVE)}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mortalidadLoteAves">
                      {t("fields.flockMortality")}
                    </Label>
                    <Input
                      id="mortalidadLoteAves"
                      type="number"
                      placeholder={t("placeholders.percentage")}
                      value={formData.mortalidadLoteAves || ""}
                      onChange={(e) =>
                        handleNumberChange("mortalidadLoteAves", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sección HUEVO */}
            {(formData.tiposProduccion || []).includes(
              TipoProduccionGanadera.HUEVO,
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Egg className="h-4 w-4" />
                    {getSectionTitle(TipoProduccionGanadera.HUEVO)}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="huevosPorDia">
                        {t("fields.eggsPerDay")}
                      </Label>
                      <Input
                        id="huevosPorDia"
                        type="number"
                        placeholder={t("placeholders.quantity")}
                        value={formData.huevosPorDia || ""}
                        onChange={(e) =>
                          handleNumberChange("huevosPorDia", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gallinasPonedoras">
                        {t("fields.layingHens")}
                      </Label>
                      <Input
                        id="gallinasPonedoras"
                        type="number"
                        placeholder={t("placeholders.quantity")}
                        value={formData.gallinasPonedoras || ""}
                        onChange={(e) =>
                          handleNumberChange(
                            "gallinasPonedoras",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="calidadHuevo">
                        {t("fields.eggQuality")}
                      </Label>
                      <Select
                        value={formData.calidadHuevo?.toString() || ""}
                        onValueChange={(value) =>
                          handleFieldChange("calidadHuevo", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("placeholders.selectQuality")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {itemsHuevos.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sección CARNE CAPRINO */}
            {(formData.tiposProduccion || []).includes(
              TipoProduccionGanadera.CARNE_CAPRINO,
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Leaf className="h-4 w-4" />
                    {getSectionTitle(TipoProduccionGanadera.CARNE_CAPRINO)}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="animalesEngordeCaprino">
                        {t("fields.fatteningAnimals")}
                      </Label>
                      <Input
                        id="animalesEngordeCaprino"
                        type="number"
                        placeholder={t("placeholders.quantity")}
                        value={formData.animalesEngordeCaprino || ""}
                        onChange={(e) =>
                          handleNumberChange(
                            "animalesEngordeCaprino",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pesoPromedioCaprino">
                        {t("fields.averageWeightKg")}
                      </Label>
                      <Input
                        id="pesoPromedioCaprino"
                        type="number"
                        placeholder={t("placeholders.weight")}
                        value={formData.pesoPromedioCaprino || ""}
                        onChange={(e) =>
                          handleNumberChange(
                            "pesoPromedioCaprino",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edadSacrificioCaprino">
                        {t("fields.slaughterAge")}
                      </Label>
                      <Input
                        id="edadSacrificioCaprino"
                        type="number"
                        placeholder={t("placeholders.age")}
                        value={formData.edadSacrificioCaprino || ""}
                        onChange={(e) =>
                          handleNumberChange(
                            "edadSacrificioCaprino",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sección GANADO EN PIE */}
            {(formData.tiposProduccion || []).includes(
              TipoProduccionGanadera.GANADO_PIE,
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Beef className="h-4 w-4" />
                    {getSectionTitle(TipoProduccionGanadera.GANADO_PIE)}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="animalesDisponibles">
                        {t("fields.availableAnimals")}
                      </Label>
                      <Input
                        id="animalesDisponibles"
                        type="number"
                        placeholder={t("placeholders.quantity")}
                        value={formData.animalesDisponibles || ""}
                        onChange={(e) =>
                          handleNumberChange(
                            "animalesDisponibles",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pesoPromedioCabeza">
                        {t("fields.averageWeightPerHead")}
                      </Label>
                      <Input
                        id="pesoPromedioCabeza"
                        type="number"
                        placeholder={t("placeholders.weight")}
                        value={formData.pesoPromedioCabeza || ""}
                        onChange={(e) =>
                          handleNumberChange(
                            "pesoPromedioCabeza",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sección OTRO */}
            {(formData.tiposProduccion || []).includes(
              TipoProduccionGanadera.OTRO,
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Beef className="h-4 w-4" />
                    {getSectionTitle(TipoProduccionGanadera.OTRO)}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="otroProductoNombre">
                        {t("fields.productName")}
                      </Label>
                      <Input
                        id="otroProductoNombre"
                        placeholder={t("placeholders.productName")}
                        value={formData.otroProductoNombre || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "otroProductoNombre",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otroProductoUnidadMedida">
                        {t("fields.measurementUnit")}
                      </Label>
                      <Input
                        id="otroProductoUnidadMedida"
                        placeholder={t("placeholders.measurementUnit")}
                        value={formData.otroProductoUnidadMedida || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "otroProductoUnidadMedida",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otroProductoProduccionMensual">
                      {t("fields.monthlyProduction")}
                    </Label>
                    <Input
                      id="otroProductoProduccionMensual"
                      type="number"
                      placeholder={t("placeholders.monthlyProduction")}
                      value={formData.otroProductoProduccionMensual || ""}
                      onChange={(e) =>
                        handleNumberChange(
                          "otroProductoProduccionMensual",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProduccionGanaderaForm;
