import { Level, Position } from "@/types/filters";
import { PlayerStatsResult } from "@/types/graphs";
import { getPlayerTableConfig } from "@/lib/constants/player";

import { FormattedTableValue, FormattedTableHeader, getColumns, getColumnWidth } from "./utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PlayerBioTableProps {
  data: PlayerStatsResult<Position, Level>[];
  className?: string;
  isDialog?: boolean;
  level: Level;
}

export const PlayerBioTable = ({
  data,
  className,
  isDialog,
  level,
}: PlayerBioTableProps) => {
  const columnConfig = getPlayerTableConfig();
  const columns = getColumns(data, columnConfig).filter(col => col !== 'playerName');
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-hidden flex flex-col">
        <div className="overflow-x-auto rounded-md flex-grow">
          {/* Apply responsive text sizing directly to the Table component */}
          <Table
            className={cn(
              "w-full border-collapse text-base sm:text-xs md:text-sm lg:text-base",
              className
            )}
          >
            <TableHeader>
              <TableRow className="border-b [&:hover]:!bg-transparent">
                {columns.map((column) => (
                  <TableHead
                    key={column}
                    className={cn(
                      "whitespace-nowrap text-center p-2",
                      getColumnWidth(columnConfig[column].width)
                    )}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {column === 'logo' && level === 'game'
                      ? (
                        <div>Opponent</div>
                      )
                      : (
                        FormattedTableHeader(columnConfig[column].header, isDialog ? "lg:text-sm xl:text-base" : "")
                      )
                    }
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={level === "season" ? (row as any).season : (row as any).gameId}
                  className={cn("border-b", "[&:hover]:!bg-transparent")}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${level === "season" ? (row as any).season : (row as any).gameId}-${column}`}
                      className={cn(
                        "text-center p-2 whitespace-nowrap",
                        getColumnWidth(columnConfig[column].width)
                      )}
                    >
                      {
                        column === 'logo' && level === 'game' ? (
                          <div className="flex items-center justify-center gap-1 text-xs">
                            <Image src={(row as any).logo} alt="Team Logo" width={24} height={24} /> {
                              (row as any).homeAway === 'away' ? '@' : 'vs.'
                            }
                            <Image src={(row as any).opponentLogo} alt="Opponent Logo" width={24} height={24} />
                          </div>
                        ) : (
                          FormattedTableValue(column, row[column as keyof PlayerStatsResult<Position, Level>], columnConfig)
                        )
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};