"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  DollarSign,
  TrendingUp,
  Target,
  Megaphone,
  Plus,
  Loader2,
  FileText,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MetricCard } from "@/components/dashboard/metric-card"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { AttentionRequiredList } from "@/components/dashboard/attention-required-list"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { SponsorTierChart } from "@/components/dashboard/sponsor-tier-chart"
import { RFMDistributionChart } from "@/components/dashboard/rfm-distribution-chart"
import { CampaignsTable } from "@/components/dashboard/campaigns-table"
import { TopSponsors } from "@/components/dashboard/top-sponsors"
import { ROIROOScatterChart } from "@/components/dashboard/roi-roo-scatter-chart"
import { ObjectiveProgressList } from "@/components/dashboard/objective-progress-list"
import {
  getDashboardStats,
  getMonthlyTrend,
  getSponsorsByTier,
  getRFMDistribution,
  getCampaignPerformance,
  getTopSponsors,
  getROIvsROOData,
  getCampaignsWithROODetails,
  getROOSummaryStats,
  type DashboardStats,
  type MonthlyTrend,
  type SponsorsByTier,
  type RFMDistribution,
} from "@/lib/mock-analytics"

// Tooltip açıklamaları
const metricTooltips = {
  revenue: "Toplam Gelir = Tüm kampanyalardan elde edilen brüt gelir toplamı. Sponsorluk ödemeleri, reklam gelirleri ve komisyonları içerir.",
  roi: "ROI (Yatırım Getirisi) = ((Gelir - Maliyet) / Maliyet) × 100. Pozitif değer kar, negatif değer zarar anlamına gelir.",
  roo: "ROO (Hedef Getirisi) = Σ((Gerçekleşen / Hedef) × Ağırlık). Stratejik hedeflerin ne kadarına ulaşıldığını gösterir (0-100 arası).",
  campaigns: "Aktif kampanya sayısı. Durumu 'Aktif' olan ve bitiş tarihi geçmemiş kampanyaları kapsar.",
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("roi")
  const [dateRange, setDateRange] = useState("30d")
  const [sponsorType, setSponsorType] = useState("all")
  
  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([])
  const [sponsorsByTier, setSponsorsByTier] = useState<SponsorsByTier[]>([])
  const [rfmDistribution, setRfmDistribution] = useState<RFMDistribution[]>([])
  const [campaigns, setCampaigns] = useState<ReturnType<typeof getCampaignPerformance>>([])
  const [topSponsors, setTopSponsors] = useState<ReturnType<typeof getTopSponsors>>([])
  const [roiRooData, setRoiRooData] = useState<ReturnType<typeof getROIvsROOData>>([])
  const [campaignsWithROO, setCampaignsWithROO] = useState<ReturnType<typeof getCampaignsWithROODetails>>([])
  const [rooStats, setRooStats] = useState<ReturnType<typeof getROOSummaryStats> | null>(null)

  // Dikkat gerektiren kampanyalar (mock data)
  const attentionItems = [
    {
      id: "1",
      name: "Yaz Festivali 2024",
      type: "low_roi" as const,
      severity: "high" as const,
      metric: "ROI",
      metricValue: "-12%",
    },
    {
      id: "2",
      name: "Teknoloji Zirvesi",
      type: "ending_soon" as const,
      severity: "medium" as const,
      daysRemaining: 5,
    },
    {
      id: "3",
      name: "Spor Sponsorluğu Q4",
      type: "behind_target" as const,
      severity: "medium" as const,
      metric: "ROO",
      metricValue: "42%",
    },
    {
      id: "4",
      name: "Podcast Serisi",
      type: "no_activity" as const,
      severity: "low" as const,
      metric: "Son aktivite",
      metricValue: "15 gün önce",
    },
  ]

  useEffect(() => {
    // Client-side'da veri yükle
    setStats(getDashboardStats("org-1"))
    setMonthlyTrend(getMonthlyTrend("org-1", 6))
    setSponsorsByTier(getSponsorsByTier("org-1"))
    setRfmDistribution(getRFMDistribution("org-1"))
    setCampaigns(getCampaignPerformance("org-1"))
    setTopSponsors(getTopSponsors("org-1", 5))
    setRoiRooData(getROIvsROOData("org-1"))
    setCampaignsWithROO(getCampaignsWithROODetails("org-1"))
    setRooStats(getROOSummaryStats("org-1"))
    setIsLoading(false)
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₺${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `₺${(value / 1000).toFixed(0)}K`
    }
    return `₺${value}`
  }

  // Loading state
  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <p className="text-slate-500">Dashboard yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="p-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-slate-500">Sponsorluk performansınızı takip edin</p>
          </div>
          <div className="flex items-center gap-3">
            <DashboardFilters
              onDateRangeChange={setDateRange}
              onSponsorTypeChange={setSponsorType}
            />
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/reports">
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <FileText className="h-4 w-4" />
                  Rapor
                </Button>
              </Link>
              <Link href="/campaigns/new">
                <Button size="sm" className="h-9 gap-2 bg-violet-600 hover:bg-violet-700">
                  <Plus className="h-4 w-4" />
                  Kampanya
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">

          {/* ============================================ */}
          {/* EXECUTIVE SUMMARY - 4 Ana Metrik */}
          {/* ============================================ */}
          <section>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Toplam Gelir"
                value={formatCurrency(stats.totalRevenue)}
                previousValue={formatCurrency(stats.totalRevenue * 0.88)}
                changePercent={12.5}
                icon={DollarSign}
                tooltip={metricTooltips.revenue}
                accentColor="emerald"
              />
              <MetricCard
                title="Net ROI"
                value={`%${stats.averageROI.toFixed(0)}`}
                previousValue={`%${(stats.averageROI - 8.2).toFixed(0)}`}
                changePercent={8.2}
                icon={TrendingUp}
                tooltip={metricTooltips.roi}
                accentColor="blue"
              />
              <MetricCard
                title="Genel ROO Skoru"
                value={rooStats?.avgRooScore || 0}
                previousValue="68"
                changePercent={rooStats ? ((rooStats.avgRooScore - 68) / 68) * 100 : 0}
                icon={Target}
                tooltip={metricTooltips.roo}
                accentColor="violet"
              />
              <MetricCard
                title="Aktif Kampanyalar"
                value={stats.activeCampaigns}
                previousValue={String(stats.activeCampaigns - 2)}
                changePercent={((stats.activeCampaigns - (stats.activeCampaigns - 2)) / (stats.activeCampaigns - 2)) * 100}
                icon={Megaphone}
                tooltip={metricTooltips.campaigns}
                accentColor="amber"
              />
            </div>
          </section>

          {/* ============================================ */}
          {/* OPERATIONAL INSIGHTS - Tabs */}
          {/* ============================================ */}
          <section>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 h-12">
                <TabsTrigger 
                  value="roi" 
                  className="flex-1 gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Finansal Performans</span>
                  <span className="sm:hidden">ROI</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="roo" 
                  className="flex-1 gap-2 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-600 dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-400"
                >
                  <Target className="h-4 w-4" />
                  <span className="hidden sm:inline">Stratejik Hedefler</span>
                  <span className="sm:hidden">ROO</span>
                </TabsTrigger>
              </TabsList>

              {/* ROI Tab Content */}
              <TabsContent value="roi" className="space-y-6 mt-6">
                {/* ROI Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">Gelir vs Harcama Trendi</CardTitle>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                  <Info className="h-3.5 w-3.5 text-slate-400" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Aylık gelir ve harcama karşılaştırması. Mavi çizgi geliri, kırmızı çizgi harcamayı gösterir.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <RevenueChart data={monthlyTrend} />
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold">Sponsor Dağılımı</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                              <Info className="h-3.5 w-3.5 text-slate-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Sponsorların tier seviyelerine göre dağılımı (Bronze, Silver, Gold, Platinum, Diamond).</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <SponsorTierChart data={sponsorsByTier} />
                    </CardContent>
                  </Card>
                </div>

                {/* RFM & Top Sponsors */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold">RFM Segmentasyonu</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                              <Info className="h-3.5 w-3.5 text-slate-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">RFM = Recency (Son İşlem), Frequency (Sıklık), Monetary (Tutar). Sponsorları değerlerine göre segmentler.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <RFMDistributionChart data={rfmDistribution} />
                    </CardContent>
                  </Card>
                  <div className="lg:col-span-2">
                    <Card className="border-0 shadow-sm h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base font-semibold">En Değerli Sponsorlar</CardTitle>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Info className="h-3.5 w-3.5 text-slate-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Toplam katkı miktarına göre sıralanmış en değerli 5 sponsor.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <TopSponsors sponsors={topSponsors} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* ROO Tab Content */}
              <TabsContent value="roo" className="space-y-6 mt-6">
                {/* ROI vs ROO Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">ROI vs ROO Performans Matrisi</CardTitle>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                  <Info className="h-3.5 w-3.5 text-slate-400" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">X ekseni ROI (finansal getiri), Y ekseni ROO (hedef başarısı). Sağ üst kadran en iyi performansı gösterir.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ROIROOScatterChart data={roiRooData} />
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* ROO Summary Card */}
                  {rooStats && (
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <Target className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">ROO Özeti</CardTitle>
                            <p className="text-xs text-slate-500">Stratejik hedef performansı</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-4">
                        {/* Ortalama ROO Score */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                          <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{rooStats.avgRooScore}</p>
                          <p className="text-sm text-slate-500">Ortalama ROO Skoru</p>
                        </div>
                        
                        {/* Hedef İstatistikleri */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                              {rooStats.completedObjectives + rooStats.exceededObjectives}
                            </p>
                            <p className="text-xs text-slate-500">Tamamlanan</p>
                          </div>
                          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-center">
                            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                              {rooStats.atRiskObjectives + rooStats.behindObjectives}
                            </p>
                            <p className="text-xs text-slate-500">Risk Altında</p>
                          </div>
                        </div>
                        
                        {/* Quadrant Dağılımı */}
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-xs font-medium text-slate-500 mb-2">Kampanya Dağılımı</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-emerald-500" />
                              <span className="text-slate-600 dark:text-slate-400">Yıldız: {rooStats.quadrantDistribution.star}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500" />
                              <span className="text-slate-600 dark:text-slate-400">Para: {rooStats.quadrantDistribution.moneyOnly}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                              <span className="text-slate-600 dark:text-slate-400">Strateji: {rooStats.quadrantDistribution.strategic}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500" />
                              <span className="text-slate-600 dark:text-slate-400">İyileştir: {rooStats.quadrantDistribution.needsWork}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Objective Progress List */}
                {campaignsWithROO.length > 0 && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold">Hedef İlerleme Durumu</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                              <Info className="h-3.5 w-3.5 text-slate-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Her kampanyanın stratejik hedeflerine ne kadar yaklaştığını gösteren ilerleme çubukları.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ObjectiveProgressList campaigns={campaignsWithROO} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </section>

          {/* ============================================ */}
          {/* ACTIONABLE DATA - Dikkat Gerektiren Kampanyalar */}
          {/* ============================================ */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AttentionRequiredList items={attentionItems} />
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">Son Kampanyalar</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                            <Info className="h-3.5 w-3.5 text-slate-400" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Son oluşturulan ve güncellenen kampanyaların listesi.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Tümünü Gör
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CampaignsTable campaigns={campaigns.slice(0, 5)} />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
            <p>DevRetain CRM © 2024 • Sponsorluk Yönetim Sistemi</p>
            <p className="mt-1 text-xs text-slate-400">
              Demo verileri gösterilmektedir.
            </p>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  )
}
