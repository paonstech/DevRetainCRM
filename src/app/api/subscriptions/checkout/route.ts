import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDatabaseAvailable } from '@/lib/prisma'
import { createCheckoutSession, PLANS, PlanType } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    // Check if database is available
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { organizationId, plan, successUrl, cancelUrl } = body as {
      organizationId: string
      plan: PlanType
      successUrl?: string
      cancelUrl?: string
    }

    // Validate required fields
    if (!organizationId || !plan) {
      return NextResponse.json(
        { error: 'organizationId and plan are required' },
        { status: 400 }
      )
    }

    // Validate plan type
    if (!['PRO', 'ENTERPRISE'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be PRO or ENTERPRISE' },
        { status: 400 }
      )
    }

    // Get organization details
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        subscription: true,
        members: {
          where: { role: 'OWNER' },
          include: { user: true },
        },
      },
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Get owner's email
    const ownerEmail = organization.members[0]?.user?.email || organization.email
    if (!ownerEmail) {
      return NextResponse.json(
        { error: 'Organization must have an email address' },
        { status: 400 }
      )
    }

    // Get price ID for the plan
    const priceId = PLANS[plan].priceId
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price not configured for this plan' },
        { status: 400 }
      )
    }

    // Build URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const finalSuccessUrl = successUrl || `${baseUrl}/dashboard?subscription=success`
    const finalCancelUrl = cancelUrl || `${baseUrl}/pricing?subscription=canceled`

    // Create checkout session
    const session = await createCheckoutSession({
      organizationId,
      organizationName: organization.name,
      email: ownerEmail,
      priceId,
      successUrl: finalSuccessUrl,
      cancelUrl: finalCancelUrl,
      customerId: organization.subscription?.stripeCustomerId || undefined,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
