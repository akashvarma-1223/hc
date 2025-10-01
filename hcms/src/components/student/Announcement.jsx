import React from "react";
import { cn } from "@/lib/utils";
import { Calendar, Bell, Check,Zap, AlertCircle, Wrench, PartyPopper } from "lucide-react";
import { Badge } from "@/components/ui/badge";



const categoryConfig = {
    General: {
      icon: <Bell className="w-5 h-5" />,
      color: "text-blue-700",
      bgColor: "bg-blue-100"
    },
    Maintenance: {
      icon: <Wrench className="w-5 h-5" />,
      color: "text-yellow-700",
      bgColor: "bg-yellow-100"
    },
    Event: {
      icon: <PartyPopper className="w-5 h-5" />,
      color: "text-purple-700",
      bgColor: "bg-purple-100"
    },
    Electrical: {
      icon: <Zap className="w-5 h-5" />,
      color: "text-yellow-700",
      bgColor: "bg-yellow-100"
    },    
    Emergency: {
      icon: <AlertCircle className="w-5 h-5 animate-pulse" />,
      color: "text-red-700",
      bgColor: "bg-red-100"
    },
  };
  
const Announcement = ({ announcement }) => {
  const { icon, color, bgColor } = categoryConfig[announcement.category] || categoryConfig.General;
  
  return (
    <div className="p-4 transition-all duration-200 border rounded-lg animate-fade-in hover:border-hostel-300 hover:shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-full", bgColor, color)}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-medium">{announcement.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(announcement.timestamp).toLocaleString("en-IN", {
                 dateStyle: "medium",
                 timeStyle: "short",
                 })}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
        
          <Badge variant="outline" className={cn(color, "border-current border-opacity-20")}>
            {announcement.category}
          </Badge>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600">{announcement.content}</p>
      
    </div>
  );
};

export default Announcement;
