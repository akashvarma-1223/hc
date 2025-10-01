import { format } from "date-fns";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const EntryRequestCard = ({ request, className, onDelete }) => {
  const handleViewAttachment = () => {
    window.open(`http://localhost:5000/api/late-entry/${request.id}/attachment`, "_blank");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this request?")) {
      onDelete(request.id);
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h3 className="font-medium">
          {format(new Date(request.timestamp), "dd/MM/yyyy hh:mma")}
        </h3>
        <StatusBadge status={request.status} />
      </div>

      <p className="text-gray-600 text-sm mb-3">
        <span className="font-medium text-gray-700">Reason:</span> {request.reason}
      </p>

      <div className="flex gap-2">
        {request.attachment && (
          <Button onClick={handleViewAttachment} size="sm">
            View Attachment
          </Button>
        )}
        {request.status === "pending" && (
          <Button
          className="bg-red-700 font-medium py-2 px-4 rounded-sm text-sm text-white "
          onClick={handleDelete}
        >        
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};
