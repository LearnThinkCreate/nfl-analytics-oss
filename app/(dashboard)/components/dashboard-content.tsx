import { PositionBarChartWrapper } from "@/components/graphs/position-bar-chart-wrapper";
import { PositionTableWrapper } from "@/components/tables/position-table-szn-wrapper";
import PositionLeaderCards from "@/components/graphs/position-leader-cards";
import { Level } from "@/types/filters";
import { DashoardData } from "@/data/index";

function DashboardContent({
  data,
  level,
  params,
  searchParams,
}: {
  data: DashoardData;
  level: Level;
  params: Promise<{ position: string }>;
  searchParams?: Promise<{ season: string }>;
}) {
  return (
    <>
      <PositionLeaderCards stats={data.cardData} />

      <div className="@5xl/page:grid-cols-2 grid grid-cols-1 gap-6">
        <div className="flex">
          <PositionTableWrapper tableData={data.tableData} params={params} />
        </div>

        <div className="flex">
          <PositionBarChartWrapper
            level={level}
            params={params}
            searchParams={searchParams}
          />
        </div>
      </div>
    </>
  );
}

export default DashboardContent;
