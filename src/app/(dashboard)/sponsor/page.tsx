"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Star,
  DollarSign,
  BarChart3,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Building2,
  ChevronRight,
  Filter,
  ArrowUpRight,
  Sparkles,
  Shield,
  Award,
  Play,
  Heart,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useLocale } from "@/hooks/use-locale"

// Mock data for sponsor's portfolio
const portfolioStats = {
  totalInvestment: 850000,
  totalROI: 23.5,
  averageROO: 87,
  activePartnerships: 12,
  pendingProposals: 5,
  completedCampaigns: 28,
}

// Mock data for sponsored channels/clubs
const sponsoredPartners = [
  {
    id: "1",
    name: "TechReview TR",
    type: "YOUTUBER",
    category: "Teknoloji",
    avatar: null,
    followers: 1250000,
    investment: 150000,
    roi: 32.5,
    roo: 94,
    campaigns: 4,
    status: "active",
    lastCampaign: "2024-11-15",
  },
  {
    id: "2",
    name: "Gaming Masters",
    type: "YOUTUBER",
    category: "Oyun",
    avatar: null,
    followers: 890000,
    investment: 120000,
    roi: 28.3,
    roo: 88,
    campaigns: 3,
    status: "active",
    lastCampaign: "2024-11-10",
  },
  {
    id: "3",
    name: "Fenerbahçe Espor",
    type: "CLUB",
    category: "Espor",
    avatar: null,
    followers: 2100000,
    investment: 250000,
    roi: 18.7,
    roo: 92,
    campaigns: 5,
    status: "active",
    lastCampaign: "2024-11-01",
  },
  {
    id: "4",
    name: "Lifestyle Vlog",
    type: "YOUTUBER",
    category: "Yaşam",
    avatar: null,
    followers: 450000,
    investment: 80000,
    roi: 15.2,
    roo: 76,
    campaigns: 2,
    status: "completed",
    lastCampaign: "2024-09-20",
  },
]

// Mock data for proposals
const proposals = [
  {
    id: "1",
    partnerName: "CodeCraft Academy",
    partnerType: "YOUTUBER",
    category: "Eğitim",
    proposedBudget: 75000,
    status: "pending",
    sentAt: "2024-11-17",
    responseDeadline: "2024-11-24",
  },
  {
    id: "2",
    partnerName: "Fit Life TR",
    partnerType: "YOUTUBER",
    category: "Sağlık",
    proposedBudget: 50000,
    status: "negotiating",
    sentAt: "2024-11-15",
    counterOffer: 65000,
  },
  {
    id: "3",
    partnerName: "Galatasaray Espor",
    partnerType: "CLUB",
    category: "Espor",
    proposedBudget: 300000,
    status: "rejected",
    sentAt: "2024-11-10",
    rejectedAt: "2024-11-12",
    rejectionReason: "Bütçe uyumsuzluğu",
  },
  {
    id: "4",
    partnerName: "Auto Review TR",
    partnerType: "YOUTUBER",
    category: "Otomotiv",
    proposedBudget: 100000,
    status: "accepted",
    sentAt: "2024-11-08",
    acceptedAt: "2024-11-11",
  },
  {
    id: "5",
    partnerName: "Foodie Adventures",
    partnerType: "YOUTUBER",
    category: "Gıda",
    proposedBudget: 45000,
    status: "pending",
    sentAt: "2024-11-16",
    responseDeadline: "2024-11-23",
  },
]

const proposalStatusConfig = {
  pending: { label: "Beklemede", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", icon: Clock },
  negotiating: { label: "Pazarlıkta", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", icon: MessageSquare },
  accepted: { label: "Kabul Edildi", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: CheckCircle },
  rejected: { label: "Reddedildi", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20", icon: XCircle },
}

export default function SponsorPortalPage() {
  const { locale } = useLocale()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [proposalFilter, setProposalFilter] = useState("all")
  
  // Localized texts
  const t = {
    sponsorPortal: locale === 'tr' ? 'Sponsor Portalı' : 'Sponsor Portal',
    dashboard: locale === 'tr' ? 'Dashboard' : 'Dashboard',
    portfolio: locale === 'tr' ? 'Portföyüm' : 'My Portfolio',
    offers: locale === 'tr' ? 'Teklifler' : 'Offers',
    totalInvestment: locale === 'tr' ? 'Toplam Yatırım' : 'Total Investment',
    avgROI: locale === 'tr' ? 'Ortalama ROI' : 'Average ROI',
    avgROO: locale === 'tr' ? 'Ortalama ROO' : 'Average ROO',
    activePartnerships: locale === 'tr' ? 'Aktif Ortaklık' : 'Active Partnerships',
    pendingProposals: locale === 'tr' ? 'Bekleyen Teklif' : 'Pending Proposals',
    completedCampaigns: locale === 'tr' ? 'Tamamlanan Kampanya' : 'Completed Campaigns',
    topPerformers: locale === 'tr' ? 'En İyi Performans' : 'Top Performers',
    recentOffers: locale === 'tr' ? 'Son Teklifler' : 'Recent Offers',
    viewAll: locale === 'tr' ? 'Tümünü Gör' : 'View All',
    sponsoredChannels: locale === 'tr' ? 'Desteklenen Kanallar' : 'Sponsored Channels',
    searchChannels: locale === 'tr' ? 'Kanal ara...' : 'Search channels...',
    sortBy: locale === 'tr' ? 'Sırala' : 'Sort by',
    roi: locale === 'tr' ? 'ROI' : 'ROI',
    roo: locale === 'tr' ? 'ROO' : 'ROO',
    investment: locale === 'tr' ? 'Yatırım' : 'Investment',
    followers: locale === 'tr' ? 'Takipçi' : 'Followers',
    campaigns: locale === 'tr' ? 'kampanya' : 'campaigns',
    active: locale === 'tr' ? 'Aktif' : 'Active',
    completed: locale === 'tr' ? 'Tamamlandı' : 'Completed',
    paused: locale === 'tr' ? 'Duraklatıldı' : 'Paused',
    viewProfile: locale === 'tr' ? 'Profil' : 'Profile',
    newCampaign: locale === 'tr' ? 'Yeni Kampanya' : 'New Campaign',
    proposalManagement: locale === 'tr' ? 'Teklif Yönetimi' : 'Proposal Management',
    filterBy: locale === 'tr' ? 'Filtrele' : 'Filter by',
    all: locale === 'tr' ? 'Tümü' : 'All',
    pending: locale === 'tr' ? 'Beklemede' : 'Pending',
    negotiating: locale === 'tr' ? 'Pazarlıkta' : 'Negotiating',
    accepted: locale === 'tr' ? 'Kabul Edildi' : 'Accepted',
    rejected: locale === 'tr' ? 'Reddedildi' : 'Rejected',
    channel: locale === 'tr' ? 'Kanal' : 'Channel',
    budget: locale === 'tr' ? 'Bütçe' : 'Budget',
    status: locale === 'tr' ? 'Durum' : 'Status',
    date: locale === 'tr' ? 'Tarih' : 'Date',
    actions: locale === 'tr' ? 'İşlemler' : 'Actions',
    viewDetails: locale === 'tr' ? 'Detaylar' : 'Details',
    sendMessage: locale === 'tr' ? 'Mesaj Gönder' : 'Send Message',
    discoverMore: locale === 'tr' ? 'Daha Fazla Keşfet' : 'Discover More',
    goToDiscover: locale === 'tr' ? 'Keşfet Sayfasına Git' : 'Go to Discover',
  }

  const filteredProposals = proposals.filter(p => 
    proposalFilter === "all" || p.status === proposalFilter
  )

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return value.toString()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">Sponsor Portal</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/sponsor/discover">
                <Search className="h-4 w-4 mr-2" />
                Keşfet
              </Link>
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Zap className="h-4 w-4 mr-2" />
              Yeni Teklif
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 h-12">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Portföy</span>
            </TabsTrigger>
            <TabsTrigger value="proposals" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Teklifler</span>
              {proposals.filter(p => p.status === "pending").length > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-amber-500 text-white">
                  {proposals.filter(p => p.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Toplam Yatırım</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {formatCurrency(portfolioStats.totalInvestment)}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Ortalama ROI</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        %{portfolioStats.totalROI}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        <span className="text-xs text-emerald-600">+5.2% bu ay</span>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Ortalama ROO</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {portfolioStats.averageROO}/100
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <Target className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Aktif Ortaklık</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {portfolioStats.activePartnerships}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">En İyi Performans Gösteren Ortaklar</CardTitle>
                    <CardDescription>ROI bazında sıralanmış</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("portfolio")}>
                    Tümünü Gör
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sponsoredPartners
                    .filter(p => p.status === "active")
                    .sort((a, b) => b.roi - a.roi)
                    .slice(0, 3)
                    .map((partner, index) => (
                      <div 
                        key={partner.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold",
                            index === 0 && "bg-gradient-to-br from-amber-400 to-amber-600",
                            index === 1 && "bg-gradient-to-br from-slate-400 to-slate-600",
                            index === 2 && "bg-gradient-to-br from-orange-400 to-orange-600"
                          )}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{partner.name}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{partner.category}</span>
                              <span>•</span>
                              <span>{formatNumber(partner.followers)} takipçi</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-600">%{partner.roi}</p>
                          <p className="text-xs text-slate-500">ROI</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Proposals */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Son Teklifler</CardTitle>
                    <CardDescription>Gönderilen sponsorluk teklifleri</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("proposals")}>
                    Tümünü Gör
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {proposals.slice(0, 3).map((proposal) => {
                    const statusConfig = proposalStatusConfig[proposal.status as keyof typeof proposalStatusConfig]
                    const StatusIcon = statusConfig.icon
                    return (
                      <div 
                        key={proposal.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white text-sm font-medium">
                            {proposal.partnerName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{proposal.partnerName}</p>
                            <p className="text-xs text-slate-500">{formatCurrency(proposal.proposedBudget)}</p>
                          </div>
                        </div>
                        <Badge className={cn(statusConfig.bg, statusConfig.color, "border-0")}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Sponsorluk Portföyü</CardTitle>
                    <CardDescription>Desteklediğiniz tüm kanallar ve kulüpler</CardDescription>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/sponsor/discover">
                      <Search className="h-4 w-4 mr-2" />
                      Yeni Keşfet
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {sponsoredPartners.map((partner) => (
                    <div 
                      key={partner.id}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-lg font-bold">
                            {partner.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900 dark:text-white">{partner.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {partner.type === "YOUTUBER" ? "İçerik Üreticisi" : "Kulüp"}
                              </Badge>
                              {partner.status === "active" ? (
                                <Badge className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                  Aktif
                                </Badge>
                              ) : (
                                <Badge className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                                  Tamamlandı
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {formatNumber(partner.followers)}
                              </span>
                              <span>{partner.category}</span>
                              <span>{partner.campaigns} kampanya</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Detay
                        </Button>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <p className="text-xs text-slate-500">Toplam Yatırım</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {formatCurrency(partner.investment)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">ROI</p>
                          <p className={cn(
                            "text-lg font-bold",
                            partner.roi > 20 ? "text-emerald-600" : partner.roi > 10 ? "text-blue-600" : "text-amber-600"
                          )}>
                            %{partner.roi}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">ROO Skoru</p>
                          <p className="text-lg font-bold text-violet-600">{partner.roo}/100</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Son Kampanya</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {new Date(partner.lastCampaign).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">Teklif Yönetimi</CardTitle>
                    <CardDescription>Gönderilen sponsorluk tekliflerinin durumu</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select value={proposalFilter} onValueChange={setProposalFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="pending">Beklemede</SelectItem>
                        <SelectItem value="negotiating">Pazarlıkta</SelectItem>
                        <SelectItem value="accepted">Kabul Edildi</SelectItem>
                        <SelectItem value="rejected">Reddedildi</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Zap className="h-4 w-4 mr-2" />
                      Yeni Teklif
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredProposals.map((proposal) => {
                    const statusConfig = proposalStatusConfig[proposal.status as keyof typeof proposalStatusConfig]
                    const StatusIcon = statusConfig.icon
                    return (
                      <div 
                        key={proposal.id}
                        className={cn(
                          "p-4 rounded-lg border transition-colors",
                          proposal.status === "pending" && "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10",
                          proposal.status === "negotiating" && "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10",
                          proposal.status === "accepted" && "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10",
                          proposal.status === "rejected" && "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white font-bold">
                              {proposal.partnerName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-900 dark:text-white">{proposal.partnerName}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {proposal.partnerType === "YOUTUBER" ? "İçerik Üreticisi" : "Kulüp"}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-500 mt-0.5">{proposal.category}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                <span>Teklif: {formatCurrency(proposal.proposedBudget)}</span>
                                {proposal.counterOffer && (
                                  <span className="text-blue-600">Karşı Teklif: {formatCurrency(proposal.counterOffer)}</span>
                                )}
                                <span>Gönderildi: {new Date(proposal.sentAt).toLocaleDateString('tr-TR')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={cn(statusConfig.bg, statusConfig.color, "border-0")}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                            {proposal.status === "pending" && proposal.responseDeadline && (
                              <span className="text-xs text-slate-500">
                                Son tarih: {new Date(proposal.responseDeadline).toLocaleDateString('tr-TR')}
                              </span>
                            )}
                            {proposal.status === "rejected" && proposal.rejectionReason && (
                              <span className="text-xs text-red-500">{proposal.rejectionReason}</span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          {proposal.status === "pending" && (
                            <>
                              <Button variant="outline" size="sm">
                                <XCircle className="h-4 w-4 mr-1" />
                                İptal Et
                              </Button>
                              <Button variant="outline" size="sm">
                                Düzenle
                              </Button>
                            </>
                          )}
                          {proposal.status === "negotiating" && (
                            <>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                Reddet
                              </Button>
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Kabul Et
                              </Button>
                            </>
                          )}
                          {proposal.status === "accepted" && (
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                              <Play className="h-4 w-4 mr-1" />
                              Kampanya Başlat
                            </Button>
                          )}
                          {proposal.status === "rejected" && (
                            <Button variant="outline" size="sm">
                              <Zap className="h-4 w-4 mr-1" />
                              Yeni Teklif Gönder
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {filteredProposals.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Bu filtreye uygun teklif bulunamadı.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
