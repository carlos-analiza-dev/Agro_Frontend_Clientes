import { NotificationType } from "@/interfaces/enums/notificaciones.enum";

export interface CrearContactoNotificacionInterface {
  type: NotificationType;

  title: string;

  message: string;
}
