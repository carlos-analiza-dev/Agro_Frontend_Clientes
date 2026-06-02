"use client";

import { useState } from "react";
import { MessageCircle, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { ResponseConversacionesInterface } from "@/api/chat/interface/response-conversacion.interface";
import { ChatModal } from "./ChatModal";
import { formatLastMessageTime } from "@/helpers/funciones/dates/formatLastMessageTime";

interface MessageInboxProps {
  conversations: ResponseConversacionesInterface[];
  isLoading?: boolean;
}

export const MessageInbox = ({
  conversations,
  isLoading,
}: MessageInboxProps) => {
  const { cliente } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    product: any;
    seller: any;
  } | null>(null);

  const totalUnreadCount = conversations.reduce(
    (total, conv) => total + (conv.unreadCount || 0),
    0,
  );

  const handleOpenConversation = (
    conversation: ResponseConversacionesInterface,
  ) => {
    const otherUser = getOtherParticipant(conversation);

    if (otherUser) {
      setSelectedConversation({
        id: conversation.id,
        product: conversation.product,
        seller: otherUser,
      });
    }
    setIsOpen(false);
  };

  const handleCloseModal = () => {
    setSelectedConversation(null);
  };

  const getOtherParticipant = (
    conversation: ResponseConversacionesInterface,
  ) => {
    if (!cliente) return null;
    const isBuyer = conversation.buyer.id === cliente.id;
    return isBuyer ? conversation.seller : conversation.buyer;
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <MessageCircle className="h-5 w-5" />
            {totalUnreadCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs animate-pulse"
                variant="destructive"
              >
                {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-96 p-0" align="end">
          <DropdownMenuLabel className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-gray-500" />
              <span className="text-lg font-semibold">Mensajes</span>
            </div>
            {conversations.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {conversations.length} conversación
                {conversations.length !== 1 && "es"}
              </Badge>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <ScrollArea className="h-[450px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <div className="animate-pulse space-y-3 w-full">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-gray-100 rounded-full p-3 mb-3">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  No tienes mensajes
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                  Cuando contactes a un vendedor, tus conversaciones aparecerán
                  aquí
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {conversations.map((conversation) => {
                  const otherUser = getOtherParticipant(conversation);
                  if (!otherUser) return null;

                  const hasUnread =
                    conversation.hasUnreadMessages ||
                    conversation.unreadCount > 0;

                  return (
                    <div
                      key={conversation.id}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                        hasUnread ? "bg-blue-50/30" : ""
                      }`}
                      onClick={() => handleOpenConversation(conversation)}
                    >
                      <div className="flex items-start gap-3 p-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={
                                otherUser.currentProfileImage
                                  ? otherUser.currentProfileImage.url
                                  : "/images/ProfileImage.png"
                              }
                            />
                            <AvatarFallback
                              className={`text-sm font-medium ${
                                hasUnread
                                  ? "bg-green-500 text-white"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {otherUser.nombre?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {hasUnread && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-sm truncate ${
                                hasUnread
                                  ? "font-bold text-gray-900"
                                  : "font-medium text-gray-700"
                              }`}
                            >
                              {otherUser.nombre}
                            </p>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {formatLastMessageTime(
                                conversation.lastMessageAt,
                              )}
                            </span>
                          </div>

                          <p
                            className={`text-sm truncate mt-1 ${
                              hasUnread
                                ? "text-gray-900 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {conversation.product?.nombre || "Producto"}
                          </p>

                          <div className="flex items-center justify-between mt-1.5">
                            <p className="text-xs text-gray-500">
                              {conversation.product?.precio
                                ? conversation.product.precio
                                : "Precio no disponible"}
                            </p>
                            {hasUnread && (
                              <Badge
                                variant="destructive"
                                className="text-[10px] h-5 px-1.5"
                              >
                                {conversation.unreadCount} nuevo
                                {conversation.unreadCount !== 1 && "s"}
                              </Badge>
                            )}
                            {!hasUnread && (
                              <CheckCheck className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChatModal
        isOpen={!!selectedConversation}
        conversationId={selectedConversation?.id}
        onClose={handleCloseModal}
        product={selectedConversation?.product || {}}
        seller={selectedConversation?.seller || { id: "", nombre: "" }}
        buyerId={cliente?.id || ""}
      />
    </>
  );
};
