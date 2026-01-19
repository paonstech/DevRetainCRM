import type {
  User,
  Organization,
  OrganizationMember,
  Sponsor,
  SponsorContact,
  Campaign,
  CampaignSponsor,
  CampaignAssignment,
  CampaignMilestone,
  Transaction,
  Metric,
  RFMScore,
  ActivityLog,
  Notification,
  CampaignObjective,
  ObjectiveProgress,
} from '@prisma/client'

// Re-export Prisma types
export type {
  User,
  Organization,
  OrganizationMember,
  Sponsor,
  SponsorContact,
  Campaign,
  CampaignSponsor,
  CampaignAssignment,
  CampaignMilestone,
  Transaction,
  Metric,
  RFMScore,
  ActivityLog,
  Notification,
  CampaignObjective,
  ObjectiveProgress,
}

// Extended types with relations
export type UserWithMemberships = User & {
  memberships: (OrganizationMember & {
    organization: Organization
  })[]
}

export type OrganizationWithMembers = Organization & {
  members: (OrganizationMember & {
    user: User
  })[]
}

export type SponsorWithContacts = Sponsor & {
  contacts: SponsorContact[]
}

export type SponsorWithRFM = Sponsor & {
  contacts: SponsorContact[]
  rfmScores: RFMScore[]
  campaigns: (CampaignSponsor & {
    campaign: Campaign
  })[]
}

export type CampaignObjectiveWithProgress = CampaignObjective & {
  progressRecords: ObjectiveProgress[]
}

export type CampaignWithRelations = Campaign & {
  organization: Organization
  createdBy: User
  sponsors: (CampaignSponsor & {
    sponsor: Sponsor
  })[]
  assignments: (CampaignAssignment & {
    user: User
  })[]
  milestones: CampaignMilestone[]
  metrics: Metric[]
  transactions: Transaction[]
  objectives: CampaignObjectiveWithProgress[]
}

export type CampaignSummary = {
  id: string
  name: string
  status: string
  type: string
  budgetTotal: number
  budgetSpent: number
  startDate: Date
  endDate: Date
  totalImpressions: number
  totalClicks: number
  totalConversions: number
  actualROI: number | null
  sponsorCount: number
}

export type TransactionWithRelations = Transaction & {
  organization: Organization
  campaign: Campaign | null
  sponsor: Sponsor | null
}

// Dashboard types
export type DashboardStats = {
  totalCampaigns: number
  activeCampaigns: number
  totalSponsors: number
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  avgROI: number
  totalImpressions: number
  totalClicks: number
  totalConversions: number
}

export type RevenueByMonth = {
  month: string
  income: number
  expense: number
  net: number
}

export type SponsorsByTier = {
  tier: string
  count: number
  totalValue: number
}

export type CampaignsByStatus = {
  status: string
  count: number
}

export type RFMDistribution = {
  segment: string
  count: number
  percentage: number
}

// API Response types
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// Form types
export type CreateCampaignInput = {
  name: string
  description?: string
  type: string
  budgetTotal: number
  currency?: string
  startDate: Date
  endDate: Date
  targetImpressions?: number
  targetClicks?: number
  targetConversions?: number
  targetROI?: number
}

export type CreateSponsorInput = {
  companyName: string
  industry?: string
  website?: string
  description?: string
  address?: string
  city?: string
  country?: string
  tier?: string
  acquisitionSource?: string
}

export type CreateTransactionInput = {
  type: string
  category: string
  amount: number
  currency?: string
  transactionDate: Date
  dueDate?: Date
  description?: string
  campaignId?: string
  sponsorId?: string
  paymentMethod?: string
  invoiceNumber?: string
}

// Filter types
export type CampaignFilters = {
  status?: string[]
  type?: string[]
  startDateFrom?: Date
  startDateTo?: Date
  budgetMin?: number
  budgetMax?: number
  sponsorId?: string
}

export type SponsorFilters = {
  tier?: string[]
  industry?: string
  isActive?: boolean
  segment?: string[]
}

export type TransactionFilters = {
  type?: string
  category?: string[]
  status?: string[]
  dateFrom?: Date
  dateTo?: Date
  amountMin?: number
  amountMax?: number
  campaignId?: string
  sponsorId?: string
}

// ============================================================================
// ROO (Return on Objectives) Types
// ============================================================================

export type ObjectiveTypeEnum = 
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

export type ObjectiveStatusEnum = 
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'ON_TRACK'
  | 'AT_RISK'
  | 'BEHIND'
  | 'COMPLETED'
  | 'EXCEEDED'

// ROO Score calculation result
export type ROOScoreResult = {
  campaignId: string
  campaignName: string
  totalScore: number           // Weighted average ROO score (0-100+, can exceed if targets exceeded)
  totalWeight: number          // Sum of all objective weights
  objectiveCount: number       // Number of objectives
  completedCount: number       // Number of completed objectives
  objectives: ObjectiveScoreDetail[]
  calculatedAt: Date
}

export type ObjectiveScoreDetail = {
  objectiveId: string
  objectiveName: string
  type: ObjectiveTypeEnum
  targetValue: number
  currentValue: number
  achievementRate: number      // (currentValue / targetValue) * 100
  weight: number
  weightedScore: number        // achievementRate * weight
  status: ObjectiveStatusEnum
  unit: string
}

// Input types for creating/updating objectives
export type CreateObjectiveInput = {
  type: ObjectiveTypeEnum
  name: string
  description?: string
  targetValue: number
  unit?: string
  weight?: number
  startDate?: Date
  endDate?: Date
}

export type UpdateObjectiveInput = Partial<CreateObjectiveInput> & {
  currentValue?: number
  status?: ObjectiveStatusEnum
}

export type RecordProgressInput = {
  objectiveId: string
  value: number
  source?: string
  sourceReference?: string
  notes?: string
  periodStart?: Date
  periodEnd?: Date
}

// ROO Dashboard types
export type ROODashboardStats = {
  totalCampaignsWithObjectives: number
  avgROOScore: number
  objectivesByStatus: {
    status: ObjectiveStatusEnum
    count: number
  }[]
  objectivesByType: {
    type: ObjectiveTypeEnum
    count: number
    avgAchievement: number
  }[]
  topPerformingCampaigns: {
    campaignId: string
    campaignName: string
    rooScore: number
    objectiveCount: number
  }[]
  atRiskObjectives: {
    objectiveId: string
    objectiveName: string
    campaignName: string
    achievementRate: number
    daysRemaining: number
  }[]
}

// Objective type labels (for UI)
export const OBJECTIVE_TYPE_LABELS: Record<ObjectiveTypeEnum, string> = {
  AWARENESS: 'Marka Bilinirliği',
  REACH: 'Erişim',
  ENGAGEMENT: 'Etkileşim',
  VIDEO_VIEWS: 'Video İzlenme',
  WEBSITE_TRAFFIC: 'Web Sitesi Trafiği',
  LEAD_GENERATION: 'Lead Oluşturma',
  APP_DOWNLOAD: 'Uygulama İndirme',
  SALES: 'Satış',
  SIGN_UP: 'Kayıt/Üyelik',
  BRAND_SENTIMENT: 'Marka Algısı',
  SOCIAL_FOLLOWERS: 'Sosyal Medya Takipçi',
  EMAIL_SUBSCRIBERS: 'E-posta Aboneleri',
  CONTENT_CREATION: 'İçerik Üretimi',
  EVENT_ATTENDANCE: 'Etkinlik Katılımı',
  CUSTOM: 'Özel Hedef',
}

// Objective status labels (for UI)
export const OBJECTIVE_STATUS_LABELS: Record<ObjectiveStatusEnum, string> = {
  NOT_STARTED: 'Başlamadı',
  IN_PROGRESS: 'Devam Ediyor',
  ON_TRACK: 'Yolunda',
  AT_RISK: 'Risk Altında',
  BEHIND: 'Geride',
  COMPLETED: 'Tamamlandı',
  EXCEEDED: 'Hedef Aşıldı',
}

// Objective status colors (for UI)
export const OBJECTIVE_STATUS_COLORS: Record<ObjectiveStatusEnum, string> = {
  NOT_STARTED: 'gray',
  IN_PROGRESS: 'blue',
  ON_TRACK: 'green',
  AT_RISK: 'yellow',
  BEHIND: 'orange',
  COMPLETED: 'emerald',
  EXCEEDED: 'purple',
}
