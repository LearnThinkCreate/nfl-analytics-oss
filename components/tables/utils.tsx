import Image from "next/image";
import { formatters, cn } from "@/lib/utils";
import { Level, Position } from "@/types/filters";
import { PlayerStatsResult } from "@/types/graphs";
import { ColumnWidth } from "@/types/dashboard";


export const FormattedTableValue = (
  column: string,
  value: string | number | null,
  columnConfig: any
) => {
  // Special case for team logo
  if (column === "logo") {
    return (
      <div className="flex justify-center">
        <Image
          src={(value as string) || "/placeholder.svg"}
          alt="Team Logo"
          width={24}
          height={24}
          className="rounded-sm"
        />
      </div>
    );
  }

  // Use custom formatter from column config if available
  if (columnConfig[column].format) {
    return columnConfig[column].format(value);
  }

  // Default formatting for numbers (integers stay as is, floats get 1 decimal place)
  if (typeof value === "number" && !Number.isInteger(value)) {
    return formatters.decimal(value);
  }

  // Default case - return value as is
  return value;
};

export const FormattedTableHeader = (header: string, ...classes: string[]) => {
  return (
    <div className="flex flex-col">
    {/* Split the column name by spaces and join with line breaks */}
    {header
      .split(" ")
      .map((word, i) => (
        <span
          key={i}
          className={cn(
            "block",
            ...classes
          )}
        >
          {word}
        </span>
      ))}
  </div>
  )
};

export const getColumns = (data: PlayerStatsResult<Position, Level>[], columnConfig: any) => {
  if (!data.length) return [];

  const dataColumns = Object.keys(data[0]);

  return dataColumns.filter((column) => column in columnConfig);
};

export function getColumnWidth(width: ColumnWidth): string {
  switch (width) {
      case "extraSmall":
          return "w-12" // ~48px
      case "small":
          return "w-16" // ~64px
      case "medium":
          return "w-20" // ~80px
      case "large":
          return "w-24" // ~96px
      case "extraLarge":
          return "w-32" // ~128px
      default:
          return "w-auto"
  }
}