import { Alimento } from "@/api/alimentacion_animal/interface/response-alimentacion.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Wheat, DollarSign, Package, ChefHat, Pencil } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/generics/Modal";
import FormAlimentacionAnimal from "./FormAlimentacionAnimal";
import { Cliente } from "@/interfaces/auth/cliente";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  alimentos: Alimento[];
  totalCosto: number;
  moneda: string | undefined;
  isMobile: boolean;
  cliente: Cliente | undefined;
}

const TableAlimentacionAnimal = ({
  alimentos,
  totalCosto,
  moneda,
  isMobile,
  cliente,
}: Props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editAlimentacion, setEditAlimentacion] = useState<Alimento | null>(
    null,
  );
  const router = useRouter();

  const alimentosPorFecha = alimentos.reduce(
    (acc, alimento) => {
      const fecha = alimento.fecha;
      if (!acc[fecha]) {
        acc[fecha] = [];
      }
      acc[fecha].push(alimento);
      return acc;
    },
    {} as Record<string, Alimento[]>,
  );

  const handleEditAlimentacion = (alimentacion: Alimento) => {
    if (isMobile) {
      router.push(`/animales/alimentacion/${alimentacion.id}`);
    } else {
      setIsEdit(true);
      setOpenModal(true);
      setEditAlimentacion(alimentacion);
    }
  };

  return (
    <div className="space-y-4">
      <div className="block md:hidden space-y-3">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-2 p-2">
            {Object.keys(alimentosPorFecha).map((fecha) => (
              <Badge
                key={fecha}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {fecha}
              </Badge>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Accordion type="single" collapsible className="space-y-2">
          {alimentos.map((alimento, index) => (
            <AccordionItem
              key={alimento.id}
              value={`item-${index}`}
              className="border rounded-lg px-2 bg-card"
            >
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <ChefHat className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium capitalize">
                        {alimento.tipoAlimento}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alimento.fecha}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      alimento.origen === "producido" ? "default" : "secondary"
                    }
                    className="ml-2"
                  >
                    {alimento.origen}
                  </Badge>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="pt-2 pb-3 space-y-3">
                  <Separator />

                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-muted/50 border-0">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Package className="h-3 w-3" />
                          <span className="text-xs">Cantidad</span>
                        </div>
                        <p className="text-sm font-medium">
                          {alimento.cantidad} {alimento.unidad}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50 border-0">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="text-xs">Costo</span>
                        </div>
                        <p className="text-sm font-medium text-primary">
                          {moneda} {alimento.costo_diario}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => handleEditAlimentacion(alimento)}
                  >
                    <Pencil className="h-3 w-3 mr-2" />
                    Editar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/20 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Costo Total Diario</p>
                  <p className="text-xs text-muted-foreground">
                    {alimentos.length}{" "}
                    {alimentos.length === 1 ? "registro" : "registros"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {moneda} {totalCosto.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Por animal</p>
              </div>
            </div>

            <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min((totalCosto / 100) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-center font-semibold">
                Alimento
              </TableHead>
              <TableHead className="text-center font-semibold">
                Origen
              </TableHead>
              <TableHead className="text-center font-semibold">
                Cantidad
              </TableHead>
              <TableHead className="text-center font-semibold">
                Unidad
              </TableHead>
              <TableHead className="text-center font-semibold">
                Costo Diario
              </TableHead>
              <TableHead className="text-center font-semibold">Fecha</TableHead>
              <TableHead className="text-center font-semibold">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {alimentos.map((alimento) => (
              <TableRow key={alimento.id} className="hover:bg-muted/30">
                <TableCell className="text-center font-medium capitalize">
                  <div className="flex items-center justify-center gap-2">
                    <Wheat className="h-4 w-4 text-primary" />
                    {alimento.tipoAlimento}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      alimento.origen === "producido" ? "default" : "secondary"
                    }
                    className="capitalize"
                  >
                    {alimento.origen}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {alimento.cantidad}
                </TableCell>
                <TableCell className="text-center">{alimento.unidad}</TableCell>
                <TableCell className="text-center font-medium text-primary">
                  {moneda} {parseFloat(alimento.costo_diario).toFixed(2)}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {alimento.fecha}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAlimentacion(alimento)}
                    className="hover:bg-primary/10"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={4} className="font-semibold">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Costo Total Diario por Animal
                </div>
              </TableCell>
              <TableCell
                className="text-center font-bold text-primary text-lg"
                colSpan={3}
              >
                {moneda} {totalCosto.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {alimentos.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="bg-muted/50 p-4 rounded-full mb-3">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No hay registros de alimentación
            </p>
            <p className="text-sm text-muted-foreground">
              Agrega alimentos para este animal
            </p>
          </CardContent>
        </Card>
      )}

      {!isMobile && (
        <Modal
          open={openModal}
          onOpenChange={setOpenModal}
          title="Editar Alimentación"
          description="Editar la alimentación diaria de tu animal"
          size="xl"
        >
          <FormAlimentacionAnimal
            moneda={moneda}
            cliente={cliente}
            openModal={openModal}
            setOpenModal={setOpenModal}
            isEdit={isEdit}
            editAlimentacion={editAlimentacion}
          />
        </Modal>
      )}
    </div>
  );
};

export default TableAlimentacionAnimal;
