"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { LucideIcon, Info, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  previousValue?: string | number
  changePercent?: number
  icon: LucideIcon
  tooltip: string
  accentColor?: "blue" | "violet" | "emerald" | "amber"
  className?: string
}

const accentColors = {
  blue: {
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconText: "text-blue-600 dark:text-blue-400",
    valueBg: "from-blue-500/5 to-blue-600/5",
    border: "border-blue-500/20",
  },
  violet: {
    iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
    iconText: "text-violet-600 dark:text-violet-400",
    valueBg: "from-violet-500/5 to-violet-600/5",
    border: "border-violet-500/20",
  },
  emerald: {
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconText: "text-emerald-600 dark:text-emerald-400",
    valueBg: "from-emerald-500/5 to-emerald-600/5",
    border: "border-emerald-500/20",
  },
  amber: {
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconText: "text-amber-600 dark:text-amber-400",
    valueBg: "from-amber-500/5 to-amber-600/5",
    border: "border-amber-500/20",
  },
}

export function MetricCard({
  title,
  value,
  previousValue,
  changePercent,
  icon: Icon,
  tooltip,
  accentColor = "blue",
  className,
}: MetricCardProps) {
  const colors = accentColors[accentColor]
  
  const getTrendIcon = () => {
    if (changePercent === undefined || changePercent === 0) {
      return <Minus className="h-3 w-3" />
    }
    return changePercent > 0 
      ? <TrendingUp className="h-3 w-3" />
      : <TrendingDown className="h-3 w-3" />
  }

  const getTrendColor = () => {
    if (changePercent === undefined || changePercent === 0) {
      return "text-slate-500 bg-slate-100 dark:bg-slate-800"
    }
    return changePercent > 0
      ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30"
      : "text-red-600 bg-red-50 dark:bg-red-900/30"
  }

  return (
    <Card className={cn(
      "relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        colors.valueBg
      )} />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("rounded-xl p-2.5", colors.iconBg)}>
            <Icon className={cn("h-5 w-5", colors.iconText)} />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Info className="h-4 w-4 text-slate-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {value}
            </h3>
            {changePercent !== undefined && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                getTrendColor()
              )}>
                {getTrendIcon()}
                <span>{changePercent > 0 ? "+" : ""}{changePercent.toFixed(1)}%</span>
              </div>
            )}
          </div>
          {previousValue && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Önceki dönem: {previousValue}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
