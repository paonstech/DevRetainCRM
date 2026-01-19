"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  User, 
  Building2, 
  CreditCard, 
  Bell, 
  ChevronLeft,
  Zap,
  Camera,
  Save,
  ExternalLink,
  Plus,
  Trash2,
  Mail,
  Crown,
  Check,
  AlertCircle,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Globe,
  Shield,
  Lock,
  Eye,
  EyeOff,
  FileText,
  BarChart3,
  Users,
  DollarSign,
  Info,
  Coins,
  TrendingUp,
  Target,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { useLocale } from "@/hooks/use-locale"

// Navigation items with localization
const getNavItems = (locale: string) => [
  { id: "profile", label: locale === 'tr' ? "Profil" : "Profile", icon: User },
  { id: "organization", label: locale === 'tr' ? "Organizasyon" : "Organization", icon: Building2 },
  { id: "subscription", label: locale === 'tr' ? "Abonelik" : "Subscription", icon: CreditCard },
  { id: "notifications", label: locale === 'tr' ? "Bildirimler" : "Notifications", icon: Bell },
  { id: "data-privacy", label: locale === 'tr' ? "Veri Gizliliği" : "Data Privacy", icon: Shield },
]

// Mock user data
const mockUser = {
  id: "user-1",
  name: "Ahmet Yılmaz",
  email: "ahmet@devretain.com",
  avatar: null,
  phone: "+90 532 123 4567",
  timezone: "Europe/Istanbul",
  language: "tr",
  socialLinks: {
    youtube: "https://youtube.com/@ahmetyilmaz",
    instagram: "@ahmetyilmaz",
    twitter: "@ahmetyilmaz",
    linkedin: "ahmetyilmaz",
    website: "https://ahmetyilmaz.com",
  },
}

// Mock organization data
const mockOrganization = {
  id: "org-1",
  name: "DevRetain Media",
  type: "YOUTUBER",
  email: "info@devretain.com",
  phone: "+90 212 123 4567",
  website: "https://devretain.com",
  taxId: "1234567890",
  taxOffice: "Kadıköy Vergi Dairesi",
  address: "Kadıköy, İstanbul",
  members: [
    { id: "1", name: "Ahmet Yılmaz", email: "ahmet@devretain.com", role: "OWNER", avatar: null },
    { id: "2", name: "Mehmet Demir", email: "mehmet@devretain.com", role: "ADMIN", avatar: null },
    { id: "3", name: "Ayşe Kaya", email: "ayse@devretain.com", role: "MEMBER", avatar: null },
  ],
}

// Mock subscription data
const mockSubscription = {
  plan: "PRO",
  status: "ACTIVE",
  currentPeriodEnd: new Date("2024-12-31"),
  cancelAtPeriodEnd: false,
  features: {
    campaigns: { used: 12, limit: 50 },
    sponsors: { used: 45, limit: 500 },
    members: { used: 3, limit: 10 },
  },
  invoices: [
    { id: "inv-1", date: "2024-11-01", amount: 49, status: "paid", pdfUrl: "#" },
    { id: "inv-2", date: "2024-10-01", amount: 49, status: "paid", pdfUrl: "#" },
    { id: "inv-3", date: "2024-09-01", amount: 49, status: "paid", pdfUrl: "#" },
  ],
}

// Mock notification preferences
const mockNotifications = {
  emailOnROITarget: true,
  emailOnCampaignEnd: true,
  emailOnNewSponsor: false,
  emailOnPaymentReceived: true,
  emailWeeklyReport: true,
  emailMonthlyReport: false,
}

// Mock data privacy settings
const mockDataPrivacy = {
  // Rapor Pazaryeri İzinleri
  allowReportMarketplace: false,
  reportVisibility: "anonymous" as "anonymous" | "public" | "hidden",
  
  // Hangi verilerin paylaşılabileceği
  shareROIData: true,
  shareROOData: true,
  shareAudienceData: true,
  shareEngagementData: true,
  shareCampaignHistory: false,
  shareRevenueData: false,
  
  // Fiyatlandırma
  reportPrice: 10, // kredi
  customPricing: false,
  
  // Gelir paylaşımı
  revenueShare: 70, // %70 kullanıcıya, %30 platforma
  
  // İstatistikler
  totalReportsSold: 23,
  totalEarnings: 1610, // TRY
  pendingEarnings: 230,
}

export default function SettingsPage() {
  const { toast } = useToast()
  const { locale } = useLocale()
  const [activeSection, setActiveSection] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  
  // Get localized nav items
  const navItems = getNavItems(locale)
  
  // Localized texts
  const t = {
    settings: locale === 'tr' ? 'Ayarlar' : 'Settings',
    save: locale === 'tr' ? 'Kaydet' : 'Save',
    saving: locale === 'tr' ? 'Kaydediliyor...' : 'Saving...',
    dashboard: locale === 'tr' ? 'Dashboard' : 'Dashboard',
    
    // Profile
    profileInfo: locale === 'tr' ? 'Profil Bilgileri' : 'Profile Information',
    profileDesc: locale === 'tr' ? 'Kişisel bilgilerinizi ve sosyal medya bağlantılarınızı yönetin.' : 'Manage your personal information and social media links.',
    fullName: locale === 'tr' ? 'Ad Soyad' : 'Full Name',
    email: locale === 'tr' ? 'E-posta' : 'Email',
    phone: locale === 'tr' ? 'Telefon' : 'Phone',
    timezone: locale === 'tr' ? 'Saat Dilimi' : 'Timezone',
    uploadPhoto: locale === 'tr' ? 'Fotoğraf Yükle' : 'Upload Photo',
    socialLinks: locale === 'tr' ? 'Sosyal Medya & Kanal Linkleri' : 'Social Media & Channel Links',
    socialLinksDesc: locale === 'tr' ? 'Sponsorlarınızın sizi bulabilmesi için bağlantılarınızı ekleyin.' : 'Add your links so sponsors can find you.',
    website: locale === 'tr' ? 'Web Sitesi' : 'Website',
    
    // Organization
    orgInfo: locale === 'tr' ? 'Organizasyon Bilgileri' : 'Organization Information',
    orgDesc: locale === 'tr' ? 'Şirket veya kanal bilgilerinizi yönetin.' : 'Manage your company or channel information.',
    orgName: locale === 'tr' ? 'Organizasyon Adı' : 'Organization Name',
    orgType: locale === 'tr' ? 'Tür' : 'Type',
    taxId: locale === 'tr' ? 'Vergi No' : 'Tax ID',
    taxOffice: locale === 'tr' ? 'Vergi Dairesi' : 'Tax Office',
    address: locale === 'tr' ? 'Adres' : 'Address',
    teamMembers: locale === 'tr' ? 'Ekip Üyeleri' : 'Team Members',
    teamMembersDesc: locale === 'tr' ? 'Organizasyonunuza erişimi olan kişiler.' : 'People with access to your organization.',
    addMember: locale === 'tr' ? 'Üye Ekle' : 'Add Member',
    inviteMember: locale === 'tr' ? 'Yeni üye davet et' : 'Invite new member',
    sendInvite: locale === 'tr' ? 'Davet Gönder' : 'Send Invite',
    owner: locale === 'tr' ? 'Sahip' : 'Owner',
    admin: locale === 'tr' ? 'Yönetici' : 'Admin',
    member: locale === 'tr' ? 'Üye' : 'Member',
    remove: locale === 'tr' ? 'Kaldır' : 'Remove',
    
    // Subscription
    currentPlan: locale === 'tr' ? 'Mevcut Plan' : 'Current Plan',
    currentPlanDesc: locale === 'tr' ? 'Abonelik durumunuz ve kullanım limitleriniz.' : 'Your subscription status and usage limits.',
    active: locale === 'tr' ? 'Aktif' : 'Active',
    renewsOn: locale === 'tr' ? 'Yenileme:' : 'Renews on:',
    usage: locale === 'tr' ? 'Kullanım' : 'Usage',
    campaigns: locale === 'tr' ? 'Kampanyalar' : 'Campaigns',
    sponsors: locale === 'tr' ? 'Sponsorlar' : 'Sponsors',
    members: locale === 'tr' ? 'Üyeler' : 'Members',
    manageSubscription: locale === 'tr' ? 'Aboneliği Yönet' : 'Manage Subscription',
    manageStripe: locale === 'tr' ? 'Stripe Müşteri Portalı' : 'Stripe Customer Portal',
    invoiceHistory: locale === 'tr' ? 'Fatura Geçmişi' : 'Invoice History',
    invoiceHistoryDesc: locale === 'tr' ? 'Geçmiş faturalarınızı indirin.' : 'Download your past invoices.',
    date: locale === 'tr' ? 'Tarih' : 'Date',
    amount: locale === 'tr' ? 'Tutar' : 'Amount',
    status: locale === 'tr' ? 'Durum' : 'Status',
    invoice: locale === 'tr' ? 'Fatura' : 'Invoice',
    paid: locale === 'tr' ? 'Ödendi' : 'Paid',
    
    // Notifications
    notifSettings: locale === 'tr' ? 'Bildirim Ayarları' : 'Notification Settings',
    notifDesc: locale === 'tr' ? 'Hangi durumlarda e-posta almak istediğinizi seçin.' : 'Choose when you want to receive emails.',
    campaignAlerts: locale === 'tr' ? 'Kampanya Uyarıları' : 'Campaign Alerts',
    roiTarget: locale === 'tr' ? 'ROI hedefine ulaşıldığında' : 'When ROI target is reached',
    campaignEnd: locale === 'tr' ? 'Kampanya süresi dolduğunda' : 'When campaign ends',
    newSponsor: locale === 'tr' ? 'Yeni sponsor teklifi geldiğinde' : 'When new sponsor offer arrives',
    paymentReceived: locale === 'tr' ? 'Ödeme alındığında' : 'When payment is received',
    reports: locale === 'tr' ? 'Raporlar' : 'Reports',
    weeklyReport: locale === 'tr' ? 'Haftalık özet raporu' : 'Weekly summary report',
    monthlyReport: locale === 'tr' ? 'Aylık detaylı rapor' : 'Monthly detailed report',
    
    // Data Privacy
    dataPrivacy: locale === 'tr' ? 'Veri Gizliliği & Rapor Pazaryeri' : 'Data Privacy & Report Marketplace',
    dataPrivacyDesc: locale === 'tr' ? 'Verilerinizin nasıl paylaşılacağını kontrol edin.' : 'Control how your data is shared.',
    marketplaceAccess: locale === 'tr' ? 'Rapor Pazaryeri Erişimi' : 'Report Marketplace Access',
    enableMarketplace: locale === 'tr' ? 'Rapor Pazaryeri\'ne Katıl' : 'Join Report Marketplace',
    enableMarketplaceDesc: locale === 'tr' ? 'Verilerinizi anonim veya açık olarak rapor pazaryerinde satışa sunun.' : 'Offer your data for sale on the report marketplace, anonymously or openly.',
    profileVisibility: locale === 'tr' ? 'Profil Görünürlüğü' : 'Profile Visibility',
    anonymous: locale === 'tr' ? 'Anonim' : 'Anonymous',
    anonymousDesc: locale === 'tr' ? 'Veriler isim gizlenerek satılır' : 'Data is sold with name hidden',
    public: locale === 'tr' ? 'Açık Profil' : 'Public Profile',
    publicDesc: locale === 'tr' ? 'Veriler isminizle birlikte satılır' : 'Data is sold with your name',
    hidden: locale === 'tr' ? 'Gizli' : 'Hidden',
    hiddenDesc: locale === 'tr' ? 'Veriler pazaryerinde görünmez' : 'Data is not visible in marketplace',
    sharedData: locale === 'tr' ? 'Paylaşılan Veriler' : 'Shared Data',
    sharedDataDesc: locale === 'tr' ? 'Hangi verilerin raporlara dahil edileceğini seçin.' : 'Choose which data to include in reports.',
    roiHistory: locale === 'tr' ? 'ROI Geçmişi' : 'ROI History',
    rooScores: locale === 'tr' ? 'ROO Skorları' : 'ROO Scores',
    audienceDemo: locale === 'tr' ? 'Kitle Demografisi' : 'Audience Demographics',
    engagementMetrics: locale === 'tr' ? 'Etkileşim Metrikleri' : 'Engagement Metrics',
    campaignHistory: locale === 'tr' ? 'Kampanya Geçmişi' : 'Campaign History',
    revenueData: locale === 'tr' ? 'Gelir Verileri' : 'Revenue Data',
    pricing: locale === 'tr' ? 'Fiyatlandırma' : 'Pricing',
    reportPrice: locale === 'tr' ? 'Rapor Fiyatı' : 'Report Price',
    credits: locale === 'tr' ? 'kredi' : 'credits',
    revenueShare: locale === 'tr' ? 'Gelir Paylaşımı' : 'Revenue Share',
    yourShare: locale === 'tr' ? 'Sizin Payınız' : 'Your Share',
    platformFee: locale === 'tr' ? 'Platform Ücreti' : 'Platform Fee',
    earnings: locale === 'tr' ? 'Kazançlar' : 'Earnings',
    totalSold: locale === 'tr' ? 'Satılan Rapor' : 'Reports Sold',
    totalEarnings: locale === 'tr' ? 'Toplam Kazanç' : 'Total Earnings',
    pendingPayout: locale === 'tr' ? 'Bekleyen Ödeme' : 'Pending Payout',
    security: locale === 'tr' ? 'Güvenlik' : 'Security',
    securityNote: locale === 'tr' ? 'Tüm veriler şifrelenerek saklanır. Hassas finansal bilgiler (tam gelir, banka bilgileri vb.) hiçbir zaman paylaşılmaz.' : 'All data is stored encrypted. Sensitive financial information (full income, bank details, etc.) is never shared.',
    
    // Toast messages
    profileUpdated: locale === 'tr' ? 'Profil Güncellendi! ✨' : 'Profile Updated! ✨',
    profileUpdatedDesc: locale === 'tr' ? 'Değişiklikleriniz başarıyla kaydedildi.' : 'Your changes have been saved successfully.',
    orgUpdated: locale === 'tr' ? 'Organizasyon Güncellendi! 🏢' : 'Organization Updated! 🏢',
    orgUpdatedDesc: locale === 'tr' ? 'Organizasyon bilgileriniz kaydedildi.' : 'Your organization information has been saved.',
    notifUpdated: locale === 'tr' ? 'Bildirim Ayarları Kaydedildi! 🔔' : 'Notification Settings Saved! 🔔',
    notifUpdatedDesc: locale === 'tr' ? 'Bildirim tercihleriniz güncellendi.' : 'Your notification preferences have been updated.',
    privacyUpdated: locale === 'tr' ? 'Gizlilik Ayarları Kaydedildi! 🔒' : 'Privacy Settings Saved! 🔒',
    privacyUpdatedDesc: locale === 'tr' ? 'Veri paylaşım tercihleriniz güncellendi.' : 'Your data sharing preferences have been updated.',
    emailRequired: locale === 'tr' ? 'E-posta Gerekli' : 'Email Required',
    emailRequiredDesc: locale === 'tr' ? 'Lütfen bir e-posta adresi girin.' : 'Please enter an email address.',
    inviteSent: locale === 'tr' ? 'Davet Gönderildi! 📧' : 'Invitation Sent! 📧',
    inviteSentDesc: locale === 'tr' ? 'adresine davet gönderildi.' : 'Invitation sent to',
    memberRemoved: locale === 'tr' ? 'Üye Kaldırıldı' : 'Member Removed',
    memberRemovedDesc: locale === 'tr' ? 'Üye organizasyondan çıkarıldı.' : 'Member has been removed from the organization.',
    subscriptionManage: locale === 'tr' ? 'Yönlendiriliyor...' : 'Redirecting...',
    subscriptionManageDesc: locale === 'tr' ? 'Stripe portalına yönlendiriliyorsunuz.' : 'You are being redirected to Stripe portal.',
  }
  
  // Form states
  const [profile, setProfile] = useState(mockUser)
  const [organization, setOrganization] = useState(mockOrganization)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [dataPrivacy, setDataPrivacy] = useState(mockDataPrivacy)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    toast({
      title: t.profileUpdated,
      description: t.profileUpdatedDesc,
      variant: "success",
    })
  }

  const handleSaveOrganization = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    toast({
      title: t.orgUpdated,
      description: t.orgUpdatedDesc,
      variant: "success",
    })
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: t.notifUpdated,
      description: t.notifUpdatedDesc,
      variant: "success",
    })
  }

  const handleSaveDataPrivacy = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: t.privacyUpdated,
      description: t.privacyUpdatedDesc,
      variant: "success",
    })
  }

  const handleAddMember = async () => {
    if (!newMemberEmail) {
      toast({
        title: t.emailRequired,
        description: t.emailRequiredDesc,
        variant: "destructive",
      })
      return
    }

    setIsAddingMember(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Add new member
    setOrganization(prev => ({
      ...prev,
      members: [
        ...prev.members,
        {
          id: `new-${Date.now()}`,
          name: newMemberEmail.split('@')[0],
          email: newMemberEmail,
          role: "MEMBER",
          avatar: null,
        }
      ]
    }))
    
    setIsAddingMember(false)
    setNewMemberEmail("")
    toast({
      title: t.inviteSent,
      description: `${t.inviteSentDesc} ${newMemberEmail}`,
      variant: "success",
    })
  }

  const handleRemoveMember = (memberId: string) => {
    setOrganization(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== memberId)
    }))
    toast({
      title: t.memberRemoved,
      description: t.memberRemovedDesc,
    })
  }

  const handleManageSubscription = async () => {
    toast({
      title: t.subscriptionManage,
      description: t.subscriptionManageDesc,
    })
    
    // Redirect to Stripe Customer Portal
    try {
      const response = await fetch("/api/subscriptions/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: organization.id,
          returnUrl: window.location.href,
        }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast({
          title: locale === 'tr' ? "Demo Modu" : "Demo Mode",
          description: locale === 'tr' ? "Stripe entegrasyonu aktif değil. Gerçek ortamda portal açılacaktır." : "Stripe integration is not active. Portal will open in production.",
        })
      }
    } catch (error) {
      console.error("Portal error:", error)
      toast({
        title: locale === 'tr' ? "Demo Modu" : "Demo Mode",
        description: locale === 'tr' ? "Stripe entegrasyonu aktif değil. Gerçek ortamda portal açılacaktır." : "Stripe integration is not active. Portal will open in production.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-medium">{t.dashboard}</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{t.settings}</h1>
          </div>
          <Button 
            onClick={() => {
              if (activeSection === "profile") handleSaveProfile()
              else if (activeSection === "organization") handleSaveOrganization()
              else if (activeSection === "notifications") handleSaveNotifications()
              else if (activeSection === "data-privacy") handleSaveDataPrivacy()
            }} 
            disabled={isSaving}
            className="gap-2 bg-violet-600 hover:bg-violet-700"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.saving}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {t.save}
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0">
            <nav className="sticky top-24 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t.profileInfo}</h2>
                  <p className="text-sm text-slate-500 mt-1">{t.profileDesc}</p>
                </div>

                {/* Avatar & Basic Info */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Avatar */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                            {profile.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <Camera className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          </button>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs">
                          {t.uploadPhoto}
                        </Button>
                      </div>

                      {/* Form Fields */}
                      <div className="flex-1 grid gap-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">{t.fullName}</Label>
                            <Input
                              id="name"
                              value={profile.name}
                              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">{t.email}</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">{t.phone}</Label>
                            <Input
                              id="phone"
                              value={profile.phone}
                              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="timezone">{t.timezone}</Label>
                            <Select value={profile.timezone} onValueChange={(v) => setProfile({ ...profile, timezone: v })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Europe/Istanbul">İstanbul (GMT+3)</SelectItem>
                                <SelectItem value="Europe/London">{locale === 'tr' ? 'Londra' : 'London'} (GMT+0)</SelectItem>
                                <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">{t.socialLinks}</CardTitle>
                    <CardDescription>{t.socialLinksDesc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Youtube className="h-4 w-4 text-red-500" />
                          YouTube
                        </Label>
                        <Input
                          placeholder="https://youtube.com/@channel"
                          value={profile.socialLinks.youtube}
                          onChange={(e) => setProfile({ 
                            ...profile, 
                            socialLinks: { ...profile.socialLinks, youtube: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-pink-500" />
                          Instagram
                        </Label>
                        <Input
                          placeholder="@username"
                          value={profile.socialLinks.instagram}
                          onChange={(e) => setProfile({ 
                            ...profile, 
                            socialLinks: { ...profile.socialLinks, instagram: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-sky-500" />
                          Twitter / X
                        </Label>
                        <Input
                          placeholder="@username"
                          value={profile.socialLinks.twitter}
                          onChange={(e) => setProfile({ 
                            ...profile, 
                            socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-blue-600" />
                          LinkedIn
                        </Label>
                        <Input
                          placeholder="username"
                          value={profile.socialLinks.linkedin}
                          onChange={(e) => setProfile({ 
                            ...profile, 
                            socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-500" />
                        {t.website}
                      </Label>
                      <Input
                        placeholder="https://example.com"
                        value={profile.socialLinks.website}
                        onChange={(e) => setProfile({ 
                          ...profile, 
                          socialLinks: { ...profile.socialLinks, website: e.target.value }
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Organization Section */}
            {activeSection === "organization" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t.orgInfo}</h2>
                  <p className="text-sm text-slate-500 mt-1">{t.orgDesc}</p>
                </div>

                {/* Company Info */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">{locale === 'tr' ? 'Şirket Bilgileri' : 'Company Information'}</CardTitle>
                    <CardDescription>{locale === 'tr' ? 'Fatura ve resmi işlemler için gerekli bilgiler.' : 'Required information for invoices and official processes.'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="orgName">{t.orgName}</Label>
                        <Input
                          id="orgName"
                          value={organization.name}
                          onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orgType">{t.orgType}</Label>
                        <Select value={organization.type} onValueChange={(v) => setOrganization({ ...organization, type: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="YOUTUBER">{locale === 'tr' ? 'İçerik Üreticisi' : 'Content Creator'}</SelectItem>
                            <SelectItem value="CLUB">{locale === 'tr' ? 'Kulüp / Topluluk' : 'Club / Community'}</SelectItem>
                            <SelectItem value="BUSINESS">{locale === 'tr' ? 'İşletme / Ajans' : 'Business / Agency'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="taxId">{t.taxId}</Label>
                        <Input
                          id="taxId"
                          value={organization.taxId}
                          onChange={(e) => setOrganization({ ...organization, taxId: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxOffice">{t.taxOffice}</Label>
                        <Input
                          id="taxOffice"
                          value={organization.taxOffice}
                          onChange={(e) => setOrganization({ ...organization, taxOffice: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t.address}</Label>
                      <Textarea
                        id="address"
                        value={organization.address}
                        onChange={(e) => setOrganization({ ...organization, address: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="orgEmail">{t.email}</Label>
                        <Input
                          id="orgEmail"
                          type="email"
                          value={organization.email}
                          onChange={(e) => setOrganization({ ...organization, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orgPhone">{t.phone}</Label>
                        <Input
                          id="orgPhone"
                          value={organization.phone}
                          onChange={(e) => setOrganization({ ...organization, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Members */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{t.teamMembers}</CardTitle>
                        <CardDescription>{t.teamMembersDesc}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Add Member Form */}
                    <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <Input
                        placeholder={locale === 'tr' ? "E-posta adresi girin..." : "Enter email address..."}
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        className="gap-2"
                        onClick={handleAddMember}
                        disabled={isAddingMember}
                      >
                        {isAddingMember ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            {locale === 'tr' ? 'Ekleniyor...' : 'Adding...'}
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            {t.addMember}
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {organization.members.map((member) => (
                        <div 
                          key={member.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{member.name}</p>
                              <p className="text-xs text-slate-500">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={cn(
                              member.role === "OWNER" && "border-amber-500/50 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
                              member.role === "ADMIN" && "border-violet-500/50 bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
                              member.role === "MEMBER" && "border-slate-500/50"
                            )}>
                              {member.role === "OWNER" && <Crown className="h-3 w-3 mr-1" />}
                              {member.role === "OWNER" ? t.owner : member.role === "ADMIN" ? t.admin : t.member}
                            </Badge>
                            {member.role !== "OWNER" && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-slate-400 hover:text-red-500"
                                onClick={() => handleRemoveMember(member.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-4">
                      {organization.members.length} / {mockSubscription.features.members.limit} üye kullanılıyor
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Subscription Section */}
            {activeSection === "subscription" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Abonelik Yönetimi</h2>
                  <p className="text-sm text-slate-500 mt-1">Plan detaylarınızı ve fatura geçmişinizi görüntüleyin.</p>
                </div>

                {/* Current Plan */}
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="h-5 w-5" />
                          <span className="text-sm font-medium opacity-90">Mevcut Plan</span>
                        </div>
                        <h3 className="text-2xl font-bold">{mockSubscription.plan} Plan</h3>
                        <p className="text-sm opacity-80 mt-1">
                          {mockSubscription.cancelAtPeriodEnd 
                            ? `${mockSubscription.currentPeriodEnd.toLocaleDateString('tr-TR')} tarihinde sona erecek`
                            : `Sonraki fatura: ${mockSubscription.currentPeriodEnd.toLocaleDateString('tr-TR')}`
                          }
                        </p>
                      </div>
                      <Badge className="bg-white/20 text-white border-0">
                        {mockSubscription.status === "ACTIVE" ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    {/* Usage Stats */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      {Object.entries(mockSubscription.features).map(([key, value]) => (
                        <div key={key} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                              {key === "campaigns" ? "Kampanyalar" : key === "sponsors" ? "Sponsorlar" : "Üyeler"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {value.used} / {value.limit}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-violet-500 rounded-full transition-all"
                              style={{ width: `${(value.used / value.limit) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={handleManageSubscription} className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Aboneliği Yönet
                      </Button>
                      <Link href="/pricing">
                        <Button variant="outline" className="gap-2">
                          Planları Karşılaştır
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice History */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Fatura Geçmişi</CardTitle>
                    <CardDescription>Son faturalarınızı görüntüleyin ve indirin.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockSubscription.invoices.map((invoice) => (
                        <div 
                          key={invoice.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {new Date(invoice.date).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                              </p>
                              <p className="text-xs text-slate-500">${invoice.amount}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="border-emerald-500/50 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                              <Check className="h-3 w-3 mr-1" />
                              Ödendi
                            </Badge>
                            <Button variant="ghost" size="sm" className="text-xs">
                              PDF İndir
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Bildirim Tercihleri</h2>
                  <p className="text-sm text-slate-500 mt-1">Hangi durumlarda e-posta almak istediğinizi belirleyin.</p>
                </div>

                {/* Campaign Notifications */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Kampanya Bildirimleri</CardTitle>
                    <CardDescription>Kampanyalarınızla ilgili önemli güncellemeler.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">ROI Hedefine Ulaşıldığında</Label>
                        <p className="text-xs text-slate-500">Bir kampanya belirlenen ROI hedefine ulaştığında bildirim al.</p>
                      </div>
                      <Switch
                        checked={notifications.emailOnROITarget}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailOnROITarget: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Kampanya Süresi Dolduğunda</Label>
                        <p className="text-xs text-slate-500">Kampanya bitiş tarihi yaklaştığında veya sona erdiğinde bildirim al.</p>
                      </div>
                      <Switch
                        checked={notifications.emailOnCampaignEnd}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailOnCampaignEnd: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Sponsor Notifications */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Sponsor Bildirimleri</CardTitle>
                    <CardDescription>Sponsorlarınızla ilgili güncellemeler.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Yeni Sponsor Eklendiğinde</Label>
                        <p className="text-xs text-slate-500">Sisteme yeni bir sponsor kaydedildiğinde bildirim al.</p>
                      </div>
                      <Switch
                        checked={notifications.emailOnNewSponsor}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailOnNewSponsor: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Ödeme Alındığında</Label>
                        <p className="text-xs text-slate-500">Bir sponsordan ödeme alındığında bildirim al.</p>
                      </div>
                      <Switch
                        checked={notifications.emailOnPaymentReceived}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailOnPaymentReceived: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Report Notifications */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Rapor Bildirimleri</CardTitle>
                    <CardDescription>Periyodik performans raporları.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Haftalık Özet Raporu</Label>
                        <p className="text-xs text-slate-500">Her Pazartesi günü geçen haftanın özetini al.</p>
                      </div>
                      <Switch
                        checked={notifications.emailWeeklyReport}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailWeeklyReport: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Aylık Performans Raporu</Label>
                        <p className="text-xs text-slate-500">Her ayın başında detaylı performans raporu al.</p>
                      </div>
                      <Switch
                        checked={notifications.emailMonthlyReport}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailMonthlyReport: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Info Box */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">E-posta Bildirimleri Hakkında</p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      Tüm bildirimler <span className="font-medium">{profile.email}</span> adresine gönderilecektir. 
                      E-posta adresinizi değiştirmek için Profil bölümünü kullanabilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Data Privacy Section */}
            {activeSection === "data-privacy" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Veri Gizliliği & Rapor Pazaryeri</h2>
                  <p className="text-sm text-slate-500 mt-1">Verilerinizin Rapor Pazaryeri'nde nasıl kullanılacağını kontrol edin.</p>
                </div>

                {/* Main Toggle - Report Marketplace Consent */}
                <Card className={cn(
                  "border-2 shadow-sm transition-all",
                  dataPrivacy.allowReportMarketplace 
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10" 
                    : "border-slate-200 dark:border-slate-700"
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                        dataPrivacy.allowReportMarketplace 
                          ? "bg-emerald-100 dark:bg-emerald-900/30" 
                          : "bg-slate-100 dark:bg-slate-800"
                      )}>
                        <ShoppingCart className={cn(
                          "h-6 w-6",
                          dataPrivacy.allowReportMarketplace ? "text-emerald-600" : "text-slate-400"
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              Verilerimi Rapor Pazaryeri'ne Aç
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                              Bu seçeneği aktifleştirdiğinizde, performans verileriniz (ROI, ROO, kitle analizi vb.) 
                              sponsorlar tarafından satın alınabilir hale gelir.
                            </p>
                          </div>
                          <Switch
                            checked={dataPrivacy.allowReportMarketplace}
                            onCheckedChange={(checked) => setDataPrivacy({ ...dataPrivacy, allowReportMarketplace: checked })}
                            className="ml-4"
                          />
                        </div>
                        
                        {dataPrivacy.allowReportMarketplace && (
                          <div className="mt-4 p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                              <Check className="h-4 w-4" />
                              <span className="text-sm font-medium">Rapor Pazaryeri aktif</span>
                            </div>
                            <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-1">
                              Verileriniz aşağıdaki ayarlara göre paylaşılacaktır.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Visibility Settings */}
                {dataPrivacy.allowReportMarketplace && (
                  <>
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Eye className="h-5 w-5 text-violet-500" />
                          Görünürlük Ayarları
                        </CardTitle>
                        <CardDescription>Raporlarınızın nasıl görüntüleneceğini seçin.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Visibility Options */}
                        <div className="grid gap-3">
                          <button
                            onClick={() => setDataPrivacy({ ...dataPrivacy, reportVisibility: "anonymous" })}
                            className={cn(
                              "flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all",
                              dataPrivacy.reportVisibility === "anonymous"
                                ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            )}
                          >
                            <div className={cn(
                              "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                              dataPrivacy.reportVisibility === "anonymous"
                                ? "bg-violet-100 dark:bg-violet-900/30"
                                : "bg-slate-100 dark:bg-slate-800"
                            )}>
                              <EyeOff className={cn(
                                "h-5 w-5",
                                dataPrivacy.reportVisibility === "anonymous" ? "text-violet-600" : "text-slate-400"
                              )} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-slate-900 dark:text-white">Anonim</h4>
                                <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-0 text-xs">
                                  Önerilen
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-500 mt-1">
                                Kanal/kulüp adınız gizlenir, sadece kategori ve performans verileri gösterilir. 
                                Örn: "Teknoloji Kategorisi - Anonim Yayıncı #1234"
                              </p>
                            </div>
                            {dataPrivacy.reportVisibility === "anonymous" && (
                              <Check className="h-5 w-5 text-violet-600 shrink-0" />
                            )}
                          </button>

                          <button
                            onClick={() => setDataPrivacy({ ...dataPrivacy, reportVisibility: "public" })}
                            className={cn(
                              "flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all",
                              dataPrivacy.reportVisibility === "public"
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            )}
                          >
                            <div className={cn(
                              "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                              dataPrivacy.reportVisibility === "public"
                                ? "bg-emerald-100 dark:bg-emerald-900/30"
                                : "bg-slate-100 dark:bg-slate-800"
                            )}>
                              <Eye className={cn(
                                "h-5 w-5",
                                dataPrivacy.reportVisibility === "public" ? "text-emerald-600" : "text-slate-400"
                              )} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 dark:text-white">Açık Profil</h4>
                              <p className="text-sm text-slate-500 mt-1">
                                Kanal/kulüp adınız ve tüm verileriniz görünür olur. 
                                Sponsorlar sizi doğrudan bulabilir ve iletişime geçebilir.
                              </p>
                            </div>
                            {dataPrivacy.reportVisibility === "public" && (
                              <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Data Sharing Preferences */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-500" />
                          Paylaşılacak Veriler
                        </CardTitle>
                        <CardDescription>Hangi verilerinizin raporlarda yer alacağını seçin.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                              <TrendingUp className="h-5 w-5 text-emerald-500" />
                              <div>
                                <Label className="text-sm font-medium">ROI Verileri</Label>
                                <p className="text-xs text-slate-500">Kampanya yatırım getirisi</p>
                              </div>
                            </div>
                            <Switch
                              checked={dataPrivacy.shareROIData}
                              onCheckedChange={(checked) => setDataPrivacy({ ...dataPrivacy, shareROIData: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                              <Target className="h-5 w-5 text-violet-500" />
                              <div>
                                <Label className="text-sm font-medium">ROO Verileri</Label>
                                <p className="text-xs text-slate-500">Hedef başarı oranları</p>
                              </div>
                            </div>
                            <Switch
                              checked={dataPrivacy.shareROOData}
                              onCheckedChange={(checked) => setDataPrivacy({ ...dataPrivacy, shareROOData: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                              <Users className="h-5 w-5 text-blue-500" />
                              <div>
                                <Label className="text-sm font-medium">Kitle Demografisi</Label>
                                <p className="text-xs text-slate-500">Yaş, cinsiyet, lokasyon</p>
                              </div>
                            </div>
                            <Switch
                              checked={dataPrivacy.shareAudienceData}
                              onCheckedChange={(checked) => setDataPrivacy({ ...dataPrivacy, shareAudienceData: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                              <BarChart3 className="h-5 w-5 text-amber-500" />
                              <div>
                                <Label className="text-sm font-medium">Etkileşim Oranları</Label>
                                <p className="text-xs text-slate-500">Görüntülenme, beğeni, yorum</p>
                              </div>
                            </div>
                            <Switch
                              checked={dataPrivacy.shareEngagementData}
                              onCheckedChange={(checked) => setDataPrivacy({ ...dataPrivacy, shareEngagementData: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-pink-500" />
                              <div>
                                <Label className="text-sm font-medium">Kampanya Geçmişi</Label>
                                <p className="text-xs text-slate-500">Geçmiş sponsorluk detayları</p>
                              </div>
                            </div>
                            <Switch
                              checked={dataPrivacy.shareCampaignHistory}
                              onCheckedChange={(checked) => setDataPrivacy({ ...dataPrivacy, shareCampaignHistory: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                              <DollarSign className="h-5 w-5 text-green-500" />
                              <div>
                                <Label className="text-sm font-medium">Gelir Verileri</Label>
                                <p className="text-xs text-slate-500">Toplam sponsorluk geliri</p>
                              </div>
                            </div>
                            <Switch
                              checked={dataPrivacy.shareRevenueData}
                              onCheckedChange={(checked) => setDataPrivacy({ ...dataPrivacy, shareRevenueData: checked })}
                            />
                          </div>
                        </div>

                        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                          <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            En az ROI veya ROO verilerinden birini paylaşmanız gerekmektedir. 
                            Daha fazla veri paylaşımı, raporunuzun değerini artırır.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pricing Settings */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Coins className="h-5 w-5 text-amber-500" />
                          Fiyatlandırma & Gelir
                        </CardTitle>
                        <CardDescription>Raporunuzun fiyatını ve gelir paylaşımını yönetin.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Rapor Fiyatı (Kredi)</Label>
                            <Select 
                              value={dataPrivacy.reportPrice.toString()} 
                              onValueChange={(v) => setDataPrivacy({ ...dataPrivacy, reportPrice: parseInt(v) })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">5 Kredi (~₺45)</SelectItem>
                                <SelectItem value="10">10 Kredi (~₺89)</SelectItem>
                                <SelectItem value="15">15 Kredi (~₺134)</SelectItem>
                                <SelectItem value="20">20 Kredi (~₺179)</SelectItem>
                                <SelectItem value="25">25 Kredi (~₺224)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Gelir Paylaşımı</Label>
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Sizin Payınız</span>
                                <span className="text-lg font-bold text-emerald-600">%{dataPrivacy.revenueShare}</span>
                              </div>
                              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${dataPrivacy.revenueShare}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-500 mt-2">
                                Platform komisyonu: %{100 - dataPrivacy.revenueShare}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Earnings Stats */}
                        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                            <p className="text-xs text-slate-500">Toplam Satılan Rapor</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                              {dataPrivacy.totalReportsSold}
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                            <p className="text-xs text-slate-500">Toplam Kazanç</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              ₺{dataPrivacy.totalEarnings.toLocaleString('tr-TR')}
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                            <p className="text-xs text-slate-500">Bekleyen Ödeme</p>
                            <p className="text-2xl font-bold text-amber-600">
                              ₺{dataPrivacy.pendingEarnings.toLocaleString('tr-TR')}
                            </p>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Ödeme Geçmişini Görüntüle
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Legal Info */}
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <Lock className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Veri Güvenliği Garantisi</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Verileriniz KVKK ve GDPR uyumlu şekilde işlenir. Anonim seçeneğinde kimliğiniz hiçbir şekilde 
                          alıcılarla paylaşılmaz. İstediğiniz zaman bu ayarları kapatabilir veya verilerinizi silebilirsiniz.
                        </p>
                        <Button variant="link" className="h-auto p-0 text-xs text-violet-600 mt-2">
                          Gizlilik Politikası →
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* Disabled State Info */}
                {!dataPrivacy.allowReportMarketplace && (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                          <Lock className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                          Rapor Pazaryeri Kapalı
                        </h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                          Verileriniz şu anda Rapor Pazaryeri'nde paylaşılmıyor. 
                          Yukarıdaki anahtarı açarak performans verilerinizi satışa sunabilir ve ek gelir elde edebilirsiniz.
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-emerald-600">
                            <Check className="h-4 w-4" />
                            <span>%70 gelir payı</span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-600">
                            <Check className="h-4 w-4" />
                            <span>Anonim seçeneği</span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-600">
                            <Check className="h-4 w-4" />
                            <span>İstediğiniz zaman kapatın</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Toast Provider */}
      <Toaster />
    </div>
  )
}
