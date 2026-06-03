import { ProfileImage } from "@/interfaces/auth/cliente";

export interface ResponseChatsConversacionInterface {
  id: string;
  message: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  isRead: boolean;
  hasImages: boolean;
  created_at: string;
  sender: Receiver;
  receiver: Receiver;
  images: ImagesMessage[];
}

export interface Receiver {
  id: string;
  nombre: string;
  email: string;
  profileImage: ProfileImage | null;
}

export interface ImagesMessage {
  id: string;
  url: string;
  key: string;
  messageId: string;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}
