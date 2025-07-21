"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export default function TableSkeleton() {
  // Pre-compute rows to avoid mapping during render
  const rows = Array.from({ length: 10 }); // Reduced from 10 to 7 for faster loading

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto rounded-md h-full flex-grow">
        <Table className="w-full border-collapse min-h-[450px]">
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="p-3 pl-4"><Skeleton className="h-6 w-16" /></TableHead>
              <TableHead className="p-3"><Skeleton className="h-6 w-12 mx-auto" /></TableHead>
              <TableHead className="p-3"><Skeleton className="h-6 w-14 mx-auto" /></TableHead>
              <TableHead className="p-3"><Skeleton className="h-6 w-16 mx-auto" /></TableHead>
              <TableHead className="p-3"><Skeleton className="h-6 w-20 mx-auto" /></TableHead>
              <TableHead className="p-3 pr-4"><Skeleton className="h-6 w-16 mx-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((_, rowIndex) => (
              <TableRow
                key={`skeleton-row-${rowIndex}`}
                className={rowIndex % 2 === 0 ? "bg-muted/10" : ""}
              >
                <TableCell className="p-3 pl-4"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="p-3"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                <TableCell className="p-3"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="p-3"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                <TableCell className="p-3"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="p-3 pr-4"><Skeleton className="h-4 w-14 mx-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 