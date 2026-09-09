import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign, X, AlertCircle } from "lucide-react";
import { Slider } from "../ui/slider";

interface PriceRangeFilterProps {
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
  minPrice?: number;
  maxPrice?: number;
  initialMin?: number;
  initialMax?: number;
  currency?: string;
}

export const PriceRangeFilter = ({
  onPriceChange,
  minPrice = 0,
  maxPrice = 10000,
  initialMin,
  initialMax,
  currency = "$",
}: PriceRangeFilterProps) => {
  const [localMin, setLocalMin] = useState<number>(initialMin ?? minPrice);
  const [localMax, setLocalMax] = useState<number>(initialMax ?? maxPrice);
  const [isOpen, setIsOpen] = useState(false);
  const [tempMin, setTempMin] = useState<number>(localMin);
  const [tempMax, setTempMax] = useState<number>(localMax);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (initialMin !== undefined && initialMax !== undefined) {
      setLocalMin(initialMin);
      setLocalMax(initialMax);
      setTempMin(initialMin);
      setTempMax(initialMax);
    }
  }, [initialMin, initialMax]);

  const isValidRange = tempMin <= tempMax;

  const handleSliderChange = (values: number[]) => {
    const [min, max] = values;
    setTempMin(min);
    setTempMax(max);
    setError("");
  };

  const handleApply = () => {
    if (tempMin > tempMax) {
      setError("El precio mínimo no puede ser mayor al máximo");
      return;
    }

    const finalMin = tempMin > minPrice ? tempMin : undefined;
    const finalMax = tempMax < maxPrice ? tempMax : undefined;

    setLocalMin(tempMin);
    setLocalMax(tempMax);
    onPriceChange(finalMin, finalMax);
    setIsOpen(false);
    setError("");
  };

  const handleClear = () => {
    setTempMin(minPrice);
    setTempMax(maxPrice);
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
    onPriceChange(undefined, undefined);
    setIsOpen(false);
    setError("");
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? minPrice : Number(e.target.value);

    if (value <= tempMax) {
      setTempMin(value);
      setError("");
    } else {
      setTempMin(value);
      setError("El precio mínimo no puede ser mayor al máximo");
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? maxPrice : Number(e.target.value);

    if (value >= tempMin) {
      setTempMax(value);
      setError("");
    } else {
      setTempMax(value);
      setError("El precio máximo no puede ser menor al mínimo");
    }
  };

  const handleMinBlur = () => {
    if (tempMin > tempMax) {
      setTempMin(tempMax);
      setError("");
    }
  };

  const handleMaxBlur = () => {
    if (tempMax < tempMin) {
      setTempMax(tempMin);
      setError("");
    }
  };

  const hasActiveFilter = localMin > minPrice || localMax < maxPrice;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 text-sm rounded-md border
          transition-all duration-200
          ${
            hasActiveFilter
              ? "bg-primary/10 border-primary text-primary"
              : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
          }
        `}
      >
        <DollarSign size={16} />
        <span>Precio</span>
        {hasActiveFilter && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
            {localMin > minPrice && `$${localMin}`}
            {localMin > minPrice && localMax < maxPrice && " - "}
            {localMax < maxPrice && `$${localMax}`}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-80 z-50 bg-background border rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-sm">Rango de precio</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-accent rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-1">
              <Slider
                min={minPrice}
                max={maxPrice}
                step={100}
                value={[tempMin, tempMax]}
                onValueChange={handleSliderChange}
                className="mb-4"
              />
            </div>

            <div className="flex gap-3 mb-2">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground block mb-1">
                  Mínimo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {currency}
                  </span>
                  <Input
                    type="number"
                    min={minPrice}
                    max={maxPrice}
                    value={tempMin === minPrice ? "" : tempMin}
                    onChange={handleMinInputChange}
                    onBlur={handleMinBlur}
                    className={`pl-7 ${!isValidRange ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    placeholder="Mín"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground block mb-1">
                  Máximo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {currency}
                  </span>
                  <Input
                    type="number"
                    min={minPrice}
                    max={maxPrice}
                    value={tempMax === maxPrice ? "" : tempMax}
                    onChange={handleMaxInputChange}
                    onBlur={handleMaxBlur}
                    className={`pl-7 ${!isValidRange ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    placeholder="Máx"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-red-500 text-xs mb-3">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="text-xs text-muted-foreground text-center mb-4">
              {tempMin === minPrice && tempMax === maxPrice
                ? "Todos los precios"
                : `${currency}${tempMin.toLocaleString()} - ${currency}${tempMax.toLocaleString()}`}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="flex-1"
              >
                Limpiar
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                className="flex-1"
                disabled={!isValidRange}
              >
                Aplicar
              </Button>
            </div>

            {!isValidRange && (
              <p className="text-xs text-red-500 mt-2 text-center">
                El precio mínimo debe ser menor o igual al máximo
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
