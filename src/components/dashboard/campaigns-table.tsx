"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Campaign {
  id: string
  name: string
  status: string
  type: string
  budgetTotal: number
  budgetSpent: number
  budgetUtilization: number
  roi: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  startDate: Date
  endDate: Date
}

interface CampaignsTableProps {
  campaigns: Campaign[]
}

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  DRAFT: { label: "Taslak", variant: "secondary" },
  PENDING_APPROVAL: { label: "Onay Bekliyor", variant: "warning" },
  ACTIVE: { label: "Aktif", variant: "success" },
  PAUSED: { label: "Duraklatıldı", variant: "warning" },
  COMPLETED: { label: "Tamamlandı", variant: "info" },
  CANCELLED: { label: "İptal Edildi", variant: "destructive" },
}

const TYPE_LABELS: Record<string, string> = {
  BRAND_AWARENESS: "Marka Bilinirliği",
  PRODUCT_LAUNCH: "Ürün Lansmanı",
  EVENT_SPONSORSHIP: "Etkinlik",
  CONTENT_SPONSORSHIP: "İçerik",
  AFFILIATE: "Affiliate",
  INFLUENCER: "Influencer",
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value)
}

const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">Kampanya Performansı</CardTitle>
        <CardDescription>
          Tüm kampanyaların durumu ve performans metrikleri
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kampanya</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Tür</TableHead>
              <TableHead className="text-right">Bütçe</TableHead>
              <TableHead className="text-right">Kullanım</TableHead>
              <TableHead className="text-right">ROI</TableHead>
              <TableHead className="text-right">Gösterim</TableHead>
              <TableHead className="text-right">Tıklama</TableHead>
              <TableHead className="text-right">CTR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => {
              const statusConfig = STATUS_CONFIG[campaign.status] || { label: campaign.status, variant: "outline" as const }
              
              return (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {campaign.startDate.toLocaleDateString("tr-TR")} - {campaign.endDate.toLocaleDateString("tr-TR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig.variant}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {TYPE_LABELS[campaign.type] || campaign.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">{formatCurrency(campaign.budgetTotal)}</div>
                    <div className="text-xs text-muted-foreground">
                      Harcanan: {formatCurrency(campaign.budgetSpent)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            campaign.budgetUtilization >= 80
                              ? "bg-emerald-500"
                              : campaign.budgetUtilization >= 50
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          )}
                          style={{ width: `${Math.min(campaign.budgetUtilization, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm w-10 text-right">{campaign.budgetUtilization}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "font-medium",
                        campaign.roi >= 100
                          ? "text-emerald-500"
                          : campaign.roi >= 0
                          ? "text-amber-500"
                          : "text-red-500"
                      )}
                    >
                      {campaign.roi > 0 ? "+" : ""}{campaign.roi.toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatNumber(campaign.impressions)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatNumber(campaign.clicks)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "font-medium",
                        campaign.ctr >= 3
                          ? "text-emerald-500"
                          : campaign.ctr >= 1
                          ? "text-amber-500"
                          : "text-muted-foreground"
                      )}
                    >
                      {campaign.ctr.toFixed(2)}%
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
