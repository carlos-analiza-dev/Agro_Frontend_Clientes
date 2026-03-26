import { Metadata } from "next";
import ProductosClient from "./ui/ProductosClient";

export const metadata: Metadata = {
  title: "Productos Agropecuarios y Veterinarios",
  description:
    "Explora productos agropecuarios disponibles para ganadería y agricultura. Insumos, herramientas y soluciones para el campo.",
  keywords: [
    "productos agropecuarios",
    "productos ganaderos",
    "insumos agrícolas",
    "productos veterinarios",
    "agroservicios",
    "ganadería",
    "agricultura",
  ],
  openGraph: {
    title: "Productos Agropecuarios | El Sembrador",
    description: "Descubre productos disponibles para ganadería y agricultura.",
    url: "https://www.clientes.interactivecore.app/productos-agroservicios",
    type: "website",
  },
};

export default function ProductosPage() {
  return <ProductosClient />;
}
