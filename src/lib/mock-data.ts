/**
 * Mock Data - DevRetain CRM
 * 
 * PostgreSQL olmadan demo amaçlı kullanılacak dummy veri seti.
 */

// ============================================================================
// TYPES
// ============================================================================

export type MockUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar: string | null
  phone: string | null
  isActive: boolean
  createdAt: Date
}

export type MockOrganization = {
  id: string
  name: string
  slug: string
  type: 'YOUTUBER' | 'CLUB' | 'BUSINESS'
  description: string | null
  logo: string | null
  website: string | null
  email: string | null
  city: string | null
  country: string
  currency: string
  isActive: boolean
  createdAt: Date
}

export type MockSponsor = {
  id: string
  companyName: string
  industry: string | null
  website: string | null
  logo: string | null
  city: string | null
  country: string
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
  isActive: boolean
  acquisitionSource: string | null
  acquisitionDate: Date
  organizationId: string
}

export type MockSponsorContact = {
  id: string
  sponsorId: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  jobTitle: string | null
  isPrimary: boolean
}

export type MockCampaign = {
  id: string
  name: string
  slug: string
  type: 'BRAND_AWARENESS' | 'PRODUCT_LAUNCH' | 'EVENT_SPONSORSHIP' | 'CONTENT_SPONSORSHIP' | 'AFFILIATE' | 'INFLUENCER'
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
  budgetTotal: number
  budgetSpent: number
  currency: string
  startDate: Date
  endDate: Date
  targetImpressions: number | null
  targetClicks: number | null
  targetConversions: number | null
  totalImpressions: number
  totalClicks: number
  totalConversions: number
  organizationId: string
  createdById: string
  createdAt: Date
}

export type MockTransaction = {
  id: string
  type: 'INCOME' | 'EXPENSE'
  category: 'AD_SPEND' | 'SPONSORSHIP_FEE' | 'COMMISSION' | 'BONUS' | 'REFUND' | 'PLATFORM_FEE' | 'OTHER'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED'
  amount: number
  currency: string
  transactionDate: Date
  paidAt: Date | null
  description: string | null
  organizationId: string
  campaignId: string | null
  sponsorId: string | null
}

export type MockMetric = {
  id: string
  type: 'CLICK' | 'IMPRESSION' | 'VIEW' | 'CONVERSION' | 'ENGAGEMENT' | 'LIKE' | 'SHARE' | 'COMMENT'
  source: 'YOUTUBE' | 'INSTAGRAM' | 'TIKTOK' | 'TWITTER' | 'WEBSITE'
  value: number
  recordedAt: Date
  campaignId: string
  organizationId: string
}

export type MockRFMScore = {
  id: string
  sponsorId: string
  recencyScore: number
  frequencyScore: number
  monetaryScore: number
  rfmScore: number
  segment: string
  lastTransactionDate: Date | null
  transactionCount: number
  totalMonetary: number
  calculatedAt: Date
}

// ROO (Return on Objectives) Types
export type MockObjectiveType = 
  | 'AWARENESS'
  | 'REACH'
  | 'ENGAGEMENT'
  | 'VIDEO_VIEWS'
  | 'WEBSITE_TRAFFIC'
  | 'LEAD_GENERATION'
  | 'APP_DOWNLOAD'
  | 'SALES'
  | 'SIGN_UP'
  | 'BRAND_SENTIMENT'
  | 'SOCIAL_FOLLOWERS'
  | 'EMAIL_SUBSCRIBERS'
  | 'CONTENT_CREATION'
  | 'EVENT_ATTENDANCE'
  | 'CUSTOM'

export type MockObjectiveStatus = 
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'ON_TRACK'
  | 'AT_RISK'
  | 'BEHIND'
  | 'COMPLETED'
  | 'EXCEEDED'

export type MockCampaignObjective = {
  id: string
  campaignId: string
  type: MockObjectiveType
  name: string
  description: string | null
  targetValue: number
  currentValue: number
  unit: string
  weight: number
  achievementRate: number | null
  weightedScore: number | null
  status: MockObjectiveStatus
  startDate: Date | null
  endDate: Date | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
}

export type MockObjectiveProgress = {
  id: string
  objectiveId: string
  value: number
  previousValue: number | null
  delta: number | null
  achievementRate: number | null
  recordedAt: Date
  periodStart: Date | null
  periodEnd: Date | null
  source: string | null
  notes: string | null
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'ahmet@techturk.com',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    avatar: null,
    phone: '+90 532 123 4567',
    isActive: true,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 'user-2',
    email: 'elif@techturk.com',
    firstName: 'Elif',
    lastName: 'Kaya',
    avatar: null,
    phone: '+90 533 234 5678',
    isActive: true,
    createdAt: new Date('2023-03-20'),
  },
  {
    id: 'user-3',
    email: 'mehmet@anadoluesports.com',
    firstName: 'Mehmet',
    lastName: 'Demir',
    avatar: null,
    phone: '+90 534 345 6789',
    isActive: true,
    createdAt: new Date('2023-02-10'),
  },
]

export const mockOrganizations: MockOrganization[] = [
  {
    id: 'org-1',
    name: 'TechTurk YouTube',
    slug: 'techturk-youtube',
    type: 'YOUTUBER',
    description: "Türkiye'nin en büyük teknoloji YouTube kanalı",
    logo: null,
    website: 'https://youtube.com/@techturk',
    email: 'info@techturk.com',
    city: 'İstanbul',
    country: 'TR',
    currency: 'TRY',
    isActive: true,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'org-2',
    name: 'Anadolu Esports',
    slug: 'anadolu-esports',
    type: 'CLUB',
    description: 'Profesyonel esports kulübü',
    logo: null,
    website: 'https://anadoluesports.com',
    email: 'sponsorship@anadoluesports.com',
    city: 'Ankara',
    country: 'TR',
    currency: 'TRY',
    isActive: true,
    createdAt: new Date('2023-01-15'),
  },
]

export const mockSponsors: MockSponsor[] = [
  {
    id: 'sponsor-1',
    companyName: 'Monster Energy Türkiye',
    industry: 'İçecek',
    website: 'https://monsterenergy.com.tr',
    logo: null,
    city: 'İstanbul',
    country: 'TR',
    tier: 'PLATINUM',
    isActive: true,
    acquisitionSource: 'Direkt İletişim',
    acquisitionDate: new Date('2023-02-15'),
    organizationId: 'org-1',
  },
  {
    id: 'sponsor-2',
    companyName: 'Logitech Türkiye',
    industry: 'Teknoloji / Gaming',
    website: 'https://logitech.com.tr',
    logo: null,
    city: 'İstanbul',
    country: 'TR',
    tier: 'GOLD',
    isActive: true,
    acquisitionSource: 'Ajans Referansı',
    acquisitionDate: new Date('2023-04-01'),
    organizationId: 'org-1',
  },
  {
    id: 'sponsor-3',
    companyName: 'Getir',
    industry: 'E-ticaret / Teknoloji',
    website: 'https://getir.com',
    logo: null,
    city: 'İstanbul',
    country: 'TR',
    tier: 'SILVER',
    isActive: true,
    acquisitionSource: 'Inbound',
    acquisitionDate: new Date('2023-06-10'),
    organizationId: 'org-1',
  },
  {
    id: 'sponsor-4',
    companyName: 'Turkcell',
    industry: 'Telekomünikasyon',
    website: 'https://turkcell.com.tr',
    logo: null,
    city: 'İstanbul',
    country: 'TR',
    tier: 'DIAMOND',
    isActive: true,
    acquisitionSource: 'Kurumsal İletişim',
    acquisitionDate: new Date('2023-01-20'),
    organizationId: 'org-2',
  },
  {
    id: 'sponsor-5',
    companyName: 'Samsung Türkiye',
    industry: 'Teknoloji / Elektronik',
    website: 'https://samsung.com.tr',
    logo: null,
    city: 'İstanbul',
    country: 'TR',
    tier: 'GOLD',
    isActive: true,
    acquisitionSource: 'Fuar',
    acquisitionDate: new Date('2023-08-15'),
    organizationId: 'org-1',
  },
  {
    id: 'sponsor-6',
    companyName: 'Vodafone',
    industry: 'Telekomünikasyon',
    website: 'https://vodafone.com.tr',
    logo: null,
    city: 'İstanbul',
    country: 'TR',
    tier: 'PLATINUM',
    isActive: false,
    acquisitionSource: 'Direkt İletişim',
    acquisitionDate: new Date('2023-03-01'),
    organizationId: 'org-1',
  },
  {
    id: 'sponsor-7',
    companyName: 'Migros',
    industry: 'Perakende',
    website: 'https://migros.com.tr',
    logo: null,
    city: 'İstanbul',
    country: 'TR',
    tier: 'BRONZE',
    isActive: true,
    acquisitionSource: 'Referans',
    acquisitionDate: new Date('2024-01-10'),
    organizationId: 'org-1',
  },
]

export const mockSponsorContacts: MockSponsorContact[] = [
  {
    id: 'contact-1',
    sponsorId: 'sponsor-1',
    firstName: 'Ayşe',
    lastName: 'Öztürk',
    email: 'ayse.ozturk@monster.com',
    phone: '+90 532 111 2222',
    jobTitle: 'Pazarlama Müdürü',
    isPrimary: true,
  },
  {
    id: 'contact-2',
    sponsorId: 'sponsor-2',
    firstName: 'Deniz',
    lastName: 'Arslan',
    email: 'deniz.arslan@logitech.com',
    phone: '+90 534 333 4444',
    jobTitle: 'İçerik Pazarlama Uzmanı',
    isPrimary: true,
  },
  {
    id: 'contact-3',
    sponsorId: 'sponsor-4',
    firstName: 'Berk',
    lastName: 'Koç',
    email: 'berk.koc@turkcell.com.tr',
    phone: '+90 535 444 5555',
    jobTitle: 'Sponsorluk Direktörü',
    isPrimary: true,
  },
]

export const mockCampaigns: MockCampaign[] = [
  {
    id: 'campaign-1',
    name: 'Yaz Teknoloji Festivali 2024',
    slug: 'yaz-teknoloji-festivali-2024',
    type: 'BRAND_AWARENESS',
    status: 'ACTIVE',
    budgetTotal: 150000,
    budgetSpent: 87500,
    currency: 'TRY',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    targetImpressions: 5000000,
    targetClicks: 100000,
    targetConversions: 5000,
    totalImpressions: 3250000,
    totalClicks: 68000,
    totalConversions: 2850,
    organizationId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date('2024-05-15'),
  },
  {
    id: 'campaign-2',
    name: 'Gaming Gear Lansmanı',
    slug: 'gaming-gear-lansmani',
    type: 'PRODUCT_LAUNCH',
    status: 'ACTIVE',
    budgetTotal: 80000,
    budgetSpent: 45000,
    currency: 'TRY',
    startDate: new Date('2024-07-15'),
    endDate: new Date('2024-09-15'),
    targetImpressions: 2000000,
    targetClicks: 50000,
    targetConversions: 2000,
    totalImpressions: 1200000,
    totalClicks: 28000,
    totalConversions: 950,
    organizationId: 'org-1',
    createdById: 'user-2',
    createdAt: new Date('2024-07-01'),
  },
  {
    id: 'campaign-3',
    name: 'Esports Turnuva Sponsorluğu',
    slug: 'esports-turnuva-sponsorlugu',
    type: 'EVENT_SPONSORSHIP',
    status: 'COMPLETED',
    budgetTotal: 500000,
    budgetSpent: 485000,
    currency: 'TRY',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-31'),
    targetImpressions: 10000000,
    targetClicks: 200000,
    targetConversions: 10000,
    totalImpressions: 12500000,
    totalClicks: 245000,
    totalConversions: 12500,
    organizationId: 'org-2',
    createdById: 'user-3',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'campaign-4',
    name: 'Kış İndirimleri Kampanyası',
    slug: 'kis-indirimleri-kampanyasi',
    type: 'AFFILIATE',
    status: 'DRAFT',
    budgetTotal: 60000,
    budgetSpent: 0,
    currency: 'TRY',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2025-01-31'),
    targetImpressions: 1500000,
    targetClicks: 30000,
    targetConversions: 1500,
    totalImpressions: 0,
    totalClicks: 0,
    totalConversions: 0,
    organizationId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date('2024-11-15'),
  },
  {
    id: 'campaign-5',
    name: 'Bahar Koleksiyonu Tanıtımı',
    slug: 'bahar-koleksiyonu-tanitimi',
    type: 'INFLUENCER',
    status: 'PAUSED',
    budgetTotal: 45000,
    budgetSpent: 22000,
    currency: 'TRY',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-05-15'),
    targetImpressions: 800000,
    targetClicks: 20000,
    targetConversions: 800,
    totalImpressions: 420000,
    totalClicks: 9500,
    totalConversions: 380,
    organizationId: 'org-1',
    createdById: 'user-2',
    createdAt: new Date('2024-03-20'),
  },
]

// Generate transactions
function generateTransactions(): MockTransaction[] {
  const transactions: MockTransaction[] = []
  let txId = 1

  // Campaign 1 transactions
  transactions.push(
    {
      id: `tx-${txId++}`,
      type: 'INCOME',
      category: 'SPONSORSHIP_FEE',
      status: 'COMPLETED',
      amount: 75000,
      currency: 'TRY',
      transactionDate: new Date('2024-06-01'),
      paidAt: new Date('2024-06-05'),
      description: 'Monster Energy - Sponsorluk ödemesi',
      organizationId: 'org-1',
      campaignId: 'campaign-1',
      sponsorId: 'sponsor-1',
    },
    {
      id: `tx-${txId++}`,
      type: 'INCOME',
      category: 'SPONSORSHIP_FEE',
      status: 'COMPLETED',
      amount: 50000,
      currency: 'TRY',
      transactionDate: new Date('2024-06-01'),
      paidAt: new Date('2024-06-03'),
      description: 'Getir - Sponsorluk ödemesi',
      organizationId: 'org-1',
      campaignId: 'campaign-1',
      sponsorId: 'sponsor-3',
    },
    {
      id: `tx-${txId++}`,
      type: 'EXPENSE',
      category: 'AD_SPEND',
      status: 'COMPLETED',
      amount: 25000,
      currency: 'TRY',
      transactionDate: new Date('2024-06-15'),
      paidAt: new Date('2024-06-15'),
      description: 'YouTube Ads - Haziran kampanyası',
      organizationId: 'org-1',
      campaignId: 'campaign-1',
      sponsorId: null,
    },
    {
      id: `tx-${txId++}`,
      type: 'EXPENSE',
      category: 'AD_SPEND',
      status: 'COMPLETED',
      amount: 30000,
      currency: 'TRY',
      transactionDate: new Date('2024-07-15'),
      paidAt: new Date('2024-07-15'),
      description: 'Instagram Ads - Temmuz kampanyası',
      organizationId: 'org-1',
      campaignId: 'campaign-1',
      sponsorId: null,
    },
    {
      id: `tx-${txId++}`,
      type: 'EXPENSE',
      category: 'PLATFORM_FEE',
      status: 'COMPLETED',
      amount: 7500,
      currency: 'TRY',
      transactionDate: new Date('2024-07-01'),
      paidAt: new Date('2024-07-01'),
      description: 'Platform komisyonu',
      organizationId: 'org-1',
      campaignId: 'campaign-1',
      sponsorId: null,
    }
  )

  // Campaign 2 transactions
  transactions.push(
    {
      id: `tx-${txId++}`,
      type: 'INCOME',
      category: 'SPONSORSHIP_FEE',
      status: 'COMPLETED',
      amount: 60000,
      currency: 'TRY',
      transactionDate: new Date('2024-07-15'),
      paidAt: new Date('2024-07-18'),
      description: 'Logitech - Sponsorluk ödemesi',
      organizationId: 'org-1',
      campaignId: 'campaign-2',
      sponsorId: 'sponsor-2',
    },
    {
      id: `tx-${txId++}`,
      type: 'INCOME',
      category: 'SPONSORSHIP_FEE',
      status: 'PENDING',
      amount: 35000,
      currency: 'TRY',
      transactionDate: new Date('2024-08-15'),
      paidAt: null,
      description: 'Samsung - Sponsorluk ödemesi (beklemede)',
      organizationId: 'org-1',
      campaignId: 'campaign-2',
      sponsorId: 'sponsor-5',
    },
    {
      id: `tx-${txId++}`,
      type: 'EXPENSE',
      category: 'AD_SPEND',
      status: 'COMPLETED',
      amount: 20000,
      currency: 'TRY',
      transactionDate: new Date('2024-07-20'),
      paidAt: new Date('2024-07-20'),
      description: 'TikTok Ads',
      organizationId: 'org-1',
      campaignId: 'campaign-2',
      sponsorId: null,
    },
    {
      id: `tx-${txId++}`,
      type: 'EXPENSE',
      category: 'PLATFORM_FEE',
      status: 'COMPLETED',
      amount: 5000,
      currency: 'TRY',
      transactionDate: new Date('2024-07-25'),
      paidAt: new Date('2024-07-25'),
      description: 'Influencer platform komisyonu',
      organizationId: 'org-1',
      campaignId: 'campaign-2',
      sponsorId: null,
    }
  )

  // Campaign 3 transactions (completed campaign)
  transactions.push(
    {
      id: `tx-${txId++}`,
      type: 'INCOME',
      category: 'SPONSORSHIP_FEE',
      status: 'COMPLETED',
      amount: 400000,
      currency: 'TRY',
      transactionDate: new Date('2024-03-01'),
      paidAt: new Date('2024-03-05'),
      description: 'Turkcell - Ana sponsor ödemesi',
      organizationId: 'org-2',
      campaignId: 'campaign-3',
      sponsorId: 'sponsor-4',
    },
    {
      id: `tx-${txId++}`,
      type: 'INCOME',
      category: 'BONUS',
      status: 'COMPLETED',
      amount: 100000,
      currency: 'TRY',
      transactionDate: new Date('2024-06-01'),
      paidAt: new Date('2024-06-10'),
      description: 'Turkcell - Performans bonusu',
      organizationId: 'org-2',
      campaignId: 'campaign-3',
      sponsorId: 'sponsor-4',
    },
    {
      id: `tx-${txId++}`,
      type: 'EXPENSE',
      category: 'AD_SPEND',
      status: 'COMPLETED',
      amount: 150000,
      currency: 'TRY',
      transactionDate: new Date('2024-03-15'),
      paidAt: new Date('2024-03-15'),
      description: 'Çoklu platform reklam harcaması',
      organizationId: 'org-2',
      campaignId: 'campaign-3',
      sponsorId: null,
    },
    {
      id: `tx-${txId++}`,
      type: 'EXPENSE',
      category: 'OTHER',
      status: 'COMPLETED',
      amount: 85000,
      currency: 'TRY',
      transactionDate: new Date('2024-04-01'),
      paidAt: new Date('2024-04-01'),
      description: 'Etkinlik organizasyon giderleri',
      organizationId: 'org-2',
      campaignId: 'campaign-3',
      sponsorId: null,
    }
  )

  // Additional sponsor transactions (for RFM calculation)
  // Monster Energy - multiple transactions
  transactions.push(
    {
      id: `tx-${txId++}`,
      type: 'INCOME',
      category: 'SPONSORSHIP_FEE',
      status: 'COMPLETED',
      amount: 45000,
      currency: 'TRY',
      transactionDate: new Date('2024-01-15'),
      paidAt: new Date('2024-01-18'),
      description: 'Monster Energy - Q1 sponsorluk',
      organizationId: 'org-1',
      campaignId: null,
      sponsorId: 'sponsor-1',
    },
    {
      id: `tx-${txId++}`,
      type: 'INCOME',
      category: 'SPONSORSHIP_FEE',
      status: 'COMPLETED',
      amount: 55000,
      currency: 'TRY',
      transactionDate: new Date('2024-04-10'),
      paidAt: new Date('2024-04-12'),
      description: 'Monster Energy - Q2 sponsorluk',
      organizationId: 'org-1',
      campaignId: null,
      sponsorId: 'sponsor-1',
    }
  )

  // Logitech - additional transactions
  transactions.push(
    {
      id: `tx-${txId++}`,
      type: 'INCOME',
      category: 'SPONSORSHIP_FEE',
      status: 'COMPLETED',
      amount: 40000,
      currency: 'TRY',
      transactionDate: new Date('2024-03-20'),
      paidAt: new Date('2024-03-22'),
      description: 'Logitech - Ürün inceleme sponsorluğu',
      organizationId: 'org-1',
      campaignId: null,
      sponsorId: 'sponsor-2',
    }
  )

  // Getir - single transaction (new customer)
  // Already has one in campaign-1

  // Samsung - recent transaction
  transactions.push(
    {
      id: `tx-${txId++}`,
      type: 'INCOME',
      category: 'SPONSORSHIP_FEE',
      status: 'COMPLETED',
      amount: 80000,
      currency: 'TRY',
      transactionDate: new Date('2024-09-01'),
      paidAt: new Date('2024-09-05'),
      description: 'Samsung - Galaxy lansmanı sponsorluğu',
      organizationId: 'org-1',
      campaignId: null,
      sponsorId: 'sponsor-5',
    }
  )

  // Vodafone - old transactions (churned)
  transactions.push(
    {
      id: `tx-${txId++}`,
      type: 'INCOME',
      category: 'SPONSORSHIP_FEE',
      status: 'COMPLETED',
      amount: 90000,
      currency: 'TRY',
      transactionDate: new Date('2023-06-15'),
      paidAt: new Date('2023-06-18'),
      description: 'Vodafone - Yaz kampanyası',
      organizationId: 'org-1',
      campaignId: null,
      sponsorId: 'sponsor-6',
    },
    {
      id: `tx-${txId++}`,
      type: 'INCOME',
      category: 'SPONSORSHIP_FEE',
      status: 'COMPLETED',
      amount: 70000,
      currency: 'TRY',
      transactionDate: new Date('2023-09-01'),
      paidAt: new Date('2023-09-05'),
      description: 'Vodafone - Sonbahar kampanyası',
      organizationId: 'org-1',
      campaignId: null,
      sponsorId: 'sponsor-6',
    }
  )

  return transactions
}

// Generate metrics
function generateMetrics(): MockMetric[] {
  const metrics: MockMetric[] = []
  let metricId = 1

  const campaigns = ['campaign-1', 'campaign-2', 'campaign-3']
  const orgMap: Record<string, string> = {
    'campaign-1': 'org-1',
    'campaign-2': 'org-1',
    'campaign-3': 'org-2',
  }

  for (const campaignId of campaigns) {
    const campaign = mockCampaigns.find(c => c.id === campaignId)!
    const daysDiff = Math.floor((campaign.endDate.getTime() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysToGenerate = Math.min(daysDiff, 90)

    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date(campaign.startDate)
      date.setDate(date.getDate() + i)

      // YouTube metrics
      metrics.push({
        id: `metric-${metricId++}`,
        type: 'VIEW',
        source: 'YOUTUBE',
        value: Math.floor(Math.random() * 50000) + 10000,
        recordedAt: date,
        campaignId,
        organizationId: orgMap[campaignId],
      })

      metrics.push({
        id: `metric-${metricId++}`,
        type: 'CLICK',
        source: 'YOUTUBE',
        value: Math.floor(Math.random() * 2000) + 500,
        recordedAt: date,
        campaignId,
        organizationId: orgMap[campaignId],
      })

      // Instagram metrics
      metrics.push({
        id: `metric-${metricId++}`,
        type: 'IMPRESSION',
        source: 'INSTAGRAM',
        value: Math.floor(Math.random() * 30000) + 5000,
        recordedAt: date,
        campaignId,
        organizationId: orgMap[campaignId],
      })

      metrics.push({
        id: `metric-${metricId++}`,
        type: 'LIKE',
        source: 'INSTAGRAM',
        value: Math.floor(Math.random() * 3000) + 500,
        recordedAt: date,
        campaignId,
        organizationId: orgMap[campaignId],
      })

      // Conversions (every 3rd day)
      if (i % 3 === 0) {
        metrics.push({
          id: `metric-${metricId++}`,
          type: 'CONVERSION',
          source: 'WEBSITE',
          value: Math.floor(Math.random() * 100) + 20,
          recordedAt: date,
          campaignId,
          organizationId: orgMap[campaignId],
        })
      }
    }
  }

  return metrics
}

export const mockTransactions = generateTransactions()
export const mockMetrics = generateMetrics()

export const mockRFMScores: MockRFMScore[] = [
  {
    id: 'rfm-1',
    sponsorId: 'sponsor-1',
    recencyScore: 5,
    frequencyScore: 5,
    monetaryScore: 5,
    rfmScore: 555,
    segment: 'CHAMPIONS',
    lastTransactionDate: new Date('2024-06-05'),
    transactionCount: 4,
    totalMonetary: 175000,
    calculatedAt: new Date('2024-10-01'),
  },
  {
    id: 'rfm-2',
    sponsorId: 'sponsor-2',
    recencyScore: 5,
    frequencyScore: 3,
    monetaryScore: 4,
    rfmScore: 534,
    segment: 'POTENTIAL_LOYALIST',
    lastTransactionDate: new Date('2024-07-18'),
    transactionCount: 2,
    totalMonetary: 100000,
    calculatedAt: new Date('2024-10-01'),
  },
  {
    id: 'rfm-3',
    sponsorId: 'sponsor-3',
    recencyScore: 4,
    frequencyScore: 1,
    monetaryScore: 3,
    rfmScore: 413,
    segment: 'NEW_CUSTOMERS',
    lastTransactionDate: new Date('2024-06-03'),
    transactionCount: 1,
    totalMonetary: 50000,
    calculatedAt: new Date('2024-10-01'),
  },
  {
    id: 'rfm-4',
    sponsorId: 'sponsor-4',
    recencyScore: 4,
    frequencyScore: 4,
    monetaryScore: 5,
    rfmScore: 445,
    segment: 'CHAMPIONS',
    lastTransactionDate: new Date('2024-06-10'),
    transactionCount: 2,
    totalMonetary: 500000,
    calculatedAt: new Date('2024-10-01'),
  },
  {
    id: 'rfm-5',
    sponsorId: 'sponsor-5',
    recencyScore: 5,
    frequencyScore: 2,
    monetaryScore: 4,
    rfmScore: 524,
    segment: 'PROMISING',
    lastTransactionDate: new Date('2024-09-05'),
    transactionCount: 1,
    totalMonetary: 80000,
    calculatedAt: new Date('2024-10-01'),
  },
  {
    id: 'rfm-6',
    sponsorId: 'sponsor-6',
    recencyScore: 1,
    frequencyScore: 3,
    monetaryScore: 4,
    rfmScore: 134,
    segment: 'AT_RISK',
    lastTransactionDate: new Date('2023-09-05'),
    transactionCount: 2,
    totalMonetary: 160000,
    calculatedAt: new Date('2024-10-01'),
  },
  {
    id: 'rfm-7',
    sponsorId: 'sponsor-7',
    recencyScore: 5,
    frequencyScore: 1,
    monetaryScore: 1,
    rfmScore: 511,
    segment: 'NEW_CUSTOMERS',
    lastTransactionDate: null,
    transactionCount: 0,
    totalMonetary: 0,
    calculatedAt: new Date('2024-10-01'),
  },
]

// ============================================================================
// ROO - CAMPAIGN OBJECTIVES DATA
// ============================================================================

export const mockCampaignObjectives: MockCampaignObjective[] = [
  // Campaign 1: Monster Energy Yaz Kampanyası
  {
    id: 'obj-1-1',
    campaignId: 'campaign-1',
    type: 'VIDEO_VIEWS',
    name: 'Video İzlenme Hedefi',
    description: 'Sponsorlu video içeriğinin toplam izlenme sayısı',
    targetValue: 500000,
    currentValue: 425000,
    unit: 'izlenme',
    weight: 2.0,
    achievementRate: 85,
    weightedScore: 170,
    status: 'ON_TRACK',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    isActive: true,
    sortOrder: 1,
    createdAt: new Date('2024-05-15'),
  },
  {
    id: 'obj-1-2',
    campaignId: 'campaign-1',
    type: 'ENGAGEMENT',
    name: 'Etkileşim Oranı',
    description: 'Beğeni, yorum ve paylaşım toplamı',
    targetValue: 50000,
    currentValue: 62000,
    unit: 'etkileşim',
    weight: 1.5,
    achievementRate: 124,
    weightedScore: 186,
    status: 'EXCEEDED',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    isActive: true,
    sortOrder: 2,
    createdAt: new Date('2024-05-15'),
  },
  {
    id: 'obj-1-3',
    campaignId: 'campaign-1',
    type: 'WEBSITE_TRAFFIC',
    name: 'Web Sitesi Ziyareti',
    description: 'Kampanya linki üzerinden gelen trafik',
    targetValue: 25000,
    currentValue: 18500,
    unit: 'ziyaret',
    weight: 1.0,
    achievementRate: 74,
    weightedScore: 74,
    status: 'AT_RISK',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    isActive: true,
    sortOrder: 3,
    createdAt: new Date('2024-05-15'),
  },
  {
    id: 'obj-1-4',
    campaignId: 'campaign-1',
    type: 'SALES',
    name: 'Satış Dönüşümü',
    description: 'Kampanya kodlu satışlar',
    targetValue: 2500,
    currentValue: 2100,
    unit: 'satış',
    weight: 2.5,
    achievementRate: 84,
    weightedScore: 210,
    status: 'ON_TRACK',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    isActive: true,
    sortOrder: 4,
    createdAt: new Date('2024-05-15'),
  },

  // Campaign 2: Samsung Telefon Lansmanı
  {
    id: 'obj-2-1',
    campaignId: 'campaign-2',
    type: 'REACH',
    name: 'Erişim Hedefi',
    description: 'Toplam benzersiz kullanıcı erişimi',
    targetValue: 2000000,
    currentValue: 2450000,
    unit: 'kullanıcı',
    weight: 1.5,
    achievementRate: 122.5,
    weightedScore: 183.75,
    status: 'EXCEEDED',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-30'),
    isActive: true,
    sortOrder: 1,
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'obj-2-2',
    campaignId: 'campaign-2',
    type: 'VIDEO_VIEWS',
    name: 'Lansman Video İzlenme',
    description: 'Ürün tanıtım videosu izlenme sayısı',
    targetValue: 1000000,
    currentValue: 1150000,
    unit: 'izlenme',
    weight: 2.0,
    achievementRate: 115,
    weightedScore: 230,
    status: 'EXCEEDED',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-30'),
    isActive: true,
    sortOrder: 2,
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'obj-2-3',
    campaignId: 'campaign-2',
    type: 'LEAD_GENERATION',
    name: 'Lead Toplama',
    description: 'Ön sipariş ve ilgi bildiren kullanıcılar',
    targetValue: 5000,
    currentValue: 4200,
    unit: 'lead',
    weight: 2.5,
    achievementRate: 84,
    weightedScore: 210,
    status: 'ON_TRACK',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-30'),
    isActive: true,
    sortOrder: 3,
    createdAt: new Date('2024-02-15'),
  },

  // Campaign 3: Turkcell Esports Sponsorluğu
  {
    id: 'obj-3-1',
    campaignId: 'campaign-3',
    type: 'AWARENESS',
    name: 'Marka Bilinirliği',
    description: 'Marka hatırlanabilirlik oranı artışı',
    targetValue: 30,
    currentValue: 22,
    unit: '%',
    weight: 2.0,
    achievementRate: 73.33,
    weightedScore: 146.66,
    status: 'AT_RISK',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    sortOrder: 1,
    createdAt: new Date('2023-12-01'),
  },
  {
    id: 'obj-3-2',
    campaignId: 'campaign-3',
    type: 'EVENT_ATTENDANCE',
    name: 'Etkinlik Katılımı',
    description: 'Sponsorlu turnuvalara katılım',
    targetValue: 100000,
    currentValue: 85000,
    unit: 'katılımcı',
    weight: 1.5,
    achievementRate: 85,
    weightedScore: 127.5,
    status: 'ON_TRACK',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    sortOrder: 2,
    createdAt: new Date('2023-12-01'),
  },
  {
    id: 'obj-3-3',
    campaignId: 'campaign-3',
    type: 'SOCIAL_FOLLOWERS',
    name: 'Sosyal Medya Takipçi',
    description: 'Yeni takipçi kazanımı',
    targetValue: 50000,
    currentValue: 48000,
    unit: 'takipçi',
    weight: 1.0,
    achievementRate: 96,
    weightedScore: 96,
    status: 'ON_TRACK',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    sortOrder: 3,
    createdAt: new Date('2023-12-01'),
  },

  // Campaign 4: Logitech Gaming Gear
  {
    id: 'obj-4-1',
    campaignId: 'campaign-4',
    type: 'ENGAGEMENT',
    name: 'İçerik Etkileşimi',
    description: 'Ürün inceleme videolarına etkileşim',
    targetValue: 30000,
    currentValue: 35000,
    unit: 'etkileşim',
    weight: 1.5,
    achievementRate: 116.67,
    weightedScore: 175,
    status: 'EXCEEDED',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-06-30'),
    isActive: true,
    sortOrder: 1,
    createdAt: new Date('2024-03-15'),
  },
  {
    id: 'obj-4-2',
    campaignId: 'campaign-4',
    type: 'SALES',
    name: 'Affiliate Satış',
    description: 'Affiliate linkinden gerçekleşen satışlar',
    targetValue: 1500,
    currentValue: 1680,
    unit: 'satış',
    weight: 3.0,
    achievementRate: 112,
    weightedScore: 336,
    status: 'EXCEEDED',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-06-30'),
    isActive: true,
    sortOrder: 2,
    createdAt: new Date('2024-03-15'),
  },
  {
    id: 'obj-4-3',
    campaignId: 'campaign-4',
    type: 'CONTENT_CREATION',
    name: 'İçerik Üretimi',
    description: 'Üretilecek video içerik sayısı',
    targetValue: 12,
    currentValue: 12,
    unit: 'video',
    weight: 1.0,
    achievementRate: 100,
    weightedScore: 100,
    status: 'COMPLETED',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-06-30'),
    isActive: true,
    sortOrder: 3,
    createdAt: new Date('2024-03-15'),
  },

  // Campaign 5: Vodafone Yıllık Anlaşma
  {
    id: 'obj-5-1',
    campaignId: 'campaign-5',
    type: 'REACH',
    name: 'Yıllık Erişim',
    description: 'Yıl boyunca toplam erişim',
    targetValue: 5000000,
    currentValue: 3200000,
    unit: 'kullanıcı',
    weight: 1.5,
    achievementRate: 64,
    weightedScore: 96,
    status: 'BEHIND',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    sortOrder: 1,
    createdAt: new Date('2023-12-15'),
  },
  {
    id: 'obj-5-2',
    campaignId: 'campaign-5',
    type: 'APP_DOWNLOAD',
    name: 'Uygulama İndirme',
    description: 'Vodafone uygulaması indirme',
    targetValue: 10000,
    currentValue: 5500,
    unit: 'indirme',
    weight: 2.5,
    achievementRate: 55,
    weightedScore: 137.5,
    status: 'BEHIND',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    sortOrder: 2,
    createdAt: new Date('2023-12-15'),
  },
  {
    id: 'obj-5-3',
    campaignId: 'campaign-5',
    type: 'SIGN_UP',
    name: 'Yeni Abonelik',
    description: 'Kampanya kodu ile yeni abonelik',
    targetValue: 2000,
    currentValue: 850,
    unit: 'abonelik',
    weight: 3.0,
    achievementRate: 42.5,
    weightedScore: 127.5,
    status: 'AT_RISK',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    sortOrder: 3,
    createdAt: new Date('2023-12-15'),
  },

  // Campaign 6: Redbull Esports Sponsorluğu
  {
    id: 'obj-6-1',
    campaignId: 'campaign-6',
    type: 'EVENT_ATTENDANCE',
    name: 'Turnuva İzleyici',
    description: 'Canlı yayın izleyici sayısı',
    targetValue: 200000,
    currentValue: 245000,
    unit: 'izleyici',
    weight: 2.0,
    achievementRate: 122.5,
    weightedScore: 245,
    status: 'EXCEEDED',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-11-30'),
    isActive: true,
    sortOrder: 1,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'obj-6-2',
    campaignId: 'campaign-6',
    type: 'BRAND_SENTIMENT',
    name: 'Marka Algısı',
    description: 'Pozitif marka algısı oranı',
    targetValue: 80,
    currentValue: 78,
    unit: '%',
    weight: 1.5,
    achievementRate: 97.5,
    weightedScore: 146.25,
    status: 'ON_TRACK',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-11-30'),
    isActive: true,
    sortOrder: 2,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'obj-6-3',
    campaignId: 'campaign-6',
    type: 'SOCIAL_FOLLOWERS',
    name: 'Takipçi Artışı',
    description: 'Sosyal medya takipçi kazanımı',
    targetValue: 75000,
    currentValue: 82000,
    unit: 'takipçi',
    weight: 1.0,
    achievementRate: 109.33,
    weightedScore: 109.33,
    status: 'EXCEEDED',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-11-30'),
    isActive: true,
    sortOrder: 3,
    createdAt: new Date('2024-01-15'),
  },

  // Campaign 7: Nvidia GeForce Serisi (Pending)
  {
    id: 'obj-7-1',
    campaignId: 'campaign-7',
    type: 'VIDEO_VIEWS',
    name: 'Ürün İnceleme İzlenme',
    description: 'RTX serisi inceleme videoları',
    targetValue: 750000,
    currentValue: 0,
    unit: 'izlenme',
    weight: 2.0,
    achievementRate: 0,
    weightedScore: 0,
    status: 'NOT_STARTED',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-01-31'),
    isActive: true,
    sortOrder: 1,
    createdAt: new Date('2024-10-01'),
  },
  {
    id: 'obj-7-2',
    campaignId: 'campaign-7',
    type: 'ENGAGEMENT',
    name: 'Topluluk Etkileşimi',
    description: 'Yorum ve paylaşım hedefi',
    targetValue: 40000,
    currentValue: 0,
    unit: 'etkileşim',
    weight: 1.5,
    achievementRate: 0,
    weightedScore: 0,
    status: 'NOT_STARTED',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-01-31'),
    isActive: true,
    sortOrder: 2,
    createdAt: new Date('2024-10-01'),
  },
]

export const mockObjectiveProgress: MockObjectiveProgress[] = [
  // Progress for Campaign 1 - Video Views Objective
  {
    id: 'prog-1-1-1',
    objectiveId: 'obj-1-1',
    value: 125000,
    previousValue: 0,
    delta: 125000,
    achievementRate: 25,
    recordedAt: new Date('2024-06-15'),
    periodStart: new Date('2024-06-01'),
    periodEnd: new Date('2024-06-15'),
    source: 'youtube_api',
    notes: 'İlk iki hafta performansı',
  },
  {
    id: 'prog-1-1-2',
    objectiveId: 'obj-1-1',
    value: 280000,
    previousValue: 125000,
    delta: 155000,
    achievementRate: 56,
    recordedAt: new Date('2024-07-01'),
    periodStart: new Date('2024-06-16'),
    periodEnd: new Date('2024-06-30'),
    source: 'youtube_api',
    notes: 'Haziran sonu',
  },
  {
    id: 'prog-1-1-3',
    objectiveId: 'obj-1-1',
    value: 350000,
    previousValue: 280000,
    delta: 70000,
    achievementRate: 70,
    recordedAt: new Date('2024-07-15'),
    periodStart: new Date('2024-07-01'),
    periodEnd: new Date('2024-07-15'),
    source: 'youtube_api',
    notes: 'Temmuz ortası',
  },
  {
    id: 'prog-1-1-4',
    objectiveId: 'obj-1-1',
    value: 425000,
    previousValue: 350000,
    delta: 75000,
    achievementRate: 85,
    recordedAt: new Date('2024-08-01'),
    periodStart: new Date('2024-07-16'),
    periodEnd: new Date('2024-07-31'),
    source: 'youtube_api',
    notes: 'Temmuz sonu - hedefin %85i tamamlandı',
  },

  // Progress for Campaign 1 - Engagement Objective
  {
    id: 'prog-1-2-1',
    objectiveId: 'obj-1-2',
    value: 18000,
    previousValue: 0,
    delta: 18000,
    achievementRate: 36,
    recordedAt: new Date('2024-06-30'),
    periodStart: new Date('2024-06-01'),
    periodEnd: new Date('2024-06-30'),
    source: 'social_api',
    notes: 'Haziran etkileşimleri',
  },
  {
    id: 'prog-1-2-2',
    objectiveId: 'obj-1-2',
    value: 45000,
    previousValue: 18000,
    delta: 27000,
    achievementRate: 90,
    recordedAt: new Date('2024-07-31'),
    periodStart: new Date('2024-07-01'),
    periodEnd: new Date('2024-07-31'),
    source: 'social_api',
    notes: 'Temmuz - viral içerik etkisi',
  },
  {
    id: 'prog-1-2-3',
    objectiveId: 'obj-1-2',
    value: 62000,
    previousValue: 45000,
    delta: 17000,
    achievementRate: 124,
    recordedAt: new Date('2024-08-15'),
    periodStart: new Date('2024-08-01'),
    periodEnd: new Date('2024-08-15'),
    source: 'social_api',
    notes: 'Hedef aşıldı!',
  },

  // Progress for Campaign 2 - Reach Objective
  {
    id: 'prog-2-1-1',
    objectiveId: 'obj-2-1',
    value: 850000,
    previousValue: 0,
    delta: 850000,
    achievementRate: 42.5,
    recordedAt: new Date('2024-03-15'),
    periodStart: new Date('2024-03-01'),
    periodEnd: new Date('2024-03-15'),
    source: 'analytics',
    notes: 'Lansman haftası',
  },
  {
    id: 'prog-2-1-2',
    objectiveId: 'obj-2-1',
    value: 1600000,
    previousValue: 850000,
    delta: 750000,
    achievementRate: 80,
    recordedAt: new Date('2024-03-31'),
    periodStart: new Date('2024-03-16'),
    periodEnd: new Date('2024-03-31'),
    source: 'analytics',
    notes: 'Mart sonu',
  },
  {
    id: 'prog-2-1-3',
    objectiveId: 'obj-2-1',
    value: 2450000,
    previousValue: 1600000,
    delta: 850000,
    achievementRate: 122.5,
    recordedAt: new Date('2024-04-30'),
    periodStart: new Date('2024-04-01'),
    periodEnd: new Date('2024-04-30'),
    source: 'analytics',
    notes: 'Kampanya tamamlandı - hedef aşıldı',
  },

  // Progress for Campaign 4 - Sales Objective
  {
    id: 'prog-4-2-1',
    objectiveId: 'obj-4-2',
    value: 420,
    previousValue: 0,
    delta: 420,
    achievementRate: 28,
    recordedAt: new Date('2024-04-30'),
    periodStart: new Date('2024-04-01'),
    periodEnd: new Date('2024-04-30'),
    source: 'affiliate_platform',
    notes: 'Nisan satışları',
  },
  {
    id: 'prog-4-2-2',
    objectiveId: 'obj-4-2',
    value: 1050,
    previousValue: 420,
    delta: 630,
    achievementRate: 70,
    recordedAt: new Date('2024-05-31'),
    periodStart: new Date('2024-05-01'),
    periodEnd: new Date('2024-05-31'),
    source: 'affiliate_platform',
    notes: 'Mayıs - indirim kampanyası etkisi',
  },
  {
    id: 'prog-4-2-3',
    objectiveId: 'obj-4-2',
    value: 1680,
    previousValue: 1050,
    delta: 630,
    achievementRate: 112,
    recordedAt: new Date('2024-06-30'),
    periodStart: new Date('2024-06-01'),
    periodEnd: new Date('2024-06-30'),
    source: 'affiliate_platform',
    notes: 'Haziran - hedef aşıldı',
  },

  // Progress for Campaign 5 - App Download (Behind schedule)
  {
    id: 'prog-5-2-1',
    objectiveId: 'obj-5-2',
    value: 1200,
    previousValue: 0,
    delta: 1200,
    achievementRate: 12,
    recordedAt: new Date('2024-03-31'),
    periodStart: new Date('2024-01-01'),
    periodEnd: new Date('2024-03-31'),
    source: 'app_store',
    notes: 'Q1 performansı - beklentinin altında',
  },
  {
    id: 'prog-5-2-2',
    objectiveId: 'obj-5-2',
    value: 2800,
    previousValue: 1200,
    delta: 1600,
    achievementRate: 28,
    recordedAt: new Date('2024-06-30'),
    periodStart: new Date('2024-04-01'),
    periodEnd: new Date('2024-06-30'),
    source: 'app_store',
    notes: 'Q2 - iyileşme var ama yetersiz',
  },
  {
    id: 'prog-5-2-3',
    objectiveId: 'obj-5-2',
    value: 5500,
    previousValue: 2800,
    delta: 2700,
    achievementRate: 55,
    recordedAt: new Date('2024-09-30'),
    periodStart: new Date('2024-07-01'),
    periodEnd: new Date('2024-09-30'),
    source: 'app_store',
    notes: 'Q3 - kampanya stratejisi değişikliği etkili oldu',
  },

  // Progress for Campaign 6 - Event Attendance
  {
    id: 'prog-6-1-1',
    objectiveId: 'obj-6-1',
    value: 45000,
    previousValue: 0,
    delta: 45000,
    achievementRate: 22.5,
    recordedAt: new Date('2024-03-31'),
    periodStart: new Date('2024-02-01'),
    periodEnd: new Date('2024-03-31'),
    source: 'twitch_api',
    notes: 'İlk turnuva serisi',
  },
  {
    id: 'prog-6-1-2',
    objectiveId: 'obj-6-1',
    value: 120000,
    previousValue: 45000,
    delta: 75000,
    achievementRate: 60,
    recordedAt: new Date('2024-06-30'),
    periodStart: new Date('2024-04-01'),
    periodEnd: new Date('2024-06-30'),
    source: 'twitch_api',
    notes: 'Yaz turnuvaları',
  },
  {
    id: 'prog-6-1-3',
    objectiveId: 'obj-6-1',
    value: 245000,
    previousValue: 120000,
    delta: 125000,
    achievementRate: 122.5,
    recordedAt: new Date('2024-09-30'),
    periodStart: new Date('2024-07-01'),
    periodEnd: new Date('2024-09-30'),
    source: 'twitch_api',
    notes: 'Büyük final etkinliği - hedef aşıldı',
  },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getMockSponsorsByOrg(organizationId: string): MockSponsor[] {
  return mockSponsors.filter(s => s.organizationId === organizationId)
}

export function getMockCampaignsByOrg(organizationId: string): MockCampaign[] {
  return mockCampaigns.filter(c => c.organizationId === organizationId)
}

export function getMockTransactionsByOrg(organizationId: string): MockTransaction[] {
  return mockTransactions.filter(t => t.organizationId === organizationId)
}

export function getMockTransactionsBySponsor(sponsorId: string): MockTransaction[] {
  return mockTransactions.filter(t => t.sponsorId === sponsorId)
}

export function getMockTransactionsByCampaign(campaignId: string): MockTransaction[] {
  return mockTransactions.filter(t => t.campaignId === campaignId)
}

export function getMockMetricsByCampaign(campaignId: string): MockMetric[] {
  return mockMetrics.filter(m => m.campaignId === campaignId)
}

export function getMockRFMBySponsor(sponsorId: string): MockRFMScore | undefined {
  return mockRFMScores.find(r => r.sponsorId === sponsorId)
}

// ROO Helper Functions
export function getMockObjectivesByCampaign(campaignId: string): MockCampaignObjective[] {
  return mockCampaignObjectives.filter(o => o.campaignId === campaignId)
}

export function getMockProgressByObjective(objectiveId: string): MockObjectiveProgress[] {
  return mockObjectiveProgress.filter(p => p.objectiveId === objectiveId)
}

export function getMockObjectiveWithProgress(objectiveId: string): MockCampaignObjective & { progress: MockObjectiveProgress[] } | undefined {
  const objective = mockCampaignObjectives.find(o => o.id === objectiveId)
  if (!objective) return undefined
  return {
    ...objective,
    progress: getMockProgressByObjective(objectiveId)
  }
}

/**
 * Calculate ROO Score for a campaign
 * Formula: ROO Score = Σ((Actual/Target) × Weight) / Σ(Weight) × 100
 * Returns weighted average of all objective achievement rates
 */
export function calculateMockROOScore(campaignId: string): {
  score: number
  totalWeight: number
  objectiveCount: number
  completedCount: number
  exceededCount: number
  atRiskCount: number
  objectives: Array<{
    id: string
    name: string
    type: MockObjectiveType
    achievementRate: number
    weight: number
    weightedContribution: number
    status: MockObjectiveStatus
  }>
} {
  const objectives = getMockObjectivesByCampaign(campaignId).filter(o => o.isActive)
  
  if (objectives.length === 0) {
    return {
      score: 0,
      totalWeight: 0,
      objectiveCount: 0,
      completedCount: 0,
      exceededCount: 0,
      atRiskCount: 0,
      objectives: []
    }
  }

  let totalWeightedScore = 0
  let totalWeight = 0
  let completedCount = 0
  let exceededCount = 0
  let atRiskCount = 0

  const objectiveDetails = objectives.map(obj => {
    const achievementRate = obj.targetValue > 0 
      ? (obj.currentValue / obj.targetValue) * 100 
      : 0
    const weightedContribution = achievementRate * obj.weight
    
    totalWeightedScore += weightedContribution
    totalWeight += obj.weight

    if (obj.status === 'COMPLETED') completedCount++
    if (obj.status === 'EXCEEDED') exceededCount++
    if (obj.status === 'AT_RISK' || obj.status === 'BEHIND') atRiskCount++

    return {
      id: obj.id,
      name: obj.name,
      type: obj.type,
      achievementRate,
      weight: obj.weight,
      weightedContribution,
      status: obj.status
    }
  })

  // ROO Score = (Total Weighted Score / Total Weight)
  const score = totalWeight > 0 ? totalWeightedScore / totalWeight : 0

  return {
    score: Math.round(score * 100) / 100,
    totalWeight,
    objectiveCount: objectives.length,
    completedCount,
    exceededCount,
    atRiskCount,
    objectives: objectiveDetails
  }
}

/**
 * Get all campaigns with their ROO scores
 */
export function getAllCampaignsWithROO(): Array<{
  campaign: MockCampaign
  rooScore: number
  objectiveCount: number
  completedCount: number
  status: 'excellent' | 'good' | 'average' | 'at_risk' | 'poor' | 'no_objectives'
}> {
  return mockCampaigns.map(campaign => {
    const roo = calculateMockROOScore(campaign.id)
    
    let status: 'excellent' | 'good' | 'average' | 'at_risk' | 'poor' | 'no_objectives'
    if (roo.objectiveCount === 0) {
      status = 'no_objectives'
    } else if (roo.score >= 100) {
      status = 'excellent'
    } else if (roo.score >= 80) {
      status = 'good'
    } else if (roo.score >= 60) {
      status = 'average'
    } else if (roo.score >= 40) {
      status = 'at_risk'
    } else {
      status = 'poor'
    }

    return {
      campaign,
      rooScore: roo.score,
      objectiveCount: roo.objectiveCount,
      completedCount: roo.completedCount + roo.exceededCount,
      status
    }
  })
}

/**
 * Get ROO statistics for dashboard
 */
export function getMockROODashboardStats(): {
  avgROOScore: number
  campaignsWithObjectives: number
  totalObjectives: number
  completedObjectives: number
  exceededObjectives: number
  atRiskObjectives: number
  objectivesByType: Array<{ type: MockObjectiveType; count: number; avgAchievement: number }>
  objectivesByStatus: Array<{ status: MockObjectiveStatus; count: number }>
  topPerformingCampaigns: Array<{ campaignId: string; campaignName: string; rooScore: number }>
  atRiskCampaigns: Array<{ campaignId: string; campaignName: string; rooScore: number; atRiskCount: number }>
} {
  const campaignsWithROO = getAllCampaignsWithROO().filter(c => c.objectiveCount > 0)
  
  const avgROOScore = campaignsWithROO.length > 0
    ? campaignsWithROO.reduce((sum, c) => sum + c.rooScore, 0) / campaignsWithROO.length
    : 0

  const allObjectives = mockCampaignObjectives.filter(o => o.isActive)
  
  // Group by type
  const typeGroups = allObjectives.reduce((acc, obj) => {
    if (!acc[obj.type]) {
      acc[obj.type] = { count: 0, totalAchievement: 0 }
    }
    acc[obj.type].count++
    acc[obj.type].totalAchievement += obj.achievementRate || 0
    return acc
  }, {} as Record<MockObjectiveType, { count: number; totalAchievement: number }>)

  const objectivesByType = Object.entries(typeGroups).map(([type, data]) => ({
    type: type as MockObjectiveType,
    count: data.count,
    avgAchievement: Math.round(data.totalAchievement / data.count)
  }))

  // Group by status
  const statusGroups = allObjectives.reduce((acc, obj) => {
    acc[obj.status] = (acc[obj.status] || 0) + 1
    return acc
  }, {} as Record<MockObjectiveStatus, number>)

  const objectivesByStatus = Object.entries(statusGroups).map(([status, count]) => ({
    status: status as MockObjectiveStatus,
    count
  }))

  // Top performing campaigns
  const topPerformingCampaigns = campaignsWithROO
    .sort((a, b) => b.rooScore - a.rooScore)
    .slice(0, 5)
    .map(c => ({
      campaignId: c.campaign.id,
      campaignName: c.campaign.name,
      rooScore: c.rooScore
    }))

  // At risk campaigns
  const atRiskCampaigns = mockCampaigns
    .map(campaign => {
      const roo = calculateMockROOScore(campaign.id)
      return {
        campaignId: campaign.id,
        campaignName: campaign.name,
        rooScore: roo.score,
        atRiskCount: roo.atRiskCount
      }
    })
    .filter(c => c.atRiskCount > 0)
    .sort((a, b) => b.atRiskCount - a.atRiskCount)

  return {
    avgROOScore: Math.round(avgROOScore * 100) / 100,
    campaignsWithObjectives: campaignsWithROO.length,
    totalObjectives: allObjectives.length,
    completedObjectives: allObjectives.filter(o => o.status === 'COMPLETED').length,
    exceededObjectives: allObjectives.filter(o => o.status === 'EXCEEDED').length,
    atRiskObjectives: allObjectives.filter(o => o.status === 'AT_RISK' || o.status === 'BEHIND').length,
    objectivesByType,
    objectivesByStatus,
    topPerformingCampaigns,
    atRiskCampaigns
  }
}
