import { descargarNotaPDF } from "@/api/agroservicio/notas-credito/accions/descargar-nota-credito";
import { Nota } from "@/api/agroservicio/notas-credito/interface/response-nota-credito.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { Download, Eye, FileMinus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  notas: Nota[];
  propietarioId: string;
  moneda: string;
}

const TableNotaCredito = ({ notas, propietarioId, moneda }: Props) => {
  const [descargandoId, setDescargandoId] = useState<string | null>(null);
  const [previewNota, setPreviewNota] = useState<string | null>(null);

  const handlePreviewNota = async (nota: Nota) => {
    try {
      const url = `/nota-credito-pdf/agroservicio/${propietarioId}/${nota.id}/preview`;

      const response = await veterinariaAPI.get(url, {
        responseType: "blob",
      });

      if (!response.data) {
        throw new Error("No se pudo obtener la vista previa de la nota.");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const objectUrl = URL.createObjectURL(blob);

      setPreviewNota(objectUrl);
    } catch (error) {
      toast.error("Error al obtener la vista previa de la nota");
    }
  };

  const handleDescargarNota = async (nota: Nota) => {
    setDescargandoId(nota.id);
    try {
      const result = await descargarNotaPDF(propietarioId, nota.id, nota);

      if (result.success) {
        toast.success("Nota descargada exitosamente");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error inesperado al descargar la nota");
    } finally {
      setDescargandoId(null);
    }
  };
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold"># Nota</TableHead>
            <TableHead className="font-semibold">Factura</TableHead>
            <TableHead className="font-semibold">Agroservicio</TableHead>
            <TableHead className="font-semibold">Monto</TableHead>
            <TableHead className="font-semibold">Motivo</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notas.map((nota: any) => (
            <TableRow key={nota.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                #{nota.id.slice(0, 8)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {nota.factura?.numero_factura || "N/A"}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[150px] truncate">
                {nota.agroservicio?.nombre_agroservicio || "N/A"}
              </TableCell>
              <TableCell className="font-medium text-green-600">
                {formatCurrency(nota.monto, moneda)}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {nota.motivo}
              </TableCell>
              <TableCell>{formatDateOnly(nota.createdAt)}</TableCell>
              <TableCell>
                <div id="acciones-nota" className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviewNota(nota)}
                    title="Ver Factura"
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDescargarNota(nota)}
                    title="Descargar Nota"
                    disabled={descargandoId === nota.id}
                    className="flex items-center gap-1"
                  >
                    {descargandoId === nota.id ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-gray-900" />
                        <span>Descargando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>PDF</span>
                      </>
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {previewNota && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                Vista Previa de la Factura
              </h2>
              <Button variant="ghost" onClick={() => setPreviewNota(null)}>
                Cerrar
              </Button>
            </div>
            <iframe
              src={previewNota}
              className="w-full h-full"
              title="Vista previa de la factura"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableNotaCredito;
