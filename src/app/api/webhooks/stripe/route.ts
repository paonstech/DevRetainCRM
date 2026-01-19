import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import {
  stripe,
  constructWebhookEvent,
  mapStripeStatus,
  getPlanFromPriceId,
  getPlanFeatures,
  WEBHOOK_EVENTS,
} from '@/lib/stripe'

// Type helpers for Stripe objects
type StripeSubscription = Stripe.Subscription & {
  current_period_start: number
  current_period_end: number
}

type StripeInvoice = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null
  payment_intent?: string | Stripe.PaymentIntent | null
  tax?: number | null
}

// Disable body parsing, we need raw body for webhook verification
export const runtime = 'nodejs'

// Handle Stripe webhooks
export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('Missing stripe-signature header')
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = constructWebhookEvent(body, signature)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Webhook signature verification failed: ${errorMessage}`)
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  console.log(`Received Stripe webhook: ${event.type}`)

  try {
    switch (event.type) {
      // ============================================
      // CHECKOUT EVENTS
      // ============================================
      case WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED: {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      }

      // ============================================
      // SUBSCRIPTION EVENTS
      // ============================================
      case WEBHOOK_EVENTS.SUBSCRIPTION_CREATED: {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCreated(subscription)
        break
      }

      case WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED: {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case WEBHOOK_EVENTS.SUBSCRIPTION_DELETED: {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case WEBHOOK_EVENTS.SUBSCRIPTION_TRIAL_WILL_END: {
        const subscription = event.data.object as Stripe.Subscription
        await handleTrialWillEnd(subscription)
        break
      }

      // ============================================
      // INVOICE EVENTS
      // ============================================
      case WEBHOOK_EVENTS.INVOICE_PAID: {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaid(invoice)
        break
      }

      case WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED: {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }

      case WEBHOOK_EVENTS.INVOICE_CREATED: {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoiceCreated(invoice)
        break
      }

      // ============================================
      // CUSTOMER EVENTS
      // ============================================
      case WEBHOOK_EVENTS.CUSTOMER_DELETED: {
        const customer = event.data.object as Stripe.Customer
        await handleCustomerDeleted(customer)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`Error processing webhook ${event.type}:`, error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// ============================================
// WEBHOOK HANDLERS
// ============================================

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const organizationId = session.metadata?.organizationId
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  if (!organizationId || !customerId) {
    console.error('Missing organizationId or customerId in checkout session')
    return
  }

  // Get subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as StripeSubscription
  const priceId = subscription.items.data[0]?.price.id
  const plan = getPlanFromPriceId(priceId)
  const features = getPlanFeatures(plan)

  // Create or update subscription in database
  await prisma.subscription.upsert({
    where: { organizationId },
    create: {
      organizationId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      plan,
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      ...features,
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      plan,
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      ...features,
    },
  })

  console.log(`Subscription created/updated for organization: ${organizationId}`)
}

async function handleSubscriptionCreated(stripeSubscription: Stripe.Subscription) {
  const subscription = stripeSubscription as StripeSubscription
  const organizationId = subscription.metadata?.organizationId
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0]?.price.id

  if (!organizationId) {
    console.error('Missing organizationId in subscription metadata')
    return
  }

  const plan = getPlanFromPriceId(priceId)
  const features = getPlanFeatures(plan)

  await prisma.subscription.upsert({
    where: { organizationId },
    create: {
      organizationId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan,
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      defaultPaymentMethod: subscription.default_payment_method as string | null,
      ...features,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan,
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      defaultPaymentMethod: subscription.default_payment_method as string | null,
      ...features,
    },
  })

  console.log(`Subscription created for organization: ${organizationId}`)
}

async function handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
  const subscription = stripeSubscription as StripeSubscription
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0]?.price.id

  // Find subscription by Stripe subscription ID or customer ID
  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      OR: [
        { stripeSubscriptionId: subscription.id },
        { stripeCustomerId: customerId },
      ],
    },
  })

  if (!existingSubscription) {
    console.error(`Subscription not found for Stripe subscription: ${subscription.id}`)
    return
  }

  const plan = getPlanFromPriceId(priceId)
  const features = getPlanFeatures(plan)

  await prisma.subscription.update({
    where: { id: existingSubscription.id },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan,
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
      defaultPaymentMethod: subscription.default_payment_method as string | null,
      ...features,
    },
  })

  console.log(`Subscription updated: ${subscription.id}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const existingSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (!existingSubscription) {
    console.error(`Subscription not found for deletion: ${subscription.id}`)
    return
  }

  // Downgrade to FREE plan instead of deleting
  const freeFeatures = getPlanFeatures('FREE')

  await prisma.subscription.update({
    where: { id: existingSubscription.id },
    data: {
      plan: 'FREE',
      status: 'CANCELED',
      stripeSubscriptionId: null,
      stripePriceId: null,
      canceledAt: new Date(),
      cancelAtPeriodEnd: false,
      ...freeFeatures,
    },
  })

  console.log(`Subscription canceled and downgraded to FREE: ${subscription.id}`)
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const existingSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    include: { organization: true },
  })

  if (!existingSubscription) {
    console.error(`Subscription not found for trial ending: ${subscription.id}`)
    return
  }

  // Here you would typically send a notification to the user
  // For now, we'll just log it
  console.log(
    `Trial ending soon for organization: ${existingSubscription.organization.name}`
  )

  // You could create a notification in the database
  // or trigger an email notification here
}

async function handleInvoicePaid(stripeInvoice: Stripe.Invoice) {
  const invoice = stripeInvoice as StripeInvoice
  const subscriptionId = invoice.subscription as string

  if (!subscriptionId) {
    console.log('Invoice not associated with a subscription')
    return
  }

  const existingSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  })

  if (!existingSubscription) {
    console.error(`Subscription not found for invoice: ${invoice.id}`)
    return
  }

  // Update subscription with payment info
  await prisma.subscription.update({
    where: { id: existingSubscription.id },
    data: {
      lastPaymentStatus: 'succeeded',
      lastPaymentDate: new Date(),
      lastPaymentAmount: invoice.amount_paid / 100, // Convert from cents
      status: 'ACTIVE',
    },
  })

  // Create or update invoice record
  await prisma.invoice.upsert({
    where: { stripeInvoiceId: invoice.id },
    create: {
      subscriptionId: existingSubscription.id,
      stripeInvoiceId: invoice.id,
      stripePaymentIntentId: invoice.payment_intent as string | null,
      invoiceNumber: invoice.number,
      status: invoice.status || 'paid',
      amountDue: (invoice.amount_due || 0) / 100,
      amountPaid: (invoice.amount_paid || 0) / 100,
      amountRemaining: (invoice.amount_remaining || 0) / 100,
      subtotal: (invoice.subtotal || 0) / 100,
      tax: invoice.tax ? invoice.tax / 100 : null,
      total: (invoice.total || 0) / 100,
      currency: invoice.currency?.toUpperCase() || 'USD',
      periodStart: invoice.period_start
        ? new Date(invoice.period_start * 1000)
        : null,
      periodEnd: invoice.period_end
        ? new Date(invoice.period_end * 1000)
        : null,
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
      paidAt: invoice.status_transitions?.paid_at
        ? new Date(invoice.status_transitions.paid_at * 1000)
        : new Date(),
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdfUrl: invoice.invoice_pdf,
      lineItems: invoice.lines?.data as unknown as object,
    },
    update: {
      status: invoice.status || 'paid',
      amountPaid: (invoice.amount_paid || 0) / 100,
      amountRemaining: (invoice.amount_remaining || 0) / 100,
      paidAt: invoice.status_transitions?.paid_at
        ? new Date(invoice.status_transitions.paid_at * 1000)
        : new Date(),
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdfUrl: invoice.invoice_pdf,
    },
  })

  console.log(`Invoice paid: ${invoice.id}`)
}

async function handleInvoicePaymentFailed(stripeInvoice: Stripe.Invoice) {
  const invoice = stripeInvoice as StripeInvoice
  const subscriptionId = invoice.subscription as string

  if (!subscriptionId) {
    return
  }

  const existingSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  })

  if (!existingSubscription) {
    console.error(`Subscription not found for failed invoice: ${invoice.id}`)
    return
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { id: existingSubscription.id },
    data: {
      lastPaymentStatus: 'failed',
      status: 'PAST_DUE',
    },
  })

  // Update or create invoice record
  await prisma.invoice.upsert({
    where: { stripeInvoiceId: invoice.id },
    create: {
      subscriptionId: existingSubscription.id,
      stripeInvoiceId: invoice.id,
      stripePaymentIntentId: invoice.payment_intent as string | null,
      invoiceNumber: invoice.number,
      status: 'open',
      amountDue: (invoice.amount_due || 0) / 100,
      amountPaid: (invoice.amount_paid || 0) / 100,
      amountRemaining: (invoice.amount_remaining || 0) / 100,
      subtotal: (invoice.subtotal || 0) / 100,
      tax: invoice.tax ? invoice.tax / 100 : null,
      total: (invoice.total || 0) / 100,
      currency: invoice.currency?.toUpperCase() || 'USD',
      periodStart: invoice.period_start
        ? new Date(invoice.period_start * 1000)
        : null,
      periodEnd: invoice.period_end
        ? new Date(invoice.period_end * 1000)
        : null,
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdfUrl: invoice.invoice_pdf,
    },
    update: {
      status: 'open',
      amountRemaining: (invoice.amount_remaining || 0) / 100,
    },
  })

  console.log(`Invoice payment failed: ${invoice.id}`)

  // Here you would typically send a notification to the user
  // about the failed payment
}

async function handleInvoiceCreated(stripeInvoice: Stripe.Invoice) {
  const invoice = stripeInvoice as StripeInvoice
  const subscriptionId = invoice.subscription as string

  if (!subscriptionId) {
    return
  }

  const existingSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  })

  if (!existingSubscription) {
    console.error(`Subscription not found for new invoice: ${invoice.id}`)
    return
  }

  // Create invoice record
  await prisma.invoice.upsert({
    where: { stripeInvoiceId: invoice.id },
    create: {
      subscriptionId: existingSubscription.id,
      stripeInvoiceId: invoice.id,
      stripePaymentIntentId: invoice.payment_intent as string | null,
      invoiceNumber: invoice.number,
      status: invoice.status || 'draft',
      amountDue: (invoice.amount_due || 0) / 100,
      amountPaid: (invoice.amount_paid || 0) / 100,
      amountRemaining: (invoice.amount_remaining || 0) / 100,
      subtotal: (invoice.subtotal || 0) / 100,
      tax: invoice.tax ? invoice.tax / 100 : null,
      total: (invoice.total || 0) / 100,
      currency: invoice.currency?.toUpperCase() || 'USD',
      periodStart: invoice.period_start
        ? new Date(invoice.period_start * 1000)
        : null,
      periodEnd: invoice.period_end
        ? new Date(invoice.period_end * 1000)
        : null,
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdfUrl: invoice.invoice_pdf,
      lineItems: invoice.lines?.data as unknown as object,
    },
    update: {
      status: invoice.status || 'draft',
      amountDue: (invoice.amount_due || 0) / 100,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdfUrl: invoice.invoice_pdf,
    },
  })

  console.log(`Invoice created: ${invoice.id}`)
}

async function handleCustomerDeleted(customer: Stripe.Customer) {
  // Find subscription by customer ID
  const existingSubscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customer.id },
  })

  if (!existingSubscription) {
    console.log(`No subscription found for deleted customer: ${customer.id}`)
    return
  }

  // Downgrade to FREE plan
  const freeFeatures = getPlanFeatures('FREE')

  await prisma.subscription.update({
    where: { id: existingSubscription.id },
    data: {
      plan: 'FREE',
      status: 'CANCELED',
      stripeSubscriptionId: null,
      stripePriceId: null,
      canceledAt: new Date(),
      ...freeFeatures,
    },
  })

  console.log(`Customer deleted, subscription downgraded: ${customer.id}`)
}
