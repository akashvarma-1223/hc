import React from 'react';
import { cva} from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const actionCardVariants = cva(
  "p-6 rounded-xl shadow-card glass card-hover h-full animate-fade-up",
  {
    variants: {
      variant: {
        complaint: "border-b-4 border-b-purple-500 shadow-[0_4px_10px_rgba(128,0,128,0.5)]",
        lost: "border-b-4 border-b-blue-500 shadow-[0_4px_10px_rgba(0,0,255,0.5)]",
        entry: "border-b-4 border-b-green-500 shadow-[0_4px_10px_rgba(0,128,0,0.5)]",
        announcement: "border-b-4 border-b-yellow-500 shadow-[0_4px_10px_rgba(255,215,0,0.5)]",
      },
    },
    defaultVariants: {
      variant: "complaint",
    },
  }
);


const ActionCard = ({
  title,
  description,
  icon,
  variant,
  onAction,
  onSecondaryAction,
  secondaryButtonText,
  className,
  animationDelay,
}) => {
  return (
    <div className={cn(actionCardVariants({ variant }), className, animationDelay)}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn(
            "p-2.5 rounded-lg", 
            variant === 'complaint' && "text-complaint bg-purple-300",
            variant === 'lost' && "text-lost bg-blue-300",
            variant === 'entry' && "text-entry bg-green-300",
            variant === 'announcement' && "text-announcement bg-yellow-300 "
          )}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <div className="mt-auto flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs font-medium flex items-center gap-1 hover:bg-transparent hover:underline transition-all px-0"
            onClick={onAction}
          >
            <span>View All</span>
            <ArrowRight size={12} />
          </Button>
          
          {secondaryButtonText && onSecondaryAction && (
            <Button 
              variant="default" 
              size="sm" 
              className={cn(
                "text-xs font-medium shadow-md",
                variant === 'complaint' && "bg-complaint hover:bg-complaint-dark",
                variant === 'lost' && "bg-lost hover:bg-lost-dark",
                variant === 'entry' && "bg-entry hover:bg-entry-dark",
                variant === 'announcement' && "bg-announcement hover:bg-announcement-dark",
              )}
              onClick={onSecondaryAction}
            >
              {secondaryButtonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
