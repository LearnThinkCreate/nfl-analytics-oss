import type * as React from "react"
import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaginationLink } from "@/components/ui/pagination"

function PaginationFirst({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to first page" size="icon" className={cn("", className)} {...props}>
      <ChevronsLeftIcon className="h-4 w-4" />
      <span className="sr-only">First page</span>
    </PaginationLink>
  )
}

function PaginationLast({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to last page" size="icon" className={cn("", className)} {...props}>
      <ChevronsRightIcon className="h-4 w-4" />
      <span className="sr-only">Last page</span>
    </PaginationLink>
  )
}

export { PaginationFirst, PaginationLast }
