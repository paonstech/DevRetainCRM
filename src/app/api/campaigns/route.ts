import { NextRequest, NextResponse } from "next/server"
import { campaignFormSchema } from "@/lib/validations/campaign"
import { mockCampaigns, mockSponsors } from "@/lib/mock-data"

// Demo modda in-memory storage
let campaigns = [...mockCampaigns]

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[üÜ]/g, "u")
    .replace(/[öÖ]/g, "o")
    .replace(/[çÇ]/g, "c")
    .replace(/[şŞ]/g, "s")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: campaigns,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Tarihleri Date objesine çevir
    const dataToValidate = {
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    }

    // Zod ile validasyon
    const validationResult = campaignFormSchema.safeParse(dataToValidate)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validasyon hatası",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Sponsorların var olduğunu kontrol et
    const validSponsorIds = data.sponsorIds.filter((id) =>
      mockSponsors.some((s) => s.id === id)
    )

    if (validSponsorIds.length !== data.sponsorIds.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Bazı sponsorlar bulunamadı",
        },
        { status: 400 }
      )
    }

    // Yeni kampanya oluştur (demo modda)
    const newCampaign = {
      id: `campaign-${Date.now()}`,
      name: data.name,
      slug: generateSlug(data.name),
      type: data.type,
      status: "DRAFT" as const,
      budgetTotal: data.budgetTotal,
      budgetSpent: 0,
      currency: data.currency || "TRY",
      startDate: data.startDate,
      endDate: data.endDate,
      targetImpressions: data.targetImpressions || null,
      targetClicks: data.targetClicks || null,
      targetConversions: data.targetConversions || null,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      organizationId: "org-1", // Demo için sabit
      createdById: "user-1", // Demo için sabit
      createdAt: new Date(),
    }

    // In-memory storage'a ekle
    campaigns.push(newCampaign)

    // Gerçek uygulamada Prisma ile kayıt:
    // const campaign = await prisma.campaign.create({
    //   data: {
    //     name: data.name,
    //     slug: generateSlug(data.name),
    //     type: data.type,
    //     status: 'DRAFT',
    //     budgetTotal: data.budgetTotal,
    //     currency: data.currency,
    //     startDate: data.startDate,
    //     endDate: data.endDate,
    //     targetImpressions: data.targetImpressions,
    //     targetClicks: data.targetClicks,
    //     targetConversions: data.targetConversions,
    //     targetROI: data.targetROI,
    //     organizationId: session.user.organizationId,
    //     createdById: session.user.id,
    //     sponsors: {
    //       create: data.sponsorIds.map(sponsorId => ({
    //         sponsorId,
    //         contributionAmount: 0,
    //       })),
    //     },
    //   },
    // })

    return NextResponse.json({
      success: true,
      data: newCampaign,
      message: "Kampanya başarıyla oluşturuldu",
    })
  } catch (error) {
    console.error("Campaign creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Kampanya oluşturulurken bir hata oluştu",
      },
      { status: 500 }
    )
  }
}
