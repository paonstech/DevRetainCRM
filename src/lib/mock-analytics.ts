/**
 * Mock Analytics Service - DevRetain CRM
 * 
 * PostgreSQL olmadan çalışan demo analytics fonksiyonları.
 */

import {
  mockSponsors,
  mockCampaigns,
  mockTransactions,
  mockMetrics,
  mockRFMScores,
  mockCampaignObjectives,
  mockObjectiveProgress,
  getMockTransactionsBySponsor,
  getMockTransactionsByCampaign,
  getMockMetricsByCampaign,
  getMockRFMBySponsor,
  getMockObjectivesByCampaign,
  getMockProgressByObjective,
  calculateMockROOScore,
  getAllCampaignsWithROO,
  getMockROODashboardStats,
  type MockSponsor,
  type MockTransaction,
  type MockMetric,
  type MockCampaignObjective,
  type MockObjectiveProgress,
  type MockObjectiveType,
  type MockObjectiveStatus,
} from './mock-data'

// ============================================================================
// TYPES
// ============================================================================

export type ROIResult = {
  roi: number
  gain: number
  cost: number
  netProfit: number
  isPositive: boolean
  interpretation: string
}

export type RFMResult = {
  sponsorId: string
  recencyScore: number
  frequencyScore: number
  monetaryScore: number
  rfmScore: number
  segment: string
  segmentLabel: string
  daysSinceLastTransaction: number
  transactionCount: number
  totalMonetary: number
  averageMonetary: number
  recommendations: string[]
}

export type LTVResult = {
  sponsorId: string
  ltv: number
  averageTransactionValue: number
  purchaseFrequency: number
  customerLifespan: number
  churnRate: number
  retentionRate: number
  ltvSegment: 'HIGH' | 'MEDIUM' | 'LOW'
  percentile: number
  projectedRevenue12Months: number
  projectedRevenue24Months: number
  interpretation: string
}

export type CampaignROIResult = {
  campaignId: string
  campaignName: string
  roi: number
  totalRevenue: number
  sponsorshipIncome: number
  otherIncome: number
  totalCost: number
  adSpend: number
  platformFees: number
  otherExpenses: number
  costPerClick: number | null
  costPerConversion: number | null
  costPerMille: number | null
  conversionRate: number | null
  impressions: number
  clicks: number
  conversions: number
  interpretation: string
}

export type DashboardStats = {
  totalSponsors: number
  activeSponsors: number
  totalCampaigns: number
  activeCampaigns: number
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  averageROI: number
  totalImpressions: number
  totalClicks: number
  totalConversions: number
  pendingPayments: number
}

export type MonthlyTrend = {
  month: string
  revenue: number
  expenses: number
  net: number
}

export type RFMDistribution = {
  segment: string
  label: string
  count: number
  percentage: number
  color: string
}

export type SponsorsByTier = {
  tier: string
  count: number
  totalValue: number
  color: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

const RFM_SEGMENT_LABELS: Record<string, string> = {
  CHAMPIONS: 'Şampiyonlar',
  LOYAL_CUSTOMERS: 'Sadık Müşteriler',
  POTENTIAL_LOYALIST: 'Potansiyel Sadıklar',
  NEW_CUSTOMERS: 'Yeni Müşteriler',
  PROMISING: 'Umut Vaat Edenler',
  NEED_ATTENTION: 'İlgi Gerektirenler',
  ABOUT_TO_SLEEP: 'Uykuya Dalanlar',
  AT_RISK: 'Risk Altındakiler',
  CANT_LOSE_THEM: 'Kaybetmemeliyiz',
  HIBERNATING: 'Kış Uykusundakiler',
  LOST: 'Kayıp Müşteriler',
}

const RFM_SEGMENT_COLORS: Record<string, string> = {
  CHAMPIONS: '#10b981',
  LOYAL_CUSTOMERS: '#22c55e',
  POTENTIAL_LOYALIST: '#84cc16',
  NEW_CUSTOMERS: '#06b6d4',
  PROMISING: '#3b82f6',
  NEED_ATTENTION: '#f59e0b',
  ABOUT_TO_SLEEP: '#f97316',
  AT_RISK: '#ef4444',
  CANT_LOSE_THEM: '#dc2626',
  HIBERNATING: '#6b7280',
  LOST: '#374151',
}

const TIER_COLORS: Record<string, string> = {
  DIAMOND: '#06b6d4',
  PLATINUM: '#8b5cf6',
  GOLD: '#f59e0b',
  SILVER: '#6b7280',
  BRONZE: '#d97706',
}

const RFM_RECOMMENDATIONS: Record<string, string[]> = {
  CHAMPIONS: [
    'VIP programına dahil edin',
    'Özel erken erişim fırsatları sunun',
    'Referans programı için teşvik edin',
  ],
  LOYAL_CUSTOMERS: [
    'Sadakat ödülleri sunun',
    'Üst segment kampanyalara davet edin',
    'Cross-sell fırsatları değerlendirin',
  ],
  POTENTIAL_LOYALIST: [
    'Üyelik/sadakat programı önerin',
    'İlk büyük kampanya için özel teklif sunun',
    'Düzenli takip aramaları yapın',
  ],
  NEW_CUSTOMERS: [
    'Hoş geldin kampanyası başlatın',
    'Onboarding sürecini optimize edin',
    'İlk 90 günde yakın takip yapın',
  ],
  PROMISING: [
    'Marka bilinirliği kampanyaları önerin',
    'Başarılı vaka çalışmaları paylaşın',
    'Deneme kampanyası fırsatı sunun',
  ],
  NEED_ATTENTION: [
    'Kişiselleştirilmiş yeniden aktivasyon kampanyası',
    'Sınırlı süreli özel teklif sunun',
    'Geri bildirim toplantısı talep edin',
  ],
  ABOUT_TO_SLEEP: [
    'Acil yeniden aktivasyon kampanyası',
    '"Sizi özledik" mesajı gönderin',
    'Özel indirim/bonus teklif edin',
  ],
  AT_RISK: [
    'Üst düzey yönetici araması yapın',
    'Sorun analizi için görüşme talep edin',
    'Özel kurtarma paketi hazırlayın',
  ],
  CANT_LOSE_THEM: [
    'ACİL: CEO seviyesinde iletişim kurun',
    'Özel müşteri başarı yöneticisi atayın',
    'Stratejik ortaklık teklifi sunun',
  ],
  HIBERNATING: [
    'Win-back kampanyası başlatın',
    'Yeni ürün/hizmet duyuruları gönderin',
    'Düşük maliyetli yeniden başlangıç paketi sunun',
  ],
  LOST: [
    'Kayıp analizi yapın ve öğrenin',
    'Uzun vadeli nurturing listesine ekleyin',
    'Yılda 1-2 kez değer içeriği gönderin',
  ],
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount)
}

// ============================================================================
// ROI CALCULATIONS
// ============================================================================

export function calculateROI(gain: number, cost: number): ROIResult {
  if (cost <= 0) {
    return {
      roi: gain > 0 ? Infinity : 0,
      gain,
      cost,
      netProfit: gain,
      isPositive: gain > 0,
      interpretation: cost === 0 
        ? 'Maliyet sıfır olduğu için ROI hesaplanamıyor.' 
        : 'Geçersiz maliyet değeri.',
    }
  }

  const netProfit = gain - cost
  const roi = (netProfit / cost) * 100

  let interpretation: string
  if (roi >= 200) {
    interpretation = 'Mükemmel performans! Yatırımın 3 katından fazla geri dönüş.'
  } else if (roi >= 100) {
    interpretation = 'Çok iyi performans! Yatırımın 2 katından fazla geri dönüş.'
  } else if (roi >= 50) {
    interpretation = 'İyi performans. Yatırımın yarısı kadar kar elde edildi.'
  } else if (roi >= 0) {
    interpretation = 'Pozitif ROI, ancak iyileştirme potansiyeli var.'
  } else if (roi >= -50) {
    interpretation = 'Negatif ROI. Strateji gözden geçirilmeli.'
  } else {
    interpretation = 'Kritik kayıp! Acil müdahale gerekli.'
  }

  return {
    roi: Math.round(roi * 100) / 100,
    gain,
    cost,
    netProfit,
    isPositive: roi >= 0,
    interpretation,
  }
}

export function calculateCampaignROI(campaignId: string): CampaignROIResult | null {
  const campaign = mockCampaigns.find(c => c.id === campaignId)
  if (!campaign) return null

  const transactions = getMockTransactionsByCampaign(campaignId)
  const metrics = getMockMetricsByCampaign(campaignId)

  // Calculate revenues
  const incomeTransactions = transactions.filter(
    t => t.type === 'INCOME' && t.status === 'COMPLETED'
  )
  const totalRevenue = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  const sponsorshipIncome = incomeTransactions
    .filter(t => t.category === 'SPONSORSHIP_FEE')
    .reduce((sum, t) => sum + t.amount, 0)
  const otherIncome = totalRevenue - sponsorshipIncome

  // Calculate costs
  const expenseTransactions = transactions.filter(
    t => t.type === 'EXPENSE' && t.status === 'COMPLETED'
  )
  const totalCost = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
  const adSpend = expenseTransactions
    .filter(t => t.category === 'AD_SPEND')
    .reduce((sum, t) => sum + t.amount, 0)
  const platformFees = expenseTransactions
    .filter(t => t.category === 'PLATFORM_FEE')
    .reduce((sum, t) => sum + t.amount, 0)
  const otherExpenses = totalCost - adSpend - platformFees

  // Calculate metrics
  const impressions = metrics
    .filter(m => m.type === 'IMPRESSION' || m.type === 'VIEW')
    .reduce((sum, m) => sum + m.value, 0)
  const clicks = metrics
    .filter(m => m.type === 'CLICK')
    .reduce((sum, m) => sum + m.value, 0)
  const conversions = metrics
    .filter(m => m.type === 'CONVERSION')
    .reduce((sum, m) => sum + m.value, 0)

  const roiResult = calculateROI(totalRevenue, totalCost)

  const costPerClick = clicks > 0 ? totalCost / clicks : null
  const costPerConversion = conversions > 0 ? totalCost / conversions : null
  const costPerMille = impressions > 0 ? (totalCost / impressions) * 1000 : null
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : null

  let interpretation = roiResult.interpretation
  if (conversionRate !== null) {
    if (conversionRate >= 5) {
      interpretation += ' Dönüşüm oranı sektör ortalamasının üzerinde.'
    } else if (conversionRate >= 2) {
      interpretation += ' Dönüşüm oranı kabul edilebilir seviyede.'
    } else {
      interpretation += ' Dönüşüm oranı düşük, optimizasyon önerilir.'
    }
  }

  return {
    campaignId,
    campaignName: campaign.name,
    roi: roiResult.roi,
    totalRevenue,
    sponsorshipIncome,
    otherIncome,
    totalCost,
    adSpend,
    platformFees,
    otherExpenses,
    costPerClick: costPerClick ? Math.round(costPerClick * 100) / 100 : null,
    costPerConversion: costPerConversion ? Math.round(costPerConversion * 100) / 100 : null,
    costPerMille: costPerMille ? Math.round(costPerMille * 100) / 100 : null,
    conversionRate: conversionRate ? Math.round(conversionRate * 100) / 100 : null,
    impressions,
    clicks,
    conversions,
    interpretation,
  }
}

// ============================================================================
// RFM CALCULATIONS
// ============================================================================

export function calculateRFM(sponsorId: string): RFMResult | null {
  const sponsor = mockSponsors.find(s => s.id === sponsorId)
  if (!sponsor) return null

  const rfmScore = getMockRFMBySponsor(sponsorId)
  if (!rfmScore) return null

  const daysSinceLastTransaction = rfmScore.lastTransactionDate
    ? Math.floor((Date.now() - rfmScore.lastTransactionDate.getTime()) / (1000 * 60 * 60 * 24))
    : 365

  const averageMonetary = rfmScore.transactionCount > 0 
    ? rfmScore.totalMonetary / rfmScore.transactionCount 
    : 0

  return {
    sponsorId,
    recencyScore: rfmScore.recencyScore,
    frequencyScore: rfmScore.frequencyScore,
    monetaryScore: rfmScore.monetaryScore,
    rfmScore: rfmScore.rfmScore,
    segment: rfmScore.segment,
    segmentLabel: RFM_SEGMENT_LABELS[rfmScore.segment] || rfmScore.segment,
    daysSinceLastTransaction,
    transactionCount: rfmScore.transactionCount,
    totalMonetary: rfmScore.totalMonetary,
    averageMonetary: Math.round(averageMonetary * 100) / 100,
    recommendations: RFM_RECOMMENDATIONS[rfmScore.segment] || [],
  }
}

// ============================================================================
// LTV CALCULATIONS
// ============================================================================

export function calculateLTV(sponsorId: string): LTVResult | null {
  const sponsor = mockSponsors.find(s => s.id === sponsorId)
  if (!sponsor) return null

  const transactions = getMockTransactionsBySponsor(sponsorId).filter(
    t => t.type === 'INCOME' && t.status === 'COMPLETED'
  )

  if (transactions.length === 0) {
    return {
      sponsorId,
      ltv: 0,
      averageTransactionValue: 0,
      purchaseFrequency: 0,
      customerLifespan: 0,
      churnRate: 1,
      retentionRate: 0,
      ltvSegment: 'LOW',
      percentile: 0,
      projectedRevenue12Months: 0,
      projectedRevenue24Months: 0,
      interpretation: 'Henüz işlem geçmişi bulunmuyor.',
    }
  }

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)
  const transactionCount = transactions.length
  const averageTransactionValue = totalRevenue / transactionCount

  // Sort by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => a.transactionDate.getTime() - b.transactionDate.getTime()
  )
  const firstTransaction = sortedTransactions[0].transactionDate
  const lastTransaction = sortedTransactions[sortedTransactions.length - 1].transactionDate

  const daysSinceFirst = Math.floor(
    (Date.now() - firstTransaction.getTime()) / (1000 * 60 * 60 * 24)
  )
  const daysSinceLastTransaction = Math.floor(
    (Date.now() - lastTransaction.getTime()) / (1000 * 60 * 60 * 24)
  )

  const yearsActive = Math.max(daysSinceFirst / 365, 0.1)
  const purchaseFrequency = transactionCount / yearsActive

  // Churn rate estimation
  let churnRate: number
  if (daysSinceLastTransaction <= 30) {
    churnRate = 0.05
  } else if (daysSinceLastTransaction <= 90) {
    churnRate = 0.15
  } else if (daysSinceLastTransaction <= 180) {
    churnRate = 0.30
  } else if (daysSinceLastTransaction <= 365) {
    churnRate = 0.50
  } else {
    churnRate = 0.75
  }

  if (purchaseFrequency >= 4) {
    churnRate *= 0.7
  } else if (purchaseFrequency >= 2) {
    churnRate *= 0.85
  }

  churnRate = Math.min(churnRate, 0.95)
  const retentionRate = 1 - churnRate
  const customerLifespan = churnRate > 0 ? 1 / churnRate : 10

  const ltv = averageTransactionValue * purchaseFrequency * customerLifespan

  const monthlyRevenue = (totalRevenue / Math.max(daysSinceFirst, 30)) * 30
  const projectedRevenue12Months = monthlyRevenue * 12 * retentionRate
  const projectedRevenue24Months = monthlyRevenue * 24 * Math.pow(retentionRate, 2)

  // Calculate percentile
  const allLTVs = mockSponsors
    .filter(s => s.organizationId === sponsor.organizationId)
    .map(s => {
      const txs = getMockTransactionsBySponsor(s.id).filter(
        t => t.type === 'INCOME' && t.status === 'COMPLETED'
      )
      if (txs.length === 0) return 0
      const total = txs.reduce((sum, t) => sum + t.amount, 0)
      return total * 3 // Simple estimation
    })
    .sort((a, b) => a - b)

  const percentile = allLTVs.length > 0
    ? (allLTVs.filter(v => v <= ltv).length / allLTVs.length) * 100
    : 50

  let ltvSegment: 'HIGH' | 'MEDIUM' | 'LOW'
  if (percentile >= 75) {
    ltvSegment = 'HIGH'
  } else if (percentile >= 40) {
    ltvSegment = 'MEDIUM'
  } else {
    ltvSegment = 'LOW'
  }

  let interpretation: string
  if (ltvSegment === 'HIGH') {
    interpretation = `Yüksek değerli sponsor! Tahmini yaşam boyu değer: ${formatCurrency(ltv)}. Bu sponsora özel ilgi gösterilmeli.`
  } else if (ltvSegment === 'MEDIUM') {
    interpretation = `Orta değerli sponsor. Tahmini yaşam boyu değer: ${formatCurrency(ltv)}. Büyüme potansiyeli var.`
  } else {
    interpretation = `Düşük değerli sponsor. Tahmini yaşam boyu değer: ${formatCurrency(ltv)}. Aktivasyon stratejileri değerlendirilmeli.`
  }

  if (churnRate >= 0.5) {
    interpretation += ' UYARI: Yüksek kayıp riski mevcut!'
  }

  return {
    sponsorId,
    ltv: Math.round(ltv * 100) / 100,
    averageTransactionValue: Math.round(averageTransactionValue * 100) / 100,
    purchaseFrequency: Math.round(purchaseFrequency * 100) / 100,
    customerLifespan: Math.round(customerLifespan * 100) / 100,
    churnRate: Math.round(churnRate * 1000) / 1000,
    retentionRate: Math.round(retentionRate * 1000) / 1000,
    ltvSegment,
    percentile: Math.round(percentile),
    projectedRevenue12Months: Math.round(projectedRevenue12Months * 100) / 100,
    projectedRevenue24Months: Math.round(projectedRevenue24Months * 100) / 100,
    interpretation,
  }
}

// ============================================================================
// DASHBOARD ANALYTICS
// ============================================================================

export function getDashboardStats(organizationId: string = 'org-1'): DashboardStats {
  const orgSponsors = mockSponsors.filter(s => s.organizationId === organizationId)
  const orgCampaigns = mockCampaigns.filter(c => c.organizationId === organizationId)
  const orgTransactions = mockTransactions.filter(t => t.organizationId === organizationId)
  const orgMetrics = mockMetrics.filter(m => m.organizationId === organizationId)

  const totalRevenue = orgTransactions
    .filter(t => t.type === 'INCOME' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = orgTransactions
    .filter(t => t.type === 'EXPENSE' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingPayments = orgTransactions
    .filter(t => t.type === 'INCOME' && t.status === 'PENDING')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalImpressions = orgMetrics
    .filter(m => m.type === 'IMPRESSION' || m.type === 'VIEW')
    .reduce((sum, m) => sum + m.value, 0)

  const totalClicks = orgMetrics
    .filter(m => m.type === 'CLICK')
    .reduce((sum, m) => sum + m.value, 0)

  const totalConversions = orgMetrics
    .filter(m => m.type === 'CONVERSION')
    .reduce((sum, m) => sum + m.value, 0)

  const netIncome = totalRevenue - totalExpenses
  const averageROI = totalExpenses > 0 
    ? ((totalRevenue - totalExpenses) / totalExpenses) * 100 
    : 0

  return {
    totalSponsors: orgSponsors.length,
    activeSponsors: orgSponsors.filter(s => s.isActive).length,
    totalCampaigns: orgCampaigns.length,
    activeCampaigns: orgCampaigns.filter(c => c.status === 'ACTIVE').length,
    totalRevenue,
    totalExpenses,
    netIncome,
    averageROI: Math.round(averageROI * 100) / 100,
    totalImpressions,
    totalClicks,
    totalConversions,
    pendingPayments,
  }
}

export function getMonthlyTrend(organizationId: string = 'org-1', months: number = 6): MonthlyTrend[] {
  const orgTransactions = mockTransactions.filter(t => t.organizationId === organizationId)
  const trend: MonthlyTrend[] = []

  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date()
    monthStart.setMonth(monthStart.getMonth() - i)
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const monthEnd = new Date(monthStart)
    monthEnd.setMonth(monthEnd.getMonth() + 1)

    const monthTransactions = orgTransactions.filter(
      t => t.transactionDate >= monthStart && t.transactionDate < monthEnd
    )

    const revenue = monthTransactions
      .filter(t => t.type === 'INCOME' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions
      .filter(t => t.type === 'EXPENSE' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0)

    trend.push({
      month: monthStart.toLocaleDateString('tr-TR', { year: 'numeric', month: 'short' }),
      revenue,
      expenses,
      net: revenue - expenses,
    })
  }

  return trend
}

export function getRFMDistribution(organizationId: string = 'org-1'): RFMDistribution[] {
  const orgSponsors = mockSponsors.filter(s => s.organizationId === organizationId)
  const sponsorIds = orgSponsors.map(s => s.id)
  const orgRFM = mockRFMScores.filter(r => sponsorIds.includes(r.sponsorId))

  const segmentCounts = new Map<string, number>()
  
  for (const rfm of orgRFM) {
    const count = segmentCounts.get(rfm.segment) || 0
    segmentCounts.set(rfm.segment, count + 1)
  }

  const total = orgRFM.length || 1

  return Array.from(segmentCounts.entries()).map(([segment, count]) => ({
    segment,
    label: RFM_SEGMENT_LABELS[segment] || segment,
    count,
    percentage: Math.round((count / total) * 100),
    color: RFM_SEGMENT_COLORS[segment] || '#6b7280',
  }))
}

export function getSponsorsByTier(organizationId: string = 'org-1'): SponsorsByTier[] {
  const orgSponsors = mockSponsors.filter(s => s.organizationId === organizationId && s.isActive)
  
  const tierData = new Map<string, { count: number; totalValue: number }>()
  
  for (const sponsor of orgSponsors) {
    const transactions = getMockTransactionsBySponsor(sponsor.id)
      .filter(t => t.type === 'INCOME' && t.status === 'COMPLETED')
    const totalValue = transactions.reduce((sum, t) => sum + t.amount, 0)
    
    const existing = tierData.get(sponsor.tier) || { count: 0, totalValue: 0 }
    existing.count++
    existing.totalValue += totalValue
    tierData.set(sponsor.tier, existing)
  }

  const tierOrder = ['DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE']
  
  return tierOrder
    .filter(tier => tierData.has(tier))
    .map(tier => ({
      tier,
      count: tierData.get(tier)!.count,
      totalValue: tierData.get(tier)!.totalValue,
      color: TIER_COLORS[tier] || '#6b7280',
    }))
}

export function getTopSponsors(organizationId: string = 'org-1', limit: number = 5) {
  const orgSponsors = mockSponsors.filter(s => s.organizationId === organizationId && s.isActive)
  
  return orgSponsors
    .map(sponsor => {
      const transactions = getMockTransactionsBySponsor(sponsor.id)
        .filter(t => t.type === 'INCOME' && t.status === 'COMPLETED')
      const totalValue = transactions.reduce((sum, t) => sum + t.amount, 0)
      const rfm = getMockRFMBySponsor(sponsor.id)
      
      return {
        ...sponsor,
        totalValue,
        rfmSegment: rfm?.segment || 'UNKNOWN',
        rfmLabel: RFM_SEGMENT_LABELS[rfm?.segment || ''] || 'Bilinmiyor',
      }
    })
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, limit)
}

export function getCampaignPerformance(organizationId: string = 'org-1') {
  const orgCampaigns = mockCampaigns.filter(c => c.organizationId === organizationId)
  
  return orgCampaigns.map(campaign => {
    const roi = calculateCampaignROI(campaign.id)
    const roo = calculateMockROOScore(campaign.id)
    
    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      type: campaign.type,
      budgetTotal: campaign.budgetTotal,
      budgetSpent: campaign.budgetSpent,
      budgetUtilization: Math.round((campaign.budgetSpent / campaign.budgetTotal) * 100),
      roi: roi?.roi || 0,
      rooScore: roo.score,
      objectiveCount: roo.objectiveCount,
      impressions: campaign.totalImpressions,
      clicks: campaign.totalClicks,
      conversions: campaign.totalConversions,
      ctr: campaign.totalImpressions > 0 
        ? Math.round((campaign.totalClicks / campaign.totalImpressions) * 10000) / 100
        : 0,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    }
  })
}

// ============================================================================
// ROO (RETURN ON OBJECTIVES) FUNCTIONS
// ============================================================================

// Hedef tipi etiketleri (Türkçe)
export const OBJECTIVE_TYPE_LABELS: Record<MockObjectiveType, string> = {
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

// Durum etiketleri (Türkçe)
export const OBJECTIVE_STATUS_LABELS: Record<MockObjectiveStatus, string> = {
  NOT_STARTED: 'Başlamadı',
  IN_PROGRESS: 'Devam Ediyor',
  ON_TRACK: 'Yolunda',
  AT_RISK: 'Risk Altında',
  BEHIND: 'Geride',
  COMPLETED: 'Tamamlandı',
  EXCEEDED: 'Hedef Aşıldı',
}

// Durum renkleri
export const OBJECTIVE_STATUS_COLORS: Record<MockObjectiveStatus, string> = {
  NOT_STARTED: 'gray',
  IN_PROGRESS: 'blue',
  ON_TRACK: 'green',
  AT_RISK: 'yellow',
  BEHIND: 'orange',
  COMPLETED: 'emerald',
  EXCEEDED: 'purple',
}

export type ROOResult = {
  campaignId: string
  campaignName: string
  rooScore: number              // Normalize edilmiş skor (0-100)
  rawRooScore: number           // Ham skor (100'ü geçebilir)
  totalWeight: number
  objectiveCount: number
  completedCount: number
  exceededCount: number
  atRiskCount: number
  behindCount: number
  hasOverAchieved: boolean      // En az bir hedef aşıldı mı?
  overAchievedObjectives: string[] // Aşılan hedeflerin ID'leri
  totalOverAchievementBonus: number // Toplam fazla başarı bonusu
  performanceCategory: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'AT_RISK' | 'POOR'
  performanceLabel: string
  objectives: Array<{
    id: string
    name: string
    type: MockObjectiveType
    targetValue: number
    currentValue: number
    achievementRate: number     // Gerçek başarı oranı (100'ü geçebilir)
    normalizedRate: number      // Normalize edilmiş oran (max 100)
    weight: number
    weightedScore: number       // Normalize edilmiş ağırlıklı skor
    rawWeightedScore: number    // Ham ağırlıklı skor
    status: MockObjectiveStatus
    unit: string
    statusLabel: string
    typeLabel: string
    isOverAchieved: boolean
    overAchievementRate: number
  }>
  calculatedAt: Date
  recommendations: string[]
}

// Gelişmiş ROO Score sonucu
export type ROOScoreResult = {
  normalizedScore: number      // 100 üzerinden normalize edilmiş skor
  rawScore: number             // Ham skor (100'ü geçebilir)
  weightedAverage: number      // Ağırlıklı ortalama
  objectives: Array<{
    id: string
    name: string
    type: MockObjectiveType
    target: number
    actual: number
    weight: number
    achievementRate: number
    normalizedRate: number
    contribution: number
    isOverAchieved: boolean
    overAchievementPercent: number
  }>
  stats: {
    totalObjectives: number
    completedObjectives: number
    overAchievedObjectives: number
    atRiskObjectives: number
    behindObjectives: number
    notStartedObjectives: number
    avgAchievementRate: number
    totalWeight: number
  }
  performance: {
    category: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'AT_RISK' | 'POOR'
    label: string
    color: string
    description: string
  }
  overAchievement: {
    hasOverAchieved: boolean
    count: number
    totalBonus: number
    details: Array<{
      objectiveId: string
      objectiveName: string
      excessPercent: number
    }>
  }
  calculatedAt: Date
}

/**
 * Gelişmiş ROO Score Hesaplama (Mock)
 * 
 * Kampanyaya bağlı tüm hedefleri ve ağırlıklarını çeker,
 * her hedef için gerçekleşme oranını hesaplar, ağırlıklı ortalama alır
 * ve 100 üzerinden normalize edilmiş bir başarı skoru döner.
 * 
 * Formül: ROO Score = Σ((Actual/Target) × Weight) / Σ(Weight)
 */
export function calculateROOScore(campaignId: string): ROOScoreResult {
  const campaign = mockCampaigns.find(c => c.id === campaignId)
  
  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`)
  }

  const objectives = getMockObjectivesByCampaign(campaignId).filter(o => o.isActive)
  const now = new Date('2024-10-15')

  // Boş hedef kontrolü
  if (objectives.length === 0) {
    return {
      normalizedScore: 0,
      rawScore: 0,
      weightedAverage: 0,
      objectives: [],
      stats: {
        totalObjectives: 0,
        completedObjectives: 0,
        overAchievedObjectives: 0,
        atRiskObjectives: 0,
        behindObjectives: 0,
        notStartedObjectives: 0,
        avgAchievementRate: 0,
        totalWeight: 0,
      },
      performance: {
        category: 'AT_RISK',
        label: 'Hedef Tanımlanmamış',
        color: 'gray',
        description: 'Bu kampanya için henüz hedef tanımlanmamış.',
      },
      overAchievement: {
        hasOverAchieved: false,
        count: 0,
        totalBonus: 0,
        details: [],
      },
      calculatedAt: now,
    }
  }

  // Hedef hesaplamaları
  let totalWeightedScore = 0
  let totalWeight = 0
  let totalAchievementRate = 0
  
  // İstatistik sayaçları
  let completedCount = 0
  let overAchievedCount = 0
  let atRiskCount = 0
  let behindCount = 0
  let notStartedCount = 0

  // Over-achievement detayları
  const overAchievementDetails: ROOScoreResult['overAchievement']['details'] = []

  const objectiveResults = objectives.map((obj) => {
    const target = obj.targetValue
    const actual = obj.currentValue
    const weight = obj.weight
    
    // Gerçekleşme oranı hesapla (%)
    const achievementRate = target > 0 ? (actual / target) * 100 : 0
    
    // Normalize edilmiş oran (max 100)
    const normalizedRate = Math.min(achievementRate, 100)
    
    // Over-achievement kontrolü
    const isOverAchieved = achievementRate > 100
    const overAchievementPercent = isOverAchieved ? achievementRate - 100 : 0
    
    // Skora katkı (normalize edilmiş)
    const contribution = (normalizedRate / 100) * weight
    
    totalWeightedScore += contribution
    totalWeight += weight
    totalAchievementRate += achievementRate

    // Durum sayaçları
    if (obj.status === 'COMPLETED') completedCount++
    if (obj.status === 'EXCEEDED' || isOverAchieved) {
      overAchievedCount++
      overAchievementDetails.push({
        objectiveId: obj.id,
        objectiveName: obj.name,
        excessPercent: overAchievementPercent,
      })
    }
    if (obj.status === 'AT_RISK') atRiskCount++
    if (obj.status === 'BEHIND') behindCount++
    if (obj.status === 'NOT_STARTED') notStartedCount++

    return {
      id: obj.id,
      name: obj.name,
      type: obj.type,
      target,
      actual,
      weight,
      achievementRate: Math.round(achievementRate * 100) / 100,
      normalizedRate: Math.round(normalizedRate * 100) / 100,
      contribution: Math.round(contribution * 1000) / 1000,
      isOverAchieved,
      overAchievementPercent: Math.round(overAchievementPercent * 100) / 100,
    }
  })

  // Ağırlıklı ortalama (normalize edilmiş)
  const weightedAverage = totalWeight > 0 ? totalWeightedScore / totalWeight : 0
  
  // Normalize edilmiş skor (0-100)
  const normalizedScore = Math.round(weightedAverage * 100 * 100) / 100
  
  // Ham skor (100'ü geçebilir)
  const rawScore = totalWeight > 0 
    ? Math.round((objectiveResults.reduce((sum, o) => sum + (o.achievementRate / 100) * o.weight, 0) / totalWeight) * 100 * 100) / 100
    : 0
  
  // Ortalama gerçekleşme oranı
  const avgAchievementRate = objectives.length > 0 
    ? Math.round((totalAchievementRate / objectives.length) * 100) / 100 
    : 0

  // Performans kategorisi belirle
  let category: ROOScoreResult['performance']['category']
  let label: string
  let color: string
  let description: string

  if (normalizedScore >= 90) {
    category = 'EXCELLENT'
    label = 'Mükemmel'
    color = 'emerald'
    description = 'Kampanya hedeflerinin büyük çoğunluğu başarıyla tamamlandı veya aşıldı.'
  } else if (normalizedScore >= 75) {
    category = 'GOOD'
    label = 'İyi'
    color = 'green'
    description = 'Kampanya hedefleri genel olarak başarılı bir şekilde ilerliyor.'
  } else if (normalizedScore >= 50) {
    category = 'AVERAGE'
    label = 'Ortalama'
    color = 'yellow'
    description = 'Kampanya hedeflerinde orta düzeyde ilerleme var. İyileştirme alanları mevcut.'
  } else if (normalizedScore >= 25) {
    category = 'AT_RISK'
    label = 'Risk Altında'
    color = 'orange'
    description = 'Kampanya hedeflerinin çoğu geride. Acil müdahale gerekebilir.'
  } else {
    category = 'POOR'
    label = 'Düşük Performans'
    color = 'red'
    description = 'Kampanya hedeflerinde ciddi sorunlar var. Strateji revizyonu önerilir.'
  }

  // Over-achievement bonus hesapla (fazla başarının %10'u bonus olarak)
  const totalBonus = overAchievementDetails.reduce((sum, d) => sum + d.excessPercent * 0.1, 0)

  return {
    normalizedScore,
    rawScore,
    weightedAverage: Math.round(weightedAverage * 1000) / 1000,
    objectives: objectiveResults,
    stats: {
      totalObjectives: objectives.length,
      completedObjectives: completedCount,
      overAchievedObjectives: overAchievedCount,
      atRiskObjectives: atRiskCount,
      behindObjectives: behindCount,
      notStartedObjectives: notStartedCount,
      avgAchievementRate,
      totalWeight,
    },
    performance: {
      category,
      label,
      color,
      description,
    },
    overAchievement: {
      hasOverAchieved: overAchievedCount > 0,
      count: overAchievedCount,
      totalBonus: Math.round(totalBonus * 100) / 100,
      details: overAchievementDetails,
    },
    calculatedAt: now,
  }
}

/**
 * Kampanya için ROO puanı hesapla (Mock - Geriye uyumluluk için)
 */
export function calculateROO(campaignId: string): ROOResult {
  const campaign = mockCampaigns.find(c => c.id === campaignId)
  
  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`)
  }

  const objectives = getMockObjectivesByCampaign(campaignId).filter(o => o.isActive)
  const overAchievedObjectives: string[] = []
  
  // Boş hedef kontrolü
  if (objectives.length === 0) {
    return {
      campaignId,
      campaignName: campaign.name,
      rooScore: 0,
      rawRooScore: 0,
      totalWeight: 0,
      objectiveCount: 0,
      completedCount: 0,
      exceededCount: 0,
      atRiskCount: 0,
      behindCount: 0,
      hasOverAchieved: false,
      overAchievedObjectives: [],
      totalOverAchievementBonus: 0,
      performanceCategory: 'AT_RISK',
      performanceLabel: 'Hedef Tanımlanmamış',
      objectives: [],
      calculatedAt: new Date('2024-10-15'),
      recommendations: ['Kampanya için hedefler tanımlayın.'],
    }
  }

  let totalWeightedScore = 0
  let totalRawWeightedScore = 0
  let totalWeight = 0
  let completedCount = 0
  let exceededCount = 0
  let atRiskCount = 0
  let behindCount = 0
  let totalOverAchievementBonus = 0

  // Hedef detaylarını hazırla
  const objectiveDetails = objectives.map(obj => {
    const achievementRate = obj.targetValue > 0 
      ? (obj.currentValue / obj.targetValue) * 100 
      : 0
    
    const normalizedRate = Math.min(achievementRate, 100)
    const isOverAchieved = achievementRate > 100
    const overAchievementRate = isOverAchieved ? achievementRate - 100 : 0
    
    if (isOverAchieved) {
      overAchievedObjectives.push(obj.id)
      totalOverAchievementBonus += overAchievementRate * 0.1
    }
    
    const weightedScore = normalizedRate * obj.weight
    const rawWeightedScore = achievementRate * obj.weight
    
    totalWeightedScore += weightedScore
    totalRawWeightedScore += rawWeightedScore
    totalWeight += obj.weight

    // Durum sayaçları
    if (obj.status === 'COMPLETED') completedCount++
    if (obj.status === 'EXCEEDED' || isOverAchieved) exceededCount++
    if (obj.status === 'AT_RISK') atRiskCount++
    if (obj.status === 'BEHIND') behindCount++

    return {
      id: obj.id,
      name: obj.name,
      type: obj.type,
      targetValue: obj.targetValue,
      currentValue: obj.currentValue,
      achievementRate: Math.round(achievementRate * 100) / 100,
      normalizedRate: Math.round(normalizedRate * 100) / 100,
      weight: obj.weight,
      weightedScore: Math.round(weightedScore * 100) / 100,
      rawWeightedScore: Math.round(rawWeightedScore * 100) / 100,
      status: obj.status,
      unit: obj.unit,
      statusLabel: OBJECTIVE_STATUS_LABELS[obj.status],
      typeLabel: OBJECTIVE_TYPE_LABELS[obj.type],
      isOverAchieved,
      overAchievementRate: Math.round(overAchievementRate * 100) / 100,
    }
  })

  // ROO Skoru (normalize edilmiş, max 100)
  const rooScore = totalWeight > 0 
    ? Math.round((totalWeightedScore / totalWeight) * 100) / 100 
    : 0
  
  // Ham ROO Skoru (100'ü geçebilir)
  const rawRooScore = totalWeight > 0 
    ? Math.round((totalRawWeightedScore / totalWeight) * 100) / 100 
    : 0

  // Performans kategorisi belirle
  let performanceCategory: ROOResult['performanceCategory']
  let performanceLabel: string

  if (rooScore >= 90) {
    performanceCategory = 'EXCELLENT'
    performanceLabel = 'Mükemmel'
  } else if (rooScore >= 75) {
    performanceCategory = 'GOOD'
    performanceLabel = 'İyi'
  } else if (rooScore >= 50) {
    performanceCategory = 'AVERAGE'
    performanceLabel = 'Ortalama'
  } else if (rooScore >= 25) {
    performanceCategory = 'AT_RISK'
    performanceLabel = 'Risk Altında'
  } else {
    performanceCategory = 'POOR'
    performanceLabel = 'Düşük Performans'
  }

  // Öneriler oluştur
  const recommendations: string[] = []
  
  if (atRiskCount > 0 || behindCount > 0) {
    recommendations.push(`${atRiskCount + behindCount} hedef risk altında veya geride. Öncelikli olarak bu hedeflere odaklanın.`)
  }
  
  if (rooScore < 50) {
    recommendations.push('Genel performans düşük. Kampanya stratejisini gözden geçirin.')
  }
  
  if (exceededCount > 0) {
    recommendations.push(`🎉 ${exceededCount} hedef aşıldı! Bu başarılı stratejileri diğer hedeflere uygulayın.`)
  }
  
  if (recommendations.length === 0 && rooScore >= 75) {
    recommendations.push('Kampanya hedeflerinde iyi performans gösteriyorsunuz.')
  }

  return {
    campaignId,
    campaignName: campaign.name,
    rooScore,
    rawRooScore,
    totalWeight,
    objectiveCount: objectives.length,
    completedCount,
    exceededCount,
    atRiskCount,
    behindCount,
    hasOverAchieved: overAchievedObjectives.length > 0,
    overAchievedObjectives,
    totalOverAchievementBonus: Math.round(totalOverAchievementBonus * 100) / 100,
    performanceCategory,
    performanceLabel,
    objectives: objectiveDetails,
    calculatedAt: new Date('2024-10-15'),
    recommendations,
  }
}

/**
 * Kampanya hedeflerini getir
 */
export function getCampaignObjectives(campaignId: string): MockCampaignObjective[] {
  return getMockObjectivesByCampaign(campaignId)
}

/**
 * Hedef ilerleme geçmişini getir
 */
export function getObjectiveProgress(objectiveId: string): MockObjectiveProgress[] {
  return getMockProgressByObjective(objectiveId)
}

/**
 * Dashboard için ROO istatistikleri
 */
export function getROODashboardStats() {
  return getMockROODashboardStats()
}

/**
 * Tüm kampanyaları ROO skorlarıyla birlikte getir
 */
export function getCampaignsWithROO() {
  return getAllCampaignsWithROO()
}

/**
 * ROO ve ROI karşılaştırması
 */
export function getCampaignPerformanceComparison(campaignId: string): {
  campaignId: string
  campaignName: string
  roi: CampaignROIResult | null
  roo: ROOResult | null
  overallScore: number
  performanceInsight: string
} {
  const campaign = mockCampaigns.find(c => c.id === campaignId)
  
  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`)
  }

  let roi: CampaignROIResult | null = null
  let roo: ROOResult | null = null

  try {
    roi = calculateCampaignROI(campaignId)
  } catch {
    // ROI hesaplanamadı
  }

  try {
    roo = calculateROO(campaignId)
  } catch {
    // ROO hesaplanamadı
  }

  // Genel skor hesapla
  let overallScore = 0
  let insight = ''

  if (roi && roo) {
    const normalizedROI = Math.min(Math.max(roi.roi, 0), 200) / 2
    overallScore = (normalizedROI + roo.rooScore) / 2

    if (roi.roi > 100 && roo.rooScore >= 80) {
      insight = 'Kampanya hem finansal hem de hedef bazında mükemmel performans gösteriyor.'
    } else if (roi.roi > 100 && roo.rooScore < 60) {
      insight = 'Finansal performans iyi ancak hedefler geride. Hedef stratejisini gözden geçirin.'
    } else if (roi.roi < 50 && roo.rooScore >= 80) {
      insight = 'Hedefler iyi ancak finansal getiri düşük. Monetizasyon stratejisini iyileştirin.'
    } else {
      insight = 'Hem finansal hem de hedef performansında iyileştirme alanları var.'
    }
  } else if (roi) {
    overallScore = Math.min(Math.max(roi.roi, 0), 200) / 2
    insight = 'Sadece finansal metrikler mevcut. Hedef tanımlayarak kapsamlı analiz yapın.'
  } else if (roo) {
    overallScore = roo.rooScore
    insight = 'Sadece hedef metrikleri mevcut. Finansal veriler eklendiğinde tam analiz yapılabilir.'
  } else {
    insight = 'Yeterli veri yok. Kampanya metrikleri ve hedefleri tanımlayın.'
  }

  return {
    campaignId,
    campaignName: campaign.name,
    roi,
    roo,
    overallScore: Math.round(overallScore * 100) / 100,
    performanceInsight: insight,
  }
}

/**
 * Hedef tiplerine göre performans özeti
 */
export function getObjectiveTypePerformance(): Array<{
  type: MockObjectiveType
  typeLabel: string
  count: number
  avgAchievement: number
  completedCount: number
  atRiskCount: number
}> {
  const objectives = mockCampaignObjectives.filter(o => o.isActive)
  
  const typeGroups = objectives.reduce((acc, obj) => {
    if (!acc[obj.type]) {
      acc[obj.type] = {
        count: 0,
        totalAchievement: 0,
        completedCount: 0,
        atRiskCount: 0,
      }
    }
    acc[obj.type].count++
    acc[obj.type].totalAchievement += obj.achievementRate || 0
    if (obj.status === 'COMPLETED' || obj.status === 'EXCEEDED') {
      acc[obj.type].completedCount++
    }
    if (obj.status === 'AT_RISK' || obj.status === 'BEHIND') {
      acc[obj.type].atRiskCount++
    }
    return acc
  }, {} as Record<MockObjectiveType, { count: number; totalAchievement: number; completedCount: number; atRiskCount: number }>)

  return Object.entries(typeGroups).map(([type, data]) => ({
    type: type as MockObjectiveType,
    typeLabel: OBJECTIVE_TYPE_LABELS[type as MockObjectiveType],
    count: data.count,
    avgAchievement: Math.round(data.totalAchievement / data.count),
    completedCount: data.completedCount,
    atRiskCount: data.atRiskCount,
  }))
}

/**
 * Risk altındaki hedefleri getir
 */
export function getAtRiskObjectives(): Array<{
  objective: MockCampaignObjective
  campaign: typeof mockCampaigns[0]
  daysRemaining: number
  progressTrend: 'improving' | 'declining' | 'stable'
}> {
  const atRiskObjectives = mockCampaignObjectives.filter(
    o => o.isActive && (o.status === 'AT_RISK' || o.status === 'BEHIND')
  )

  return atRiskObjectives.map(obj => {
    const campaign = mockCampaigns.find(c => c.id === obj.campaignId)!
    const progress = getMockProgressByObjective(obj.id)
    
    // Kalan gün hesapla
    const endDate = obj.endDate || campaign.endDate
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    
    // İlerleme trendi belirle
    let progressTrend: 'improving' | 'declining' | 'stable' = 'stable'
    if (progress.length >= 2) {
      const lastTwo = progress.slice(-2)
      const recentDelta = (lastTwo[1]?.delta || 0) - (lastTwo[0]?.delta || 0)
      if (recentDelta > 0) progressTrend = 'improving'
      else if (recentDelta < 0) progressTrend = 'declining'
    }

    return {
      objective: obj,
      campaign,
      daysRemaining,
      progressTrend,
    }
  }).sort((a, b) => a.daysRemaining - b.daysRemaining)
}

// ============================================================================
// ROI vs ROO DASHBOARD DATA
// ============================================================================

/**
 * ROI vs ROO Scatter Chart için veri hazırla
 */
export function getROIvsROOData(organizationId: string = 'org-1'): Array<{
  id: string
  name: string
  roi: number
  rooScore: number
  budgetTotal: number
  status: string
  objectiveCount: number
}> {
  const orgCampaigns = mockCampaigns.filter(c => c.organizationId === organizationId)
  
  return orgCampaigns.map(campaign => {
    const roi = calculateCampaignROI(campaign.id)
    const roo = calculateROO(campaign.id)
    
    return {
      id: campaign.id,
      name: campaign.name,
      roi: roi?.roi || 0,
      rooScore: roo.rooScore,
      budgetTotal: campaign.budgetTotal,
      status: campaign.status,
      objectiveCount: roo.objectiveCount,
    }
  }).filter(c => c.objectiveCount > 0) // Sadece hedefi olan kampanyalar
}

/**
 * Kampanyaları ROO detaylarıyla birlikte getir (Progress List için)
 */
export function getCampaignsWithROODetails(organizationId: string = 'org-1'): Array<{
  id: string
  name: string
  status: string
  rooScore: number
  rawRooScore: number
  objectives: Array<{
    id: string
    name: string
    type: MockObjectiveType
    targetValue: number
    currentValue: number
    achievementRate: number
    normalizedRate: number
    weight: number
    status: MockObjectiveStatus
    unit: string
    statusLabel: string
    typeLabel: string
    isOverAchieved: boolean
    overAchievementRate: number
  }>
}> {
  const orgCampaigns = mockCampaigns.filter(c => c.organizationId === organizationId)
  
  return orgCampaigns.map(campaign => {
    const roo = calculateROO(campaign.id)
    
    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      rooScore: roo.rooScore,
      rawRooScore: roo.rawRooScore,
      objectives: roo.objectives.map(obj => ({
        id: obj.id,
        name: obj.name,
        type: obj.type,
        targetValue: obj.targetValue,
        currentValue: obj.currentValue,
        achievementRate: obj.achievementRate,
        normalizedRate: obj.normalizedRate,
        weight: obj.weight,
        status: obj.status,
        unit: obj.unit,
        statusLabel: obj.statusLabel,
        typeLabel: obj.typeLabel,
        isOverAchieved: obj.isOverAchieved,
        overAchievementRate: obj.overAchievementRate,
      }))
    }
  }).filter(c => c.objectives.length > 0) // Sadece hedefi olan kampanyalar
}

/**
 * ROO Dashboard özet istatistikleri
 */
export function getROOSummaryStats(organizationId: string = 'org-1'): {
  totalCampaignsWithObjectives: number
  totalObjectives: number
  avgRooScore: number
  completedObjectives: number
  exceededObjectives: number
  atRiskObjectives: number
  behindObjectives: number
  notStartedObjectives: number
  quadrantDistribution: {
    star: number      // Yüksek ROI + Yüksek ROO
    moneyOnly: number // Yüksek ROI + Düşük ROO
    strategic: number // Düşük ROI + Yüksek ROO
    needsWork: number // Düşük ROI + Düşük ROO
  }
} {
  const roiRooData = getROIvsROOData(organizationId)
  const campaignsWithROO = getCampaignsWithROODetails(organizationId)
  
  const allObjectives = campaignsWithROO.flatMap(c => c.objectives)
  
  // Quadrant dağılımı
  const quadrantDistribution = {
    star: 0,
    moneyOnly: 0,
    strategic: 0,
    needsWork: 0,
  }
  
  roiRooData.forEach(d => {
    if (d.roi >= 100 && d.rooScore >= 75) quadrantDistribution.star++
    else if (d.roi >= 100 && d.rooScore < 75) quadrantDistribution.moneyOnly++
    else if (d.roi < 100 && d.rooScore >= 75) quadrantDistribution.strategic++
    else quadrantDistribution.needsWork++
  })
  
  return {
    totalCampaignsWithObjectives: campaignsWithROO.length,
    totalObjectives: allObjectives.length,
    avgRooScore: campaignsWithROO.length > 0
      ? Math.round(campaignsWithROO.reduce((sum, c) => sum + c.rooScore, 0) / campaignsWithROO.length * 100) / 100
      : 0,
    completedObjectives: allObjectives.filter(o => o.status === 'COMPLETED').length,
    exceededObjectives: allObjectives.filter(o => o.status === 'EXCEEDED' || o.isOverAchieved).length,
    atRiskObjectives: allObjectives.filter(o => o.status === 'AT_RISK').length,
    behindObjectives: allObjectives.filter(o => o.status === 'BEHIND').length,
    notStartedObjectives: allObjectives.filter(o => o.status === 'NOT_STARTED').length,
    quadrantDistribution,
  }
}
