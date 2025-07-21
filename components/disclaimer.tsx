import React from "react";
import { cn } from "@/lib/utils";

interface DisclaimerProps extends React.HTMLAttributes<HTMLParagraphElement> {
  qualifier: string;
}

export function Disclaimer({ qualifier, className, ...props }: DisclaimerProps) {
  return (
    <p
      className={cn(
        "absolute left-0 top-0 w-full px-2 py-1 text-center text-xs text-muted-foreground md:w-auto md:text-left",
        className
      )}
      {...props}
    >
      {qualifier}
    </p>
  );
}