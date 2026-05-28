import {
  Beef,
  Bird,
  Bookmark,
  Clock,
  Dog,
  Heart,
  Package,
  PawPrint,
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
    title: "Ganadería",
    href: "/marketplace/animales",
    icon: Users,

    subItems: [
      {
        title: "Todos los animales",
        href: "/marketplace/animales",
      },

      {
        title: "Ganado Bovino",
        href: "/marketplace/animales/especies/bovino",
        icon: Beef,
      },

      {
        title: "Caballos",
        href: "/marketplace/animales/especies/equino",
        icon: PawPrint,
      },

      {
        title: "Aves",
        href: "/marketplace/animales/especies/avicola",
        icon: Bird,
      },

      {
        title: "Porcinos",
        href: "/marketplace/animales/especies/porcino",
        icon: Dog,
      },
    ],
  },

  {
    title: "Productos",
    href: "/productos",
    icon: Package,

    subItems: [
      {
        title: "Todos los productos",
        href: "/productos",
      },

      {
        title: "Categorías",
        href: "/categorias",
      },

      {
        title: "Ofertas",
        href: "/ofertas",
        icon: Tag,
      },

      {
        title: "Nuevos productos",
        href: "/nuevos",
        icon: Star,
      },
    ],
  },

  {
    title: "Articulos Guardados",
    href: "/marketplace/guardados",
    icon: Bookmark,
  },
];

export const categories = [
  {
    name: "Semillas",
    href: "/categorias/semillas",
    icon: Package,
  },

  {
    name: "Fertilizantes",
    href: "/categorias/fertilizantes",
    icon: TrendingUp,
  },

  {
    name: "Ganadería",
    href: "/marketplace/animales",
    icon: Users,
  },

  {
    name: "Maquinaria",
    href: "/categorias/maquinaria",
    icon: Truck,
  },

  {
    name: "Protección",
    href: "/categorias/proteccion",
    icon: Shield,
  },
];

export const animalCategories = [
  {
    name: "Bovinos",
    href: "/marketplace/animales/bovinos",
    icon: Beef,
  },

  {
    name: "Caballos",
    href: "/marketplace/animales/caballos",
    icon: PawPrint,
  },

  {
    name: "Aves",
    href: "/marketplace/animales/aves",
    icon: Bird,
  },

  {
    name: "Mascotas",
    href: "/marketplace/animales/mascotas",
    icon: Dog,
  },
];

export const userMenuItems: MenuItem[] = [
  {
    title: "Mis Pedidos",
    href: "/mis-pedidos",
    icon: Clock,
  },
];

export const helpfulLinks = [
  {
    title: "Términos y Condiciones",
    href: "/terminos",
    icon: Shield,
  },

  {
    title: "Contacto",
    href: "/contacto",
    icon: Phone,
  },
];
