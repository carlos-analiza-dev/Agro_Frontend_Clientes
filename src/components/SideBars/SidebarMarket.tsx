"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store,
  LogOut,
  ChevronDown,
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  Plus,
  BookCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/providers/store/useAuthStore";
import {
  categories,
  helpfulLinks,
  mainMenuItems,
  userMenuItems,
} from "@/helpers/data/sidebar/sidebarDataMarket";

interface Props {
  handleLogout: () => Promise<void>;
}

const SidebarMarket = ({ handleLogout }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const { cliente } = useAuthStore();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (menuTitle: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuTitle)
        ? prev.filter((item) => item !== menuTitle)
        : [...prev, menuTitle],
    );
  };

  const isExactActive = (href: string) => pathname === href;

  const isParentActive = (href: string) => pathname.startsWith(href);

  const handleCreatePublicacion = () => {
    router.push("/marketplace/create");
  };

  const handleMyPublicacion = () => {
    router.push("/marketplace/mis-publicaciones");
  };

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex w-80 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          <Link href="/marketplace" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
              AgroMarket
            </span>
          </Link>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          {cliente && (
            <div className="mb-6 p-3 rounded-lg bg-gradient-to-r from-green-50 to-indigo-50 border border-green-100">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                  <AvatarFallback className="bg-green-600 text-white">
                    {cliente.nombre?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {cliente.nombre}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {cliente.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Menú Principal
            </p>
            {mainMenuItems.map((item) => (
              <div key={item.href}>
                {item.subItems ? (
                  <Collapsible
                    open={openMenus.includes(item.title)}
                    onOpenChange={() => toggleMenu(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full justify-between px-3 py-2 text-sm font-medium transition-colors ${
                          isParentActive(item.href)
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <Badge className="ml-auto bg-red-500 hover:bg-red-600">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {openMenus.includes(item.title) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-6 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                            isExactActive(subItem.href)
                              ? "bg-green-50 text-green-700"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          {subItem.icon && <subItem.icon className="h-3 w-3" />}
                          <span>{subItem.title}</span>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start px-3 py-2 text-sm font-medium transition-colors ${
                        isExactActive(item.href)
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <Badge className="ml-auto bg-red-500 hover:bg-red-600">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  </Link>
                )}
              </div>
            ))}
            <Button
              onClick={handleCreatePublicacion}
              className={`w-full font-bold ${
                pathname.startsWith("/marketplace/create")
                  ? "bg-green-200 text-green-800"
                  : ""
              }`}
              variant="outline"
            >
              <Plus />
              Crear Publicación
            </Button>

            <Button
              onClick={handleMyPublicacion}
              className={`w-full font-bold ${
                pathname.startsWith("/marketplace/mis-publicaciones")
                  ? "bg-green-200 text-green-800"
                  : ""
              }`}
              variant="outline"
            >
              <BookCheck />
              Mis Publicaciones
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Categorías Destacadas
            </p>
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {cliente && (
            <>
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Mi Cuenta
                </p>
                {userMenuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-between px-3 py-2 text-sm font-medium transition-colors ${
                        isParentActive(item.href)
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
              <Separator className="my-4" />
            </>
          )}

          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Enlaces Útiles
            </p>
            {helpfulLinks.map((link) => (
              <Link key={link.href} href={link.href} target="_blank">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="h-4 w-4" />
                    <span>{link.title}</span>
                  </div>
                </Button>
              </Link>
            ))}
          </div>

          {cliente && (
            <>
              <Separator className="my-4" />
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </>
          )}
        </ScrollArea>

        <div className="border-t border-gray-200 p-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-500 text-center">
              © 2024 AgroMarket
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarMarket;
