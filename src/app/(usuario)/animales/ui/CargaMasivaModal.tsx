"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileSpreadsheet, X, Download } from "lucide-react";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";

interface CargaMasivaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CargaMasivaModal = ({ isOpen, onClose }: CargaMasivaModalProps) => {
  const queryClient = useQueryClient();
  const { cliente, token } = useAuthStore();

  const [fincaId, setFincaId] = useState("");
  const [especieId, setEspecieId] = useState("");
  const [razaId, setRazaId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: fincasData } = useFincasPropietarios(cliente?.id ?? "");

  const { data: especiesData } = useGetEspecies();

  const { data: razasData } = useGetRazasByEspecie(especieId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (
        !validTypes.includes(selectedFile.type) &&
        !selectedFile.name.match(/\.(xlsx|xls)$/)
      ) {
        toast.error(
          "Por favor, selecciona un archivo Excel válido (.xlsx o .xls)",
        );
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleDownloadTemplate = () => {
    try {
      const headers = [
        "nombre_animal",
        "sexo",
        "fecha_nacimiento",
        "edad_promedio",
        "nombre_padre",
        "nombre_madre",
      ];

      const exampleData = [
        {
          nombre_animal: "Ejemplo1",
          sexo: "Macho",
          fecha_nacimiento: "2024-01-15",
          edad_promedio: 2,
          nombre_padre: "PadreEjemplo",
          nombre_madre: "MadreEjemplo",
        },
        {
          nombre_animal: "Ejemplo2",
          sexo: "Hembra",
          fecha_nacimiento: "2024-02-20",
          edad_promedio: 1,
          nombre_padre: "PadreEjemplo2",
          nombre_madre: "MadreEjemplo2",
        },
      ];

      const wb = XLSX.utils.book_new();

      const ws = XLSX.utils.json_to_sheet(exampleData);

      const colWidths = [
        { wch: 20 },
        { wch: 12 },
        { wch: 18 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Animales");

      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "plantilla_carga_masiva.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Plantilla descargada exitosamente");
    } catch (error) {
      toast.error("Error al generar la plantilla");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Por favor, selecciona un archivo");
      return;
    }

    if (!fincaId || !especieId || !razaId) {
      toast.error("Por favor, selecciona finca, especie y raza");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/animal-finca/carga-masiva/${fincaId}/${especieId}/${razaId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cargar los animales");
      }

      const result = await response.json();

      toast.success(`✅ ${result.message}: ${result.total} animales cargados`);

      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });

      onClose();
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al cargar los animales",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFincaId("");
    setEspecieId("");
    setRazaId("");
    setFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Carga Masiva de Animales</DialogTitle>
          <DialogDescription asChild>
            <div className="text-sm text-muted-foreground">
              <p>
                Sube un archivo Excel con los datos de los animales para
                registrarlos masivamente.
              </p>

              <div className="mt-2 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Descargar plantilla
                </Button>
                <span className="text-xs text-muted-foreground">
                  (Formato requerido)
                </span>
              </div>

              <div className="mt-2 text-xs text-muted-foreground bg-muted p-3 rounded-md">
                <p className="font-medium mb-1">Estructura de la plantilla:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>nombre_animal (requerido)</li>
                  <li>sexo (requerido: Macho/Hembra)</li>
                  <li>fecha_nacimiento (requerido: YYYY-MM-DD)</li>
                  <li>edad_promedio (opcional)</li>
                  <li>nombre_padre (opcional)</li>
                  <li>nombre_madre (opcional)</li>
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="finca">Finca *</Label>
            <Select value={fincaId} onValueChange={setFincaId} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar finca" />
              </SelectTrigger>
              <SelectContent>
                {fincasData?.data?.fincas.map((finca) => (
                  <SelectItem key={finca.id} value={finca.id}>
                    {finca.nombre_finca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="especie">Especie de animales *</Label>
            <Select
              value={especieId}
              onValueChange={(value) => {
                setEspecieId(value);
                setRazaId("");
              }}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar especie" />
              </SelectTrigger>
              <SelectContent>
                {especiesData?.data?.map((especie) => (
                  <SelectItem key={especie.id} value={especie.id}>
                    {especie.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="raza">Raza de animales *</Label>
            <Select value={razaId} onValueChange={setRazaId} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar raza" />
              </SelectTrigger>
              <SelectContent>
                {razasData?.data?.map((raza) => (
                  <SelectItem key={raza.id} value={raza.id}>
                    {raza.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Archivo Excel *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="flex-1"
              />
              {file && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {file && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                <FileSpreadsheet className="h-4 w-4" />
                <span>{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !file || !fincaId || !especieId || !razaId}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Cargando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Cargar Animales
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CargaMasivaModal;
