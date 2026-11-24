import { Servicio } from "@/api/reproduccion/interfaces/response-servicio-repoductivo.interface";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";

interface Props {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  selectedServicio: Servicio | null;
  isPending: boolean;
  handleExitosoChange: (checked: boolean) => void;
}

const CardTabResultado = ({
  setOpenModal,
  selectedServicio,
  isPending,
  handleExitosoChange,
}: Props) => {
  const t = useTranslations("cardTabResultado");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="exitoso" className="text-base font-medium">
                {t("successfulService")}
              </Label>
              <p className="text-sm text-gray-500">
                {t("successfulDescription")}
              </p>
            </div>
            <Switch
              id="exitoso"
              checked={selectedServicio?.exitoso || false}
              onCheckedChange={handleExitosoChange}
              disabled={isPending}
            />
          </div>

          {selectedServicio?.exitoso && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                {t("messages.successful")}
              </p>
            </div>
          )}

          {selectedServicio &&
            !selectedServicio.exitoso &&
            selectedServicio.estado !== "PROGRAMADO" && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {t("messages.unsuccessful")}
                </p>
              </div>
            )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              {t("buttons.close")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardTabResultado;
