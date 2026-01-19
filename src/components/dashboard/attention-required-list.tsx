"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  ArrowRight,
  Calendar,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AttentionItem {
  id: string
  name: string
  type: "low_roi" | "ending_soon" | "behind_target" | "no_activity"
  severity: "high" | "medium" | "low"
  metric?: string
  metricValue?: string
  dueDate?: string
  daysRemaining?: number
}

interface AttentionRequiredListProps {
  items: AttentionItem[]
  className?: string
}

const typeConfig = {
  low_roi: {
    icon: TrendingDown,
    label: "Düşük ROI",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
  },
  ending_soon: {
    icon: Clock,
    label: "Yaklaşan Bitiş",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
  },
  behind_target: {
    icon: Target,
    label: "Hedef Gerisinde",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
  },
  no_activity: {
    icon: Calendar,
    label: "Aktivite Yok",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-800",
    border: "border-slate-200 dark:border-slate-700",
  },
}

const severityBadge = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
}

export function AttentionRequiredList({ items, className }: AttentionRequiredListProps) {
  if (items.length === 0) {
    return (
      <Card className={cn("border-0 shadow-sm", className)}>
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
            <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            Tebrikler! 🎉
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Şu anda dikkat gerektiren kampanya yok.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Dikkat Gerektiren Kampanyalar
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {items.length} kampanya incelemenizi bekliyor
              </p>
            </div>
          </div>
          <Badge variant="outline" className={severityBadge.high}>
            {items.filter(i => i.severity === "high").length} Kritik
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {items.slice(0, 5).map((item) => {
            const config = typeConfig[item.type]
            const Icon = config.icon
            
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
                  config.border,
                  config.bg
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", config.bg)}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {config.label}
                      </Badge>
                      {item.metric && item.metricValue && (
                        <span className="text-xs text-slate-500">
                          {item.metric}: <span className={config.color}>{item.metricValue}</span>
                        </span>
                      )}
                      {item.daysRemaining !== undefined && (
                        <span className="text-xs text-slate-500">
                          {item.daysRemaining} gün kaldı
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
        
        {items.length > 5 && (
          <Button variant="ghost" className="w-full mt-3 text-sm">
            Tümünü Gör ({items.length})
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
