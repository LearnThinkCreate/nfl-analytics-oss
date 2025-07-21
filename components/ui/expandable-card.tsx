"use client"

import { ReactNode, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MoveDiagonal } from 'lucide-react'
import { useLargeScreen } from "@/lib/hooks/use-screen-size"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// Define a context type to pass to children
export type RenderContext = {
  isLargeScreen: boolean | null;
  isDialog: boolean;
  dialogOpen: boolean;
}

// Define a render function type
export type RenderFunction = (context: RenderContext) => React.ReactElement;

interface ExpandableCardProps {
  title: string;
  description?: string | ((context: RenderContext) => string | ReactNode);
  expandedTitle?: string;
  children: ReactNode | RenderFunction;
  dialogChildren?: ReactNode | RenderFunction;
  skeletonComponent: ReactNode;
  // isLoading?: boolean; // <-- Add isLoading prop
  dialogClassName?: string;
  cardClassName?: string;
  contentClassName?: string;
  isReducedOnLargeScreen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
}

export function ExpandableCard({
  title,
  description,
  expandedTitle,
  children,
  dialogChildren,
  skeletonComponent,
  // isLoading = false, // <-- Add isLoading prop with default
  dialogClassName,
  cardClassName,
  contentClassName,
  isReducedOnLargeScreen = true,
  onDialogOpenChange,
}: ExpandableCardProps) {
  // Get screen size (null during SSR)
  const isLargeScreen = useLargeScreen()

  const [dialogOpen, setDialogOpen] = useState(false)

  // Handle dialog open state changes
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (onDialogOpenChange) {
      onDialogOpenChange(open)
    }
  }

  const showExpandButton = isLargeScreen === true && isReducedOnLargeScreen

  // Create context objects for both main view and dialog
  const mainContext: RenderContext = {
    isLargeScreen,
    isDialog: false,
    dialogOpen
  }

  const dialogContext: RenderContext = {
    isLargeScreen,
    isDialog: true,
    dialogOpen
  }

  // Compute description based on context if it's a function
  const cardDescription = typeof description === 'function'
    ? description(mainContext)
    : description

  // Render children based on whether it's a function or ReactNode
  const renderChildren = (context: RenderContext, childrenToRender: ReactNode | RenderFunction) => {
    if (typeof childrenToRender === 'function') {
      // Ensure childrenToRender is only called if not showing skeleton
      return childrenToRender(context)
    }
    // Ensure childrenToRender is only rendered if not showing skeleton
    return childrenToRender
  }

  return (
    <Card className={cn("w-full flex flex-col relative", cardClassName)}>
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {/* Show description even if loading */}
        {
          cardDescription && (
            <CardDescription>{cardDescription}</CardDescription>
          )
        }
      </CardHeader>
      <CardContent className={cn("flex-grow flex flex-col", contentClassName)}>
            {/* Only show expand button if not showing skeleton */}
            {isLargeScreen === null ? (
              <div className="flex flex-col h-full">
                {skeletonComponent}
              </div>
            ) : (
              <>
                {showExpandButton && (
                  <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                    <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10">
                    <MoveDiagonal className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className={cn(
                  `
                        max-w-[90vw]
                        lg:max-w-[90vw] w-[90vw] h-[80vh]
                        overflow-hidden rounded-lg text-rendering-optimizespeed font-smooth-antialiased
                        tracking-tight subpixel-antialiased
                    `,
                  dialogClassName
                )}>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      {expandedTitle || title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 overflow-auto h-[calc(80vh-100px)] flex flex-col">
                    {/* Render dialog content */}
                    {renderChildren(dialogContext, dialogChildren || children)}
                  </div>
                </DialogContent>
              </Dialog>
              )}
              {/* Render main content */}
              {renderChildren(mainContext, children)}
            </>
          )}
      </CardContent>
    </Card>
  )
}