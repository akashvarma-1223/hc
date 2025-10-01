
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const FilterButton = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-purple-100 text-purple-800 border border-purple-300"
          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
      )}
    >
      {children}
    </button>
  );
};

export default FilterButton;
