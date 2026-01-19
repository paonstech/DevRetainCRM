/**
 * Analytics Service - DevRetain CRM
 * 
 * Ekonometrik hesaplamalar için merkezi analitik motoru.
 * ROI, RFM Segmentasyonu ve LTV (Customer Lifetime Value) hesaplamaları.
 */

import { prisma } from './prisma'

// ============================================================================
// CONSTANTS (Prisma enum eşdeğerleri)
// ============================================================================

export const RFMSegment = {
  CHAMPIONS: 'CHAMPIONS',
  LOYAL_CUSTOMERS: 'LOYAL_CUSTOMERS',
  POTENTIAL_LOYALIST: 'POTENTIAL_LOYALIST',
  NEW_CUSTOMERS: 'NEW_CUSTOMERS',
  PROMISING: 'PROMISING',
  NEED_ATTENTION: 'NEED_ATTENTION',
  ABOUT_TO_SLEEP: 'ABOUT_TO_SLEEP',
  AT_RISK: 'AT_RISK',
  CANT_LOSE_THEM: 'CANT_LOSE_THEM',
  HIBERNATING: 'HIBERNATING',
  LOST: 'LOST',
} as const

export type RFMSegmentType = typeof RFMSegment[keyof typeof RFMSegment]

export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const

export const TransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED',
} as const

export const TransactionCategory = {
  AD_SPEND: 'AD_SPEND',
  SPONSORSHIP_FEE: 'SPONSORSHIP_FEE',
  COMMISSION: 'COMMISSION',
  BONUS: 'BONUS',
  REFUND: 'REFUND',
  PLATFORM_FEE: 'PLATFORM_FEE',
  OTHER: 'OTHER',
} as const

// ============================================================================
// TYPES
// ============================================================================

export type ROIResult = {
  roi: number                    // ROI yüzdesi
  gain: number                   // Toplam kazanç
  cost: number                   // Toplam maliyet
  netProfit: number              // Net kar
  isPositive: boolean            // Karlı mı?
  interpretation: string         // Yorumlama
}

export type RFMResult = {
  sponsorId: string
  recencyScore: number           // 1-5
  frequencyScore: number         // 1-5
  monetaryScore: number          // 1-5
  rfmScore: number               // Birleşik skor (ör: 545)
  segment: RFMSegmentType
  segmentLabel: string           // Türkçe segment adı
  
  // Ham değerler
  daysSinceLastTransaction: number
  transactionCount: number
  totalMonetary: number
  averageMonetary: number
  
  // Öneriler
  recommendations: string[]
}

export type LTVResult = {
  sponsorId: string
  ltv: number                    // Yaşam boyu değer (TRY)
  
  // Bileşenler
  averageTransactionValue: number
  purchaseFrequency: number      // Yıllık işlem sayısı
  customerLifespan: number       // Tahmini müşteri ömrü (yıl)
  churnRate: number              // Kayıp oranı (0-1)
  retentionRate: number          // Tutma oranı (0-1)
  
  // Segmentasyon
  ltvSegment: 'HIGH' | 'MEDIUM' | 'LOW'
  percentile: number             // Tüm sponsorlar arasındaki yüzdelik dilim
  
  // Tahminler
  projectedRevenue12Months: number
  projectedRevenue24Months: number
  
  interpretation: string
}

export type CampaignROIResult = {
  campaignId: string
  campaignName: string
  roi: number
  
  // Gelirler
  totalRevenue: number
  sponsorshipIncome: number
  otherIncome: number
  
  // Maliyetler
  totalCost: number
  adSpend: number
  platformFees: number
  otherExpenses: number
  
  // Metrikler
  costPerClick: number | null
  costPerConversion: number | null
  costPerMille: number | null    // CPM (1000 gösterim başına maliyet)
  conversionRate: number | null
  
  // Performans
  impressions: number
  clicks: number
  conversions: number
  
  interpretation: string
}

// Generic transaction type for internal use
type TransactionRecord = {
  id: string
  type: string
  category: string
  status: string
  amount: number | { toNumber(): number }
  transactionDate: Date
  sponsorId: string | null
}

// Generic metric type for internal use
type MetricRecord = {
  id: string
  type: string
  source: string
  value: number
}

// Generic sponsor type for internal use
type SponsorRecord = {
  id: string
  companyName: string
  organizationId: string
  isActive: boolean
}

// Generic campaign sponsor type
type CampaignSponsorRecord = {
  contributionAmount: number | { toNumber(): number }
  campaign: {
    id: string
    name: string
  }
}

export type SponsorAnalytics = {
  sponsor: SponsorRecord
  rfm: RFMResult
  ltv: LTVResult
  totalTransactions: number
  campaignCount: number
  averageCampaignValue: number
  firstTransactionDate: Date | null
  lastTransactionDate: Date | null
  relationshipDuration: number   // Gün cinsinden
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Decimal veya number değerini number'a çevirir
 */
function toNumber(value: number | { toNumber(): number } | null | undefined): number {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'object' && 'toNumber' in value) return value.toNumber()
  return Number(value) || 0
}

/**
 * Para birimi formatla
 */
function formatCurrency(amount: number, currency: string = 'TRY'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
  }).format(amount)
}

// ============================================================================
// ROI CALCULATIONS
// ============================================================================

/**
 * Basit ROI (Return on Investment) hesaplaması
 * 
 * Formül: ROI = ((Kazanç - Maliyet) / Maliyet) * 100
 * 
 * @param gain - Toplam kazanç/gelir
 * @param cost - Toplam maliyet/yatırım
 * @returns ROI sonucu ve yorumu
 */
export function calculateROI(gain: number, cost: number): ROIResult {
  // Edge case: Maliyet sıfır veya negatif
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

/**
 * Kampanya bazlı detaylı ROI hesaplaması
 * 
 * @param campaignId - Kampanya ID'si
 * @returns Detaylı kampanya ROI analizi
 */
export async function calculateCampaignROI(campaignId: string): Promise<CampaignROIResult | null> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      transactions: true,
      metrics: true,
    },
  })

  if (!campaign) return null

  const transactions = campaign.transactions as TransactionRecord[]
  const metrics = campaign.metrics as MetricRecord[]

  // Gelirleri hesapla
  const incomeTransactions = transactions.filter(
    (t: TransactionRecord) => t.type === TransactionType.INCOME && t.status === TransactionStatus.COMPLETED
  )
  const totalRevenue = incomeTransactions.reduce(
    (sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 
    0
  )
  const sponsorshipIncome = incomeTransactions
    .filter((t: TransactionRecord) => t.category === TransactionCategory.SPONSORSHIP_FEE)
    .reduce((sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 0)
  const otherIncome = totalRevenue - sponsorshipIncome

  // Maliyetleri hesapla
  const expenseTransactions = transactions.filter(
    (t: TransactionRecord) => t.type === TransactionType.EXPENSE && t.status === TransactionStatus.COMPLETED
  )
  const totalCost = expenseTransactions.reduce(
    (sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 
    0
  )
  const adSpend = expenseTransactions
    .filter((t: TransactionRecord) => t.category === TransactionCategory.AD_SPEND)
    .reduce((sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 0)
  const platformFees = expenseTransactions
    .filter((t: TransactionRecord) => t.category === TransactionCategory.PLATFORM_FEE)
    .reduce((sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 0)
  const otherExpenses = totalCost - adSpend - platformFees

  // Metrikleri topla
  const impressions = metrics
    .filter((m: MetricRecord) => m.type === 'IMPRESSION' || m.type === 'VIEW')
    .reduce((sum: number, m: MetricRecord) => sum + m.value, 0)
  const clicks = metrics
    .filter((m: MetricRecord) => m.type === 'CLICK')
    .reduce((sum: number, m: MetricRecord) => sum + m.value, 0)
  const conversions = metrics
    .filter((m: MetricRecord) => m.type === 'CONVERSION')
    .reduce((sum: number, m: MetricRecord) => sum + m.value, 0)

  // ROI hesapla
  const roiResult = calculateROI(totalRevenue, totalCost)

  // Performans metrikleri
  const costPerClick = clicks > 0 ? totalCost / clicks : null
  const costPerConversion = conversions > 0 ? totalCost / conversions : null
  const costPerMille = impressions > 0 ? (totalCost / impressions) * 1000 : null
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : null

  // Yorumlama
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

/**
 * RFM (Recency, Frequency, Monetary) Segmentasyonu
 * 
 * Ekonometrik müşteri segmentasyonu için altın standart.
 * Her boyut için 1-5 arası skorlama (5 en iyi).
 * 
 * Recency: Son işlemden bu yana geçen süre (düşük = iyi)
 * Frequency: İşlem sıklığı (yüksek = iyi)
 * Monetary: Toplam harcama (yüksek = iyi)
 * 
 * @param sponsorId - Sponsor ID'si
 * @param periodDays - Analiz periyodu (varsayılan: 365 gün)
 * @returns RFM analiz sonucu
 */
export async function calculateRFM(
  sponsorId: string, 
  periodDays: number = 365
): Promise<RFMResult | null> {
  const sponsor = await prisma.sponsor.findUnique({
    where: { id: sponsorId },
  })

  if (!sponsor) return null

  const periodStart = new Date()
  periodStart.setDate(periodStart.getDate() - periodDays)

  // Sponsor'un tamamlanmış gelir işlemlerini çek
  const transactions = await prisma.transaction.findMany({
    where: {
      sponsorId,
      type: TransactionType.INCOME,
      status: TransactionStatus.COMPLETED,
      transactionDate: {
        gte: periodStart,
      },
    },
    orderBy: {
      transactionDate: 'desc',
    },
  }) as TransactionRecord[]

  // Aynı organizasyondaki tüm sponsorların verilerini çek (karşılaştırma için)
  const allSponsorsData = await prisma.transaction.groupBy({
    by: ['sponsorId'],
    where: {
      organizationId: sponsor.organizationId,
      type: TransactionType.INCOME,
      status: TransactionStatus.COMPLETED,
      transactionDate: {
        gte: periodStart,
      },
    },
    _count: {
      id: true,
    },
    _sum: {
      amount: true,
    },
    _max: {
      transactionDate: true,
    },
  })

  // Ham değerleri hesapla
  const lastTransactionDate = transactions[0]?.transactionDate || null
  const daysSinceLastTransaction = lastTransactionDate
    ? Math.floor((Date.now() - lastTransactionDate.getTime()) / (1000 * 60 * 60 * 24))
    : periodDays
  const transactionCount = transactions.length
  const totalMonetary = transactions.reduce((sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 0)
  const averageMonetary = transactionCount > 0 ? totalMonetary / transactionCount : 0

  // Quintile (beşlik dilim) hesaplaması için tüm değerleri topla
  type SponsorAggregation = {
    sponsorId: string
    _count: { id: number }
    _sum: { amount: number | { toNumber(): number } | null }
    _max: { transactionDate: Date | null }
  }
  
  const recencyValues = allSponsorsData.map((s: SponsorAggregation) => {
    const lastDate = s._max.transactionDate
    return lastDate 
      ? Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      : periodDays
  })
  const frequencyValues = allSponsorsData.map((s: SponsorAggregation) => s._count.id)
  const monetaryValues = allSponsorsData.map((s: SponsorAggregation) => toNumber(s._sum.amount))

  // Skorları hesapla (quintile bazlı)
  const recencyScore = calculateQuintileScore(daysSinceLastTransaction, recencyValues, true) // Düşük = iyi
  const frequencyScore = calculateQuintileScore(transactionCount, frequencyValues, false)
  const monetaryScore = calculateQuintileScore(totalMonetary, monetaryValues, false)

  // Birleşik skor
  const rfmScore = recencyScore * 100 + frequencyScore * 10 + monetaryScore

  // Segment belirleme
  const segment = determineRFMSegment(recencyScore, frequencyScore, monetaryScore)
  const segmentLabel = getRFMSegmentLabel(segment)

  // Öneriler
  const recommendations = generateRFMRecommendations(segment, {
    recencyScore,
    frequencyScore,
    monetaryScore,
    daysSinceLastTransaction,
    transactionCount,
    totalMonetary,
  })

  return {
    sponsorId,
    recencyScore,
    frequencyScore,
    monetaryScore,
    rfmScore,
    segment,
    segmentLabel,
    daysSinceLastTransaction,
    transactionCount,
    totalMonetary,
    averageMonetary: Math.round(averageMonetary * 100) / 100,
    recommendations,
  }
}

/**
 * Quintile (beşlik dilim) bazlı skor hesaplama
 * 
 * @param value - Skorlanacak değer
 * @param allValues - Karşılaştırma için tüm değerler
 * @param inverse - Düşük değer iyi mi? (Recency için true)
 * @returns 1-5 arası skor
 */
function calculateQuintileScore(
  value: number, 
  allValues: number[], 
  inverse: boolean = false
): number {
  if (allValues.length === 0) return 3 // Varsayılan orta skor

  const sorted = [...allValues].sort((a, b) => a - b)
  const percentile = sorted.filter(v => v <= value).length / sorted.length

  let score: number
  if (percentile <= 0.2) score = inverse ? 5 : 1
  else if (percentile <= 0.4) score = inverse ? 4 : 2
  else if (percentile <= 0.6) score = 3
  else if (percentile <= 0.8) score = inverse ? 2 : 4
  else score = inverse ? 1 : 5

  return score
}

/**
 * RFM skorlarına göre segment belirleme
 */
function determineRFMSegment(r: number, f: number, m: number): RFMSegmentType {
  // Champions: En iyi müşteriler
  if (r >= 4 && f >= 4 && m >= 4) return RFMSegment.CHAMPIONS
  
  // Loyal Customers: Sadık, düzenli alışveriş yapanlar
  if (r >= 3 && f >= 4 && m >= 4) return RFMSegment.LOYAL_CUSTOMERS
  if (r >= 4 && f >= 3 && m >= 4) return RFMSegment.LOYAL_CUSTOMERS
  
  // Potential Loyalist: Sadık olma potansiyeli yüksek
  if (r >= 4 && f >= 2 && m >= 2) return RFMSegment.POTENTIAL_LOYALIST
  if (r >= 5 && f >= 1) return RFMSegment.POTENTIAL_LOYALIST
  
  // New Customers: Yeni müşteriler
  if (r >= 4 && f <= 2 && m <= 2) return RFMSegment.NEW_CUSTOMERS
  
  // Promising: Umut vaat eden
  if (r >= 4 && f >= 2) return RFMSegment.PROMISING
  
  // Need Attention: İlgi gerektiren
  if (r === 3 && f === 3 && m >= 3) return RFMSegment.NEED_ATTENTION
  if (r >= 2 && r <= 3 && f >= 2 && f <= 3 && m >= 2) return RFMSegment.NEED_ATTENTION
  
  // About to Sleep: Uykuya dalmak üzere
  if (r === 2 && f >= 2 && f <= 3) return RFMSegment.ABOUT_TO_SLEEP
  if (r <= 2 && f <= 3 && m >= 2 && m <= 4) return RFMSegment.ABOUT_TO_SLEEP
  
  // At Risk: Risk altında
  if (r <= 2 && f >= 3 && m >= 3) return RFMSegment.AT_RISK
  
  // Can't Lose Them: Kaybetmemeli
  if (r <= 2 && f >= 4 && m >= 4) return RFMSegment.CANT_LOSE_THEM
  if (r === 1 && f >= 4) return RFMSegment.CANT_LOSE_THEM
  
  // Hibernating: Uzun süredir inaktif
  if (r <= 2 && f <= 2 && m >= 2) return RFMSegment.HIBERNATING
  
  // Lost: Kaybedilmiş
  if (r === 1 && f === 1 && m === 1) return RFMSegment.LOST
  if (r === 1 && f <= 2 && m <= 2) return RFMSegment.LOST
  
  return RFMSegment.NEED_ATTENTION
}

/**
 * RFM segment Türkçe etiketleri
 */
function getRFMSegmentLabel(segment: RFMSegmentType): string {
  const labels: Record<RFMSegmentType, string> = {
    [RFMSegment.CHAMPIONS]: 'Şampiyonlar',
    [RFMSegment.LOYAL_CUSTOMERS]: 'Sadık Müşteriler',
    [RFMSegment.POTENTIAL_LOYALIST]: 'Potansiyel Sadıklar',
    [RFMSegment.NEW_CUSTOMERS]: 'Yeni Müşteriler',
    [RFMSegment.PROMISING]: 'Umut Vaat Edenler',
    [RFMSegment.NEED_ATTENTION]: 'İlgi Gerektirenler',
    [RFMSegment.ABOUT_TO_SLEEP]: 'Uykuya Dalanlar',
    [RFMSegment.AT_RISK]: 'Risk Altındakiler',
    [RFMSegment.CANT_LOSE_THEM]: 'Kaybetmemeliyiz',
    [RFMSegment.HIBERNATING]: 'Kış Uykusundakiler',
    [RFMSegment.LOST]: 'Kayıp Müşteriler',
  }
  return labels[segment]
}

/**
 * RFM segmentine göre aksiyon önerileri
 */
function generateRFMRecommendations(
  segment: RFMSegmentType,
  _data: {
    recencyScore: number
    frequencyScore: number
    monetaryScore: number
    daysSinceLastTransaction: number
    transactionCount: number
    totalMonetary: number
  }
): string[] {
  const recommendations: Record<RFMSegmentType, string[]> = {
    [RFMSegment.CHAMPIONS]: [
      'VIP programına dahil edin',
      'Özel erken erişim fırsatları sunun',
      'Referans programı için teşvik edin',
      'Kişiselleştirilmiş premium teklifler hazırlayın',
    ],
    [RFMSegment.LOYAL_CUSTOMERS]: [
      'Sadakat ödülleri sunun',
      'Üst segment kampanyalara davet edin',
      'Düzenli iletişimi sürdürün',
      'Cross-sell fırsatları değerlendirin',
    ],
    [RFMSegment.POTENTIAL_LOYALIST]: [
      'Üyelik/sadakat programı önerin',
      'İlk büyük kampanya için özel teklif sunun',
      'Düzenli takip aramaları yapın',
      'Başarı hikayelerini paylaşın',
    ],
    [RFMSegment.NEW_CUSTOMERS]: [
      'Hoş geldin kampanyası başlatın',
      'Onboarding sürecini optimize edin',
      'İlk 90 günde yakın takip yapın',
      'Küçük ama hızlı kazanımlar sağlayın',
    ],
    [RFMSegment.PROMISING]: [
      'Marka bilinirliği kampanyaları önerin',
      'Başarılı vaka çalışmaları paylaşın',
      'Deneme kampanyası fırsatı sunun',
      'Düzenli değer içerikleri gönderin',
    ],
    [RFMSegment.NEED_ATTENTION]: [
      'Kişiselleştirilmiş yeniden aktivasyon kampanyası',
      'Sınırlı süreli özel teklif sunun',
      'Geri bildirim toplantısı talep edin',
      'Yeni hizmet/ürünleri tanıtın',
    ],
    [RFMSegment.ABOUT_TO_SLEEP]: [
      'Acil yeniden aktivasyon kampanyası',
      '"Sizi özledik" mesajı gönderin',
      'Özel indirim/bonus teklif edin',
      'Telefon ile kişisel iletişim kurun',
    ],
    [RFMSegment.AT_RISK]: [
      'Üst düzey yönetici araması yapın',
      'Sorun analizi için görüşme talep edin',
      'Özel kurtarma paketi hazırlayın',
      'Rakip analizi yapın',
    ],
    [RFMSegment.CANT_LOSE_THEM]: [
      'ACİL: CEO seviyesinde iletişim kurun',
      'Özel müşteri başarı yöneticisi atayın',
      'Stratejik ortaklık teklifi sunun',
      'Kaybetme maliyetini hesaplayın ve yatırım yapın',
    ],
    [RFMSegment.HIBERNATING]: [
      'Win-back kampanyası başlatın',
      'Yeni ürün/hizmet duyuruları gönderin',
      'Düşük maliyetli yeniden başlangıç paketi sunun',
      'Sektör trendleri hakkında içerik paylaşın',
    ],
    [RFMSegment.LOST]: [
      'Kayıp analizi yapın ve öğrenin',
      'Uzun vadeli nurturing listesine ekleyin',
      'Yılda 1-2 kez değer içeriği gönderin',
      'Yeni ürün lansmanlarında hatırlatın',
    ],
  }

  return recommendations[segment] || []
}

/**
 * Tüm sponsorlar için toplu RFM hesaplama ve veritabanına kaydetme
 */
export async function calculateAndSaveAllRFMScores(
  organizationId: string,
  periodDays: number = 365
): Promise<{ updated: number; errors: number }> {
  const sponsors = await prisma.sponsor.findMany({
    where: { organizationId, isActive: true },
  })

  let updated = 0
  let errors = 0

  const periodStart = new Date()
  periodStart.setDate(periodStart.getDate() - periodDays)
  const periodEnd = new Date()

  for (const sponsor of sponsors) {
    try {
      const rfmResult = await calculateRFM(sponsor.id, periodDays)
      
      if (rfmResult) {
        // Önceki skoru bul
        const previousScore = await prisma.rFMScore.findFirst({
          where: { sponsorId: sponsor.id },
          orderBy: { calculatedAt: 'desc' },
        })

        // Yeni skoru kaydet
        await prisma.rFMScore.create({
          data: {
            sponsorId: sponsor.id,
            recencyScore: rfmResult.recencyScore,
            frequencyScore: rfmResult.frequencyScore,
            monetaryScore: rfmResult.monetaryScore,
            rfmScore: rfmResult.rfmScore,
            segment: rfmResult.segment,
            lastTransactionDate: rfmResult.daysSinceLastTransaction < periodDays
              ? new Date(Date.now() - rfmResult.daysSinceLastTransaction * 24 * 60 * 60 * 1000)
              : null,
            transactionCount: rfmResult.transactionCount,
            totalMonetary: rfmResult.totalMonetary,
            averageMonetary: rfmResult.averageMonetary,
            periodStart,
            periodEnd,
            previousRFMScore: previousScore?.rfmScore,
            previousSegment: previousScore?.segment,
            scoreChange: previousScore 
              ? rfmResult.rfmScore - previousScore.rfmScore 
              : null,
          },
        })
        updated++
      }
    } catch (error) {
      console.error(`RFM calculation failed for sponsor ${sponsor.id}:`, error)
      errors++
    }
  }

  return { updated, errors }
}

// ============================================================================
// LTV (CUSTOMER LIFETIME VALUE) CALCULATIONS
// ============================================================================

/**
 * LTV (Customer Lifetime Value) - Müşteri Yaşam Boyu Değeri
 * 
 * Ekonometrik formül:
 * LTV = (Ortalama İşlem Değeri × Yıllık İşlem Sayısı × Müşteri Ömrü)
 * 
 * Alternatif (Churn bazlı):
 * LTV = (Ortalama Aylık Gelir × Brüt Marj) / Churn Oranı
 * 
 * @param sponsorId - Sponsor ID'si
 * @returns LTV analiz sonucu
 */
export async function calculateLTV(sponsorId: string): Promise<LTVResult | null> {
  const sponsor = await prisma.sponsor.findUnique({
    where: { id: sponsorId },
    include: {
      campaigns: {
        include: {
          campaign: true,
        },
      },
    },
  })

  if (!sponsor) return null

  // Tüm gelir işlemlerini çek
  const transactions = await prisma.transaction.findMany({
    where: {
      sponsorId,
      type: TransactionType.INCOME,
      status: TransactionStatus.COMPLETED,
    },
    orderBy: {
      transactionDate: 'asc',
    },
  }) as TransactionRecord[]

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

  // Temel metrikler
  const totalRevenue = transactions.reduce((sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 0)
  const transactionCount = transactions.length
  const averageTransactionValue = totalRevenue / transactionCount

  // Zaman bazlı hesaplamalar
  const firstTransaction = transactions[0].transactionDate
  const lastTransaction = transactions[transactions.length - 1].transactionDate
  const daysSinceFirst = Math.floor(
    (Date.now() - firstTransaction.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Yıllık işlem sıklığı
  const yearsActive = Math.max(daysSinceFirst / 365, 0.1) // En az 0.1 yıl
  const purchaseFrequency = transactionCount / yearsActive

  // Churn oranı tahmini
  // Basit yaklaşım: Son 90 günde işlem yoksa churn riski artıyor
  const daysSinceLastTransaction = Math.floor(
    (Date.now() - lastTransaction.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  // Churn oranı: İşlem sıklığına ve son işlem tarihine göre
  let churnRate: number
  if (daysSinceLastTransaction <= 30) {
    churnRate = 0.05 // %5
  } else if (daysSinceLastTransaction <= 90) {
    churnRate = 0.15 // %15
  } else if (daysSinceLastTransaction <= 180) {
    churnRate = 0.30 // %30
  } else if (daysSinceLastTransaction <= 365) {
    churnRate = 0.50 // %50
  } else {
    churnRate = 0.75 // %75
  }

  // İşlem sıklığına göre churn oranını ayarla
  if (purchaseFrequency >= 4) {
    churnRate *= 0.7 // Sık işlem yapanlar daha az churn
  } else if (purchaseFrequency >= 2) {
    churnRate *= 0.85
  }

  churnRate = Math.min(churnRate, 0.95) // Maksimum %95
  const retentionRate = 1 - churnRate

  // Müşteri ömrü tahmini (yıl)
  // Formül: 1 / Churn Rate
  const customerLifespan = churnRate > 0 ? 1 / churnRate : 10 // Maksimum 10 yıl

  // LTV Hesaplama
  // Basit LTV = Ortalama İşlem × Yıllık Sıklık × Tahmini Ömür
  const ltv = averageTransactionValue * purchaseFrequency * customerLifespan

  // Gelecek projeksiyonları
  const monthlyRevenue = (totalRevenue / Math.max(daysSinceFirst, 30)) * 30
  const projectedRevenue12Months = monthlyRevenue * 12 * retentionRate
  const projectedRevenue24Months = monthlyRevenue * 24 * Math.pow(retentionRate, 2)

  // Tüm sponsorların LTV'sini hesapla (percentile için)
  const allSponsorsLTV = await calculateAllSponsorsLTV(sponsor.organizationId)
  const sortedLTVs = allSponsorsLTV.sort((a, b) => a - b)
  const percentile = sortedLTVs.length > 0
    ? (sortedLTVs.filter(v => v <= ltv).length / sortedLTVs.length) * 100
    : 50

  // Segment belirleme
  let ltvSegment: 'HIGH' | 'MEDIUM' | 'LOW'
  if (percentile >= 75) {
    ltvSegment = 'HIGH'
  } else if (percentile >= 40) {
    ltvSegment = 'MEDIUM'
  } else {
    ltvSegment = 'LOW'
  }

  // Yorumlama
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

/**
 * Organizasyondaki tüm sponsorların LTV değerlerini hesapla
 */
async function calculateAllSponsorsLTV(organizationId: string): Promise<number[]> {
  const sponsors = await prisma.sponsor.findMany({
    where: { organizationId, isActive: true },
    select: { id: true },
  })

  const ltvValues: number[] = []

  for (const sponsor of sponsors) {
    const transactions = await prisma.transaction.findMany({
      where: {
        sponsorId: sponsor.id,
        type: TransactionType.INCOME,
        status: TransactionStatus.COMPLETED,
      },
    }) as TransactionRecord[]

    if (transactions.length > 0) {
      const total = transactions.reduce((sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 0)
      const avg = total / transactions.length
      const firstDate = transactions.reduce(
        (min: Date, t: TransactionRecord) => t.transactionDate < min ? t.transactionDate : min,
        transactions[0].transactionDate
      )
      const years = Math.max(
        (Date.now() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365),
        0.1
      )
      const frequency = transactions.length / years
      // Basit LTV tahmini
      const estimatedLTV = avg * frequency * 3 // 3 yıl varsayılan ömür
      ltvValues.push(estimatedLTV)
    }
  }

  return ltvValues
}

// ============================================================================
// COMPREHENSIVE SPONSOR ANALYTICS
// ============================================================================

/**
 * Sponsor için kapsamlı analitik raporu
 */
export async function getSponsorAnalytics(sponsorId: string): Promise<SponsorAnalytics | null> {
  const sponsor = await prisma.sponsor.findUnique({
    where: { id: sponsorId },
    include: {
      campaigns: {
        include: {
          campaign: true,
        },
      },
    },
  })

  if (!sponsor) return null

  // RFM ve LTV hesapla
  const [rfm, ltv] = await Promise.all([
    calculateRFM(sponsorId),
    calculateLTV(sponsorId),
  ])

  if (!rfm || !ltv) return null

  // İşlem istatistikleri
  const transactions = await prisma.transaction.findMany({
    where: {
      sponsorId,
      type: TransactionType.INCOME,
      status: TransactionStatus.COMPLETED,
    },
    orderBy: {
      transactionDate: 'asc',
    },
  }) as TransactionRecord[]

  const firstTransactionDate = transactions[0]?.transactionDate || null
  const lastTransactionDate = transactions[transactions.length - 1]?.transactionDate || null
  const relationshipDuration = firstTransactionDate
    ? Math.floor((Date.now() - firstTransactionDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Kampanya istatistikleri
  const campaigns = sponsor.campaigns as CampaignSponsorRecord[]
  const campaignCount = campaigns.length
  const totalCampaignValue = campaigns.reduce(
    (sum: number, cs: CampaignSponsorRecord) => sum + toNumber(cs.contributionAmount),
    0
  )
  const averageCampaignValue = campaignCount > 0 ? totalCampaignValue / campaignCount : 0

  return {
    sponsor: sponsor as SponsorRecord,
    rfm,
    ltv,
    totalTransactions: transactions.length,
    campaignCount,
    averageCampaignValue: Math.round(averageCampaignValue * 100) / 100,
    firstTransactionDate,
    lastTransactionDate,
    relationshipDuration,
  }
}

// ============================================================================
// ORGANIZATION-LEVEL ANALYTICS
// ============================================================================

export type OrganizationAnalytics = {
  totalSponsors: number
  activeSponsors: number
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  averageROI: number
  
  // RFM Dağılımı
  rfmDistribution: {
    segment: RFMSegmentType
    label: string
    count: number
    percentage: number
    totalValue: number
  }[]
  
  // LTV Dağılımı
  ltvDistribution: {
    segment: 'HIGH' | 'MEDIUM' | 'LOW'
    count: number
    percentage: number
    totalLTV: number
  }[]
  
  // Trend
  monthlyTrend: {
    month: string
    revenue: number
    expenses: number
    newSponsors: number
  }[]
}

/**
 * Organizasyon seviyesinde analitik özet
 */
export async function getOrganizationAnalytics(
  organizationId: string,
  periodMonths: number = 12
): Promise<OrganizationAnalytics> {
  const periodStart = new Date()
  periodStart.setMonth(periodStart.getMonth() - periodMonths)

  // Sponsor sayıları
  const [totalSponsors, activeSponsors] = await Promise.all([
    prisma.sponsor.count({ where: { organizationId } }),
    prisma.sponsor.count({ where: { organizationId, isActive: true } }),
  ])

  // Gelir/Gider
  const transactions = await prisma.transaction.findMany({
    where: {
      organizationId,
      status: TransactionStatus.COMPLETED,
      transactionDate: { gte: periodStart },
    },
  }) as TransactionRecord[]

  const totalRevenue = transactions
    .filter((t: TransactionRecord) => t.type === TransactionType.INCOME)
    .reduce((sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 0)
  const totalExpenses = transactions
    .filter((t: TransactionRecord) => t.type === TransactionType.EXPENSE)
    .reduce((sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 0)
  const netIncome = totalRevenue - totalExpenses
  const averageROI = totalExpenses > 0 
    ? ((totalRevenue - totalExpenses) / totalExpenses) * 100 
    : 0

  // RFM Dağılımı
  const rfmScores = await prisma.rFMScore.findMany({
    where: {
      sponsor: { organizationId },
    },
    orderBy: { calculatedAt: 'desc' },
    distinct: ['sponsorId'],
    include: {
      sponsor: {
        include: {
          campaigns: true,
        },
      },
    },
  })

  type RFMScoreRecord = {
    segment: RFMSegmentType
    totalMonetary: number | { toNumber(): number }
  }

  const rfmGroups = new Map<RFMSegmentType, { count: number; totalValue: number }>()
  for (const score of rfmScores as RFMScoreRecord[]) {
    const existing = rfmGroups.get(score.segment) || { count: 0, totalValue: 0 }
    existing.count++
    existing.totalValue += toNumber(score.totalMonetary)
    rfmGroups.set(score.segment, existing)
  }

  const rfmDistribution = Array.from(rfmGroups.entries()).map(([segment, data]) => ({
    segment,
    label: getRFMSegmentLabel(segment),
    count: data.count,
    percentage: rfmScores.length > 0 ? (data.count / rfmScores.length) * 100 : 0,
    totalValue: data.totalValue,
  }))

  // LTV Dağılımı (basitleştirilmiş)
  const ltvDistribution: OrganizationAnalytics['ltvDistribution'] = [
    { segment: 'HIGH', count: 0, percentage: 0, totalLTV: 0 },
    { segment: 'MEDIUM', count: 0, percentage: 0, totalLTV: 0 },
    { segment: 'LOW', count: 0, percentage: 0, totalLTV: 0 },
  ]

  // Aylık trend
  const monthlyTrend: OrganizationAnalytics['monthlyTrend'] = []
  for (let i = periodMonths - 1; i >= 0; i--) {
    const monthStart = new Date()
    monthStart.setMonth(monthStart.getMonth() - i)
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    
    const monthEnd = new Date(monthStart)
    monthEnd.setMonth(monthEnd.getMonth() + 1)

    const monthTransactions = transactions.filter(
      (t: TransactionRecord) => t.transactionDate >= monthStart && t.transactionDate < monthEnd
    )

    const revenue = monthTransactions
      .filter((t: TransactionRecord) => t.type === TransactionType.INCOME)
      .reduce((sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 0)
    const expenses = monthTransactions
      .filter((t: TransactionRecord) => t.type === TransactionType.EXPENSE)
      .reduce((sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 0)

    const newSponsors = await prisma.sponsor.count({
      where: {
        organizationId,
        acquisitionDate: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
    })

    monthlyTrend.push({
      month: monthStart.toLocaleDateString('tr-TR', { year: 'numeric', month: 'short' }),
      revenue,
      expenses,
      newSponsors,
    })
  }

  return {
    totalSponsors,
    activeSponsors,
    totalRevenue,
    totalExpenses,
    netIncome,
    averageROI: Math.round(averageROI * 100) / 100,
    rfmDistribution,
    ltvDistribution,
    monthlyTrend,
  }
}

// ============================================================================
// COHORT ANALYSIS
// ============================================================================

export type CohortData = {
  cohort: string // YYYY-MM formatında
  sponsors: number
  retentionByMonth: number[] // 0-12 ay retention oranları
}

/**
 * Sponsor cohort analizi
 * Hangi dönemde kazanılan sponsorların ne kadar süre aktif kaldığını gösterir
 */
export async function getCohortAnalysis(
  organizationId: string,
  cohortMonths: number = 12
): Promise<CohortData[]> {
  const cohorts: CohortData[] = []

  for (let i = cohortMonths - 1; i >= 0; i--) {
    const cohortStart = new Date()
    cohortStart.setMonth(cohortStart.getMonth() - i)
    cohortStart.setDate(1)
    cohortStart.setHours(0, 0, 0, 0)

    const cohortEnd = new Date(cohortStart)
    cohortEnd.setMonth(cohortEnd.getMonth() + 1)

    // Bu cohort'taki sponsorları bul
    const cohortSponsors = await prisma.sponsor.findMany({
      where: {
        organizationId,
        acquisitionDate: {
          gte: cohortStart,
          lt: cohortEnd,
        },
      },
      select: { id: true },
    })

    if (cohortSponsors.length === 0) {
      cohorts.push({
        cohort: `${cohortStart.getFullYear()}-${String(cohortStart.getMonth() + 1).padStart(2, '0')}`,
        sponsors: 0,
        retentionByMonth: [],
      })
      continue
    }

    const sponsorIds = cohortSponsors.map((s: { id: string }) => s.id)
    const retentionByMonth: number[] = []

    // Her ay için retention hesapla
    for (let month = 0; month <= Math.min(i, 12); month++) {
      const checkStart = new Date(cohortStart)
      checkStart.setMonth(checkStart.getMonth() + month)
      
      const checkEnd = new Date(checkStart)
      checkEnd.setMonth(checkEnd.getMonth() + 1)

      // Bu ayda işlem yapan sponsorları say
      const activeSponsors = await prisma.transaction.groupBy({
        by: ['sponsorId'],
        where: {
          sponsorId: { in: sponsorIds },
          type: TransactionType.INCOME,
          status: TransactionStatus.COMPLETED,
          transactionDate: {
            gte: checkStart,
            lt: checkEnd,
          },
        },
      })

      const retentionRate = (activeSponsors.length / cohortSponsors.length) * 100
      retentionByMonth.push(Math.round(retentionRate * 10) / 10)
    }

    cohorts.push({
      cohort: `${cohortStart.getFullYear()}-${String(cohortStart.getMonth() + 1).padStart(2, '0')}`,
      sponsors: cohortSponsors.length,
      retentionByMonth,
    })
  }

  return cohorts
}

// ============================================================================
// FORECASTING
// ============================================================================

export type RevenueForecast = {
  month: string
  predictedRevenue: number
  lowerBound: number
  upperBound: number
  confidence: number
}

/**
 * Basit doğrusal regresyon ile gelir tahmini
 * 
 * @param organizationId - Organizasyon ID'si
 * @param forecastMonths - Kaç ay ilerisi tahmin edilsin
 * @returns Aylık gelir tahminleri
 */
export async function forecastRevenue(
  organizationId: string,
  forecastMonths: number = 6
): Promise<RevenueForecast[]> {
  // Son 12 ayın verilerini çek
  const historicalMonths = 12
  const monthlyRevenue: { month: number; revenue: number }[] = []

  for (let i = historicalMonths - 1; i >= 0; i--) {
    const monthStart = new Date()
    monthStart.setMonth(monthStart.getMonth() - i)
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const monthEnd = new Date(monthStart)
    monthEnd.setMonth(monthEnd.getMonth() + 1)

    const transactions = await prisma.transaction.findMany({
      where: {
        organizationId,
        type: TransactionType.INCOME,
        status: TransactionStatus.COMPLETED,
        transactionDate: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
    }) as TransactionRecord[]

    const revenue = transactions.reduce((sum: number, t: TransactionRecord) => sum + toNumber(t.amount), 0)
    monthlyRevenue.push({ month: historicalMonths - i, revenue })
  }

  // Basit doğrusal regresyon
  const n = monthlyRevenue.length
  const sumX = monthlyRevenue.reduce((sum, d) => sum + d.month, 0)
  const sumY = monthlyRevenue.reduce((sum, d) => sum + d.revenue, 0)
  const sumXY = monthlyRevenue.reduce((sum, d) => sum + d.month * d.revenue, 0)
  const sumX2 = monthlyRevenue.reduce((sum, d) => sum + d.month * d.month, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Standart sapma hesapla (güven aralığı için)
  const predictions = monthlyRevenue.map(d => intercept + slope * d.month)
  const residuals = monthlyRevenue.map((d, i) => d.revenue - predictions[i])
  const stdDev = Math.sqrt(
    residuals.reduce((sum, r) => sum + r * r, 0) / (n - 2)
  )

  // Tahminleri oluştur
  const forecasts: RevenueForecast[] = []
  for (let i = 1; i <= forecastMonths; i++) {
    const futureMonth = n + i
    const predicted = intercept + slope * futureMonth
    
    // Güven aralığı (95%)
    const margin = 1.96 * stdDev * Math.sqrt(1 + 1/n + Math.pow(futureMonth - sumX/n, 2) / (sumX2 - sumX*sumX/n))
    
    const forecastDate = new Date()
    forecastDate.setMonth(forecastDate.getMonth() + i)

    forecasts.push({
      month: forecastDate.toLocaleDateString('tr-TR', { year: 'numeric', month: 'short' }),
      predictedRevenue: Math.max(0, Math.round(predicted)),
      lowerBound: Math.max(0, Math.round(predicted - margin)),
      upperBound: Math.round(predicted + margin),
      confidence: 0.95,
    })
  }

  return forecasts
}

// ============================================================================
// ROO (RETURN ON OBJECTIVES) CALCULATIONS
// ============================================================================

/**
 * ROO - Return on Objectives
 * 
 * ROI'den farklı olarak, ROO finansal olmayan hedeflerin başarısını ölçer.
 * Her kampanya için farklı hedefler (Bilinirlik, Etkileşim, Lead, Satış vb.)
 * tanımlanabilir ve ağırlıklı ortalama ile genel başarı puanı hesaplanır.
 * 
 * Formül: ROO Score = Σ((Gerçekleşen/Hedef) × Ağırlık) / Σ(Ağırlık) × 100
 */

export const ObjectiveType = {
  AWARENESS: 'AWARENESS',
  REACH: 'REACH',
  ENGAGEMENT: 'ENGAGEMENT',
  VIDEO_VIEWS: 'VIDEO_VIEWS',
  WEBSITE_TRAFFIC: 'WEBSITE_TRAFFIC',
  LEAD_GENERATION: 'LEAD_GENERATION',
  APP_DOWNLOAD: 'APP_DOWNLOAD',
  SALES: 'SALES',
  SIGN_UP: 'SIGN_UP',
  BRAND_SENTIMENT: 'BRAND_SENTIMENT',
  SOCIAL_FOLLOWERS: 'SOCIAL_FOLLOWERS',
  EMAIL_SUBSCRIBERS: 'EMAIL_SUBSCRIBERS',
  CONTENT_CREATION: 'CONTENT_CREATION',
  EVENT_ATTENDANCE: 'EVENT_ATTENDANCE',
  CUSTOM: 'CUSTOM',
} as const

export type ObjectiveTypeValue = typeof ObjectiveType[keyof typeof ObjectiveType]

export const ObjectiveStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_TRACK: 'ON_TRACK',
  AT_RISK: 'AT_RISK',
  BEHIND: 'BEHIND',
  COMPLETED: 'COMPLETED',
  EXCEEDED: 'EXCEEDED',
} as const

export type ObjectiveStatusValue = typeof ObjectiveStatus[keyof typeof ObjectiveStatus]

// Hedef tipi etiketleri (Türkçe)
export const OBJECTIVE_TYPE_LABELS: Record<ObjectiveTypeValue, string> = {
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
export const OBJECTIVE_STATUS_LABELS: Record<ObjectiveStatusValue, string> = {
  NOT_STARTED: 'Başlamadı',
  IN_PROGRESS: 'Devam Ediyor',
  ON_TRACK: 'Yolunda',
  AT_RISK: 'Risk Altında',
  BEHIND: 'Geride',
  COMPLETED: 'Tamamlandı',
  EXCEEDED: 'Hedef Aşıldı',
}

// ROO Result Types
export type ObjectiveScoreDetail = {
  objectiveId: string
  objectiveName: string
  type: ObjectiveTypeValue
  targetValue: number
  currentValue: number
  achievementRate: number      // (currentValue / targetValue) * 100
  normalizedRate: number       // Normalized to 100 max (for scoring)
  weight: number
  weightedScore: number        // normalizedRate * weight (for final ROO)
  rawWeightedScore: number     // achievementRate * weight (without normalization)
  status: ObjectiveStatusValue
  unit: string
  statusLabel: string
  typeLabel: string
  isOverAchieved: boolean      // Flag: hedef aşıldı mı?
  overAchievementRate: number  // Ne kadar aşıldı (0 if not exceeded)
}

export type ROOResult = {
  campaignId: string
  campaignName: string
  
  // Genel Skor (100 üzerinden normalize edilmiş)
  rooScore: number             // Ağırlıklı ortalama (0-100, normalize edilmiş)
  rawRooScore: number          // Ham skor (100'ü geçebilir)
  totalWeight: number          // Toplam ağırlık
  
  // Hedef İstatistikleri
  objectiveCount: number
  completedCount: number
  exceededCount: number
  atRiskCount: number
  behindCount: number
  
  // Over-Achievement Bilgisi
  hasOverAchieved: boolean     // En az bir hedef aşıldı mı?
  overAchievedObjectives: string[] // Aşılan hedeflerin ID'leri
  totalOverAchievementBonus: number // Toplam fazla başarı bonusu
  
  // Performans Kategorisi
  performanceCategory: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'AT_RISK' | 'POOR'
  performanceLabel: string
  
  // Detaylı Hedef Bilgileri
  objectives: ObjectiveScoreDetail[]
  
  // Hesaplama Zamanı
  calculatedAt: Date
  
  // Öneriler
  recommendations: string[]
}

// Gelişmiş ROO Score sonucu (calculateROOScore için)
export type ROOScoreResult = {
  // Temel Skorlar
  normalizedScore: number      // 100 üzerinden normalize edilmiş skor
  rawScore: number             // Ham skor (100'ü geçebilir)
  weightedAverage: number      // Ağırlıklı ortalama
  
  // Hedef Bazlı Detaylar
  objectives: Array<{
    id: string
    name: string
    type: ObjectiveTypeValue
    target: number
    actual: number
    weight: number
    achievementRate: number    // Gerçekleşme oranı (%)
    normalizedRate: number     // Normalize edilmiş oran (max 100)
    contribution: number       // Skora katkısı
    isOverAchieved: boolean
    overAchievementPercent: number
  }>
  
  // İstatistikler
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
  
  // Performans Değerlendirmesi
  performance: {
    category: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'AT_RISK' | 'POOR'
    label: string
    color: string
    description: string
  }
  
  // Over-Achievement Analizi
  overAchievement: {
    hasOverAchieved: boolean
    count: number
    totalBonus: number         // Ekstra başarı bonusu
    details: Array<{
      objectiveId: string
      objectiveName: string
      excessPercent: number    // %100'ü ne kadar aştı
    }>
  }
  
  // Zaman Bilgisi
  calculatedAt: Date
}

/**
 * Gelişmiş ROO Score Hesaplama
 * 
 * Bu fonksiyon kampanyaya bağlı tüm hedefleri ve ağırlıklarını çeker,
 * her hedef için gerçekleşme oranını hesaplar, ağırlıklı ortalama alır
 * ve 100 üzerinden normalize edilmiş bir başarı skoru döner.
 * 
 * Formül: ROO Score = Σ((Actual/Target) × Weight) / Σ(Weight)
 * 
 * Normalizasyon: Eğer skor 100'ü geçerse, normalize edilmiş skor 100 olarak
 * ayarlanır ve fazla başarı ayrıca raporlanır.
 * 
 * @param campaignId - Kampanya ID
 * @returns ROOScoreResult - Detaylı ROO skoru
 */
export async function calculateROOScore(campaignId: string): Promise<ROOScoreResult> {
  // Kampanya ve hedeflerini çek
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      objectives: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`)
  }

  const objectives = campaign.objectives || []
  const now = new Date()

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
    const target = toNumber(obj.targetValue)
    const actual = toNumber(obj.currentValue)
    const weight = toNumber(obj.weight)
    
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
    const status = obj.status as ObjectiveStatusValue
    if (status === 'COMPLETED') completedCount++
    if (status === 'EXCEEDED' || isOverAchieved) {
      overAchievedCount++
      overAchievementDetails.push({
        objectiveId: obj.id,
        objectiveName: obj.name,
        excessPercent: overAchievementPercent,
      })
    }
    if (status === 'AT_RISK') atRiskCount++
    if (status === 'BEHIND') behindCount++
    if (status === 'NOT_STARTED') notStartedCount++

    return {
      id: obj.id,
      name: obj.name,
      type: obj.type as ObjectiveTypeValue,
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

  // Kampanya ROO skorunu güncelle
  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      rooScore: normalizedScore,
      rooCalculatedAt: now,
    },
  })

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
 * Kampanya için ROO puanı hesapla (Eski fonksiyon - geriye uyumluluk için)
 * 
 * @param campaignId - Kampanya ID
 * @returns ROO sonucu
 */
export async function calculateROO(campaignId: string): Promise<ROOResult> {
  // Kampanya ve hedeflerini çek
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      objectives: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`)
  }

  const objectives = campaign.objectives || []
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
      calculatedAt: new Date(),
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

  const objectiveDetails: ObjectiveScoreDetail[] = objectives.map((obj) => {
    const targetValue = toNumber(obj.targetValue)
    const currentValue = toNumber(obj.currentValue)
    const weight = toNumber(obj.weight)
    
    // Başarı oranı hesapla
    const achievementRate = targetValue > 0 
      ? (currentValue / targetValue) * 100 
      : 0
    
    // Normalize edilmiş oran (max 100)
    const normalizedRate = Math.min(achievementRate, 100)
    
    // Over-achievement kontrolü
    const isOverAchieved = achievementRate > 100
    const overAchievementRate = isOverAchieved ? achievementRate - 100 : 0
    
    if (isOverAchieved) {
      overAchievedObjectives.push(obj.id)
      totalOverAchievementBonus += overAchievementRate * 0.1 // %10 bonus
    }
    
    // Ağırlıklı skor (normalize edilmiş)
    const weightedScore = normalizedRate * weight
    const rawWeightedScore = achievementRate * weight
    
    totalWeightedScore += weightedScore
    totalRawWeightedScore += rawWeightedScore
    totalWeight += weight

    // Durum sayaçları
    const status = obj.status as ObjectiveStatusValue
    if (status === 'COMPLETED') completedCount++
    if (status === 'EXCEEDED' || isOverAchieved) exceededCount++
    if (status === 'AT_RISK') atRiskCount++
    if (status === 'BEHIND') behindCount++

    return {
      objectiveId: obj.id,
      objectiveName: obj.name,
      type: obj.type as ObjectiveTypeValue,
      targetValue,
      currentValue,
      achievementRate: Math.round(achievementRate * 100) / 100,
      normalizedRate: Math.round(normalizedRate * 100) / 100,
      weight,
      weightedScore: Math.round(weightedScore * 100) / 100,
      rawWeightedScore: Math.round(rawWeightedScore * 100) / 100,
      status,
      unit: obj.unit,
      statusLabel: OBJECTIVE_STATUS_LABELS[status] || status,
      typeLabel: OBJECTIVE_TYPE_LABELS[obj.type as ObjectiveTypeValue] || obj.type,
      isOverAchieved,
      overAchievementRate: Math.round(overAchievementRate * 100) / 100,
    }
  })

  // ROO Skoru = Toplam Ağırlıklı Skor / Toplam Ağırlık (normalize edilmiş, max 100)
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
  
  if (atRiskCount > 0) {
    recommendations.push(`${atRiskCount} hedef risk altında. Öncelikli olarak bu hedeflere odaklanın.`)
  }
  
  if (behindCount > 0) {
    recommendations.push(`${behindCount} hedef geride kalıyor. Strateji revizyonu düşünün.`)
  }
  
  if (rooScore < 50) {
    recommendations.push('Genel performans düşük. Kampanya stratejisini gözden geçirin.')
  }
  
  if (exceededCount > 0) {
    recommendations.push(`${exceededCount} hedef aşıldı! Bu başarılı stratejileri diğer hedeflere uygulayın.`)
  }
  
  if (recommendations.length === 0 && rooScore >= 75) {
    recommendations.push('Kampanya hedeflerinde iyi performans gösteriyorsunuz.')
  }

  // Kampanya ROO skorunu güncelle
  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      rooScore,
      rooCalculatedAt: new Date(),
    },
  })

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
    calculatedAt: new Date(),
    recommendations,
  }
}

/**
 * Hedefe ilerleme kaydet
 * 
 * @param objectiveId - Hedef ID
 * @param value - Yeni değer
 * @param source - Veri kaynağı
 * @param notes - Notlar
 */
export async function recordObjectiveProgress(
  objectiveId: string,
  value: number,
  source?: string,
  notes?: string
): Promise<void> {
  // Mevcut hedefi çek
  const objective = await prisma.campaignObjective.findUnique({
    where: { id: objectiveId },
  })

  if (!objective) {
    throw new Error(`Objective not found: ${objectiveId}`)
  }

  const previousValue = toNumber(objective.currentValue)
  const targetValue = toNumber(objective.targetValue)
  const delta = value - previousValue
  const achievementRate = targetValue > 0 ? (value / targetValue) * 100 : 0

  // Durum belirle
  let status: ObjectiveStatusValue
  if (achievementRate >= 100) {
    status = achievementRate > 100 ? 'EXCEEDED' : 'COMPLETED'
  } else if (achievementRate >= 80) {
    status = 'ON_TRACK'
  } else if (achievementRate >= 50) {
    status = 'AT_RISK'
  } else if (achievementRate > 0) {
    status = 'BEHIND'
  } else {
    status = 'NOT_STARTED'
  }

  // Progress kaydı oluştur
  await prisma.objectiveProgress.create({
    data: {
      objectiveId,
      value,
      previousValue,
      delta,
      achievementRate,
      source,
      notes,
      recordedAt: new Date(),
    },
  })

  // Hedefi güncelle
  await prisma.campaignObjective.update({
    where: { id: objectiveId },
    data: {
      currentValue: value,
      achievementRate,
      weightedScore: achievementRate * toNumber(objective.weight),
      status,
    },
  })
}

/**
 * Organizasyon için tüm kampanyaların ROO istatistiklerini al
 */
export async function getOrganizationROOStats(organizationId: string): Promise<{
  avgROOScore: number
  campaignsWithObjectives: number
  totalObjectives: number
  completedObjectives: number
  exceededObjectives: number
  atRiskObjectives: number
  topPerformingCampaigns: Array<{ campaignId: string; campaignName: string; rooScore: number }>
  atRiskCampaigns: Array<{ campaignId: string; campaignName: string; rooScore: number }>
  objectivesByType: Array<{ type: string; count: number; avgAchievement: number }>
}> {
  // Tüm kampanyaları hedefleriyle birlikte çek
  const campaigns = await prisma.campaign.findMany({
    where: { organizationId },
    include: {
      objectives: {
        where: { isActive: true },
      },
    },
  })

  const campaignsWithObjectives = campaigns.filter(c => c.objectives.length > 0)
  const allObjectives = campaigns.flatMap(c => c.objectives)

  // Ortalama ROO skoru
  const avgROOScore = campaignsWithObjectives.length > 0
    ? campaignsWithObjectives.reduce((sum, c) => sum + (toNumber(c.rooScore) || 0), 0) / campaignsWithObjectives.length
    : 0

  // Hedef istatistikleri
  const completedObjectives = allObjectives.filter(o => o.status === 'COMPLETED').length
  const exceededObjectives = allObjectives.filter(o => o.status === 'EXCEEDED').length
  const atRiskObjectives = allObjectives.filter(o => o.status === 'AT_RISK' || o.status === 'BEHIND').length

  // En iyi performans gösteren kampanyalar
  const topPerformingCampaigns = campaignsWithObjectives
    .filter(c => c.rooScore !== null)
    .sort((a, b) => toNumber(b.rooScore) - toNumber(a.rooScore))
    .slice(0, 5)
    .map(c => ({
      campaignId: c.id,
      campaignName: c.name,
      rooScore: toNumber(c.rooScore) || 0,
    }))

  // Risk altındaki kampanyalar
  const atRiskCampaigns = campaignsWithObjectives
    .filter(c => c.rooScore !== null && toNumber(c.rooScore) < 60)
    .sort((a, b) => toNumber(a.rooScore) - toNumber(b.rooScore))
    .slice(0, 5)
    .map(c => ({
      campaignId: c.id,
      campaignName: c.name,
      rooScore: toNumber(c.rooScore) || 0,
    }))

  // Hedef tiplerine göre grupla
  const typeGroups = allObjectives.reduce((acc, obj) => {
    if (!acc[obj.type]) {
      acc[obj.type] = { count: 0, totalAchievement: 0 }
    }
    acc[obj.type].count++
    acc[obj.type].totalAchievement += toNumber(obj.achievementRate) || 0
    return acc
  }, {} as Record<string, { count: number; totalAchievement: number }>)

  const objectivesByType = Object.entries(typeGroups).map(([type, data]) => ({
    type,
    count: data.count,
    avgAchievement: Math.round(data.totalAchievement / data.count),
  }))

  return {
    avgROOScore: Math.round(avgROOScore * 100) / 100,
    campaignsWithObjectives: campaignsWithObjectives.length,
    totalObjectives: allObjectives.length,
    completedObjectives,
    exceededObjectives,
    atRiskObjectives,
    topPerformingCampaigns,
    atRiskCampaigns,
    objectivesByType,
  }
}

/**
 * Kampanya hedefi oluştur
 */
export async function createCampaignObjective(
  campaignId: string,
  data: {
    type: ObjectiveTypeValue
    name: string
    description?: string
    targetValue: number
    unit?: string
    weight?: number
    startDate?: Date
    endDate?: Date
  }
): Promise<void> {
  // Mevcut hedef sayısını al (sıralama için)
  const existingCount = await prisma.campaignObjective.count({
    where: { campaignId },
  })

  await prisma.campaignObjective.create({
    data: {
      campaignId,
      type: data.type,
      name: data.name,
      description: data.description,
      targetValue: data.targetValue,
      unit: data.unit || 'count',
      weight: data.weight || 1.0,
      startDate: data.startDate,
      endDate: data.endDate,
      sortOrder: existingCount,
      status: 'NOT_STARTED',
      currentValue: 0,
      achievementRate: 0,
      weightedScore: 0,
    },
  })
}

/**
 * ROO ve ROI karşılaştırması
 * 
 * Bir kampanyanın hem finansal (ROI) hem de hedef bazlı (ROO) performansını karşılaştırır.
 */
export async function getCampaignPerformanceComparison(campaignId: string): Promise<{
  campaignId: string
  campaignName: string
  roi: CampaignROIResult | null
  roo: ROOResult | null
  overallScore: number
  performanceInsight: string
}> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  })

  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`)
  }

  let roi: CampaignROIResult | null = null
  let roo: ROOResult | null = null

  try {
    roi = await calculateCampaignROI(campaignId)
  } catch {
    // ROI hesaplanamadı
  }

  try {
    roo = await calculateROO(campaignId)
  } catch {
    // ROO hesaplanamadı
  }

  // Genel skor hesapla (ROI ve ROO'nun ağırlıklı ortalaması)
  let overallScore = 0
  let insight = ''

  if (roi && roo) {
    // Her ikisi de varsa, 50-50 ağırlık
    const normalizedROI = Math.min(Math.max(roi.roi, 0), 200) / 2 // ROI'yi 0-100 aralığına normalize et
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
