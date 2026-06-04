"use client";

import Link from "next/link";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export const EcommerceButton = () => {
  const ecommerceUrl = `${process.env.NEXT_PUBLIC_APP_URL}/marketplace`;

  if (!ecommerceUrl) {
    toast.error("La tienda aún no está configurada");
    return null;
  }

  return (
    <Link
      href={ecommerceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex"
    >
      <Button
        size="sm"
        className="
          gap-2
          bg-gradient-to-r from-blue-600 to-indigo-600
          text-white
          font-medium
          shadow-md
          hover:shadow-xl
          hover:scale-105
          active:scale-95
          transition-all
          duration-300
          rounded-full
          px-4
          border-0
        "
      >
        <Store className="h-4 w-4 animate-pulse" />
        <span className="hidden sm:inline">Ir a AgroMarket</span>
        <span className="sm:hidden">Tienda</span>
      </Button>
    </Link>
  );
};
