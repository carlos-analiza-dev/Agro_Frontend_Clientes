"use client";

import Link from "next/link";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EcommerceButton = () => {
  const ecommerceUrl = `${process.env.NEXT_PUBLIC_APP_URL}/marketplace`;

  if (!ecommerceUrl) {
    console.warn("La tienda aun no está configurada");
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
        variant="outline"
        size="sm"
        className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
      >
        <Store className="h-4 w-4" />
        <span className="hidden sm:inline">Ir al Ecommerce</span>
        <span className="sm:hidden">Tienda</span>
      </Button>
    </Link>
  );
};
