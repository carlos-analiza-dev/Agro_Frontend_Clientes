import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FABProps {
  icon?: React.ReactNode;
  onPress: () => void;
  titulo?: string;
  className?: string;
}

export const FAB = ({
  icon = <Plus className="h-6 w-6" />,
  onPress,
  className,
  titulo,
}: FABProps) => {
  return (
    <Button
      className={cn(
        "fixed bottom-8 right-8 z-50 h-14 w-14 rounded-md shadow-lg md:bottom-10 md:right-10 md:h-16 md:w-16 bg-green-600",
        className,
      )}
      onClick={onPress}
      size="icon"
      title={titulo}
    >
      {icon}
    </Button>
  );
};
