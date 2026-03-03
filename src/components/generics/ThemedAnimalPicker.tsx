"use client";

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronDown,
  X,
  List,
  Image as ImageIcon,
  PawPrint,
} from "lucide-react";

interface Animal {
  id: string;
  identificador: string;
  sexo: string;
  color: string;
  profileImages?: { url: string }[];
}

interface ThemedAnimalPickerProps {
  animals: Animal[];
  selectedAnimals: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  label?: string;
  multiple?: boolean;
}

const ThemedAnimalPicker = ({
  animals,
  selectedAnimals,
  onSelectionChange,
  label = "Seleccionar animales",
  multiple = true,
}: ThemedAnimalPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const unselectedAnimals = animals.filter(
    (animal) => !selectedAnimals.includes(animal.id),
  );

  const toggleAnimalSelection = (animalId: string) => {
    if (multiple) {
      const newSelection = selectedAnimals.includes(animalId)
        ? selectedAnimals.filter((id) => id !== animalId)
        : [...selectedAnimals, animalId];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange(selectedAnimals.includes(animalId) ? [] : [animalId]);
    }
  };

  const handleClearSelection = () => {
    onSelectionChange([]);
  };

  const getAnimalImageUrl = (animal: Animal): string | undefined => {
    if (animal.profileImages?.[0]?.url) {
      return animal.profileImages[0].url;
    }
    return undefined;
  };

  return (
    <div className="w-full space-y-3">
      <Accordion
        type="single"
        collapsible
        value={isOpen ? "animal-picker" : undefined}
      >
        <AccordionItem value="animal-picker" className="border rounded-lg">
          <AccordionTrigger
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-3 hover:no-underline"
          >
            <div className="flex items-center space-x-3">
              <List className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0">
            <div className="border-t">
              {selectedAnimals.length > 0 && multiple && (
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-sm text-muted-foreground">
                    {selectedAnimals.length} seleccionado(s)
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSelection}
                    className="h-8 px-2 text-destructive hover:text-destructive/90"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Limpiar
                  </Button>
                </div>
              )}

              <ScrollArea className="h-64">
                <div className="p-2 space-y-1">
                  {unselectedAnimals.length > 0 ? (
                    unselectedAnimals.map((animal) => (
                      <Card
                        key={animal.id}
                        className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleAnimalSelection(animal.id)}
                      >
                        <CardContent className="p-2 flex items-center space-x-3">
                          <Checkbox
                            checked={selectedAnimals.includes(animal.id)}
                            onCheckedChange={() =>
                              toggleAnimalSelection(animal.id)
                            }
                            className="flex-shrink-0"
                          />

                          <div className="flex items-center space-x-3 flex-1">
                            <div className="relative">
                              {getAnimalImageUrl(animal) ? (
                                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                                  <img
                                    src={getAnimalImageUrl(animal)}
                                    alt={animal.identificador}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                  <PawPrint className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <Label
                                htmlFor={`animal-${animal.id}`}
                                className="font-medium text-sm cursor-pointer truncate"
                              >
                                {animal.identificador}
                              </Label>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>{animal.sexo}</span>
                                <span>•</span>
                                <span>{animal.color}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <PawPrint className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Todos los animales han sido seleccionados</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {selectedAnimals.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Animales seleccionados:
            </span>
            <span className="text-xs text-muted-foreground">
              {selectedAnimals.length} / {animals.length}
            </span>
          </div>

          <ScrollArea className="w-full">
            <div className="flex flex-wrap gap-2 min-h-10">
              {selectedAnimals.map((animalId) => {
                const animal = animals.find((a) => a.id === animalId);
                if (!animal) return null;

                return (
                  <Badge
                    key={animalId}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm cursor-pointer hover:bg-destructive/20 transition-colors group"
                    onClick={() => toggleAnimalSelection(animalId)}
                  >
                    <div className="flex items-center space-x-2">
                      {getAnimalImageUrl(animal) ? (
                        <div className="w-4 h-4 rounded-full overflow-hidden">
                          <img
                            src={getAnimalImageUrl(animal)}
                            alt={animal.identificador}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <PawPrint className="h-3 w-3" />
                      )}

                      <span>{animal.identificador}</span>

                      <X className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Badge>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {animals.length === 0 && (
        <div className="text-center py-6 border rounded-lg bg-muted/20">
          <PawPrint className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No hay animales disponibles</p>
        </div>
      )}
    </div>
  );
};

export default ThemedAnimalPicker;
