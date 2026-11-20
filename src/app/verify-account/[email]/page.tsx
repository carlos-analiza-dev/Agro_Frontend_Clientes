"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ShieldAlert, Lock } from "lucide-react";
import { VerificarCuenta } from "@/api/cliente/accions/verificar-cuenta";

const VerifyAccountPage = () => {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("verifyAccount");

  const encodedEmail = params.email as string;
  const email = decodeURIComponent(encodedEmail);

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "invalid"
  >("loading");

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!email || !isValidEmail(email)) {
      setStatus("invalid");
      setMessage(t("invalid.message"));
      return;
    }

    const verifyAccount = async () => {
      try {
        const response = await VerificarCuenta({ email });

        setStatus("success");
        setMessage(response.message || t("success.defaultMessage"));

        setTimeout(() => {
          router.push("/login");
        }, 5000);
      } catch (err: any) {
        setStatus("error");

        if (err.response?.message) {
          setMessage(err.response.message);
        } else {
          setMessage(err.message || t("error.defaultMessage"));
        }
      }
    };

    verifyAccount();
  }, [email, router, t]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (status === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-lg border-red-200">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="rounded-full bg-red-100 p-4 inline-block">
                <ShieldAlert className="h-12 w-12 text-red-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-800">
                {t("invalid.title")}
              </h1>

              <p className="text-gray-600">{message}</p>

              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {t("invalid.back")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 space-y-6">
          {status === "loading" && (
            <div className="text-center space-y-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto" />

              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {t("loading.title")}
                </h1>

                <p className="text-gray-600">{t("loading.description")}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">{t("loading.email")}</span>{" "}
                  <span className="font-mono">{email}</span>
                </p>

                <p className="text-xs text-blue-600 mt-2">
                  {t("loading.notice")}
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-6">
              <div className="rounded-full bg-green-100 p-4 inline-block animate-pulse">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {t("success.title")}
                </h1>

                <p className="text-gray-600">{message}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">
                      {t("success.verified")}
                    </span>{" "}
                    <span className="font-mono">{email}</span>
                  </p>

                  <p className="text-xs text-green-600 mt-2">
                    {t("success.redirect")}
                  </p>
                </div>

                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {t("success.login")}
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-6">
              <div className="rounded-full bg-red-100 p-4 inline-block">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {t("error.title")}
                </h1>

                <p className="text-gray-600">{message}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">
                    <span className="font-semibold">{t("error.email")}</span>{" "}
                    <span className="font-mono">{email}</span>
                  </p>

                  <p className="text-xs text-red-600 mt-2">
                    <Lock className="inline h-3 w-3 mr-1" />
                    {t("error.notice")}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => window.location.reload()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {t("error.retry")}
                  </Button>

                  <Button
                    onClick={() => router.push("/login")}
                    variant="outline"
                    className="w-full"
                  >
                    {t("back")}
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">{t("error.support")}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyAccountPage;
