/**
 * Localized Report Generator - DevRetain CRM
 * 
 * Çok dilli rapor oluşturma ve PDF export fonksiyonları.
 * Seçilen dile göre tüm metinler, formatlar ve çıktılar yerelleştirilir.
 */

import { type Locale } from "@/i18n/config"
import {
  formatCurrency as formatCurrencyLocalized,
  formatNumber as formatNumberLocalized,
  formatPercentage as formatPercentageLocalized,
  formatDate as formatDateLocalized,
  formatDateTime as formatDateTimeLocalized,
} from "@/i18n/format"

// ============================================================================
// TYPES
// ============================================================================

export type LocalizedReportConfig = {
  locale: Locale
  organizationName: string
  dateRange: {
    startDate: Date
    endDate: Date
  }
}

export type LocalizedQualitativeGain = {
  type: 'achievement' | 'exceeded' | 'improvement' | 'milestone' | 'risk'
  icon: string
  title: string
  description: string
  metric?: string
  trend?: 'up' | 'down' | 'stable'
}

// ============================================================================
// TRANSLATION HELPERS
// ============================================================================

// Report translations cache
let reportTranslations: Record<string, any> = {}

/**
 * Load report translations for the given locale
 */
export async function loadReportTranslations(locale: Locale): Promise<Record<string, any>> {
  try {
    const messages = await import(`../../messages/${locale}.json`)
    reportTranslations = messages.default.reports || {}
    return reportTranslations
  } catch {
    // Fallback to Turkish
    const messages = await import(`../../messages/tr.json`)
    reportTranslations = messages.default.reports || {}
    return reportTranslations
  }
}

/**
 * Get translation with variable replacement
 */
function t(key: string, variables?: Record<string, string | number>): string {
  const keys = key.split('.')
  let value: any = reportTranslations
  
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) return key
  }
  
  if (typeof value !== 'string') return key
  
  // Replace variables
  if (variables) {
    return value.replace(/\{(\w+)\}/g, (_, varName) => {
      return String(variables[varName] ?? `{${varName}}`)
    })
  }
  
  return value
}

/**
 * Get objective type label based on locale
 */
export function getObjectiveTypeLabel(type: string, locale: Locale): string {
  const labels: Record<Locale, Record<string, string>> = {
    tr: {
      AWARENESS: "Marka Bilinirliği",
      REACH: "Erişim",
      ENGAGEMENT: "Etkileşim",
      VIDEO_VIEWS: "Video İzlenme",
      WEBSITE_TRAFFIC: "Web Sitesi Trafiği",
      LEAD_GENERATION: "Potansiyel Müşteri",
      APP_DOWNLOAD: "Uygulama İndirme",
      SALES: "Satış",
      SIGN_UP: "Kayıt",
      BRAND_SENTIMENT: "Marka Algısı",
      SOCIAL_FOLLOWERS: "Sosyal Medya Takipçisi",
      EMAIL_SUBSCRIBERS: "E-posta Abonesi",
      CONTENT_CREATION: "İçerik Üretimi",
      EVENT_ATTENDANCE: "Etkinlik Katılımı",
      CUSTOM: "Özel Hedef",
    },
    en: {
      AWARENESS: "Brand Awareness",
      REACH: "Reach",
      ENGAGEMENT: "Engagement",
      VIDEO_VIEWS: "Video Views",
      WEBSITE_TRAFFIC: "Website Traffic",
      LEAD_GENERATION: "Lead Generation",
      APP_DOWNLOAD: "App Downloads",
      SALES: "Sales",
      SIGN_UP: "Sign Ups",
      BRAND_SENTIMENT: "Brand Sentiment",
      SOCIAL_FOLLOWERS: "Social Media Followers",
      EMAIL_SUBSCRIBERS: "Email Subscribers",
      CONTENT_CREATION: "Content Creation",
      EVENT_ATTENDANCE: "Event Attendance",
      CUSTOM: "Custom Goal",
    },
  }
  
  return labels[locale]?.[type] || type
}

/**
 * Get objective status label based on locale
 */
export function getObjectiveStatusLabel(status: string, locale: Locale): string {
  const labels: Record<Locale, Record<string, string>> = {
    tr: {
      NOT_STARTED: "Başlamadı",
      IN_PROGRESS: "Devam Ediyor",
      ON_TRACK: "Yolunda",
      AT_RISK: "Risk Altında",
      BEHIND: "Geride",
      COMPLETED: "Tamamlandı",
      EXCEEDED: "Aşıldı",
    },
    en: {
      NOT_STARTED: "Not Started",
      IN_PROGRESS: "In Progress",
      ON_TRACK: "On Track",
      AT_RISK: "At Risk",
      BEHIND: "Behind",
      COMPLETED: "Completed",
      EXCEEDED: "Exceeded",
    },
  }
  
  return labels[locale]?.[status] || status
}

/**
 * Get performance rating label based on locale
 */
export function getPerformanceLabel(score: number, locale: Locale): string {
  const labels: Record<Locale, Record<string, string>> = {
    tr: {
      excellent: "Mükemmel",
      good: "İyi",
      average: "Ortalama",
      low: "Düşük",
      critical: "Kritik",
    },
    en: {
      excellent: "Excellent",
      good: "Good",
      average: "Average",
      low: "Low",
      critical: "Critical",
    },
  }
  
  let key: string
  if (score >= 90) key = 'excellent'
  else if (score >= 75) key = 'good'
  else if (score >= 50) key = 'average'
  else if (score >= 25) key = 'low'
  else key = 'critical'
  
  return labels[locale]?.[key] || key
}

// ============================================================================
// LOCALIZED QUALITATIVE GAINS GENERATOR
// ============================================================================

export interface ObjectiveReportItem {
  id: string
  name: string
  type: string
  targetValue: number
  currentValue: number
  achievementRate: number
  status: string
  unit: string
  weight: number
  isOverAchieved: boolean
  overAchievementRate: number
}

/**
 * Generate localized qualitative gains
 */
export function generateLocalizedQualitativeGains(
  objectives: ObjectiveReportItem[],
  locale: Locale
): LocalizedQualitativeGain[] {
  const gains: LocalizedQualitativeGain[] = []

  objectives.forEach(obj => {
    const typeLabel = getObjectiveTypeLabel(obj.type, locale)
    
    // Goal exceeded
    if (obj.isOverAchieved) {
      gains.push({
        type: 'exceeded',
        icon: '🏆',
        title: locale === 'tr' 
          ? `${typeLabel} Hedefi Aşıldı!`
          : `${typeLabel} Goal Exceeded!`,
        description: locale === 'tr'
          ? `${obj.name} hedefinin %${obj.achievementRate.toFixed(0)}'sine ulaşıldı. Hedef %${obj.overAchievementRate.toFixed(0)} oranında aşıldı.`
          : `${obj.name} goal reached ${obj.achievementRate.toFixed(0)}% of target. Goal exceeded by ${obj.overAchievementRate.toFixed(0)}%.`,
        metric: `${formatNumberLocalized(obj.currentValue, locale)} / ${formatNumberLocalized(obj.targetValue, locale)} ${obj.unit}`,
        trend: 'up'
      })
    }
    // Goal completed
    else if (obj.status === 'COMPLETED' || obj.achievementRate >= 100) {
      gains.push({
        type: 'achievement',
        icon: '✅',
        title: locale === 'tr'
          ? `${typeLabel} Hedefi Tamamlandı`
          : `${typeLabel} Goal Completed`,
        description: locale === 'tr'
          ? `${obj.name} hedefi başarıyla tamamlandı.`
          : `${obj.name} goal successfully completed.`,
        metric: `${formatNumberLocalized(obj.currentValue, locale)} ${obj.unit}`,
        trend: 'stable'
      })
    }
    // On track
    else if (obj.status === 'ON_TRACK' || obj.achievementRate >= 75) {
      gains.push({
        type: 'improvement',
        icon: '📈',
        title: locale === 'tr'
          ? `${typeLabel} İyi İlerliyor`
          : `${typeLabel} Progressing Well`,
        description: locale === 'tr'
          ? `${obj.name} hedefinin %${obj.achievementRate.toFixed(0)}'si tamamlandı ve yolunda gidiyor.`
          : `${obj.name} goal is ${obj.achievementRate.toFixed(0)}% complete and on track.`,
        metric: `${formatNumberLocalized(obj.currentValue, locale)} / ${formatNumberLocalized(obj.targetValue, locale)} ${obj.unit}`,
        trend: 'up'
      })
    }
    // At risk
    else if (obj.status === 'AT_RISK' || obj.status === 'BEHIND') {
      gains.push({
        type: 'risk',
        icon: '⚠️',
        title: locale === 'tr'
          ? `${typeLabel} Dikkat Gerektiriyor`
          : `${typeLabel} Needs Attention`,
        description: locale === 'tr'
          ? `${obj.name} hedefi geride kalıyor. Şu ana kadar %${obj.achievementRate.toFixed(0)} tamamlandı.`
          : `${obj.name} goal is falling behind. Currently ${obj.achievementRate.toFixed(0)}% complete.`,
        metric: `${formatNumberLocalized(obj.currentValue, locale)} / ${formatNumberLocalized(obj.targetValue, locale)} ${obj.unit}`,
        trend: 'down'
      })
    }
  })

  // Milestones
  const exceededCount = objectives.filter(o => o.isOverAchieved).length
  const completedCount = objectives.filter(o => o.status === 'COMPLETED' || o.achievementRate >= 100).length
  
  if (exceededCount > 0) {
    gains.unshift({
      type: 'milestone',
      icon: '🎯',
      title: locale === 'tr' ? 'Hedefler Aşıldı' : 'Goals Exceeded',
      description: locale === 'tr'
        ? `Bu kampanyada ${exceededCount} hedef belirlenen değerin üzerine çıktı.`
        : `${exceededCount} goals in this campaign exceeded their targets.`,
      trend: 'up'
    })
  }

  if (completedCount === objectives.length && objectives.length > 0) {
    gains.unshift({
      type: 'milestone',
      icon: '🌟',
      title: locale === 'tr' ? 'Tüm Hedefler Tamamlandı' : 'All Goals Completed',
      description: locale === 'tr'
        ? `Kampanyadaki ${objectives.length} hedefin tamamı başarıyla gerçekleştirildi.`
        : `All ${objectives.length} goals in the campaign have been successfully achieved.`,
      trend: 'up'
    })
  }

  return gains
}

// ============================================================================
// LOCALIZED EXECUTIVE SUMMARY GENERATOR
// ============================================================================

export interface ExecutiveSummaryData {
  campaignName: string
  overallPerformance: string
  keyAchievements: string[]
  areasOfConcern: string[]
  recommendations: string[]
  fullSummary: string
}

/**
 * Generate localized executive summary for a campaign
 */
export function generateLocalizedExecutiveSummary(
  campaignName: string,
  rooScore: number,
  rawRooScore: number,
  objectives: ObjectiveReportItem[],
  locale: Locale,
  roi?: number
): ExecutiveSummaryData {
  const keyAchievements: string[] = []
  const areasOfConcern: string[] = []
  const recommendations: string[] = []

  // Analyze objectives
  const exceededObjectives = objectives.filter(o => o.isOverAchieved)
  const completedObjectives = objectives.filter(o => o.status === 'COMPLETED' || o.achievementRate >= 100)
  const atRiskObjectives = objectives.filter(o => o.status === 'AT_RISK' || o.status === 'BEHIND')
  const onTrackObjectives = objectives.filter(o => o.status === 'ON_TRACK')

  // Overall performance rating
  const overallPerformance = getPerformanceLabel(rooScore, locale)

  // Key achievements
  exceededObjectives.forEach(obj => {
    const typeLabel = getObjectiveTypeLabel(obj.type, locale)
    keyAchievements.push(
      locale === 'tr'
        ? `${typeLabel} hedefi %${obj.overAchievementRate.toFixed(0)} oranında aşıldı (${formatNumberLocalized(obj.currentValue, locale)} ${obj.unit} / hedef: ${formatNumberLocalized(obj.targetValue, locale)} ${obj.unit}).`
        : `${typeLabel} goal exceeded by ${obj.overAchievementRate.toFixed(0)}% (${formatNumberLocalized(obj.currentValue, locale)} ${obj.unit} / target: ${formatNumberLocalized(obj.targetValue, locale)} ${obj.unit}).`
    )
  })

  completedObjectives.filter(o => !o.isOverAchieved).forEach(obj => {
    const typeLabel = getObjectiveTypeLabel(obj.type, locale)
    keyAchievements.push(
      locale === 'tr'
        ? `${typeLabel} hedefi başarıyla tamamlandı (${formatNumberLocalized(obj.currentValue, locale)} ${obj.unit}).`
        : `${typeLabel} goal successfully completed (${formatNumberLocalized(obj.currentValue, locale)} ${obj.unit}).`
    )
  })

  onTrackObjectives.forEach(obj => {
    const typeLabel = getObjectiveTypeLabel(obj.type, locale)
    keyAchievements.push(
      locale === 'tr'
        ? `${typeLabel} hedefi yolunda ilerliyor (%${obj.achievementRate.toFixed(0)} tamamlandı).`
        : `${typeLabel} goal is on track (${obj.achievementRate.toFixed(0)}% complete).`
    )
  })

  // Areas of concern
  atRiskObjectives.forEach(obj => {
    const typeLabel = getObjectiveTypeLabel(obj.type, locale)
    areasOfConcern.push(
      locale === 'tr'
        ? `${typeLabel} hedefi geride kalıyor. Şu ana kadar %${obj.achievementRate.toFixed(0)} tamamlandı (${formatNumberLocalized(obj.currentValue, locale)} / ${formatNumberLocalized(obj.targetValue, locale)} ${obj.unit}).`
        : `${typeLabel} goal is falling behind. Currently ${obj.achievementRate.toFixed(0)}% complete (${formatNumberLocalized(obj.currentValue, locale)} / ${formatNumberLocalized(obj.targetValue, locale)} ${obj.unit}).`
    )
  })

  // Recommendations
  if (atRiskObjectives.length > 0) {
    recommendations.push(
      locale === 'tr'
        ? `${atRiskObjectives.length} hedef risk altında. Bu hedefler için strateji revizyonu önerilir.`
        : `${atRiskObjectives.length} objectives are at risk. Strategy revision is recommended for these objectives.`
    )
    
    atRiskObjectives.forEach(obj => {
      const typeLabel = getObjectiveTypeLabel(obj.type, locale)
      if (obj.type === 'ENGAGEMENT' || obj.type === 'SOCIAL_FOLLOWERS') {
        recommendations.push(
          locale === 'tr'
            ? `${typeLabel} için içerik stratejisini gözden geçirin ve etkileşim odaklı kampanyalar planlayın.`
            : `Review content strategy for ${typeLabel} and plan engagement-focused campaigns.`
        )
      } else if (obj.type === 'WEBSITE_TRAFFIC' || obj.type === 'APP_DOWNLOAD') {
        recommendations.push(
          locale === 'tr'
            ? `${typeLabel} için çağrı-aksiyonu (CTA) mesajlarını güçlendirin ve yönlendirme linklerini optimize edin.`
            : `Strengthen call-to-action (CTA) messages for ${typeLabel} and optimize redirect links.`
        )
      } else if (obj.type === 'SALES' || obj.type === 'LEAD_GENERATION') {
        recommendations.push(
          locale === 'tr'
            ? `${typeLabel} için satış hunisini analiz edin ve dönüşüm oranını artıracak iyileştirmeler yapın.`
            : `Analyze the sales funnel for ${typeLabel} and implement improvements to increase conversion rate.`
        )
      }
    })
  }

  if (exceededObjectives.length > 0) {
    recommendations.push(
      locale === 'tr'
        ? `Aşılan hedeflerdeki başarılı stratejileri diğer hedeflere de uygulayın.`
        : `Apply successful strategies from exceeded goals to other objectives.`
    )
  }

  if (roi !== undefined && roi > 100 && rooScore < 75) {
    recommendations.push(
      locale === 'tr'
        ? `Finansal performans iyi ancak stratejik hedefler geride. Marka değeri odaklı aktiviteleri artırın.`
        : `Financial performance is good but strategic goals are behind. Increase brand value-focused activities.`
    )
  }

  if (roi !== undefined && roi < 50 && rooScore >= 75) {
    recommendations.push(
      locale === 'tr'
        ? `Stratejik hedefler başarılı ancak finansal getiri düşük. Monetizasyon stratejilerini gözden geçirin.`
        : `Strategic goals are successful but financial returns are low. Review monetization strategies.`
    )
  }

  // Build full summary
  const summaryParts: string[] = []

  // Introduction
  if (locale === 'tr') {
    summaryParts.push(
      `"${campaignName}" kampanyası için ROO (Return on Objectives) analizi tamamlanmıştır. ` +
      `Kampanyanın genel performansı "${overallPerformance}" olarak değerlendirilmiş olup, ` +
      `ROO skoru ${rooScore.toFixed(1)} olarak hesaplanmıştır${rawRooScore > 100 ? ` (ham skor: ${rawRooScore.toFixed(1)})` : ''}.`
    )
  } else {
    summaryParts.push(
      `ROO (Return on Objectives) analysis for "${campaignName}" campaign has been completed. ` +
      `The campaign's overall performance is rated as "${overallPerformance}" ` +
      `with an ROO score of ${rooScore.toFixed(1)}${rawRooScore > 100 ? ` (raw score: ${rawRooScore.toFixed(1)})` : ''}.`
    )
  }

  // Objective summary
  const completedAndExceeded = completedObjectives.length + exceededObjectives.length
  if (locale === 'tr') {
    summaryParts.push(
      `\n\nKampanyada toplam ${objectives.length} hedef tanımlanmıştır. ` +
      `Bu hedeflerden ${completedAndExceeded} tanesi tamamlanmış veya aşılmış, ` +
      `${onTrackObjectives.length} tanesi yolunda ilerlemekte, ` +
      `${atRiskObjectives.length} tanesi ise dikkat gerektirmektedir.`
    )
  } else {
    summaryParts.push(
      `\n\nThe campaign has ${objectives.length} defined objectives. ` +
      `${completedAndExceeded} have been completed or exceeded, ` +
      `${onTrackObjectives.length} are on track, ` +
      `and ${atRiskObjectives.length} require attention.`
    )
  }

  // Key achievements
  if (keyAchievements.length > 0) {
    const title = locale === 'tr' ? '**Öne Çıkan Başarılar:**' : '**Key Achievements:**'
    summaryParts.push(
      `\n\n${title}\n` +
      keyAchievements.slice(0, 3).map(a => `• ${a}`).join('\n')
    )
  }

  // Areas of concern
  if (areasOfConcern.length > 0) {
    const title = locale === 'tr' ? '**Dikkat Gerektiren Alanlar:**' : '**Areas of Concern:**'
    summaryParts.push(
      `\n\n${title}\n` +
      areasOfConcern.map(a => `• ${a}`).join('\n')
    )
  }

  // Recommendations
  if (recommendations.length > 0) {
    const title = locale === 'tr' ? '**Öneriler:**' : '**Recommendations:**'
    summaryParts.push(
      `\n\n${title}\n` +
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

// ============================================================================
// LOCALIZED ORGANIZATION EXECUTIVE SUMMARY
// ============================================================================

export interface CampaignROOReport {
  campaignId: string
  campaignName: string
  rooScore: number
  rawRooScore: number
  performanceCategory: string
  performanceLabel: string
  objectives: ObjectiveReportItem[]
}

/**
 * Generate localized organization executive summary
 */
export function generateLocalizedOrganizationSummary(
  organizationName: string,
  rooReports: CampaignROOReport[],
  totalRevenue: number,
  totalExpenses: number,
  avgROI: number,
  avgROO: number,
  locale: Locale
): string {
  const summaryParts: string[] = []
  
  const netProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
  
  // Campaign statistics
  const excellentCampaigns = rooReports.filter(r => r.rooScore >= 90)
  const goodCampaigns = rooReports.filter(r => r.rooScore >= 75 && r.rooScore < 90)
  const atRiskCampaigns = rooReports.filter(r => r.rooScore < 50)
  
  // All objectives
  const allObjectives = rooReports.flatMap(r => r.objectives)
  const exceededObjectives = allObjectives.filter(o => o.isOverAchieved)
  const completedObjectives = allObjectives.filter(o => o.status === 'COMPLETED' || o.achievementRate >= 100)
  const atRiskObjectives = allObjectives.filter(o => o.status === 'AT_RISK' || o.status === 'BEHIND')

  // Introduction
  if (locale === 'tr') {
    summaryParts.push(
      `## ${organizationName} - Sponsorluk Performans Özeti\n\n` +
      `Bu rapor, belirlenen dönem içindeki sponsorluk faaliyetlerinin kapsamlı bir analizini sunmaktadır.`
    )
  } else {
    summaryParts.push(
      `## ${organizationName} - Sponsorship Performance Summary\n\n` +
      `This report provides a comprehensive analysis of sponsorship activities during the specified period.`
    )
  }

  // Financial summary
  const revenueFormatted = formatCurrencyLocalized(totalRevenue, locale)
  const expensesFormatted = formatCurrencyLocalized(totalExpenses, locale)
  const profitFormatted = formatCurrencyLocalized(netProfit, locale)
  
  if (locale === 'tr') {
    summaryParts.push(
      `\n\n### Finansal Performans\n` +
      `Dönem içinde toplam **${revenueFormatted}** gelir elde edilmiş, ` +
      `**${expensesFormatted}** harcama yapılmıştır. ` +
      `Net kar **${profitFormatted}** olup, kar marjı **%${profitMargin.toFixed(1)}** olarak gerçekleşmiştir. ` +
      `Ortalama ROI **%${avgROI.toFixed(1)}** seviyesindedir.`
    )
  } else {
    summaryParts.push(
      `\n\n### Financial Performance\n` +
      `During the period, total revenue of **${revenueFormatted}** was generated with ` +
      `**${expensesFormatted}** in expenses. ` +
      `Net profit is **${profitFormatted}** with a profit margin of **${profitMargin.toFixed(1)}%**. ` +
      `Average ROI is **${avgROI.toFixed(1)}%**.`
    )
  }

  // Strategic goal summary
  if (locale === 'tr') {
    summaryParts.push(
      `\n\n### Stratejik Hedef Performansı (ROO)\n` +
      `Toplam **${rooReports.length}** kampanyada **${allObjectives.length}** stratejik hedef tanımlanmıştır. ` +
      `Ortalama ROO skoru **${avgROO.toFixed(1)}** olarak hesaplanmıştır.\n\n` +
      `• **${completedObjectives.length + exceededObjectives.length}** hedef başarıyla tamamlandı veya aşıldı\n` +
      `• **${exceededObjectives.length}** hedef belirlenen değerin üzerine çıktı\n` +
      `• **${atRiskObjectives.length}** hedef dikkat gerektiriyor`
    )
  } else {
    summaryParts.push(
      `\n\n### Strategic Goal Performance (ROO)\n` +
      `A total of **${allObjectives.length}** strategic objectives were defined across **${rooReports.length}** campaigns. ` +
      `Average ROO score is **${avgROO.toFixed(1)}**.\n\n` +
      `• **${completedObjectives.length + exceededObjectives.length}** objectives successfully completed or exceeded\n` +
      `• **${exceededObjectives.length}** objectives exceeded their targets\n` +
      `• **${atRiskObjectives.length}** objectives require attention`
    )
  }

  // Campaign performance distribution
  if (locale === 'tr') {
    summaryParts.push(
      `\n\n### Kampanya Performans Dağılımı\n` +
      `• **${excellentCampaigns.length}** kampanya mükemmel performans gösterdi (ROO ≥90)\n` +
      `• **${goodCampaigns.length}** kampanya iyi performans gösterdi (ROO 75-90)\n` +
      `• **${atRiskCampaigns.length}** kampanya iyileştirme gerektiriyor (ROO <50)`
    )
  } else {
    summaryParts.push(
      `\n\n### Campaign Performance Distribution\n` +
      `• **${excellentCampaigns.length}** campaigns showed excellent performance (ROO ≥90)\n` +
      `• **${goodCampaigns.length}** campaigns showed good performance (ROO 75-90)\n` +
      `• **${atRiskCampaigns.length}** campaigns need improvement (ROO <50)`
    )
  }

  // Key qualitative achievements
  if (exceededObjectives.length > 0) {
    const topExceeded = exceededObjectives
      .sort((a, b) => b.overAchievementRate - a.overAchievementRate)
      .slice(0, 3)
    
    const title = locale === 'tr' ? '### Öne Çıkan Niteliksel Kazanımlar' : '### Key Qualitative Achievements'
    summaryParts.push(
      `\n\n${title}\n` +
      topExceeded.map(obj => {
        const typeLabel = getObjectiveTypeLabel(obj.type, locale)
        const campaign = rooReports.find(r => r.objectives.some(o => o.id === obj.id))
        return locale === 'tr'
          ? `• **${typeLabel}** hedefi %${obj.overAchievementRate.toFixed(0)} oranında aşıldı${campaign ? ` (${campaign.campaignName})` : ''}`
          : `• **${typeLabel}** goal exceeded by ${obj.overAchievementRate.toFixed(0)}%${campaign ? ` (${campaign.campaignName})` : ''}`
      }).join('\n')
    )
  }

  // Conclusion and recommendations
  const conclusionTitle = locale === 'tr' ? '### Sonuç ve Öneriler' : '### Conclusion and Recommendations'
  summaryParts.push(`\n\n${conclusionTitle}\n`)

  if (avgROO >= 75 && avgROI >= 100) {
    summaryParts.push(
      locale === 'tr'
        ? `Sponsorluk faaliyetleri hem finansal hem de stratejik hedefler açısından başarılı bir performans sergilemiştir. Mevcut stratejilerin sürdürülmesi ve başarılı kampanya modellerinin diğer projelere uygulanması önerilmektedir.`
        : `Sponsorship activities have demonstrated successful performance in both financial and strategic goals. Continuation of current strategies and application of successful campaign models to other projects is recommended.`
    )
  } else if (avgROI >= 100 && avgROO < 75) {
    summaryParts.push(
      locale === 'tr'
        ? `Finansal performans tatmin edici olmakla birlikte, stratejik hedeflerde iyileştirme alanları bulunmaktadır. Marka bilinirliği ve etkileşim odaklı aktivitelerin artırılması önerilmektedir.`
        : `While financial performance is satisfactory, there are areas for improvement in strategic goals. Increasing brand awareness and engagement-focused activities is recommended.`
    )
  } else if (avgROI < 100 && avgROO >= 75) {
    summaryParts.push(
      locale === 'tr'
        ? `Stratejik hedefler başarılı bir şekilde gerçekleştirilmekte, ancak finansal getiri beklentilerin altında kalmaktadır. Monetizasyon stratejilerinin gözden geçirilmesi ve sponsorluk paketlerinin yeniden değerlendirilmesi önerilmektedir.`
        : `Strategic goals are being successfully achieved, but financial returns are below expectations. Review of monetization strategies and re-evaluation of sponsorship packages is recommended.`
    )
  } else {
    summaryParts.push(
      locale === 'tr'
        ? `Hem finansal hem de stratejik performansta iyileştirme alanları tespit edilmiştir. Kapsamlı bir strateji revizyonu ve hedef-bütçe optimizasyonu önerilmektedir.`
        : `Areas for improvement have been identified in both financial and strategic performance. A comprehensive strategy revision and goal-budget optimization is recommended.`
    )
  }

  if (atRiskCampaigns.length > 0) {
    summaryParts.push(
      locale === 'tr'
        ? `\n\n**Acil Aksiyon:** ${atRiskCampaigns.length} kampanya kritik seviyede performans göstermektedir ve öncelikli müdahale gerektirmektedir.`
        : `\n\n**Urgent Action:** ${atRiskCampaigns.length} campaigns are showing critical performance and require priority intervention.`
    )
  }

  return summaryParts.join('')
}

// ============================================================================
// PDF EXPORT WITH LOCALE
// ============================================================================

export interface PDFExportOptions {
  locale: Locale
  elementId: string
  filename: string
  title?: string
  subtitle?: string
  showConfidential?: boolean
}

/**
 * Export report to PDF with localized headers and footers
 */
export async function exportLocalizedPDF(options: PDFExportOptions): Promise<void> {
  const { default: jsPDF } = await import("jspdf")
  const { default: html2canvas } = await import("html2canvas")

  const element = document.getElementById(options.elementId)
  if (!element) {
    throw new Error(options.locale === 'tr' ? "Rapor elementi bulunamadı" : "Report element not found")
  }

  // Capture HTML as canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  })

  const imgData = canvas.toDataURL("image/png")
  const imgWidth = 210 // A4 width (mm)
  const pageHeight = 297 // A4 height (mm)
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  let heightLeft = imgHeight
  let position = 0

  const pdf = new jsPDF("p", "mm", "a4")

  // PDF metadata
  const title = options.title || (options.locale === 'tr' ? 'Sponsorluk Performans Raporu' : 'Sponsorship Performance Report')
  const subtitle = options.subtitle || (options.locale === 'tr' ? 'Detaylı Analiz ve Öneriler' : 'Detailed Analysis and Recommendations')
  
  // Add header to first page
  pdf.setFontSize(16)
  pdf.setTextColor(88, 28, 135) // violet-800
  pdf.text(title, 105, 15, { align: 'center' })
  
  pdf.setFontSize(10)
  pdf.setTextColor(107, 114, 128) // gray-500
  pdf.text(subtitle, 105, 22, { align: 'center' })
  
  if (options.showConfidential) {
    pdf.setFontSize(8)
    pdf.setTextColor(220, 38, 38) // red-600
    const confidentialText = options.locale === 'tr' ? 'GİZLİ - Sadece Yetkili Kişiler İçin' : 'CONFIDENTIAL - Authorized Personnel Only'
    pdf.text(confidentialText, 105, 28, { align: 'center' })
  }

  // Add content
  pdf.addImage(imgData, "PNG", 0, 35, imgWidth, imgHeight)
  heightLeft -= (pageHeight - 35)

  // Add pages if content is long
  let pageNum = 1
  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pageNum++
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  // Add footer to all pages
  const totalPages = pdf.getNumberOfPages()
  const pageText = options.locale === 'tr' ? 'Sayfa' : 'Page'
  const ofText = options.locale === 'tr' ? '/' : 'of'
  const generatedByText = options.locale === 'tr' ? 'DevRetain CRM tarafından oluşturuldu' : 'Generated by DevRetain CRM'
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(156, 163, 175) // gray-400
    pdf.text(`${pageText} ${i} ${ofText} ${totalPages}`, 105, 290, { align: 'center' })
    pdf.text(generatedByText, 105, 294, { align: 'center' })
  }

  pdf.save(`${options.filename}.pdf`)
}

// ============================================================================
// LOCALIZED FORMATTING HELPERS
// ============================================================================

export function formatLocalizedCurrency(value: number, locale: Locale): string {
  return formatCurrencyLocalized(value, locale)
}

export function formatLocalizedNumber(value: number, locale: Locale): string {
  return formatNumberLocalized(value, locale)
}

export function formatLocalizedDate(date: Date, locale: Locale): string {
  return formatDateLocalized(date, locale)
}

export function formatLocalizedDateTime(date: Date, locale: Locale): string {
  return formatDateTimeLocalized(date, locale)
}

export function formatLocalizedPercent(value: number, locale: Locale): string {
  return formatPercentageLocalized(value, locale)
}
