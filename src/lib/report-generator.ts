/**
 * Report Generator - DevRetain CRM
 * 
 * Rapor oluşturma ve PDF export fonksiyonları.
 * ROO (Return on Objectives) raporlama ve Yönetici Özeti desteği.
 */

import {
  getDashboardStats,
  getMonthlyTrend,
  getRFMDistribution,
  getCampaignPerformance,
  getTopSponsors,
  calculateRFM,
  calculateLTV,
  calculateROO,
  calculateROOScore,
  getCampaignsWithROODetails,
  getROOSummaryStats,
  OBJECTIVE_TYPE_LABELS,
  OBJECTIVE_STATUS_LABELS,
  type DashboardStats,
  type MonthlyTrend,
  type RFMDistribution,
  type RFMResult,
  type LTVResult,
  type ROOResult,
  type ROOScoreResult,
} from "./mock-analytics"
import { mockSponsors, mockCampaigns, getMockProgressByObjective, type MockObjectiveProgress } from "./mock-data"

// ============================================================================
// TYPES
// ============================================================================

export type ReportDateRange = {
  startDate: Date
  endDate: Date
}

export type CampaignReportItem = {
  id: string
  name: string
  status: string
  type: string
  budgetTotal: number
  budgetSpent: number
  roi: number
  rooScore: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  startDate: Date
  endDate: Date
  objectiveCount: number
}

// ROO Raporlama Tipleri
export type ObjectiveReportItem = {
  id: string
  name: string
  type: string
  typeLabel: string
  targetValue: number
  currentValue: number
  achievementRate: number
  status: string
  statusLabel: string
  unit: string
  weight: number
  isOverAchieved: boolean
  overAchievementRate: number
  progressHistory: MockObjectiveProgress[]
}

export type CampaignROOReport = {
  campaignId: string
  campaignName: string
  rooScore: number
  rawRooScore: number
  performanceCategory: string
  performanceLabel: string
  objectives: ObjectiveReportItem[]
  qualitativeGains: QualitativeGain[]
  executiveSummary: string
}

export type QualitativeGain = {
  type: 'achievement' | 'exceeded' | 'improvement' | 'milestone' | 'risk'
  icon: string
  title: string
  description: string
  metric?: string
  trend?: 'up' | 'down' | 'stable'
}

export type ExecutiveSummaryData = {
  campaignName: string
  overallPerformance: string
  keyAchievements: string[]
  areasOfConcern: string[]
  recommendations: string[]
  fullSummary: string
}

export type SponsorReportItem = {
  id: string
  companyName: string
  tier: string
  industry: string | null
  totalValue: number
  rfm: RFMResult | null
  ltv: LTVResult | null
}

export type ReportData = {
  generatedAt: Date
  dateRange: ReportDateRange
  organizationName: string
  
  // Özet istatistikler
  summary: DashboardStats
  
  // Aylık trend
  monthlyTrend: MonthlyTrend[]
  
  // RFM dağılımı
  rfmDistribution: RFMDistribution[]
  
  // Kampanya performansları
  campaigns: CampaignReportItem[]
  
  // Sponsor analizleri
  sponsors: SponsorReportItem[]
  
  // ROO Raporları
  rooReports: CampaignROOReport[]
  
  // ROO Özet İstatistikleri
  rooSummary: {
    avgRooScore: number
    totalObjectives: number
    completedObjectives: number
    exceededObjectives: number
    atRiskObjectives: number
    campaignsWithObjectives: number
  }
  
  // Öne çıkan metrikler
  highlights: {
    bestPerformingCampaign: CampaignReportItem | null
    highestROICampaign: CampaignReportItem | null
    highestROOCampaign: CampaignReportItem | null
    topSponsor: SponsorReportItem | null
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    averageROI: number
    averageROO: number
    sponsorRetentionRate: number
  }
  
  // Genel Yönetici Özeti
  executiveSummary: string
}

// ============================================================================
// ROO QUALITATIVE GAINS GENERATOR
// ============================================================================

/**
 * Hedef verilerinden niteliksel kazanımlar oluştur
 */
function generateQualitativeGains(objectives: ObjectiveReportItem[]): QualitativeGain[] {
  const gains: QualitativeGain[] = []

  objectives.forEach(obj => {
    // Hedef aşıldıysa
    if (obj.isOverAchieved) {
      gains.push({
        type: 'exceeded',
        icon: '🏆',
        title: `${obj.typeLabel} Hedefi Aşıldı!`,
        description: `${obj.name} hedefinin %${obj.achievementRate.toFixed(0)}'sine ulaşıldı. Hedef %${obj.overAchievementRate.toFixed(0)} oranında aşıldı.`,
        metric: `${obj.currentValue.toLocaleString()} / ${obj.targetValue.toLocaleString()} ${obj.unit}`,
        trend: 'up'
      })
    }
    // Hedef tamamlandıysa
    else if (obj.status === 'COMPLETED' || obj.achievementRate >= 100) {
      gains.push({
        type: 'achievement',
        icon: '✅',
        title: `${obj.typeLabel} Hedefi Tamamlandı`,
        description: `${obj.name} hedefi başarıyla tamamlandı.`,
        metric: `${obj.currentValue.toLocaleString()} ${obj.unit}`,
        trend: 'stable'
      })
    }
    // Yolunda gidiyorsa
    else if (obj.status === 'ON_TRACK' || obj.achievementRate >= 75) {
      gains.push({
        type: 'improvement',
        icon: '📈',
        title: `${obj.typeLabel} İyi İlerliyor`,
        description: `${obj.name} hedefinin %${obj.achievementRate.toFixed(0)}'si tamamlandı ve yolunda gidiyor.`,
        metric: `${obj.currentValue.toLocaleString()} / ${obj.targetValue.toLocaleString()} ${obj.unit}`,
        trend: 'up'
      })
    }
    // Risk altındaysa
    else if (obj.status === 'AT_RISK' || obj.status === 'BEHIND') {
      gains.push({
        type: 'risk',
        icon: '⚠️',
        title: `${obj.typeLabel} Dikkat Gerektiriyor`,
        description: `${obj.name} hedefi geride kalıyor. Şu ana kadar %${obj.achievementRate.toFixed(0)} tamamlandı.`,
        metric: `${obj.currentValue.toLocaleString()} / ${obj.targetValue.toLocaleString()} ${obj.unit}`,
        trend: 'down'
      })
    }
  })

  // Önemli milestonelar
  const exceededCount = objectives.filter(o => o.isOverAchieved).length
  const completedCount = objectives.filter(o => o.status === 'COMPLETED' || o.achievementRate >= 100).length
  
  if (exceededCount > 0) {
    gains.unshift({
      type: 'milestone',
      icon: '🎯',
      title: 'Hedefler Aşıldı',
      description: `Bu kampanyada ${exceededCount} hedef belirlenen değerin üzerine çıktı.`,
      trend: 'up'
    })
  }

  if (completedCount === objectives.length && objectives.length > 0) {
    gains.unshift({
      type: 'milestone',
      icon: '🌟',
      title: 'Tüm Hedefler Tamamlandı',
      description: `Kampanyadaki ${objectives.length} hedefin tamamı başarıyla gerçekleştirildi.`,
      trend: 'up'
    })
  }

  return gains
}

// ============================================================================
// EXECUTIVE SUMMARY GENERATOR
// ============================================================================

/**
 * Kampanya için otomatik Yönetici Özeti metni oluştur
 */
export function generateExecutiveSummary(
  campaignName: string,
  rooScore: number,
  rawRooScore: number,
  objectives: ObjectiveReportItem[],
  roi?: number
): ExecutiveSummaryData {
  const keyAchievements: string[] = []
  const areasOfConcern: string[] = []
  const recommendations: string[] = []

  // Hedef analizleri
  const exceededObjectives = objectives.filter(o => o.isOverAchieved)
  const completedObjectives = objectives.filter(o => o.status === 'COMPLETED' || o.achievementRate >= 100)
  const atRiskObjectives = objectives.filter(o => o.status === 'AT_RISK' || o.status === 'BEHIND')
  const onTrackObjectives = objectives.filter(o => o.status === 'ON_TRACK')

  // Genel performans değerlendirmesi
  let overallPerformance: string
  if (rooScore >= 90) {
    overallPerformance = 'Mükemmel'
  } else if (rooScore >= 75) {
    overallPerformance = 'İyi'
  } else if (rooScore >= 50) {
    overallPerformance = 'Ortalama'
  } else if (rooScore >= 25) {
    overallPerformance = 'Düşük'
  } else {
    overallPerformance = 'Kritik'
  }

  // Başarılar
  exceededObjectives.forEach(obj => {
    keyAchievements.push(
      `${obj.typeLabel} hedefi %${obj.overAchievementRate.toFixed(0)} oranında aşıldı (${obj.currentValue.toLocaleString()} ${obj.unit} / hedef: ${obj.targetValue.toLocaleString()} ${obj.unit}).`
    )
  })

  completedObjectives.filter(o => !o.isOverAchieved).forEach(obj => {
    keyAchievements.push(
      `${obj.typeLabel} hedefi başarıyla tamamlandı (${obj.currentValue.toLocaleString()} ${obj.unit}).`
    )
  })

  onTrackObjectives.forEach(obj => {
    keyAchievements.push(
      `${obj.typeLabel} hedefi yolunda ilerliyor (%${obj.achievementRate.toFixed(0)} tamamlandı).`
    )
  })

  // Endişe alanları
  atRiskObjectives.forEach(obj => {
    areasOfConcern.push(
      `${obj.typeLabel} hedefi geride kalıyor. Şu ana kadar %${obj.achievementRate.toFixed(0)} tamamlandı (${obj.currentValue.toLocaleString()} / ${obj.targetValue.toLocaleString()} ${obj.unit}).`
    )
  })

  // Öneriler
  if (atRiskObjectives.length > 0) {
    recommendations.push(
      `${atRiskObjectives.length} hedef risk altında. Bu hedefler için strateji revizyonu önerilir.`
    )
    
    atRiskObjectives.forEach(obj => {
      if (obj.type === 'ENGAGEMENT' || obj.type === 'SOCIAL_FOLLOWERS') {
        recommendations.push(
          `${obj.typeLabel} için içerik stratejisini gözden geçirin ve etkileşim odaklı kampanyalar planlayın.`
        )
      } else if (obj.type === 'WEBSITE_TRAFFIC' || obj.type === 'APP_DOWNLOAD') {
        recommendations.push(
          `${obj.typeLabel} için çağrı-aksiyonu (CTA) mesajlarını güçlendirin ve yönlendirme linklerini optimize edin.`
        )
      } else if (obj.type === 'SALES' || obj.type === 'LEAD_GENERATION') {
        recommendations.push(
          `${obj.typeLabel} için satış hunisini analiz edin ve dönüşüm oranını artıracak iyileştirmeler yapın.`
        )
      }
    })
  }

  if (exceededObjectives.length > 0) {
    recommendations.push(
      `Aşılan hedeflerdeki başarılı stratejileri diğer hedeflere de uygulayın.`
    )
  }

  if (roi !== undefined && roi > 100 && rooScore < 75) {
    recommendations.push(
      `Finansal performans iyi ancak stratejik hedefler geride. Marka değeri odaklı aktiviteleri artırın.`
    )
  }

  if (roi !== undefined && roi < 50 && rooScore >= 75) {
    recommendations.push(
      `Stratejik hedefler başarılı ancak finansal getiri düşük. Monetizasyon stratejilerini gözden geçirin.`
    )
  }

  // Tam özet metni oluştur
  const summaryParts: string[] = []

  // Giriş
  summaryParts.push(
    `"${campaignName}" kampanyası için ROO (Return on Objectives) analizi tamamlanmıştır. ` +
    `Kampanyanın genel performansı "${overallPerformance}" olarak değerlendirilmiş olup, ` +
    `ROO skoru ${rooScore.toFixed(1)} olarak hesaplanmıştır${rawRooScore > 100 ? ` (ham skor: ${rawRooScore.toFixed(1)})` : ''}.`
  )

  // Hedef özeti
  summaryParts.push(
    `\n\nKampanyada toplam ${objectives.length} hedef tanımlanmıştır. ` +
    `Bu hedeflerden ${completedObjectives.length + exceededObjectives.length} tanesi tamamlanmış veya aşılmış, ` +
    `${onTrackObjectives.length} tanesi yolunda ilerlemekte, ` +
    `${atRiskObjectives.length} tanesi ise dikkat gerektirmektedir.`
  )

  // Öne çıkan başarılar
  if (keyAchievements.length > 0) {
    summaryParts.push(
      `\n\n**Öne Çıkan Başarılar:**\n` +
      keyAchievements.slice(0, 3).map(a => `• ${a}`).join('\n')
    )
  }

  // Dikkat gerektiren alanlar
  if (areasOfConcern.length > 0) {
    summaryParts.push(
      `\n\n**Dikkat Gerektiren Alanlar:**\n` +
      areasOfConcern.map(a => `• ${a}`).join('\n')
    )
  }

  // Sonuç ve öneriler
  if (recommendations.length > 0) {
    summaryParts.push(
      `\n\n**Öneriler:**\n` +
      recommendations.slice(0, 3).map(r => `• ${r}`).join('\n')
    )
  }

  return {
    campaignName,
    overallPerformance,
    keyAchievements,
    areasOfConcern,
    recommendations,
    fullSummary: summaryParts.join('')
  }
}

/**
 * Organizasyon geneli için Yönetici Özeti oluştur
 */
export function generateOrganizationExecutiveSummary(
  organizationName: string,
  rooReports: CampaignROOReport[],
  totalRevenue: number,
  totalExpenses: number,
  avgROI: number,
  avgROO: number
): string {
  const summaryParts: string[] = []
  
  const netProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
  
  // Kampanya istatistikleri
  const excellentCampaigns = rooReports.filter(r => r.rooScore >= 90)
  const goodCampaigns = rooReports.filter(r => r.rooScore >= 75 && r.rooScore < 90)
  const atRiskCampaigns = rooReports.filter(r => r.rooScore < 50)
  
  // Tüm hedefler
  const allObjectives = rooReports.flatMap(r => r.objectives)
  const exceededObjectives = allObjectives.filter(o => o.isOverAchieved)
  const completedObjectives = allObjectives.filter(o => o.status === 'COMPLETED' || o.achievementRate >= 100)
  const atRiskObjectives = allObjectives.filter(o => o.status === 'AT_RISK' || o.status === 'BEHIND')

  // Giriş
  summaryParts.push(
    `## ${organizationName} - Sponsorluk Performans Özeti\n\n` +
    `Bu rapor, belirlenen dönem içindeki sponsorluk faaliyetlerinin kapsamlı bir analizini sunmaktadır.`
  )

  // Finansal özet
  summaryParts.push(
    `\n\n### Finansal Performans\n` +
    `Dönem içinde toplam **${formatCurrency(totalRevenue)}** gelir elde edilmiş, ` +
    `**${formatCurrency(totalExpenses)}** harcama yapılmıştır. ` +
    `Net kar **${formatCurrency(netProfit)}** olup, kar marjı **%${profitMargin.toFixed(1)}** olarak gerçekleşmiştir. ` +
    `Ortalama ROI **%${avgROI.toFixed(1)}** seviyesindedir.`
  )

  // Stratejik hedef özeti
  summaryParts.push(
    `\n\n### Stratejik Hedef Performansı (ROO)\n` +
    `Toplam **${rooReports.length}** kampanyada **${allObjectives.length}** stratejik hedef tanımlanmıştır. ` +
    `Ortalama ROO skoru **${avgROO.toFixed(1)}** olarak hesaplanmıştır.\n\n` +
    `• **${completedObjectives.length + exceededObjectives.length}** hedef başarıyla tamamlandı veya aşıldı\n` +
    `• **${exceededObjectives.length}** hedef belirlenen değerin üzerine çıktı\n` +
    `• **${atRiskObjectives.length}** hedef dikkat gerektiriyor`
  )

  // Kampanya performansı
  summaryParts.push(
    `\n\n### Kampanya Performans Dağılımı\n` +
    `• **${excellentCampaigns.length}** kampanya mükemmel performans gösterdi (ROO ≥90)\n` +
    `• **${goodCampaigns.length}** kampanya iyi performans gösterdi (ROO 75-90)\n` +
    `• **${atRiskCampaigns.length}** kampanya iyileştirme gerektiriyor (ROO <50)`
  )

  // Öne çıkan başarılar
  if (exceededObjectives.length > 0) {
    const topExceeded = exceededObjectives
      .sort((a, b) => b.overAchievementRate - a.overAchievementRate)
      .slice(0, 3)
    
    summaryParts.push(
      `\n\n### Öne Çıkan Niteliksel Kazanımlar\n` +
      topExceeded.map(obj => {
        const campaign = rooReports.find(r => r.objectives.some(o => o.id === obj.id))
        return `• **${obj.typeLabel}** hedefi %${obj.overAchievementRate.toFixed(0)} oranında aşıldı` +
          (campaign ? ` (${campaign.campaignName})` : '')
      }).join('\n')
    )
  }

  // Sonuç ve öneriler
  summaryParts.push(
    `\n\n### Sonuç ve Öneriler\n`
  )

  if (avgROO >= 75 && avgROI >= 100) {
    summaryParts.push(
      `Sponsorluk faaliyetleri hem finansal hem de stratejik hedefler açısından başarılı bir performans sergilemiştir. ` +
      `Mevcut stratejilerin sürdürülmesi ve başarılı kampanya modellerinin diğer projelere uygulanması önerilmektedir.`
    )
  } else if (avgROI >= 100 && avgROO < 75) {
    summaryParts.push(
      `Finansal performans tatmin edici olmakla birlikte, stratejik hedeflerde iyileştirme alanları bulunmaktadır. ` +
      `Marka bilinirliği ve etkileşim odaklı aktivitelerin artırılması önerilmektedir.`
    )
  } else if (avgROI < 100 && avgROO >= 75) {
    summaryParts.push(
      `Stratejik hedefler başarılı bir şekilde gerçekleştirilmekte, ancak finansal getiri beklentilerin altında kalmaktadır. ` +
      `Monetizasyon stratejilerinin gözden geçirilmesi ve sponsorluk paketlerinin yeniden değerlendirilmesi önerilmektedir.`
    )
  } else {
    summaryParts.push(
      `Hem finansal hem de stratejik performansta iyileştirme alanları tespit edilmiştir. ` +
      `Kapsamlı bir strateji revizyonu ve hedef-bütçe optimizasyonu önerilmektedir.`
    )
  }

  if (atRiskCampaigns.length > 0) {
    summaryParts.push(
      `\n\n**Acil Aksiyon:** ${atRiskCampaigns.length} kampanya kritik seviyede performans göstermektedir ve öncelikli müdahale gerektirmektedir.`
    )
  }

  return summaryParts.join('')
}

// ============================================================================
// CAMPAIGN ROO REPORT GENERATOR
// ============================================================================

/**
 * Kampanya için ROO raporu oluştur
 */
export function generateCampaignROOReport(campaignId: string): CampaignROOReport {
  const rooResult = calculateROO(campaignId)
  const campaign = mockCampaigns.find(c => c.id === campaignId)
  
  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`)
  }

  // Hedef detaylarını hazırla
  const objectives: ObjectiveReportItem[] = rooResult.objectives.map(obj => ({
    id: obj.id,
    name: obj.name,
    type: obj.type,
    typeLabel: obj.typeLabel,
    targetValue: obj.targetValue,
    currentValue: obj.currentValue,
    achievementRate: obj.achievementRate,
    status: obj.status,
    statusLabel: obj.statusLabel,
    unit: obj.unit,
    weight: obj.weight,
    isOverAchieved: obj.isOverAchieved,
    overAchievementRate: obj.overAchievementRate,
    progressHistory: getMockProgressByObjective(obj.id)
  }))

  // Niteliksel kazanımları oluştur
  const qualitativeGains = generateQualitativeGains(objectives)

  // Yönetici özetini oluştur
  const executiveSummaryData = generateExecutiveSummary(
    campaign.name,
    rooResult.rooScore,
    rooResult.rawRooScore,
    objectives
  )

  return {
    campaignId,
    campaignName: campaign.name,
    rooScore: rooResult.rooScore,
    rawRooScore: rooResult.rawRooScore,
    performanceCategory: rooResult.performanceCategory,
    performanceLabel: rooResult.performanceLabel,
    objectives,
    qualitativeGains,
    executiveSummary: executiveSummaryData.fullSummary
  }
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

export function generateReport(
  organizationId: string,
  dateRange: ReportDateRange
): ReportData {
  const stats = getDashboardStats(organizationId)
  const monthlyTrend = getMonthlyTrend(organizationId, 6)
  const rfmDistribution = getRFMDistribution(organizationId)
  const campaignPerformance = getCampaignPerformance(organizationId)
  const topSponsorsData = getTopSponsors(organizationId, 10)

  // Tarih aralığına göre kampanyaları filtrele
  const filteredCampaigns: CampaignReportItem[] = campaignPerformance.filter((campaign) => {
    const campaignStart = new Date(campaign.startDate)
    const campaignEnd = new Date(campaign.endDate)
    return (
      (campaignStart >= dateRange.startDate && campaignStart <= dateRange.endDate) ||
      (campaignEnd >= dateRange.startDate && campaignEnd <= dateRange.endDate) ||
      (campaignStart <= dateRange.startDate && campaignEnd >= dateRange.endDate)
    )
  }).map(campaign => {
    const roo = calculateROO(campaign.id)
    return {
      ...campaign,
      rooScore: roo.rooScore,
      objectiveCount: roo.objectiveCount
    }
  })
  
  // ROO raporlarını oluştur
  const rooReports: CampaignROOReport[] = filteredCampaigns
    .filter(c => c.objectiveCount > 0)
    .map(c => generateCampaignROOReport(c.id))
  
  // ROO özet istatistikleri
  const rooStats = getROOSummaryStats(organizationId)
  const avgROO = rooReports.length > 0
    ? rooReports.reduce((sum, r) => sum + r.rooScore, 0) / rooReports.length
    : 0

  // Sponsor analizlerini hazırla
  const orgSponsors = mockSponsors.filter((s) => s.organizationId === organizationId)
  const sponsorReports: SponsorReportItem[] = orgSponsors.map((sponsor) => {
    const topSponsorData = topSponsorsData.find((s) => s.id === sponsor.id)
    const rfm = calculateRFM(sponsor.id)
    const ltv = calculateLTV(sponsor.id)

    return {
      id: sponsor.id,
      companyName: sponsor.companyName,
      tier: sponsor.tier,
      industry: sponsor.industry,
      totalValue: topSponsorData?.totalValue || 0,
      rfm,
      ltv,
    }
  })

  // En iyi performans gösteren kampanya
  const bestPerformingCampaign = filteredCampaigns.length > 0
    ? filteredCampaigns.reduce((best, current) =>
        current.conversions > best.conversions ? current : best
      )
    : null

  // En yüksek ROI'li kampanya
  const highestROICampaign = filteredCampaigns.length > 0
    ? filteredCampaigns.reduce((best, current) =>
        current.roi > best.roi ? current : best
      )
    : null

  // En yüksek ROO'lu kampanya
  const campaignsWithROO = filteredCampaigns.filter(c => c.objectiveCount > 0)
  const highestROOCampaign = campaignsWithROO.length > 0
    ? campaignsWithROO.reduce((best, current) =>
        current.rooScore > best.rooScore ? current : best
      )
    : null

  // En değerli sponsor
  const topSponsor = sponsorReports.length > 0
    ? sponsorReports.reduce((best, current) =>
        current.totalValue > best.totalValue ? current : best
      )
    : null

  // Aktif sponsor oranı (retention rate yaklaşımı)
  const activeSponsors = orgSponsors.filter((s) => s.isActive).length
  const sponsorRetentionRate = orgSponsors.length > 0
    ? (activeSponsors / orgSponsors.length) * 100
    : 0

  // Organizasyon adını bul
  const org = mockCampaigns.find((c) => c.organizationId === organizationId)
  const organizationName = organizationId === "org-1" ? "TechTurk YouTube" : "Anadolu Esports"

  // Genel Yönetici Özeti oluştur
  const executiveSummary = generateOrganizationExecutiveSummary(
    organizationName,
    rooReports,
    stats.totalRevenue,
    stats.totalExpenses,
    stats.averageROI,
    avgROO
  )

  return {
    generatedAt: new Date(),
    dateRange,
    organizationName,
    summary: stats,
    monthlyTrend,
    rfmDistribution,
    campaigns: filteredCampaigns,
    sponsors: sponsorReports.sort((a, b) => b.totalValue - a.totalValue),
    rooReports,
    rooSummary: {
      avgRooScore: avgROO,
      totalObjectives: rooStats.totalObjectives,
      completedObjectives: rooStats.completedObjectives + rooStats.exceededObjectives,
      exceededObjectives: rooStats.exceededObjectives,
      atRiskObjectives: rooStats.atRiskObjectives + rooStats.behindObjectives,
      campaignsWithObjectives: rooStats.totalCampaignsWithObjectives,
    },
    highlights: {
      bestPerformingCampaign,
      highestROICampaign,
      highestROOCampaign,
      topSponsor,
      totalRevenue: stats.totalRevenue,
      totalExpenses: stats.totalExpenses,
      netProfit: stats.netIncome,
      averageROI: stats.averageROI,
      averageROO: avgROO,
      sponsorRetentionRate: Math.round(sponsorRetentionRate),
    },
    executiveSummary,
  }
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("tr-TR").format(value)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

export function formatPercent(value: number): string {
  return `%${value.toFixed(1)}`
}

// ============================================================================
// PDF EXPORT
// ============================================================================

export async function exportToPDF(elementId: string, filename: string): Promise<void> {
  const { default: jsPDF } = await import("jspdf")
  const { default: html2canvas } = await import("html2canvas")

  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error("Report element not found")
  }

  // HTML'i canvas'a çevir
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  })

  const imgData = canvas.toDataURL("image/png")
  const imgWidth = 210 // A4 genişliği (mm)
  const pageHeight = 297 // A4 yüksekliği (mm)
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  let heightLeft = imgHeight
  let position = 0

  const pdf = new jsPDF("p", "mm", "a4")

  // İlk sayfa
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  // Ek sayfalar (içerik uzunsa)
  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  pdf.save(`${filename}.pdf`)
}
