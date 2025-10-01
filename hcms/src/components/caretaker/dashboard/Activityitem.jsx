import React from 'react';
import { cn } from '@/lib/utils';



const ActivityItem = ({ color, content, time, className }) => {
  return (
    <div className={cn("flex items-start gap-3 py-3 animate-fade-up ", className)}>
      <div className={cn(
        "h-2 w-2 rounded-full mt-2",
        color === 'complaint' && "bg-purple-400",
        color === 'lost' && "bg-blue-400",
        color === 'entry' && "bg-green-400",
        color === 'announcement' && "bg-yellow-400"
      )} />
      <div className="flex-1">
        <p className="text-sm">{content}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
