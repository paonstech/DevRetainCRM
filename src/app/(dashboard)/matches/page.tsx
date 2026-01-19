"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Star,
  Shield,
  ChevronRight,
  Eye,
  MessageSquare,
  Heart,
  Zap,
  Sparkles,
  Award,
  CheckCircle,
  Clock,
  Bell,
  Filter,
  ArrowRight,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  X,
  ChevronLeft,
  Building2,
  Youtube,
  Info,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  findMatchesForSponsor,
  mockCreators,
  mockSponsors,
  type MatchResult,
  type MatchNotification,
  createMatchNotification,
} from "@/lib/matching-engine"

// Generate matches on component mount
function generateMatches() {
  const matches: MatchResult[] = []
  const notifications: MatchNotification[] = []

  for (const sponsor of mockSponsors) {
    const sponsorMatches = findMatchesForSponsor(sponsor, mockCreators, 5)
    matches.push(...sponsorMatches)

    for (const match of sponsorMatches) {
      notifications.push(createMatchNotification(match, 'SPONSOR'))
      notifications.push(createMatchNotification(match, 'CREATOR'))
    }
  }

  return { matches, notifications }
}

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState("recommendations")
  const [userType, setUserType] = useState<"sponsor" | "creator">("sponsor")
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [notifications, setNotifications] = useState<MatchNotification[]>([])
  const [sortBy, setSortBy] = useState("matchScore")
  const [filterConfidence, setFilterConfidence] = useState("all")

  useEffect(() => {
    const { matches: generatedMatches, notifications: generatedNotifications } = generateMatches()
    setMatches(generatedMatches)
    setNotifications(generatedNotifications)
  }, [])

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

  // Filter matches based on user type (for demo, show all)
  const filteredMatches = matches
    .filter(m => filterConfidence === "all" || m.confidence === filterConfidence)
    .sort((a, b) => {
      switch (sortBy) {
        case "matchScore": return b.matchScore - a.matchScore
        case "potentialROI": return b.potentialROI - a.potentialROI
        case "potentialROO": return b.potentialROO - a.potentialROO
        default: return 0
      }
    })

  const userNotifications = notifications.filter(n => 
    n.recipientType === (userType === "sponsor" ? "SPONSOR" : "CREATOR")
  )

  const unreadCount = userNotifications.filter(n => !n.read).length

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "HIGH": return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30"
      case "MEDIUM": return "text-amber-600 bg-amber-100 dark:bg-amber-900/30"
      case "LOW": return "text-slate-600 bg-slate-100 dark:bg-slate-800"
      default: return "text-slate-600 bg-slate-100"
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-blue-600"
    if (score >= 40) return "text-amber-600"
    return "text-slate-600"
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Akıllı Eşleştirme</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* User Type Toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setUserType("sponsor")}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    userType === "sponsor"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400"
                  )}
                >
                  <Building2 className="h-4 w-4 inline mr-1" />
                  Sponsor
                </button>
                <button
                  onClick={() => setUserType("creator")}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    userType === "creator"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400"
                  )}
                >
                  <Youtube className="h-4 w-4 inline mr-1" />
                  Yayıncı
                </button>
              </div>

              {/* Notifications */}
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="container px-4 md:px-6 py-8">
          {/* Hero Section */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white">
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {userType === "sponsor" 
                  ? "Size Özel Yayıncı Önerileri" 
                  : "Size Özel Sponsor Fırsatları"}
              </h1>
              <p className="text-violet-100 mb-4">
                {userType === "sponsor"
                  ? "Hedeflerinize en uygun yayıncıları yapay zeka destekli algoritmamız ile bulduk."
                  : "Profilinize en uygun sponsor fırsatlarını yapay zeka destekli algoritmamız ile bulduk."}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                  <Target className="h-5 w-5" />
                  <span className="text-sm font-medium">Hedef Odaklı Eşleştirme</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm font-medium">Performans Analizi</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium">Doğrulanmış Veriler</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sırala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matchScore">Eşleşme Skoru</SelectItem>
                <SelectItem value="potentialROI">Potansiyel ROI</SelectItem>
                <SelectItem value="potentialROO">Potansiyel ROO</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterConfidence} onValueChange={setFilterConfidence}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Güven Seviyesi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="HIGH">Yüksek Güven</SelectItem>
                <SelectItem value="MEDIUM">Orta Güven</SelectItem>
                <SelectItem value="LOW">Düşük Güven</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1" />

            <Badge variant="outline" className="h-10 px-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              {filteredMatches.length} öneri bulundu
            </Badge>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 h-12">
              <TabsTrigger value="recommendations" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                Öneriler
                <Badge className="ml-1 bg-violet-500 text-white">{filteredMatches.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Bildirimler
                {unreadCount > 0 && (
                  <Badge className="ml-1 bg-red-500 text-white">{unreadCount}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-4">
              {filteredMatches.map((match) => {
                const creator = mockCreators.find(c => c.id === match.creatorId)
                const sponsor = mockSponsors.find(s => s.id === match.sponsorId)

                return (
                  <Card key={match.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    {/* Match Score Bar */}
                    <div className="h-1 bg-slate-100 dark:bg-slate-800">
                      <div 
                        className={cn(
                          "h-full transition-all",
                          match.matchScore >= 80 ? "bg-emerald-500" :
                          match.matchScore >= 60 ? "bg-blue-500" :
                          match.matchScore >= 40 ? "bg-amber-500" : "bg-slate-400"
                        )}
                        style={{ width: `${match.matchScore}%` }}
                      />
                    </div>

                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Match Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className={cn(
                            "h-16 w-16 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0",
                            userType === "sponsor"
                              ? "bg-gradient-to-br from-violet-500 to-purple-600"
                              : "bg-gradient-to-br from-emerald-500 to-teal-600"
                          )}>
                            {userType === "sponsor" 
                              ? match.creatorName.split(" ").map(n => n[0]).join("").slice(0, 2)
                              : match.sponsorName.split(" ").map(n => n[0]).join("").slice(0, 2)
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {userType === "sponsor" ? match.creatorName : match.sponsorName}
                              </h3>
                              <Shield className="h-4 w-4 text-emerald-500" />
                              <Badge className={cn("text-xs border-0", getConfidenceColor(match.confidence))}>
                                {match.confidence === "HIGH" ? "Yüksek Güven" :
                                 match.confidence === "MEDIUM" ? "Orta Güven" : "Düşük Güven"}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                              {userType === "sponsor" 
                                ? `${creator?.category} • ${formatNumber(creator?.followers || 0)} takipçi`
                                : `${sponsor?.industry} sektörü • ${sponsor?.completedDeals} anlaşma`
                              }
                            </p>

                            {/* Match Reasons */}
                            <div className="mt-3 space-y-1">
                              {match.matchReasons.slice(0, 3).map((reason, index) => (
                                <div 
                                  key={index}
                                  className={cn(
                                    "flex items-center gap-2 text-sm",
                                    reason.highlight 
                                      ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                      : "text-slate-600 dark:text-slate-400"
                                  )}
                                >
                                  {reason.highlight ? (
                                    <Star className="h-3 w-3 fill-current" />
                                  ) : (
                                    <CheckCircle className="h-3 w-3" />
                                  )}
                                  {reason.description}
                                </div>
                              ))}
                              {match.matchReasons.length > 3 && (
                                <button className="text-xs text-violet-600 hover:text-violet-700">
                                  +{match.matchReasons.length - 3} daha fazla neden
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Match Scores */}
                        <div className="grid grid-cols-4 gap-4 lg:gap-6">
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="text-center">
                                <p className="text-xs text-slate-500">Eşleşme</p>
                                <p className={cn("text-2xl font-bold", getMatchScoreColor(match.matchScore))}>
                                  %{match.matchScore}
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Genel eşleşme skoru</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger>
                              <div className="text-center">
                                <p className="text-xs text-slate-500">Kitle</p>
                                <p className="text-lg font-bold text-blue-600">%{match.audienceMatch}</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Hedef kitle uyumu</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger>
                              <div className="text-center">
                                <p className="text-xs text-slate-500">Tah. ROI</p>
                                <p className="text-lg font-bold text-emerald-600">%{match.potentialROI}</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tahmini yatırım getirisi</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger>
                              <div className="text-center">
                                <p className="text-xs text-slate-500">Tah. ROO</p>
                                <p className="text-lg font-bold text-violet-600">{match.potentialROO}</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tahmini hedef başarısı</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 lg:flex-col">
                          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 flex-1 lg:flex-none lg:w-full">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            İletişime Geç
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 lg:flex-none lg:w-full">
                            <Eye className="h-4 w-4 mr-1" />
                            Profil
                          </Button>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Breakdown */}
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${match.audienceMatch}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 w-12">Kitle</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${match.performanceMatch}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 w-12">Perf.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-violet-500 rounded-full"
                                style={{ width: `${match.categoryMatch}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 w-12">Kat.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${match.budgetMatch}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 w-12">Bütçe</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {filteredMatches.length === 0 && (
                <div className="text-center py-16">
                  <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Henüz Öneri Yok
                  </h3>
                  <p className="text-slate-500">
                    Hedeflerinizi güncelleyerek daha fazla eşleşme alabilirsiniz.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              {userNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={cn(
                    "border-0 shadow-sm transition-all",
                    !notification.read && "ring-2 ring-violet-500 ring-offset-2"
                  )}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                        !notification.read 
                          ? "bg-violet-100 dark:bg-violet-900/30" 
                          : "bg-slate-100 dark:bg-slate-800"
                      )}>
                        <Zap className={cn(
                          "h-6 w-6",
                          !notification.read ? "text-violet-600" : "text-slate-400"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge className="bg-violet-500 text-white text-xs">Yeni</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {notification.message}
                        </p>
                        
                        {notification.highlights.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {notification.highlights.map((highlight, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-emerald-600">
                                <Star className="h-3 w-3 fill-current" />
                                {highlight}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-3">
                          <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                            Detayları Gör
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                          <span className="text-xs text-slate-400">
                            {notification.createdAt.toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {userNotifications.length === 0 && (
                <div className="text-center py-16">
                  <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Bildirim Yok
                  </h3>
                  <p className="text-slate-500">
                    Yeni eşleşmeler olduğunda burada göreceksiniz.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* How Matching Works */}
          <Card className="mt-8 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-5 w-5 text-violet-500" />
                Eşleştirme Nasıl Çalışır?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">Kitle Analizi</h4>
                  <p className="text-xs text-slate-500">
                    Yaş, cinsiyet ve lokasyon hedeflerinize uygun kitle
                  </p>
                  <Badge variant="outline" className="mt-2">%30 ağırlık</Badge>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">Performans Geçmişi</h4>
                  <p className="text-xs text-slate-500">
                    ROI ve ROO başarı oranları değerlendirilir
                  </p>
                  <Badge variant="outline" className="mt-2">%25 ağırlık</Badge>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-violet-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">Kategori Uyumu</h4>
                  <p className="text-xs text-slate-500">
                    Sektör ve içerik türü eşleşmesi
                  </p>
                  <Badge variant="outline" className="mt-2">%20 ağırlık</Badge>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">Bütçe & Güven</h4>
                  <p className="text-xs text-slate-500">
                    Fiyat uyumu ve güvenilirlik skoru
                  </p>
                  <Badge variant="outline" className="mt-2">%25 ağırlık</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </TooltipProvider>
  )
}
