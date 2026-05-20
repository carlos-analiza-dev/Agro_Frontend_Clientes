import {
  BriefcaseMedical,
  Building2,
  CalendarDays,
  ChartColumnIncreasing,
  ClipboardList,
  Clock,
  DollarSign,
  FileText,
  FlaskConical,
  GitBranch,
  Heart,
  ImageIcon,
  Layers3,
  Package,
  PackageCheck,
  PackageOpen,
  PackageXIcon,
  PawPrint,
  Pill,
  Settings,
  ShoppingBag,
  Sprout,
  Stethoscope,
  TrendingUp,
  UserCog,
  Wallet,
  Wheat,
  Wrench,
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
      { name: "Cultivos", href: "/cultivos", icon: Sprout },
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
    category: "Gestión de Nómina",
    items: [
      {
        name: "Configuración Salarial",
        href: "/configuracion-trabajador",
        icon: UserCog,
      },
      { name: "Jornadas Laborales", href: "/jornadas", icon: BriefcaseMedical },
      { name: "Planillas", href: "/planillas", icon: FileText },

      { name: "Pagos", href: "/pagos", icon: DollarSign },

      { name: "Reportes", href: "/reportes-planillas", icon: TrendingUp },
    ],
  },
  {
    category: "Actividades",
    items: [
      {
        name: "Actividades Diarias",
        href: "/actividades",
        icon: ClipboardList,
      },
      {
        name: "Evidencias",
        href: "/actividades-evidencias",
        icon: ImageIcon,
      },
    ],
  },
  {
    category: "Operaciones",
    items: [
      { name: "Equipos y Maquinaria", href: "/equipos", icon: Settings },
      { name: "Mantenimientos", href: "/mantenimientos", icon: Wrench },
      { name: "Uso de Equipos", href: "/uso-equipos", icon: Clock },
    ],
  },
  {
    category: "Consulta Inteligente",
    items: [
      {
        name: "Diagnóstico Ganadero",
        href: "/diagnostico",
        icon: Stethoscope,
      },
      {
        name: "Diagnóstico Agricola",
        href: "/agricultura-inteligente",
        icon: Sprout,
      },
      {
        name: "Siembra Inteligente",
        href: "/siembra-inteligente",
        icon: Wheat,
      },
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
    category: "Paquetes",
    items: [
      { name: "Mi Plan", href: "/mi-plan", icon: PawPrint },
      { name: "Comprar", href: "/comprar-plan", icon: Layers3 },
    ],
  },

  {
    category: "Cuenta",
    items: [{ name: "Perfil", href: "/perfil", icon: UserCog }],
  },
];
