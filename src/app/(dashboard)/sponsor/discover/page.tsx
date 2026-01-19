"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  Users,
  TrendingUp,
  Star,
  Shield,
  Play,
  Instagram,
  Youtube,
  Twitter,
  ChevronLeft,
  Heart,
  Eye,
  MessageSquare,
  SlidersHorizontal,
  X,
  Check,
  Award,
  Zap,
  BarChart3,
  Target,
  Building2,
  Crown,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

// Mock data for discoverable creators/clubs
const discoverablePartners = [
  {
    id: "1",
    name: "TechVision TR",
    type: "YOUTUBER",
    category: "Teknoloji",
    description: "Teknoloji ve yazılım odaklı içerikler üreten Türkiye'nin en büyük tech kanalı.",
    avatar: null,
    followers: 2450000,
    avgViews: 450000,
    engagementRate: 8.5,
    avgROI: 28.5,
    trustScore: 94,
    completedCampaigns: 45,
    verified: true,
    platforms: ["youtube", "instagram", "twitter"],
    pricing: { min: 50000, max: 150000 },
    tags: ["teknoloji", "yazılım", "gadget", "review"],
    featured: true,
  },
  {
    id: "2",
    name: "Gaming Universe",
    type: "YOUTUBER",
    category: "Oyun",
    description: "Oyun incelemeleri, canlı yayınlar ve espor haberleri.",
    avatar: null,
    followers: 1850000,
    avgViews: 320000,
    engagementRate: 12.3,
    avgROI: 32.1,
    trustScore: 91,
    completedCampaigns: 38,
    verified: true,
    platforms: ["youtube", "twitch", "twitter"],
    pricing: { min: 40000, max: 120000 },
    tags: ["oyun", "espor", "canlı yayın", "gaming"],
    featured: true,
  },
  {
    id: "3",
    name: "Beşiktaş Espor",
    type: "CLUB",
    category: "Espor",
    description: "Beşiktaş JK resmi espor kulübü. LOL, Valorant ve CS2 takımları.",
    avatar: null,
    followers: 3200000,
    avgViews: 580000,
    engagementRate: 15.2,
    avgROI: 24.8,
    trustScore: 98,
    completedCampaigns: 62,
    verified: true,
    platforms: ["youtube", "twitter", "instagram"],
    pricing: { min: 200000, max: 500000 },
    tags: ["espor", "lol", "valorant", "cs2"],
    featured: true,
  },
  {
    id: "4",
    name: "Fit & Healthy",
    type: "YOUTUBER",
    category: "Sağlık",
    description: "Fitness, beslenme ve sağlıklı yaşam içerikleri.",
    avatar: null,
    followers: 890000,
    avgViews: 180000,
    engagementRate: 9.8,
    avgROI: 22.3,
    trustScore: 87,
    completedCampaigns: 24,
    verified: true,
    platforms: ["youtube", "instagram"],
    pricing: { min: 25000, max: 75000 },
    tags: ["fitness", "sağlık", "beslenme", "spor"],
    featured: false,
  },
  {
    id: "5",
    name: "Lezzet Durağı",
    type: "YOUTUBER",
    category: "Gıda",
    description: "Yemek tarifleri, restoran incelemeleri ve mutfak ipuçları.",
    avatar: null,
    followers: 1200000,
    avgViews: 250000,
    engagementRate: 11.2,
    avgROI: 26.7,
    trustScore: 89,
    completedCampaigns: 31,
    verified: true,
    platforms: ["youtube", "instagram", "tiktok"],
    pricing: { min: 30000, max: 90000 },
    tags: ["yemek", "tarif", "restoran", "mutfak"],
    featured: false,
  },
  {
    id: "6",
    name: "Auto Expert TR",
    type: "YOUTUBER",
    category: "Otomotiv",
    description: "Araba incelemeleri, test sürüşleri ve otomotiv haberleri.",
    avatar: null,
    followers: 780000,
    avgViews: 195000,
    engagementRate: 7.4,
    avgROI: 19.5,
    trustScore: 85,
    completedCampaigns: 18,
    verified: false,
    platforms: ["youtube", "instagram"],
    pricing: { min: 35000, max: 100000 },
    tags: ["otomotiv", "araba", "test", "review"],
    featured: false,
  },
  {
    id: "7",
    name: "Galatasaray Espor",
    type: "CLUB",
    category: "Espor",
    description: "Galatasaray SK resmi espor kulübü.",
    avatar: null,
    followers: 2800000,
    avgViews: 520000,
    engagementRate: 14.8,
    avgROI: 23.2,
    trustScore: 97,
    completedCampaigns: 55,
    verified: true,
    platforms: ["youtube", "twitter", "instagram"],
    pricing: { min: 180000, max: 450000 },
    tags: ["espor", "lol", "pubg", "fifa"],
    featured: false,
  },
  {
    id: "8",
    name: "Code Academy TR",
    type: "YOUTUBER",
    category: "Eğitim",
    description: "Yazılım eğitimleri, programlama dersleri ve kariyer tavsiyeleri.",
    avatar: null,
    followers: 650000,
    avgViews: 120000,
    engagementRate: 6.8,
    avgROI: 18.9,
    trustScore: 92,
    completedCampaigns: 22,
    verified: true,
    platforms: ["youtube", "twitter"],
    pricing: { min: 20000, max: 60000 },
    tags: ["yazılım", "eğitim", "programlama", "kariyer"],
    featured: false,
  },
]

const categories = [
  "Tümü",
  "Teknoloji",
  "Oyun",
  "Espor",
  "Sağlık",
  "Gıda",
  "Otomotiv",
  "Eğitim",
  "Yaşam",
  "Finans",
]

const platformIcons = {
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  twitch: Play,
  tiktok: Play,
}

export default function DiscoverPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tümü")
  const [sortBy, setSortBy] = useState("trustScore")
  const [filterOpen, setFilterOpen] = useState(false)
  
  // Filter states
  const [minFollowers, setMinFollowers] = useState("")
  const [maxFollowers, setMaxFollowers] = useState("")
  const [minROI, setMinROI] = useState("")
  const [minTrustScore, setMinTrustScore] = useState("")
  const [partnerType, setPartnerType] = useState("all")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  
  // Modal states
  const [offerModalOpen, setOfferModalOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<typeof discoverablePartners[0] | null>(null)
  const [offerMessage, setOfferMessage] = useState("")
  const [offerBudget, setOfferBudget] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  // Handle sending offer
  const handleSendOffer = async () => {
    if (!selectedPartner || !offerMessage || !offerBudget) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast({
      title: "Teklif Gönderildi! 🎉",
      description: `${selectedPartner.name} için teklifiniz başarıyla iletildi.`,
      variant: "success",
    })
    
    setIsSubmitting(false)
    setOfferModalOpen(false)
    setOfferMessage("")
    setOfferBudget("")
    setSelectedPartner(null)
  }

  // Handle opening offer modal
  const openOfferModal = (partner: typeof discoverablePartners[0]) => {
    setSelectedPartner(partner)
    setOfferBudget(partner.pricing.min.toString())
    setOfferModalOpen(true)
  }

  // Handle favorite toggle
  const toggleFavorite = (partnerId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(partnerId) 
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId]
      
      toast({
        title: prev.includes(partnerId) ? "Favorilerden Çıkarıldı" : "Favorilere Eklendi",
        description: prev.includes(partnerId) 
          ? "Partner favorilerinizden kaldırıldı."
          : "Partner favorilerinize eklendi.",
      })
      
      return newFavorites
    })
  }

  // Filter and sort partners
  const filteredPartners = discoverablePartners
    .filter(partner => {
      // Search query
      if (searchQuery && !partner.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !partner.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !partner.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false
      }
      // Category
      if (selectedCategory !== "Tümü" && partner.category !== selectedCategory) {
        return false
      }
      // Partner type
      if (partnerType !== "all" && partner.type !== partnerType) {
        return false
      }
      // Verified
      if (verifiedOnly && !partner.verified) {
        return false
      }
      // Followers
      if (minFollowers && partner.followers < parseInt(minFollowers)) {
        return false
      }
      if (maxFollowers && partner.followers > parseInt(maxFollowers)) {
        return false
      }
      // ROI
      if (minROI && partner.avgROI < parseFloat(minROI)) {
        return false
      }
      // Trust Score
      if (minTrustScore && partner.trustScore < parseInt(minTrustScore)) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "trustScore":
          return b.trustScore - a.trustScore
        case "followers":
          return b.followers - a.followers
        case "roi":
          return b.avgROI - a.avgROI
        case "engagement":
          return b.engagementRate - a.engagementRate
        default:
          return 0
      }
    })

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

  const clearFilters = () => {
    setMinFollowers("")
    setMaxFollowers("")
    setMinROI("")
    setMinTrustScore("")
    setPartnerType("all")
    setVerifiedOnly(false)
    setSelectedCategory("Tümü")
  }

  const hasActiveFilters = minFollowers || maxFollowers || minROI || minTrustScore || partnerType !== "all" || verifiedOnly || selectedCategory !== "Tümü"

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/sponsor" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Portal</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Keşfet</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Kanal, kulüp veya kategori ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 h-12">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trustScore">Güven Skoru</SelectItem>
                  <SelectItem value="followers">Takipçi Sayısı</SelectItem>
                  <SelectItem value="roi">Ortalama ROI</SelectItem>
                  <SelectItem value="engagement">Etkileşim Oranı</SelectItem>
                </SelectContent>
              </Select>

              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-12 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtreler
                    {hasActiveFilters && (
                      <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-emerald-500 text-white">
                        !
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Gelişmiş Filtreler</h4>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7">
                          <X className="h-3 w-3 mr-1" />
                          Temizle
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Partner Tipi</Label>
                        <Select value={partnerType} onValueChange={setPartnerType}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            <SelectItem value="YOUTUBER">İçerik Üreticisi</SelectItem>
                            <SelectItem value="CLUB">Kulüp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Min Takipçi</Label>
                          <Input
                            type="number"
                            placeholder="100000"
                            value={minFollowers}
                            onChange={(e) => setMinFollowers(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Max Takipçi</Label>
                          <Input
                            type="number"
                            placeholder="5000000"
                            value={maxFollowers}
                            onChange={(e) => setMaxFollowers(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Min ROI (%)</Label>
                          <Input
                            type="number"
                            placeholder="15"
                            value={minROI}
                            onChange={(e) => setMinROI(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Min Güven Skoru</Label>
                          <Input
                            type="number"
                            placeholder="80"
                            value={minTrustScore}
                            onChange={(e) => setMinTrustScore(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Label className="text-sm">Sadece Onaylı</Label>
                        <Button
                          variant={verifiedOnly ? "default" : "outline"}
                          size="sm"
                          onClick={() => setVerifiedOnly(!verifiedOnly)}
                          className={cn(
                            "h-8",
                            verifiedOnly && "bg-emerald-600 hover:bg-emerald-700"
                          )}
                        >
                          {verifiedOnly ? <Check className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700" 
                      onClick={() => setFilterOpen(false)}
                    >
                      Uygula
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "shrink-0",
                  selectedCategory === category && "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        {selectedCategory === "Tümü" && !searchQuery && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Öne Çıkanlar</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {discoverablePartners
                .filter(p => p.featured)
                .slice(0, 3)
                .map((partner) => (
                  <Card key={partner.id} className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                            {partner.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <h3 className="font-semibold text-slate-900 dark:text-white">{partner.name}</h3>
                              {partner.verified && (
                                <Shield className="h-4 w-4 text-emerald-500" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500">{partner.category}</p>
                          </div>
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Öne Çıkan
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {partner.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Users className="h-3 w-3" />
                            {formatNumber(partner.followers)}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <TrendingUp className="h-3 w-3" />
                            %{partner.avgROI} ROI
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-emerald-600 hover:text-emerald-700"
                          onClick={() => openOfferModal(partner)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          İncele
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              {filteredPartners.length} sonuç bulundu
            </p>
          </div>

          <div className="grid gap-4">
            {filteredPartners.map((partner) => (
              <Card key={partner.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Partner Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white text-xl font-bold shrink-0">
                        {partner.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{partner.name}</h3>
                          {partner.verified && (
                            <Shield className="h-4 w-4 text-emerald-500" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {partner.type === "YOUTUBER" ? "İçerik Üreticisi" : "Kulüp"}
                          </Badge>
                          <Badge className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0">
                            {partner.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{partner.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {partner.platforms.map((platform) => {
                            const Icon = platformIcons[platform as keyof typeof platformIcons] || Play
                            return (
                              <div key={platform} className="h-6 w-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Icon className="h-3 w-3 text-slate-500" />
                              </div>
                            )
                          })}
                          <div className="flex items-center gap-1 ml-2">
                            {partner.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs text-slate-400">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 lg:gap-6">
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Takipçi</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {formatNumber(partner.followers)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Ort. ROI</p>
                        <p className="text-lg font-bold text-emerald-600">%{partner.avgROI}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Güven</p>
                        <p className={cn(
                          "text-lg font-bold",
                          partner.trustScore >= 90 ? "text-emerald-600" : 
                          partner.trustScore >= 80 ? "text-blue-600" : "text-amber-600"
                        )}>
                          {partner.trustScore}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Kampanya</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {partner.completedCampaigns}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                      <p className="text-xs text-slate-500 lg:text-right">
                        {formatCurrency(partner.pricing.min)} - {formatCurrency(partner.pricing.max)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleFavorite(partner.id)}
                          className={cn(
                            favorites.includes(partner.id) && "bg-red-50 border-red-200 text-red-600"
                          )}
                        >
                          <Heart className={cn(
                            "h-4 w-4",
                            favorites.includes(partner.id) && "fill-current"
                          )} />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => openOfferModal(partner)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Teklif Gönder
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Sonuç Bulunamadı</h3>
              <p className="text-slate-500 mb-4">Arama kriterlerinize uygun partner bulunamadı.</p>
              <Button variant="outline" onClick={clearFilters}>
                Filtreleri Temizle
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredPartners.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" size="lg">
                Daha Fazla Göster
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Offer Modal */}
      <Dialog open={offerModalOpen} onOpenChange={setOfferModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedPartner && (
                <>
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                    {selectedPartner.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <span>{selectedPartner.name}</span>
                    <p className="text-sm font-normal text-slate-500">{selectedPartner.category}</p>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Sponsorluk teklifinizi gönderin. Partner en kısa sürede size dönüş yapacaktır.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Partner Stats */}
            {selectedPartner && (
              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div className="text-center">
                  <p className="text-xs text-slate-500">Takipçi</p>
                  <p className="font-semibold">{formatNumber(selectedPartner.followers)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Ort. ROI</p>
                  <p className="font-semibold text-emerald-600">%{selectedPartner.avgROI}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Güven Skoru</p>
                  <p className="font-semibold">{selectedPartner.trustScore}</p>
                </div>
              </div>
            )}

            {/* Budget Input */}
            <div className="space-y-2">
              <Label htmlFor="budget">Teklif Bütçesi (₺)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Bütçenizi girin"
                value={offerBudget}
                onChange={(e) => setOfferBudget(e.target.value)}
              />
              {selectedPartner && (
                <p className="text-xs text-slate-500">
                  Önerilen aralık: {formatCurrency(selectedPartner.pricing.min)} - {formatCurrency(selectedPartner.pricing.max)}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Mesajınız</Label>
              <Textarea
                id="message"
                placeholder="Sponsorluk teklifinizi detaylandırın..."
                rows={4}
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOfferModalOpen(false)}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button 
              onClick={handleSendOffer}
              disabled={isSubmitting || !offerMessage || !offerBudget}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Teklif Gönder
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Provider */}
      <Toaster />
    </div>
  )
}
