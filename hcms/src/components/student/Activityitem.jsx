import React from "react";
import { cn } from "@/lib/utils";

const capitalize = (text) =>
  typeof text === "string"
    ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    : "";

// Define category-to-color mapping
const categoryColorMap = {
  general: "bg-blue-500",
  maintenance: "bg-orange-500",
  electrical: "bg-yellow-500",
  event: "bg-green-500",
  other: "bg-purple-500",
};

const ActivityItem = ({ title, content, time, category, className }) => {
  const dotColor = categoryColorMap[category?.toLowerCase()] || "bg-gray-400";

  return (
    <div className={cn("flex items-start justify-between py-4 border-b border-white-200", className)}>
      {/* Left: Status Dot + Content */}
      <div className="flex gap-3 flex-1">
        <div className={cn("h-3 w-3 rounded-full mt-1.5", dotColor)} />

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className="text-sm font-semibold">title: {title}</p>
            <p className="text-xs text-gray-500 ml-4 whitespace-nowrap">{time}</p>
          </div>
          <p className="text-sm text-gray-700">{content}</p>
          {category && (
            <span className="inline-block mt-1 mr-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
              {capitalize(category)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
