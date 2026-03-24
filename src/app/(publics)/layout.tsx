import type { Metadata } from "next";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: {
    default: "El Sembrador | Agroservicios y Veterinaria",
    template: "%s | El Sembrador",
  },
  description:
    "Sistema de agroservicios y veterinaria para control de ganado, productos agropecuarios, razas, pesos promedio y gestión agrícola.",
  keywords: [
    "agroservicios",
    "veterinaria",
    "ganado",
    "razas bovinas",
    "peso promedio ganado",
    "agricultura",
    "agro veterinaria",
  ],
  authors: [{ name: "Carlos Alcerro" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
