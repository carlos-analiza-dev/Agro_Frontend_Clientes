import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { LogOut, Menu, Store, User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetConversaciones from "@/hooks/chat/useGetConversaciones";
import { MessageInbox } from "../chat/MessageInbox";
import useGetSearchMarket from "@/hooks/market-animales/useGetSearchMarket";
import SearchMarket from "../marketplace/SearchMarket";

interface Props {
  setMobileSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const MarhetPlaceNavBar = ({ setMobileSidebarOpen }: Props) => {
  const { cliente } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: conversaciones, isLoading: isLoadingConversaciones } =
    useGetConversaciones();
  const [nombre, setNombre] = useState("");
  const { data: buscando, isLoading: cargando } = useGetSearchMarket({
    nombre,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCloseMarketplace = () => {
    window.close();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <Link
          className="hidden lg:block text-green-500 hover:text-green-400"
          href={"/marketplace"}
        >
          <Store />
          <div className=" w-full rounded-full p-1 bg-green-600" />
        </Link>

        <div className="block lg:hidden w-full">
          <SearchMarket
            nombre={nombre}
            setNombre={setNombre}
            buscando={buscando}
            cargando={cargando}
          />
        </div>

        <div className="flex gap-2 items-center">
          <MessageInbox
            conversations={conversaciones || []}
            isLoading={isLoadingConversaciones}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/user.png" alt="Usuario" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    {cliente?.nombre || "Usuario"}
                  </p>
                  <p className="text-xs leading-none text-gray-500">
                    {cliente?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleCloseMarketplace}
                className="cursor-pointer text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Market Place
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default MarhetPlaceNavBar;
