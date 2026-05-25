"use client";
import { EstadoPedido } from "@/api/pedidos/interface/crear-pedido.interface";
import EmptyPedidos from "@/components/pedidos/EmptyPedidos";
import PedidoCard from "@/components/pedidos/PedidoCard";
import { PedidosPagination } from "@/components/pedidos/PedidosPagination";
import PedidosSkeleton from "@/components/pedidos/PedidosSkeleton";
import { Button } from "@/components/ui/button";
import useGetPedidosCliente from "@/hooks/pedidos/useGetPedidosCliente";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { AlertCircle, ShoppingCart } from "lucide-react";
import React, { useState } from "react";

const ITEMS_PER_PAGE = 5;

const PedidosCanceladosPage = () => {
  const { cliente } = useAuthStore();

  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: pedidosData,
    isLoading,
    error,
  } = useGetPedidosCliente(
    ITEMS_PER_PAGE,
    (currentPage - 1) * ITEMS_PER_PAGE,
    EstadoPedido.CANCELADO,
  );

  const totalPages = Math.ceil((pedidosData?.total || 0) / ITEMS_PER_PAGE);

  if (isLoading) {
    return <PedidosSkeleton />;
  }

  if (!pedidosData?.pedidos?.length) {
    return <EmptyPedidos url="/productos" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
        <p className="text-gray-600">
          Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, pedidosData.total)} de{" "}
          {pedidosData.total} pedidos
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {pedidosData.pedidos.map((pedido) => (
          <PedidoCard key={pedido.id} pedido={pedido} cliente={cliente} />
        ))}
      </div>

      {totalPages > 1 && (
        <PedidosPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default PedidosCanceladosPage;
