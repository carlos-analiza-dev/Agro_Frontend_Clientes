"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Facebook,
  Twitter,
  Send,
  Link2,
  Check,
  Share2,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface ShareButtonsProps {
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  variant?: "icon" | "button" | "dropdown";
  className?: string;
}

export const ShareButtons = ({
  title,
  description,
  url,
  imageUrl,
  variant = "dropdown",
  className = "",
}: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: title,
    text: description || `Mira esta publicación en AgroMarket: ${title}`,
    url: url,
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url,
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareData.text,
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareData.text}\n${url}`,
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Enlace copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Error al copiar el enlace");
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: url,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
        }
      }
    } else {
      copyToClipboard();
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={shareNative}
        className={className}
        title="Compartir"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    );
  }

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        onClick={shareNative}
        className={className}
        title="Compartir"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Compartir
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className} title="Compartir">
          <Send className="w-4 h-4 mr-2" />
          Compartir
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={shareOnFacebook} className="cursor-pointer">
          <Facebook className="w-4 h-4 mr-2 text-blue-600" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnTwitter} className="cursor-pointer">
          <Twitter className="w-4 h-4 mr-2 text-sky-500" />
          <span>Twitter (X)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnWhatsApp} className="cursor-pointer">
          <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          <Link2 className="w-4 h-4 mr-2 text-gray-500" />
          <span>{copied ? "¡Copiado!" : "Copiar enlace"}</span>
          {copied && <Check className="w-4 h-4 ml-auto text-green-500" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
