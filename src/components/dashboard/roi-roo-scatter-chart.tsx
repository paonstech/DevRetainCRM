"use client"

import { useMemo } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ZAxis,
  Cell,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type CampaignDataPoint = {
  id: string
  name: string
  roi: number
  rooScore: number
  budgetTotal: number
  status: string
  objectiveCount: number
}

type Props = {
  data: CampaignDataPoint[]
}

// Quadrant kategorileri
const getQuadrant = (roi: number, roo: number): {
  label: string
  color: string
  description: string
} => {
  const roiThreshold = 100 // %100 ROI
  const rooThreshold = 75  // 75 ROO Score

  if (roi >= roiThreshold && roo >= rooThreshold) {
    return {
      label: "Yıldız Kampanya",
      color: "#10b981", // emerald
      description: "Hem finansal hem stratejik başarı"
    }
  } else if (roi >= roiThreshold && roo < rooThreshold) {
    return {
      label: "Sadece Para",
      color: "#f59e0b", // amber
      description: "Finansal başarı, stratejik hedefler geride"
    }
  } else if (roi < roiThreshold && roo >= rooThreshold) {
    return {
      label: "Stratejik Değer",
      color: "#3b82f6", // blue
      description: "Stratejik hedefler başarılı, finansal getiri düşük"
    }
  } else {
    return {
      label: "İyileştirme Gerekli",
      color: "#ef4444", // red
      description: "Hem finansal hem stratejik iyileştirme gerekli"
    }
  }
}

// Custom Tooltip
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: CampaignDataPoint }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const quadrant = getQuadrant(data.roi, data.rooScore)

    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 min-w-[220px]">
        <p className="font-semibold text-slate-900 dark:text-white mb-2">{data.name}</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ROI:</span>
            <span className="font-medium text-emerald-600">%{data.roi.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ROO Score:</span>
            <span className="font-medium text-blue-600">{data.rooScore.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hedef Sayısı:</span>
            <span className="font-medium">{data.objectiveCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bütçe:</span>
            <span className="font-medium">₺{(data.budgetTotal / 1000).toFixed(0)}K</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          <Badge 
            variant="outline" 
            className="w-full justify-center"
            style={{ borderColor: quadrant.color, color: quadrant.color }}
          >
            {quadrant.label}
          </Badge>
          <p className="text-xs text-muted-foreground mt-1 text-center">{quadrant.description}</p>
        </div>
      </div>
    )
  }
  return null
}

export function ROIROOScatterChart({ data }: Props) {
  // Quadrant dağılımı hesapla
  const quadrantStats = useMemo(() => {
    const stats = {
      star: 0,
      moneyOnly: 0,
      strategic: 0,
      needsWork: 0,
    }

    data.forEach(d => {
      const q = getQuadrant(d.roi, d.rooScore)
      if (q.label === "Yıldız Kampanya") stats.star++
      else if (q.label === "Sadece Para") stats.moneyOnly++
      else if (q.label === "Stratejik Değer") stats.strategic++
      else stats.needsWork++
    })

    return stats
  }, [data])

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              Kampanya Performans Matrisi
            </CardTitle>
            <CardDescription className="mt-1">
              ROI (Finansal Getiri) vs ROO (Stratejik Hedefler) karşılaştırması
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              ⭐ {quadrantStats.star} Yıldız
            </Badge>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
              💰 {quadrantStats.moneyOnly} Para
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
              🎯 {quadrantStats.strategic} Strateji
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              
              {/* X Ekseni - ROI */}
              <XAxis 
                type="number" 
                dataKey="roi" 
                name="ROI"
                unit="%"
                domain={[0, 'dataMax + 20']}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                label={{ 
                  value: 'ROI (Finansal Getiri %)', 
                  position: 'bottom', 
                  offset: 0,
                  style: { fontSize: 12, fill: '#64748b' }
                }}
              />
              
              {/* Y Ekseni - ROO */}
              <YAxis 
                type="number" 
                dataKey="rooScore" 
                name="ROO Score"
                domain={[0, 120]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                label={{ 
                  value: 'ROO Score (Stratejik Hedefler)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 12, fill: '#64748b' }
                }}
              />
              
              {/* Z Ekseni - Bütçe (bubble size) */}
              <ZAxis 
                type="number" 
                dataKey="budgetTotal" 
                range={[100, 1000]} 
                name="Bütçe"
              />
              
              {/* Reference Lines - Quadrant ayırıcılar */}
              <ReferenceLine 
                x={100} 
                stroke="#94a3b8" 
                strokeDasharray="5 5"
                label={{ 
                  value: 'ROI %100', 
                  position: 'top',
                  style: { fontSize: 10, fill: '#94a3b8' }
                }}
              />
              <ReferenceLine 
                y={75} 
                stroke="#94a3b8" 
                strokeDasharray="5 5"
                label={{ 
                  value: 'ROO 75', 
                  position: 'right',
                  style: { fontSize: 10, fill: '#94a3b8' }
                }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
              />
              
              <Scatter 
                name="Kampanyalar" 
                data={data} 
                fill="#8884d8"
              >
                {data.map((entry, index) => {
                  const quadrant = getQuadrant(entry.roi, entry.rooScore)
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={quadrant.color}
                      fillOpacity={0.7}
                      stroke={quadrant.color}
                      strokeWidth={2}
                    />
                  )
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Quadrant Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <div>
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Yıldız Kampanya</p>
              <p className="text-[10px] text-muted-foreground">ROI ≥100%, ROO ≥75</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <div>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Sadece Para</p>
              <p className="text-[10px] text-muted-foreground">ROI ≥100%, ROO &lt;75</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <div>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Stratejik Değer</p>
              <p className="text-[10px] text-muted-foreground">ROI &lt;100%, ROO ≥75</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/20">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div>
              <p className="text-xs font-medium text-red-700 dark:text-red-400">İyileştirme Gerekli</p>
              <p className="text-[10px] text-muted-foreground">ROI &lt;100%, ROO &lt;75</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
