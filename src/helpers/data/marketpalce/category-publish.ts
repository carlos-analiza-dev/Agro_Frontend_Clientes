import { Package, PawPrint, Sprout, Wrench } from "lucide-react";

export const categorias_publish = [
  {
    id: "animales" as const,
    titulo: "Animales",
    descripcion:
      "Venta de animales vivos: bovinos, porcinos, equinos, caprinos, aves y más.",
    icono: PawPrint,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    hoverColor: "hover:border-green-300",
    ejemplos: ["Bovinos", "Porcinos", "Equinos", "Aves", "Caprinos"],
  },
  {
    id: "productos_ganaderos" as const,
    titulo: "Productos Ganaderos",
    descripcion:
      "Equipos, herramientas, suplementos, medicamentos y accesorios para ganadería.",
    icono: Package,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverColor: "hover:border-blue-300",
    ejemplos: [
      "Bebederos",
      "Comederos",
      "Cercas",
      "Suplementos",
      "Medicamentos",
    ],
  },
  {
    id: "productos_agricolas" as const,
    titulo: "Productos Agrícolas",
    descripcion:
      "Semillas, fertilizantes, maquinaria, herramientas y productos para cultivos.",
    icono: Sprout,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    hoverColor: "hover:border-amber-300",
    ejemplos: [
      "Semillas",
      "Fertilizantes",
      "Tractores",
      "Riego",
      "Herramientas",
    ],
  },
  {
    id: "alquileres" as const,
    titulo: "Alquileres",
    descripcion:
      "Alquiler de maquinaria agrícola, equipos ganaderos, herramientas, terrenos y otros recursos del sector.",
    icono: Wrench,
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    hoverColor: "hover:border-purple-300",
    ejemplos: [
      "Tractores",
      "Retroexcavadoras",
      "Terrenos",
      "Corrales",
      "Equipos de Riego",
    ],
  },
];
