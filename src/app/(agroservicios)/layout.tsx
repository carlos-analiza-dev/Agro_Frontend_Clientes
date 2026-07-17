import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clientes.interactivecore.app"),
  title: {
    default: "El Sembrador | Agroservicios y Veterinaria",
    template: "%s | El Sembrador",
  },
  description:
    "Sistema de agroservicios y veterinaria para control de ganado, razas, pesos, reproducción y gestión agrícola.",
  keywords: [
    "agroservicios",
    "veterinaria",
    "ganado",
    "control de ganado",
    "software ganadero",
    "agricultura",
    "ganaderia",
  ],
  authors: [{ name: "Carlos Alcerro" }],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "El Sembrador | Sistema Agropecuario",
    description:
      "Plataforma para gestión de ganado, celos, reproducción, razas y control agrícola.",
    url: "https://www.clientes.interactivecore.app",
    siteName: "El Sembrador",
    locale: "es_ES",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "El Sembrador",
    description: "Sistema inteligente para gestión de ganado y agroservicios.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
