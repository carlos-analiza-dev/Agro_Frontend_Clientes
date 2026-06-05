"use client";

import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";
import { ChatFloating } from "./ChatFloating";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductoAnimal;
  conversationId?: string | null;
  seller: {
    id: string;
    nombre: string;
  };
  buyerId: string;
}

export const ChatModal = ({
  isOpen,
  onClose,
  conversationId,
  product,
  seller,
  buyerId,
}: ChatModalProps) => {
  if (!isOpen) return null;

  return (
    <ChatFloating
      product={product}
      conversationId={conversationId}
      seller={seller}
      buyerId={buyerId}
      onClose={onClose}
    />
  );
};
