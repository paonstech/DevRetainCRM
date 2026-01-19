import { PrismaClient, OrganizationType, UserRole, CampaignStatus, CampaignType, TransactionType, TransactionCategory, TransactionStatus, PaymentMethod, MetricType, MetricSource, RFMSegment, SponsorTier, ContactType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.notification.deleteMany()
  await prisma.activityLog.deleteMany()
  await prisma.rFMScore.deleteMany()
  await prisma.metric.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.campaignMilestone.deleteMany()
  await prisma.campaignAssignment.deleteMany()
  await prisma.campaignSponsor.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.sponsorContact.deleteMany()
  await prisma.sponsor.deleteMany()
  await prisma.organizationMember.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'ahmet@example.com',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      passwordHash: '$2b$10$dummyhashforseeding',
      phone: '+90 532 123 4567',
      timezone: 'Europe/Istanbul',
      language: 'tr',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'elif@example.com',
      firstName: 'Elif',
      lastName: 'Kaya',
      passwordHash: '$2b$10$dummyhashforseeding',
      phone: '+90 533 234 5678',
      timezone: 'Europe/Istanbul',
      language: 'tr',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'mehmet@example.com',
      firstName: 'Mehmet',
      lastName: 'Demir',
      passwordHash: '$2b$10$dummyhashforseeding',
      phone: '+90 534 345 6789',
      timezone: 'Europe/Istanbul',
      language: 'tr',
    },
  })

  console.log('✅ Users created')

  // Create Organizations
  const youtuberOrg = await prisma.organization.create({
    data: {
      name: 'TechTurk YouTube',
      slug: 'techturk-youtube',
      type: OrganizationType.YOUTUBER,
      description: 'Türkiye\'nin en büyük teknoloji YouTube kanalı',
      website: 'https://youtube.com/@techturk',
      email: 'info@techturk.com',
      phone: '+90 212 123 4567',
      city: 'İstanbul',
      country: 'TR',
      youtubeChannel: 'https://youtube.com/@techturk',
      instagramHandle: '@techturk',
      twitterHandle: '@techturk',
      currency: 'TRY',
    },
  })

  const clubOrg = await prisma.organization.create({
    data: {
      name: 'Anadolu Esports',
      slug: 'anadolu-esports',
      type: OrganizationType.CLUB,
      description: 'Profesyonel esports kulübü',
      website: 'https://anadoluesports.com',
      email: 'sponsorship@anadoluesports.com',
      phone: '+90 312 234 5678',
      city: 'Ankara',
      country: 'TR',
      twitterHandle: '@anadoluesports',
      currency: 'TRY',
    },
  })

  const businessOrg = await prisma.organization.create({
    data: {
      name: 'Digital Agency Pro',
      slug: 'digital-agency-pro',
      type: OrganizationType.BUSINESS,
      description: 'Dijital pazarlama ve reklam ajansı',
      website: 'https://digitalagencypro.com',
      email: 'contact@digitalagencypro.com',
      phone: '+90 216 345 6789',
      city: 'İstanbul',
      country: 'TR',
      taxId: '1234567890',
      currency: 'TRY',
    },
  })

  console.log('✅ Organizations created')

  // Create Organization Members
  await prisma.organizationMember.create({
    data: {
      userId: user1.id,
      organizationId: youtuberOrg.id,
      role: UserRole.OWNER,
      title: 'Kurucu & İçerik Üreticisi',
    },
  })

  await prisma.organizationMember.create({
    data: {
      userId: user2.id,
      organizationId: youtuberOrg.id,
      role: UserRole.MANAGER,
      title: 'Sponsorluk Yöneticisi',
    },
  })

  await prisma.organizationMember.create({
    data: {
      userId: user3.id,
      organizationId: clubOrg.id,
      role: UserRole.OWNER,
      title: 'Kulüp Başkanı',
    },
  })

  await prisma.organizationMember.create({
    data: {
      userId: user2.id,
      organizationId: businessOrg.id,
      role: UserRole.ADMIN,
      title: 'Hesap Yöneticisi',
    },
  })

  console.log('✅ Organization members created')

  // Create Sponsors
  const sponsor1 = await prisma.sponsor.create({
    data: {
      companyName: 'Monster Energy Türkiye',
      industry: 'İçecek',
      website: 'https://monsterenergy.com.tr',
      description: 'Enerji içeceği markası',
      city: 'İstanbul',
      country: 'TR',
      tier: SponsorTier.PLATINUM,
      acquisitionSource: 'Direkt İletişim',
      organizationId: youtuberOrg.id,
    },
  })

  const sponsor2 = await prisma.sponsor.create({
    data: {
      companyName: 'Logitech Türkiye',
      industry: 'Teknoloji / Gaming',
      website: 'https://logitech.com.tr',
      description: 'Gaming ekipmanları üreticisi',
      city: 'İstanbul',
      country: 'TR',
      tier: SponsorTier.GOLD,
      acquisitionSource: 'Ajans Referansı',
      organizationId: youtuberOrg.id,
    },
  })

  const sponsor3 = await prisma.sponsor.create({
    data: {
      companyName: 'Getir',
      industry: 'E-ticaret / Teknoloji',
      website: 'https://getir.com',
      description: 'Hızlı teslimat platformu',
      city: 'İstanbul',
      country: 'TR',
      tier: SponsorTier.SILVER,
      acquisitionSource: 'Inbound',
      organizationId: youtuberOrg.id,
    },
  })

  const sponsor4 = await prisma.sponsor.create({
    data: {
      companyName: 'Turkcell',
      industry: 'Telekomünikasyon',
      website: 'https://turkcell.com.tr',
      description: 'Türkiye\'nin lider telekomünikasyon şirketi',
      city: 'İstanbul',
      country: 'TR',
      tier: SponsorTier.DIAMOND,
      acquisitionSource: 'Kurumsal İletişim',
      organizationId: clubOrg.id,
    },
  })

  console.log('✅ Sponsors created')

  // Create Sponsor Contacts
  await prisma.sponsorContact.create({
    data: {
      sponsorId: sponsor1.id,
      type: ContactType.PRIMARY,
      firstName: 'Ayşe',
      lastName: 'Öztürk',
      email: 'ayse.ozturk@monster.com',
      phone: '+90 532 111 2222',
      jobTitle: 'Pazarlama Müdürü',
      department: 'Pazarlama',
      isPrimary: true,
    },
  })

  await prisma.sponsorContact.create({
    data: {
      sponsorId: sponsor1.id,
      type: ContactType.BILLING,
      firstName: 'Can',
      lastName: 'Yıldız',
      email: 'can.yildiz@monster.com',
      phone: '+90 533 222 3333',
      jobTitle: 'Finans Uzmanı',
      department: 'Finans',
      isPrimary: false,
    },
  })

  await prisma.sponsorContact.create({
    data: {
      sponsorId: sponsor2.id,
      type: ContactType.MARKETING,
      firstName: 'Deniz',
      lastName: 'Arslan',
      email: 'deniz.arslan@logitech.com',
      phone: '+90 534 333 4444',
      jobTitle: 'İçerik Pazarlama Uzmanı',
      department: 'Pazarlama',
      isPrimary: true,
    },
  })

  await prisma.sponsorContact.create({
    data: {
      sponsorId: sponsor4.id,
      type: ContactType.PRIMARY,
      firstName: 'Berk',
      lastName: 'Koç',
      email: 'berk.koc@turkcell.com.tr',
      phone: '+90 535 444 5555',
      jobTitle: 'Sponsorluk Direktörü',
      department: 'Kurumsal İletişim',
      isPrimary: true,
    },
  })

  console.log('✅ Sponsor contacts created')

  // Create Campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      name: 'Yaz Teknoloji Festivali 2024',
      slug: 'yaz-teknoloji-festivali-2024',
      description: 'Yaz dönemine özel teknoloji ürünleri tanıtım kampanyası',
      type: CampaignType.BRAND_AWARENESS,
      status: CampaignStatus.ACTIVE,
      budgetTotal: 150000,
      budgetSpent: 45000,
      currency: 'TRY',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      targetImpressions: 5000000,
      targetClicks: 100000,
      targetConversions: 5000,
      targetROI: 200,
      totalImpressions: 2500000,
      totalClicks: 52000,
      totalConversions: 2100,
      organizationId: youtuberOrg.id,
      createdById: user1.id,
    },
  })

  const campaign2 = await prisma.campaign.create({
    data: {
      name: 'Gaming Gear Lansmanı',
      slug: 'gaming-gear-lansmani',
      description: 'Yeni gaming ekipmanları tanıtım kampanyası',
      type: CampaignType.PRODUCT_LAUNCH,
      status: CampaignStatus.ACTIVE,
      budgetTotal: 80000,
      budgetSpent: 25000,
      currency: 'TRY',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2024-09-15'),
      targetImpressions: 2000000,
      targetClicks: 50000,
      targetConversions: 2000,
      targetROI: 150,
      totalImpressions: 800000,
      totalClicks: 18000,
      totalConversions: 650,
      organizationId: youtuberOrg.id,
      createdById: user2.id,
    },
  })

  const campaign3 = await prisma.campaign.create({
    data: {
      name: 'Esports Turnuva Sponsorluğu',
      slug: 'esports-turnuva-sponsorlugu',
      description: 'Yıllık esports turnuvası ana sponsorluk anlaşması',
      type: CampaignType.EVENT_SPONSORSHIP,
      status: CampaignStatus.PENDING_APPROVAL,
      budgetTotal: 500000,
      budgetSpent: 0,
      currency: 'TRY',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-31'),
      targetImpressions: 10000000,
      targetClicks: 200000,
      targetConversions: 10000,
      targetROI: 300,
      organizationId: clubOrg.id,
      createdById: user3.id,
    },
  })

  console.log('✅ Campaigns created')

  // Create Campaign Sponsors (many-to-many)
  await prisma.campaignSponsor.create({
    data: {
      campaignId: campaign1.id,
      sponsorId: sponsor1.id,
      contributionAmount: 75000,
      contributionType: 'cash',
      contractStartDate: new Date('2024-06-01'),
      contractEndDate: new Date('2024-08-31'),
      isConfirmed: true,
      confirmedAt: new Date('2024-05-15'),
      deliverables: JSON.stringify([
        '4 adet YouTube video entegrasyonu',
        '8 adet Instagram story',
        '2 adet TikTok video',
      ]),
    },
  })

  await prisma.campaignSponsor.create({
    data: {
      campaignId: campaign1.id,
      sponsorId: sponsor3.id,
      contributionAmount: 50000,
      contributionType: 'cash',
      contractStartDate: new Date('2024-06-01'),
      contractEndDate: new Date('2024-08-31'),
      isConfirmed: true,
      confirmedAt: new Date('2024-05-20'),
      deliverables: JSON.stringify([
        '2 adet YouTube video entegrasyonu',
        '4 adet Instagram story',
        'Promosyon kodu paylaşımı',
      ]),
    },
  })

  await prisma.campaignSponsor.create({
    data: {
      campaignId: campaign2.id,
      sponsorId: sponsor2.id,
      contributionAmount: 60000,
      contributionType: 'cash + product',
      contractStartDate: new Date('2024-07-15'),
      contractEndDate: new Date('2024-09-15'),
      isConfirmed: true,
      confirmedAt: new Date('2024-07-01'),
      deliverables: JSON.stringify([
        '3 adet ürün inceleme videosu',
        'Unboxing video',
        '6 adet Instagram post',
        'Çekiliş organizasyonu',
      ]),
    },
  })

  await prisma.campaignSponsor.create({
    data: {
      campaignId: campaign3.id,
      sponsorId: sponsor4.id,
      contributionAmount: 400000,
      contributionType: 'cash',
      contractStartDate: new Date('2024-09-01'),
      contractEndDate: new Date('2024-12-31'),
      isConfirmed: false,
      deliverables: JSON.stringify([
        'Ana sponsor logosu tüm materyallerde',
        'Canlı yayın sponsorluğu',
        'Sahne isim hakkı',
        'VIP alan sponsorluğu',
      ]),
    },
  })

  console.log('✅ Campaign sponsors created')

  // Create Campaign Assignments
  await prisma.campaignAssignment.create({
    data: {
      campaignId: campaign1.id,
      userId: user1.id,
      role: 'İçerik Üreticisi',
    },
  })

  await prisma.campaignAssignment.create({
    data: {
      campaignId: campaign1.id,
      userId: user2.id,
      role: 'Kampanya Yöneticisi',
    },
  })

  await prisma.campaignAssignment.create({
    data: {
      campaignId: campaign2.id,
      userId: user2.id,
      role: 'Kampanya Yöneticisi',
    },
  })

  console.log('✅ Campaign assignments created')

  // Create Campaign Milestones
  await prisma.campaignMilestone.createMany({
    data: [
      {
        campaignId: campaign1.id,
        name: 'Sözleşme İmzalama',
        description: 'Tüm sponsorlarla sözleşmelerin imzalanması',
        dueDate: new Date('2024-05-31'),
        isCompleted: true,
        completedAt: new Date('2024-05-28'),
        sortOrder: 1,
      },
      {
        campaignId: campaign1.id,
        name: 'İlk Video Yayını',
        description: 'Kampanyanın ilk YouTube videosunun yayınlanması',
        dueDate: new Date('2024-06-15'),
        isCompleted: true,
        completedAt: new Date('2024-06-14'),
        sortOrder: 2,
      },
      {
        campaignId: campaign1.id,
        name: 'Ara Dönem Raporu',
        description: 'Sponsorlara ara dönem performans raporu sunumu',
        dueDate: new Date('2024-07-31'),
        isCompleted: false,
        sortOrder: 3,
      },
      {
        campaignId: campaign1.id,
        name: 'Final Raporu',
        description: 'Kampanya sonuç raporu ve ROI analizi',
        dueDate: new Date('2024-09-15'),
        isCompleted: false,
        sortOrder: 4,
      },
    ],
  })

  console.log('✅ Campaign milestones created')

  // Create Transactions
  await prisma.transaction.createMany({
    data: [
      {
        organizationId: youtuberOrg.id,
        campaignId: campaign1.id,
        sponsorId: sponsor1.id,
        type: TransactionType.INCOME,
        category: TransactionCategory.SPONSORSHIP_FEE,
        status: TransactionStatus.COMPLETED,
        amount: 37500,
        currency: 'TRY',
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentReference: 'TRF-2024-001',
        transactionDate: new Date('2024-06-01'),
        paidAt: new Date('2024-06-05'),
        invoiceNumber: 'INV-2024-001',
        description: 'Monster Energy - 1. taksit ödemesi',
      },
      {
        organizationId: youtuberOrg.id,
        campaignId: campaign1.id,
        sponsorId: sponsor1.id,
        type: TransactionType.INCOME,
        category: TransactionCategory.SPONSORSHIP_FEE,
        status: TransactionStatus.PENDING,
        amount: 37500,
        currency: 'TRY',
        transactionDate: new Date('2024-08-01'),
        dueDate: new Date('2024-08-15'),
        invoiceNumber: 'INV-2024-002',
        description: 'Monster Energy - 2. taksit ödemesi',
      },
      {
        organizationId: youtuberOrg.id,
        campaignId: campaign1.id,
        sponsorId: sponsor3.id,
        type: TransactionType.INCOME,
        category: TransactionCategory.SPONSORSHIP_FEE,
        status: TransactionStatus.COMPLETED,
        amount: 50000,
        currency: 'TRY',
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentReference: 'TRF-2024-002',
        transactionDate: new Date('2024-06-01'),
        paidAt: new Date('2024-06-03'),
        invoiceNumber: 'INV-2024-003',
        description: 'Getir - Tam ödeme',
      },
      {
        organizationId: youtuberOrg.id,
        campaignId: campaign1.id,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.AD_SPEND,
        status: TransactionStatus.COMPLETED,
        amount: 15000,
        currency: 'TRY',
        paymentMethod: PaymentMethod.CREDIT_CARD,
        transactionDate: new Date('2024-06-15'),
        paidAt: new Date('2024-06-15'),
        description: 'YouTube Ads - Haziran kampanyası',
      },
      {
        organizationId: youtuberOrg.id,
        campaignId: campaign1.id,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.AD_SPEND,
        status: TransactionStatus.COMPLETED,
        amount: 20000,
        currency: 'TRY',
        paymentMethod: PaymentMethod.CREDIT_CARD,
        transactionDate: new Date('2024-07-15'),
        paidAt: new Date('2024-07-15'),
        description: 'Instagram Ads - Temmuz kampanyası',
      },
      {
        organizationId: youtuberOrg.id,
        campaignId: campaign2.id,
        sponsorId: sponsor2.id,
        type: TransactionType.INCOME,
        category: TransactionCategory.SPONSORSHIP_FEE,
        status: TransactionStatus.COMPLETED,
        amount: 60000,
        currency: 'TRY',
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentReference: 'TRF-2024-003',
        transactionDate: new Date('2024-07-15'),
        paidAt: new Date('2024-07-18'),
        invoiceNumber: 'INV-2024-004',
        description: 'Logitech - Sponsorluk ödemesi',
      },
      {
        organizationId: youtuberOrg.id,
        campaignId: campaign2.id,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.PLATFORM_FEE,
        status: TransactionStatus.COMPLETED,
        amount: 5000,
        currency: 'TRY',
        paymentMethod: PaymentMethod.CREDIT_CARD,
        transactionDate: new Date('2024-07-20'),
        paidAt: new Date('2024-07-20'),
        description: 'Influencer platform komisyonu',
      },
    ],
  })

  console.log('✅ Transactions created')

  // Create Metrics
  const metricData = []
  const startDate = new Date('2024-06-01')
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    // YouTube metrics
    metricData.push({
      organizationId: youtuberOrg.id,
      campaignId: campaign1.id,
      type: MetricType.VIEW,
      source: MetricSource.YOUTUBE,
      value: Math.floor(Math.random() * 50000) + 10000,
      recordedAt: date,
    })
    
    metricData.push({
      organizationId: youtuberOrg.id,
      campaignId: campaign1.id,
      type: MetricType.CLICK,
      source: MetricSource.YOUTUBE,
      value: Math.floor(Math.random() * 2000) + 500,
      recordedAt: date,
    })
    
    metricData.push({
      organizationId: youtuberOrg.id,
      campaignId: campaign1.id,
      type: MetricType.ENGAGEMENT,
      source: MetricSource.YOUTUBE,
      value: Math.floor(Math.random() * 5000) + 1000,
      recordedAt: date,
    })
    
    // Instagram metrics
    metricData.push({
      organizationId: youtuberOrg.id,
      campaignId: campaign1.id,
      type: MetricType.IMPRESSION,
      source: MetricSource.INSTAGRAM,
      value: Math.floor(Math.random() * 30000) + 5000,
      recordedAt: date,
    })
    
    metricData.push({
      organizationId: youtuberOrg.id,
      campaignId: campaign1.id,
      type: MetricType.LIKE,
      source: MetricSource.INSTAGRAM,
      value: Math.floor(Math.random() * 3000) + 500,
      recordedAt: date,
    })
    
    // Conversions
    if (i % 3 === 0) {
      metricData.push({
        organizationId: youtuberOrg.id,
        campaignId: campaign1.id,
        type: MetricType.CONVERSION,
        source: MetricSource.WEBSITE,
        value: Math.floor(Math.random() * 100) + 20,
        recordedAt: date,
        conversionValue: Math.random() * 5000 + 1000,
      })
    }
  }

  await prisma.metric.createMany({ data: metricData })

  console.log('✅ Metrics created')

  // Create RFM Scores
  await prisma.rFMScore.createMany({
    data: [
      {
        sponsorId: sponsor1.id,
        recencyScore: 5,
        frequencyScore: 4,
        monetaryScore: 5,
        rfmScore: 545,
        segment: RFMSegment.CHAMPIONS,
        lastTransactionDate: new Date('2024-06-05'),
        transactionCount: 8,
        totalMonetary: 450000,
        averageMonetary: 56250,
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-07-31'),
      },
      {
        sponsorId: sponsor2.id,
        recencyScore: 5,
        frequencyScore: 3,
        monetaryScore: 4,
        rfmScore: 534,
        segment: RFMSegment.POTENTIAL_LOYALIST,
        lastTransactionDate: new Date('2024-07-18'),
        transactionCount: 3,
        totalMonetary: 180000,
        averageMonetary: 60000,
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-07-31'),
      },
      {
        sponsorId: sponsor3.id,
        recencyScore: 4,
        frequencyScore: 2,
        monetaryScore: 3,
        rfmScore: 423,
        segment: RFMSegment.POTENTIAL_LOYALIST,
        lastTransactionDate: new Date('2024-06-03'),
        transactionCount: 2,
        totalMonetary: 100000,
        averageMonetary: 50000,
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-07-31'),
      },
      {
        sponsorId: sponsor4.id,
        recencyScore: 3,
        frequencyScore: 5,
        monetaryScore: 5,
        rfmScore: 355,
        segment: RFMSegment.LOYAL_CUSTOMERS,
        lastTransactionDate: new Date('2024-03-15'),
        transactionCount: 12,
        totalMonetary: 2500000,
        averageMonetary: 208333,
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-07-31'),
      },
    ],
  })

  console.log('✅ RFM Scores created')

  // Create Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        organizationId: youtuberOrg.id,
        userId: user1.id,
        campaignId: campaign1.id,
        action: 'created',
        entityType: 'campaign',
        entityId: campaign1.id,
        description: 'Yaz Teknoloji Festivali 2024 kampanyası oluşturuldu',
      },
      {
        organizationId: youtuberOrg.id,
        userId: user2.id,
        campaignId: campaign1.id,
        sponsorId: sponsor1.id,
        action: 'added',
        entityType: 'campaign_sponsor',
        entityId: sponsor1.id,
        description: 'Monster Energy sponsor olarak eklendi',
      },
      {
        organizationId: youtuberOrg.id,
        userId: user2.id,
        campaignId: campaign1.id,
        action: 'updated',
        entityType: 'campaign',
        entityId: campaign1.id,
        changes: JSON.stringify({ status: { old: 'DRAFT', new: 'ACTIVE' } }),
        description: 'Kampanya durumu aktif olarak güncellendi',
      },
    ],
  })

  console.log('✅ Activity logs created')

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        title: 'Yeni Sponsor Teklifi',
        message: 'Logitech yeni bir sponsorluk teklifi gönderdi.',
        type: 'info',
        actionUrl: '/sponsors/logitech',
      },
      {
        userId: user2.id,
        title: 'Ödeme Alındı',
        message: 'Monster Energy\'den 37.500 TL ödeme alındı.',
        type: 'success',
        isRead: true,
        readAt: new Date(),
        actionUrl: '/transactions',
      },
      {
        userId: user1.id,
        title: 'Milestone Yaklaşıyor',
        message: 'Ara Dönem Raporu için son 5 gün kaldı.',
        type: 'warning',
        actionUrl: '/campaigns/yaz-teknoloji-festivali-2024',
      },
    ],
  })

  console.log('✅ Notifications created')

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
