"use client"

import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  DollarSign,
  Award,
  BarChart3,
  PieChart,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  type ReportData,
  formatCurrency,
  formatNumber,
  formatDate,
  formatPercent,
} from "@/lib/report-generator"

interface ReportPreviewProps {
  data: ReportData
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Taslak",
  PENDING_APPROVAL: "Onay Bekliyor",
  ACTIVE: "Aktif",
  PAUSED: "Duraklatıldı",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal Edildi",
}

const TYPE_LABELS: Record<string, string> = {
  BRAND_AWARENESS: "Marka Bilinirliği",
  PRODUCT_LAUNCH: "Ürün Lansmanı",
  EVENT_SPONSORSHIP: "Etkinlik",
  CONTENT_SPONSORSHIP: "İçerik",
  AFFILIATE: "Affiliate",
  INFLUENCER: "Influencer",
}

const TIER_LABELS: Record<string, string> = {
  DIAMOND: "Diamond",
  PLATINUM: "Platinum",
  GOLD: "Gold",
  SILVER: "Silver",
  BRONZE: "Bronze",
}

const RFM_LABELS: Record<string, string> = {
  CHAMPIONS: "Şampiyonlar",
  LOYAL_CUSTOMERS: "Sadık Müşteriler",
  POTENTIAL_LOYALIST: "Potansiyel Sadıklar",
  NEW_CUSTOMERS: "Yeni Müşteriler",
  PROMISING: "Umut Vaat Edenler",
  NEED_ATTENTION: "İlgi Gerektirenler",
  ABOUT_TO_SLEEP: "Uykuya Dalanlar",
  AT_RISK: "Risk Altındakiler",
  CANT_LOSE_THEM: "Kaybetmemeliyiz",
  HIBERNATING: "Kış Uykusundakiler",
  LOST: "Kayıp Müşteriler",
}

const PERFORMANCE_COLORS: Record<string, string> = {
  EXCELLENT: "bg-emerald-100 text-emerald-800 border-emerald-300",
  GOOD: "bg-green-100 text-green-800 border-green-300",
  AVERAGE: "bg-yellow-100 text-yellow-800 border-yellow-300",
  AT_RISK: "bg-orange-100 text-orange-800 border-orange-300",
  POOR: "bg-red-100 text-red-800 border-red-300",
}

const GAIN_TYPE_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  exceeded: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
  achievement: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  improvement: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  milestone: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  risk: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
}

export function ReportPreview({ data }: ReportPreviewProps) {
  return (
    <div id="report-content" className="bg-white p-8 space-y-8 min-w-[800px]">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Sponsorluk Performans Raporu
            </h1>
            <p className="text-lg text-slate-600 mt-1">
              {data.organizationName}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-blue-700">DevRetain CRM</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm text-slate-500">
          <span>
            <strong>Rapor Tarihi:</strong> {formatDate(data.generatedAt)}
          </span>
          <span>
            <strong>Dönem:</strong> {formatDate(data.dateRange.startDate)} - {formatDate(data.dateRange.endDate)}
          </span>
        </div>
      </div>

      {/* Executive Summary */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Yönetici Özeti
        </h2>
        <div className="grid grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-700">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-emerald-900">
                    {formatCurrency(data.highlights.totalRevenue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Toplam Gider</p>
                  <p className="text-2xl font-bold text-red-900">
                    {formatCurrency(data.highlights.totalExpenses)}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Net Kar</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(data.highlights.netProfit)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-violet-700">Ortalama ROI</p>
                  <p className="text-2xl font-bold text-violet-900">
                    {formatPercent(data.highlights.averageROI)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-700">Ortalama ROO</p>
                  <p className="text-2xl font-bold text-indigo-900">
                    {data.highlights.averageROO?.toFixed(1) || "—"}
                  </p>
                </div>
                <Sparkles className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Highlights */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {data.highlights.bestPerformingCampaign && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">En İyi Performans</p>
                <p className="font-semibold mt-1">{data.highlights.bestPerformingCampaign.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(data.highlights.bestPerformingCampaign.conversions)} dönüşüm
                </p>
              </CardContent>
            </Card>
          )}

          {data.highlights.highestROICampaign && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">En Yüksek ROI</p>
                <p className="font-semibold mt-1">{data.highlights.highestROICampaign.name}</p>
                <p className="text-sm text-emerald-600">
                  {formatPercent(data.highlights.highestROICampaign.roi)} ROI
                </p>
              </CardContent>
            </Card>
          )}

          {data.highlights.highestROOCampaign && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">En Yüksek ROO</p>
                <p className="font-semibold mt-1">{data.highlights.highestROOCampaign.name}</p>
                <p className="text-sm text-indigo-600">
                  {data.highlights.highestROOCampaign.rooScore.toFixed(1)} ROO
                </p>
              </CardContent>
            </Card>
          )}

          {data.highlights.topSponsor && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">En Değerli Sponsor</p>
                <p className="font-semibold mt-1">{data.highlights.topSponsor.companyName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(data.highlights.topSponsor.totalValue)}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Full Executive Summary Text */}
        {data.executiveSummary && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                Detaylı Yönetici Özeti
              </h3>
              <div className="prose prose-sm prose-slate max-w-none">
                {data.executiveSummary.split('\n\n').map((paragraph, index) => {
                  // Başlıkları işle
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-lg font-bold text-slate-900 mt-4 mb-2">
                        {paragraph.replace('## ', '')}
                      </h2>
                    )
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-base font-semibold text-slate-800 mt-3 mb-2">
                        {paragraph.replace('### ', '')}
                      </h3>
                    )
                  }
                  // Liste öğelerini işle
                  if (paragraph.includes('\n• ')) {
                    const lines = paragraph.split('\n')
                    return (
                      <div key={index}>
                        {lines[0] && !lines[0].startsWith('• ') && (
                          <p className="text-slate-600 mb-2">{lines[0]}</p>
                        )}
                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                          {lines.filter(l => l.startsWith('• ')).map((item, i) => (
                            <li key={i}>{item.replace('• ', '')}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  }
                  // Normal paragraf
                  return (
                    <p key={index} className="text-slate-600 mb-2 leading-relaxed">
                      {paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .split('<strong>').map((part, i) => {
                          if (part.includes('</strong>')) {
                            const [bold, rest] = part.split('</strong>')
                            return (
                              <span key={i}>
                                <strong className="font-semibold text-slate-800">{bold}</strong>
                                {rest}
                              </span>
                            )
                          }
                          return part
                        })}
                    </p>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Monthly Trend */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Aylık Performans Trendi
        </h2>
        <Card>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ay</TableHead>
                  <TableHead className="text-right">Gelir</TableHead>
                  <TableHead className="text-right">Gider</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead className="text-right">Kar Marjı</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.monthlyTrend.map((month) => {
                  const margin = month.revenue > 0 
                    ? ((month.net / month.revenue) * 100).toFixed(1)
                    : "0"
                  return (
                    <TableRow key={month.month}>
                      <TableCell className="font-medium">{month.month}</TableCell>
                      <TableCell className="text-right text-emerald-600">
                        {formatCurrency(month.revenue)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(month.expenses)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(month.net)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={month.net >= 0 ? "text-emerald-600" : "text-red-600"}>
                          %{margin}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Campaign Performance */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-orange-500" />
          Kampanya Performansları
        </h2>
        <Card>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kampanya</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tür</TableHead>
                  <TableHead className="text-right">Bütçe</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                  <TableHead className="text-right">Gösterim</TableHead>
                  <TableHead className="text-right">Tıklama</TableHead>
                  <TableHead className="text-right">Dönüşüm</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="font-medium">{campaign.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {STATUS_LABELS[campaign.status] || campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {TYPE_LABELS[campaign.type] || campaign.type}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(campaign.budgetTotal)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={campaign.roi >= 0 ? "text-emerald-600" : "text-red-600"}>
                        {formatPercent(campaign.roi)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(campaign.impressions)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(campaign.clicks)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatNumber(campaign.conversions)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* ROO - Niteliksel Kazanımlar */}
      {data.rooReports && data.rooReports.length > 0 && (
        <section className="page-break-before">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Niteliksel Kazanımlar (ROO Analizi)
          </h2>
          
          {/* ROO Özet Kartları */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-indigo-900">
                  {data.rooSummary.avgRooScore.toFixed(1)}
                </p>
                <p className="text-xs text-indigo-700">Ort. ROO Skoru</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {data.rooSummary.totalObjectives}
                </p>
                <p className="text-xs text-slate-700">Toplam Hedef</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-emerald-900">
                  {data.rooSummary.completedObjectives}
                </p>
                <p className="text-xs text-emerald-700">Tamamlanan</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-purple-900">
                  {data.rooSummary.exceededObjectives}
                </p>
                <p className="text-xs text-purple-700">Hedef Aşan</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-orange-900">
                  {data.rooSummary.atRiskObjectives}
                </p>
                <p className="text-xs text-orange-700">Risk Altında</p>
              </CardContent>
            </Card>
          </div>

          {/* Kampanya Bazlı ROO Raporları */}
          {data.rooReports.map((rooReport) => (
            <Card key={rooReport.campaignId} className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{rooReport.campaignName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Stratejik Hedef Performansı
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">{rooReport.rooScore.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">ROO Skoru</p>
                    </div>
                    <Badge className={`${PERFORMANCE_COLORS[rooReport.performanceCategory]} border`}>
                      {rooReport.performanceLabel}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Niteliksel Kazanımlar */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    Öne Çıkan Kazanımlar
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {rooReport.qualitativeGains.slice(0, 4).map((gain, index) => {
                      const style = GAIN_TYPE_STYLES[gain.type] || GAIN_TYPE_STYLES.improvement
                      return (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border ${style.bg} ${style.border}`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{gain.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm ${style.text}`}>{gain.title}</p>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                                {gain.description}
                              </p>
                              {gain.metric && (
                                <p className="text-xs font-medium text-slate-500 mt-1">
                                  {gain.metric}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Hedef Tablosu */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Hedef Detayları
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hedef</TableHead>
                        <TableHead>Tür</TableHead>
                        <TableHead className="text-right">Hedef</TableHead>
                        <TableHead className="text-right">Gerçekleşen</TableHead>
                        <TableHead className="text-right">Başarı</TableHead>
                        <TableHead>Durum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooReport.objectives.map((obj) => (
                        <TableRow key={obj.id}>
                          <TableCell className="font-medium">{obj.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {obj.typeLabel}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(obj.targetValue)} {obj.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(obj.currentValue)} {obj.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={
                              obj.isOverAchieved 
                                ? "text-purple-600 font-semibold" 
                                : obj.achievementRate >= 100 
                                  ? "text-emerald-600 font-semibold"
                                  : obj.achievementRate >= 75
                                    ? "text-green-600"
                                    : obj.achievementRate >= 50
                                      ? "text-yellow-600"
                                      : "text-red-600"
                            }>
                              {formatPercent(obj.achievementRate)}
                              {obj.isOverAchieved && (
                                <span className="text-purple-500 text-xs ml-1">
                                  (+{obj.overAchievementRate.toFixed(0)}%)
                                </span>
                              )}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              obj.status === 'EXCEEDED' ? "bg-purple-50 text-purple-700 border-purple-200" :
                              obj.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                              obj.status === 'ON_TRACK' ? "bg-green-50 text-green-700 border-green-200" :
                              obj.status === 'AT_RISK' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                              obj.status === 'BEHIND' ? "bg-orange-50 text-orange-700 border-orange-200" :
                              "bg-slate-50 text-slate-700 border-slate-200"
                            }>
                              {obj.statusLabel}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Yönetici Özeti */}
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    Yönetici Özeti
                  </h4>
                  <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                    {rooReport.executiveSummary.split('\n\n').slice(0, 2).join('\n\n')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {/* RFM Distribution */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-purple-500" />
          RFM Segmentasyonu
        </h2>
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {data.rfmDistribution.map((segment) => (
                <div
                  key={segment.segment}
                  className="p-3 rounded-lg border"
                  style={{ borderColor: segment.color + "40", backgroundColor: segment.color + "10" }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="font-medium text-sm">{segment.label}</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{segment.count}</span>
                    <span className="text-sm text-muted-foreground">
                      ({segment.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sponsor Analysis */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-cyan-500" />
          Sponsor Analizi ve LTV Tahminleri
        </h2>
        <Card>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sponsor</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>RFM Segment</TableHead>
                  <TableHead className="text-right">Toplam Değer</TableHead>
                  <TableHead className="text-right">Tahmini LTV</TableHead>
                  <TableHead className="text-right">Churn Riski</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.sponsors.slice(0, 10).map((sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sponsor.companyName}</div>
                        <div className="text-xs text-muted-foreground">
                          {sponsor.industry || "—"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {TIER_LABELS[sponsor.tier] || sponsor.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sponsor.rfm ? (
                        <span className="text-sm">
                          {RFM_LABELS[sponsor.rfm.segment] || sponsor.rfm.segment}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(sponsor.totalValue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {sponsor.ltv ? formatCurrency(sponsor.ltv.ltv) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {sponsor.ltv ? (
                        <span
                          className={
                            sponsor.ltv.churnRate >= 0.5
                              ? "text-red-600 font-medium"
                              : sponsor.ltv.churnRate >= 0.3
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }
                        >
                          {formatPercent(sponsor.ltv.churnRate * 100)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t pt-6 mt-8">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div>
            <p>Bu rapor DevRetain CRM tarafından otomatik olarak oluşturulmuştur.</p>
            <p>Oluşturulma: {formatDate(data.generatedAt)}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-slate-700">DevRetain CRM</p>
            <p>Sponsorluk Yönetim Sistemi</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
