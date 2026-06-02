import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";
import { ProfileImage } from "@/interfaces/auth/cliente";

export interface ResponseConversacionesInterface {
  id: string;
  lastMessageAt: string;
  buyer: ConversationClient;
  seller: ConversationClient;
  product: ProductoAnimal;
  unreadCount: number;
  hasUnreadMessages: boolean;
}

export interface ConversationClient {
  id: string;
  email: string;
  nombre: string;
  currentProfileImage: ProfileImage | null;
}
