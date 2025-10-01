import React, { createContext, useContext, useState } from "react";
import { toast } from "@/hooks/use-Toast";

const AnnouncementContext = createContext({
  announcements: [],
  unreadCount: 0,
  filteredAnnouncements: [],
  selectedCategory: "All",
  searchQuery: "",
  setSearchQuery: () => {},
  setSelectedCategory: () => {},
  markAsRead: () => {},
  togglePin: () => {},
  addAnnouncement: () => {},
  updateAnnouncement: () => {},
  deleteAnnouncement: () => {},
});

const initialAnnouncements = [
  {
    id: "1",
    title: "Internet Maintenance Scheduled",
    category: "Maintenance",
    description: "The hostel Wi-Fi will be down for maintenance from 2 AM to 4 AM on Saturday. Please plan accordingly.",
    createdAt: "2024-04-10T08:00:00.000Z",
    isRead: false,
    isPinned: false,
  },
  {
    id: "2",
    title: "Cultural Night Event",
    category: "Event",
    description: "Join us for Cultural Night at the Main Auditorium on April 15th at 6 PM. Participants should report by 5:30 PM.",
    createdAt: "2024-04-08T14:30:00.000Z",
    isRead: false,
    isPinned: false,
  },
  {
    id: "3",
    title: "Water Shortage Notice",
    category: "Urgent",
    description: "Due to maintenance in the main water supply, there might be water shortage from 10 AM to 2 PM tomorrow. Please store water accordingly.",
    createdAt: "2024-04-07T17:45:00.000Z",
    isRead: false,
    isPinned: false,
  },
];

export const useAnnouncements = () => useContext(AnnouncementContext);

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = announcements.filter((a) => !a.isRead).length;

  // Filter and sort announcements
  const filteredAnnouncements = announcements
    .filter((announcement) => {
      const matchesCategory = selectedCategory === "All" || announcement.category === selectedCategory;
      const matchesSearch =
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const markAsRead = (id) => {
    setAnnouncements((prev) =>
      prev.map((announcement) => (announcement.id === id ? { ...announcement, isRead: true } : announcement))
    );
  };

  const togglePin = (id) => {
    setAnnouncements((prev) =>
      prev.map((announcement) => (announcement.id === id ? { ...announcement, isPinned: !announcement.isPinned } : announcement))
    );
  };

  const addAnnouncement = (announcementData) => {
    const newAnnouncement = {
      ...announcementData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false,
      isPinned: false,
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);

    toast({
      title: "New Announcement",
      description: `"${announcementData.title}" has been added`,
      variant: "default",
    });
  };

  const updateAnnouncement = (id, update) => {
    setAnnouncements((prev) =>
      prev.map((announcement) => (announcement.id === id ? { ...announcement, ...update } : announcement))
    );
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));

    toast({
      title: "Announcement Deleted",
      description: "The announcement has been removed",
      variant: "destructive",
    });
  };

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        unreadCount,
        filteredAnnouncements,
        selectedCategory,
        searchQuery,
        setSearchQuery,
        setSelectedCategory,
        markAsRead,
        togglePin,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};
