"use client";

import { useState, useRef, useEffect } from "react";
import { Opinione } from "@/api/opiniones/interfaces/response-opiniones.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cliente } from "@/interfaces/auth/cliente";
import {
  MoreVertical,
  Pencil,
  Star,
  X,
  CheckCircle,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EditarOpinion } from "@/api/opiniones/accions/editar-opinio";

interface Props {
  opinion: Opinione;
  cliente: Cliente | undefined;
  productoId?: string;
}

const CardOpinionesProducto = ({ opinion, cliente, productoId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedRating, setEditedRating] = useState(opinion.rating);
  const [editedTitulo, setEditedTitulo] = useState(opinion.titulo);
  const [editedComentario, setEditedComentario] = useState(opinion.comentario);
  const [error, setError] = useState<string | null>(null);

  const tituloRef = useRef<HTMLInputElement>(null);
  const comentarioRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const esPropietario = cliente?.id === opinion.cliente.id;
  const fueEditada =
    opinion.updatedAt &&
    new Date(opinion.updatedAt) > new Date(opinion.createdAt);

  useEffect(() => {
    if (isEditing && tituloRef.current) {
      tituloRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedRating(opinion.rating);
    setEditedTitulo(opinion.titulo);
    setEditedComentario(opinion.comentario);
    setError(null);
  };

  const handleSave = async () => {
    setError(null);

    if (editedRating === 0) {
      setError("Por favor selecciona una calificación");
      return;
    }

    if (!editedTitulo.trim()) {
      setError("Por favor ingresa un título");
      tituloRef.current?.focus();
      return;
    }

    if (!editedComentario.trim()) {
      setError("Por favor ingresa un comentario");
      comentarioRef.current?.focus();
      return;
    }

    const hasChanges =
      editedRating !== opinion.rating ||
      editedTitulo !== opinion.titulo ||
      editedComentario !== opinion.comentario;

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      const data = {
        rating: editedRating,
        titulo: editedTitulo.trim(),
        comentario: editedComentario.trim(),
      };

      await EditarOpinion(opinion.id, data);

      toast.success("Tu opinión ha sido actualizada exitosamente.");

      queryClient.invalidateQueries({ queryKey: ["opiniones"] });
      queryClient.invalidateQueries({ queryKey: ["rating"] });
      queryClient.invalidateQueries({ queryKey: ["producto-opinado"] });
      queryClient.invalidateQueries({ queryKey: ["producto", productoId] });

      setIsEditing(false);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al actualizar la opinión";
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStars = (rating: number, editable = false) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => editable && setEditedRating(i + 1)}
        className={cn(
          "transition-transform",
          editable && "hover:scale-110 active:scale-95"
        )}
        disabled={!editable || isSaving}
      >
        <Star
          className={cn(
            "w-4 h-4 sm:w-5 sm:h-5",
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200",
            editable && "cursor-pointer"
          )}
        />
      </button>
    ));
  };

  const getIniciales = (nombre: string) => {
    return nombre
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getFechaFormateada = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <Avatar className="h-12 w-12 flex-shrink-0">
          {opinion.cliente.profileImage ? (
            <AvatarImage
              src={opinion.cliente.profileImage.url}
              alt={opinion.cliente.nombre}
            />
          ) : (
            <AvatarFallback>
              {getIniciales(opinion.cliente.nombre)}
            </AvatarFallback>
          )}
        </Avatar>

        {esPropietario && !isEditing && (
          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            Tú
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{opinion.cliente.nombre}</p>

            {opinion.compra_verificada && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                <CheckCircle className="h-3 w-3" />
                Verificado
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 sm:mt-0">
            {isEditing ? (
              <div className="flex gap-1 items-center">
                {renderStars(editedRating, true)}
                <span className="text-sm ml-2 text-gray-600">
                  {editedRating} estrella{editedRating !== 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              <div className="flex gap-1">{renderStars(opinion.rating)}</div>
            )}

            {esPropietario && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar opinión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isEditing && (
              <div className="flex gap-2 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Cancelar"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  title="Guardar"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-8 w-8 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-1">
            <Input
              ref={tituloRef}
              value={editedTitulo}
              onChange={(e) => setEditedTitulo(e.target.value)}
              placeholder="Título de tu opinión"
              maxLength={200}
              disabled={isSaving}
              className="text-base font-semibold"
            />
            <p className="text-xs text-gray-500 text-right">
              {editedTitulo.length}/200 caracteres
            </p>
          </div>
        ) : (
          <h2 className="font-semibold mt-2 text-base sm:text-lg">
            {opinion.titulo}
          </h2>
        )}

        {isEditing ? (
          <div className="mt-2 space-y-1">
            <Textarea
              ref={comentarioRef}
              value={editedComentario}
              onChange={(e) => setEditedComentario(e.target.value)}
              placeholder="Describe tu experiencia con este producto"
              rows={3}
              maxLength={2000}
              disabled={isSaving}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 text-right">
              {editedComentario.length}/2000 caracteres
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mt-1 break-words whitespace-pre-line">
            {opinion.comentario}
          </p>
        )}

        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">
            {isEditing ? (
              <span className="text-blue-600 italic">Editando...</span>
            ) : (
              <>
                {getFechaFormateada(opinion.createdAt)}
                {fueEditada && (
                  <span className="text-blue-500 italic ml-2">• Editada</span>
                )}
              </>
            )}
          </p>

          {isSaving && (
            <div className="flex items-center gap-1">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
              <span className="text-xs text-gray-500">Guardando...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardOpinionesProducto;
