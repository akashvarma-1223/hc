
import React from 'react';
import { cn } from '@/lib/utils';
import Badge from './Badge';


const Card= ({
  title,
  description,
  icon,
  iconBgColor,
  notifications = 0,
  onClick,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative bg-white rounded-xl p-6 shadow-sm card-hover cursor-pointer animate-fade-in ",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-start gap-4">
        <div className={cn("icon-bg relative", iconBgColor)}>
          {icon}
          <Badge count={notifications} />
        </div>
        <div className="flex flex-col text-left">
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
