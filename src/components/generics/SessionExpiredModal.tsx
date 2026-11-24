"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionExpiredModal = ({
  isOpen,
  onClose,
}: SessionExpiredModalProps) => {
  const t = useTranslations("sessionExpiredModal");

  const handleRedirectToLogin = () => {
    onClose();
    window.location.href = "/";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <DialogTitle>{t("title")}</DialogTitle>
          </div>

          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={handleRedirectToLogin} className="w-full">
            {t("login")}
          </Button>

          <Button variant="outline" onClick={onClose} className="w-full">
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
