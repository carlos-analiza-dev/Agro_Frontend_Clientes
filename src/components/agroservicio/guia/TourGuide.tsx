import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TourStep {
  target: string;
  title: string;
  description: string;
}

interface TourGuideProps {
  steps: TourStep[];
  open: boolean;
  onClose: () => void;
  onStepComplete?: (stepIndex: number) => void;
}

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TourGuide = ({
  steps,
  open,
  onClose,
  onStepComplete,
}: TourGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elementRect, setElementRect] = useState<ElementRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({
    top: 0,
    left: 0,
  });

  const step = steps[currentStep];
  useEffect(() => {
    setCurrentStep(0);
  }, [steps]);

  const updatePosition = useCallback(
    (scroll = false) => {
      if (!step) return;

      const element = document.getElementById(step.target);

      if (!element) {
        setElementRect(null);
        return;
      }

      if (scroll) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }

      requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();

        setElementRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });

        const tooltipWidth = 320;
        const tooltipHeight = 180;
        const spacing = 16;

        let top = rect.bottom + spacing;
        let left = rect.left;

        if (left + tooltipWidth > window.innerWidth - 16) {
          left = window.innerWidth - tooltipWidth - 16;
        }

        if (left < 16) {
          left = 16;
        }

        if (top + tooltipHeight > window.innerHeight - 16) {
          top = rect.top - tooltipHeight - spacing;
        }

        if (top < 16) {
          top = 16;
        }

        setTooltipPosition({
          top,
          left,
        });
      });
    },
    [step],
  );

  useEffect(() => {
    if (!open || !step) return;

    setElementRect(null);
    updatePosition(true);
    let animationFrame: number;

    const trackPosition = () => {
      updatePosition(false);
      animationFrame = requestAnimationFrame(trackPosition);
    };

    const timeout = setTimeout(() => {
      cancelAnimationFrame(animationFrame);
    }, 800);

    animationFrame = requestAnimationFrame(trackPosition);

    window.addEventListener("resize", () => updatePosition(false));
    window.addEventListener("scroll", () => updatePosition(false));

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", () => updatePosition(false));
      window.removeEventListener("scroll", () => updatePosition(false));
    };
  }, [open, currentStep, updatePosition]);

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setElementRect(null);
    }
  }, [open]);

  if (!open || !step) {
    return null;
  }

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      if (onStepComplete) {
        onStepComplete(currentStep);
      } else {
        onClose();
      }
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black/50" />

      {elementRect && (
        <div
          className="pointer-events-none fixed z-[9999] rounded-md transition-all duration-300"
          style={{
            top: elementRect.top - 6,
            left: elementRect.left - 6,
            width: elementRect.width + 12,
            height: elementRect.height + 12,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
            border: "2px solid rgb(34 197 94)",
          }}
        />
      )}

      <div
        className={cn(
          "fixed z-[10000] w-[320px]",
          "rounded-lg border bg-white p-4 shadow-2xl",
          "animate-in fade-in zoom-in-95 duration-200",
        )}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{step.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {step.description}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Paso {currentStep + 1} de {steps.length}
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isFirst}
              onClick={handlePrevious}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>

            <Button size="sm" onClick={handleNext}>
              {isLast ? (
                <>
                  Siguiente página
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourGuide;
