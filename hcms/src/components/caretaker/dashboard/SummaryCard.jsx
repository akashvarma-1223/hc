import React from 'react';
import { cva} from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "p-6 rounded-xl shadow-card glass card-hover transition-all duration-300 animate-fade-up",
  {
    variants: {
      variant: {
        complaint: "border-l-4 border-l-purple-500 bg-purple-100",
        lost: "border-l-4 border-l-blue-500 bg-blue-100",
        entry: "border-l-4 border-l-green-500 bg-green-100",
        announcement: "border-l-4 border-l-yellow-500 bg-yellow-100",
      },
    },
    defaultVariants: {
      variant: "complaint",
    },
  }
);



const SummaryCard = ({
  title,
  count,
  icon,
  variant,
  className,
  animationDelay,
}) => {
  return (
    <div className={cn(cardVariants({ variant }), className, animationDelay)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-1">{count}</h3>
        </div>
        <div className={cn(
  "p-2 rounded-lg",
  {
    "text-complaint bg-purple-500/10": variant === "complaint",
    "text-lost bg-blue-500/10": variant === "lost",
    "text-entry bg-green-500/10": variant === "entry",
    "text-announcement bg-yellow-500/10": variant === "announcement",
  }
)}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
