"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { 
  Card, 
  CardContent, 
  // CardDescription, 
  // CardHeader, 
  // CardTitle, 
  // CardFooter 
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

interface ChartProps {
  data: any[];
  title?: string;
  description?: string;
  height?: number;
}

export function PositionBarChart({ data, title, description, height }: ChartProps) {
  // Create chart config dynamically from the data
  const chartConfig = data.reduce(
    (config, item) => {
      config[item.id] = {
        label: item.name,
        color: item.fill,
        icon: () => (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.teamColor }} />
            <span>{item.name}</span>
          </div>
        ),
      }
      return config
    },
    {} as Record<string, any>,
  )

  return (
    <Card className="w-full border-none">
      {/* {
        title || description ? (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        ) : null
      } */}
      <CardContent>
        <ChartContainer config={chartConfig} className={`w-full ${
          height ? 
          // `h-[500px]` 
          `h-[${height}px]` 
          : "h-[440px]"}`
          }>
          {/* <ResponsiveContainer> */}
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{
                left: 32,
                // right: 20,
                // top: 10,
                // bottom: 20,
              }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={50}
                tick={({ x, y, payload }) => {
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text x={-6} y={0} dy={4} textAnchor="end" className="text-foreground text-xs">
                        {payload.value}
                      </text>
                    </g>
                  )
                }}
              />
              <XAxis
                dataKey="value"
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toFixed(2)}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={16} textAnchor="middle" className="text-foreground text-xs">
                      {payload.value.toFixed(2)}
                    </text>
                  </g>
                )}
              />
              <ChartTooltip
                cursor={{ fill: "currentColor", fillOpacity: 0.1 }}
                content={({ payload }) => {
                  if (!payload || !payload.length) return null;

                  const data = payload[0].payload;
                  return (
                    <div className="bg-background p-3 rounded-md shadow-md border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.fill }} />
                        <span className="font-medium">{data.name} ({data.teamAbbr})</span>
                      </div>
                      <div className="space-y-1.5">
                        {Object.entries(data.tooltipData || {}).map(([key, value]) => (
                          <div key={key} className="flex justify-between gap-4">
                            <span className="text-xs text-muted-foreground">{key}:</span>
                            <span className="text-xs font-medium">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between gap-4 pt-1 mt-1 border-t border-border">
                          <span className="text-xs text-muted-foreground">value:</span>
                          <span className="text-xs font-semibold">{data.value.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="currentColor" fillOpacity={0.9} />
            </BarChart>
          {/* </ResponsiveContainer> */}
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">Showing EPA per QB Play for top NFL quarterbacks</div>
      </CardFooter> */}
    </Card>
  )
}

