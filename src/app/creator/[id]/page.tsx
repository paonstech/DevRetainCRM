"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  Shield,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Star,
  CheckCircle,
  Youtube,
  Instagram,
  Twitter,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Download,
  FileText,
  Presentation,
  MessageSquare,
  Heart,
  Share2,
  ExternalLink,
  Play,
  Eye,
  Zap,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// This would normally come from an API based on the [id] param
const creatorData = {
  id: "creator-1",
  name: "TechVision TR",
  type: "YOUTUBER",
  category: "Teknoloji",
  tagline: "Türkiye'nin en büyük teknoloji ve yazılım kanalı",
  description: "2018'den beri teknoloji dünyasındaki en son gelişmeleri, ürün incelemelerini ve yazılım eğitimlerini takipçilerimizle paylaşıyoruz. Hedef kitlemiz 18-35 yaş arası teknoloji meraklıları, yazılımcılar ve girişimcilerden oluşuyor.",
  avatar: null,
  coverImage: null,
  verified: true,
  location: "İstanbul, Türkiye",
  email: "sponsor@techvision.tr",
  website: "https://techvision.tr",
  socialLinks: {
    youtube: "https://youtube.com/@techvisiontr",
    instagram: "@techvisiontr",
    twitter: "@techvisiontr",
  },
  // Verified stats (from the system)
  verifiedStats: {
    totalFollowers: 2450000,
    avgViews: 450000,
    engagementRate: 8.5,
    avgROI: 28.5,
    avgROO: 91,
    completedCampaigns: 45,
    activeSponsors: 8,
    memberSince: "2022-03-15",
    trustScore: 94,
  },
  // Pricing
  pricing: {
    videoIntegration: { min: 50000, max: 100000 },
    dedicatedVideo: { min: 100000, max: 200000 },
    socialPost: { min: 15000, max: 30000 },
    story: { min: 10000, max: 20000 },
  },
  // Target audience
  audience: {
    ageGroups: [
      { range: "18-24", percentage: 35 },
      { range: "25-34", percentage: 42 },
      { range: "35-44", percentage: 18 },
      { range: "45+", percentage: 5 },
    ],
    gender: { male: 72, female: 28 },
    topLocations: ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"],
  },
  // Tags
  tags: ["teknoloji", "yazılım", "gadget", "review", "eğitim", "startup"],
  // Public files
  files: [
    {
      id: "1",
      name: "TechVision_MediaKit_2024.pdf",
      type: "pdf",
      size: 2450000,
      downloads: 45,
    },
    {
      id: "2",
      name: "Sponsorluk_Sunumu.pptx",
      type: "pptx",
      size: 8900000,
      downloads: 32,
    },
  ],
  // Past sponsors (anonymized)
  pastSponsors: [
    { category: "Teknoloji", count: 18 },
    { category: "Yazılım", count: 12 },
    { category: "Finans", count: 8 },
    { category: "E-ticaret", count: 7 },
  ],
}

const fileTypeConfig = {
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  pptx: { icon: Presentation, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
}

export default function CreatorProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const creator = creatorData // In real app, fetch based on params.id

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

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1000000) {
      return `${(bytes / 1000000).toFixed(1)} MB`
    }
    return `${(bytes / 1000).toFixed(0)} KB`
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/sponsor/discover" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Keşfet</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Paylaş
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Teklif Gönder
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500" />
        
        {/* Profile Info */}
        <div className="container px-4 md:px-6">
          <div className="relative -mt-16 md:-mt-20 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
              {/* Avatar */}
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-4xl md:text-5xl font-bold border-4 border-white dark:border-slate-900 shadow-xl">
                {creator.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              
              {/* Info */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    {creator.name}
                  </h1>
                  {creator.verified && (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                      <Shield className="h-3 w-3 mr-1" />
                      Doğrulanmış
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {creator.type === "YOUTUBER" ? "İçerik Üreticisi" : "Kulüp"}
                  </Badge>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">{creator.tagline}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {creator.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(creator.verifiedStats.memberSince).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}den beri üye
                  </span>
                </div>
              </div>

              {/* Trust Score */}
              <div className="hidden lg:block">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{creator.verifiedStats.trustScore}</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Güven Skoru</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-4 w-4",
                                star <= Math.round(creator.verifiedStats.trustScore / 20)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-300"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container px-4 md:px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
                <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                <TabsTrigger value="stats">İstatistikler</TabsTrigger>
                <TabsTrigger value="pricing">Fiyatlandırma</TabsTrigger>
                <TabsTrigger value="files">Media Kit</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* About */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Hakkında</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {creator.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {creator.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="px-3">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                      <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatNumber(creator.verifiedStats.totalFollowers)}
                      </p>
                      <p className="text-xs text-slate-500">Takipçi</p>
                      <Badge className="mt-2 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                        <CheckCircle className="h-2 w-2 mr-1" />
                        Doğrulanmış
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-emerald-600">
                        %{creator.verifiedStats.avgROI}
                      </p>
                      <p className="text-xs text-slate-500">Ortalama ROI</p>
                      <Badge className="mt-2 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                        <CheckCircle className="h-2 w-2 mr-1" />
                        Doğrulanmış
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                      <Target className="h-6 w-6 text-violet-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-violet-600">
                        {creator.verifiedStats.avgROO}
                      </p>
                      <p className="text-xs text-slate-500">Ortalama ROO</p>
                      <Badge className="mt-2 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                        <CheckCircle className="h-2 w-2 mr-1" />
                        Doğrulanmış
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                      <Award className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {creator.verifiedStats.completedCampaigns}
                      </p>
                      <p className="text-xs text-slate-500">Kampanya</p>
                      <Badge className="mt-2 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                        <CheckCircle className="h-2 w-2 mr-1" />
                        Doğrulanmış
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Past Sponsors */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Geçmiş Sponsorluklar</CardTitle>
                    <CardDescription>Kategorilere göre çalışılan sponsor sayısı</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {creator.pastSponsors.map((sponsor) => (
                        <div key={sponsor.category} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{sponsor.count}</p>
                          <p className="text-xs text-slate-500">{sponsor.category}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Stats Tab */}
              <TabsContent value="stats" className="space-y-6 mt-6">
                {/* Audience Demographics */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Kitle Demografisi</CardTitle>
                    <CardDescription>Takipçi yaş ve cinsiyet dağılımı</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Age Groups */}
                      <div>
                        <p className="text-sm font-medium text-slate-500 mb-3">Yaş Dağılımı</p>
                        <div className="space-y-3">
                          {creator.audience.ageGroups.map((group) => (
                            <div key={group.range}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{group.range}</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">%{group.percentage}</span>
                              </div>
                              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-violet-500 rounded-full"
                                  style={{ width: `${group.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <p className="text-sm font-medium text-slate-500 mb-3">Cinsiyet Dağılımı</p>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Erkek</span>
                              <span className="text-lg font-bold text-blue-600">%{creator.audience.gender.male}</span>
                            </div>
                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${creator.audience.gender.male}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Kadın</span>
                              <span className="text-lg font-bold text-pink-600">%{creator.audience.gender.female}</span>
                            </div>
                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-pink-500 rounded-full"
                                style={{ width: `${creator.audience.gender.female}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Locations */}
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-medium text-slate-500 mb-3">En Çok Takipçi Gelen Şehirler</p>
                      <div className="flex flex-wrap gap-2">
                        {creator.audience.topLocations.map((location) => (
                          <Badge key={location} variant="outline" className="px-3">
                            <MapPin className="h-3 w-3 mr-1" />
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Stats */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Performans Metrikleri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500">Ortalama İzlenme</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {formatNumber(creator.verifiedStats.avgViews)}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500">Etkileşim Oranı</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          %{creator.verifiedStats.engagementRate}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500">Aktif Sponsor</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {creator.verifiedStats.activeSponsors}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500">Güven Skoru</p>
                        <p className="text-xl font-bold text-emerald-600">
                          {creator.verifiedStats.trustScore}/100
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="space-y-6 mt-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Fiyatlandırma</CardTitle>
                    <CardDescription>Sponsorluk hizmetleri ve fiyat aralıkları</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                            <Play className="h-5 w-5 text-violet-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">Video Entegrasyonu</h4>
                            <p className="text-xs text-slate-500">Video içinde ürün/marka tanıtımı</p>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(creator.pricing.videoIntegration.min)}
                          </span>
                          <span className="text-slate-500">-</span>
                          <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(creator.pricing.videoIntegration.max)}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-emerald-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">Özel Video</h4>
                            <p className="text-xs text-slate-500">Tamamen sponsora ayrılmış video</p>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(creator.pricing.dedicatedVideo.min)}
                          </span>
                          <span className="text-slate-500">-</span>
                          <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(creator.pricing.dedicatedVideo.max)}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Instagram className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">Sosyal Medya Paylaşımı</h4>
                            <p className="text-xs text-slate-500">Instagram/Twitter gönderi</p>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(creator.pricing.socialPost.min)}
                          </span>
                          <span className="text-slate-500">-</span>
                          <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(creator.pricing.socialPost.max)}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-700 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-pink-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">Story / Reels</h4>
                            <p className="text-xs text-slate-500">Kısa format içerik</p>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(creator.pricing.story.min)}
                          </span>
                          <span className="text-slate-500">-</span>
                          <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(creator.pricing.story.max)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                      <p className="text-sm text-violet-700 dark:text-violet-400">
                        <strong>Not:</strong> Fiyatlar kampanya kapsamına, süresine ve özel gereksinimlere göre değişiklik gösterebilir. 
                        Detaylı teklif için iletişime geçin.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="space-y-6 mt-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Media Kit</CardTitle>
                    <CardDescription>İndirilebilir sponsorluk dosyaları</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {creator.files.map((file) => {
                        const config = fileTypeConfig[file.type as keyof typeof fileTypeConfig]
                        const FileIcon = config?.icon || FileText
                        return (
                          <div 
                            key={file.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn("p-3 rounded-lg", config?.bg || "bg-slate-100")}>
                                <FileIcon className={cn("h-6 w-6", config?.color || "text-slate-500")} />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">{file.name}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                  <span>{formatFileSize(file.size)}</span>
                                  <span>•</span>
                                  <span>{file.downloads} indirme</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              İndir
                            </Button>
                          </div>
                        )
                      })}
                    </div>

                    {creator.files.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">Henüz dosya yüklenmemiş.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">İletişim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Teklif Gönder
                </Button>
                
                <div className="space-y-3 pt-2">
                  {creator.email && (
                    <a 
                      href={`mailto:${creator.email}`}
                      className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {creator.email}
                    </a>
                  )}
                  {creator.website && (
                    <a 
                      href={creator.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      {creator.website.replace('https://', '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Sosyal Medya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {creator.socialLinks.youtube && (
                  <a 
                    href={creator.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Youtube className="h-5 w-5" />
                    <span className="text-sm font-medium">YouTube</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                {creator.socialLinks.instagram && (
                  <a 
                    href={`https://instagram.com/${creator.socialLinks.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="text-sm font-medium">{creator.socialLinks.instagram}</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                {creator.socialLinks.twitter && (
                  <a 
                    href={`https://twitter.com/${creator.socialLinks.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="text-sm font-medium">{creator.socialLinks.twitter}</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    DevRetain Doğrulanmış
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Bu profildeki tüm istatistikler DevRetain sistemi tarafından doğrulanmıştır. 
                  ROI ve ROO değerleri gerçek kampanya verilerine dayanmaktadır.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
