"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { type RFMDistribution } from "@/lib/mock-analytics"

const PieChart = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  { ssr: false }
)
const Pie = dynamic(
  () => import("recharts").then((mod) => mod.Pie),
  { ssr: false }
)
const Cell = dynamic(
  () => import("recharts").then((mod) => mod.Cell),
  { ssr: false }
)
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
)
const Tooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false }
)

interface RFMDistributionChartProps {
  data: RFMDistribution[]
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <p className="font-medium">{data.label}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {data.count} sponsor ({data.percentage}%)
        </div>
      </div>
    )
  }
  return null
}

export function RFMDistributionChart({ data }: RFMDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">RFM Segmentasyonu</CardTitle>
        <CardDescription>
          Sponsorların RFM analizi dağılımı
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item) => (
            <div key={item.segment} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground truncate">
                {item.label}
              </span>
              <span className="text-xs font-medium ml-auto">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
