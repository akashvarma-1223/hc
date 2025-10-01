import React, { useState, useEffect } from "react";
import {
  User,
  MessageSquare,
  Package,
  Users,
  Clock,
  Utensils,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/Pages/api/axios";
import Card from "./Card";
import Header from "./Header";
import ActivityItem from "@/components/student/ActivityItem";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState();
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const totalNotifications = 2;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/me", { withCredentials: true });
        setUser(response.data);
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
        setIsLoading(true);
        const response = await api.get("/announcements");
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        toast.error("Failed to load announcements");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // ✅ Updated filtering logic
  const filteredAnnouncements = announcements.filter((item) => {
    if (!user) return false;

    if (item.typec === "All Blocks") return true;

    if (
      item.typec === "Block Specific" &&
      item.block &&
      user.block &&
      item.block.trim().toLowerCase().endsWith(user.block.trim().toLowerCase())
    ) {
      return true;
    }

    return false;
  });

  const handleCardClick = (title) => {
    toast(`${title} card clicked`, {
      description: "This feature is coming soon!",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header username={username} notificationCount={totalNotifications} />

      <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Profile"
            description="View and edit your profile details"
            icon={<User size={22} className="text-nitc-blue" />}
            iconBgColor="bg-nitc-light-blue"
            onClick={() => navigate("/profile")}
            style={{ animationDelay: "0ms" }}
            className="shadow-[0_4px_10px_rgba(0,0,255,0.5)]"
          />

          <Card
            title="Complaints"
            description="Register and track your complaints"
            icon={<MessageSquare size={22} className="text-purple-500" />}
            iconBgColor="bg-light-purple"
            onClick={() => navigate("/complaints")}
            style={{ animationDelay: "100ms" }}
            className="shadow-[0_4px_10px_rgba(128,0,128,0.5)]"
          />

          <Card
            title="Lost & Found"
            description="Report lost items or mark found ones"
            icon={<Package size={22} className="text-green-500" />}
            iconBgColor="bg-nitc-light-green"
            onClick={() => navigate("/LandF")}
            style={{ animationDelay: "200ms" }}
            className="shadow-[0_4px_10px_rgba(0,128,0,0.5)]"
          />

          <Card
            title="Collaborative Learning"
            description="Join clubs and collaborate with peers"
            icon={<Users size={22} className="text-yellow-500" />}
            iconBgColor="bg-nitc-light-yellow"
            onClick={() => navigate("/skill")}
            style={{ animationDelay: "300ms" }}
            className="shadow-[0_4px_10px_rgba(255,215,0,0.5)]"
          />

          <Card
            title="Late Entry"
            description="Submit and track late entry requests"
            icon={<Clock size={22} className="text-purple-500" />}
            iconBgColor="bg-nitc-light-purple"
            onClick={() => navigate("/late")}
            style={{ animationDelay: "400ms" }}
            className="shadow-[0_4px_10px_rgba(128,0,128,0.5)]"
          />

          <Card
            title="Announcements"
            description="Important notices and updates"
            icon={<Bell size={22} className="text-red-500" />}
            iconBgColor="bg-nitc-light-blue"
            onClick={() => navigate("/sannoucements")}
            style={{ animationDelay: "600ms" }}
            className="shadow-[0_4px_10px_rgba(0,0,255,0.5)]"
          />
        </div>

        <div className="mt-10">
          <div className="glass p-6 rounded-xl shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock size={18} className="text-muted-foreground" />
              Announcements
            </h2>

            <div className="divide-y">
              {isLoading ? (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground">Loading announcements...</p>
                </div>
              ) : filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.slice(0, 5).map((item, index) => (
                  <ActivityItem
                    key={item.id}
                    title={item.title}
                    color="announcement"
                    content={item.content}
                    category={item.category}
                    
                    time={new Date(item.timestamp).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true, // optional: for 12-hour format
                    })}
                    
                    className="py-4"
                  />
                ))
              ) : (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground">No relevant announcements</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
