import { Cliente } from "@/interfaces/auth/cliente";

export interface ResponseChatsConversacionInterface {
  id: string;
  message: string;
  senderId: string;
  conversationId: string;
  receiverId: string;
  isRead: boolean;
  created_at: string;
  sender: Cliente;
  receiver: Cliente;
}
