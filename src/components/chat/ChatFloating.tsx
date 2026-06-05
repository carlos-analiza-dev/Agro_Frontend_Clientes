"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ImagePlus,
  Send,
  X,
  Loader2,
  Minimize2,
  MessageCircle,
} from "lucide-react";
import { useChatMarketplace } from "@/hooks/chat/useChatMarketplace";
import { formatChatDate } from "@/helpers/funciones/dates/formatChatDate";
import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "react-toastify";
import { uploadImagesChat } from "@/api/chat/accions/upload-images-chat";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { ImagesMessage } from "@/api/chat/interface/response-chats-conversacion";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Modal from "../generics/Modal";
import Link from "next/link";

interface ChatFloatingProps {
  product: ProductoAnimal;
  conversationId?: string | null;
  seller: {
    id: string;
    nombre: string;
  };
  buyerId: string;
  onClose: () => void;
}

interface ImagePreview {
  uri: string;
  file: File;
  uploading: boolean;
}

export const ChatFloating = ({
  conversationId: existingConversationId,
  product,
  seller,
  buyerId,
  onClose,
}: ChatFloatingProps) => {
  const { cliente } = useAuthStore();
  const senderId = cliente?.id ?? "";
  const [message, setMessage] = useState("");
  const [localConversationId, setLocalConversationId] = useState<string | null>(
    existingConversationId || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingImage, setIsSendingImage] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openModalImages, setopenModalImages] = useState(false);
  const [imagesArray, setImagesArray] = useState<ImagesMessage[] | []>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    messages,
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
    if (product && seller) {
      initializeChat();
    }

    return () => {
      setCurrentConversationId(null);
      setImagePreviews([]);
    };
  }, [product, seller, existingConversationId]);

  useEffect(() => {
    if (localConversationId) {
      joinConversation(localConversationId);
      loadMessages();
      markAsRead(localConversationId, buyerId);
    }
  }, [localConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages, imagePreviews]);

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
      if (conversation && conversation.id) {
        setLocalConversationId(conversation.id);
      }
    } catch (error) {
      toast.error("Error al iniciar el chat");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !localConversationId || !isConnected) return;

    const success = sendMessage(
      localConversationId,
      message,
      seller.id,
      product.id,
    );

    if (success) {
      setMessage("");
    } else {
      toast.warning("No se pudo enviar el mensaje. Verifica tu conexión.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && imagePreviews.length === 0) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    const validFiles = files.filter((file) => {
      if (file.size > MAX_SIZE) {
        toast.error(`La imagen ${file.name} excede el tamaño máximo de 5MB`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`El archivo ${file.name} no es una imagen válida`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map((file) => ({
      uri: URL.createObjectURL(file),
      file,
      uploading: false,
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImagePreview = (index: number) => {
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index].uri);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSendImages = async () => {
    if (!localConversationId || !isConnected) return;

    setIsSendingImage(true);

    try {
      const files = imagePreviews.map((p) => p.file);
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("conversationId", localConversationId);
      formData.append("receiverId", seller.id);
      formData.append("senderId", senderId);
      formData.append("productId", product.id);
      formData.append("message", message || "");

      const result = await uploadImagesChat(formData);

      if (!result) {
        toast.error("Error al enviar imágenes");
        return;
      }

      setImagePreviews([]);
      setMessage("");
    } catch (error) {
      toast.error("Error al enviar imágenes");
    } finally {
      setIsSendingImage(false);
    }
  };

  const handleOpenModalImages = (
    clickedImage: ImagesMessage,
    allImages: ImagesMessage[],
  ) => {
    setImagesArray(allImages);
    const clickedIndex = allImages.findIndex(
      (img) => img.id === clickedImage.id,
    );
    setCurrentImageIndex(clickedIndex);
    setopenModalImages(true);
  };

  const canSend =
    (message.trim() || imagePreviews.length > 0) &&
    isConnected &&
    !isLoading &&
    !isSendingImage;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full bg-green-600 hover:bg-green-700 shadow-lg p-4 h-auto"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="ml-2">{seller.nombre}</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        <div className="flex items-center justify-between p-3 bg-green-600 text-white">
          <div className="flex items-center gap-2 flex-1">
            <Link href={`/marketplace/animales/${product.id}`}>
              <Avatar className="h-8 w-8 border-2 border-white">
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
            </Link>

            <div className="flex flex-col">
              <Link
                href={`/marketplace/animales/${product.id}`}
                className="font-semibold text-sm line-clamp-1"
              >
                {seller.nombre}
              </Link>
              <Link
                href={`/marketplace/animales/${product.id}`}
                className="text-xs text-green-100 line-clamp-1 hover:underline"
              >
                {product.nombre}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-green-700"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-green-700"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 bg-gray-50">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Cargando mensajes...</p>
              </div>
            </div>
          ) : conversationMessages.length === 0 &&
            imagePreviews.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-sm">Inicia la conversación</p>
                <p className="text-xs">
                  Envía un mensaje o imagen para comenzar
                </p>
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
                          ? "bg-green-200 text-gren-800 rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.images && msg.images.length > 0 && (
                        <div
                          className={`grid gap-1 mb-1 ${
                            msg.images.length === 1
                              ? "grid-cols-1"
                              : msg.images.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-2"
                          }`}
                        >
                          {msg.images.slice(0, 4).map((img, idx) => {
                            const remainingCount = msg.images.length - 4;
                            const isLastWithMore =
                              idx === 3 && remainingCount > 0;

                            return (
                              <div
                                key={img.id}
                                className={`relative overflow-hidden rounded-lg cursor-pointer ${
                                  msg.images.length === 3 && idx === 2
                                    ? "col-span-2"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleOpenModalImages(img, msg.images)
                                }
                              >
                                <Image
                                  src={img.url}
                                  alt=""
                                  width={400}
                                  height={400}
                                  unoptimized
                                  className="w-full h-auto object-cover transition-transform hover:scale-105"
                                  style={{ maxHeight: "240px" }}
                                />
                                {isLastWithMore && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                                    <span className="text-white text-lg font-bold">
                                      +{remainingCount}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {msg.message && (
                        <p className="break-words whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-gray-500">
                          {formatChatDate(msg.created_at)}
                        </span>
                        {msg.isRead && isMe && (
                          <span className="text-[10px] text-blue-500">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {imagePreviews.length > 0 && (
                <div className="flex justify-end">
                  <div className="max-w-[75%] bg-green-200 rounded-2xl rounded-br-none p-2">
                    <div className="grid grid-cols-2 gap-1">
                      {imagePreviews.slice(0, 4).map((preview, idx) => {
                        const remainingCount = imagePreviews.length - 4;
                        const isLastWithMore = idx === 3 && remainingCount > 0;

                        return (
                          <div
                            key={idx}
                            className="relative cursor-pointer"
                            onClick={() => {
                              const previewImages = imagePreviews.map(
                                (p, i) =>
                                  ({
                                    id: `preview-${i}`,
                                    url: p.uri,
                                    key: `preview-${i}`,
                                    messageId: "preview",
                                    mimeType: "image/*",
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                  }) as ImagesMessage,
                              );
                              handleOpenModalImages(
                                previewImages[idx],
                                previewImages,
                              );
                            }}
                          >
                            <Image
                              src={preview.uri}
                              width={400}
                              height={400}
                              unoptimized
                              alt=""
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            {isLastWithMore && (
                              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg font-bold">
                                  +{remainingCount}
                                </span>
                              </div>
                            )}
                            {preview.uploading && (
                              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1 text-right">
                      Enviando...
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="p-3 bg-white border-t">
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative flex-shrink-0 group">
                  <Image
                    src={preview.uri}
                    width={400}
                    height={400}
                    unoptimized
                    alt=""
                    className="h-16 w-16 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => removeImagePreview(idx)}
                    className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload-floating"
              disabled={isSendingImage}
            />
            <label
              htmlFor="image-upload-floating"
              className={`p-2 rounded-full hover:bg-gray-100 cursor-pointer transition ${
                isSendingImage ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ImagePlus className="h-5 w-5 text-gray-600" />
            </label>

            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  imagePreviews.length > 0
                    ? "Añadir leyenda..."
                    : "Escribe un mensaje..."
                }
                disabled={!isConnected || isLoading || isSendingImage}
                className="rounded-full bg-gray-100 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <Button
              onClick={
                imagePreviews.length > 0 ? handleSendImages : handleSendMessage
              }
              disabled={!canSend}
              size="icon"
              className="rounded-full bg-green-600 hover:bg-green-700 h-9 w-9"
            >
              {isSendingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {!isConnected && (
          <div className="text-center py-1 bg-amber-50 text-amber-600 text-xs">
            Reconectando...
          </div>
        )}
      </div>

      <Modal
        title="Vista Previa de Imágenes"
        open={openModalImages}
        onOpenChange={(open) => {
          setopenModalImages(open);
          if (!open) {
            setImagesArray([]);
            setCurrentImageIndex(0);
          }
        }}
        size="lg"
      >
        {imagesArray.length > 0 && (
          <div className="py-4">
            <Carousel
              className="w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw]"
              opts={{
                startIndex: currentImageIndex,
                loop: true,
              }}
            >
              <CarouselContent>
                {imagesArray.map((image, index) => (
                  <CarouselItem key={image.id || index}>
                    <div className="flex justify-center items-center p-2">
                      <Image
                        src={image.url}
                        width={400}
                        height={400}
                        unoptimized
                        alt={`Imagen ${index + 1}`}
                        className="max-h-[70vh] w-auto object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {imagesArray.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 md:left-4" />
                  <CarouselNext className="right-2 md:right-4" />
                </>
              )}
            </Carousel>

            {imagesArray.length > 1 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                {currentImageIndex + 1} / {imagesArray.length}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};
