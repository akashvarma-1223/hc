import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MapPin } from "lucide-react";
import api from "@/Pages/api/axios";

const ItemCard = ({ item }) => {
  const [user, setUser] = useState(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/me", { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  const isLost = item.type === "LOST";
  const isFound = item.type === "FOUND";
  const isWithCaretaker = item.type === "WITH CARETAKER";
  const statusClass = isLost
    ? "bg-red-100 text-red-600 px-2 py-1 rounded-md"
    : "bg-green-100 text-green-600 px-2 py-1 rounded-md";
  const statusText = isLost ? "LOST" : isFound ? "FOUND" : isWithCaretaker ? "WITH CARETAKER" : "Unknown";

  const imageSrc = item.image ? item.image : "/public/image/1.jpg";

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/lost-found/${item.id}`, {
        withCredentials: true,
      });
      console.log("Deleted successfully:", response.data);
      alert("Item deleted successfully");
      window.location.reload(); // inside handleDelete

      // TODO: Trigger UI update or notify parent
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete item");
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium mt-2 mb-1">{item.title}</h3>
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", statusClass)}>
              {statusText}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex gap-4">
            
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={imageSrc}
                alt={`Image of ${item.title}`}
                className="w-full h-full object-cover rounded-md bg-gray-100 cursor-pointer"
                onClick={() => setShowImageDialog(true)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin size={14} className="mr-1" />
                <span className="mr-3">{item.location}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span>{format(new Date(item.date), "MM/dd/yyyy")}</span>
              </div>
              <span className="text-xs text-gray-500 mt-1">
              {item.category}
            </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setShowImageDialog(true)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View Image
          </Button>
          {user && user.userId === item.user_id && (
            <Button
              size="sm"
              className="text-white ml-auto bg-red-400 hover:bg-red-500 text-xs"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <button onClick={() => setShowImageDialog(false)}>
                <X className="h-5 w-5 text-gray-600 hover:text-gray-800" />
              </button>
            </div>
            <div className="mt-4">
              <img
                src={imageSrc}
                alt={`Image of ${item.title}`}
                className="w-full h-auto rounded-md"
              />
            </div>
            <div className="mt-4 text-right">
              <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <strong>{item.title}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={async () => {
                  await handleDelete();
                  setShowDeleteDialog(false);
                }}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemCard;
