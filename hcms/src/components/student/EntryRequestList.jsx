import { EntryRequestCard } from "./EntryRequestCard";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useState } from "react";

export const EntryRequestList = ({ requests: initialRequests, className }) => {
  const [requests, setRequests] = useState(initialRequests);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/late-entry/${id}`, {
        withCredentials: true, // if you use cookies/session
      });

      setRequests(prev => prev.filter(req => req.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete request");
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No late entry requests found.</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      {requests.map((request) => (
        <EntryRequestCard key={request.id} request={request} onDelete={handleDelete} />
      ))}
    </div>
  );
};
