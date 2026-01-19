"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  FileText,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Star,
  Shield,
  Lock,
  Unlock,
  CreditCard,
  Coins,
  ChevronRight,
  Eye,
  Download,
  CheckCircle,
  Clock,
  Building2,
  Youtube,
  Award,
  Zap,
  ShoppingCart,
  Filter,
  Sparkles,
  Crown,
  Gift,
  ArrowRight,
  Info,
  AlertCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Mock user credits
const userCredits = 25

// Mock creator performance reports
const creatorReports = [
  {
    id: "cr-1",
    name: "TechVision TR",
    type: "YOUTUBER",
    category: "Teknoloji",
    followers: 2450000,
    avgROI: 28.5,
    avgROO: 91,
    completedCampaigns: 45,
    trustScore: 94,
    reportPrice: 15, // credits
    cashPrice: 149, // TRY
    verified: true,
    reportIncludes: [
      "Son 12 ay ROI trendi",
      "Kampanya bazlı performans analizi",
      "Kitle demografisi detayları",
      "Etkileşim oranı geçmişi",
      "Sponsor memnuniyet skorları",
    ],
    lastUpdated: "2024-11-15",
    purchaseCount: 23,
  },
  {
    id: "cr-2",
    name: "Gaming Universe",
    type: "YOUTUBER",
    category: "Oyun",
    followers: 1850000,
    avgROI: 32.1,
    avgROO: 88,
    completedCampaigns: 38,
    trustScore: 91,
    reportPrice: 12,
    cashPrice: 119,
    verified: true,
    reportIncludes: [
      "Son 12 ay ROI trendi",
      "Kampanya bazlı performans analizi",
      "Kitle demografisi detayları",
      "Etkileşim oranı geçmişi",
      "Sponsor memnuniyet skorları",
    ],
    lastUpdated: "2024-11-12",
    purchaseCount: 18,
  },
  {
    id: "cr-3",
    name: "Beşiktaş Espor",
    type: "CLUB",
    category: "Espor",
    followers: 3200000,
    avgROI: 24.8,
    avgROO: 92,
    completedCampaigns: 62,
    trustScore: 98,
    reportPrice: 20,
    cashPrice: 199,
    verified: true,
    reportIncludes: [
      "Son 12 ay ROI trendi",
      "Kampanya bazlı performans analizi",
      "Kitle demografisi detayları",
      "Etkileşim oranı geçmişi",
      "Sponsor memnuniyet skorları",
      "Turnuva performans verileri",
    ],
    lastUpdated: "2024-11-10",
    purchaseCount: 31,
  },
  {
    id: "cr-4",
    name: "Fit & Healthy",
    type: "YOUTUBER",
    category: "Sağlık",
    followers: 890000,
    avgROI: 22.3,
    avgROO: 76,
    completedCampaigns: 24,
    trustScore: 87,
    reportPrice: 10,
    cashPrice: 99,
    verified: true,
    reportIncludes: [
      "Son 12 ay ROI trendi",
      "Kampanya bazlı performans analizi",
      "Kitle demografisi detayları",
      "Etkileşim oranı geçmişi",
    ],
    lastUpdated: "2024-11-08",
    purchaseCount: 12,
  },
]

// Mock sponsor report cards
const sponsorReports = [
  {
    id: "sr-1",
    name: "TechCorp Türkiye",
    industry: "Teknoloji",
    totalSponsored: 2850000,
    avgPaymentSpeed: 4.8,
    collaborationScore: 92,
    completedDeals: 28,
    trustScore: 96,
    reportPrice: 10,
    cashPrice: 99,
    verified: true,
    reportIncludes: [
      "Ödeme hızı geçmişi",
      "İş birliği süreci puanı",
      "Yayıncı memnuniyet skorları",
      "Bütçe güvenilirliği",
      "İletişim kalitesi değerlendirmesi",
    ],
    lastUpdated: "2024-11-14",
    purchaseCount: 45,
  },
  {
    id: "sr-2",
    name: "GameZone",
    industry: "Oyun",
    totalSponsored: 1500000,
    avgPaymentSpeed: 4.5,
    collaborationScore: 88,
    completedDeals: 19,
    trustScore: 89,
    reportPrice: 8,
    cashPrice: 79,
    verified: true,
    reportIncludes: [
      "Ödeme hızı geçmişi",
      "İş birliği süreci puanı",
      "Yayıncı memnuniyet skorları",
      "Bütçe güvenilirliği",
    ],
    lastUpdated: "2024-11-11",
    purchaseCount: 32,
  },
  {
    id: "sr-3",
    name: "FinanceApp",
    industry: "Finans",
    totalSponsored: 4200000,
    avgPaymentSpeed: 4.9,
    collaborationScore: 95,
    completedDeals: 42,
    trustScore: 97,
    reportPrice: 12,
    cashPrice: 119,
    verified: true,
    reportIncludes: [
      "Ödeme hızı geçmişi",
      "İş birliği süreci puanı",
      "Yayıncı memnuniyet skorları",
      "Bütçe güvenilirliği",
      "İletişim kalitesi değerlendirmesi",
      "Uzun vadeli ortaklık oranı",
    ],
    lastUpdated: "2024-11-13",
    purchaseCount: 56,
  },
  {
    id: "sr-4",
    name: "E-Commerce Plus",
    industry: "E-ticaret",
    totalSponsored: 980000,
    avgPaymentSpeed: 4.2,
    collaborationScore: 82,
    completedDeals: 15,
    trustScore: 84,
    reportPrice: 8,
    cashPrice: 79,
    verified: true,
    reportIncludes: [
      "Ödeme hızı geçmişi",
      "İş birliği süreci puanı",
      "Yayıncı memnuniyet skorları",
      "Bütçe güvenilirliği",
    ],
    lastUpdated: "2024-11-09",
    purchaseCount: 21,
  },
]

// Credit packages
const creditPackages = [
  { id: "pkg-1", credits: 10, price: 89, perCredit: 8.9, popular: false },
  { id: "pkg-2", credits: 25, price: 199, perCredit: 7.96, popular: true, savings: 11 },
  { id: "pkg-3", credits: 50, price: 349, perCredit: 6.98, popular: false, savings: 22 },
  { id: "pkg-4", credits: 100, price: 599, perCredit: 5.99, popular: false, savings: 33 },
]

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("creators")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("trustScore")
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false)
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"credits" | "cash">("credits")

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

  const filteredCreatorReports = creatorReports
    .filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "trustScore": return b.trustScore - a.trustScore
        case "roi": return b.avgROI - a.avgROI
        case "price": return a.reportPrice - b.reportPrice
        case "popular": return b.purchaseCount - a.purchaseCount
        default: return 0
      }
    })

  const filteredSponsorReports = sponsorReports
    .filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.industry.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "trustScore": return b.trustScore - a.trustScore
        case "roi": return b.collaborationScore - a.collaborationScore
        case "price": return a.reportPrice - b.reportPrice
        case "popular": return b.purchaseCount - a.purchaseCount
        default: return 0
      }
    })

  const handlePurchase = (report: any) => {
    setSelectedReport(report)
    setPurchaseDialogOpen(true)
  }

  const confirmPurchase = () => {
    // In real app, this would call an API
    console.log("Purchasing report:", selectedReport?.id, "with", paymentMethod)
    setPurchaseDialogOpen(false)
    // Show success toast
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">Rapor Pazaryeri</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCreditsDialogOpen(true)}
              className="gap-2"
            >
              <Coins className="h-4 w-4 text-amber-500" />
              <span className="font-semibold">{userCredits}</span>
              <span className="text-slate-500">Kredi</span>
            </Button>
            <Button size="sm" onClick={() => setCreditsDialogOpen(true)}>
              <Zap className="h-4 w-4 mr-2" />
              Kredi Al
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Doğrulanmış Performans Raporları
            </h1>
            <p className="text-amber-100 mb-4">
              İş birliği yapmadan önce karşı tarafın geçmiş performansını analiz edin. 
              Tüm veriler DevRetain tarafından doğrulanmıştır.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">%100 Doğrulanmış Veri</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                <Lock className="h-5 w-5" />
                <span className="text-sm font-medium">Gizlilik Garantisi</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Anlık Erişim</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Rapor ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 h-12">
              <SelectValue placeholder="Sırala" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trustScore">Güven Skoru</SelectItem>
              <SelectItem value="roi">Performans</SelectItem>
              <SelectItem value="price">Fiyat (Düşük)</SelectItem>
              <SelectItem value="popular">Popülerlik</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 h-12">
            <TabsTrigger value="creators" className="gap-2 flex-1">
              <Youtube className="h-4 w-4" />
              Yayıncı Raporları
              <Badge className="ml-1 bg-violet-500 text-white">{creatorReports.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="gap-2 flex-1">
              <Building2 className="h-4 w-4" />
              Sponsor Karneleri
              <Badge className="ml-1 bg-emerald-500 text-white">{sponsorReports.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Creator Reports Tab */}
          <TabsContent value="creators" className="space-y-4">
            <div className="grid gap-4">
              {filteredCreatorReports.map((report) => (
                <Card key={report.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Creator Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
                          {report.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-slate-900 dark:text-white">{report.name}</h3>
                            {report.verified && (
                              <Shield className="h-4 w-4 text-emerald-500" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {report.type === "YOUTUBER" ? "İçerik Üreticisi" : "Kulüp"}
                            </Badge>
                            <Badge className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0">
                              {report.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {formatNumber(report.followers)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              {report.completedCampaigns} kampanya
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {report.purchaseCount} görüntüleme
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats Preview */}
                      <div className="grid grid-cols-3 gap-4 lg:gap-6">
                        <div className="text-center">
                          <p className="text-xs text-slate-500">ROI</p>
                          <p className="text-lg font-bold text-emerald-600">%{report.avgROI}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">ROO</p>
                          <p className="text-lg font-bold text-violet-600">{report.avgROO}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">Güven</p>
                          <p className="text-lg font-bold text-amber-600">{report.trustScore}</p>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                            <Coins className="h-3 w-3 mr-1" />
                            {report.reportPrice} Kredi
                          </Badge>
                          <span className="text-sm text-slate-400">veya</span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {formatCurrency(report.cashPrice)}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-violet-600 hover:bg-violet-700"
                          onClick={() => handlePurchase(report)}
                        >
                          <Lock className="h-4 w-4 mr-1" />
                          Raporu Aç
                        </Button>
                      </div>
                    </div>

                    {/* Report Includes Preview */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-medium text-slate-500 mb-2">Rapor İçeriği:</p>
                      <div className="flex flex-wrap gap-2">
                        {report.reportIncludes.slice(0, 4).map((item, index) => (
                          <span key={index} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                            {item}
                          </span>
                        ))}
                        {report.reportIncludes.length > 4 && (
                          <span className="text-xs text-violet-600">
                            +{report.reportIncludes.length - 4} daha
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sponsor Reports Tab */}
          <TabsContent value="sponsors" className="space-y-4">
            <div className="grid gap-4">
              {filteredSponsorReports.map((report) => (
                <Card key={report.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Sponsor Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
                          {report.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-slate-900 dark:text-white">{report.name}</h3>
                            {report.verified && (
                              <Shield className="h-4 w-4 text-emerald-500" />
                            )}
                            <Badge className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0">
                              {report.industry}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {formatCurrency(report.totalSponsored)} toplam
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              {report.completedDeals} anlaşma
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {report.purchaseCount} görüntüleme
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats Preview */}
                      <div className="grid grid-cols-3 gap-4 lg:gap-6">
                        <div className="text-center">
                          <p className="text-xs text-slate-500">Ödeme Hızı</p>
                          <p className="text-lg font-bold text-emerald-600">{report.avgPaymentSpeed}/5</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">İş Birliği</p>
                          <p className="text-lg font-bold text-blue-600">{report.collaborationScore}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">Güven</p>
                          <p className="text-lg font-bold text-amber-600">{report.trustScore}</p>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                            <Coins className="h-3 w-3 mr-1" />
                            {report.reportPrice} Kredi
                          </Badge>
                          <span className="text-sm text-slate-400">veya</span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {formatCurrency(report.cashPrice)}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handlePurchase(report)}
                        >
                          <Lock className="h-4 w-4 mr-1" />
                          Karneyi Aç
                        </Button>
                      </div>
                    </div>

                    {/* Report Includes Preview */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-medium text-slate-500 mb-2">Karne İçeriği:</p>
                      <div className="flex flex-wrap gap-2">
                        {report.reportIncludes.slice(0, 4).map((item, index) => (
                          <span key={index} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                            {item}
                          </span>
                        ))}
                        {report.reportIncludes.length > 4 && (
                          <span className="text-xs text-emerald-600">
                            +{report.reportIncludes.length - 4} daha
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* How It Works */}
        <Card className="mt-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Nasıl Çalışır?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-amber-600" />
                </div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">1. Rapor Seçin</h4>
                <p className="text-sm text-slate-500">
                  İş birliği yapmak istediğiniz yayıncı veya sponsorun raporunu bulun.
                </p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="h-6 w-6 text-violet-600" />
                </div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">2. Ödeme Yapın</h4>
                <p className="text-sm text-slate-500">
                  Kredi ile veya tek seferlik ödeme ile raporu satın alın.
                </p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                  <Unlock className="h-6 w-6 text-emerald-600" />
                </div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">3. Analiz Edin</h4>
                <p className="text-sm text-slate-500">
                  Doğrulanmış verilere anında erişin ve bilinçli kararlar verin.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Purchase Dialog */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Raporu Satın Al</DialogTitle>
            <DialogDescription>
              {selectedReport?.name} için doğrulanmış performans raporunu satın alın.
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              {/* Report Preview */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold",
                    activeTab === "creators" 
                      ? "bg-gradient-to-br from-violet-500 to-purple-600"
                      : "bg-gradient-to-br from-emerald-500 to-teal-600"
                  )}>
                    {selectedReport.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{selectedReport.name}</p>
                    <p className="text-xs text-slate-500">
                      {activeTab === "creators" ? "Performans Raporu" : "Sponsorluk Karnesi"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {selectedReport.reportIncludes.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Ödeme Yöntemi</p>
                
                <button
                  onClick={() => setPaymentMethod("credits")}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-colors",
                    paymentMethod === "credits"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Coins className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Kredi ile Öde</p>
                        <p className="text-sm text-slate-500">Mevcut: {userCredits} kredi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-amber-600">{selectedReport.reportPrice} Kredi</p>
                      {userCredits < selectedReport.reportPrice && (
                        <p className="text-xs text-red-500">Yetersiz bakiye</p>
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-colors",
                    paymentMethod === "cash"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Tek Seferlik Ödeme</p>
                        <p className="text-sm text-slate-500">Kredi/Banka Kartı</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-emerald-600">
                      {formatCurrency(selectedReport.cashPrice)}
                    </p>
                  </div>
                </button>
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="text-xs">
                  Satın aldığınız raporlar 30 gün boyunca erişilebilir kalır. 
                  Veriler her hafta güncellenir.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPurchaseDialogOpen(false)}>
              İptal
            </Button>
            {paymentMethod === "credits" && userCredits < (selectedReport?.reportPrice || 0) ? (
              <Button onClick={() => { setPurchaseDialogOpen(false); setCreditsDialogOpen(true); }}>
                <Coins className="h-4 w-4 mr-2" />
                Kredi Al
              </Button>
            ) : (
              <Button 
                onClick={confirmPurchase}
                className={paymentMethod === "credits" ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"}
              >
                {paymentMethod === "credits" ? (
                  <>
                    <Coins className="h-4 w-4 mr-2" />
                    {selectedReport?.reportPrice} Kredi Öde
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {formatCurrency(selectedReport?.cashPrice || 0)} Öde
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credits Dialog */}
      <Dialog open={creditsDialogOpen} onOpenChange={setCreditsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              Kredi Satın Al
            </DialogTitle>
            <DialogDescription>
              Kredi paketleri ile raporlara daha uygun fiyatlarla erişin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {creditPackages.map((pkg) => (
              <button
                key={pkg.id}
                className={cn(
                  "w-full p-4 rounded-lg border-2 text-left transition-colors relative",
                  pkg.popular
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-amber-300"
                )}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-2 right-4 bg-amber-500 text-white border-0">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    En Popüler
                  </Badge>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center",
                      pkg.popular 
                        ? "bg-amber-500 text-white" 
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                    )}>
                      <Coins className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {pkg.credits} Kredi
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatCurrency(pkg.perCredit)} / kredi
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {formatCurrency(pkg.price)}
                    </p>
                    {pkg.savings && (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                        %{pkg.savings} Tasarruf
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400">
            <Gift className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="text-xs">
              <strong>Hoş geldin bonusu:</strong> İlk kredi alımınızda %10 ekstra kredi hediye!
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreditsDialogOpen(false)}>
              İptal
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <CreditCard className="h-4 w-4 mr-2" />
              Ödemeye Geç
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
