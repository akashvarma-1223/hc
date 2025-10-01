import { Check, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";



export const StatusBadge = ({ status, className }) => {
  const statusConfig = {
    approved: {
      icon: Check,
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      label: "Approved"
    },
    pending: {
      icon: Clock,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      label: "Pending"
    },
    declined: {
      icon: X,
      bg: "bg-red-50",
      border: "border-red-200", 
      text: "text-red-700",
      label: "Rejected"
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium border",
      config.bg,
      config.border,
      config.text,
      className
    )}>
      <Icon className="w-4 h-4 mr-1.5" />
      {config.label}
    </div>
  );
};
