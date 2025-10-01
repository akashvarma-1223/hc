import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

function Popover({ open, onOpenChange, ...props }) {
  return <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange} {...props} />;
}

function PopoverTrigger({ ...props }) {
  return <PopoverPrimitive.Trigger {...props} />;
}

function PopoverContent({ className, align = "center", sideOffset = 4, side = "bottom", ...props }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 rounded-md border bg-white p-4 shadow-md outline-none",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({ ...props }) {
  return <PopoverPrimitive.Anchor {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
