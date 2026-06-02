import { useEffect, useState, useCallback, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { crearConversacionChat } from "@/api/chat/accions/crear-conversacion";
import { obtenerChatsByConversacion } from "@/api/chat/accions/obtener-chats-by-conversacion";
import { obtenerConversaciones } from "@/api/chat/accions/obtener-all-conversacion";
import { ResponseChatsConversacionInterface } from "@/api/chat/interface/response-chats-conversacion";
import { ResponseConversacionesInterface } from "@/api/chat/interface/response-conversacion.interface";

export const useChatMarketplace = () => {
  const { cliente } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  const [messagesMap, setMessagesMap] = useState<
    Map<string, ResponseChatsConversacionInterface[]>
  >(new Map());
  const [conversations, setConversations] = useState<
    ResponseConversacionesInterface[]
  >([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!cliente?.id) {
      return;
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: { userId: cliente.id },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      setIsConnected(false);
    });

    newSocket.on(
      "new-message",
      (message: ResponseChatsConversacionInterface) => {
        setMessagesMap((prev) => {
          const newMap = new Map(prev);
          const conversationMessages = newMap.get(message.conversationId) || [];
          if (!conversationMessages.some((m) => m.id === message.id)) {
            newMap.set(message.conversationId, [
              ...conversationMessages,
              message,
            ]);
          }
          return newMap;
        });
      },
    );

    newSocket.on(
      "message-sent",
      (message: ResponseChatsConversacionInterface) => {
        setMessagesMap((prev) => {
          const newMap = new Map(prev);
          const conversationMessages = newMap.get(message.conversationId) || [];
          if (!conversationMessages.some((m) => m.id === message.id)) {
            newMap.set(message.conversationId, [
              ...conversationMessages,
              message,
            ]);
          }
          return newMap;
        });
      },
    );

    newSocket.on("messages-read", (data) => {
      setMessagesMap((prev) => {
        const newMap = new Map(prev);
        const conversationMessages = newMap.get(data.conversationId) || [];
        const updatedMessages = conversationMessages.map((msg) =>
          msg.receiverId === data.userId ? { ...msg, isRead: true } : msg,
        );
        newMap.set(data.conversationId, updatedMessages);
        return newMap;
      });
    });

    setSocket(newSocket);

    return () => {
      if (newSocket.connected) {
        newSocket.disconnect();
      }
      socketRef.current = null;
    };
  }, [cliente?.id]);

  const fetchConversations = useCallback(async () => {
    if (!cliente?.id) return [];

    try {
      const conversaciones = await obtenerConversaciones();

      setConversations(conversaciones);
      return conversaciones;
    } catch (error) {
      return [];
    }
  }, [cliente?.id]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return [];

    try {
      const chats = await obtenerChatsByConversacion(conversationId);

      setMessagesMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(conversationId, chats);
        return newMap;
      });

      setCurrentConversationId(conversationId);
      return chats;
    } catch (error) {
      return [];
    }
  }, []);

  const getCurrentMessages = useCallback(() => {
    if (!currentConversationId) return [];
    return messagesMap.get(currentConversationId) || [];
  }, [currentConversationId, messagesMap]);

  const getOrCreateConversation = useCallback(
    async (sellerId: string, productId: string) => {
      if (!cliente?.id) return null;

      try {
        const response = await crearConversacionChat({ sellerId, productId });

        return response;
      } catch (error) {
        return null;
      }
    },
    [cliente?.id],
  );

  const sendMessage = useCallback(
    (
      conversationId: string,
      message: string,
      receiverId: string,
      productId: string,
    ) => {
      if (!socketRef.current || !cliente?.id) {
        return false;
      }

      if (!socketRef.current.connected) {
        return false;
      }

      if (!message.trim()) {
        return false;
      }

      socketRef.current.emit("send-message", {
        conversationId,
        message: message.trim(),
        senderId: cliente.id,
        receiverId,
        productId,
      });

      return true;
    },
    [cliente?.id],
  );

  const joinConversation = useCallback((conversationId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit("join-conversation", { conversationId });
  }, []);

  const markAsRead = useCallback((conversationId: string, userId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit("mark-as-read", { conversationId, userId });
  }, []);

  const clearMessages = useCallback(() => {
    setMessagesMap(new Map());
    setCurrentConversationId(null);
  }, []);

  return {
    socket,
    messages: getCurrentMessages(),
    messagesMap,
    conversations,
    isConnected,
    currentConversationId,
    fetchConversations,
    fetchMessages,
    sendMessage,
    joinConversation,
    getOrCreateConversation,
    markAsRead,
    clearMessages,
    setCurrentConversationId,
  };
};
