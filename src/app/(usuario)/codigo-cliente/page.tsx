"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import {
  ingresarCodigoCliente,
  IngresarCodigoInterface,
} from "@/api/codigos-cliente/accions/ingresar-codigo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { isAxiosError } from "axios";

const CodigoClientePage = () => {
  const { cliente, refreshSession } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: IngresarCodigoInterface) => ingresarCodigoCliente(data),

    onSuccess: async () => {
      toast.success(
        "El código ha sido validado y el paquete se ha activado correctamente.",
      );

      try {
        const refreshResult = await refreshSession();
        if (refreshResult) {
        } else {
          toast.warning(
            "Paquete activado, pero necesitas recargar la página para ver los cambios.",
          );
        }
      } catch (error) {}

      queryClient.invalidateQueries({
        queryKey: ["permisos-cliente-paquete"],
      });
      queryClient.invalidateQueries({
        queryKey: ["permisos-clienteId", clienteId],
      });

      setTimeout(() => {
        router.push("/panel");
      }, 2000);
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : error.response?.data?.message ||
              "El código ingresado no es válido";

        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        const errorMessage =
          "Hubo un error al validar el código. Por favor, intenta nuevamente.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const codigoTrimmed = codigo.trim().toUpperCase();

    if (!codigoTrimmed) {
      setError("Por favor, ingresa un código de cliente válido");
      return;
    }

    if (!/^[A-Z0-9]{2,20}$/.test(codigoTrimmed)) {
      setError(
        "El código debe contener solo letras y números (2-20 caracteres)",
      );
      return;
    }
    mutation.mutate({ codigo: codigoTrimmed });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/\s/g, "");
    setCodigo(value);
    setError("");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanedText = pastedText.toUpperCase().replace(/\s/g, "");
    setCodigo(cleanedText);
    setError("");
  };

  const isSuccess = mutation.isSuccess && !mutation.isError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-7 w-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Activar Paquete
          </CardTitle>
          <CardDescription className="text-slate-500">
            Ingresa el código de cliente que te proporcionamos para activar tu
            paquete
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Ej: ABC123XYZ"
                value={codigo}
                onChange={handleChange}
                onPaste={handlePaste}
                className="text-center text-lg font-mono tracking-widest h-12 uppercase"
                disabled={mutation.isPending}
                autoFocus
                maxLength={20}
                spellCheck={false}
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground text-center">
                Ingresa el código de 2 a 20 caracteres alfanuméricos
              </p>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isSuccess && (
              <Alert className="border-green-500 bg-green-50 text-green-800 animate-in slide-in-from-top-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="font-medium">
                  ¡Código válido! Paquete activado exitosamente.
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={mutation.isPending || isSuccess || !codigo.trim()}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validando código...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Activado
                </>
              ) : (
                "Activar paquete"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 border-t pt-6">
          <p className="text-xs text-center text-muted-foreground">
            ¿No tienes un código?{" "}
            <a
              target="_blank"
              href="/contacto"
              className="text-primary hover:underline font-medium"
            >
              Contáctanos
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CodigoClientePage;
