import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, CheckCircle, XCircle, AlertCircle } from "lucide-react";


export function StatusBadge({ status, className, onStatusChange, editable = true }) {
  const statusColors = {
    Pending: "bg-amber-100 text-amber-800 border-amber-200",
    Resolved: "bg-green-100 text-green-800 border-green-200",
    Investigating: "bg-blue-100 text-blue-800 border-blue-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
  };

  const statusIcons = {
    Pending: <span className="mr-1 text-amber-600">⏳</span>,
    Resolved: <CheckCircle className="mr-1 h-3 w-3 text-green-600" />,
    Investigating: <AlertCircle className="mr-1 h-3 w-3 text-blue-600" />,
    Rejected: <XCircle className="mr-1 h-3 w-3 text-red-600" />
  };

  if (!editable || !onStatusChange) {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
          statusColors[status],
          className
        )}
      >
        {statusIcons[status]}
        {status}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer",
            statusColors[status],
            className
          )}
        >
          {statusIcons[status]}
          {status}
          <ChevronDown className="ml-1 h-3 w-3" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-48">
        <DropdownMenuItem onClick={() => onStatusChange("Pending")}>
          <span className="mr-2 text-amber-600">⏳</span>
          Mark as Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Resolved")}>
          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
          Mark as Resolved
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Investigating")}>
          <AlertCircle className="mr-2 h-4 w-4 text-blue-600" />
          Mark as Investigating
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Rejected")}>
          <XCircle className="mr-2 h-4 w-4 text-red-600" />
          Mark as Rejected
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}