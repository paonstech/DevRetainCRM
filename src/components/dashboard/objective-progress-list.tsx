"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown, 
  ChevronUp, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Trophy,
  Clock,
  Minus,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Hedef tipi ikonları
const objectiveTypeIcons: Record<string, string> = {
  AWARENESS: "📢",
  REACH: "🌐",
  ENGAGEMENT: "💬",
  VIDEO_VIEWS: "▶️",
  WEBSITE_TRAFFIC: "🔗",
  LEAD_GENERATION: "📋",
  APP_DOWNLOAD: "📱",
  SALES: "💰",
  SIGN_UP: "✍️",
  BRAND_SENTIMENT: "❤️",
  SOCIAL_FOLLOWERS: "👥",
  EMAIL_SUBSCRIBERS: "📧",
  CONTENT_CREATION: "🎬",
  EVENT_ATTENDANCE: "🎪",
  CUSTOM: "⚙️",
}

// Durum renkleri ve ikonları
const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ReactNode; label: string }> = {
  NOT_STARTED: { 
    color: "text-slate-500", 
    bgColor: "bg-slate-500", 
    icon: <Clock className="h-3 w-3" />,
    label: "Başlamadı"
  },
  IN_PROGRESS: { 
    color: "text-blue-500", 
    bgColor: "bg-blue-500", 
    icon: <TrendingUp className="h-3 w-3" />,
    label: "Devam Ediyor"
  },
  ON_TRACK: { 
    color: "text-green-500", 
    bgColor: "bg-green-500", 
    icon: <Target className="h-3 w-3" />,
    label: "Yolunda"
  },
  AT_RISK: { 
    color: "text-yellow-500", 
    bgColor: "bg-yellow-500", 
    icon: <AlertTriangle className="h-3 w-3" />,
    label: "Risk Altında"
  },
  BEHIND: { 
    color: "text-orange-500", 
    bgColor: "bg-orange-500", 
    icon: <Minus className="h-3 w-3" />,
    label: "Geride"
  },
  COMPLETED: { 
    color: "text-emerald-500", 
    bgColor: "bg-emerald-500", 
    icon: <CheckCircle2 className="h-3 w-3" />,
    label: "Tamamlandı"
  },
  EXCEEDED: { 
    color: "text-purple-500", 
    bgColor: "bg-purple-500", 
    icon: <Trophy className="h-3 w-3" />,
    label: "Hedef Aşıldı"
  },
}

type ObjectiveData = {
  id: string
  name: string
  type: string
  targetValue: number
  currentValue: number
  achievementRate: number
  normalizedRate: number
  weight: number
  status: string
  unit: string
  statusLabel: string
  typeLabel: string
  isOverAchieved: boolean
  overAchievementRate: number
}

type CampaignWithObjectives = {
  id: string
  name: string
  status: string
  rooScore: number
  rawRooScore: number
  objectives: ObjectiveData[]
}

type Props = {
  campaigns: CampaignWithObjectives[]
}

// Progress Bar Component
function ProgressBar({ 
  value, 
  max = 100, 
  status,
  isOverAchieved,
  showOverflow = true 
}: { 
  value: number
  max?: number
  status: string
  isOverAchieved?: boolean
  showOverflow?: boolean
}) {
  const percentage = Math.min((value / max) * 100, 100)
  const overflowPercentage = isOverAchieved && showOverflow ? Math.min(value - 100, 50) : 0
  const config = statusConfig[status] || statusConfig.IN_PROGRESS

  return (
    <div className="relative w-full">
      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        {/* Ana progress */}
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            config.bgColor
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Overflow indicator (hedef aşıldıysa) */}
      {isOverAchieved && showOverflow && (
        <div 
          className="absolute top-0 right-0 h-2.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-r-full opacity-80"
          style={{ 
            width: `${overflowPercentage}%`,
            transform: 'translateX(100%)',
            maxWidth: '30%'
          }}
        />
      )}
    </div>
  )
}

// Single Campaign Card
function CampaignObjectiveCard({ campaign }: { campaign: CampaignWithObjectives }) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  const completedCount = campaign.objectives.filter(
    o => o.status === 'COMPLETED' || o.status === 'EXCEEDED'
  ).length
  const atRiskCount = campaign.objectives.filter(
    o => o.status === 'AT_RISK' || o.status === 'BEHIND'
  ).length

  // ROO Score rengi
  const getRooScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 bg-emerald-500/10"
    if (score >= 75) return "text-green-600 bg-green-500/10"
    if (score >= 50) return "text-yellow-600 bg-yellow-500/10"
    if (score >= 25) return "text-orange-600 bg-orange-500/10"
    return "text-red-600 bg-red-500/10"
  }

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
      {/* Campaign Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm",
            getRooScoreColor(campaign.rooScore)
          )}>
            {campaign.rooScore.toFixed(0)}
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-slate-900 dark:text-white">{campaign.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">
                {campaign.objectives.length} hedef
              </span>
              {completedCount > 0 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                  ✓ {completedCount} tamamlandı
                </Badge>
              )}
              {atRiskCount > 0 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-orange-500/10 text-orange-600 border-orange-500/30">
                  ⚠ {atRiskCount} risk
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {campaign.rawRooScore > 100 && (
            <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30 text-xs">
              🎉 Over-achieved
            </Badge>
          )}
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Objectives List */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {campaign.objectives.map((objective) => {
            const config = statusConfig[objective.status] || statusConfig.IN_PROGRESS
            const icon = objectiveTypeIcons[objective.type] || "🎯"

            return (
              <div 
                key={objective.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">
                        {objective.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {objective.typeLabel} • Ağırlık: {objective.weight}x
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[10px] gap-1",
                      config.color
                    )}
                  >
                    {config.icon}
                    {objective.statusLabel}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">
                      {objective.currentValue.toLocaleString()} / {objective.targetValue.toLocaleString()} {objective.unit}
                    </span>
                    <span className={cn(
                      "font-semibold",
                      objective.isOverAchieved ? "text-purple-600" : config.color
                    )}>
                      {objective.achievementRate.toFixed(1)}%
                      {objective.isOverAchieved && (
                        <span className="text-purple-500 ml-1">
                          (+{objective.overAchievementRate.toFixed(0)}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <ProgressBar 
                    value={objective.achievementRate} 
                    status={objective.status}
                    isOverAchieved={objective.isOverAchieved}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function ObjectiveProgressList({ campaigns }: Props) {
  const [showAll, setShowAll] = useState(false)
  
  // Hedefi olan kampanyaları filtrele
  const campaignsWithObjectives = campaigns.filter(c => c.objectives.length > 0)
  const displayedCampaigns = showAll 
    ? campaignsWithObjectives 
    : campaignsWithObjectives.slice(0, 3)

  // Toplam istatistikler
  const totalObjectives = campaignsWithObjectives.reduce((sum, c) => sum + c.objectives.length, 0)
  const completedObjectives = campaignsWithObjectives.reduce(
    (sum, c) => sum + c.objectives.filter(o => o.status === 'COMPLETED' || o.status === 'EXCEEDED').length, 
    0
  )
  const atRiskObjectives = campaignsWithObjectives.reduce(
    (sum, c) => sum + c.objectives.filter(o => o.status === 'AT_RISK' || o.status === 'BEHIND').length, 
    0
  )
  const avgRooScore = campaignsWithObjectives.length > 0
    ? campaignsWithObjectives.reduce((sum, c) => sum + c.rooScore, 0) / campaignsWithObjectives.length
    : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </span>
              Kampanya Hedefleri (ROO)
            </CardTitle>
            <CardDescription className="mt-1">
              Tüm kampanyaların stratejik hedef ilerlemeleri
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
              {totalObjectives} Hedef
            </Badge>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              ✓ {completedObjectives}
            </Badge>
            {atRiskObjectives > 0 && (
              <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">
                ⚠ {atRiskObjectives}
              </Badge>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{campaignsWithObjectives.length}</p>
            <p className="text-xs text-muted-foreground">Kampanya</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="text-2xl font-bold text-blue-600">{avgRooScore.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Ort. ROO</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-emerald-500/10">
            <p className="text-2xl font-bold text-emerald-600">{completedObjectives}</p>
            <p className="text-xs text-muted-foreground">Tamamlanan</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-orange-500/10">
            <p className="text-2xl font-bold text-orange-600">{atRiskObjectives}</p>
            <p className="text-xs text-muted-foreground">Risk Altında</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {displayedCampaigns.map((campaign) => (
          <CampaignObjectiveCard key={campaign.id} campaign={campaign} />
        ))}

        {campaignsWithObjectives.length > 3 && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Daha Az Göster
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Tümünü Göster ({campaignsWithObjectives.length - 3} daha)
              </>
            )}
          </Button>
        )}

        {campaignsWithObjectives.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Henüz hedef tanımlanmış kampanya yok.</p>
            <p className="text-sm mt-1">Kampanyalarınıza hedefler ekleyerek ROO skorlarını takip edin.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
