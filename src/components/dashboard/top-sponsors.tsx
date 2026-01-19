"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TopSponsor {
  id: string
  companyName: string
  industry: string | null
  tier: string
  totalValue: number
  rfmSegment: string
  rfmLabel: string
}

interface TopSponsorsProps {
  sponsors: TopSponsor[]
}

const TIER_CONFIG: Record<string, { label: string; className: string }> = {
  DIAMOND: { label: "Diamond", className: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  PLATINUM: { label: "Platinum", className: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  GOLD: { label: "Gold", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  SILVER: { label: "Silver", className: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
  BRONZE: { label: "Bronze", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
}

const RFM_COLORS: Record<string, string> = {
  CHAMPIONS: "text-emerald-500",
  LOYAL_CUSTOMERS: "text-green-500",
  POTENTIAL_LOYALIST: "text-lime-500",
  NEW_CUSTOMERS: "text-cyan-500",
  PROMISING: "text-blue-500",
  NEED_ATTENTION: "text-amber-500",
  ABOUT_TO_SLEEP: "text-orange-500",
  AT_RISK: "text-red-500",
  CANT_LOSE_THEM: "text-red-600",
  HIBERNATING: "text-gray-500",
  LOST: "text-gray-600",
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value)
}

export function TopSponsors({ sponsors }: TopSponsorsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">En Değerli Sponsorlar</CardTitle>
        <CardDescription>
          Toplam katkıya göre sıralanmış sponsorlar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sponsors.map((sponsor, index) => {
            const tierConfig = TIER_CONFIG[sponsor.tier] || { label: sponsor.tier, className: "" }
            
            return (
              <div
                key={sponsor.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{sponsor.companyName}</h4>
                    <Badge variant="outline" className={cn("text-xs", tierConfig.className)}>
                      {tierConfig.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {sponsor.industry || "Sektör belirtilmemiş"}
                    </span>
                    <span className="text-xs">•</span>
                    <span className={cn("text-xs font-medium", RFM_COLORS[sponsor.rfmSegment] || "text-muted-foreground")}>
                      {sponsor.rfmLabel}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(sponsor.totalValue)}</div>
                  <div className="text-xs text-muted-foreground">toplam katkı</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
