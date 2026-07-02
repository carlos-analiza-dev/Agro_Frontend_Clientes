import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SummaryListProps {
  items: string[];
  onRemoveItem: (index: number) => void;
  emptyMessage?: string;
  label?: string;
}

const SummaryList = ({
  items,
  onRemoveItem,
  emptyMessage = "No hay elementos agregados",
  label = "Elementos",
}: SummaryListProps) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2">{emptyMessage}</div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground">
        {label} ({items.length})
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1.5 text-sm"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemoveItem(index)}
              className="ml-1 hover:text-red-500 transition-colors"
              aria-label={`Eliminar ${item}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SummaryList;
