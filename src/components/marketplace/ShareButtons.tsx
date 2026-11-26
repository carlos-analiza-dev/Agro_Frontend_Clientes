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
import { useTranslations } from "next-intl";

interface ShareButtonsProps {
  title: string | null;
  description?: string | null;
  url: string;
  imageUrl?: string | null;
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
  const t = useTranslations("ShareButtons");
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: title ?? "",
    text: description ?? t("defaultShareText", { title: title ?? "" }),
    url: url,
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
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
      toast.success(t("linkCopied"));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t("linkCopyError"));
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
        title={t("share")}
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
        title={t("share")}
      >
        <Share2 className="w-4 h-4 mr-2" />
        {t("share")}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className} title={t("share")}>
          <Send className="w-4 h-4 mr-2" />
          {t("share")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={shareOnFacebook} className="cursor-pointer">
          <Facebook className="w-4 h-4 mr-2 text-blue-600" />
          <span>{t("networks.facebook")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnTwitter} className="cursor-pointer">
          <Twitter className="w-4 h-4 mr-2 text-sky-500" />
          <span>{t("networks.twitter")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnWhatsApp} className="cursor-pointer">
          <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
          <span>{t("networks.whatsapp")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          <Link2 className="w-4 h-4 mr-2 text-gray-500" />
          <span>{copied ? t("copied") : t("copyLink")}</span>
          {copied && <Check className="w-4 h-4 ml-auto text-green-500" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
