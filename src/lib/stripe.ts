import Stripe from 'stripe'

// Initialize Stripe with API version
// Only initialize if STRIPE_SECRET_KEY is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia' as any,
  typescript: true,
})

// Check if Stripe is properly configured
export const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY

// Plan configuration
export const PLANS = {
  FREE: {
    name: 'Free',
    description: 'Küçük ekipler için temel özellikler',
    priceId: null, // Free plan has no price
    price: 0,
    currency: 'USD',
    interval: 'month' as const,
    features: {
      campaignsLimit: 3,
      sponsorsLimit: 10,
      membersLimit: 2,
      storageLimit: 100, // MB
      hasAdvancedAnalytics: false,
      hasRFMAnalysis: false,
      hasROOTracking: false,
      hasAPIAccess: false,
      hasPrioritySupport: false,
      hasCustomBranding: false,
      hasExportFeatures: true,
    },
    highlights: [
      '3 aktif kampanya',
      '10 sponsor kaydı',
      '2 takım üyesi',
      'Temel raporlama',
      'E-posta desteği',
    ],
  },
  PRO: {
    name: 'Pro',
    description: 'Büyüyen işletmeler için gelişmiş özellikler',
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    price: 49,
    currency: 'USD',
    interval: 'month' as const,
    features: {
      campaignsLimit: 50,
      sponsorsLimit: 500,
      membersLimit: 10,
      storageLimit: 5000, // MB
      hasAdvancedAnalytics: true,
      hasRFMAnalysis: true,
      hasROOTracking: true,
      hasAPIAccess: false,
      hasPrioritySupport: false,
      hasCustomBranding: false,
      hasExportFeatures: true,
    },
    highlights: [
      '50 aktif kampanya',
      '500 sponsor kaydı',
      '10 takım üyesi',
      'Gelişmiş ROI/ROO analizi',
      'RFM segmentasyonu',
      'PDF rapor export',
      'Öncelikli e-posta desteği',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    description: 'Kurumsal düzeyde özellikler ve destek',
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    price: 199,
    currency: 'USD',
    interval: 'month' as const,
    features: {
      campaignsLimit: -1, // Unlimited
      sponsorsLimit: -1,
      membersLimit: -1,
      storageLimit: -1,
      hasAdvancedAnalytics: true,
      hasRFMAnalysis: true,
      hasROOTracking: true,
      hasAPIAccess: true,
      hasPrioritySupport: true,
      hasCustomBranding: true,
      hasExportFeatures: true,
    },
    highlights: [
      'Sınırsız kampanya',
      'Sınırsız sponsor',
      'Sınırsız takım üyesi',
      'Tüm Pro özellikleri',
      'API erişimi',
      'Özel marka logosu',
      'Öncelikli 7/24 destek',
      'Özel entegrasyonlar',
    ],
  },
} as const

export type PlanType = keyof typeof PLANS

// Get plan features
export function getPlanFeatures(plan: PlanType) {
  return PLANS[plan].features
}

// Check if a feature is available for a plan
export function hasFeature(
  plan: PlanType,
  feature: keyof (typeof PLANS)['FREE']['features']
): boolean {
  return PLANS[plan].features[feature] as boolean
}

// Get usage limit for a plan
export function getLimit(
  plan: PlanType,
  limit: 'campaignsLimit' | 'sponsorsLimit' | 'membersLimit' | 'storageLimit'
): number {
  return PLANS[plan].features[limit]
}

// Check if usage is within limit
export function isWithinLimit(
  plan: PlanType,
  limit: 'campaignsLimit' | 'sponsorsLimit' | 'membersLimit' | 'storageLimit',
  currentUsage: number
): boolean {
  const maxLimit = getLimit(plan, limit)
  if (maxLimit === -1) return true // Unlimited
  return currentUsage < maxLimit
}

// Format price for display
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Stripe webhook event types we handle
export const WEBHOOK_EVENTS = {
  // Checkout
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  CHECKOUT_SESSION_EXPIRED: 'checkout.session.expired',
  
  // Subscriptions
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  SUBSCRIPTION_TRIAL_WILL_END: 'customer.subscription.trial_will_end',
  
  // Invoices
  INVOICE_PAID: 'invoice.paid',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  INVOICE_UPCOMING: 'invoice.upcoming',
  INVOICE_CREATED: 'invoice.created',
  INVOICE_FINALIZED: 'invoice.finalized',
  
  // Payment Intents
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_FAILED: 'payment_intent.payment_failed',
  
  // Customer
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  CUSTOMER_DELETED: 'customer.deleted',
} as const

// Map Stripe subscription status to our SubscriptionStatus enum
export function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status
): 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'INCOMPLETE_EXPIRED' | 'TRIALING' | 'UNPAID' | 'PAUSED' {
  const statusMap: Record<Stripe.Subscription.Status, 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'INCOMPLETE_EXPIRED' | 'TRIALING' | 'UNPAID' | 'PAUSED'> = {
    active: 'ACTIVE',
    past_due: 'PAST_DUE',
    canceled: 'CANCELED',
    incomplete: 'INCOMPLETE',
    incomplete_expired: 'INCOMPLETE_EXPIRED',
    trialing: 'TRIALING',
    unpaid: 'UNPAID',
    paused: 'PAUSED',
  }
  return statusMap[stripeStatus] || 'ACTIVE'
}

// Map Stripe price ID to our plan type
export function getPlanFromPriceId(priceId: string): PlanType {
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'PRO'
  if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) return 'ENTERPRISE'
  return 'FREE'
}

// Create Stripe checkout session URL
export async function createCheckoutSession({
  organizationId,
  organizationName,
  email,
  priceId,
  successUrl,
  cancelUrl,
  customerId,
}: {
  organizationId: string
  organizationName: string
  email: string
  priceId: string
  successUrl: string
  cancelUrl: string
  customerId?: string
}): Promise<Stripe.Checkout.Session> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      organizationId,
    },
    subscription_data: {
      metadata: {
        organizationId,
      },
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    tax_id_collection: {
      enabled: true,
    },
  }

  // If we have an existing customer, use it
  if (customerId) {
    sessionParams.customer = customerId
  } else {
    // Create new customer
    sessionParams.customer_email = email
    sessionParams.customer_creation = 'always'
  }

  return stripe.checkout.sessions.create(sessionParams)
}

// Create customer portal session
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

// Cancel subscription
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<Stripe.Subscription> {
  if (cancelAtPeriodEnd) {
    return stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
  }
  return stripe.subscriptions.cancel(subscriptionId)
}

// Resume subscription (if canceled but not yet ended)
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })
}

// Update subscription plan
export async function updateSubscriptionPlan(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  return stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  })
}

// Get customer invoices
export async function getCustomerInvoices(
  customerId: string,
  limit: number = 10
): Promise<Stripe.Invoice[]> {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
  })
  return invoices.data
}

// Get upcoming invoice
export async function getUpcomingInvoice(
  customerId: string
): Promise<Stripe.Invoice | null> {
  try {
    return await stripe.invoices.createPreview({
      customer: customerId,
    })
  } catch {
    return null
  }
}

// Verify webhook signature
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}
