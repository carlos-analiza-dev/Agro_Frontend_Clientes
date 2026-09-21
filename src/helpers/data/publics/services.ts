// src/helpers/data/publics/services.ts
import {
  Sprout,
  Building2,
  ShoppingBag,
  Tractor,
  Users,
  FileText,
  Package,
  Beef,
  Wheat,
  Store,
  Tag,
  MessageCircle,
} from "lucide-react";

export const services_principal = [
  {
    id: "gestion-agro",
    title: "Gestión Agrícola y Ganadera",
    description:
      "Administra tus cultivos, hatos, reproducción, sanidad animal, actividades diarias y todo el ciclo productivo de tu finca en un solo lugar.",
    icon: Sprout,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    hoverBg: "hover:bg-green-50/30",
    features: [
      { icon: Wheat, label: "Cultivos y cosechas" },
      { icon: Beef, label: "Hatos y reproducción" },
      { icon: Tractor, label: "Actividades diarias" },
    ],
    href: "/login",
    badge: "Producción",
  },
  {
    id: "agroservicios",
    title: "Sistema de Agroservicios",
    description:
      "Gestiona tu agroservicio: clientes, empleados, inventario de productos e insumos, facturación, compras y ventas con control total.",
    icon: Building2,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    hoverBg: "hover:bg-blue-50/30",
    features: [
      { icon: Users, label: "Clientes y empleados" },
      { icon: Package, label: "Inventario y compras" },
      { icon: FileText, label: "Facturación" },
    ],
    href: "/login",
    badge: "Comercial",
  },
  {
    id: "agromarket",
    title: "AgroMarket",
    description:
      "Compra y vende artículos agrícolas, ganaderos y más. Publica tus productos como en un marketplace y conecta con compradores de toda la región.",
    icon: ShoppingBag,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    hoverBg: "hover:bg-amber-50/30",
    features: [
      { icon: Store, label: "Publica tus productos" },
      { icon: Tag, label: "Compra y vende" },
      { icon: MessageCircle, label: "Contacta vendedores" },
    ],
    href: "/agro-market",
    badge: "Marketplace",
  },
] as const;
