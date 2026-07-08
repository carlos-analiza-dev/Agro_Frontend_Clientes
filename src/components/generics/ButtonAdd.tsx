import React from "react";
import { Button } from "../ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  Icon: LucideIcon;
  action: () => void;
  className?: string;
  iconClassName?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  capitalize?: boolean;
}

const ButtonAdd = ({
  title,
  Icon,
  action,
  className = "",
  iconClassName = "h-4 w-4",
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  fullWidth = false,
  capitalize = true,
}: Props) => {
  return (
    <Button
      onClick={action}
      disabled={disabled || loading}
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-300 gap-2",
        fullWidth ? "w-full" : "w-full mt-4 md:w-auto md:mt-0",
        capitalize && "capitalize",
        className,
      )}
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <Icon className={iconClassName} />
      )}
      {title}
      {loading && <span className="sr-only">Cargando...</span>}
    </Button>
  );
};

export default ButtonAdd;
