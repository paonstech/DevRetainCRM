/**
 * Multi-tenancy Helper Functions
 * 
 * Bu modül, kullanıcıların sadece kendi organizasyonlarına ait verileri
 * görmesini sağlayan yardımcı fonksiyonları içerir.
 */

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

// Types
export interface TenantContext {
  userId: string
  organizationId: string
  organizationName: string
  role: string
  systemRole: string
  subscriptionPlan: string
  subscriptionStatus: string
  isAdmin: boolean
  isSuperAdmin: boolean
}

/**
 * Get the current tenant context from the session
 * Use this in Server Components and API routes
 */
export async function getTenantContext(): Promise<TenantContext | null> {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }

  const { user } = session

  if (!user.organizationId) {
    return null
  }

  return {
    userId: user.id,
    organizationId: user.organizationId,
    organizationName: user.organizationName || "",
    role: user.role || "MEMBER",
    systemRole: user.systemRole || "USER",
    subscriptionPlan: user.subscriptionPlan || "FREE",
    subscriptionStatus: user.subscriptionStatus || "ACTIVE",
    isAdmin: user.systemRole === "ADMIN" || user.systemRole === "SUPER_ADMIN",
    isSuperAdmin: user.systemRole === "SUPER_ADMIN",
  }
}

/**
 * Require tenant context - redirects to onboarding if no organization
 * Use this in Server Components that require organization context
 */
export async function requireTenantContext(): Promise<TenantContext> {
  const context = await getTenantContext()
  
  if (!context) {
    redirect("/onboarding")
  }

  return context
}

/**
 * Require admin access - redirects to dashboard if not admin
 * Use this in admin pages
 */
export async function requireAdminAccess(): Promise<TenantContext> {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/signin")
  }

  const systemRole = session.user.systemRole
  if (systemRole !== "ADMIN" && systemRole !== "SUPER_ADMIN") {
    redirect("/?error=unauthorized")
  }

  // Admins might not have an organization, so we create a partial context
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId || "",
    organizationName: session.user.organizationName || "",
    role: session.user.role || "ADMIN",
    systemRole: systemRole || "ADMIN",
    subscriptionPlan: session.user.subscriptionPlan || "FREE",
    subscriptionStatus: session.user.subscriptionStatus || "ACTIVE",
    isAdmin: true,
    isSuperAdmin: systemRole === "SUPER_ADMIN",
  }
}

/**
 * Create a Prisma where clause that filters by organization
 * Use this to ensure data isolation between organizations
 */
export function withOrganizationFilter<T extends Record<string, unknown>>(
  organizationId: string,
  additionalFilters?: T
): T & { organizationId: string } {
  return {
    ...additionalFilters,
    organizationId,
  } as T & { organizationId: string }
}

/**
 * Check if user has access to a specific organization
 */
export async function hasOrganizationAccess(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  })

  return membership?.isActive === true
}

/**
 * Check if user has a specific role in their organization
 */
export async function hasOrganizationRole(
  userId: string,
  organizationId: string,
  allowedRoles: string[]
): Promise<boolean> {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  })

  if (!membership?.isActive) {
    return false
  }

  return allowedRoles.includes(membership.role)
}

/**
 * Get user's organization with subscription info
 */
export async function getUserOrganization(userId: string) {
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      isActive: true,
    },
    include: {
      organization: {
        include: {
          subscription: true,
        },
      },
    },
  })

  return membership?.organization || null
}

/**
 * Scoped Prisma queries - ensures data isolation
 * 
 * Usage:
 * const campaigns = await scopedQuery(organizationId).campaign.findMany()
 */
export function scopedQuery(organizationId: string) {
  return {
    campaign: {
      findMany: (args?: Parameters<typeof prisma.campaign.findMany>[0]) =>
        prisma.campaign.findMany({
          ...args,
          where: { ...args?.where, organizationId },
        }),
      findFirst: (args?: Parameters<typeof prisma.campaign.findFirst>[0]) =>
        prisma.campaign.findFirst({
          ...args,
          where: { ...args?.where, organizationId },
        }),
      findUnique: (args: Parameters<typeof prisma.campaign.findUnique>[0]) =>
        prisma.campaign.findFirst({
          where: { ...args.where, organizationId },
          ...(args.include ? { include: args.include } : {}),
          ...(args.select ? { select: args.select } : {}),
        }),
      count: (args?: Parameters<typeof prisma.campaign.count>[0]) =>
        prisma.campaign.count({
          ...args,
          where: { ...args?.where, organizationId },
        }),
    },
    sponsor: {
      findMany: (args?: Parameters<typeof prisma.sponsor.findMany>[0]) =>
        prisma.sponsor.findMany({
          ...args,
          where: { ...args?.where, organizationId },
        }),
      findFirst: (args?: Parameters<typeof prisma.sponsor.findFirst>[0]) =>
        prisma.sponsor.findFirst({
          ...args,
          where: { ...args?.where, organizationId },
        }),
      findUnique: (args: Parameters<typeof prisma.sponsor.findUnique>[0]) =>
        prisma.sponsor.findFirst({
          where: { ...args.where, organizationId },
          ...(args.include ? { include: args.include } : {}),
          ...(args.select ? { select: args.select } : {}),
        }),
      count: (args?: Parameters<typeof prisma.sponsor.count>[0]) =>
        prisma.sponsor.count({
          ...args,
          where: { ...args?.where, organizationId },
        }),
    },
    transaction: {
      findMany: (args?: Parameters<typeof prisma.transaction.findMany>[0]) =>
        prisma.transaction.findMany({
          ...args,
          where: { ...args?.where, organizationId },
        }),
      findFirst: (args?: Parameters<typeof prisma.transaction.findFirst>[0]) =>
        prisma.transaction.findFirst({
          ...args,
          where: { ...args?.where, organizationId },
        }),
      count: (args?: Parameters<typeof prisma.transaction.count>[0]) =>
        prisma.transaction.count({
          ...args,
          where: { ...args?.where, organizationId },
        }),
      aggregate: (args: Parameters<typeof prisma.transaction.aggregate>[0]) =>
        prisma.transaction.aggregate({
          ...args,
          where: { ...args.where, organizationId },
        }),
    },
    metric: {
      findMany: (args?: Parameters<typeof prisma.metric.findMany>[0]) =>
        prisma.metric.findMany({
          ...args,
          where: { ...args?.where, organizationId },
        }),
      count: (args?: Parameters<typeof prisma.metric.count>[0]) =>
        prisma.metric.count({
          ...args,
          where: { ...args?.where, organizationId },
        }),
    },
    activityLog: {
      findMany: (args?: Parameters<typeof prisma.activityLog.findMany>[0]) =>
        prisma.activityLog.findMany({
          ...args,
          where: { ...args?.where, organizationId },
        }),
      create: (data: Omit<Parameters<typeof prisma.activityLog.create>[0]["data"], "organizationId">) =>
        prisma.activityLog.create({
          data: { ...data, organizationId } as any,
        }),
    },
  }
}

/**
 * Check subscription limits before creating resources
 */
export async function checkSubscriptionLimit(
  organizationId: string,
  resource: "campaigns" | "sponsors" | "members"
): Promise<{ allowed: boolean; current: number; limit: number; message?: string }> {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId },
  })

  if (!subscription) {
    return { allowed: false, current: 0, limit: 0, message: "No subscription found" }
  }

  const limitMap = {
    campaigns: { used: subscription.campaignsUsed, limit: subscription.campaignsLimit },
    sponsors: { used: subscription.sponsorsUsed, limit: subscription.sponsorsLimit },
    members: { used: subscription.membersUsed, limit: subscription.membersLimit },
  }

  const { used, limit } = limitMap[resource]

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, current: used, limit }
  }

  if (used >= limit) {
    return {
      allowed: false,
      current: used,
      limit,
      message: `You have reached your ${resource} limit (${limit}). Please upgrade your plan.`,
    }
  }

  return { allowed: true, current: used, limit }
}

/**
 * Increment usage counter after creating a resource
 */
export async function incrementUsage(
  organizationId: string,
  resource: "campaigns" | "sponsors" | "members"
): Promise<void> {
  const field = `${resource}Used` as const
  
  await prisma.subscription.update({
    where: { organizationId },
    data: {
      [field]: { increment: 1 },
    },
  })
}

/**
 * Decrement usage counter after deleting a resource
 */
export async function decrementUsage(
  organizationId: string,
  resource: "campaigns" | "sponsors" | "members"
): Promise<void> {
  const field = `${resource}Used` as const
  
  await prisma.subscription.update({
    where: { organizationId },
    data: {
      [field]: { decrement: 1 },
    },
  })
}

/**
 * Log activity with organization context
 */
export async function logActivity(
  organizationId: string,
  userId: string | null,
  action: string,
  entityType: string,
  entityId: string,
  changes?: Record<string, { old: unknown; new: unknown }>,
  description?: string
): Promise<void> {
  await prisma.activityLog.create({
    data: {
      organizationId,
      userId,
      action,
      entityType,
      entityId,
      changes: changes ? JSON.stringify(changes) : undefined,
      description,
    },
  })
}
