"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  Upload,
  FileText,
  File,
  Trash2,
  Eye,
  Download,
  Plus,
  ChevronLeft,
  Image,
  Video,
  Link as LinkIcon,
  ExternalLink,
  Shield,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Star,
  CheckCircle,
  Edit,
  Save,
  X,
  Youtube,
  Instagram,
  Twitter,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Sparkles,
  FileImage,
  Presentation,
  FileSpreadsheet,
  Palette,
  Settings,
  Share2,
  Copy,
  Check,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocale } from "@/hooks/use-locale"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

// Mock data for the creator's profile
const creatorProfile = {
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
  phone: "+90 532 123 4567",
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
    totalRevenue: 2850000,
    activeSponsors: 8,
    memberSince: "2022-03-15",
    lastCampaignDate: "2024-11-10",
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
}

// Mock uploaded files
const initialFiles = [
  {
    id: "1",
    name: "TechVision_MediaKit_2024.pdf",
    type: "pdf",
    size: 2450000,
    uploadedAt: "2024-11-15",
    downloads: 45,
    isPublic: true,
  },
  {
    id: "2",
    name: "Sponsorluk_Sunumu.pptx",
    type: "pptx",
    size: 8900000,
    uploadedAt: "2024-11-10",
    downloads: 32,
    isPublic: true,
  },
  {
    id: "3",
    name: "Kitle_Analizi_Q4.pdf",
    type: "pdf",
    size: 1200000,
    uploadedAt: "2024-10-28",
    downloads: 18,
    isPublic: false,
  },
]

const fileTypeConfig = {
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  pptx: { icon: Presentation, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  xlsx: { icon: FileSpreadsheet, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  image: { icon: FileImage, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  default: { icon: File, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800" },
}

export default function MediaKitPage() {
  const { toast } = useToast()
  const { locale } = useLocale()
  const [activeTab, setActiveTab] = useState("profile")
  const [files, setFiles] = useState(initialFiles)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(creatorProfile)
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Localized texts
  const t = {
    mediaKit: locale === 'tr' ? 'Media Kit' : 'Media Kit',
    dashboard: locale === 'tr' ? 'Dashboard' : 'Dashboard',
    profile: locale === 'tr' ? 'Profil' : 'Profile',
    files: locale === 'tr' ? 'Dosyalar' : 'Files',
    statistics: locale === 'tr' ? 'İstatistikler' : 'Statistics',
    pricing: locale === 'tr' ? 'Fiyatlandırma' : 'Pricing',
    editProfile: locale === 'tr' ? 'Profili Düzenle' : 'Edit Profile',
    saveChanges: locale === 'tr' ? 'Değişiklikleri Kaydet' : 'Save Changes',
    cancel: locale === 'tr' ? 'İptal' : 'Cancel',
    name: locale === 'tr' ? 'İsim' : 'Name',
    tagline: locale === 'tr' ? 'Slogan' : 'Tagline',
    bio: locale === 'tr' ? 'Biyografi' : 'Bio',
    category: locale === 'tr' ? 'Kategori' : 'Category',
    uploadFiles: locale === 'tr' ? 'Dosya Yükle' : 'Upload Files',
    dragDrop: locale === 'tr' ? 'Sürükle & Bırak veya tıklayarak dosya seçin' : 'Drag & Drop or click to select files',
    supportedFormats: locale === 'tr' ? 'Desteklenen formatlar: PDF, PPTX, XLSX, PNG, JPG' : 'Supported formats: PDF, PPTX, XLSX, PNG, JPG',
    yourFiles: locale === 'tr' ? 'Dosyalarınız' : 'Your Files',
    noFiles: locale === 'tr' ? 'Henüz dosya yüklenmedi' : 'No files uploaded yet',
    visible: locale === 'tr' ? 'Görünür' : 'Visible',
    hidden: locale === 'tr' ? 'Gizli' : 'Hidden',
    delete: locale === 'tr' ? 'Sil' : 'Delete',
    verifiedStats: locale === 'tr' ? 'Doğrulanmış İstatistikler' : 'Verified Statistics',
    followers: locale === 'tr' ? 'Takipçi' : 'Followers',
    avgROI: locale === 'tr' ? 'Ort. ROI' : 'Avg. ROI',
    rooScore: locale === 'tr' ? 'ROO Skoru' : 'ROO Score',
    campaigns: locale === 'tr' ? 'Kampanya' : 'Campaigns',
    audienceDemo: locale === 'tr' ? 'Kitle Demografisi' : 'Audience Demographics',
    age: locale === 'tr' ? 'Yaş' : 'Age',
    gender: locale === 'tr' ? 'Cinsiyet' : 'Gender',
    location: locale === 'tr' ? 'Konum' : 'Location',
    pricingSettings: locale === 'tr' ? 'Fiyatlandırma Ayarları' : 'Pricing Settings',
    contentType: locale === 'tr' ? 'İçerik Tipi' : 'Content Type',
    price: locale === 'tr' ? 'Fiyat' : 'Price',
    shareProfile: locale === 'tr' ? 'Profili Paylaş' : 'Share Profile',
    copyLink: locale === 'tr' ? 'Linki Kopyala' : 'Copy Link',
    copied: locale === 'tr' ? 'Kopyalandı!' : 'Copied!',
    saving: locale === 'tr' ? 'Kaydediliyor...' : 'Saving...',
    uploading: locale === 'tr' ? 'Yükleniyor...' : 'Uploading...',
    profileSaved: locale === 'tr' ? 'Profil Kaydedildi! ✨' : 'Profile Saved! ✨',
    profileSavedDesc: locale === 'tr' ? 'Değişiklikleriniz başarıyla kaydedildi.' : 'Your changes have been saved successfully.',
    fileUploaded: locale === 'tr' ? 'Dosya Yüklendi! 📁' : 'File Uploaded! 📁',
    fileUploadedDesc: locale === 'tr' ? 'başarıyla yüklendi.' : 'has been uploaded successfully.',
    fileDeleted: locale === 'tr' ? 'Dosya Silindi' : 'File Deleted',
    fileDeletedDesc: locale === 'tr' ? 'Dosya başarıyla silindi.' : 'File has been deleted successfully.',
    visibilityChanged: locale === 'tr' ? 'Görünürlük Değiştirildi' : 'Visibility Changed',
    nowVisible: locale === 'tr' ? 'artık görünür.' : 'is now visible.',
    nowHidden: locale === 'tr' ? 'artık gizli.' : 'is now hidden.',
  }

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1000000) {
      return `${(bytes / 1000000).toFixed(1)} MB`
    }
    return `${(bytes / 1000).toFixed(0)} KB`
  }

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
    return new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles) return

    setIsUploading(true)

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    Array.from(uploadedFiles).forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase() || ''
      const newFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: extension,
        size: file.size,
        uploadedAt: new Date().toISOString().split('T')[0],
        downloads: 0,
        isPublic: true,
      }
      setFiles(prev => [newFile, ...prev])
    })

    setIsUploading(false)
    
    toast({
      title: "Dosya Yüklendi! 📁",
      description: `${uploadedFiles.length} dosya başarıyla yüklendi.`,
      variant: "success",
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSaving(false)
    setIsEditing(false)
    
    toast({
      title: "Profil Güncellendi! ✨",
      description: "Değişiklikleriniz başarıyla kaydedildi.",
      variant: "success",
    })
  }

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
    toast({
      title: "Dosya Silindi",
      description: "Dosya başarıyla kaldırıldı.",
    })
  }

  const handleToggleFileVisibility = (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, isPublic: !f.isPublic } : f
    ))
    const file = files.find(f => f.id === fileId)
    toast({
      title: file?.isPublic ? "Dosya Gizlendi" : "Dosya Yayınlandı",
      description: file?.isPublic 
        ? "Dosya artık sponsorlar tarafından görülemez."
        : "Dosya artık sponsorlar tarafından görülebilir.",
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://devretain.com/creator/${profile.id}`)
    setCopied(true)
    toast({
      title: "Link Kopyalandı! 🔗",
      description: "Profil linkiniz panoya kopyalandı.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = e.dataTransfer.files
    Array.from(droppedFiles).forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase() || ''
      const allowedTypes = ['pdf', 'pptx', 'ppt', 'xlsx', 'xls', 'png', 'jpg', 'jpeg']
      
      if (allowedTypes.includes(extension)) {
        const newFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: extension,
          size: file.size,
          uploadedAt: new Date().toISOString().split('T')[0],
          downloads: 0,
          isPublic: true,
        }
        setFiles(prev => [newFile, ...prev])
      }
    })
  }

  // Legacy functions - now using toast-enabled versions above

  const publicFiles = files.filter(f => f.isPublic)

  return (
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
              <Palette className="h-5 w-5 text-violet-500" />
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Media Kit Builder</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-emerald-500" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Paylaş
                </>
              )}
            </Button>
            <Button size="sm" onClick={() => window.open(`/creator/${profile.id}`, '_blank')}>
              <Eye className="h-4 w-4 mr-2" />
              Önizle
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 h-12">
            <TabsTrigger value="profile" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Dosyalar</span>
              <Badge className="ml-1 h-5 px-1.5 text-xs bg-violet-500 text-white">
                {files.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">İstatistikler</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Fiyatlandırma</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Edit Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Profil Bilgileri</CardTitle>
                        <CardDescription>Sponsorlara gösterilecek temel bilgiler</CardDescription>
                      </div>
                      <Button
                        variant={isEditing ? "default" : "outline"}
                        size="sm"
                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Kaydediliyor...
                          </>
                        ) : isEditing ? (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Kaydet
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Düzenle
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Kanal / Kulüp Adı</Label>
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Slogan</Label>
                        <Input
                          value={profile.tagline}
                          onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                          disabled={!isEditing}
                          placeholder="Kısa ve etkileyici bir slogan"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Açıklama</Label>
                      <Textarea
                        value={profile.description}
                        onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Kanalınızı ve hedef kitlenizi tanıtın"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Kategori</Label>
                        <Select 
                          value={profile.category} 
                          onValueChange={(v) => setProfile({ ...profile, category: v })}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                            <SelectItem value="Oyun">Oyun</SelectItem>
                            <SelectItem value="Espor">Espor</SelectItem>
                            <SelectItem value="Sağlık">Sağlık</SelectItem>
                            <SelectItem value="Gıda">Gıda</SelectItem>
                            <SelectItem value="Eğitim">Eğitim</SelectItem>
                            <SelectItem value="Yaşam">Yaşam</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Konum</Label>
                        <Input
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">İletişim Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          E-posta
                        </Label>
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          Telefon
                        </Label>
                        <Input
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-400" />
                        Web Sitesi
                      </Label>
                      <Input
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Sosyal Medya Linkleri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Youtube className="h-4 w-4 text-red-500" />
                          YouTube
                        </Label>
                        <Input
                          value={profile.socialLinks.youtube}
                          onChange={(e) => setProfile({ 
                            ...profile, 
                            socialLinks: { ...profile.socialLinks, youtube: e.target.value }
                          })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-pink-500" />
                          Instagram
                        </Label>
                        <Input
                          value={profile.socialLinks.instagram}
                          onChange={(e) => setProfile({ 
                            ...profile, 
                            socialLinks: { ...profile.socialLinks, instagram: e.target.value }
                          })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-sky-500" />
                        Twitter / X
                      </Label>
                      <Input
                        value={profile.socialLinks.twitter}
                        onChange={(e) => setProfile({ 
                          ...profile, 
                          socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Etiketler</CardTitle>
                    <CardDescription>İçerik türlerinizi tanımlayan anahtar kelimeler</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          #{tag}
                          {isEditing && (
                            <button 
                              className="ml-2 text-slate-400 hover:text-red-500"
                              onClick={() => setProfile({
                                ...profile,
                                tags: profile.tags.filter((_, i) => i !== index)
                              })}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                      {isEditing && (
                        <Button variant="outline" size="sm" className="h-7">
                          <Plus className="h-3 w-3 mr-1" />
                          Ekle
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Card */}
              <div className="space-y-6">
                <Card className="border-0 shadow-sm sticky top-24">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Profil Önizleme</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      {/* Cover */}
                      <div className="h-24 bg-gradient-to-br from-violet-500 to-purple-600" />
                      
                      {/* Avatar & Info */}
                      <div className="px-4 pb-4">
                        <div className="flex items-end gap-3 -mt-8">
                          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold border-4 border-white dark:border-slate-900 shadow-lg">
                            {profile.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="flex-1 pb-1">
                            <div className="flex items-center gap-1">
                              <h3 className="font-semibold text-slate-900 dark:text-white">{profile.name}</h3>
                              {profile.verified && (
                                <Shield className="h-4 w-4 text-emerald-500" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500">{profile.category}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-2">
                          {profile.tagline}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                              {formatNumber(profile.verifiedStats.totalFollowers)}
                            </p>
                            <p className="text-xs text-slate-500">Takipçi</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                            <p className="text-lg font-bold text-emerald-600">
                              %{profile.verifiedStats.avgROI}
                            </p>
                            <p className="text-xs text-slate-500">ROI</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                            <p className="text-lg font-bold text-violet-600">
                              {profile.verifiedStats.avgROO}
                            </p>
                            <p className="text-xs text-slate-500">ROO</p>
                          </div>
                        </div>

                        {/* Verified Badge */}
                        <div className="flex items-center gap-2 mt-4 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-xs text-emerald-700 dark:text-emerald-400">
                            DevRetain tarafından doğrulanmış istatistikler
                          </span>
                        </div>

                        {/* Files Preview */}
                        {publicFiles.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-medium text-slate-500 mb-2">Media Kit</p>
                            <div className="space-y-1">
                              {publicFiles.slice(0, 2).map((file) => {
                                const config = fileTypeConfig[file.type as keyof typeof fileTypeConfig] || fileTypeConfig.default
                                const FileIcon = config.icon
                                return (
                                  <div key={file.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                                    <div className={cn("p-1.5 rounded", config.bg)}>
                                      <FileIcon className={cn("h-3 w-3", config.color)} />
                                    </div>
                                    <span className="text-xs text-slate-600 dark:text-slate-400 truncate flex-1">
                                      {file.name}
                                    </span>
                                    <Download className="h-3 w-3 text-slate-400" />
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-6">
            {/* Upload Area */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                    isDragging 
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20" 
                      : "border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.pptx,.ppt,.xlsx,.xls,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="h-16 w-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-violet-500" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Dosya Yükle
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    PDF, PPTX, XLSX veya görsel dosyalarını sürükleyip bırakın
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Dosya Seç
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* File List */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Yüklenen Dosyalar</CardTitle>
                <CardDescription>Sponsorluk dosyalarınızı yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file) => {
                    const config = fileTypeConfig[file.type as keyof typeof fileTypeConfig] || fileTypeConfig.default
                    const FileIcon = config.icon
                    return (
                      <div 
                        key={file.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("p-3 rounded-lg", config.bg)}>
                            <FileIcon className={cn("h-6 w-6", config.color)} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{file.name}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span>{new Date(file.uploadedAt).toLocaleDateString('tr-TR')}</span>
                              <span>•</span>
                              <span>{file.downloads} indirme</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-slate-500">Herkese Açık</Label>
                            <Switch
                              checked={file.isPublic}
                              onCheckedChange={() => handleToggleFileVisibility(file.id)}
                            />
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {files.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Henüz dosya yüklenmedi.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Toplam Takipçi</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {formatNumber(profile.verifiedStats.totalFollowers)}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <Badge className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Doğrulanmış
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Ortalama ROI</p>
                      <p className="text-2xl font-bold text-emerald-600 mt-1">
                        %{profile.verifiedStats.avgROI}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                  <Badge className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Doğrulanmış
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Ortalama ROO</p>
                      <p className="text-2xl font-bold text-violet-600 mt-1">
                        {profile.verifiedStats.avgROO}/100
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <Target className="h-5 w-5 text-violet-600" />
                    </div>
                  </div>
                  <Badge className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Doğrulanmış
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Tamamlanan Kampanya</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {profile.verifiedStats.completedCampaigns}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Award className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                  <Badge className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Doğrulanmış
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Audience Demographics */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Yaş Dağılımı</CardTitle>
                  <CardDescription>Takipçi yaş grupları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.audience.ageGroups.map((group) => (
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
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Cinsiyet Dağılımı</CardTitle>
                  <CardDescription>Takipçi cinsiyet oranları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Erkek</span>
                        <span className="text-lg font-bold text-blue-600">%{profile.audience.gender.male}</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${profile.audience.gender.male}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Kadın</span>
                        <span className="text-lg font-bold text-pink-600">%{profile.audience.gender.female}</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-pink-500 rounded-full"
                          style={{ width: `${profile.audience.gender.female}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-medium text-slate-500 mb-3">En Çok Takipçi Gelen Şehirler</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.audience.topLocations.map((location, index) => (
                        <Badge key={location} variant="outline" className="px-3">
                          <MapPin className="h-3 w-3 mr-1" />
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Ek İstatistikler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500">Ortalama İzlenme</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {formatNumber(profile.verifiedStats.avgViews)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500">Etkileşim Oranı</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      %{profile.verifiedStats.engagementRate}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500">Aktif Sponsor</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {profile.verifiedStats.activeSponsors}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500">Üyelik Tarihi</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {new Date(profile.verifiedStats.memberSince).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Fiyatlandırma</CardTitle>
                <CardDescription>Sponsorluk hizmetlerinizin fiyat aralıkları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                        <Video className="h-5 w-5 text-violet-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">Video Entegrasyonu</h4>
                        <p className="text-xs text-slate-500">Video içinde ürün/marka tanıtımı</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(profile.pricing.videoIntegration.min)}
                      </span>
                      <span className="text-slate-500">-</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(profile.pricing.videoIntegration.max)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
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
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(profile.pricing.dedicatedVideo.min)}
                      </span>
                      <span className="text-slate-500">-</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(profile.pricing.dedicatedVideo.max)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Image className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">Sosyal Medya Paylaşımı</h4>
                        <p className="text-xs text-slate-500">Instagram/Twitter gönderi</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(profile.pricing.socialPost.min)}
                      </span>
                      <span className="text-slate-500">-</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(profile.pricing.socialPost.max)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                        <Play className="h-5 w-5 text-pink-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">Story / Reels</h4>
                        <p className="text-xs text-slate-500">Kısa format içerik</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(profile.pricing.story.min)}
                      </span>
                      <span className="text-slate-500">-</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(profile.pricing.story.max)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    <strong>Not:</strong> Fiyatlar kampanya kapsamına, süresine ve özel gereksinimlere göre değişiklik gösterebilir. 
                    Detaylı teklif için iletişime geçin.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Toast Provider */}
      <Toaster />
    </div>
  )
}
