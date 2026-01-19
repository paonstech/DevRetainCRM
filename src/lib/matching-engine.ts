/**
 * Matching Engine - Sponsor ve Yayıncı Eşleştirme Algoritması
 * 
 * Bu modül, sponsorların hedeflerini (ROO hedefleri) yayıncıların verileriyle
 * (ROI geçmişi, kitle demografisi, performans metrikleri) eşleştirerek
 * en uygun iş birliği önerilerini oluşturur.
 */

// Types
export interface SponsorGoal {
  id: string
  type: 'AUDIENCE_REACH' | 'BRAND_AWARENESS' | 'ENGAGEMENT' | 'CONVERSION' | 'APP_DOWNLOAD' | 'LEAD_GENERATION'
  targetAgeGroup?: string // e.g., "18-24", "25-34"
  targetGender?: 'male' | 'female' | 'all'
  targetLocations?: string[]
  targetCategories?: string[]
  minROI?: number
  minROO?: number
  budgetRange?: { min: number; max: number }
  priority: number // 1-10, higher is more important
}

export interface CreatorProfile {
  id: string
  name: string
  type: 'YOUTUBER' | 'CLUB'
  category: string
  followers: number
  avgViews: number
  engagementRate: number
  avgROI: number
  avgROO: number
  completedCampaigns: number
  trustScore: number
  verified: boolean
  audience: {
    ageGroups: { range: string; percentage: number }[]
    gender: { male: number; female: number }
    topLocations: string[]
  }
  pricing: {
    min: number
    max: number
  }
  tags: string[]
  pastCampaignCategories: string[]
  rooHistory: {
    category: string
    avgScore: number
    campaignCount: number
  }[]
}

export interface SponsorProfile {
  id: string
  name: string
  industry: string
  totalSponsored: number
  avgPaymentSpeed: number
  collaborationScore: number
  completedDeals: number
  trustScore: number
  preferredCategories: string[]
  budgetRange: { min: number; max: number }
  goals: SponsorGoal[]
}

export interface MatchResult {
  id: string
  creatorId: string
  creatorName: string
  sponsorId: string
  sponsorName: string
  matchScore: number // 0-100
  matchReasons: MatchReason[]
  audienceMatch: number // 0-100
  performanceMatch: number // 0-100
  budgetMatch: number // 0-100
  categoryMatch: number // 0-100
  potentialROI: number
  potentialROO: number
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  createdAt: Date
  expiresAt: Date
  status: 'NEW' | 'VIEWED' | 'CONTACTED' | 'DECLINED' | 'ACCEPTED'
}

export interface MatchReason {
  type: 'AUDIENCE' | 'PERFORMANCE' | 'BUDGET' | 'CATEGORY' | 'HISTORY'
  description: string
  score: number // contribution to overall match score
  highlight?: boolean // should be prominently displayed
}

// Weights for different matching criteria
const MATCHING_WEIGHTS = {
  audienceMatch: 0.30,      // 30% - Kitle uyumu
  performanceMatch: 0.25,   // 25% - Performans geçmişi
  categoryMatch: 0.20,      // 20% - Kategori uyumu
  budgetMatch: 0.15,        // 15% - Bütçe uyumu
  trustScore: 0.10,         // 10% - Güven skoru
}

/**
 * Ana eşleştirme fonksiyonu
 * Bir sponsor için en uygun yayıncıları bulur
 */
export function findMatchesForSponsor(
  sponsor: SponsorProfile,
  creators: CreatorProfile[],
  limit: number = 10
): MatchResult[] {
  const matches: MatchResult[] = []

  for (const creator of creators) {
    const matchResult = calculateMatch(sponsor, creator)
    if (matchResult.matchScore >= 50) { // Minimum %50 eşleşme
      matches.push(matchResult)
    }
  }

  // Sort by match score descending
  matches.sort((a, b) => b.matchScore - a.matchScore)

  return matches.slice(0, limit)
}

/**
 * Bir yayıncı için en uygun sponsorları bulur
 */
export function findMatchesForCreator(
  creator: CreatorProfile,
  sponsors: SponsorProfile[],
  limit: number = 10
): MatchResult[] {
  const matches: MatchResult[] = []

  for (const sponsor of sponsors) {
    const matchResult = calculateMatch(sponsor, creator)
    if (matchResult.matchScore >= 50) {
      matches.push(matchResult)
    }
  }

  matches.sort((a, b) => b.matchScore - a.matchScore)

  return matches.slice(0, limit)
}

/**
 * İki taraf arasındaki eşleşme skorunu hesaplar
 */
function calculateMatch(sponsor: SponsorProfile, creator: CreatorProfile): MatchResult {
  const matchReasons: MatchReason[] = []

  // 1. Kitle Uyumu Hesaplama
  const audienceMatch = calculateAudienceMatch(sponsor.goals, creator.audience, matchReasons)

  // 2. Performans Uyumu Hesaplama
  const performanceMatch = calculatePerformanceMatch(sponsor.goals, creator, matchReasons)

  // 3. Kategori Uyumu Hesaplama
  const categoryMatch = calculateCategoryMatch(sponsor, creator, matchReasons)

  // 4. Bütçe Uyumu Hesaplama
  const budgetMatch = calculateBudgetMatch(sponsor.budgetRange, creator.pricing, matchReasons)

  // 5. Güven Skoru Faktörü
  const trustFactor = (creator.trustScore / 100) * 100

  // Ağırlıklı toplam skor
  const matchScore = Math.round(
    audienceMatch * MATCHING_WEIGHTS.audienceMatch +
    performanceMatch * MATCHING_WEIGHTS.performanceMatch +
    categoryMatch * MATCHING_WEIGHTS.categoryMatch +
    budgetMatch * MATCHING_WEIGHTS.budgetMatch +
    trustFactor * MATCHING_WEIGHTS.trustScore
  )

  // Potansiyel ROI ve ROO tahmini
  const potentialROI = estimatePotentialROI(sponsor, creator)
  const potentialROO = estimatePotentialROO(sponsor, creator)

  // Güven seviyesi belirleme
  const confidence = determineConfidence(matchScore, creator.completedCampaigns, creator.verified)

  return {
    id: `match-${sponsor.id}-${creator.id}-${Date.now()}`,
    creatorId: creator.id,
    creatorName: creator.name,
    sponsorId: sponsor.id,
    sponsorName: sponsor.name,
    matchScore,
    matchReasons: matchReasons.sort((a, b) => b.score - a.score),
    audienceMatch,
    performanceMatch,
    budgetMatch,
    categoryMatch,
    potentialROI,
    potentialROO,
    confidence,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün geçerli
    status: 'NEW',
  }
}

/**
 * Kitle uyumu hesaplama
 */
function calculateAudienceMatch(
  goals: SponsorGoal[],
  audience: CreatorProfile['audience'],
  reasons: MatchReason[]
): number {
  let totalScore = 0
  let totalWeight = 0

  for (const goal of goals) {
    const weight = goal.priority / 10

    // Yaş grubu eşleşmesi
    if (goal.targetAgeGroup) {
      const ageGroup = audience.ageGroups.find(ag => ag.range === goal.targetAgeGroup)
      if (ageGroup) {
        const ageScore = Math.min(100, ageGroup.percentage * 2.5) // Max 100 for 40%+ match
        totalScore += ageScore * weight
        totalWeight += weight

        if (ageGroup.percentage >= 30) {
          reasons.push({
            type: 'AUDIENCE',
            description: `Hedef yaş grubu (${goal.targetAgeGroup}) kitlenin %${ageGroup.percentage}'ini oluşturuyor`,
            score: ageScore * weight,
            highlight: ageGroup.percentage >= 40,
          })
        }
      }
    }

    // Cinsiyet eşleşmesi
    if (goal.targetGender && goal.targetGender !== 'all') {
      const genderPercentage = goal.targetGender === 'male' ? audience.gender.male : audience.gender.female
      const genderScore = Math.min(100, genderPercentage * 1.5)
      totalScore += genderScore * weight * 0.5
      totalWeight += weight * 0.5

      if (genderPercentage >= 50) {
        reasons.push({
          type: 'AUDIENCE',
          description: `Hedef cinsiyet (${goal.targetGender === 'male' ? 'Erkek' : 'Kadın'}) kitlenin %${genderPercentage}'i`,
          score: genderScore * weight * 0.5,
        })
      }
    }

    // Lokasyon eşleşmesi
    if (goal.targetLocations && goal.targetLocations.length > 0) {
      const matchingLocations = goal.targetLocations.filter(loc => 
        audience.topLocations.includes(loc)
      )
      if (matchingLocations.length > 0) {
        const locationScore = (matchingLocations.length / goal.targetLocations.length) * 100
        totalScore += locationScore * weight * 0.5
        totalWeight += weight * 0.5

        reasons.push({
          type: 'AUDIENCE',
          description: `Hedef lokasyonlardan ${matchingLocations.length} tanesi (${matchingLocations.join(', ')}) eşleşiyor`,
          score: locationScore * weight * 0.5,
        })
      }
    }
  }

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50
}

/**
 * Performans uyumu hesaplama
 */
function calculatePerformanceMatch(
  goals: SponsorGoal[],
  creator: CreatorProfile,
  reasons: MatchReason[]
): number {
  let totalScore = 0
  let factors = 0

  // ROI geçmişi kontrolü
  const avgMinROI = goals.reduce((sum, g) => sum + (g.minROI || 0), 0) / goals.length
  if (creator.avgROI >= avgMinROI) {
    const roiScore = Math.min(100, (creator.avgROI / Math.max(avgMinROI, 15)) * 80)
    totalScore += roiScore
    factors++

    reasons.push({
      type: 'PERFORMANCE',
      description: `Ortalama ROI %${creator.avgROI} (hedef: %${avgMinROI.toFixed(0)})`,
      score: roiScore,
      highlight: creator.avgROI >= avgMinROI * 1.2,
    })
  }

  // ROO geçmişi kontrolü
  const avgMinROO = goals.reduce((sum, g) => sum + (g.minROO || 0), 0) / goals.length
  if (creator.avgROO >= avgMinROO) {
    const rooScore = Math.min(100, (creator.avgROO / Math.max(avgMinROO, 70)) * 85)
    totalScore += rooScore
    factors++

    if (creator.avgROO >= 80) {
      reasons.push({
        type: 'PERFORMANCE',
        description: `Ortalama ROO skoru ${creator.avgROO}/100 - Yüksek hedef başarısı`,
        score: rooScore,
        highlight: creator.avgROO >= 85,
      })
    }
  }

  // Kategori bazlı ROO geçmişi
  for (const goal of goals) {
    if (goal.targetCategories) {
      for (const category of goal.targetCategories) {
        const categoryHistory = creator.rooHistory.find(h => 
          h.category.toLowerCase() === category.toLowerCase()
        )
        if (categoryHistory && categoryHistory.avgScore >= 80) {
          const historyScore = categoryHistory.avgScore
          totalScore += historyScore * 0.5
          factors += 0.5

          reasons.push({
            type: 'HISTORY',
            description: `${category} kategorisinde ${categoryHistory.campaignCount} kampanyada %${categoryHistory.avgScore} ROO başarısı`,
            score: historyScore * 0.5,
            highlight: categoryHistory.avgScore >= 85 && categoryHistory.campaignCount >= 3,
          })
        }
      }
    }
  }

  // Etkileşim oranı
  if (creator.engagementRate >= 5) {
    const engagementScore = Math.min(100, creator.engagementRate * 10)
    totalScore += engagementScore * 0.3
    factors += 0.3

    reasons.push({
      type: 'PERFORMANCE',
      description: `%${creator.engagementRate} etkileşim oranı`,
      score: engagementScore * 0.3,
    })
  }

  return factors > 0 ? Math.round(totalScore / factors) : 50
}

/**
 * Kategori uyumu hesaplama
 */
function calculateCategoryMatch(
  sponsor: SponsorProfile,
  creator: CreatorProfile,
  reasons: MatchReason[]
): number {
  // Doğrudan kategori eşleşmesi
  if (sponsor.preferredCategories.includes(creator.category)) {
    reasons.push({
      type: 'CATEGORY',
      description: `${creator.category} kategorisi sponsorun tercih listesinde`,
      score: 100,
      highlight: true,
    })
    return 100
  }

  // Geçmiş kampanya kategorileri ile eşleşme
  const matchingCategories = sponsor.preferredCategories.filter(cat =>
    creator.pastCampaignCategories.includes(cat)
  )

  if (matchingCategories.length > 0) {
    const score = (matchingCategories.length / sponsor.preferredCategories.length) * 80
    reasons.push({
      type: 'CATEGORY',
      description: `${matchingCategories.join(', ')} kategorilerinde deneyim mevcut`,
      score,
    })
    return Math.round(score)
  }

  // Tag bazlı eşleşme (daha düşük skor)
  const tagMatches = creator.tags.filter(tag =>
    sponsor.preferredCategories.some(cat => 
      cat.toLowerCase().includes(tag.toLowerCase()) ||
      tag.toLowerCase().includes(cat.toLowerCase())
    )
  )

  if (tagMatches.length > 0) {
    const score = Math.min(60, tagMatches.length * 15)
    reasons.push({
      type: 'CATEGORY',
      description: `İlgili etiketler: ${tagMatches.join(', ')}`,
      score,
    })
    return score
  }

  return 30 // Minimum skor
}

/**
 * Bütçe uyumu hesaplama
 */
function calculateBudgetMatch(
  sponsorBudget: { min: number; max: number },
  creatorPricing: { min: number; max: number },
  reasons: MatchReason[]
): number {
  // Bütçe aralıkları örtüşüyor mu?
  const overlap = Math.min(sponsorBudget.max, creatorPricing.max) - 
                  Math.max(sponsorBudget.min, creatorPricing.min)

  if (overlap <= 0) {
    // Örtüşme yok
    const gap = Math.abs(sponsorBudget.max - creatorPricing.min)
    const gapPercentage = gap / creatorPricing.min
    
    if (gapPercentage <= 0.2) {
      reasons.push({
        type: 'BUDGET',
        description: `Bütçe aralığı yakın - pazarlık yapılabilir`,
        score: 60,
      })
      return 60
    }
    return 20
  }

  // Örtüşme var
  const sponsorRange = sponsorBudget.max - sponsorBudget.min
  const overlapPercentage = (overlap / sponsorRange) * 100

  if (overlapPercentage >= 50) {
    reasons.push({
      type: 'BUDGET',
      description: `Bütçe aralıkları %${Math.round(overlapPercentage)} örtüşüyor`,
      score: Math.min(100, overlapPercentage + 20),
      highlight: overlapPercentage >= 70,
    })
    return Math.min(100, Math.round(overlapPercentage + 20))
  }

  reasons.push({
    type: 'BUDGET',
    description: `Kısmi bütçe uyumu mevcut`,
    score: Math.round(overlapPercentage + 30),
  })
  return Math.round(overlapPercentage + 30)
}

/**
 * Potansiyel ROI tahmini
 */
function estimatePotentialROI(sponsor: SponsorProfile, creator: CreatorProfile): number {
  // Basit tahmin: Yayıncının geçmiş ROI'si + kategori uyumu bonusu
  let baseROI = creator.avgROI

  // Kategori uyumu varsa bonus
  if (sponsor.preferredCategories.includes(creator.category)) {
    baseROI *= 1.1
  }

  // Yüksek güven skoru bonusu
  if (creator.trustScore >= 90) {
    baseROI *= 1.05
  }

  return Math.round(baseROI * 10) / 10
}

/**
 * Potansiyel ROO tahmini
 */
function estimatePotentialROO(sponsor: SponsorProfile, creator: CreatorProfile): number {
  let baseROO = creator.avgROO

  // Kategori bazlı ROO geçmişi varsa kullan
  const categoryHistory = creator.rooHistory.find(h =>
    sponsor.preferredCategories.includes(h.category)
  )

  if (categoryHistory) {
    baseROO = (baseROO + categoryHistory.avgScore) / 2
  }

  return Math.round(baseROO)
}

/**
 * Güven seviyesi belirleme
 */
function determineConfidence(
  matchScore: number,
  completedCampaigns: number,
  verified: boolean
): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (matchScore >= 80 && completedCampaigns >= 10 && verified) {
    return 'HIGH'
  }
  if (matchScore >= 60 && completedCampaigns >= 5) {
    return 'MEDIUM'
  }
  return 'LOW'
}

// ============================================================================
// Bildirim Oluşturma
// ============================================================================

export interface MatchNotification {
  id: string
  recipientId: string
  recipientType: 'SPONSOR' | 'CREATOR'
  matchId: string
  sponsorId: string
  creatorId: string
  title: string
  message: string
  matchScore: number
  highlights: string[]
  actionUrl: string
  createdAt: Date
  read: boolean
}

/**
 * Eşleşme bildirimi oluştur
 */
export function createMatchNotification(
  match: MatchResult,
  recipientType: 'SPONSOR' | 'CREATOR'
): MatchNotification {
  const highlights = match.matchReasons
    .filter(r => r.highlight)
    .map(r => r.description)
    .slice(0, 3)

  if (recipientType === 'SPONSOR') {
    return {
      id: `notif-${match.id}-sponsor`,
      recipientId: match.sponsorId,
      recipientType: 'SPONSOR',
      matchId: match.id,
      sponsorId: match.sponsorId,
      creatorId: match.creatorId,
      title: '🎯 Yeni Bir Fırsat Var!',
      message: `${match.creatorName} sizin hedeflerinizle %${match.matchScore} uyumlu! ${
        match.confidence === 'HIGH' ? 'Yüksek güvenilirlikli eşleşme.' : ''
      }`,
      matchScore: match.matchScore,
      highlights,
      actionUrl: `/matches/${match.id}`,
      createdAt: new Date(),
      read: false,
    }
  }

  return {
    id: `notif-${match.id}-creator`,
    recipientId: match.creatorId,
    recipientType: 'CREATOR',
    matchId: match.id,
    sponsorId: match.sponsorId,
    creatorId: match.creatorId,
    title: '🎯 Yeni Bir Fırsat Var!',
    message: `${match.sponsorName} sizinle çalışmak istiyor! Eşleşme skoru: %${match.matchScore}`,
    matchScore: match.matchScore,
    highlights,
    actionUrl: `/matches/${match.id}`,
    createdAt: new Date(),
    read: false,
  }
}

/**
 * Toplu eşleştirme ve bildirim gönderme
 */
export function runMatchingEngine(
  sponsors: SponsorProfile[],
  creators: CreatorProfile[]
): { matches: MatchResult[]; notifications: MatchNotification[] } {
  const allMatches: MatchResult[] = []
  const allNotifications: MatchNotification[] = []

  for (const sponsor of sponsors) {
    const matches = findMatchesForSponsor(sponsor, creators, 5)
    
    for (const match of matches) {
      allMatches.push(match)
      
      // Her iki tarafa da bildirim gönder
      allNotifications.push(createMatchNotification(match, 'SPONSOR'))
      allNotifications.push(createMatchNotification(match, 'CREATOR'))
    }
  }

  return { matches: allMatches, notifications: allNotifications }
}

// ============================================================================
// Mock Data for Testing
// ============================================================================

/**
 * Mock Creator Profiles - Kategori bazlı mantıklı korelasyonlarla
 * 
 * TEKNOLOJİ: Yüksek ROI (28-35%), Düşük-Orta ROO (68-78%), Düşük Engagement (5-8%)
 * OYUN/ESPOR: Orta-Yüksek ROI (22-32%), Çok Yüksek ROO (85-95%), Çok Yüksek Engagement (12-18%)
 * SAĞLIK: Orta ROI (16-24%), Çok Yüksek ROO (88-95%), Yüksek Engagement (9-14%)
 * GIDA: Orta ROI (15-24%), Yüksek ROO (82-90%), Çok Yüksek Engagement (11-16%)
 * EĞİTİM: Orta ROI (18-26%), Çok Yüksek ROO (88-96%), Düşük Engagement (5-9%)
 * FİNANS: Yüksek ROI (26-35%), Düşük ROO (60-72%), Düşük Engagement (4-7%)
 */
export const mockCreators: CreatorProfile[] = [
  // TEKNOLOJİ - Yüksek ROI, Düşük-Orta ROO, Düşük Engagement
  {
    id: 'creator-1',
    name: 'TechVision TR',
    type: 'YOUTUBER',
    category: 'Teknoloji',
    followers: 2450000,
    avgViews: 485000,
    engagementRate: 6.2,  // Düşük - pasif izleyici
    avgROI: 31.5,  // Yüksek - doğrudan satış dönüşümü
    avgROO: 72,  // Düşük-orta - niş kitle
    completedCampaigns: 67,
    trustScore: 96,
    verified: true,
    audience: {
      ageGroups: [
        { range: '18-24', percentage: 22 },
        { range: '25-34', percentage: 45 },
        { range: '35-44', percentage: 25 },
        { range: '45+', percentage: 8 },
      ],
      gender: { male: 78, female: 22 },
      topLocations: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'],
    },
    pricing: { min: 65000, max: 180000 },
    tags: ['teknoloji', 'yazılım', 'gadget', 'review', 'eğitim'],
    pastCampaignCategories: ['Teknoloji', 'Yazılım', 'Finans', 'E-ticaret'],
    rooHistory: [
      { category: 'Teknoloji', avgScore: 74, campaignCount: 42 },
      { category: 'Yazılım', avgScore: 71, campaignCount: 18 },
      { category: 'Finans', avgScore: 68, campaignCount: 7 },
    ],
  },
  // OYUN - Orta-Yüksek ROI, Çok Yüksek ROO, Çok Yüksek Engagement
  {
    id: 'creator-2',
    name: 'Gaming Universe',
    type: 'YOUTUBER',
    category: 'Oyun',
    followers: 1850000,
    avgViews: 425000,
    engagementRate: 14.8,  // Çok yüksek - aktif topluluk
    avgROI: 26.4,  // Orta-yüksek - impulsif alım
    avgROO: 89,  // Çok yüksek - marka sadakati
    completedCampaigns: 48,
    trustScore: 91,
    verified: true,
    audience: {
      ageGroups: [
        { range: '18-24', percentage: 58 },
        { range: '25-34', percentage: 32 },
        { range: '35-44', percentage: 8 },
        { range: '45+', percentage: 2 },
      ],
      gender: { male: 82, female: 18 },
      topLocations: ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'],
    },
    pricing: { min: 40000, max: 110000 },
    tags: ['oyun', 'espor', 'canlı yayın', 'gaming', 'review'],
    pastCampaignCategories: ['Oyun', 'Teknoloji', 'Gıda'],
    rooHistory: [
      { category: 'Oyun', avgScore: 92, campaignCount: 32 },
      { category: 'Teknoloji', avgScore: 86, campaignCount: 12 },
      { category: 'Gıda', avgScore: 88, campaignCount: 4 },
    ],
  },
  // ESPOR KULÜBÜ - Orta ROI, Çok Yüksek ROO, En Yüksek Engagement
  {
    id: 'creator-3',
    name: 'Beşiktaş Espor',
    type: 'CLUB',
    category: 'Espor',
    followers: 3200000,
    avgViews: 768000,
    engagementRate: 16.5,  // En yüksek - taraftar bağı
    avgROI: 22.8,  // Orta - marka bilinirliği odaklı
    avgROO: 94,  // Çok yüksek - duygusal bağ
    completedCampaigns: 78,
    trustScore: 98,
    verified: true,
    audience: {
      ageGroups: [
        { range: '18-24', percentage: 42 },
        { range: '25-34', percentage: 38 },
        { range: '35-44', percentage: 15 },
        { range: '45+', percentage: 5 },
      ],
      gender: { male: 76, female: 24 },
      topLocations: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Konya'],
    },
    pricing: { min: 200000, max: 500000 },
    tags: ['espor', 'lol', 'valorant', 'cs2', 'beşiktaş'],
    pastCampaignCategories: ['Espor', 'Oyun', 'Teknoloji', 'Gıda', 'Otomotiv'],
    rooHistory: [
      { category: 'Espor', avgScore: 96, campaignCount: 45 },
      { category: 'Oyun', avgScore: 93, campaignCount: 22 },
      { category: 'Teknoloji', avgScore: 88, campaignCount: 11 },
    ],
  },
  // SAĞLIK - Orta ROI, Çok Yüksek ROO, Yüksek Engagement
  {
    id: 'creator-4',
    name: 'Fit & Healthy',
    type: 'YOUTUBER',
    category: 'Sağlık',
    followers: 890000,
    avgViews: 196000,
    engagementRate: 11.4,  // Yüksek - motivasyon arayan kitle
    avgROI: 19.8,  // Orta - uzun dönem müşteri
    avgROO: 91,  // Çok yüksek - yaşam değişimi
    completedCampaigns: 34,
    trustScore: 86,
    verified: true,
    audience: {
      ageGroups: [
        { range: '18-24', percentage: 25 },
        { range: '25-34', percentage: 42 },
        { range: '35-44', percentage: 25 },
        { range: '45+', percentage: 8 },
      ],
      gender: { male: 45, female: 55 },
      topLocations: ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Muğla'],
    },
    pricing: { min: 22000, max: 65000 },
    tags: ['fitness', 'sağlık', 'beslenme', 'spor', 'yaşam'],
    pastCampaignCategories: ['Sağlık', 'Gıda', 'Spor'],
    rooHistory: [
      { category: 'Sağlık', avgScore: 93, campaignCount: 22 },
      { category: 'Gıda', avgScore: 88, campaignCount: 8 },
      { category: 'Spor', avgScore: 90, campaignCount: 4 },
    ],
  },
  // EĞİTİM - Orta ROI, Çok Yüksek ROO, Düşük Engagement
  {
    id: 'creator-5',
    name: 'Code Academy TR',
    type: 'YOUTUBER',
    category: 'Eğitim',
    followers: 650000,
    avgViews: 117000,
    engagementRate: 5.4,  // Düşük - öğrenme odaklı
    avgROI: 22.6,  // Orta-yüksek - yüksek değerli kurslar
    avgROO: 93,  // Çok yüksek - kariyer etkisi
    completedCampaigns: 31,
    trustScore: 95,
    verified: true,
    audience: {
      ageGroups: [
        { range: '18-24', percentage: 38 },
        { range: '25-34', percentage: 48 },
        { range: '35-44', percentage: 12 },
        { range: '45+', percentage: 2 },
      ],
      gender: { male: 68, female: 32 },
      topLocations: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Kocaeli'],
    },
    pricing: { min: 20000, max: 55000 },
    tags: ['yazılım', 'eğitim', 'programlama', 'kariyer'],
    pastCampaignCategories: ['Eğitim', 'Teknoloji', 'Kariyer'],
    rooHistory: [
      { category: 'Eğitim', avgScore: 95, campaignCount: 20 },
      { category: 'Teknoloji', avgScore: 88, campaignCount: 8 },
      { category: 'Kariyer', avgScore: 92, campaignCount: 3 },
    ],
  },
  // FİNANS - Yüksek ROI, Düşük ROO, Düşük Engagement
  {
    id: 'creator-6',
    name: 'Finans Okulu',
    type: 'YOUTUBER',
    category: 'Finans',
    followers: 720000,
    avgViews: 122000,
    engagementRate: 4.8,  // En düşük - hassas konu
    avgROI: 28.5,  // Yüksek - yüksek değerli müşteri
    avgROO: 68,  // Düşük - karmaşık ürünler
    completedCampaigns: 26,
    trustScore: 94,
    verified: true,
    audience: {
      ageGroups: [
        { range: '18-24', percentage: 15 },
        { range: '25-34', percentage: 38 },
        { range: '35-44', percentage: 32 },
        { range: '45+', percentage: 15 },
      ],
      gender: { male: 76, female: 24 },
      topLocations: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Kocaeli'],
    },
    pricing: { min: 35000, max: 100000 },
    tags: ['finans', 'yatırım', 'borsa', 'kripto'],
    pastCampaignCategories: ['Finans', 'Teknoloji', 'Eğitim'],
    rooHistory: [
      { category: 'Finans', avgScore: 70, campaignCount: 18 },
      { category: 'Teknoloji', avgScore: 65, campaignCount: 5 },
      { category: 'Eğitim', avgScore: 72, campaignCount: 3 },
    ],
  },
]

export const mockSponsors: SponsorProfile[] = [
  {
    id: 'sponsor-1',
    name: 'TechCorp Türkiye',
    industry: 'Teknoloji',
    totalSponsored: 2850000,
    avgPaymentSpeed: 4.8,
    collaborationScore: 92,
    completedDeals: 28,
    trustScore: 96,
    preferredCategories: ['Teknoloji', 'Yazılım', 'Eğitim'],
    budgetRange: { min: 50000, max: 200000 },
    goals: [
      {
        id: 'goal-1',
        type: 'AUDIENCE_REACH',
        targetAgeGroup: '18-24',
        targetGender: 'all',
        targetLocations: ['İstanbul', 'Ankara', 'İzmir'],
        targetCategories: ['Teknoloji'],
        minROI: 20,
        minROO: 80,
        priority: 9,
      },
      {
        id: 'goal-2',
        type: 'BRAND_AWARENESS',
        minROO: 85,
        priority: 8,
      },
    ],
  },
  {
    id: 'sponsor-2',
    name: 'GameZone',
    industry: 'Oyun',
    totalSponsored: 1500000,
    avgPaymentSpeed: 4.5,
    collaborationScore: 88,
    completedDeals: 19,
    trustScore: 89,
    preferredCategories: ['Oyun', 'Espor', 'Teknoloji'],
    budgetRange: { min: 30000, max: 150000 },
    goals: [
      {
        id: 'goal-3',
        type: 'ENGAGEMENT',
        targetAgeGroup: '18-24',
        targetGender: 'male',
        targetCategories: ['Oyun', 'Espor'],
        minROI: 25,
        minROO: 75,
        priority: 10,
      },
    ],
  },
  {
    id: 'sponsor-3',
    name: 'HealthyLife',
    industry: 'Sağlık',
    totalSponsored: 980000,
    avgPaymentSpeed: 4.6,
    collaborationScore: 85,
    completedDeals: 15,
    trustScore: 88,
    preferredCategories: ['Sağlık', 'Spor', 'Yaşam'],
    budgetRange: { min: 20000, max: 80000 },
    goals: [
      {
        id: 'goal-4',
        type: 'CONVERSION',
        targetAgeGroup: '25-34',
        targetGender: 'female',
        targetLocations: ['İstanbul', 'Ankara'],
        targetCategories: ['Sağlık'],
        minROI: 18,
        minROO: 70,
        priority: 8,
      },
    ],
  },
]
