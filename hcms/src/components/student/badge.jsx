
import React from 'react';
import { cn } from '@/lib/utils';


const Badge = ({ count, className, ...props }) => {
  if (count <= 0) return null;
  
  return (
    <span 
      className={cn(
        "absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full animate-scale-up", 
        className
      )} 
      {...props}
    >
      {count}
    </span>
  );
};

export default Badge;
