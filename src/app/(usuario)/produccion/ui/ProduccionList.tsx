"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Home,
  DollarSign,
  Layers,
  Factory,
  Tractor,
  Beef,
  Pencil,
  Plus,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Agricola,
  Alternativa,
  Apicultura,
  ForrajesInsumo,
  Ganadera,
  ObtenerProduccionByUserInterface,
} from "@/api/produccion/interface/obter-producciones-userId.interface";
import ProduccionGanaderaCard from "./ProduccionGanaderaCard";
import ProduccionForrajesCard from "./ProduccionForrajesCard";
import ProduccionAgricolaCard from "./ProduccionAgricolaCard";
import ProduccionApiculturaCard from "./ProduccionApiculturaCard";
import ProduccionAlternativaCard from "./ProduccionAlternativaCard";
import {
  ActualizarProduccionAgricola,
  ActualizarProduccionAlternativa,
  ActualizarProduccionApicultura,
  ActualizarProduccionFinca,
  ActualizarProduccionForrajes,
  ActualizarProduccionGanadera,
} from "@/api/produccion/accions/editar-produccion-finca";
import { toast } from "react-toastify";
import ProduccionGanaderaForm from "./ProduccionGanaderaForm";
import ForrajesInsumosForm from "./ForrajesInsumosForm";
import { useQueryClient } from "@tanstack/react-query";
import { mapGanaderaToProduccionGanaderaInterface } from "@/helpers/funciones/mapers";
import FormProduccionAgricolaEdit from "./FormProduccionAgricolaEdit";
import {
  CrearProduccionAgricola,
  CrearProduccionAlternativa,
  CrearProduccionApicultura,
  CrearProduccionForrajes,
  CrearProduccionGanadera,
} from "@/api/produccion/accions/crear-produccion-finca";
import FormProduccionApicultura from "./FormProduccionApicultura";
import FormProduccionAlternativa from "./FormProduccionAlternativa";
import { ganaderaDefault } from "@/helpers/data/ganaderia";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CreateProduccionFinca } from "@/api/produccion/interface/crear-produccion-finca.interface";
import { useTranslations } from "next-intl";

interface ProduccionGanaderaCardProps {
  produccion: ObtenerProduccionByUserInterface;
}

const ProduccionList: React.FC<ProduccionGanaderaCardProps> = ({
  produccion,
}) => {
  const t = useTranslations("produccionList");
  const queryClient = useQueryClient();
  const { finca, ganadera, agricola, alternativa, apicultura, forrajesInsumo } =
    produccion;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenGanadera, setIsOpenGanadera] = useState(false);
  const [produccionGanadera, setProduccionGanadera] = useState<Ganadera | null>(
    null,
  );
  const [isOpenForrajes, setIsOpenForrajes] = useState(false);
  const [forrajesInsumos, setForrajesInsumos] = useState<ForrajesInsumo | null>(
    null,
  );
  const [isOpenAgricola, setIsOpenAgricola] = useState(false);
  const [produccionAgricola, setProduccionAgricola] = useState<Agricola | null>(
    null,
  );

  const [isOpenAlternativa, setIsOpenAlternativa] = useState(false);
  const [produccionAlternativa, setProduccionAlternativa] =
    useState<Alternativa | null>(null);

  const [isOpenProduccionApicultura, setIsOpenProduccionApicultura] =
    useState(false);
  const [produccionApicultura, setproduccionApicultura] =
    useState<Apicultura | null>(null);
  const [isCreatingApicultura, setIsCreatingApicultura] = useState(false);
  const [isCreatingAlternativa, setIsCreatingAlternativa] = useState(false);
  const [isCreatingGanadera, setIsCreatingGanadera] = useState(false);
  const [isCreatingAgricola, setIsCreatingAgricola] = useState(false);
  const [isCreatingForrajes, setIsCreatingForrajes] = useState(false);

  const [tipos, setTipos] = useState({
    consumo_propio: produccion.consumo_propio,
    produccion_venta: produccion.produccion_venta,
    produccion_mixta: produccion.produccion_mixta,
    transformacion_artesanal: produccion.transformacion_artesanal,
  });

  const hasProductionData =
    ganadera || agricola || alternativa || apicultura || forrajesInsumo;

  const handleCancel = () => {
    setTipos({
      consumo_propio: produccion.consumo_propio,
      produccion_venta: produccion.produccion_venta,
      produccion_mixta: produccion.produccion_mixta,
      transformacion_artesanal: produccion.transformacion_artesanal,
    });
    setIsModalOpen(false);
  };

  const handleCreateGanadera = () => {
    setIsOpenGanadera(true);
    setIsCreatingGanadera(true);
    setProduccionGanadera(ganaderaDefault);
  };

  const handleCreateAgricola = () => {
    setIsOpenAgricola(true);
    setIsCreatingAgricola(true);
    setProduccionAgricola({
      id: "",
      cultivos: [],
    });
  };

  const handleCreateForrajes = () => {
    setIsOpenForrajes(true);
    setIsCreatingForrajes(true);
    setForrajesInsumos({
      id: "",
      insumos: [],
    });
  };

  const handleCreateApicultura = () => {
    setIsOpenProduccionApicultura(true);
    setIsCreatingApicultura(true);
    setproduccionApicultura({
      id: "",
      numero_colmenas: 0,
      frecuencia_cosecha: "",
      cantidad_por_cosecha: 0,
      calidad_miel: "",
    });
  };

  const handleCreateAlternativa = () => {
    setIsOpenAlternativa(true);
    setIsCreatingAlternativa(true);
    setProduccionAlternativa({
      id: "",
      actividades: [],
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updateData: Partial<CreateProduccionFinca> = {
        consumo_propio: tipos.consumo_propio,
        produccion_venta: tipos.produccion_venta,
        produccion_mixta: tipos.produccion_mixta,
        transformacion_artesanal: tipos.transformacion_artesanal,
      };
      await ActualizarProduccionFinca(produccion.id, updateData);

      setIsModalOpen(false);
      toast.success(t("messages.dataUpdated"));
      queryClient.invalidateQueries({ queryKey: ["producciones-user"] });
    } catch (error) {
      toast.error(t("messages.updateTypesError"));

      setTipos({
        consumo_propio: produccion.consumo_propio,
        produccion_venta: produccion.produccion_venta,
        produccion_mixta: produccion.produccion_mixta,
        transformacion_artesanal: produccion.transformacion_artesanal,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGanadera = async () => {
    setIsLoading(true);
    try {
      if (!produccionGanadera) return;

      const datosParaEnviar =
        mapGanaderaToProduccionGanaderaInterface(produccionGanadera);

      if (isCreatingGanadera) {
        await CrearProduccionGanadera({
          ...datosParaEnviar,
          produccionFincaId: produccion.id,
        });
        toast.success(t("messages.livestockCreated"));
      } else {
        await ActualizarProduccionGanadera(ganadera?.id ?? "", datosParaEnviar);
        toast.success(t("messages.livestockUpdated"));
      }

      setIsOpenGanadera(false);
      setIsCreatingGanadera(false);
      queryClient.invalidateQueries({ queryKey: ["producciones-user"] });
    } catch (error) {
      toast.error(
        t(
          isCreatingGanadera
            ? "errors.livestockCreate"
            : "errors.livestockUpdate",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveForrajes = async () => {
    setIsLoading(true);
    try {
      const insumosData =
        forrajesInsumos?.insumos.map(({ id, ...rest }) => rest) || [];

      if (isCreatingForrajes) {
        await CrearProduccionForrajes({
          insumos: insumosData,
          produccionFincaId: produccion.id,
        });
        toast.success(t("messages.fodderCreated"));
      } else {
        await ActualizarProduccionForrajes(forrajesInsumo?.id ?? "", {
          insumos: insumosData,
        });
        toast.success(t("messages.fodderUpdated"));
      }

      setIsOpenForrajes(false);
      setIsCreatingForrajes(false);
      queryClient.invalidateQueries({ queryKey: ["producciones-user"] });
    } catch (error) {
      toast.error(
        t(isCreatingForrajes ? "errors.fodderCreate" : "errors.fodderUpdate"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAgricola = async () => {
    setIsLoading(true);
    try {
      if (!produccionAgricola) return;

      const data = produccionAgricola;
      const { id, ...rest } = data;

      if (isCreatingAgricola) {
        await CrearProduccionAgricola({
          produccionFincaId: produccion.id,
          cultivos: produccionAgricola.cultivos,
        });
        toast.success(t("messages.agriculturalCreated"));
      } else {
        await ActualizarProduccionAgricola(agricola?.id ?? "", rest);
        toast.success(t("messages.agriculturalUpdated"));
      }

      setIsOpenAgricola(false);
      setIsCreatingAgricola(false);
      queryClient.invalidateQueries({ queryKey: ["producciones-user"] });
    } catch (error) {
      toast.error(
        t(
          isCreatingAgricola
            ? "errors.agriculturalCreate"
            : "errors.agriculturalUpdate",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApicultura = async () => {
    setIsLoading(true);
    try {
      if (!produccionApicultura) return;

      const data = produccionApicultura;
      const { id, ...rest } = data;

      if (isCreatingApicultura) {
        await CrearProduccionApicultura({
          ...rest,
          produccionFincaId: produccion.id,
        });

        toast.success(t("messages.beeCreated"));
      } else {
        await ActualizarProduccionApicultura(apicultura?.id ?? "", {
          cantidad_por_cosecha: Number(rest.cantidad_por_cosecha),
          calidad_miel: rest.calidad_miel,
          frecuencia_cosecha: rest.frecuencia_cosecha,
          numero_colmenas: rest.numero_colmenas,
        });
        toast.success(t("messages.beeUpdated"));
      }

      setIsOpenProduccionApicultura(false);
      setIsCreatingApicultura(false);
      queryClient.invalidateQueries({ queryKey: ["producciones-user"] });
    } catch (error) {
      toast.error(
        t(isCreatingApicultura ? "errors.beeCreate" : "errors.beeUpdate"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAlternativa = async () => {
    setIsLoading(true);
    try {
      if (!produccionAlternativa) return;

      const data = produccionAlternativa;
      const { id, ...rest } = data;

      const actividadesValidas = rest.actividades.filter(
        (act) => act.tipo.trim() !== "",
      );

      if (isCreatingAlternativa) {
        await CrearProduccionAlternativa({
          produccionFincaId: produccion.id,
          actividades: actividadesValidas,
        });
        toast.success(t("messages.alternativeCreated"));
      } else {
        await ActualizarProduccionAlternativa(alternativa?.id ?? "", {
          actividades: actividadesValidas,
        });
        toast.success(t("messages.alternativeUpdated"));
      }

      setIsOpenAlternativa(false);
      setIsCreatingAlternativa(false);
      queryClient.invalidateQueries({ queryKey: ["producciones-user"] });
    } catch (error) {
      toast.error(
        t(
          isCreatingAlternativa
            ? "errors.alternativeCreate"
            : "errors.alternativeUpdate",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProduccionGanadera = (ganadera: Ganadera) => {
    setIsOpenGanadera(true);
    setIsCreatingGanadera(false);
    setProduccionGanadera(ganadera);
  };

  const handleProduccionForrajes = (forraje: ForrajesInsumo) => {
    setIsOpenForrajes(true);
    setIsCreatingForrajes(false);
    setForrajesInsumos(forraje);
  };

  const handleProduccionAgricola = (agricola: Agricola) => {
    setIsOpenAgricola(true);
    setIsCreatingAgricola(false);
    setProduccionAgricola(agricola);
  };

  const handleProduccionApicultura = (apicultura: Apicultura) => {
    setIsOpenProduccionApicultura(true);
    setIsCreatingApicultura(false);
    setproduccionApicultura(apicultura);
  };

  const handleProduccionAlternativa = (alternativa: Alternativa) => {
    setIsOpenAlternativa(true);
    setIsCreatingAlternativa(false);
    setProduccionAlternativa(alternativa);
  };

  const productionTypes = [
    { key: "consumo_propio", label: t("types.ownConsumption") },
    { key: "produccion_venta", label: t("types.forSale") },
    { key: "produccion_mixta", label: t("types.mixed") },
    {
      key: "transformacion_artesanal",
      label: t("types.artisanalTransformation"),
    },
  ];

  return (
    <div>
      <Card className="w-full max-w-4xl mx-auto mb-4 shadow-sm border-l-4 border-l-primary hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Tractor className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-bold text-foreground">
                  {finca.nombre_finca}
                </CardTitle>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Beef className="h-3 w-3" />
                  <span>{finca.cantidad_animales} animales</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{finca.area_ganaderia_hectarea} ha</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Separator className="mb-4" />

          <div className="space-y-4">
            <div>
              {ganadera ? (
                <ProduccionGanaderaCard
                  ganadera={ganadera}
                  finca={finca}
                  handleProduccionGanadera={handleProduccionGanadera}
                />
              ) : (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {t("sections.livestock")}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("empty.livestock")}
                        </p>
                      </div>
                      <Button onClick={handleCreateGanadera} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        {t("buttons.add")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Separator className="mt-4" />
            </div>

            <div>
              {forrajesInsumo ? (
                <ProduccionForrajesCard
                  forrajesInsumo={forrajesInsumo}
                  handleProduccionForrajes={handleProduccionForrajes}
                />
              ) : (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {t("sections.fodder")}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("empty.fodder")}
                        </p>
                      </div>
                      <Button onClick={handleCreateForrajes} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        {t("buttons.add")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Separator className="mt-4" />
            </div>

            <div>
              {agricola ? (
                <ProduccionAgricolaCard
                  agricola={agricola}
                  handleProduccionAgricola={handleProduccionAgricola}
                />
              ) : (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {t("sections.agricultural")}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("empty.agricultural")}
                        </p>
                      </div>
                      <Button onClick={handleCreateAgricola} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        {t("buttons.add")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Separator className="mt-4" />
            </div>

            <div>
              {apicultura ? (
                <ProduccionApiculturaCard
                  apicultura={apicultura}
                  handleProduccionApicultura={handleProduccionApicultura}
                />
              ) : (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{t("sections.bee")}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("empty.bee")}
                        </p>
                      </div>
                      <Button onClick={handleCreateApicultura} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        {t("buttons.add")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Separator className="mt-4" />
            </div>

            <div>
              {alternativa ? (
                <ProduccionAlternativaCard
                  alternativa={alternativa}
                  handleProduccionAlternativa={handleProduccionAlternativa}
                />
              ) : (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {t("sections.alternative")}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("empty.alternative")}
                        </p>
                      </div>
                      <Button onClick={handleCreateAlternativa} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        {t("buttons.add")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Separator className="mt-4" />
            </div>

            {!hasProductionData && (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t("empty.all")}</p>
              </div>
            )}
          </div>

          {(tipos.consumo_propio ||
            tipos.produccion_venta ||
            tipos.produccion_mixta ||
            tipos.transformacion_artesanal) && (
            <>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-2">
                {tipos.consumo_propio && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    {t("types.ownConsumption")}
                  </Badge>
                )}
                {tipos.produccion_venta && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {t("types.forSale")}
                  </Badge>
                )}
                {tipos.produccion_mixta && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {t("types.mixed")}
                  </Badge>
                )}
                {tipos.transformacion_artesanal && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Factory className="h-3 w-3" />
                    {t("types.artisanalTransformation")}
                  </Badge>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-1" />{" "}
              {t("buttons.editProductionType")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {" "}
        <AlertDialogContent>
          {" "}
          <AlertDialogHeader>
            {" "}
            <AlertDialogTitle>
              {t("buttons.editProductionType")}
            </AlertDialogTitle>{" "}
          </AlertDialogHeader>{" "}
          <div className="space-y-3 py-2">
            {" "}
            {productionTypes.map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                {" "}
                <Label htmlFor={item.key}>{item.label}</Label>{" "}
                <Switch
                  id={item.key}
                  checked={tipos[item.key as keyof typeof tipos]}
                  onCheckedChange={(value) =>
                    setTipos((prev) => ({ ...prev, [item.key]: value }))
                  }
                />{" "}
              </div>
            ))}{" "}
          </div>{" "}
          <AlertDialogFooter>
            {" "}
            <AlertDialogCancel onClick={handleCancel}>
              {" "}
              Cancelar{" "}
            </AlertDialogCancel>{" "}
            <Button onClick={handleSave} disabled={isLoading}>
              {" "}
              {isLoading ? "Guardando..." : "Guardar cambios"}{" "}
            </Button>{" "}
          </AlertDialogFooter>{" "}
        </AlertDialogContent>{" "}
      </AlertDialog>

      <AlertDialog open={isOpenGanadera} onOpenChange={setIsOpenGanadera}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isCreatingGanadera
                ? t("dialogs.createLivestock")
                : t("dialogs.editLivestock")}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-3 py-2">
            <ProduccionGanaderaForm
              produccionGanadera={produccionGanadera}
              onDataChange={(data) => {
                setProduccionGanadera(data);
              }}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsOpenGanadera(false);
                setIsCreatingGanadera(false);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <Button onClick={handleSaveGanadera} disabled={isLoading}>
              {isLoading
                ? t("buttons.saving")
                : isCreatingGanadera
                  ? t("buttons.create")
                  : t("buttons.saveChanges")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpenForrajes} onOpenChange={setIsOpenForrajes}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isCreatingForrajes
                ? t("dialogs.createFodder")
                : t("dialogs.editFodder")}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-3 py-2">
            <ForrajesInsumosForm
              forrajesInsumos={forrajesInsumos}
              onDataChange={(data) => {
                setForrajesInsumos(data);
              }}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpenForrajes(false)}>
              Cancelar
            </AlertDialogCancel>
            <Button onClick={handleSaveForrajes} disabled={isLoading}>
              {isLoading
                ? t("buttons.saving")
                : isCreatingForrajes
                  ? t("buttons.create")
                  : t("buttons.saveChanges")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpenAgricola} onOpenChange={setIsOpenAgricola}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isCreatingAgricola
                ? t("dialogs.createAgricultural")
                : t("dialogs.editAgricultural")}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-3 py-2">
            <FormProduccionAgricolaEdit
              produccionAgricola={produccionAgricola}
              onDataChange={(data) => {
                setProduccionAgricola(data);
              }}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpenAgricola(false)}>
              Cancelar
            </AlertDialogCancel>
            <Button onClick={handleSaveAgricola} disabled={isLoading}>
              {isLoading
                ? t("buttons.saving")
                : isCreatingAgricola
                  ? t("buttons.create")
                  : t("buttons.saveChanges")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isOpenProduccionApicultura}
        onOpenChange={setIsOpenProduccionApicultura}
      >
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isCreatingApicultura
                ? t("dialogs.createBee")
                : t("dialogs.editBee")}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-3 py-2">
            <FormProduccionApicultura
              produccionApicultura={produccionApicultura}
              onDataChange={(data) => {
                setproduccionApicultura(data);
              }}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsOpenProduccionApicultura(false);
                setIsCreatingApicultura(false);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <Button onClick={handleSaveApicultura} disabled={isLoading}>
              {isLoading
                ? t("buttons.saving")
                : isCreatingApicultura
                  ? t("buttons.create")
                  : t("buttons.saveChanges")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpenAlternativa} onOpenChange={setIsOpenAlternativa}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isCreatingAlternativa
                ? t("dialogs.createAlternative")
                : t("dialogs.editAlternative")}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-3 py-2">
            <FormProduccionAlternativa
              produccionAlternativa={produccionAlternativa}
              onDataChange={(data) => {
                setProduccionAlternativa(data);
              }}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsOpenAlternativa(false);
                setIsCreatingAlternativa(false);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <Button onClick={handleSaveAlternativa} disabled={isLoading}>
              {isLoading
                ? "Guardando..."
                : isCreatingAlternativa
                  ? "Crear"
                  : "Guardar cambios"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProduccionList;
