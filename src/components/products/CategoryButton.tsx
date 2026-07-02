import { cn } from "@/lib/utils";
import React from "react";

const CategoryButton = ({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "relative px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
      "backdrop-blur-sm border",
      isActive
        ? "bg-gradient-to-r from-green-600 to-green-700 text-white border-green-500/50 shadow-[0_4px_16px_rgba(34,197,94,0.3)] scale-105"
        : "bg-white/70 hover:bg-green-50/80 text-gray-700 hover:text-green-600 border-gray-200/50 hover:border-green-200/50",
    )}
  >
    {children}
    {isActive && (
      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
      </span>
    )}
  </button>
);

export default CategoryButton;
