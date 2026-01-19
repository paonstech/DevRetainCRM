/**
 * Audit Logger - Critical Operations Tracking
 * 
 * Bu modül, kritik işlemlerin (abonelik iptali, büyük bütçeli kampanya silme vb.)
 * detaylı kaydını tutar.
 */

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

// Types
export type AuditCategory =
  | "AUTHENTICATION"
  | "AUTHORIZATION"
  | "SUBSCRIPTION"
  | "FINANCIAL"
  | "DATA_MANAGEMENT"
  | "CAMPAIGN"
  | "SPONSOR"
  | "USER_MANAGEMENT"
  | "SYSTEM"
  | "SECURITY"

export type AuditSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export interface AuditLogEntry {
  category: AuditCategory
  severity?: AuditSeverity
  action: string
  title: string
  description?: string
  entityType: string
  entityId: string
  entityName?: string
  actorId?: string | null
  actorEmail?: string | null
  actorName?: string | null
  actorRole?: string | null
  targetUserId?: string | null
  targetUserEmail?: string | null
  organizationId?: string | null
  organizationName?: string | null
  dataBefore?: Record<string, unknown> | null
  dataAfter?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  amountInvolved?: number | null
  currency?: string | null
  isReversible?: boolean
  requiresReview?: boolean
}

// Get client info from request headers
async function getClientInfo() {
  try {
    const headersList = await headers()
    return {
      ipAddress: headersList.get("x-forwarded-for")?.split(",")[0] || 
                 headersList.get("x-real-ip") || 
                 "unknown",
      userAgent: headersList.get("user-agent") || "unknown",
    }
  } catch {
    return { ipAddress: "unknown", userAgent: "unknown" }
  }
}

// Determine severity based on action and amount
function determineSeverity(
  category: AuditCategory,
  action: string,
  amountInvolved?: number | null
): AuditSeverity {
  // Critical actions
  const criticalActions = [
    "subscription.canceled",
    "user.deleted",
    "organization.deleted",
    "user.suspended",
    "admin.role_changed",
    "security.breach_detected",
    "data.bulk_deleted",
  ]
  
  if (criticalActions.includes(action)) {
    return "CRITICAL"
  }

  // High severity based on amount
  if (amountInvolved && amountInvolved > 10000) {
    return "HIGH"
  }

  // High severity categories
  if (category === "SECURITY" || category === "AUTHORIZATION") {
    return "HIGH"
  }

  // Medium severity based on amount
  if (amountInvolved && amountInvolved > 1000) {
    return "MEDIUM"
  }

  // Default severity by category
  const severityByCategory: Record<AuditCategory, AuditSeverity> = {
    AUTHENTICATION: "LOW",
    AUTHORIZATION: "HIGH",
    SUBSCRIPTION: "HIGH",
    FINANCIAL: "MEDIUM",
    DATA_MANAGEMENT: "MEDIUM",
    CAMPAIGN: "MEDIUM",
    SPONSOR: "LOW",
    USER_MANAGEMENT: "HIGH",
    SYSTEM: "MEDIUM",
    SECURITY: "HIGH",
  }

  return severityByCategory[category] || "MEDIUM"
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    const clientInfo = await getClientInfo()
    const severity = entry.severity || determineSeverity(
      entry.category,
      entry.action,
      entry.amountInvolved
    )

    await (prisma as any).auditLog.create({
      data: {
        category: entry.category,
        severity,
        action: entry.action,
        title: entry.title,
        description: entry.description,
        entityType: entry.entityType,
        entityId: entry.entityId,
        entityName: entry.entityName,
        actorId: entry.actorId,
        actorEmail: entry.actorEmail,
        actorName: entry.actorName,
        actorRole: entry.actorRole,
        actorIpAddress: clientInfo.ipAddress,
        actorUserAgent: clientInfo.userAgent,
        targetUserId: entry.targetUserId,
        targetUserEmail: entry.targetUserEmail,
        organizationId: entry.organizationId,
        organizationName: entry.organizationName,
        dataBefore: entry.dataBefore ? JSON.stringify(entry.dataBefore) : null,
        dataAfter: entry.dataAfter ? JSON.stringify(entry.dataAfter) : null,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        amountInvolved: entry.amountInvolved,
        currency: entry.currency,
        isReversible: entry.isReversible ?? false,
        requiresReview: entry.requiresReview ?? false,
      },
    })
  } catch (error) {
    // Log error but don't throw - audit logging should not break the main operation
    console.error("Failed to create audit log:", error)
  }
}

// ============================================================================
// Pre-built Audit Log Functions for Common Operations
// ============================================================================

/**
 * Log subscription cancellation
 */
export async function auditSubscriptionCanceled(params: {
  organizationId: string
  organizationName: string
  actorId: string
  actorEmail: string
  actorName?: string
  subscriptionData: Record<string, unknown>
  reason?: string
}) {
  await createAuditLog({
    category: "SUBSCRIPTION",
    severity: "CRITICAL",
    action: "subscription.canceled",
    title: "Abonelik İptal Edildi",
    description: params.reason || "Kullanıcı aboneliğini iptal etti",
    entityType: "subscription",
    entityId: params.organizationId,
    entityName: params.organizationName,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    actorName: params.actorName,
    organizationId: params.organizationId,
    organizationName: params.organizationName,
    dataBefore: params.subscriptionData,
    dataAfter: { ...params.subscriptionData, status: "CANCELED" },
    isReversible: true,
    requiresReview: true,
  })
}

/**
 * Log subscription upgrade/downgrade
 */
export async function auditSubscriptionChanged(params: {
  organizationId: string
  organizationName: string
  actorId: string
  actorEmail: string
  oldPlan: string
  newPlan: string
  oldPrice: number
  newPrice: number
}) {
  const isUpgrade = params.newPrice > params.oldPrice
  
  await createAuditLog({
    category: "SUBSCRIPTION",
    severity: "HIGH",
    action: isUpgrade ? "subscription.upgraded" : "subscription.downgraded",
    title: isUpgrade ? "Abonelik Yükseltildi" : "Abonelik Düşürüldü",
    description: `Plan değiştirildi: ${params.oldPlan} → ${params.newPlan}`,
    entityType: "subscription",
    entityId: params.organizationId,
    entityName: params.organizationName,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    organizationId: params.organizationId,
    organizationName: params.organizationName,
    dataBefore: { plan: params.oldPlan, price: params.oldPrice },
    dataAfter: { plan: params.newPlan, price: params.newPrice },
    amountInvolved: Math.abs(params.newPrice - params.oldPrice),
    currency: "USD",
  })
}

/**
 * Log campaign deletion
 */
export async function auditCampaignDeleted(params: {
  campaignId: string
  campaignName: string
  organizationId: string
  organizationName: string
  actorId: string
  actorEmail: string
  campaignData: Record<string, unknown>
  budgetAmount?: number
}) {
  const severity = (params.budgetAmount && params.budgetAmount > 10000) ? "CRITICAL" : "HIGH"
  
  await createAuditLog({
    category: "CAMPAIGN",
    severity,
    action: "campaign.deleted",
    title: "Kampanya Silindi",
    description: `"${params.campaignName}" kampanyası silindi`,
    entityType: "campaign",
    entityId: params.campaignId,
    entityName: params.campaignName,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    organizationId: params.organizationId,
    organizationName: params.organizationName,
    dataBefore: params.campaignData,
    dataAfter: null,
    amountInvolved: params.budgetAmount,
    currency: "TRY",
    isReversible: false,
    requiresReview: severity === "CRITICAL",
  })
}

/**
 * Log user suspension
 */
export async function auditUserSuspended(params: {
  targetUserId: string
  targetUserEmail: string
  targetUserName?: string
  actorId: string
  actorEmail: string
  actorRole: string
  reason: string
}) {
  await createAuditLog({
    category: "USER_MANAGEMENT",
    severity: "CRITICAL",
    action: "user.suspended",
    title: "Kullanıcı Askıya Alındı",
    description: `${params.targetUserEmail} askıya alındı. Sebep: ${params.reason}`,
    entityType: "user",
    entityId: params.targetUserId,
    entityName: params.targetUserEmail,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    targetUserId: params.targetUserId,
    targetUserEmail: params.targetUserEmail,
    dataBefore: { isSuspended: false },
    dataAfter: { isSuspended: true, suspendedReason: params.reason },
    isReversible: true,
    requiresReview: true,
  })
}

/**
 * Log user role change
 */
export async function auditUserRoleChanged(params: {
  targetUserId: string
  targetUserEmail: string
  actorId: string
  actorEmail: string
  actorRole: string
  oldRole: string
  newRole: string
  roleType: "system" | "organization"
  organizationId?: string
  organizationName?: string
}) {
  const severity = params.roleType === "system" ? "CRITICAL" : "HIGH"
  
  await createAuditLog({
    category: "AUTHORIZATION",
    severity,
    action: params.roleType === "system" ? "admin.role_changed" : "user.role_changed",
    title: params.roleType === "system" ? "Sistem Rolü Değiştirildi" : "Kullanıcı Rolü Değiştirildi",
    description: `${params.targetUserEmail} rolü değiştirildi: ${params.oldRole} → ${params.newRole}`,
    entityType: "user",
    entityId: params.targetUserId,
    entityName: params.targetUserEmail,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    targetUserId: params.targetUserId,
    targetUserEmail: params.targetUserEmail,
    organizationId: params.organizationId,
    organizationName: params.organizationName,
    dataBefore: { role: params.oldRole },
    dataAfter: { role: params.newRole },
    isReversible: true,
    requiresReview: severity === "CRITICAL",
  })
}

/**
 * Log large financial transaction
 */
export async function auditLargeTransaction(params: {
  transactionId: string
  organizationId: string
  organizationName: string
  actorId: string
  actorEmail: string
  amount: number
  currency: string
  type: "INCOME" | "EXPENSE"
  description?: string
  campaignId?: string
  campaignName?: string
  sponsorId?: string
  sponsorName?: string
}) {
  const severity = params.amount > 50000 ? "CRITICAL" : params.amount > 10000 ? "HIGH" : "MEDIUM"
  
  await createAuditLog({
    category: "FINANCIAL",
    severity,
    action: `transaction.${params.type.toLowerCase()}_recorded`,
    title: params.type === "INCOME" ? "Büyük Gelir Kaydedildi" : "Büyük Harcama Kaydedildi",
    description: params.description || `${params.amount} ${params.currency} tutarında işlem`,
    entityType: "transaction",
    entityId: params.transactionId,
    entityName: params.description,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    organizationId: params.organizationId,
    organizationName: params.organizationName,
    dataAfter: {
      amount: params.amount,
      currency: params.currency,
      type: params.type,
      campaignId: params.campaignId,
      sponsorId: params.sponsorId,
    },
    metadata: {
      campaignName: params.campaignName,
      sponsorName: params.sponsorName,
    },
    amountInvolved: params.amount,
    currency: params.currency,
    requiresReview: severity === "CRITICAL",
  })
}

/**
 * Log data export
 */
export async function auditDataExport(params: {
  organizationId: string
  organizationName: string
  actorId: string
  actorEmail: string
  exportType: string
  recordCount: number
  format: string
}) {
  await createAuditLog({
    category: "DATA_MANAGEMENT",
    severity: params.recordCount > 1000 ? "HIGH" : "MEDIUM",
    action: "data.exported",
    title: "Veri Export Edildi",
    description: `${params.recordCount} kayıt ${params.format} formatında export edildi`,
    entityType: params.exportType,
    entityId: params.organizationId,
    entityName: `${params.exportType} export`,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    organizationId: params.organizationId,
    organizationName: params.organizationName,
    metadata: {
      exportType: params.exportType,
      recordCount: params.recordCount,
      format: params.format,
    },
  })
}

/**
 * Log bulk deletion
 */
export async function auditBulkDeletion(params: {
  organizationId: string
  organizationName: string
  actorId: string
  actorEmail: string
  entityType: string
  deletedCount: number
  deletedIds: string[]
}) {
  await createAuditLog({
    category: "DATA_MANAGEMENT",
    severity: "CRITICAL",
    action: "data.bulk_deleted",
    title: "Toplu Silme İşlemi",
    description: `${params.deletedCount} adet ${params.entityType} silindi`,
    entityType: params.entityType,
    entityId: params.organizationId,
    entityName: `${params.deletedCount} ${params.entityType}`,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    organizationId: params.organizationId,
    organizationName: params.organizationName,
    dataBefore: { ids: params.deletedIds },
    dataAfter: null,
    isReversible: false,
    requiresReview: true,
  })
}

/**
 * Log authentication event
 */
export async function auditAuthEvent(params: {
  userId: string
  userEmail: string
  action: "login" | "logout" | "login_failed" | "password_changed"
  success: boolean
  failureReason?: string
}) {
  const actionTitles = {
    login: "Kullanıcı Girişi",
    logout: "Kullanıcı Çıkışı",
    login_failed: "Başarısız Giriş Denemesi",
    password_changed: "Şifre Değiştirildi",
  }

  await createAuditLog({
    category: "AUTHENTICATION",
    severity: params.action === "login_failed" ? "MEDIUM" : "LOW",
    action: `auth.${params.action}`,
    title: actionTitles[params.action],
    description: params.failureReason,
    entityType: "user",
    entityId: params.userId,
    entityName: params.userEmail,
    actorId: params.userId,
    actorEmail: params.userEmail,
    metadata: {
      success: params.success,
      failureReason: params.failureReason,
    },
  })
}

/**
 * Log sponsor deletion
 */
export async function auditSponsorDeleted(params: {
  sponsorId: string
  sponsorName: string
  organizationId: string
  organizationName: string
  actorId: string
  actorEmail: string
  sponsorData: Record<string, unknown>
  totalTransactionValue?: number
}) {
  const severity = (params.totalTransactionValue && params.totalTransactionValue > 50000) ? "CRITICAL" : "HIGH"
  
  await createAuditLog({
    category: "SPONSOR",
    severity,
    action: "sponsor.deleted",
    title: "Sponsor Silindi",
    description: `"${params.sponsorName}" sponsoru silindi`,
    entityType: "sponsor",
    entityId: params.sponsorId,
    entityName: params.sponsorName,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    organizationId: params.organizationId,
    organizationName: params.organizationName,
    dataBefore: params.sponsorData,
    dataAfter: null,
    amountInvolved: params.totalTransactionValue,
    currency: "TRY",
    isReversible: false,
    requiresReview: severity === "CRITICAL",
  })
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get audit logs with filters
 */
export async function getAuditLogs(params: {
  page?: number
  limit?: number
  category?: AuditCategory
  severity?: AuditSeverity
  action?: string
  organizationId?: string
  actorId?: string
  entityType?: string
  entityId?: string
  startDate?: Date
  endDate?: Date
  requiresReview?: boolean
  isReviewed?: boolean
}) {
  const {
    page = 1,
    limit = 20,
    category,
    severity,
    action,
    organizationId,
    actorId,
    entityType,
    entityId,
    startDate,
    endDate,
    requiresReview,
    isReviewed,
  } = params

  const where: Record<string, unknown> = {}

  if (category) where.category = category
  if (severity) where.severity = severity
  if (action) where.action = { contains: action }
  if (organizationId) where.organizationId = organizationId
  if (actorId) where.actorId = actorId
  if (entityType) where.entityType = entityType
  if (entityId) where.entityId = entityId
  if (requiresReview !== undefined) where.requiresReview = requiresReview
  if (isReviewed !== undefined) where.isReviewed = isReviewed
  
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) (where.createdAt as Record<string, unknown>).gte = startDate
    if (endDate) (where.createdAt as Record<string, unknown>).lte = endDate
  }

  const [logs, total] = await Promise.all([
    (prisma as any).auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    (prisma as any).auditLog.count({ where }),
  ])

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Mark audit log as reviewed
 */
export async function markAuditLogReviewed(params: {
  auditLogId: string
  reviewedBy: string
  reviewNotes?: string
}) {
  await (prisma as any).auditLog.update({
    where: { id: params.auditLogId },
    data: {
      isReviewed: true,
      reviewedAt: new Date(),
      reviewedBy: params.reviewedBy,
      reviewNotes: params.reviewNotes,
    },
  })
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStats(organizationId?: string) {
  const where = organizationId ? { organizationId } : {}

  const [
    totalLogs,
    criticalLogs,
    pendingReview,
    logsByCategory,
    logsBySeverity,
    recentCritical,
  ] = await Promise.all([
    (prisma as any).auditLog.count({ where }),
    (prisma as any).auditLog.count({ where: { ...where, severity: "CRITICAL" } }),
    (prisma as any).auditLog.count({ where: { ...where, requiresReview: true, isReviewed: false } }),
    (prisma as any).auditLog.groupBy({
      by: ["category"],
      _count: { _all: true },
      where,
    }),
    (prisma as any).auditLog.groupBy({
      by: ["severity"],
      _count: { _all: true },
      where,
    }),
    (prisma as any).auditLog.findMany({
      where: { ...where, severity: "CRITICAL" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  return {
    totalLogs,
    criticalLogs,
    pendingReview,
    logsByCategory: logsByCategory.reduce((acc: Record<string, number>, item: any) => {
      acc[item.category] = item._count._all
      return acc
    }, {}),
    logsBySeverity: logsBySeverity.reduce((acc: Record<string, number>, item: any) => {
      acc[item.severity] = item._count._all
      return acc
    }, {}),
    recentCritical,
  }
}
