"use client";

import { useState, useEffect } from "react";
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
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetEspecies from "@/hooks/especies/useGetEspecies";

interface EspecieCantidad {
  especie: string;
  cantidad: number;
}

interface EspecieCantidadPickerProps {
  value: EspecieCantidad[];
  onChange: (value: EspecieCantidad[]) => void;
  cantidadTotal: number;
  disabled?: boolean;
}

export default function EspecieCantidadPicker({
  value,
  onChange,
  cantidadTotal,
  disabled = false,
}: EspecieCantidadPickerProps) {
  const { data: especies_options } = useGetEspecies();
  const [especies, setEspecies] = useState<EspecieCantidad[]>(value);
  useEffect(() => {
    setEspecies(value);
  }, [value]);

  const addEspecie = () => {
    if (disabled) return;
    const nuevasEspecies = [...especies, { especie: "", cantidad: 0 }];
    setEspecies(nuevasEspecies);
    onChange(nuevasEspecies);
  };

  const removeEspecie = (index: number) => {
    if (disabled) return;
    const nuevasEspecies = especies.filter((_, i) => i !== index);
    setEspecies(nuevasEspecies);
    onChange(nuevasEspecies);
  };

  const updateEspecie = (
    index: number,
    field: keyof EspecieCantidad,
    newValue: string | number,
  ) => {
    if (disabled) return;
    const nuevasEspecies = [...especies];
    nuevasEspecies[index] = {
      ...nuevasEspecies[index],
      [field]: field === "cantidad" ? Number(newValue) : newValue,
    };
    setEspecies(nuevasEspecies);
    onChange(nuevasEspecies);
  };

  const sumaActual = especies.reduce((sum, item) => sum + item.cantidad, 0);
  const diferencia = cantidadTotal - sumaActual;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Gestión de Especies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {especies.map((especie, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Especie</Label>
              <Select
                value={especie.especie}
                onValueChange={(value) =>
                  updateEspecie(index, "especie", value)
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar especie" />
                </SelectTrigger>
                <SelectContent>
                  {especies_options?.data?.map((option) => (
                    <SelectItem key={option.id} value={option.nombre}>
                      {option.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cantidad</Label>
              <Input
                type="number"
                value={especie.cantidad}
                onChange={(e) =>
                  updateEspecie(index, "cantidad", e.target.value)
                }
                placeholder="Cantidad"
                disabled={disabled}
              />
            </div>

            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeEspecie(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        {!disabled && (
          <Button
            type="button"
            onClick={addEspecie}
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Especie
          </Button>
        )}

        {cantidadTotal > 0 && (
          <div className="text-sm text-muted-foreground">
            <p>Total animales: {cantidadTotal}</p>
            <p>Suma actual: {sumaActual}</p>
            <p
              className={
                diferencia !== 0 ? "text-destructive" : "text-green-600"
              }
            >
              Diferencia: {diferencia}
            </p>
            {diferencia !== 0 && (
              <p className="text-destructive text-xs">
                La suma de especies debe coincidir con el total de animales
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
