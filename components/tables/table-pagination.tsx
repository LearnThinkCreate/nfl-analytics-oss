import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PaginationFirst, PaginationLast } from "@/components/ui/pagination-first-last"
import { cn } from "@/lib/utils"

interface TablePaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
  className?: string
}

export function TablePagination({
  totalPages,
  currentPage,
  onPageChange,
  maxVisiblePages = 5,
  className,
}: TablePaginationProps) {

  if (totalPages <= 1) return null

  const getVisiblePageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const halfVisible = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(currentPage - halfVisible, 1)
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages)

    if (endPage === totalPages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1)
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
  }

  const visiblePageNumbers = getVisiblePageNumbers()
  const showStartEllipsis = visiblePageNumbers[0] > 1
  const showEndEllipsis = visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages

  return (
    <div className={cn("flex-shrink-0 mt-4", className)}>
      <Pagination>
        <PaginationContent className="">
          {/* First page button */}
          <PaginationItem className="hidden sm:inline-block">
            <PaginationFirst
              onClick={() => onPageChange(1)}
              className={cn(currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer")}
            />
          </PaginationItem>

          {/* Previous page button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={cn(currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer")}
            />
          </PaginationItem>

          {/* Start ellipsis */}
          {showStartEllipsis && (
            <PaginationItem className="hidden sm:inline-block">
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Page numbers */}
          {visiblePageNumbers.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={page === currentPage}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* End ellipsis */}
          {showEndEllipsis && (
            <PaginationItem className="hidden sm:inline-block">
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Next page button */}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={cn(currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer")}
            />
          </PaginationItem>

          {/* Last page button */}
          <PaginationItem className="hidden sm:inline-block">
            <PaginationLast
              onClick={() => onPageChange(totalPages)}
              className={cn(currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}