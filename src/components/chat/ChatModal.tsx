"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X } from "lucide-react";
import { useChatMarketplace } from "@/hooks/chat/useChatMarketplace";
import Modal from "../generics/Modal";
import { formatChatDate } from "@/helpers/funciones/dates/formatChatDate";
import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
  conversationId: existingConversationId,
  product,
  seller,
  buyerId,
}: ChatModalProps) => {
  const [message, setMessage] = useState("");
  const [localConversationId, setLocalConversationId] = useState<string | null>(
    existingConversationId || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    messagesMap,
    fetchMessages,
    sendMessage,
    joinConversation,
    getOrCreateConversation,
    isConnected,
    markAsRead,
    setCurrentConversationId,
  } = useChatMarketplace();

  const conversationMessages = messages.filter(
    (msg) => msg.conversationId === localConversationId,
  );

  useEffect(() => {
    if (isOpen && product && seller) {
      initializeChat();
    }

    return () => {
      if (!isOpen) {
        setCurrentConversationId(null);
      }
    };
  }, [isOpen, product, seller, existingConversationId]);

  useEffect(() => {
    if (localConversationId && isOpen) {
      joinConversation(localConversationId);
      loadMessages();

      markAsRead(localConversationId, buyerId);
    }
  }, [localConversationId, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const loadMessages = async () => {
    if (!localConversationId) return;

    setIsLoading(true);
    try {
      await fetchMessages(localConversationId);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const initializeChat = async () => {
    if (existingConversationId) {
      setLocalConversationId(existingConversationId);
      return;
    }

    if (localConversationId || isLoading) return;

    setIsLoading(true);
    try {
      const conversation = await getOrCreateConversation(seller.id, product.id);
      if (conversation) {
        setLocalConversationId(conversation.id);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !localConversationId || !isConnected) {
      return;
    }

    sendMessage(localConversationId, message, seller.id, product.id);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setLocalConversationId(null);
    setCurrentConversationId(null);
    setMessage("");
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
      title={`Chat con ${seller.nombre}`}
      description={product.nombre}
      size="xl"
    >
      <div className="flex flex-col h-[520px] bg-gray-50 rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-3 bg-white border-b shadow-sm">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={
                product?.imagenes?.length > 0
                  ? product.imagenes[0].url
                  : "/images/ProductNF.png"
              }
            />
            <AvatarFallback>
              {product?.nombre?.charAt(0)?.toUpperCase() || "P"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <p className="font-semibold text-gray-900 text-sm line-clamp-1">
              {product.nombre}
            </p>
            <p className="text-xs text-green-600 font-bold">
              {product.moneda} {product.precio}
            </p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Cargando mensajes...</p>
              </div>
            </div>
          ) : conversationMessages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-sm">Inicia la conversación</p>
                <p className="text-xs">Envía un mensaje para comenzar</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {conversationMessages.map((msg) => {
                const isMe = msg.senderId === buyerId;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${
                        isMe
                          ? "bg-green-600 text-white rounded-br-sm"
                          : "bg-white text-gray-800 border rounded-bl-sm"
                      }`}
                    >
                      <p className="break-words">{msg.message}</p>

                      <div className="flex items-center justify-end gap-2 mt-1">
                        <span className="text-[10px] opacity-70">
                          {formatChatDate(msg.created_at)}
                        </span>

                        {msg.isRead && isMe && (
                          <span className="text-[10px] opacity-70">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="p-3 bg-white border-t flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Escribe un mensaje..."
            disabled={!isConnected || isLoading}
            className="flex-1 rounded-full"
          />

          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || !isConnected || isLoading}
            className="rounded-full bg-green-600 hover:bg-green-700 w-10 h-10 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {!isConnected && (
          <div className="text-center py-1 bg-amber-50 text-amber-600 text-xs">
            Conectando...
          </div>
        )}
      </div>
    </Modal>
  );
};
