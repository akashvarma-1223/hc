import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import FilterButton from "./FilterButton";

const capitalizePhrase = (phrase) =>
  typeof phrase === "string"
    ? phrase
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
    : "";

const AnnouncementBoard = ({ announcements, onToggleBookmark, onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [blockFilter, setBlockFilter] = useState("all");

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || announcement.category?.toLowerCase() === categoryFilter;

    const matchesBlock =
      blockFilter === "all" ||
      announcement.block?.toLowerCase() === blockFilter ||
      announcement.typec === "All Blocks";

    return matchesSearch && matchesCategory && matchesBlock;
  });

  return (
    <div className="mt-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-600">Announcements</h1>
          <p className="text-gray-500 mt-1">Manage and create announcements</p>
        </div>
        {onCreateNew && (
          <Button
            onClick={onCreateNew}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Block Filters */}
        <div className="flex gap-2 flex-wrap">
          {["block a", "block b", "block c", "block d"].map((block) => (
            <FilterButton
              key={block}
              active={blockFilter === block}
              onClick={() =>
                setBlockFilter(blockFilter === block ? "all" : block)
              }
            >
              {capitalizePhrase(block)}
            </FilterButton>
          ))}
          <FilterButton
            active={blockFilter === "all"}
            onClick={() => setBlockFilter("all")}
          >
            All Blocks
          </FilterButton>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap">
          {["General", "Maintenance", "Electrical", "Other"].map((category) => (
            <FilterButton
              key={category}
              active={categoryFilter === category.toLowerCase()}
              onClick={() =>
                setCategoryFilter(
                  categoryFilter === category.toLowerCase() ? "all" : category.toLowerCase()
                )
              }
            >
              {category}
            </FilterButton>
          ))}
          <FilterButton
            active={categoryFilter === "all"}
            onClick={() => setCategoryFilter("all")}
          >
            All Categories
          </FilterButton>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-lg shadow border border-gray-200 p-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{announcement.title}</h3>
                <div className="text-sm text-gray-500">
                  {announcement.timestamp &&
                    new Date(announcement.timestamp).toLocaleString("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                </div>
              </div>

              <div className="mt-1 mb-3 flex gap-2 flex-wrap">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {announcement.typec === "All Blocks"
                    ? "All Blocks"
                    : capitalizePhrase(announcement.block ?? "")}
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {capitalizePhrase(announcement.category)}
                </span>
              </div>

              <p className="text-gray-700 mt-2">{announcement.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
            No announcements found
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBoard;
