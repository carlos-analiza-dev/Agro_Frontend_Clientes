"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { toast } from "react-toastify";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import { isTokenExpired } from "@/helpers/funciones/tokenExpired";
import { SessionExpiredModal } from "@/components/generics/SessionExpiredModal";
import MarhetPlaceNavBar from "@/components/NavBars/MarketPlaceNavBar";
import SidebarMarket from "@/components/SideBars/SidebarMarket";
import { TipoCliente } from "@/interfaces/enums/clientes.enums";
import SheetContentMarket from "@/components/generics/SheetContentMarket";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

export default function MarketPlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { logout, cliente, token } = useAuthStore();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const checkTokenExpiration = () => {
    if (token && isTokenExpired(token)) {
      setShowSessionModal(true);
      return true;
    }
    return false;
  };

  const handleSessionExpired = async () => {
    setShowSessionModal(false);
    setLoading(true);

    try {
      await logout();
      router.push("/");
    } catch (error) {
      toast.error("Error al cerrar sesión expirada");
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = () => {
    if (!cliente) return false;

    const rol = cliente?.rol as TipoCliente;
    const isPropietario = rol === TipoCliente.PROPIETARIO;

    if (!isPropietario) {
      toast.error(
        "Acceso denegado. Solo los propietarios pueden acceder al marketplace.",
        {
          position: "top-center",
          autoClose: 3000,
        },
      );
      router.push("/");
      return false;
    }

    return true;
  };

  useEffect(() => {
    const checkUser = async () => {
      if (!token) {
        router.push("/");
        return;
      }

      if (checkTokenExpiration()) {
        return;
      }

      if (cliente) {
        const authorized = checkUserRole();
        setIsAuthorized(authorized);
      }
    };

    checkUser();
  }, [token, router, cliente]);

  useEffect(() => {
    if (cliente && token && !checkTokenExpiration()) {
      const authorized = checkUserRole();
      setIsAuthorized(authorized);
    }
  }, [cliente, token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        checkTokenExpiration();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogout = async () => {
    window.close();
  };

  if (loading || !isHydrated || !isAuthorized) {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarMarket handleLogout={handleLogout} />
      <SheetContentMarket
        setMobileSidebarOpen={setMobileSidebarOpen}
        handleLogout={handleLogout}
        mobileSidebarOpen={mobileSidebarOpen}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MarhetPlaceNavBar setMobileSidebarOpen={setMobileSidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-gray-50 md:p-6">
          {children}
        </main>
      </div>

      <SessionExpiredModal
        isOpen={showSessionModal}
        onClose={handleSessionExpired}
      />
    </div>
  );
}
