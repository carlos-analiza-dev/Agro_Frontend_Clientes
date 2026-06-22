"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { LogOut, Sprout } from "lucide-react";
import { usePathname } from "next/navigation";
import { agroRoutes } from "@/helpers/data/sidebar/siderbarAgro";

interface ShetContentCompAgroProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
}

const ShetContentCompAgro = ({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  handleLogout,
}: ShetContentCompAgroProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/agro-servicios") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
      <SheetContent
        side="left"
        className="w-64 p-0 h-screen flex flex-col overflow-hidden"
      >
        <SheetHeader className="border-b border-gray-200 flex-shrink-0">
          <div className="flex h-16 items-center px-6">
            <Sprout className="h-8 w-8 text-green-600" />
            <SheetTitle className="ml-2 text-xl font-bold text-gray-900">
              Agro Servicios
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <nav className="space-y-1">
              {agroRoutes.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`
                      flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors
                      ${
                        active
                          ? "bg-green-50 text-green-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon
                      className={`
                        mr-2 h-4 w-4 flex-shrink-0
                        ${active ? "text-green-600" : "text-gray-400"}
                      `}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-100">
            <Separator className="my-4" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShetContentCompAgro;
