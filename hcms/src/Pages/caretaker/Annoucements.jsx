import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnnouncementBoard from "@/components/caretaker/dashboard/AnnouncementBoard";
import AnnouncementModal from "@/components/caretaker/dashboard/AnnouncementModal";
import { toast } from "@/hooks/caretaker/use-Toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import api from "../api/axios";

const Index = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Fetch announcements on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/announcements");
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        toast({
          title: "Error",
          description: "Failed to load announcements",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Submit new announcement
  const handleSubmitAnnouncement = async (data) => {
    try {
      const announcementData = {
        title: data.title,
        content: data.content,
        category: data.category,
        type: data.type,
        block: data.type === "Block Specific" ? data.block || "" : null,
      };

      const response = await api.post("/announcements", announcementData);

      const newAnnouncement = {
        id: response.data.id,
        title: response.data.title,
        content: response.data.content,
        category: response.data.category,
        type: response.data.type,
        block: response.data.block,
        timestamp: response.data.timestamp || new Date().toISOString(),
      };

      setAnnouncements((prev) => [newAnnouncement, ...prev]);

      toast({
        title: "Announcement Created",
        description: `"${data.title}" has been posted successfully.`,
      });

      setShowAnnouncementModal(false);
      window.location.reload(); // Refresh the page to show the new announcement
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast({
        title: "Error",
        description: "Failed to create announcement",
      });
    }
  };

  // Toggle bookmark logic
  const toggleBookmark = (id) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === id
          ? { ...announcement, isBookmarked: !announcement.isBookmarked }
          : announcement
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-gray-600"
            onClick={() => navigate("/dashboardc")} // adjust route if needed
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <AnnouncementBoard
          announcements={announcements}
          isLoading={isLoading}
          onToggleBookmark={toggleBookmark}
          onCreateNew={() => setShowAnnouncementModal(true)}
        />

        {showAnnouncementModal && (
          <AnnouncementModal
            isOpen={showAnnouncementModal}
            onClose={() => setShowAnnouncementModal(false)}
            onSubmit={handleSubmitAnnouncement}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
