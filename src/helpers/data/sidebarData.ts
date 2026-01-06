import {
  BriefcaseMedical,
  Building2,
  ChartColumnIncreasing,
  FileText,
  FlaskConical,
  Heart,
  Layers3,
  Package,
  PackageCheck,
  PackageOpen,
  PackageXIcon,
  Pill,
  ShoppingBag,
  UserCog,
} from "lucide-react";

export const navItems = [
  {
    category: "Panel",
    items: [{ name: "Panel", href: "/panel", icon: ChartColumnIncreasing }],
  },
  {
    category: "Finca",
    items: [
      { name: "Fincas", href: "/fincas", icon: Building2 },
      { name: "Animales", href: "/animales", icon: Layers3 },
      { name: "Producción", href: "/produccion", icon: FlaskConical },
    ],
  },
  {
    category: "Solicitudes El Sembrador",
    items: [
      {
        name: "Servicios Veterinarios",
        href: "/servicios",
        icon: BriefcaseMedical,
      },
      { name: "Productos", href: "/productos", icon: ShoppingBag },
      { name: "Citas", href: "/citas", icon: FileText },
    ],
  },
  {
    category: "Pedidos",
    items: [
      { name: "Pendientes", href: "/pedidos", icon: Package },
      { name: "Procesados", href: "/pedidos-procesados", icon: PackageCheck },
      { name: "Facturados", href: "/pedidos-facturados", icon: PackageOpen },
      { name: "Cancelados", href: "/pedidos-cancelados", icon: PackageXIcon },
    ],
  },

  {
    category: "Salud Animal",
    items: [
      { name: "Historial Médico", href: "/historial-medico", icon: Heart },

      { name: "Tratamientos", href: "/tratamientos", icon: Pill },
    ],
  },
  {
    category: "Cuenta",
    items: [{ name: "Perfil", href: "/perfil", icon: UserCog }],
  },
];
