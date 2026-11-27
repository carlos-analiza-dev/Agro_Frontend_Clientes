"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("codigoClientePage");
  const { cliente, refreshSession } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: IngresarCodigoInterface) => ingresarCodigoCliente(data),

    onSuccess: async () => {
      toast.success(t("messages.activationSuccess"));

      try {
        const refreshResult = await refreshSession();
        if (refreshResult) {
        } else {
          toast.warning(t("messages.refreshWarning"));
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
            : error.response?.data?.message || t("messages.invalidCode");

        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        const errorMessage = t("messages.validationError");
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
      setError(t("validation.required"));
      return;
    }

    if (!/^[A-Z0-9_-]{2,20}$/.test(codigoTrimmed)) {
      setError(t("validation.format"));
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
            {t("title")}
          </CardTitle>
          <CardDescription className="text-slate-500">
            {t("description")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder={t("placeholders.code")}
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
                {t("hints.codeFormat")}
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
                  {t("messages.successAlert")}
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
                  {t("buttons.validating")}
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t("buttons.activated")}
                </>
              ) : (
                t("buttons.activate")
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 border-t pt-6">
          <p className="text-xs text-center text-muted-foreground">
            {t("contact.question")}{" "}
            <a
              target="_blank"
              href="/contacto"
              className="text-primary hover:underline font-medium"
            >
              {t("contact.link")}
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CodigoClientePage;
