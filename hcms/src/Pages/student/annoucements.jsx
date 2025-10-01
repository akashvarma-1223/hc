import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Announcement from "@/components/student/Announcement";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import api from "@/Pages/api/axios"; // Assuming you use an Axios instance here

const Announcementss = () => {
  const navigate = useNavigate();
  const handleBackClick = () => navigate("/dashboards");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  const filterCategories = ["All", "General", "Maintenance", "Electrical", "Other"];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/me", { withCredentials: true });
        setUser(response.data);
        console.log(response.data);
        setUsername(response.data.username);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/announcements");
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await response.json();
        console.log(data);
        setAnnouncements(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesCategory =
      activeFilter === "All" || announcement.category === activeFilter;

    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBlock =
      announcement.typec !== "Block Specific" ||
      (user && announcement.block.split(" ").pop() === user.block    );

    return matchesCategory && matchesSearch && matchesBlock;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      {/* Header */}
      <header className="p-4 border-b flex items-center">
        <button
          onClick={handleBackClick}
          className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-600">NITC HostelConnect</h1>
      </header>

      {/* Heading */}
      <div className="max-w-7xl mx-30 mb-6 mt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
            <p className="mt-1.5 text-muted-foreground">
              Stay updated with the latest announcements and news for hostel residents.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 mt-2 bg-white rounded-xl shadow-sm max-w-7xl mx-auto w-full">
        {/* Search */}
        <div className="flex flex-col gap-4 md:flex-row items-center md:justify-between">
          <div className="relative w-full md:w-3/4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-start gap-2 mt-4">
          {filterCategories.map((category) => (
            <Button
              key={category}
              variant={
                activeFilter === category
                  ? category === "All"
                    ? "hostel"
                    : category.toLowerCase()
                  : "outline"
              }
              size="sm"
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Announcements */}
        <div className="mt-6 space-y-4">
          {loading || !user ? (
            <p className="text-center text-gray-500">Loading announcements...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <Announcement key={announcement.id} announcement={announcement} />
            ))
          ) : (
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium text-gray-900">No announcements found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "New announcements will appear here"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcementss;
