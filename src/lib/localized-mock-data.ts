/**
 * Localized Mock Data - DevRetain CRM
 * 
 * Çok dilli dummy veri seti. Tüm içerikler TR ve EN dillerinde.
 */

import { type Locale } from "@/i18n/config"

// ============================================================================
// LOCALIZED CONTENT TYPES
// ============================================================================

export interface LocalizedContent {
  tr: string
  en: string
}

export interface LocalizedCampaign {
  id: string
  name: LocalizedContent
  description: LocalizedContent
  type: string
  status: string
  budgetTotal: number
  budgetSpent: number
  startDate: Date
  endDate: Date
  roi: number
  rooScore: number
  impressions: number
  clicks: number
  conversions: number
}

export interface LocalizedSponsor {
  id: string
  companyName: string
  industry: LocalizedContent
  description: LocalizedContent
  tier: string
  totalValue: number
  avgROI: number
  isActive: boolean
}

export interface LocalizedObjective {
  id: string
  campaignId: string
  name: LocalizedContent
  description: LocalizedContent
  type: string
  targetValue: number
  currentValue: number
  unit: LocalizedContent
  weight: number
  status: string
}

export interface LocalizedNotification {
  id: string
  title: LocalizedContent
  message: LocalizedContent
  type: 'info' | 'success' | 'warning' | 'error'
  createdAt: Date
  isRead: boolean
}

// ============================================================================
// HELPER FUNCTION
// ============================================================================

export function getLocalizedText(content: LocalizedContent, locale: Locale): string {
  return content[locale] || content.tr
}

// ============================================================================
// LOCALIZED CAMPAIGNS
// ============================================================================

export const localizedCampaigns: LocalizedCampaign[] = [
  {
    id: 'campaign-1',
    name: {
      tr: 'Monster Energy - Yaz Festivali',
      en: 'Monster Energy - Summer Festival'
    },
    description: {
      tr: 'Yaz festivali kapsamında Monster Energy ile yapılan marka bilinirliği kampanyası. Hedef kitle 18-34 yaş arası gençler.',
      en: 'Brand awareness campaign with Monster Energy as part of the summer festival. Target audience is young people aged 18-34.'
    },
    type: 'BRAND_AWARENESS',
    status: 'ACTIVE',
    budgetTotal: 250000,
    budgetSpent: 187500,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    roi: 145,
    rooScore: 82,
    impressions: 2500000,
    clicks: 125000,
    conversions: 3750
  },
  {
    id: 'campaign-2',
    name: {
      tr: 'Logitech G Pro X - Ürün Lansmanı',
      en: 'Logitech G Pro X - Product Launch'
    },
    description: {
      tr: 'Logitech G Pro X kulaklık serisinin Türkiye lansmanı. Gaming topluluğuna özel içerikler ve giveaway kampanyaları.',
      en: 'Turkey launch of Logitech G Pro X headset series. Special content and giveaway campaigns for the gaming community.'
    },
    type: 'PRODUCT_LAUNCH',
    status: 'COMPLETED',
    budgetTotal: 180000,
    budgetSpent: 175000,
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-05-15'),
    roi: 210,
    rooScore: 95,
    impressions: 1800000,
    clicks: 90000,
    conversions: 5400
  },
  {
    id: 'campaign-3',
    name: {
      tr: 'Getir - Süper Lig Sponsorluğu',
      en: 'Getir - Super League Sponsorship'
    },
    description: {
      tr: 'Süper Lig maçları sırasında Getir uygulaması promosyonu. Maç günü özel indirim kodları ve canlı yayın entegrasyonu.',
      en: 'Getir app promotion during Super League matches. Match day special discount codes and live stream integration.'
    },
    type: 'EVENT_SPONSORSHIP',
    status: 'ACTIVE',
    budgetTotal: 320000,
    budgetSpent: 240000,
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-12-31'),
    roi: 88,
    rooScore: 72,
    impressions: 4500000,
    clicks: 180000,
    conversions: 9000
  },
  {
    id: 'campaign-4',
    name: {
      tr: 'Samsung Galaxy S24 - Influencer Kampanyası',
      en: 'Samsung Galaxy S24 - Influencer Campaign'
    },
    description: {
      tr: 'Samsung Galaxy S24 serisi için teknoloji influencer\'ları ile yapılan içerik ortaklığı. Unboxing, inceleme ve karşılaştırma videoları.',
      en: 'Content partnership with tech influencers for Samsung Galaxy S24 series. Unboxing, review and comparison videos.'
    },
    type: 'INFLUENCER',
    status: 'COMPLETED',
    budgetTotal: 450000,
    budgetSpent: 448000,
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-03-20'),
    roi: 175,
    rooScore: 88,
    impressions: 6200000,
    clicks: 310000,
    conversions: 15500
  },
  {
    id: 'campaign-5',
    name: {
      tr: 'Turkcell - Esports Takım Sponsorluğu',
      en: 'Turkcell - Esports Team Sponsorship'
    },
    description: {
      tr: 'Turkcell ile Anadolu Esports takımı arasındaki yıllık sponsorluk anlaşması. Forma sponsorluğu, sosyal medya içerikleri ve etkinlik katılımları.',
      en: 'Annual sponsorship agreement between Turkcell and Anadolu Esports team. Jersey sponsorship, social media content and event participation.'
    },
    type: 'CONTENT_SPONSORSHIP',
    status: 'ACTIVE',
    budgetTotal: 1200000,
    budgetSpent: 800000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    roi: 125,
    rooScore: 91,
    impressions: 15000000,
    clicks: 600000,
    conversions: 24000
  },
  {
    id: 'campaign-6',
    name: {
      tr: 'Migros - Affiliate Programı',
      en: 'Migros - Affiliate Program'
    },
    description: {
      tr: 'Migros Sanal Market için affiliate pazarlama kampanyası. İçerik üreticilerine özel referans kodları ve komisyon sistemi.',
      en: 'Affiliate marketing campaign for Migros Online Market. Special referral codes and commission system for content creators.'
    },
    type: 'AFFILIATE',
    status: 'PAUSED',
    budgetTotal: 75000,
    budgetSpent: 45000,
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-10-01'),
    roi: 65,
    rooScore: 58,
    impressions: 850000,
    clicks: 42500,
    conversions: 2125
  }
]

// ============================================================================
// LOCALIZED SPONSORS
// ============================================================================

export const localizedSponsors: LocalizedSponsor[] = [
  {
    id: 'sponsor-1',
    companyName: 'Monster Energy Türkiye',
    industry: {
      tr: 'İçecek',
      en: 'Beverage'
    },
    description: {
      tr: 'Enerji içeceği sektörünün lider markası. Gençlik ve spor odaklı pazarlama stratejisi.',
      en: 'Leading brand in the energy drink sector. Youth and sports-focused marketing strategy.'
    },
    tier: 'PLATINUM',
    totalValue: 450000,
    avgROI: 145,
    isActive: true
  },
  {
    id: 'sponsor-2',
    companyName: 'Logitech Türkiye',
    industry: {
      tr: 'Teknoloji / Gaming',
      en: 'Technology / Gaming'
    },
    description: {
      tr: 'Gaming ve profesyonel ekipman üreticisi. Esports sponsorluklarında aktif.',
      en: 'Gaming and professional equipment manufacturer. Active in esports sponsorships.'
    },
    tier: 'GOLD',
    totalValue: 280000,
    avgROI: 210,
    isActive: true
  },
  {
    id: 'sponsor-3',
    companyName: 'Getir',
    industry: {
      tr: 'E-ticaret / Teknoloji',
      en: 'E-commerce / Technology'
    },
    description: {
      tr: 'Hızlı teslimat uygulaması. Dijital pazarlama ve influencer iş birlikleri.',
      en: 'Quick delivery app. Digital marketing and influencer collaborations.'
    },
    tier: 'SILVER',
    totalValue: 320000,
    avgROI: 88,
    isActive: true
  },
  {
    id: 'sponsor-4',
    companyName: 'Turkcell',
    industry: {
      tr: 'Telekomünikasyon',
      en: 'Telecommunications'
    },
    description: {
      tr: 'Türkiye\'nin lider telekomünikasyon şirketi. Esports ve gaming alanında büyük yatırımlar.',
      en: 'Turkey\'s leading telecommunications company. Major investments in esports and gaming.'
    },
    tier: 'DIAMOND',
    totalValue: 1200000,
    avgROI: 125,
    isActive: true
  },
  {
    id: 'sponsor-5',
    companyName: 'Samsung Türkiye',
    industry: {
      tr: 'Teknoloji / Elektronik',
      en: 'Technology / Electronics'
    },
    description: {
      tr: 'Global elektronik devi. Mobil cihaz ve TV segmentinde lider.',
      en: 'Global electronics giant. Leader in mobile devices and TV segment.'
    },
    tier: 'GOLD',
    totalValue: 450000,
    avgROI: 175,
    isActive: true
  }
]

// ============================================================================
// LOCALIZED OBJECTIVES
// ============================================================================

export const localizedObjectives: LocalizedObjective[] = [
  {
    id: 'obj-1',
    campaignId: 'campaign-1',
    name: {
      tr: 'Marka Bilinirliği Artışı',
      en: 'Brand Awareness Increase'
    },
    description: {
      tr: 'Hedef kitlede Monster Energy marka bilinirliğini %25 artırmak.',
      en: 'Increase Monster Energy brand awareness by 25% in the target audience.'
    },
    type: 'AWARENESS',
    targetValue: 25,
    currentValue: 28,
    unit: { tr: '%', en: '%' },
    weight: 0.35,
    status: 'EXCEEDED'
  },
  {
    id: 'obj-2',
    campaignId: 'campaign-1',
    name: {
      tr: 'Sosyal Medya Takipçi Kazanımı',
      en: 'Social Media Follower Growth'
    },
    description: {
      tr: 'Instagram ve YouTube kanallarında 50.000 yeni takipçi kazanmak.',
      en: 'Gain 50,000 new followers on Instagram and YouTube channels.'
    },
    type: 'SOCIAL_FOLLOWERS',
    targetValue: 50000,
    currentValue: 42000,
    unit: { tr: 'takipçi', en: 'followers' },
    weight: 0.25,
    status: 'ON_TRACK'
  },
  {
    id: 'obj-3',
    campaignId: 'campaign-2',
    name: {
      tr: 'Ürün Satış Hedefi',
      en: 'Product Sales Target'
    },
    description: {
      tr: 'Kampanya süresince 5.000 adet G Pro X kulaklık satışı.',
      en: 'Sell 5,000 G Pro X headsets during the campaign period.'
    },
    type: 'SALES',
    targetValue: 5000,
    currentValue: 5400,
    unit: { tr: 'adet', en: 'units' },
    weight: 0.45,
    status: 'EXCEEDED'
  },
  {
    id: 'obj-4',
    campaignId: 'campaign-2',
    name: {
      tr: 'Video İzlenme Hedefi',
      en: 'Video Views Target'
    },
    description: {
      tr: 'Ürün tanıtım videolarında toplam 500.000 izlenme.',
      en: 'Total 500,000 views on product introduction videos.'
    },
    type: 'VIDEO_VIEWS',
    targetValue: 500000,
    currentValue: 620000,
    unit: { tr: 'izlenme', en: 'views' },
    weight: 0.30,
    status: 'EXCEEDED'
  },
  {
    id: 'obj-5',
    campaignId: 'campaign-5',
    name: {
      tr: 'Topluluk Etkileşimi',
      en: 'Community Engagement'
    },
    description: {
      tr: 'Esports etkinliklerinde ortalama %15 etkileşim oranı.',
      en: 'Average 15% engagement rate in esports events.'
    },
    type: 'ENGAGEMENT',
    targetValue: 15,
    currentValue: 18.5,
    unit: { tr: '%', en: '%' },
    weight: 0.35,
    status: 'EXCEEDED'
  }
]

// ============================================================================
// LOCALIZED NOTIFICATIONS
// ============================================================================

export const localizedNotifications: LocalizedNotification[] = [
  {
    id: 'notif-1',
    title: {
      tr: 'Yeni Sponsor Teklifi',
      en: 'New Sponsor Offer'
    },
    message: {
      tr: 'Samsung Türkiye yeni bir sponsorluk teklifi gönderdi. Detayları incelemek için tıklayın.',
      en: 'Samsung Turkey sent a new sponsorship offer. Click to review the details.'
    },
    type: 'info',
    createdAt: new Date('2024-10-15T10:30:00'),
    isRead: false
  },
  {
    id: 'notif-2',
    title: {
      tr: 'Kampanya Hedefi Aşıldı! 🎉',
      en: 'Campaign Goal Exceeded! 🎉'
    },
    message: {
      tr: 'Logitech G Pro X kampanyası satış hedefini %108 oranında aştı. Tebrikler!',
      en: 'Logitech G Pro X campaign exceeded sales target by 108%. Congratulations!'
    },
    type: 'success',
    createdAt: new Date('2024-10-14T15:45:00'),
    isRead: false
  },
  {
    id: 'notif-3',
    title: {
      tr: 'ROI Uyarısı',
      en: 'ROI Alert'
    },
    message: {
      tr: 'Migros Affiliate kampanyasının ROI\'si beklentinin altında. Strateji revizyonu önerilir.',
      en: 'Migros Affiliate campaign ROI is below expectations. Strategy revision recommended.'
    },
    type: 'warning',
    createdAt: new Date('2024-10-13T09:00:00'),
    isRead: true
  },
  {
    id: 'notif-4',
    title: {
      tr: 'Ödeme Alındı',
      en: 'Payment Received'
    },
    message: {
      tr: 'Turkcell sponsorluk ödemesi hesabınıza aktarıldı: ₺400.000',
      en: 'Turkcell sponsorship payment transferred to your account: ₺400,000'
    },
    type: 'success',
    createdAt: new Date('2024-10-12T14:20:00'),
    isRead: true
  },
  {
    id: 'notif-5',
    title: {
      tr: 'Yeni Eşleşme Bulundu',
      en: 'New Match Found'
    },
    message: {
      tr: 'Profilinizle %92 uyumlu yeni bir sponsor bulundu: Red Bull Türkiye',
      en: 'A new sponsor with 92% match to your profile found: Red Bull Turkey'
    },
    type: 'info',
    createdAt: new Date('2024-10-11T11:15:00'),
    isRead: false
  }
]

// ============================================================================
// LOCALIZED STATUS LABELS
// ============================================================================

export const campaignStatusLabels: Record<string, LocalizedContent> = {
  DRAFT: { tr: 'Taslak', en: 'Draft' },
  PENDING_APPROVAL: { tr: 'Onay Bekliyor', en: 'Pending Approval' },
  ACTIVE: { tr: 'Aktif', en: 'Active' },
  PAUSED: { tr: 'Duraklatıldı', en: 'Paused' },
  COMPLETED: { tr: 'Tamamlandı', en: 'Completed' },
  CANCELLED: { tr: 'İptal Edildi', en: 'Cancelled' },
}

export const campaignTypeLabels: Record<string, LocalizedContent> = {
  BRAND_AWARENESS: { tr: 'Marka Bilinirliği', en: 'Brand Awareness' },
  PRODUCT_LAUNCH: { tr: 'Ürün Lansmanı', en: 'Product Launch' },
  EVENT_SPONSORSHIP: { tr: 'Etkinlik Sponsorluğu', en: 'Event Sponsorship' },
  CONTENT_SPONSORSHIP: { tr: 'İçerik Sponsorluğu', en: 'Content Sponsorship' },
  AFFILIATE: { tr: 'Affiliate', en: 'Affiliate' },
  INFLUENCER: { tr: 'Influencer', en: 'Influencer' },
}

export const tierLabels: Record<string, LocalizedContent> = {
  BRONZE: { tr: 'Bronz', en: 'Bronze' },
  SILVER: { tr: 'Gümüş', en: 'Silver' },
  GOLD: { tr: 'Altın', en: 'Gold' },
  PLATINUM: { tr: 'Platin', en: 'Platinum' },
  DIAMOND: { tr: 'Elmas', en: 'Diamond' },
}

export const objectiveStatusLabels: Record<string, LocalizedContent> = {
  NOT_STARTED: { tr: 'Başlamadı', en: 'Not Started' },
  IN_PROGRESS: { tr: 'Devam Ediyor', en: 'In Progress' },
  ON_TRACK: { tr: 'Yolunda', en: 'On Track' },
  AT_RISK: { tr: 'Risk Altında', en: 'At Risk' },
  BEHIND: { tr: 'Geride', en: 'Behind' },
  COMPLETED: { tr: 'Tamamlandı', en: 'Completed' },
  EXCEEDED: { tr: 'Aşıldı', en: 'Exceeded' },
}

export const objectiveTypeLabels: Record<string, LocalizedContent> = {
  AWARENESS: { tr: 'Marka Bilinirliği', en: 'Brand Awareness' },
  REACH: { tr: 'Erişim', en: 'Reach' },
  ENGAGEMENT: { tr: 'Etkileşim', en: 'Engagement' },
  VIDEO_VIEWS: { tr: 'Video İzlenme', en: 'Video Views' },
  WEBSITE_TRAFFIC: { tr: 'Web Sitesi Trafiği', en: 'Website Traffic' },
  LEAD_GENERATION: { tr: 'Potansiyel Müşteri', en: 'Lead Generation' },
  APP_DOWNLOAD: { tr: 'Uygulama İndirme', en: 'App Downloads' },
  SALES: { tr: 'Satış', en: 'Sales' },
  SIGN_UP: { tr: 'Kayıt', en: 'Sign Ups' },
  BRAND_SENTIMENT: { tr: 'Marka Algısı', en: 'Brand Sentiment' },
  SOCIAL_FOLLOWERS: { tr: 'Sosyal Medya Takipçisi', en: 'Social Media Followers' },
  EMAIL_SUBSCRIBERS: { tr: 'E-posta Abonesi', en: 'Email Subscribers' },
  CONTENT_CREATION: { tr: 'İçerik Üretimi', en: 'Content Creation' },
  EVENT_ATTENDANCE: { tr: 'Etkinlik Katılımı', en: 'Event Attendance' },
  CUSTOM: { tr: 'Özel Hedef', en: 'Custom Goal' },
}

// ============================================================================
// LOCALIZED DASHBOARD STATS
// ============================================================================

export const dashboardStatLabels: Record<string, LocalizedContent> = {
  totalRevenue: { tr: 'Toplam Gelir', en: 'Total Revenue' },
  totalExpenses: { tr: 'Toplam Gider', en: 'Total Expenses' },
  netIncome: { tr: 'Net Gelir', en: 'Net Income' },
  activeSponsors: { tr: 'Aktif Sponsor', en: 'Active Sponsors' },
  activeCampaigns: { tr: 'Aktif Kampanya', en: 'Active Campaigns' },
  averageROI: { tr: 'Ortalama ROI', en: 'Average ROI' },
  averageROO: { tr: 'Ortalama ROO', en: 'Average ROO' },
  monthlyGrowth: { tr: 'Aylık Büyüme', en: 'Monthly Growth' },
}

// ============================================================================
// LOCALIZED MENU ITEMS
// ============================================================================

export const menuLabels: Record<string, LocalizedContent> = {
  dashboard: { tr: 'Dashboard', en: 'Dashboard' },
  campaigns: { tr: 'Kampanyalar', en: 'Campaigns' },
  sponsors: { tr: 'Sponsorlar', en: 'Sponsors' },
  reports: { tr: 'Raporlar', en: 'Reports' },
  analytics: { tr: 'Analitik', en: 'Analytics' },
  settings: { tr: 'Ayarlar', en: 'Settings' },
  discover: { tr: 'Keşfet', en: 'Discover' },
  matches: { tr: 'Eşleşmeler', en: 'Matches' },
  marketplace: { tr: 'Pazaryeri', en: 'Marketplace' },
  mediaKit: { tr: 'Media Kit', en: 'Media Kit' },
  portfolio: { tr: 'Portföyüm', en: 'My Portfolio' },
  admin: { tr: 'Admin Panel', en: 'Admin Panel' },
  help: { tr: 'Yardım', en: 'Help' },
  signOut: { tr: 'Çıkış Yap', en: 'Sign Out' },
}

// ============================================================================
// LOCALIZED DISCOVER PAGE DATA
// ============================================================================

export interface LocalizedCreator {
  id: string
  name: string
  handle: string
  avatar: string | null
  category: LocalizedContent
  bio: LocalizedContent
  followers: number
  avgROI: number
  avgROO: number
  trustScore: number
  completedCampaigns: number
  engagementRate: number
  isVerified: boolean
  tags: LocalizedContent[]
}

export const localizedCreators: LocalizedCreator[] = [
  {
    id: 'creator-1',
    name: 'TechTurk',
    handle: '@techturk',
    avatar: null,
    category: { tr: 'Teknoloji', en: 'Technology' },
    bio: {
      tr: 'Türkiye\'nin en büyük teknoloji YouTube kanalı. Güncel teknoloji haberleri, incelemeler ve karşılaştırmalar.',
      en: 'Turkey\'s largest technology YouTube channel. Latest tech news, reviews and comparisons.'
    },
    followers: 1250000,
    avgROI: 185,
    avgROO: 78,
    trustScore: 95,
    completedCampaigns: 48,
    engagementRate: 8.5,
    isVerified: true,
    tags: [
      { tr: 'Teknoloji', en: 'Technology' },
      { tr: 'İnceleme', en: 'Review' },
      { tr: 'Gaming', en: 'Gaming' }
    ]
  },
  {
    id: 'creator-2',
    name: 'GamersHub TR',
    handle: '@gamershubtr',
    avatar: null,
    category: { tr: 'Gaming', en: 'Gaming' },
    bio: {
      tr: 'Profesyonel oyun içerikleri, canlı yayınlar ve esports haberleri.',
      en: 'Professional gaming content, live streams and esports news.'
    },
    followers: 850000,
    avgROI: 142,
    avgROO: 92,
    trustScore: 88,
    completedCampaigns: 35,
    engagementRate: 12.3,
    isVerified: true,
    tags: [
      { tr: 'Gaming', en: 'Gaming' },
      { tr: 'Esports', en: 'Esports' },
      { tr: 'Canlı Yayın', en: 'Live Stream' }
    ]
  },
  {
    id: 'creator-3',
    name: 'Lifestyle Diaries',
    handle: '@lifestylediaries',
    avatar: null,
    category: { tr: 'Yaşam Tarzı', en: 'Lifestyle' },
    bio: {
      tr: 'Moda, güzellik ve yaşam tarzı içerikleri. Günlük vloglar ve ürün incelemeleri.',
      en: 'Fashion, beauty and lifestyle content. Daily vlogs and product reviews.'
    },
    followers: 620000,
    avgROI: 95,
    avgROO: 85,
    trustScore: 82,
    completedCampaigns: 28,
    engagementRate: 6.8,
    isVerified: false,
    tags: [
      { tr: 'Yaşam Tarzı', en: 'Lifestyle' },
      { tr: 'Moda', en: 'Fashion' },
      { tr: 'Güzellik', en: 'Beauty' }
    ]
  }
]

// ============================================================================
// LOCALIZED DISCOVERABLE SPONSORS (for creators)
// ============================================================================

export interface LocalizedDiscoverableSponsor {
  id: string
  companyName: string
  logo: string | null
  industry: LocalizedContent
  description: LocalizedContent
  totalSponsored: number
  avgBudget: number
  paymentSpeed: number
  collaborationScore: number
  preferredCategories: LocalizedContent[]
  isVerified: boolean
}

export const localizedDiscoverableSponsors: LocalizedDiscoverableSponsor[] = [
  {
    id: 'disc-sponsor-1',
    companyName: 'Red Bull Türkiye',
    logo: null,
    industry: { tr: 'İçecek / Enerji', en: 'Beverage / Energy' },
    description: {
      tr: 'Ekstrem sporlar ve esports odaklı sponsorluklar. Uzun vadeli iş birlikleri tercih edilir.',
      en: 'Extreme sports and esports focused sponsorships. Long-term partnerships preferred.'
    },
    totalSponsored: 2500000,
    avgBudget: 150000,
    paymentSpeed: 95,
    collaborationScore: 92,
    preferredCategories: [
      { tr: 'Spor', en: 'Sports' },
      { tr: 'Gaming', en: 'Gaming' },
      { tr: 'Müzik', en: 'Music' }
    ],
    isVerified: true
  },
  {
    id: 'disc-sponsor-2',
    companyName: 'Netflix Türkiye',
    logo: null,
    industry: { tr: 'Eğlence / Streaming', en: 'Entertainment / Streaming' },
    description: {
      tr: 'Dizi ve film tanıtımları için içerik üreticileri ile iş birliği. Yaratıcı içeriklere açık.',
      en: 'Collaboration with content creators for series and movie promotions. Open to creative content.'
    },
    totalSponsored: 1800000,
    avgBudget: 80000,
    paymentSpeed: 88,
    collaborationScore: 85,
    preferredCategories: [
      { tr: 'Eğlence', en: 'Entertainment' },
      { tr: 'Yaşam Tarzı', en: 'Lifestyle' },
      { tr: 'Komedi', en: 'Comedy' }
    ],
    isVerified: true
  }
]

// ============================================================================
// HELPER FUNCTIONS FOR LOCALIZED DATA
// ============================================================================

export function getLocalizedCampaigns(locale: Locale) {
  return localizedCampaigns.map(campaign => ({
    ...campaign,
    name: getLocalizedText(campaign.name, locale),
    description: getLocalizedText(campaign.description, locale),
    statusLabel: getLocalizedText(campaignStatusLabels[campaign.status], locale),
    typeLabel: getLocalizedText(campaignTypeLabels[campaign.type], locale),
  }))
}

export function getLocalizedSponsors(locale: Locale) {
  return localizedSponsors.map(sponsor => ({
    ...sponsor,
    industry: getLocalizedText(sponsor.industry, locale),
    description: getLocalizedText(sponsor.description, locale),
    tierLabel: getLocalizedText(tierLabels[sponsor.tier], locale),
  }))
}

export function getLocalizedObjectives(locale: Locale) {
  return localizedObjectives.map(obj => ({
    ...obj,
    name: getLocalizedText(obj.name, locale),
    description: getLocalizedText(obj.description, locale),
    unit: getLocalizedText(obj.unit, locale),
    statusLabel: getLocalizedText(objectiveStatusLabels[obj.status], locale),
    typeLabel: getLocalizedText(objectiveTypeLabels[obj.type], locale),
  }))
}

export function getLocalizedNotifications(locale: Locale) {
  return localizedNotifications.map(notif => ({
    ...notif,
    title: getLocalizedText(notif.title, locale),
    message: getLocalizedText(notif.message, locale),
  }))
}

export function getLocalizedCreators(locale: Locale) {
  return localizedCreators.map(creator => ({
    ...creator,
    category: getLocalizedText(creator.category, locale),
    bio: getLocalizedText(creator.bio, locale),
    tags: creator.tags.map(tag => getLocalizedText(tag, locale)),
  }))
}

export function getLocalizedDiscoverableSponsors(locale: Locale) {
  return localizedDiscoverableSponsors.map(sponsor => ({
    ...sponsor,
    industry: getLocalizedText(sponsor.industry, locale),
    description: getLocalizedText(sponsor.description, locale),
    preferredCategories: sponsor.preferredCategories.map(cat => getLocalizedText(cat, locale)),
  }))
}
