import {
  Clock,
  Heart,
  Package,
  Phone,
  Shield,
  ShoppingCart,
  Star,
  Store,
  Tag,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const mainMenuItems: MenuItem[] = [
  {
    title: "Explorar Todo",
    href: "/marketplace",
    icon: Store,
  },
  {
    title: "Productos",
    href: "/productos",
    icon: Package,
    subItems: [
      { title: "Todos los productos", href: "/productos" },
      { title: "Categorías", href: "/categorias" },
      { title: "Ofertas", href: "/ofertas", icon: Tag },
      { title: "Nuevos productos", href: "/nuevos", icon: Star },
    ],
  },
  {
    title: "Mis Favoritos",
    href: "/favoritos",
    icon: Heart,
  },
  {
    title: "Mi Carrito",
    href: "/carrito",
    icon: ShoppingCart,
  },
];

export const categories = [
  { name: "Semillas", href: "/categorias/semillas", icon: Package },
  {
    name: "Fertilizantes",
    href: "/categorias/fertilizantes",
    icon: TrendingUp,
  },

  { name: "Animales", href: "/categorias/animales", icon: Users },
  { name: "Maquinaria", href: "/categorias/maquinaria", icon: Truck },
  { name: "Protección", href: "/categorias/proteccion", icon: Shield },
];

export const userMenuItems: MenuItem[] = [
  {
    title: "Mis Pedidos",
    href: "/mis-pedidos",
    icon: Clock,
  },
];

export const helpfulLinks = [
  { title: "Términos y Condiciones", href: "/terminos", icon: Shield },
  { title: "Contacto", href: "/contacto", icon: Phone },
];
