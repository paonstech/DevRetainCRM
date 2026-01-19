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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { useLocale } from "@/hooks/use-locale"

/**
 * KATEGORİ BAZLI PERFORMANS PROFİLLERİ
 * 
 * TEKNOLOJİ:
 * - Yüksek ROI (25-35%): Dönüşüm odaklı, satış yapan sponsorluklar
 * - Düşük-Orta ROO (65-80): Niş kitle, geniş marka bilinirliği zor
 * - Düşük Engagement (5-9%): İzleyici pasif, bilgi tüketimi ağırlıklı
 * - Yüksek Trust Score: Profesyonel içerik, güvenilir kaynak
 * 
 * OYUN/ESPOR:
 * - Orta-Yüksek ROI (20-32%): Genç kitle, impulsif satın alma
 * - Yüksek ROO (82-95): Marka sadakati, topluluk bağı güçlü
 * - Çok Yüksek Engagement (12-18%): Aktif topluluk, canlı yayın etkileşimi
 * - Yüksek Trust Score: Şeffaf içerik, topluluk güveni
 * 
 * SAĞLIK/FİTNESS:
 * - Orta ROI (18-26%): Uzun dönem müşteri, yavaş dönüşüm
 * - Çok Yüksek ROO (85-95): Yaşam tarzı değişimi, derin etki
 * - Yüksek Engagement (9-14%): Motivasyon, destek arayan kitle
 * - Orta Trust Score: Bilgi doğruluğu önemli
 * 
 * GIDA/YAŞAM:
 * - Orta ROI (15-24%): Geniş kitle, düşük birim fiyat
 * - Yüksek ROO (80-92): Günlük hayata entegre, hatırlanabilir
 * - Çok Yüksek Engagement (10-16%): Yorum, paylaşım yoğun
 * - Yüksek Trust Score: Samimi içerik
 * 
 * OTOMOTİV:
 * - Düşük ROI (12-20%): Yüksek bilet, uzun karar süreci
 * - Düşük ROO (55-72): Niş kitle, sınırlı erişim
 * - Düşük Engagement (5-8%): Pasif izleyici
 * - Orta Trust Score: Uzmanlık gerekli
 * 
 * EĞİTİM:
 * - Orta ROI (16-24%): Uzun dönem değer, yavaş dönüşüm
 * - Çok Yüksek ROO (88-96): Kariyer etkisi, hayat değiştiren
 * - Düşük-Orta Engagement (5-9%): Öğrenme odaklı, pasif tüketim
 * - Çok Yüksek Trust Score: Güvenilirlik kritik
 * 
 * FİNANS:
 * - Yüksek ROI (22-35%): Yüksek değerli müşteri
 * - Düşük ROO (60-75): Niş, karmaşık ürünler
 * - Düşük Engagement (4-7%): Hassas konu, az yorum
 * - Çok Yüksek Trust Score: Güven en önemli faktör
 */

// Mock data for discoverable creators/clubs - Mantıklı korelasyonlarla
const discoverablePartners = [
  // TEKNOLOJİ - Yüksek ROI, Düşük-Orta ROO, Düşük Engagement
  {
    id: "1",
    name: "TechVision TR",
    type: "YOUTUBER",
    category: "Teknoloji",
    description: "Türkiye'nin en büyük teknoloji kanalı. Ürün incelemeleri, yazılım haberleri ve gadget tanıtımları.",
    avatar: null,
    followers: 2450000,
    avgViews: 485000,  // %19.8 view rate - tech için yüksek
    engagementRate: 6.2,  // Tech için tipik - pasif izleyici
    avgROI: 31.5,  // Yüksek - doğrudan satış dönüşümü
    avgROO: 72,  // Orta - niş kitle, geniş erişim zor
    trustScore: 96,  // Çok yüksek - profesyonel kaynak
    completedCampaigns: 67,
    verified: true,
    platforms: ["youtube", "instagram", "twitter"],
    pricing: { min: 65000, max: 180000 },
    tags: ["teknoloji", "yazılım", "gadget", "review"],
    featured: true,
    audienceAge: "25-44",  // Tech kitlesi daha olgun
    audienceGender: { male: 78, female: 22 },
  },
  {
    id: "9",
    name: "Mobil Dünya",
    type: "YOUTUBER",
    category: "Teknoloji",
    description: "Akıllı telefon incelemeleri, karşılaştırmalar ve mobil teknoloji haberleri.",
    avatar: null,
    followers: 1680000,
    avgViews: 336000,
    engagementRate: 5.8,
    avgROI: 34.2,  // En yüksek ROI - direkt satış
    avgROO: 68,  // Düşük-orta - çok niş
    trustScore: 93,
    completedCampaigns: 52,
    verified: true,
    platforms: ["youtube", "instagram"],
    pricing: { min: 45000, max: 130000 },
    tags: ["telefon", "mobil", "android", "ios"],
    featured: false,
    audienceAge: "18-35",
    audienceGender: { male: 72, female: 28 },
  },

  // OYUN/ESPOR - Orta-Yüksek ROI, Çok Yüksek ROO, Çok Yüksek Engagement
  {
    id: "2",
    name: "Gaming Universe",
    type: "YOUTUBER",
    category: "Oyun",
    description: "Oyun incelemeleri, canlı yayınlar ve espor haberleri. Türkiye'nin en aktif gaming topluluğu.",
    avatar: null,
    followers: 1850000,
    avgViews: 425000,  // %23 view rate - gaming için normal
    engagementRate: 14.8,  // Çok yüksek - aktif topluluk
    avgROI: 26.4,  // Orta-yüksek - impulsif alım
    avgROO: 89,  // Çok yüksek - marka sadakati
    trustScore: 91,
    completedCampaigns: 48,
    verified: true,
    platforms: ["youtube", "twitch", "twitter"],
    pricing: { min: 40000, max: 110000 },
    tags: ["oyun", "espor", "canlı yayın", "gaming"],
    featured: true,
    audienceAge: "16-28",  // Genç kitle
    audienceGender: { male: 82, female: 18 },
  },
  {
    id: "3",
    name: "Beşiktaş Espor",
    type: "CLUB",
    category: "Espor",
    description: "Beşiktaş JK resmi espor kulübü. LOL, Valorant ve CS2 takımları. Şampiyon kadro.",
    avatar: null,
    followers: 3200000,
    avgViews: 768000,  // %24 view rate
    engagementRate: 16.5,  // En yüksek - taraftar bağı
    avgROI: 22.8,  // Orta - marka bilinirliği odaklı
    avgROO: 94,  // Çok yüksek - duygusal bağ
    trustScore: 98,  // Kurumsal güven
    completedCampaigns: 78,
    verified: true,
    platforms: ["youtube", "twitter", "instagram"],
    pricing: { min: 200000, max: 500000 },
    tags: ["espor", "lol", "valorant", "cs2", "beşiktaş"],
    featured: true,
    audienceAge: "16-35",
    audienceGender: { male: 76, female: 24 },
  },
  {
    id: "7",
    name: "Galatasaray Espor",
    type: "CLUB",
    category: "Espor",
    description: "Galatasaray SK resmi espor kulübü. PUBG Mobile ve Wild Rift şampiyonları.",
    avatar: null,
    followers: 2800000,
    avgViews: 644000,
    engagementRate: 15.9,
    avgROI: 21.5,
    avgROO: 92,
    trustScore: 97,
    completedCampaigns: 65,
    verified: true,
    platforms: ["youtube", "twitter", "instagram"],
    pricing: { min: 180000, max: 450000 },
    tags: ["espor", "pubg", "wildrift", "galatasaray"],
    featured: false,
    audienceAge: "16-35",
    audienceGender: { male: 74, female: 26 },
  },

  // SAĞLIK/FİTNESS - Orta ROI, Çok Yüksek ROO, Yüksek Engagement
  {
    id: "4",
    name: "Fit & Healthy",
    type: "YOUTUBER",
    category: "Sağlık",
    description: "Fitness, beslenme ve sağlıklı yaşam. Kilo verme hikayeleri ve antrenman programları.",
    avatar: null,
    followers: 890000,
    avgViews: 196000,  // %22 view rate
    engagementRate: 11.4,  // Yüksek - motivasyon arayan kitle
    avgROI: 19.8,  // Orta - uzun dönem müşteri
    avgROO: 91,  // Çok yüksek - yaşam değişimi
    trustScore: 86,  // Orta-yüksek
    completedCampaigns: 34,
    verified: true,
    platforms: ["youtube", "instagram"],
    pricing: { min: 22000, max: 65000 },
    tags: ["fitness", "sağlık", "beslenme", "diyet"],
    featured: false,
    audienceAge: "22-40",
    audienceGender: { male: 45, female: 55 },  // Kadın ağırlıklı
  },
  {
    id: "10",
    name: "Yoga & Mindfulness",
    type: "YOUTUBER",
    category: "Sağlık",
    description: "Yoga dersleri, meditasyon rehberleri ve mental sağlık içerikleri.",
    avatar: null,
    followers: 520000,
    avgViews: 114000,
    engagementRate: 12.8,  // Çok yüksek - sadık topluluk
    avgROI: 16.2,  // Düşük-orta - niş ürünler
    avgROO: 94,  // En yüksek - derin etki
    trustScore: 89,
    completedCampaigns: 28,
    verified: true,
    platforms: ["youtube", "instagram"],
    pricing: { min: 15000, max: 45000 },
    tags: ["yoga", "meditasyon", "mental sağlık", "wellness"],
    featured: false,
    audienceAge: "25-45",
    audienceGender: { male: 28, female: 72 },
  },

  // GIDA/YAŞAM - Orta ROI, Yüksek ROO, Çok Yüksek Engagement
  {
    id: "5",
    name: "Lezzet Durağı",
    type: "YOUTUBER",
    category: "Gıda",
    description: "Ev yapımı tarifler, restoran keşifleri ve mutfak ipuçları. Türk mutfağının dijital yüzü.",
    avatar: null,
    followers: 1200000,
    avgViews: 312000,  // %26 view rate - gıda için yüksek
    engagementRate: 13.6,  // Çok yüksek - yorum/paylaşım
    avgROI: 21.4,  // Orta - geniş kitle, düşük birim fiyat
    avgROO: 87,  // Yüksek - günlük hayata entegre
    trustScore: 91,
    completedCampaigns: 42,
    verified: true,
    platforms: ["youtube", "instagram", "tiktok"],
    pricing: { min: 28000, max: 85000 },
    tags: ["yemek", "tarif", "restoran", "mutfak"],
    featured: false,
    audienceAge: "25-50",
    audienceGender: { male: 35, female: 65 },
  },
  {
    id: "11",
    name: "Günlük Hayat",
    type: "YOUTUBER",
    category: "Yaşam",
    description: "Vlog, günlük rutinler, ev düzeni ve yaşam tarzı içerikleri.",
    avatar: null,
    followers: 980000,
    avgViews: 245000,
    engagementRate: 14.2,
    avgROI: 18.6,
    avgROO: 85,
    trustScore: 88,
    completedCampaigns: 38,
    verified: true,
    platforms: ["youtube", "instagram", "tiktok"],
    pricing: { min: 25000, max: 70000 },
    tags: ["vlog", "yaşam", "günlük", "lifestyle"],
    featured: false,
    audienceAge: "18-35",
    audienceGender: { male: 32, female: 68 },
  },

  // OTOMOTİV - Düşük ROI, Düşük ROO, Düşük Engagement
  {
    id: "6",
    name: "Auto Expert TR",
    type: "YOUTUBER",
    category: "Otomotiv",
    description: "Detaylı araba incelemeleri, test sürüşleri ve otomotiv haberleri.",
    avatar: null,
    followers: 780000,
    avgViews: 148000,  // %19 view rate - düşük
    engagementRate: 6.2,  // Düşük - pasif izleyici
    avgROI: 14.8,  // Düşük - yüksek bilet, uzun karar
    avgROO: 64,  // Düşük - niş kitle
    trustScore: 84,
    completedCampaigns: 22,
    verified: false,
    platforms: ["youtube", "instagram"],
    pricing: { min: 35000, max: 95000 },
    tags: ["otomotiv", "araba", "test", "review"],
    featured: false,
    audienceAge: "30-55",
    audienceGender: { male: 88, female: 12 },
  },
  {
    id: "12",
    name: "Motovlog TR",
    type: "YOUTUBER",
    category: "Otomotiv",
    description: "Motosiklet incelemeleri, sürüş videoları ve biker kültürü.",
    avatar: null,
    followers: 420000,
    avgViews: 84000,
    engagementRate: 7.8,  // Biraz daha yüksek - tutkulu kitle
    avgROI: 12.4,  // En düşük - çok niş
    avgROO: 58,  // En düşük
    trustScore: 82,
    completedCampaigns: 15,
    verified: false,
    platforms: ["youtube", "instagram"],
    pricing: { min: 18000, max: 50000 },
    tags: ["motosiklet", "motovlog", "biker", "sürüş"],
    featured: false,
    audienceAge: "25-45",
    audienceGender: { male: 92, female: 8 },
  },

  // EĞİTİM - Orta ROI, Çok Yüksek ROO, Düşük-Orta Engagement
  {
    id: "8",
    name: "Code Academy TR",
    type: "YOUTUBER",
    category: "Eğitim",
    description: "Yazılım eğitimleri, programlama dersleri ve kariyer tavsiyeleri. 50.000+ mezun.",
    avatar: null,
    followers: 650000,
    avgViews: 117000,  // %18 view rate
    engagementRate: 5.4,  // Düşük - öğrenme odaklı
    avgROI: 22.6,  // Orta-yüksek - yüksek değerli kurslar
    avgROO: 93,  // Çok yüksek - kariyer etkisi
    trustScore: 95,  // Çok yüksek - güvenilirlik kritik
    completedCampaigns: 31,
    verified: true,
    platforms: ["youtube", "twitter"],
    pricing: { min: 20000, max: 55000 },
    tags: ["yazılım", "eğitim", "programlama", "kariyer"],
    featured: false,
    audienceAge: "18-35",
    audienceGender: { male: 68, female: 32 },
  },
  {
    id: "13",
    name: "İngilizce Günlük",
    type: "YOUTUBER",
    category: "Eğitim",
    description: "İngilizce öğrenme, gramer dersleri ve konuşma pratiği.",
    avatar: null,
    followers: 1100000,
    avgViews: 198000,
    engagementRate: 6.8,
    avgROI: 19.2,
    avgROO: 88,
    trustScore: 92,
    completedCampaigns: 45,
    verified: true,
    platforms: ["youtube", "instagram"],
    pricing: { min: 25000, max: 70000 },
    tags: ["ingilizce", "dil", "eğitim", "öğrenme"],
    featured: false,
    audienceAge: "16-40",
    audienceGender: { male: 48, female: 52 },
  },

  // FİNANS - Yüksek ROI, Düşük ROO, Düşük Engagement
  {
    id: "14",
    name: "Finans Okulu",
    type: "YOUTUBER",
    category: "Finans",
    description: "Yatırım tavsiyeleri, borsa analizleri ve kişisel finans yönetimi.",
    avatar: null,
    followers: 720000,
    avgViews: 122000,  // %17 view rate
    engagementRate: 4.8,  // En düşük - hassas konu
    avgROI: 28.5,  // Yüksek - yüksek değerli müşteri
    avgROO: 68,  // Düşük - karmaşık ürünler
    trustScore: 94,  // Çok yüksek - güven kritik
    completedCampaigns: 26,
    verified: true,
    platforms: ["youtube", "twitter"],
    pricing: { min: 35000, max: 100000 },
    tags: ["finans", "yatırım", "borsa", "kripto"],
    featured: false,
    audienceAge: "28-50",
    audienceGender: { male: 76, female: 24 },
  },
  {
    id: "15",
    name: "Kripto Rehberi",
    type: "YOUTUBER",
    category: "Finans",
    description: "Kripto para analizleri, blockchain teknolojisi ve DeFi dünyası.",
    avatar: null,
    followers: 480000,
    avgViews: 96000,
    engagementRate: 5.6,
    avgROI: 32.8,  // En yüksek - yüksek risk/ödül kitlesi
    avgROO: 62,  // Düşük - çok niş
    trustScore: 88,
    completedCampaigns: 19,
    verified: false,
    platforms: ["youtube", "twitter"],
    pricing: { min: 28000, max: 75000 },
    tags: ["kripto", "bitcoin", "blockchain", "defi"],
    featured: false,
    audienceAge: "22-40",
    audienceGender: { male: 84, female: 16 },
  },
]

/**
 * SPONSOR/MARKA BAZLI PERFORMANS PROFİLLERİ
 * 
 * TEKNOLOJİ MARKALARI:
 * - Yüksek Bütçe: Ürün lansmanları için agresif harcama
 * - Çok Hızlı Ödeme (4.7-4.9): Profesyonel finans yönetimi
 * - Yüksek İş Birliği Skoru: Net brief, kolay iletişim
 * - Tercih: Tech, yazılım, gadget kanalları
 * 
 * OYUN/ESPOR MARKALARI:
 * - Orta-Yüksek Bütçe: Sürekli sponsorluk, uzun vadeli
 * - Hızlı Ödeme (4.4-4.7): Genç şirketler, dinamik
 * - Çok Yüksek İş Birliği: Yaratıcı özgürlük, eğlenceli
 * - Tercih: Gaming, espor, genç kitle
 * 
 * SAĞLIK/FİTNESS MARKALARI:
 * - Orta Bütçe: Uzun vadeli ortaklık odaklı
 * - Orta Ödeme Hızı (4.0-4.4): Onay süreçleri uzun
 * - Yüksek İş Birliği: İçerik kalitesi önemli
 * - Tercih: Fitness, wellness, yaşam tarzı
 * 
 * GIDA MARKALARI:
 * - Düşük-Orta Bütçe: Çok sayıda küçük kampanya
 * - Orta Ödeme Hızı (3.8-4.3): Büyük kurumsal yapı
 * - Orta İş Birliği: Katı marka kuralları
 * - Tercih: Yemek, yaşam, aile
 * 
 * OTOMOTİV MARKALARI:
 * - Yüksek Bütçe: Büyük kampanyalar, az sayıda
 * - Yavaş Ödeme (3.5-4.0): Kurumsal onay süreçleri
 * - Düşük İş Birliği: Katı kurallar, az esneklik
 * - Tercih: Otomotiv, teknoloji, premium yaşam
 * 
 * EĞİTİM MARKALARI:
 * - Düşük-Orta Bütçe: Değer odaklı, verimli
 * - Hızlı Ödeme (4.5-4.8): Startup kültürü
 * - Çok Yüksek İş Birliği: Eğitici içerik ortaklığı
 * - Tercih: Eğitim, kariyer, teknoloji
 * 
 * FİNANS MARKALARI:
 * - Çok Yüksek Bütçe: Premium pozisyonlama
 * - En Hızlı Ödeme (4.8-5.0): Profesyonel finans
 * - Orta İş Birliği: Regülasyon kısıtlamaları
 * - Tercih: Finans, teknoloji, eğitim
 */

// Mock data for discoverable sponsors/brands - Mantıklı korelasyonlarla
const discoverableSponsors = [
  // TEKNOLOJİ MARKALARI - Yüksek bütçe, hızlı ödeme, yüksek iş birliği
  {
    id: "s1",
    name: "TechCorp Türkiye",
    type: "BRAND",
    category: "Teknoloji",
    description: "Türkiye'nin lider teknoloji şirketi. Yazılım, donanım ve dijital çözümler. Fortune 500 şirketi.",
    logo: null,
    industry: "Teknoloji",
    totalSponsored: 4850000,  // Yüksek toplam harcama
    avgBudget: 95000,  // Yüksek ortalama
    paymentSpeed: 4.8,  // Çok hızlı
    collaborationScore: 94,  // Yüksek - profesyonel
    completedDeals: 58,
    trustScore: 97,
    verified: true,
    preferredCategories: ["teknoloji", "yazılım", "gadget"],
    budgetRange: { min: 60000, max: 180000 },
    featured: true,
    avgCampaignDuration: 45,  // gün
    responseTime: 24,  // saat içinde yanıt
  },
  {
    id: "s7",
    name: "MobilTech",
    type: "BRAND",
    category: "Teknoloji",
    description: "Akıllı telefon ve aksesuar markası. Türkiye'nin yerli teknoloji gururu.",
    logo: null,
    industry: "Teknoloji",
    totalSponsored: 2200000,
    avgBudget: 72000,
    paymentSpeed: 4.6,
    collaborationScore: 91,
    completedDeals: 34,
    trustScore: 93,
    verified: true,
    preferredCategories: ["teknoloji", "mobil", "yazılım"],
    budgetRange: { min: 45000, max: 140000 },
    featured: false,
    avgCampaignDuration: 30,
    responseTime: 36,
  },

  // OYUN/ESPOR MARKALARI - Orta-yüksek bütçe, hızlı ödeme, çok yüksek iş birliği
  {
    id: "s2",
    name: "GameZone",
    type: "BRAND",
    category: "Oyun",
    description: "Gaming aksesuarları ve oyun ekipmanları. Türkiye'nin en büyük gaming markası. Espor sponsoru.",
    logo: null,
    industry: "Oyun",
    totalSponsored: 2650000,
    avgBudget: 55000,
    paymentSpeed: 4.6,  // Hızlı - genç şirket
    collaborationScore: 96,  // En yüksek - yaratıcı özgürlük
    completedDeals: 52,
    trustScore: 92,
    verified: true,
    preferredCategories: ["oyun", "espor", "teknoloji"],
    budgetRange: { min: 30000, max: 110000 },
    featured: true,
    avgCampaignDuration: 60,  // Uzun vadeli
    responseTime: 12,  // Çok hızlı
  },
  {
    id: "s8",
    name: "Espor Arena",
    type: "BRAND",
    category: "Oyun",
    description: "Espor turnuva organizatörü ve yayın platformu. Türkiye'nin espor merkezi.",
    logo: null,
    industry: "Espor",
    totalSponsored: 1800000,
    avgBudget: 48000,
    paymentSpeed: 4.4,
    collaborationScore: 94,
    completedDeals: 41,
    trustScore: 89,
    verified: true,
    preferredCategories: ["espor", "oyun", "teknoloji"],
    budgetRange: { min: 25000, max: 90000 },
    featured: false,
    avgCampaignDuration: 90,  // Sezon boyu
    responseTime: 18,
  },

  // SAĞLIK/FİTNESS MARKALARI - Orta bütçe, orta ödeme, yüksek iş birliği
  {
    id: "s3",
    name: "FitLife",
    type: "BRAND",
    category: "Sağlık",
    description: "Sağlıklı yaşam ve fitness ürünleri. Supplement, spor giyim ve ekipman. 15 yıllık marka.",
    logo: null,
    industry: "Sağlık & Fitness",
    totalSponsored: 1450000,
    avgBudget: 38000,  // Orta
    paymentSpeed: 4.2,  // Orta - onay süreçleri
    collaborationScore: 89,  // Yüksek - içerik kalitesi önemli
    completedDeals: 42,
    trustScore: 91,
    verified: true,
    preferredCategories: ["sağlık", "fitness", "yaşam"],
    budgetRange: { min: 20000, max: 75000 },
    featured: false,
    avgCampaignDuration: 90,  // Uzun vadeli ortaklık
    responseTime: 48,
  },
  {
    id: "s9",
    name: "Wellness Plus",
    type: "BRAND",
    category: "Sağlık",
    description: "Doğal takviyeler ve organik ürünler. Sağlıklı yaşamın adresi.",
    logo: null,
    industry: "Wellness",
    totalSponsored: 680000,
    avgBudget: 28000,
    paymentSpeed: 4.0,
    collaborationScore: 86,
    completedDeals: 26,
    trustScore: 87,
    verified: true,
    preferredCategories: ["sağlık", "wellness", "yoga"],
    budgetRange: { min: 15000, max: 55000 },
    featured: false,
    avgCampaignDuration: 120,
    responseTime: 72,
  },

  // GIDA MARKALARI - Düşük-orta bütçe, orta ödeme, orta iş birliği
  {
    id: "s10",
    name: "Lezzet Markası",
    type: "BRAND",
    category: "Gıda",
    description: "Türkiye'nin sevilen gıda markası. Atıştırmalık ve içecek ürünleri.",
    logo: null,
    industry: "Gıda",
    totalSponsored: 2100000,
    avgBudget: 32000,  // Düşük-orta - çok kampanya
    paymentSpeed: 3.9,  // Orta-yavaş - kurumsal
    collaborationScore: 78,  // Orta - katı kurallar
    completedDeals: 68,  // Çok sayıda kampanya
    trustScore: 94,  // Yüksek - büyük marka
    verified: true,
    preferredCategories: ["gıda", "yaşam", "aile"],
    budgetRange: { min: 18000, max: 60000 },
    featured: false,
    avgCampaignDuration: 30,
    responseTime: 96,  // Yavaş - kurumsal
  },
  {
    id: "s11",
    name: "Kahve Dünyası",
    type: "BRAND",
    category: "Gıda",
    description: "Premium kahve ve cafe deneyimi. Türkiye'nin kahve markası.",
    logo: null,
    industry: "Gıda & İçecek",
    totalSponsored: 1350000,
    avgBudget: 35000,
    paymentSpeed: 4.1,
    collaborationScore: 82,
    completedDeals: 45,
    trustScore: 92,
    verified: true,
    preferredCategories: ["gıda", "yaşam", "lifestyle"],
    budgetRange: { min: 20000, max: 65000 },
    featured: false,
    avgCampaignDuration: 45,
    responseTime: 72,
  },

  // OTOMOTİV MARKALARI - Yüksek bütçe, yavaş ödeme, düşük iş birliği
  {
    id: "s5",
    name: "AutoDrive",
    type: "BRAND",
    category: "Otomotiv",
    description: "Otomotiv yedek parça ve aksesuar. Türkiye genelinde 500+ bayi ağı.",
    logo: null,
    industry: "Otomotiv",
    totalSponsored: 1650000,
    avgBudget: 82000,  // Yüksek - büyük kampanyalar
    paymentSpeed: 3.6,  // Yavaş - kurumsal onay
    collaborationScore: 72,  // Düşük - katı kurallar
    completedDeals: 22,  // Az sayıda
    trustScore: 86,
    verified: false,
    preferredCategories: ["otomotiv", "teknoloji"],
    budgetRange: { min: 55000, max: 150000 },
    featured: false,
    avgCampaignDuration: 60,
    responseTime: 120,  // Çok yavaş
  },
  {
    id: "s12",
    name: "Premium Motors",
    type: "BRAND",
    category: "Otomotiv",
    description: "Lüks araç satış ve kiralama. Premium segment lideri.",
    logo: null,
    industry: "Otomotiv",
    totalSponsored: 980000,
    avgBudget: 98000,  // En yüksek birim bütçe
    paymentSpeed: 3.8,
    collaborationScore: 68,  // En düşük - çok katı
    completedDeals: 12,  // En az
    trustScore: 88,
    verified: true,
    preferredCategories: ["otomotiv", "lüks", "yaşam"],
    budgetRange: { min: 70000, max: 180000 },
    featured: false,
    avgCampaignDuration: 90,
    responseTime: 168,  // 1 hafta
  },

  // EĞİTİM MARKALARI - Düşük-orta bütçe, hızlı ödeme, çok yüksek iş birliği
  {
    id: "s4",
    name: "EduTech Pro",
    type: "BRAND",
    category: "Eğitim",
    description: "Online eğitim platformu. Yazılım, dil ve kariyer eğitimleri. 500.000+ öğrenci.",
    logo: null,
    industry: "Eğitim",
    totalSponsored: 1680000,
    avgBudget: 32000,  // Düşük-orta - değer odaklı
    paymentSpeed: 4.7,  // Hızlı - startup kültürü
    collaborationScore: 95,  // Çok yüksek - eğitici içerik
    completedDeals: 56,
    trustScore: 96,
    verified: true,
    preferredCategories: ["eğitim", "yazılım", "kariyer"],
    budgetRange: { min: 18000, max: 65000 },
    featured: true,
    avgCampaignDuration: 120,  // Uzun vadeli
    responseTime: 24,
  },
  {
    id: "s13",
    name: "Dil Akademisi",
    type: "BRAND",
    category: "Eğitim",
    description: "Online dil eğitimi. İngilizce, Almanca, İspanyolca kursları.",
    logo: null,
    industry: "Eğitim",
    totalSponsored: 920000,
    avgBudget: 26000,
    paymentSpeed: 4.5,
    collaborationScore: 92,
    completedDeals: 38,
    trustScore: 93,
    verified: true,
    preferredCategories: ["eğitim", "dil", "kariyer"],
    budgetRange: { min: 15000, max: 50000 },
    featured: false,
    avgCampaignDuration: 90,
    responseTime: 36,
  },

  // FİNANS MARKALARI - Çok yüksek bütçe, en hızlı ödeme, orta iş birliği
  {
    id: "s6",
    name: "FinanceHub",
    type: "BRAND",
    category: "Finans",
    description: "Dijital bankacılık ve fintech çözümleri. Yatırım ve tasarruf uygulamaları. 2M+ kullanıcı.",
    logo: null,
    industry: "Finans",
    totalSponsored: 5200000,  // En yüksek toplam
    avgBudget: 125000,  // En yüksek ortalama
    paymentSpeed: 4.9,  // En hızlı - finans şirketi
    collaborationScore: 82,  // Orta - regülasyon
    completedDeals: 45,
    trustScore: 98,  // En yüksek - güven kritik
    verified: true,
    preferredCategories: ["finans", "teknoloji", "eğitim"],
    budgetRange: { min: 80000, max: 220000 },
    featured: true,
    avgCampaignDuration: 60,
    responseTime: 48,  // Hukuk onayı gerekli
  },
  {
    id: "s14",
    name: "Kripto Exchange",
    type: "BRAND",
    category: "Finans",
    description: "Türkiye'nin kripto para borsası. Bitcoin, Ethereum ve 200+ coin.",
    logo: null,
    industry: "Kripto",
    totalSponsored: 2800000,
    avgBudget: 88000,
    paymentSpeed: 4.8,
    collaborationScore: 78,  // Düşük-orta - regülasyon
    completedDeals: 35,
    trustScore: 89,
    verified: true,
    preferredCategories: ["finans", "kripto", "teknoloji"],
    budgetRange: { min: 55000, max: 160000 },
    featured: false,
    avgCampaignDuration: 45,
    responseTime: 72,
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
  const { locale } = useLocale()
  const [activeTab, setActiveTab] = useState("creators") // "creators" or "sponsors"
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(locale === 'tr' ? "Tümü" : "All")
  const [sortBy, setSortBy] = useState("trustScore")
  const [filterOpen, setFilterOpen] = useState(false)
  
  // Localized texts
  const t = {
    discover: locale === 'tr' ? 'Keşfet' : 'Discover',
    dashboard: locale === 'tr' ? 'Dashboard' : 'Dashboard',
    creators: locale === 'tr' ? 'İçerik Üreticileri' : 'Content Creators',
    sponsors: locale === 'tr' ? 'Sponsorlar & Markalar' : 'Sponsors & Brands',
    searchCreators: locale === 'tr' ? 'İçerik üreticisi ara...' : 'Search creators...',
    searchSponsors: locale === 'tr' ? 'Sponsor veya marka ara...' : 'Search sponsors or brands...',
    all: locale === 'tr' ? 'Tümü' : 'All',
    sortBy: locale === 'tr' ? 'Sırala' : 'Sort by',
    trustScore: locale === 'tr' ? 'Güven Skoru' : 'Trust Score',
    followers: locale === 'tr' ? 'Takipçi' : 'Followers',
    roi: locale === 'tr' ? 'ROI' : 'ROI',
    engagement: locale === 'tr' ? 'Etkileşim' : 'Engagement',
    filters: locale === 'tr' ? 'Filtreler' : 'Filters',
    advancedFilters: locale === 'tr' ? 'Gelişmiş Filtreler' : 'Advanced Filters',
    partnerType: locale === 'tr' ? 'Partner Tipi' : 'Partner Type',
    allTypes: locale === 'tr' ? 'Tüm Tipler' : 'All Types',
    youtuber: locale === 'tr' ? 'YouTuber' : 'YouTuber',
    streamer: locale === 'tr' ? 'Yayıncı' : 'Streamer',
    influencer: locale === 'tr' ? 'Influencer' : 'Influencer',
    club: locale === 'tr' ? 'Kulüp/Takım' : 'Club/Team',
    minFollowers: locale === 'tr' ? 'Min. Takipçi' : 'Min. Followers',
    maxFollowers: locale === 'tr' ? 'Max. Takipçi' : 'Max. Followers',
    minROI: locale === 'tr' ? 'Min. ROI (%)' : 'Min. ROI (%)',
    minTrust: locale === 'tr' ? 'Min. Güven Skoru' : 'Min. Trust Score',
    verifiedOnly: locale === 'tr' ? 'Sadece Doğrulanmış' : 'Verified Only',
    applyFilters: locale === 'tr' ? 'Filtreleri Uygula' : 'Apply Filters',
    clearFilters: locale === 'tr' ? 'Temizle' : 'Clear',
    featured: locale === 'tr' ? 'Öne Çıkanlar' : 'Featured',
    allPartners: locale === 'tr' ? 'Tüm Partnerler' : 'All Partners',
    allSponsors: locale === 'tr' ? 'Tüm Sponsorlar' : 'All Sponsors',
    verified: locale === 'tr' ? 'Doğrulanmış' : 'Verified',
    sendOffer: locale === 'tr' ? 'Teklif Gönder' : 'Send Offer',
    apply: locale === 'tr' ? 'Başvur' : 'Apply',
    viewProfile: locale === 'tr' ? 'Profil' : 'Profile',
    campaigns: locale === 'tr' ? 'kampanya' : 'campaigns',
    avgROI: locale === 'tr' ? 'Ort. ROI' : 'Avg. ROI',
    avgROO: locale === 'tr' ? 'Ort. ROO' : 'Avg. ROO',
    avgBudget: locale === 'tr' ? 'Ort. Bütçe' : 'Avg. Budget',
    paymentSpeed: locale === 'tr' ? 'Ödeme Hızı' : 'Payment Speed',
    collabScore: locale === 'tr' ? 'İşbirliği Skoru' : 'Collaboration Score',
    preferredCategories: locale === 'tr' ? 'Tercih Ettiği Kategoriler' : 'Preferred Categories',
    totalSponsored: locale === 'tr' ? 'Toplam Sponsorluk' : 'Total Sponsored',
    missingInfo: locale === 'tr' ? 'Eksik Bilgi' : 'Missing Information',
    fillAllFields: locale === 'tr' ? 'Lütfen tüm alanları doldurun.' : 'Please fill in all fields.',
    writeMessage: locale === 'tr' ? 'Lütfen bir mesaj yazın.' : 'Please write a message.',
    offerSent: locale === 'tr' ? 'Teklif Gönderildi! 🎉' : 'Offer Sent! 🎉',
    offerSentDesc: locale === 'tr' ? 'için teklifiniz başarıyla iletildi.' : 'Your offer has been sent successfully.',
    applicationSent: locale === 'tr' ? 'Başvuru Gönderildi! 🎉' : 'Application Sent! 🎉',
    applicationSentDesc: locale === 'tr' ? 'için başvurunuz başarıyla iletildi.' : 'Your application has been sent successfully.',
    addedToFavorites: locale === 'tr' ? 'Favorilere Eklendi' : 'Added to Favorites',
    removedFromFavorites: locale === 'tr' ? 'Favorilerden Çıkarıldı' : 'Removed from Favorites',
    budget: locale === 'tr' ? 'Bütçe' : 'Budget',
    message: locale === 'tr' ? 'Mesaj' : 'Message',
    sending: locale === 'tr' ? 'Gönderiliyor...' : 'Sending...',
    cancel: locale === 'tr' ? 'İptal' : 'Cancel',
    noResults: locale === 'tr' ? 'Sonuç bulunamadı' : 'No results found',
    tryDifferentFilters: locale === 'tr' ? 'Farklı filtreler deneyin veya arama terimini değiştirin.' : 'Try different filters or change your search term.',
  }
  
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
  const [selectedSponsor, setSelectedSponsor] = useState<typeof discoverableSponsors[0] | null>(null)
  const [offerMessage, setOfferMessage] = useState("")
  const [offerBudget, setOfferBudget] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  // Handle sending offer
  const handleSendOffer = async () => {
    if (selectedPartner && (!offerMessage || !offerBudget)) {
      toast({
        title: t.missingInfo,
        description: t.fillAllFields,
        variant: "destructive",
      })
      return
    }
    
    if (selectedSponsor && !offerMessage) {
      toast({
        title: t.missingInfo,
        description: t.writeMessage,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (selectedPartner) {
      toast({
        title: t.offerSent,
        description: `${selectedPartner.name} ${t.offerSentDesc}`,
        variant: "success",
      })
    } else if (selectedSponsor) {
      toast({
        title: t.applicationSent,
        description: `${selectedSponsor.name} ${t.applicationSentDesc}`,
        variant: "success",
      })
    }
    
    setIsSubmitting(false)
    setOfferModalOpen(false)
    setOfferMessage("")
    setOfferBudget("")
    setSelectedPartner(null)
    setSelectedSponsor(null)
  }

  // Handle opening offer modal
  const openOfferModal = (partner: typeof discoverablePartners[0]) => {
    setSelectedPartner(partner)
    setSelectedSponsor(null)
    setOfferBudget(partner.pricing.min.toString())
    setOfferModalOpen(true)
  }

  // Open sponsor contact modal
  const openSponsorModal = (sponsor: typeof discoverableSponsors[0]) => {
    setSelectedSponsor(sponsor)
    setSelectedPartner(null)
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

  // Filter sponsors
  const filteredSponsors = discoverableSponsors
    .filter(sponsor => {
      // Search query
      if (searchQuery && !sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !sponsor.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !sponsor.preferredCategories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false
      }
      // Category
      if (selectedCategory !== "Tümü" && sponsor.category !== selectedCategory) {
        return false
      }
      // Verified
      if (verifiedOnly && !sponsor.verified) {
        return false
      }
      // Trust Score
      if (minTrustScore && sponsor.trustScore < parseInt(minTrustScore)) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "trustScore":
          return b.trustScore - a.trustScore
        case "budget":
          return b.avgBudget - a.avgBudget
        case "deals":
          return b.completedDeals - a.completedDeals
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
        {/* Tabs for Creators vs Sponsors */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 h-12">
            <TabsTrigger value="creators" className="gap-2 px-6">
              <Users className="h-4 w-4" />
              İçerik Üreticileri
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="gap-2 px-6">
              <Building2 className="h-4 w-4" />
              Sponsorlar & Markalar
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder={activeTab === "creators" ? "Kanal, kulüp veya kategori ara..." : "Marka veya sektör ara..."}
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
                  {activeTab === "creators" ? (
                    <>
                      <SelectItem value="followers">Takipçi Sayısı</SelectItem>
                      <SelectItem value="roi">Ortalama ROI</SelectItem>
                      <SelectItem value="engagement">Etkileşim Oranı</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="budget">Ortalama Bütçe</SelectItem>
                      <SelectItem value="deals">Tamamlanan İş</SelectItem>
                    </>
                  )}
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

        {/* CREATORS TAB CONTENT */}
        {activeTab === "creators" && (
          <>
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
          </>
        )}

        {/* SPONSORS TAB CONTENT */}
        {activeTab === "sponsors" && (
          <>
            {/* Featured Sponsors */}
            {selectedCategory === "Tümü" && !searchQuery && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Öne Çıkan Markalar</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {discoverableSponsors
                    .filter(s => s.featured)
                    .slice(0, 3)
                    .map((sponsor) => (
                      <Card key={sponsor.id} className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                {sponsor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <h3 className="font-semibold text-slate-900 dark:text-white">{sponsor.name}</h3>
                                  {sponsor.verified && (
                                    <Shield className="h-4 w-4 text-violet-500" />
                                  )}
                                </div>
                                <p className="text-xs text-slate-500">{sponsor.industry}</p>
                              </div>
                            </div>
                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Öne Çıkan
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                            {sponsor.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs">
                              <span className="flex items-center gap-1 text-slate-500">
                                <Target className="h-3 w-3" />
                                {sponsor.completedDeals} iş birliği
                              </span>
                              <span className="flex items-center gap-1 text-violet-600 font-medium">
                                <TrendingUp className="h-3 w-3" />
                                {sponsor.trustScore} güven
                              </span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-violet-600 hover:text-violet-700"
                              onClick={() => openSponsorModal(sponsor)}
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

            {/* Sponsor Results */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">
                  {filteredSponsors.length} marka bulundu
                </p>
              </div>

              <div className="grid gap-4">
                {filteredSponsors.map((sponsor) => (
                  <Card key={sponsor.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Sponsor Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                            {sponsor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-slate-900 dark:text-white">{sponsor.name}</h3>
                              {sponsor.verified && (
                                <Shield className="h-4 w-4 text-violet-500" />
                              )}
                              <Badge className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0">
                                {sponsor.industry}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-1">{sponsor.description}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {sponsor.preferredCategories.slice(0, 4).map((cat) => (
                                <span key={cat} className="text-xs text-slate-400">#{cat}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4 lg:gap-6">
                          <div className="text-center">
                            <p className="text-xs text-slate-500">Ort. Bütçe</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                              {formatCurrency(sponsor.avgBudget)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500">Güven</p>
                            <p className={cn(
                              "text-lg font-bold",
                              sponsor.trustScore >= 90 ? "text-emerald-600" : 
                              sponsor.trustScore >= 80 ? "text-blue-600" : "text-amber-600"
                            )}>
                              {sponsor.trustScore}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500">Ödeme Hızı</p>
                            <p className="text-lg font-bold text-violet-600">{sponsor.paymentSpeed}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500">İş Birliği</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                              {sponsor.completedDeals}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                          <p className="text-xs text-slate-500 lg:text-right">
                            {formatCurrency(sponsor.budgetRange.min)} - {formatCurrency(sponsor.budgetRange.max)}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toggleFavorite(sponsor.id)}
                              className={cn(
                                favorites.includes(sponsor.id) && "bg-red-50 border-red-200 text-red-600"
                              )}
                            >
                              <Heart className={cn(
                                "h-4 w-4",
                                favorites.includes(sponsor.id) && "fill-current"
                              )} />
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-violet-600 hover:bg-violet-700"
                              onClick={() => openSponsorModal(sponsor)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              İletişime Geç
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredSponsors.length === 0 && (
                <div className="text-center py-16">
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Sonuç Bulunamadı</h3>
                  <p className="text-slate-500 mb-4">Arama kriterlerinize uygun marka bulunamadı.</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Filtreleri Temizle
                  </Button>
                </div>
              )}

              {/* Load More */}
              {filteredSponsors.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button variant="outline" size="lg">
                    Daha Fazla Göster
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Offer Modal - Works for both Creators and Sponsors */}
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
              {selectedSponsor && (
                <>
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {selectedSponsor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <span>{selectedSponsor.name}</span>
                    <p className="text-sm font-normal text-slate-500">{selectedSponsor.industry}</p>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedPartner 
                ? "Sponsorluk teklifinizi gönderin. Partner en kısa sürede size dönüş yapacaktır."
                : "Sponsorluk başvurunuzu gönderin. Marka en kısa sürede size dönüş yapacaktır."
              }
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

            {/* Sponsor Stats */}
            {selectedSponsor && (
              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div className="text-center">
                  <p className="text-xs text-slate-500">Ort. Bütçe</p>
                  <p className="font-semibold">{formatCurrency(selectedSponsor.avgBudget)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Ödeme Hızı</p>
                  <p className="font-semibold text-violet-600">{selectedSponsor.paymentSpeed}/5</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Güven Skoru</p>
                  <p className="font-semibold">{selectedSponsor.trustScore}</p>
                </div>
              </div>
            )}

            {/* Budget Input - Only for creators contacting sponsors */}
            {selectedPartner && (
              <div className="space-y-2">
                <Label htmlFor="budget">Teklif Bütçesi (₺)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Bütçenizi girin"
                  value={offerBudget}
                  onChange={(e) => setOfferBudget(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Önerilen aralık: {formatCurrency(selectedPartner.pricing.min)} - {formatCurrency(selectedPartner.pricing.max)}
                </p>
              </div>
            )}

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
              disabled={isSubmitting || !offerMessage || (!!selectedPartner && !offerBudget)}
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
                  {selectedPartner ? "Teklif Gönder" : "Başvuru Gönder"}
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
