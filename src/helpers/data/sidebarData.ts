import {
  BriefcaseMedical,
  Building2,
  ChartColumnIncreasing,
  DollarSign,
  FileText,
  FlaskConical,
  GitBranch,
  Heart,
  Layers3,
  Package,
  PackageCheck,
  PackageOpen,
  PackageXIcon,
  PawPrint,
  Pill,
  ShoppingBag,
  Stethoscope,
  TrendingUp,
  UserCog,
  Wallet,
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
      { name: "Trabajadores", href: "/trabajadores", icon: UserCog },
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
    category: "Finanzas",
    items: [
      { name: "Gastos", href: "/gastos", icon: Wallet },
      { name: "Ingresos", href: "/ingresos", icon: DollarSign },
      { name: "Rentabilidad", href: "/rentabilidad", icon: TrendingUp },
    ],
  },
  {
    category: "Salud Animal",
    items: [
      { name: "Historial Médico", href: "/historial-medico", icon: Heart },
      { name: "Diagnóstico", href: "/diagnostico", icon: Stethoscope },
      { name: "Tratamientos", href: "/tratamientos", icon: Pill },
    ],
  },
  {
    category: "Reproducción",
    items: [
      { name: "Celos", href: "/celos", icon: PawPrint },
      {
        name: "Servicios",
        href: "/servicios-reproductivos",
        icon: FlaskConical,
      },
      { name: "Gestaciones", href: "/gestaciones", icon: Layers3 },
      { name: "Partos", href: "/partos-animales", icon: BriefcaseMedical },
      { name: "Genética", href: "/genetica", icon: GitBranch },
    ],
  },
  {
    category: "Cuenta",
    items: [{ name: "Perfil", href: "/perfil", icon: UserCog }],
  },
];
