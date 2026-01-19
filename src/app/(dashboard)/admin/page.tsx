"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  DollarSign,
  CreditCard,
  Building2,
  Shield,
  ChevronLeft,
  Search,
  MoreHorizontal,
  Ban,
  UserCheck,
  UserX,
  Crown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  RefreshCw,
  Download,
  Filter,
  BarChart3,
  Globe,
  Zap,
  FileText,
  ShieldAlert,
  CreditCardIcon,
  Trash2,
  UserCog,
  Database,
  Lock,
  Settings,
  CheckCheck,
  AlertOctagon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Mock data for system stats
const systemStats = {
  totalUsers: 1247,
  userGrowth: 12.5,
  totalOrganizations: 892,
  orgGrowth: 8.3,
  mrr: 38450,
  mrrGrowth: 15.2,
  arr: 461400,
  activeSubscriptions: {
    free: 623,
    pro: 245,
    enterprise: 24,
  },
  churnRate: 2.3,
  avgRevenuePerUser: 30.8,
}

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    organization: "DevRetain Media",
    plan: "PRO",
    status: "active",
    role: "OWNER",
    createdAt: "2024-01-15",
    lastLogin: "2024-11-18",
  },
  {
    id: "2",
    name: "Mehmet Demir",
    email: "mehmet@techcorp.com",
    organization: "TechCorp",
    plan: "ENTERPRISE",
    status: "active",
    role: "ADMIN",
    createdAt: "2024-02-20",
    lastLogin: "2024-11-17",
  },
  {
    id: "3",
    name: "Ayşe Kaya",
    email: "ayse@startup.io",
    organization: "Startup.io",
    plan: "FREE",
    status: "suspended",
    role: "OWNER",
    createdAt: "2024-03-10",
    lastLogin: "2024-10-05",
  },
  {
    id: "4",
    name: "Fatma Şahin",
    email: "fatma@media.com",
    organization: "Media House",
    plan: "PRO",
    status: "active",
    role: "MEMBER",
    createdAt: "2024-04-05",
    lastLogin: "2024-11-18",
  },
  {
    id: "5",
    name: "Ali Öztürk",
    email: "ali@agency.co",
    organization: "Creative Agency",
    plan: "PRO",
    status: "active",
    role: "OWNER",
    createdAt: "2024-05-12",
    lastLogin: "2024-11-16",
  },
  {
    id: "6",
    name: "Zeynep Arslan",
    email: "zeynep@brand.com",
    organization: "Brand Studio",
    plan: "FREE",
    status: "active",
    role: "OWNER",
    createdAt: "2024-06-20",
    lastLogin: "2024-11-15",
  },
]

// Mock sponsors data (global/anonymized)
const globalSponsors = [
  { id: "1", industry: "Teknoloji", totalDeals: 156, totalRevenue: 2450000, avgDealSize: 15705, growth: 23.5 },
  { id: "2", industry: "E-Ticaret", totalDeals: 134, totalRevenue: 1890000, avgDealSize: 14104, growth: 18.2 },
  { id: "3", industry: "Finans", totalDeals: 89, totalRevenue: 1650000, avgDealSize: 18539, growth: 12.8 },
  { id: "4", industry: "Sağlık", totalDeals: 67, totalRevenue: 980000, avgDealSize: 14627, growth: 8.5 },
  { id: "5", industry: "Eğitim", totalDeals: 58, totalRevenue: 720000, avgDealSize: 12414, growth: 15.3 },
  { id: "6", industry: "Oyun", totalDeals: 45, totalRevenue: 890000, avgDealSize: 19778, growth: 32.1 },
  { id: "7", industry: "Gıda", totalDeals: 42, totalRevenue: 560000, avgDealSize: 13333, growth: 5.2 },
  { id: "8", industry: "Otomotiv", totalDeals: 28, totalRevenue: 1120000, avgDealSize: 40000, growth: -2.3 },
]

// Mock activity logs
const activityLogs = [
  {
    id: "1",
    type: "payment_failed",
    severity: "error",
    message: "Ödeme başarısız: Kart reddedildi",
    user: "mehmet@techcorp.com",
    timestamp: "2024-11-18 14:32:15",
  },
  {
    id: "2",
    type: "subscription_upgraded",
    severity: "success",
    message: "Abonelik yükseltildi: FREE → PRO",
    user: "ayse@startup.io",
    timestamp: "2024-11-18 13:45:22",
  },
  {
    id: "3",
    type: "user_suspended",
    severity: "warning",
    message: "Kullanıcı askıya alındı: Şüpheli aktivite",
    user: "spam@fake.com",
    timestamp: "2024-11-18 12:20:10",
  },
  {
    id: "4",
    type: "payment_success",
    severity: "success",
    message: "Ödeme alındı: $199.00 (Enterprise)",
    user: "enterprise@bigcorp.com",
    timestamp: "2024-11-18 11:15:33",
  },
  {
    id: "5",
    type: "api_error",
    severity: "error",
    message: "Stripe API hatası: Rate limit aşıldı",
    user: "system",
    timestamp: "2024-11-18 10:05:45",
  },
  {
    id: "6",
    type: "subscription_canceled",
    severity: "warning",
    message: "Abonelik iptal edildi",
    user: "former@customer.com",
    timestamp: "2024-11-18 09:30:18",
  },
  {
    id: "7",
    type: "new_signup",
    severity: "info",
    message: "Yeni kullanıcı kaydı",
    user: "new@user.com",
    timestamp: "2024-11-18 08:45:55",
  },
  {
    id: "8",
    type: "payment_success",
    severity: "success",
    message: "Ödeme alındı: $49.00 (Pro)",
    user: "pro@user.com",
    timestamp: "2024-11-17 23:20:12",
  },
]

// Mock audit logs (critical operations)
const mockAuditLogs = [
  {
    id: "1",
    category: "SUBSCRIPTION",
    severity: "CRITICAL",
    action: "subscription.canceled",
    title: "Abonelik İptal Edildi",
    description: "Enterprise abonelik iptal edildi",
    entityType: "subscription",
    entityId: "sub_123",
    entityName: "TechCorp",
    actorEmail: "admin@techcorp.com",
    actorName: "Mehmet Demir",
    organizationName: "TechCorp",
    amountInvolved: 199,
    currency: "USD",
    requiresReview: true,
    isReviewed: false,
    createdAt: "2024-11-18T14:30:00Z",
    dataBefore: { plan: "ENTERPRISE", status: "ACTIVE" },
    dataAfter: { plan: "ENTERPRISE", status: "CANCELED" },
  },
  {
    id: "2",
    category: "CAMPAIGN",
    severity: "CRITICAL",
    action: "campaign.deleted",
    title: "Büyük Bütçeli Kampanya Silindi",
    description: '"Yaz Sezonu 2024" kampanyası silindi (₺125,000 bütçe)',
    entityType: "campaign",
    entityId: "camp_456",
    entityName: "Yaz Sezonu 2024",
    actorEmail: "ahmet@devretain.com",
    actorName: "Ahmet Yılmaz",
    organizationName: "DevRetain Media",
    amountInvolved: 125000,
    currency: "TRY",
    requiresReview: true,
    isReviewed: true,
    reviewedAt: "2024-11-18T15:00:00Z",
    createdAt: "2024-11-18T12:15:00Z",
    dataBefore: { name: "Yaz Sezonu 2024", budget: 125000, status: "ACTIVE" },
    dataAfter: null,
  },
  {
    id: "3",
    category: "USER_MANAGEMENT",
    severity: "CRITICAL",
    action: "user.suspended",
    title: "Kullanıcı Askıya Alındı",
    description: "Şüpheli aktivite nedeniyle askıya alındı",
    entityType: "user",
    entityId: "user_789",
    entityName: "spam@fake.com",
    actorEmail: "admin@devretain.com",
    actorName: "Super Admin",
    actorRole: "SUPER_ADMIN",
    targetUserEmail: "spam@fake.com",
    requiresReview: false,
    isReviewed: true,
    createdAt: "2024-11-18T10:45:00Z",
    dataBefore: { isSuspended: false },
    dataAfter: { isSuspended: true, suspendedReason: "Şüpheli aktivite" },
  },
  {
    id: "4",
    category: "AUTHORIZATION",
    severity: "CRITICAL",
    action: "admin.role_changed",
    title: "Sistem Rolü Değiştirildi",
    description: "USER → ADMIN rolüne yükseltildi",
    entityType: "user",
    entityId: "user_101",
    entityName: "support@devretain.com",
    actorEmail: "superadmin@devretain.com",
    actorName: "Super Admin",
    actorRole: "SUPER_ADMIN",
    targetUserEmail: "support@devretain.com",
    requiresReview: true,
    isReviewed: false,
    createdAt: "2024-11-17T16:30:00Z",
    dataBefore: { systemRole: "USER" },
    dataAfter: { systemRole: "ADMIN" },
  },
  {
    id: "5",
    category: "FINANCIAL",
    severity: "HIGH",
    action: "transaction.income_recorded",
    title: "Büyük Gelir Kaydedildi",
    description: "₺250,000 tutarında sponsorluk ödemesi",
    entityType: "transaction",
    entityId: "tx_202",
    entityName: "Sponsorluk Ödemesi - Q4",
    actorEmail: "finance@media.com",
    actorName: "Fatma Şahin",
    organizationName: "Media House",
    amountInvolved: 250000,
    currency: "TRY",
    requiresReview: false,
    isReviewed: false,
    createdAt: "2024-11-17T11:00:00Z",
    dataAfter: { amount: 250000, type: "INCOME", status: "COMPLETED" },
  },
  {
    id: "6",
    category: "DATA_MANAGEMENT",
    severity: "CRITICAL",
    action: "data.bulk_deleted",
    title: "Toplu Silme İşlemi",
    description: "45 adet eski kampanya kaydı silindi",
    entityType: "campaign",
    entityId: "bulk_del_303",
    entityName: "45 kampanya",
    actorEmail: "cleanup@agency.co",
    actorName: "Ali Öztürk",
    organizationName: "Creative Agency",
    requiresReview: true,
    isReviewed: false,
    createdAt: "2024-11-16T09:00:00Z",
    dataBefore: { count: 45 },
    dataAfter: null,
  },
  {
    id: "7",
    category: "SPONSOR",
    severity: "HIGH",
    action: "sponsor.deleted",
    title: "Sponsor Silindi",
    description: '"Global Tech Inc." sponsoru silindi (₺500,000 toplam işlem)',
    entityType: "sponsor",
    entityId: "sp_404",
    entityName: "Global Tech Inc.",
    actorEmail: "manager@startup.io",
    actorName: "Ayşe Kaya",
    organizationName: "Startup.io",
    amountInvolved: 500000,
    currency: "TRY",
    requiresReview: true,
    isReviewed: true,
    reviewedAt: "2024-11-16T14:00:00Z",
    createdAt: "2024-11-16T08:30:00Z",
    dataBefore: { name: "Global Tech Inc.", tier: "DIAMOND", totalTransactions: 500000 },
    dataAfter: null,
  },
  {
    id: "8",
    category: "SUBSCRIPTION",
    severity: "HIGH",
    action: "subscription.upgraded",
    title: "Abonelik Yükseltildi",
    description: "FREE → PRO planına yükseltildi",
    entityType: "subscription",
    entityId: "sub_505",
    entityName: "Brand Studio",
    actorEmail: "zeynep@brand.com",
    actorName: "Zeynep Arslan",
    organizationName: "Brand Studio",
    amountInvolved: 49,
    currency: "USD",
    requiresReview: false,
    isReviewed: false,
    createdAt: "2024-11-15T17:45:00Z",
    dataBefore: { plan: "FREE", price: 0 },
    dataAfter: { plan: "PRO", price: 49 },
  },
]

// Audit log category config
const auditCategoryConfig = {
  AUTHENTICATION: { icon: Lock, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800", label: "Kimlik Doğrulama" },
  AUTHORIZATION: { icon: ShieldAlert, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30", label: "Yetkilendirme" },
  SUBSCRIPTION: { icon: CreditCardIcon, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", label: "Abonelik" },
  FINANCIAL: { icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", label: "Finansal" },
  DATA_MANAGEMENT: { icon: Database, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30", label: "Veri Yönetimi" },
  CAMPAIGN: { icon: BarChart3, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30", label: "Kampanya" },
  SPONSOR: { icon: Building2, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30", label: "Sponsor" },
  USER_MANAGEMENT: { icon: UserCog, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30", label: "Kullanıcı Yönetimi" },
  SYSTEM: { icon: Settings, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-800", label: "Sistem" },
  SECURITY: { icon: Shield, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30", label: "Güvenlik" },
}

// Audit log severity config
const auditSeverityConfig = {
  LOW: { color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800", border: "border-slate-300", label: "Düşük" },
  MEDIUM: { color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-300", label: "Orta" },
  HIGH: { color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-300", label: "Yüksek" },
  CRITICAL: { color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-300", label: "Kritik" },
}

const logSeverityConfig = {
  error: { icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  success: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  info: { icon: Activity, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
}

const planColors = {
  FREE: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  PRO: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  ENTERPRISE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userSearch, setUserSearch] = useState("")
  const [userFilter, setUserFilter] = useState("all")
  const [logFilter, setLogFilter] = useState("all")
  const [auditCategoryFilter, setAuditCategoryFilter] = useState("all")
  const [auditSeverityFilter, setAuditSeverityFilter] = useState("all")
  const [auditReviewFilter, setAuditReviewFilter] = useState("all")

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                         user.organization.toLowerCase().includes(userSearch.toLowerCase())
    const matchesFilter = userFilter === "all" || user.status === userFilter || user.plan === userFilter
    return matchesSearch && matchesFilter
  })

  const filteredLogs = activityLogs.filter(log => {
    return logFilter === "all" || log.severity === logFilter
  })

  const filteredAuditLogs = mockAuditLogs.filter(log => {
    const matchesCategory = auditCategoryFilter === "all" || log.category === auditCategoryFilter
    const matchesSeverity = auditSeverityFilter === "all" || log.severity === auditSeverityFilter
    const matchesReview = auditReviewFilter === "all" || 
      (auditReviewFilter === "pending" && log.requiresReview && !log.isReviewed) ||
      (auditReviewFilter === "reviewed" && log.isReviewed)
    return matchesCategory && matchesSeverity && matchesReview
  })

  // Audit log stats
  const auditStats = {
    total: mockAuditLogs.length,
    critical: mockAuditLogs.filter(l => l.severity === "CRITICAL").length,
    pendingReview: mockAuditLogs.filter(l => l.requiresReview && !l.isReviewed).length,
    reviewed: mockAuditLogs.filter(l => l.isReviewed).length,
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value)
  }

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
              <Shield className="h-5 w-5 text-red-500" />
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-red-500/50 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <Shield className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 h-12">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Sistem Özeti</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Kullanıcılar</span>
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Sponsor Havuzu</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Sistem Hareketleri</span>
              {auditStats.pendingReview > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                  {auditStats.pendingReview}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Log Kayıtları</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Toplam Kullanıcı</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {formatNumber(systemStats.totalUsers)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        <span className="text-xs text-emerald-600">+{systemStats.userGrowth}%</span>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Aylık Gelir (MRR)</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {formatCurrency(systemStats.mrr)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        <span className="text-xs text-emerald-600">+{systemStats.mrrGrowth}%</span>
                      </div>
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
                      <p className="text-sm text-slate-500">Yıllık Gelir (ARR)</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {formatCurrency(systemStats.arr)}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        ARPU: {formatCurrency(systemStats.avgRevenuePerUser)}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Churn Rate</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {systemStats.churnRate}%
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Aylık kayıp oranı
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subscription Distribution */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Abonelik Dağılımı</CardTitle>
                  <CardDescription>Aktif aboneliklerin plan bazında dağılımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Free */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={planColors.FREE}>FREE</Badge>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {systemStats.activeSubscriptions.free} kullanıcı
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {((systemStats.activeSubscriptions.free / systemStats.totalOrganizations) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-400 rounded-full"
                          style={{ width: `${(systemStats.activeSubscriptions.free / systemStats.totalOrganizations) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Pro */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={planColors.PRO}>PRO</Badge>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {systemStats.activeSubscriptions.pro} kullanıcı
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {((systemStats.activeSubscriptions.pro / systemStats.totalOrganizations) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${(systemStats.activeSubscriptions.pro / systemStats.totalOrganizations) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Enterprise */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={planColors.ENTERPRISE}>
                            <Crown className="h-3 w-3 mr-1" />
                            ENTERPRISE
                          </Badge>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {systemStats.activeSubscriptions.enterprise} kullanıcı
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {((systemStats.activeSubscriptions.enterprise / systemStats.totalOrganizations) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${(systemStats.activeSubscriptions.enterprise / systemStats.totalOrganizations) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Revenue Breakdown */}
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Gelir Dağılımı</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">$0</p>
                        <p className="text-xs text-slate-500">Free</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                        <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
                          {formatCurrency(systemStats.activeSubscriptions.pro * 49)}
                        </p>
                        <p className="text-xs text-slate-500">Pro</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          {formatCurrency(systemStats.activeSubscriptions.enterprise * 199)}
                        </p>
                        <p className="text-xs text-slate-500">Enterprise</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Summary */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Son Aktiviteler</CardTitle>
                  <CardDescription>Son 24 saatteki önemli olaylar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityLogs.slice(0, 6).map((log) => {
                      const config = logSeverityConfig[log.severity as keyof typeof logSeverityConfig]
                      const Icon = config.icon
                      return (
                        <div key={log.id} className="flex items-start gap-3">
                          <div className={cn("p-1.5 rounded-lg", config.bg)}>
                            <Icon className={cn("h-4 w-4", config.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 dark:text-white truncate">
                              {log.message}
                            </p>
                            <p className="text-xs text-slate-500">{log.timestamp}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-sm" onClick={() => setActiveTab("logs")}>
                    Tüm Logları Gör
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">Kullanıcı Yönetimi</CardTitle>
                    <CardDescription>Tüm kullanıcıları görüntüle ve yönet</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Kullanıcı ara..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Select value={userFilter} onValueChange={setUserFilter}>
                      <SelectTrigger className="w-32">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="suspended">Askıda</SelectItem>
                        <SelectItem value="FREE">Free</SelectItem>
                        <SelectItem value="PRO">Pro</SelectItem>
                        <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                        <TableHead>Kullanıcı</TableHead>
                        <TableHead>Organizasyon</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Son Giriş</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                {user.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-slate-400" />
                              <span className="text-sm">{user.organization}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={planColors[user.plan as keyof typeof planColors]}>
                              {user.plan === "ENTERPRISE" && <Crown className="h-3 w-3 mr-1" />}
                              {user.plan}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              user.status === "active" 
                                ? "border-emerald-500/50 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                : "border-red-500/50 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                            )}>
                              {user.status === "active" ? (
                                <><UserCheck className="h-3 w-3 mr-1" />Aktif</>
                              ) : (
                                <><Ban className="h-3 w-3 mr-1" />Askıda</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <Clock className="h-3 w-3" />
                              {new Date(user.lastLogin).toLocaleDateString('tr-TR')}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent align="end" className="w-48 p-1">
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                                  <Eye className="h-4 w-4" />
                                  Detayları Gör
                                </button>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                                  <Crown className="h-4 w-4" />
                                  Rol Değiştir
                                </button>
                                {user.status === "active" ? (
                                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600">
                                    <Ban className="h-4 w-4" />
                                    Askıya Al
                                  </button>
                                ) : (
                                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600">
                                    <UserCheck className="h-4 w-4" />
                                    Aktif Et
                                  </button>
                                )}
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-slate-500">
                    {filteredUsers.length} kullanıcı gösteriliyor
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>Önceki</Button>
                    <Button variant="outline" size="sm">Sonraki</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sponsors Tab */}
          <TabsContent value="sponsors" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Global Sponsor Havuzu</CardTitle>
                    <CardDescription>Sistem genelinde sektör bazlı sponsor istatistikleri (anonimleştirilmiş)</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Yenile
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                        <TableHead>Sektör</TableHead>
                        <TableHead className="text-right">Toplam Anlaşma</TableHead>
                        <TableHead className="text-right">Toplam Gelir</TableHead>
                        <TableHead className="text-right">Ort. Anlaşma</TableHead>
                        <TableHead className="text-right">Büyüme</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {globalSponsors.map((sponsor) => (
                        <TableRow key={sponsor.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Globe className="h-4 w-4 text-slate-500" />
                              </div>
                              <span className="font-medium">{sponsor.industry}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatNumber(sponsor.totalDeals)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-emerald-600">
                            ₺{formatNumber(sponsor.totalRevenue)}
                          </TableCell>
                          <TableCell className="text-right">
                            ₺{formatNumber(sponsor.avgDealSize)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                              sponsor.growth > 0 
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                            )}>
                              {sponsor.growth > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {sponsor.growth > 0 ? "+" : ""}{sponsor.growth}%
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formatNumber(globalSponsors.reduce((a, b) => a + b.totalDeals, 0))}
                    </p>
                    <p className="text-xs text-slate-500">Toplam Anlaşma</p>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₺{formatNumber(globalSponsors.reduce((a, b) => a + b.totalRevenue, 0))}
                    </p>
                    <p className="text-xs text-slate-500">Toplam Gelir</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {globalSponsors.length}
                    </p>
                    <p className="text-xs text-slate-500">Aktif Sektör</p>
                  </div>
                  <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-center">
                    <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                      ₺{formatNumber(Math.round(globalSponsors.reduce((a, b) => a + b.avgDealSize, 0) / globalSponsors.length))}
                    </p>
                    <p className="text-xs text-slate-500">Ort. Anlaşma Değeri</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab (Sistem Hareketleri) */}
          <TabsContent value="audit" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Toplam Kayıt</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{auditStats.total}</p>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-slate-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Kritik İşlemler</p>
                      <p className="text-xl font-bold text-red-600">{auditStats.critical}</p>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <AlertOctagon className="h-4 w-4 text-red-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">İnceleme Bekleyen</p>
                      <p className="text-xl font-bold text-amber-600">{auditStats.pendingReview}</p>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">İncelendi</p>
                      <p className="text-xl font-bold text-emerald-600">{auditStats.reviewed}</p>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <CheckCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Audit Log Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">Sistem Hareketleri (Audit Log)</CardTitle>
                    <CardDescription>Kritik işlemler ve değişiklik geçmişi</CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={auditCategoryFilter} onValueChange={setAuditCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Kategoriler</SelectItem>
                        <SelectItem value="SUBSCRIPTION">Abonelik</SelectItem>
                        <SelectItem value="CAMPAIGN">Kampanya</SelectItem>
                        <SelectItem value="FINANCIAL">Finansal</SelectItem>
                        <SelectItem value="USER_MANAGEMENT">Kullanıcı</SelectItem>
                        <SelectItem value="AUTHORIZATION">Yetkilendirme</SelectItem>
                        <SelectItem value="DATA_MANAGEMENT">Veri Yönetimi</SelectItem>
                        <SelectItem value="SPONSOR">Sponsor</SelectItem>
                        <SelectItem value="SECURITY">Güvenlik</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={auditSeverityFilter} onValueChange={setAuditSeverityFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Önem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Önemler</SelectItem>
                        <SelectItem value="CRITICAL">Kritik</SelectItem>
                        <SelectItem value="HIGH">Yüksek</SelectItem>
                        <SelectItem value="MEDIUM">Orta</SelectItem>
                        <SelectItem value="LOW">Düşük</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={auditReviewFilter} onValueChange={setAuditReviewFilter}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="İnceleme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="pending">Bekleyen</SelectItem>
                        <SelectItem value="reviewed">İncelendi</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredAuditLogs.map((log) => {
                    const categoryConfig = auditCategoryConfig[log.category as keyof typeof auditCategoryConfig]
                    const severityConfig = auditSeverityConfig[log.severity as keyof typeof auditSeverityConfig]
                    const CategoryIcon = categoryConfig?.icon || FileText
                    
                    return (
                      <div 
                        key={log.id}
                        className={cn(
                          "p-4 rounded-lg border transition-colors",
                          severityConfig?.bg,
                          log.requiresReview && !log.isReviewed 
                            ? "border-amber-300 dark:border-amber-700" 
                            : "border-slate-200 dark:border-slate-700"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          {/* Category Icon */}
                          <div className={cn("p-2.5 rounded-lg shrink-0", categoryConfig?.bg)}>
                            <CategoryIcon className={cn("h-5 w-5", categoryConfig?.color)} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-medium text-slate-900 dark:text-white">
                                    {log.title}
                                  </h4>
                                  <Badge className={cn("text-xs", severityConfig?.bg, severityConfig?.color)}>
                                    {severityConfig?.label}
                                  </Badge>
                                  {log.requiresReview && !log.isReviewed && (
                                    <Badge className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                      <Clock className="h-3 w-3 mr-1" />
                                      İnceleme Bekliyor
                                    </Badge>
                                  )}
                                  {log.isReviewed && (
                                    <Badge className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                      <CheckCheck className="h-3 w-3 mr-1" />
                                      İncelendi
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  {log.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {log.actorName || log.actorEmail}
                                  </span>
                                  {log.organizationName && (
                                    <span className="flex items-center gap-1">
                                      <Building2 className="h-3 w-3" />
                                      {log.organizationName}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(log.createdAt).toLocaleString('tr-TR')}
                                  </span>
                                  {log.amountInvolved && (
                                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                                      <DollarSign className="h-3 w-3" />
                                      {log.currency === "TRY" ? "₺" : "$"}{formatNumber(log.amountInvolved)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Actions */}
                              <div className="flex items-center gap-2 shrink-0">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                                      <Eye className="h-4 w-4" />
                                      <span className="hidden sm:inline">Detay</span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent align="end" className="w-80 p-4">
                                    <h4 className="font-medium mb-3">İşlem Detayları</h4>
                                    <div className="space-y-3 text-sm">
                                      <div>
                                        <p className="text-xs text-slate-500 mb-1">İşlem</p>
                                        <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                          {log.action}
                                        </code>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500 mb-1">Entity</p>
                                        <p>{log.entityType}: {log.entityId}</p>
                                      </div>
                                      {log.dataBefore && (
                                        <div>
                                          <p className="text-xs text-slate-500 mb-1">Önceki Durum</p>
                                          <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-auto max-h-24">
                                            {JSON.stringify(log.dataBefore, null, 2)}
                                          </pre>
                                        </div>
                                      )}
                                      {log.dataAfter && (
                                        <div>
                                          <p className="text-xs text-slate-500 mb-1">Sonraki Durum</p>
                                          <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-auto max-h-24">
                                            {JSON.stringify(log.dataAfter, null, 2)}
                                          </pre>
                                        </div>
                                      )}
                                      {log.targetUserEmail && (
                                        <div>
                                          <p className="text-xs text-slate-500 mb-1">Hedef Kullanıcı</p>
                                          <p>{log.targetUserEmail}</p>
                                        </div>
                                      )}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                                {log.requiresReview && !log.isReviewed && (
                                  <Button size="sm" className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700">
                                    <CheckCheck className="h-4 w-4" />
                                    <span className="hidden sm:inline">İncele</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {filteredAuditLogs.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Filtrelere uygun kayıt bulunamadı.</p>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-slate-500">
                    {filteredAuditLogs.length} kayıt gösteriliyor
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>Önceki</Button>
                    <Button variant="outline" size="sm">Sonraki</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">Sistem Log Kayıtları</CardTitle>
                    <CardDescription>Ödeme hataları, sistem uyarıları ve önemli olaylar</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select value={logFilter} onValueChange={setLogFilter}>
                      <SelectTrigger className="w-36">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="error">Hatalar</SelectItem>
                        <SelectItem value="warning">Uyarılar</SelectItem>
                        <SelectItem value="success">Başarılı</SelectItem>
                        <SelectItem value="info">Bilgi</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Yenile
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredLogs.map((log) => {
                    const config = logSeverityConfig[log.severity as keyof typeof logSeverityConfig]
                    const Icon = config.icon
                    return (
                      <div 
                        key={log.id}
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                          config.bg,
                          "border-slate-200 dark:border-slate-700"
                        )}
                      >
                        <div className={cn("p-2 rounded-lg bg-white dark:bg-slate-900")}>
                          <Icon className={cn("h-5 w-5", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {log.message}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500">
                                  {log.user}
                                </span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-500">
                                  {log.timestamp}
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline" className={cn(
                              "shrink-0",
                              log.severity === "error" && "border-red-500/50 text-red-600",
                              log.severity === "warning" && "border-amber-500/50 text-amber-600",
                              log.severity === "success" && "border-emerald-500/50 text-emerald-600",
                              log.severity === "info" && "border-blue-500/50 text-blue-600"
                            )}>
                              {log.severity === "error" && "Hata"}
                              {log.severity === "warning" && "Uyarı"}
                              {log.severity === "success" && "Başarılı"}
                              {log.severity === "info" && "Bilgi"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Load More */}
                <div className="flex justify-center mt-6">
                  <Button variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Daha Fazla Yükle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
