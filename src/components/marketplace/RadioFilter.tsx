"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioFilterProps {
  onRadiusChange: (radius: number) => void;
  currentRadius: number;
}

const RADIUS_OPTIONS = [
  { value: 5, label: "5 km" },
  { value: 10, label: "10 km" },
  { value: 25, label: "25 km" },
  { value: 50, label: "50 km" },
  { value: 100, label: "100 km" },
  { value: 200, label: "200 km" },
  { value: 300, label: "300 km" },
  { value: 400, label: "400 km" },
  { value: 500, label: "500 km" },
  { value: 600, label: "600 km" },
  { value: 700, label: "700 km" },
];

export const RadioFilter = ({
  onRadiusChange,
  currentRadius,
}: RadioFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState(currentRadius);

  const handleApply = () => {
    onRadiusChange(selectedRadius);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedRadius(100);
    onRadiusChange(100);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Distancia</span>
          {currentRadius > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {currentRadius} km
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Distancia</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-xs text-muted-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          </div>

          <RadioGroup
            value={selectedRadius.toString()}
            onValueChange={(value) => setSelectedRadius(Number(value))}
            className="space-y-2"
          >
            {RADIUS_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`radius-${option.value}`}
                />
                <Label
                  htmlFor={`radius-${option.value}`}
                  className="cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
