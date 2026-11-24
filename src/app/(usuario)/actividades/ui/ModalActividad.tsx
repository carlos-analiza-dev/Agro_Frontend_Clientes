"use client";

import Modal from "@/components/generics/Modal";
import React, { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import FormActividades from "./FormActividades";
import { Cliente } from "@/interfaces/auth/cliente";
import { Actividade } from "@/api/actividades/interfaces/response-actividades.interface";

interface Props {
  cliente: Cliente | undefined;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  onSuccess?: () => void;
  actividad?: Actividade | null;
}

const ModalActividad = ({
  cliente,
  openModal,
  setOpenModal,
  onSuccess,
  actividad,
}: Props) => {
  const t = useTranslations("modalActividad");

  return (
    <Modal
      open={openModal}
      onOpenChange={setOpenModal}
      title={actividad ? t("editTitle") : t("addTitle")}
      description={t("description")}
      size="2xl"
      height="auto"
    >
      <FormActividades
        cliente={cliente}
        onSuccess={onSuccess}
        actividad={actividad}
      />
    </Modal>
  );
};

export default ModalActividad;
