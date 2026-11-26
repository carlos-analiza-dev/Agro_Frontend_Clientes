import {
  Beef,
  Bird,
  Bookmark,
  Dog,
  Layers2,
  Package,
  PawPrint,
  Phone,
  Shield,
  Sprout,
  Store,
  Tractor,
  Users,
} from "lucide-react";

interface MenuItem {
  title: string;
  titleKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  titleKey: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const mainMenuItems: MenuItem[] = [
  {
    title: "Explorar Todo",
    titleKey: "exploreAll",
    href: "/marketplace",
    icon: Store,
  },
  {
    title: "Ganadería",
    titleKey: "livestock",
    href: "/marketplace/animales",
    icon: Users,
    subItems: [
      {
        title: "Todos los animales",
        titleKey: "allAnimals",
        href: "/marketplace/animales",
      },
      {
        title: "Ganado Bovino",
        titleKey: "cattle",
        href: "/marketplace/animales/especies/bovino",
        icon: Beef,
      },
      {
        title: "Caballos",
        titleKey: "horses",
        href: "/marketplace/animales/especies/equino",
        icon: PawPrint,
      },
      {
        title: "Aves",
        titleKey: "birds",
        href: "/marketplace/animales/especies/avicola",
        icon: Bird,
      },
      {
        title: "Porcinos",
        titleKey: "pigs",
        href: "/marketplace/animales/especies/porcino",
        icon: Dog,
      },
    ],
  },
  {
    title: "Productos",
    titleKey: "products",
    href: "/productos",
    icon: Package,
    subItems: [
      {
        title: "Agricolas",
        titleKey: "agricultural",
        href: "/marketplace/agricolas",
        icon: Sprout,
      },
      {
        title: "Ganaderos",
        titleKey: "livestockProducts",
        href: "/marketplace/ganaderos",
        icon: Tractor,
      },
      {
        title: "Categorías",
        titleKey: "categories",
        href: "/marketplace/categorias",
        icon: Layers2,
      },
    ],
  },
  {
    title: "Articulos Guardados",
    titleKey: "savedItems",
    href: "/marketplace/guardados",
    icon: Bookmark,
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

export const helpfulLinks = [
  {
    title: "Términos y Condiciones",
    titleKey: "terms",
    href: "/terminos",
    icon: Shield,
  },
  {
    title: "Contacto",
    titleKey: "contact",
    href: "/contacto",
    icon: Phone,
  },
];
