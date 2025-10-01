import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EntryRequestList } from "@/components/student/EntryRequestList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/Pages/api/axios";// Ensure this is your API utility

const Late = () => {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch Logged-in User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/me", { withCredentials: true });
        setUser(response.data); // Store the user object (with user.id)
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  // Function to fetch requests based on status
  const fetchRequests = async (status, setter) => {
    if (!user) return; // Ensure we have user data before fetching

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/late-entry/status/${status}`, {
        method: "GET",
        credentials: "include", // ✅ Send cookies (JWT)
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${status} requests`);
      }

      const data = await response.json();

      // ✅ Filter requests to show only those that match the logged-in user's ID
      const filteredRequests = data.filter(request => request.user_id === user.userId);
      setter(filteredRequests);
    } catch (err) {
      setError(err.message);
      toast.error(`Error loading ${status} requests.`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data once user data is available
  useEffect(() => {
    if (user) {
      fetchRequests("pending", setPendingRequests);
      fetchRequests("approved", setApprovedRequests);
      fetchRequests("declined", setRejectedRequests);
    }
  }, [user]); // Fetch requests only when `user` is available

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate('/dashboards')} 
            className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-blue-600">NITC HostelConnect</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Late Entry Requests</h1>
          <p className="text-gray-500">Track and manage your late entry requests.</p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">Request History</h2>
            <Button className="text-white bg-indigo-500 hover:bg-indigo-600 " onClick={() => navigate("/ll")}>
              New Request
            </Button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading requests...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="pending" className="text-blue-600 hover:text-blue-800">
                  Pending
                </TabsTrigger>
                <TabsTrigger value="approved" className="text-green-600 hover:text-green-800">
                  Approved
                </TabsTrigger>
                <TabsTrigger value="rejected" className="text-red-600 hover:text-red-800">
                  Rejected
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <EntryRequestList requests={pendingRequests} />
              </TabsContent>

              <TabsContent value="approved">
                <EntryRequestList requests={approvedRequests} />
              </TabsContent>

              <TabsContent value="rejected">
                <EntryRequestList requests={rejectedRequests} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Late;
