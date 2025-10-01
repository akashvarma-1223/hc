import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/caretaker/use-Toast";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import api from "../api/axios";

const Index = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }
  
        const response = await api.get(`/user/${userId}`);
        console.log("User Info:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "Failed to load user info",
        });
      }
    };
  
    fetchUser();
  }, []);
  
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
  
        const response = await api.get("/complaints");
        console.log("Fetched complaints:", response.data);
  
        // Filter complaints only after user info is loaded
        if (user) {
          const filteredComplaints = response.data.filter((complaint) => {
            return (
              complaint.hblock === user.hostelblock ||
              complaint.hblock === "Unknown"
            );
          });
          setComplaints(filteredComplaints);
        } else {
          setComplaints(response.data); // fallback
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
        toast({
          title: "Error",
          description: "Failed to load complaints",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    // Only fetch complaints once user is loaded
    if (user) {
      fetchComplaints();
    }
  }, [user]); // depend on user state
  

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status: newStatus });

      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.id === id
            ? { ...complaint, status: newStatus }
            : complaint
        )
      );

      toast({
        title: "Status Updated",
        description: `Complaint status has been changed to ${newStatus === "inProgress" ? "In Progress" : newStatus
          }.`,
      });
    } catch (error) {
      console.error("Error updating complaint status:", error);
      toast({
        title: "Error",
        description: "Failed to update complaint status",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-[#FEF7CD] text-amber-700 hover:bg-[#EEE7BD]">
            Pending
          </Badge>
        );
      case "inProgress":
        return (
          <Badge className="bg-[#D3E4FD] text-blue-600 hover:bg-[#C3D4ED]">
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-[#F2FCE2] text-green-700 hover:bg-[#E2ECD2]">
            Resolved
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "inProgress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-gray-600"
            onClick={() => navigate("/dashboardc")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Page header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-green-100 p-2 rounded-md">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Complaints Management
              </h1>
              <p className="text-gray-500 mt-1">
                View and manage student complaints
              </p>
            </div>
          </div>

          {/* Complaints table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Loading complaints...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.length > 0 ? (
                    complaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-medium">
                          {complaint.is_anonymous ? "Anonymous" : complaint.room}
                        </TableCell>
                        <TableCell className="font-medium">
                          {complaint.title}
                        </TableCell>
                        <TableCell>{complaint.description}</TableCell>
                        <TableCell>{complaint.typec}</TableCell>
                        <TableCell>
                          {getStatusBadge(complaint.status)}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {new Date(complaint.submitted).toLocaleString(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true // optional, depending on whether you want AM/PM
})}
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={complaint.status}
                            onValueChange={(value) =>
                              handleStatusChange(complaint.id, value)
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue
                                placeholder={formatStatus(complaint.status)}
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="inProgress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No complaints found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
