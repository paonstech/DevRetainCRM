import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getAuditLogs, getAuditLogStats, markAuditLogReviewed } from "@/lib/audit-logger"

// GET /api/admin/audit-logs - Get audit logs with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check admin role
    const systemRole = session.user.systemRole
    if (systemRole !== "ADMIN" && systemRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category") as any
    const severity = searchParams.get("severity") as any
    const action = searchParams.get("action") || undefined
    const organizationId = searchParams.get("organizationId") || undefined
    const actorId = searchParams.get("actorId") || undefined
    const entityType = searchParams.get("entityType") || undefined
    const entityId = searchParams.get("entityId") || undefined
    const requiresReview = searchParams.get("requiresReview") === "true" ? true : 
                          searchParams.get("requiresReview") === "false" ? false : undefined
    const isReviewed = searchParams.get("isReviewed") === "true" ? true :
                       searchParams.get("isReviewed") === "false" ? false : undefined
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined

    // Get stats if requested
    if (searchParams.get("stats") === "true") {
      const stats = await getAuditLogStats(organizationId)
      return NextResponse.json(stats)
    }

    // Get audit logs
    const result = await getAuditLogs({
      page,
      limit,
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
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/admin/audit-logs - Mark audit log as reviewed
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check admin role
    const systemRole = session.user.systemRole
    if (systemRole !== "ADMIN" && systemRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { auditLogId, reviewNotes } = body

    if (!auditLogId) {
      return NextResponse.json({ error: "Missing auditLogId" }, { status: 400 })
    }

    await markAuditLogReviewed({
      auditLogId,
      reviewedBy: session.user.id,
      reviewNotes,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating audit log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
