import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDatabaseAvailable } from '@/lib/prisma'
import {
  cancelSubscription,
  resumeSubscription,
  updateSubscriptionPlan,
  getUpcomingInvoice,
  PLANS,
  PlanType,
} from '@/lib/stripe'

// Type for invoice from Prisma (will be generated after prisma generate)
interface InvoiceRecord {
  id: string
  invoiceNumber: string | null
  status: string
  total: number | string
  currency: string
  paidAt: Date | null
  hostedInvoiceUrl: string | null
  invoicePdfUrl: string | null
}

// GET - Get subscription details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      )
    }

    // Check if database is available, if not return default FREE plan
    if (!isDatabaseAvailable()) {
      return NextResponse.json({
        subscription: {
          plan: 'FREE',
          status: 'ACTIVE',
          features: PLANS.FREE.features,
          limits: {
            campaigns: { used: 0, limit: PLANS.FREE.features.campaignsLimit },
            sponsors: { used: 0, limit: PLANS.FREE.features.sponsorsLimit },
            members: { used: 0, limit: PLANS.FREE.features.membersLimit },
            storage: { used: 0, limit: PLANS.FREE.features.storageLimit },
          },
        },
        invoices: [],
        upcomingInvoice: null,
      })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { organizationId },
      include: {
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!subscription) {
      // Return default FREE plan if no subscription exists
      return NextResponse.json({
        subscription: {
          plan: 'FREE',
          status: 'ACTIVE',
          features: PLANS.FREE.features,
          limits: {
            campaigns: { used: 0, limit: PLANS.FREE.features.campaignsLimit },
            sponsors: { used: 0, limit: PLANS.FREE.features.sponsorsLimit },
            members: { used: 0, limit: PLANS.FREE.features.membersLimit },
            storage: { used: 0, limit: PLANS.FREE.features.storageLimit },
          },
        },
        invoices: [],
        upcomingInvoice: null,
      })
    }

    // Get upcoming invoice from Stripe if customer exists
    let upcomingInvoice = null
    if (subscription.stripeCustomerId) {
      upcomingInvoice = await getUpcomingInvoice(subscription.stripeCustomerId)
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        trialEnd: subscription.trialEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        canceledAt: subscription.canceledAt,
        features: {
          hasAdvancedAnalytics: subscription.hasAdvancedAnalytics,
          hasRFMAnalysis: subscription.hasRFMAnalysis,
          hasROOTracking: subscription.hasROOTracking,
          hasAPIAccess: subscription.hasAPIAccess,
          hasPrioritySupport: subscription.hasPrioritySupport,
          hasCustomBranding: subscription.hasCustomBranding,
          hasExportFeatures: subscription.hasExportFeatures,
        },
        limits: {
          campaigns: {
            used: subscription.campaignsUsed,
            limit: subscription.campaignsLimit,
          },
          sponsors: {
            used: subscription.sponsorsUsed,
            limit: subscription.sponsorsLimit,
          },
          members: {
            used: subscription.membersUsed,
            limit: subscription.membersLimit,
          },
          storage: {
            used: subscription.storageUsed,
            limit: subscription.storageLimit,
          },
        },
        lastPaymentStatus: subscription.lastPaymentStatus,
        lastPaymentDate: subscription.lastPaymentDate,
      },
      invoices: (subscription.invoices as unknown as InvoiceRecord[]).map((inv: InvoiceRecord) => ({
        id: inv.id,
        number: inv.invoiceNumber,
        status: inv.status,
        total: inv.total,
        currency: inv.currency,
        paidAt: inv.paidAt,
        hostedUrl: inv.hostedInvoiceUrl,
        pdfUrl: inv.invoicePdfUrl,
      })),
      upcomingInvoice: upcomingInvoice
        ? {
            amountDue: upcomingInvoice.amount_due / 100,
            currency: upcomingInvoice.currency,
            dueDate: upcomingInvoice.due_date
              ? new Date(upcomingInvoice.due_date * 1000)
              : null,
          }
        : null,
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}

// PATCH - Update subscription (cancel, resume, change plan)
export async function PATCH(request: NextRequest) {
  try {
    // Check if database is available
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { organizationId, action, newPlan } = body as {
      organizationId: string
      action: 'cancel' | 'cancel_immediately' | 'resume' | 'change_plan'
      newPlan?: PlanType
    }

    if (!organizationId || !action) {
      return NextResponse.json(
        { error: 'organizationId and action are required' },
        { status: 400 }
      )
    }

    const subscription = await prisma.subscription.findUnique({
      where: { organizationId },
    })

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'cancel':
        // Cancel at end of billing period
        result = await cancelSubscription(subscription.stripeSubscriptionId, true)
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { cancelAtPeriodEnd: true },
        })
        break

      case 'cancel_immediately':
        // Cancel immediately
        result = await cancelSubscription(subscription.stripeSubscriptionId, false)
        break

      case 'resume':
        // Resume canceled subscription
        if (!subscription.cancelAtPeriodEnd) {
          return NextResponse.json(
            { error: 'Subscription is not scheduled for cancellation' },
            { status: 400 }
          )
        }
        result = await resumeSubscription(subscription.stripeSubscriptionId)
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { cancelAtPeriodEnd: false },
        })
        break

      case 'change_plan':
        if (!newPlan || !['PRO', 'ENTERPRISE'].includes(newPlan)) {
          return NextResponse.json(
            { error: 'Valid newPlan is required for plan change' },
            { status: 400 }
          )
        }
        const newPriceId = PLANS[newPlan].priceId
        if (!newPriceId) {
          return NextResponse.json(
            { error: 'Price not configured for this plan' },
            { status: 400 }
          )
        }
        result = await updateSubscriptionPlan(
          subscription.stripeSubscriptionId,
          newPriceId
        )
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Type assertion for Stripe subscription response
    const stripeSubscription = result as unknown as {
      status: string
      cancel_at_period_end: boolean
      current_period_end: number
    }
    return NextResponse.json({
      success: true,
      message: `Subscription ${action} successful`,
      subscription: {
        status: stripeSubscription.status,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}
