"use client"

import dynamic from "next/dynamic"
import { type MonthlyTrend } from "@/lib/mock-analytics"

const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false }
)
const Line = dynamic(
  () => import("recharts").then((mod) => mod.Line),
  { ssr: false }
)
const XAxis = dynamic(
  () => import("recharts").then((mod) => mod.XAxis),
  { ssr: false }
)
const YAxis = dynamic(
  () => import("recharts").then((mod) => mod.YAxis),
  { ssr: false }
)
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false }
)
const Tooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false }
)
const Legend = dynamic(
  () => import("recharts").then((mod) => mod.Legend),
  { ssr: false }
)
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
)

interface RevenueChartProps {
  data: MonthlyTrend[]
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `₺${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `₺${(value / 1000).toFixed(0)}K`
  }
  return `₺${value}`
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-lg">
        <p className="font-medium text-slate-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
                maximumFractionDigits: 0,
              }).format(entry.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          {/* Minimalist grid - very light, horizontal only */}
          <CartesianGrid 
            strokeDasharray="0" 
            stroke="#e2e8f0" 
            strokeOpacity={0.5}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatCurrency}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px' }}
          />
          {/* Blue palette for financial data */}
          <Line
            type="monotone"
            dataKey="revenue"
            name="Gelir"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Gider"
            stroke="#94a3b8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#94a3b8', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="net"
            name="Net Kar"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
