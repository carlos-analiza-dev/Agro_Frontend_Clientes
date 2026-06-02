"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  PawPrint,
  Car,
  Home,
  Shirt,
  Apple,
  Package,
  Smartphone,
  GraduationCap,
  Heart,
  Briefcase,
  Gamepad,
  BookOpen,
} from "lucide-react";
import { Categoria } from "@/api/categorias/interfaces/response-categorias";

interface CategoryCardProps {
  category: Categoria;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const router = useRouter();

  const getIcon = () => {
    const nombre = category.nombre.toLowerCase();

    if (nombre.includes("animal") || nombre.includes("venta animal")) {
      return <PawPrint className="w-8 h-8" />;
    }
    if (nombre.includes("auto") || nombre.includes("vehículo")) {
      return <Car className="w-8 h-8" />;
    }
    if (nombre.includes("casa") || nombre.includes("propiedad")) {
      return <Home className="w-8 h-8" />;
    }
    if (nombre.includes("ropa") || nombre.includes("moda")) {
      return <Shirt className="w-8 h-8" />;
    }
    if (nombre.includes("comida") || nombre.includes("alimento")) {
      return <Apple className="w-8 h-8" />;
    }
    if (nombre.includes("electrónico") || nombre.includes("tecnología")) {
      return <Smartphone className="w-8 h-8" />;
    }
    if (nombre.includes("educación") || nombre.includes("curso")) {
      return <GraduationCap className="w-8 h-8" />;
    }
    if (nombre.includes("salud") || nombre.includes("belleza")) {
      return <Heart className="w-8 h-8" />;
    }
    if (nombre.includes("trabajo") || nombre.includes("empleo")) {
      return <Briefcase className="w-8 h-8" />;
    }
    if (nombre.includes("juego") || nombre.includes("entretenimiento")) {
      return <Gamepad className="w-8 h-8" />;
    }
    if (nombre.includes("libro") || nombre.includes("lectura")) {
      return <BookOpen className="w-8 h-8" />;
    }

    return <Package className="w-8 h-8" />;
  };

  const getColors = () => {
    const tipo = category.tipo?.toLowerCase() || "";

    if (tipo.includes("ganaderia")) {
      return {
        bg: "bg-gradient-to-br from-green-50 to-green-100",
        iconBg: "bg-green-500",
        text: "text-green-700",
        hover: "hover:shadow-green-200",
      };
    }
    if (tipo.includes("agricultura")) {
      return {
        bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
        iconBg: "bg-emerald-500",
        text: "text-emerald-700",
        hover: "hover:shadow-emerald-200",
      };
    }

    return {
      bg: "bg-gradient-to-br from-gray-50 to-gray-100",
      iconBg: "bg-gray-500",
      text: "text-gray-700",
      hover: "hover:shadow-gray-200",
    };
  };

  const colors = getColors();
  const Icon = getIcon();

  const handleClick = () => {
    router.push(
      `/marketplace/categorias/${category.id}?nombre=${encodeURIComponent(category.nombre)}`,
    );
  };

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 overflow-hidden ${colors.hover}`}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div
            className={`p-4 rounded-2xl ${colors.iconBg} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            {Icon}
          </div>

          <div>
            <h3 className={`font-bold text-lg ${colors.text} mb-1`}>
              {category.nombre}
            </h3>
            {category.descripcion && (
              <p className="text-sm text-gray-500 line-clamp-2">
                {category.descripcion}
              </p>
            )}
            {category.tipo && (
              <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                {category.tipo}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
