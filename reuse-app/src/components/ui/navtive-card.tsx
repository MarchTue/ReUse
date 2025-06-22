import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface NativeCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  /**
   * Elevation style.
   * - "elevated": iOS-like shadow
   * - "flat": no shadow (default)
   */
  variant?: "elevated" | "flat";
  /**
   * Padding size inside the card.
   * - "none": no padding (useful for image thumbs)
   * - "sm" | "md" | "lg": Tailwind spacing tokens
   */
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * iOS-style card wrapper built on top of shadcn/ui Card.
 * Provides gentle rounded corners and optional elevation.
 */
export const NativeCard = React.forwardRef<React.ComponentRef<typeof Card>, NativeCardProps>(
  ({ className, children, variant = "flat", padding = "md", ...props }, ref) => {
    const paddingClass = padding === "none" ? "p-0" : padding === "sm" ? "p-2" : padding === "lg" ? "p-6" : "p-4"; // md

    return (
      <Card
        ref={ref}
        className={cn("rounded-[20px] bg-white border-0", variant === "elevated" && "shadow-ios-lg", className)}
        {...props}
      >
        {/* If the consumer already wraps children with CardContent we don't duplicate it */}
        {React.Children.toArray(children).some((child) => React.isValidElement(child) && child.type === CardContent) ? (
          children
        ) : (
          <CardContent className={paddingClass}>{children}</CardContent>
        )}
      </Card>
    );
  },
);
NativeCard.displayName = "NativeCard";
