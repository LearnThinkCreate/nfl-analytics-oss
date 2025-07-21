"use client";

import { Level, Position } from "@/types/filters";
import { PlayerStatsResult } from "@/types/graphs";
import { useMemo, useState } from "react";
import { getPlayerTableConfig } from "@/lib/constants/player";

import { NON_SORTABLE_COLUMNS } from "@/lib/constants/common";
import { SortDirection } from "@/types/filters";
import { FormattedTableValue, FormattedTableHeader, getColumns, getColumnWidth } from "./utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { TablePagination } from "./table-pagination";

interface PositionDataTableProps {
  data: PlayerStatsResult<Position, Level>[];
  isReduced?: boolean;
  className?: string;
  isDialog?: boolean;
}

export const PlayerSummaryTable = ({
  data,
  isReduced,
  className,
  isDialog,
}: PositionDataTableProps) => {
  const columnConfig = getPlayerTableConfig();

  // Derive columns from data and filter by those in our configuration
  const columns = useMemo(() => {
    return getColumns(data, columnConfig).filter(col => col !== 'season');
  }, [data]);

  // Get visible columns based on isReduced flag
  const visibleColumns = useMemo(() => {
    if (!isReduced) return columns;

    // Only show first 6 columns when in reduced mode
    return columns.slice(0, 6);
  }, [columns, isReduced]);

  const sortableColumns = useMemo(() => {
    return visibleColumns.filter((col) => !NON_SORTABLE_COLUMNS.includes(col));
  }, [visibleColumns]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string>("totalEpa");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Sort the data
  const sortedData = useMemo(() => {
    if (!sortColumn) return [...data];

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof PlayerStatsResult<Position, Level>];
      const bValue = b[sortColumn as keyof PlayerStatsResult<Position, Level>];

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // For numbers
      if (sortDirection === "asc") {
        return (aValue as unknown as number) - (bValue as unknown as number);
      } else {
        return (bValue as unknown as number) - (aValue as unknown as number);
      }
    });
  }, [data, sortColumn, sortDirection]);

  // Handle sorting
  const handleSort = (column: string) => {
    // Only allow sorting on sortable columns
    if (!sortableColumns.includes(column)) return;

    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to descending
      setSortColumn(column);
      setSortDirection("desc");
    }

    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = isReduced
    ? sortedData.slice(0, itemsPerPage)
    : sortedData.slice(startIndex, startIndex + itemsPerPage);

  const getAdjustedColumnWidth = (column: string): string | null => {
    if (isReduced) {
      return null; // Let the table auto-adjust when in reduced mode
    }
    return getColumnWidth(columnConfig[column].width);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-hidden flex flex-col">
        <div className="overflow-x-auto rounded-md flex-grow">
          {/* Apply responsive text sizing directly to the Table component */}
          <Table
            className={cn(
              "w-full border-collapse text-base @2xl/page:text-xs @3xl/page:text-sm @5xl/page:text-base",
              className
            )}
          >
            <TableHeader>
              <TableRow className="border-b [&:hover]:!bg-transparent">
                {visibleColumns.map((column) => (
                  <TableHead
                    key={column}
                    className={cn(
                      "whitespace-nowrap text-center p-2",
                      sortableColumns.includes(column) &&
                        "cursor-pointer hover:bg-muted/50",
                      getAdjustedColumnWidth(column)
                    )}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {FormattedTableHeader(
                        columnConfig[column].header,
                        isReduced ? "text-base" : "text-xs",
                        isDialog ? "lg:text-sm xl:text-base" : ""
                      )}

                      {/* Show sort indicator if this column is being sorted */}
                      {sortColumn === column && (
                        <div className="flex items-center">
                          {sortDirection === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow
                  key={`${row.playerId}-${(row as any).season}`}
                  className={cn("border-b", "[&:hover]:!bg-transparent")}
                >
                  {visibleColumns.map((column) => (
                    <TableCell
                      key={`${row.playerId}-${(row as any).season}-${column}`}
                      className={cn(
                        "text-center p-2 whitespace-nowrap",
                        getAdjustedColumnWidth(column)
                      )}
                    >
                      {column === "playerName" ? (
                        <Link href={`/player/${row.playerId}#top`} prefetch={false}>
                          {
                            row[
                              column as keyof PlayerStatsResult<Position, Level>
                            ]
                          }
                        </Link>
                      ) : (
                        FormattedTableValue(
                          column,
                          row[
                            column as keyof PlayerStatsResult<Position, Level>
                          ],
                          columnConfig
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {/* Add empty rows to maintain consistent height when fewer items are displayed */}
              {!isReduced &&
                paginatedData.length < itemsPerPage &&
                Array.from({ length: itemsPerPage - paginatedData.length }).map(
                  (_, index) => (
                    <TableRow
                      key={`empty-${index}`}
                      className={"[&:hover]:!bg-transparent"}
                    >
                      {visibleColumns.map((column) => (
                        <TableCell
                          key={`empty-${index}-${column}`}
                          className={cn("p-2", getAdjustedColumnWidth(column))}
                        >
                          &nbsp;
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </div>
      </div>
      {!isReduced && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
