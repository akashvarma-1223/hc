import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequestTabs from "@/components/caretaker/RequestTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";
import api from "@/Pages/api/axios"; // Assuming you have an API helper
import { toast } from "@/hooks/use-Toast"; // Assuming you use a toast notification

const LateEntryRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch Logged-in User Data
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

  // Fetch Requests & Match User
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);

        const pendingResponse = await api.get("/late-entry/status/pending");
        const approvedResponse = await api.get("/late-entry/status/approved");
        const declinedResponse = await api.get("/late-entry/status/declined");

        let allRequests = [
          ...pendingResponse.data.map((req) => ({ ...req, status: "pending" })),
          ...approvedResponse.data.map((req) => ({ ...req, status: "approved" })),
          ...declinedResponse.data.map((req) => ({ ...req, status: "declined" })),
        ];

        if (user) {
          allRequests = allRequests.map((req) =>
            req.userid === user.id ? { ...req, username: user.username } : req
          );
        }

        setRequests(allRequests);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        toast({
          title: "Error",
          description: "Failed to load late entry requests.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchRequests();
  }, [user]);

  // Update Request Status
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/late-entry/${id}/status`, { status: newStatus });

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );

      toast({
        title: newStatus === "approved" ? "Request Approved" : "Request Declined",
        description: `Late entry request has been ${newStatus}.`,
      });
    } catch (error) {
      console.error(`Failed to ${newStatus} request:`, error);
      toast({
        title: "Error",
        description: `Failed to ${newStatus} request.`,
      });
    }
  };

  return (
    <>
      {/* Top Header like in image */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-gray-600"
            onClick={() => navigate("/dashboardc")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-[#D3E4FD] flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Late Entry Requests</h1>
              <p className="text-muted-foreground">Manage student late entry requests</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-[250px]" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <RequestTabs
              requests={requests}
              onApprove={(id) => handleStatusUpdate(id, "approved")}
              onDecline={(id) => handleStatusUpdate(id, "declined")}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LateEntryRequests;
