import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma, isDatabaseAvailable } from "@/lib/prisma"

// GET /api/admin/users - List all users (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check if database is available, if not return mock data
    if (!isDatabaseAvailable()) {
      return NextResponse.json({
        users: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      })
    }

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
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") // active, suspended, all
    const plan = searchParams.get("plan") // FREE, PRO, ENTERPRISE, all
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Build where clause
    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status === "active") {
      where.isActive = true
      where.isSuspended = false
    } else if (status === "suspended") {
      where.isSuspended = true
    }

    // Get total count
    const total = await prisma.user.count({ where })

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      include: {
        memberships: {
          include: {
            organization: {
              include: {
                subscription: {
                  select: {
                    plan: true,
                    status: true,
                  },
                },
              },
            },
          },
          where: { isActive: true },
          take: 1,
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Filter by plan if specified
    let filteredUsers = users
    if (plan && plan !== "all") {
      filteredUsers = users.filter(
        (user) => user.memberships[0]?.organization?.subscription?.plan === plan
      )
    }

    // Transform data
    const transformedUsers = filteredUsers.map((user) => ({
      id: user.id,
      name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown",
      email: user.email,
      avatar: user.image || user.avatar,
      phone: user.phone,
      isActive: user.isActive,
      isSuspended: user.isSuspended,
      suspendedAt: user.suspendedAt,
      suspendedReason: user.suspendedReason,
      systemRole: user.systemRole,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      organization: user.memberships[0]?.organization
        ? {
            id: user.memberships[0].organization.id,
            name: user.memberships[0].organization.name,
            type: user.memberships[0].organization.type,
          }
        : null,
      organizationRole: user.memberships[0]?.role || null,
      subscription: user.memberships[0]?.organization?.subscription || null,
    }))

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/admin/users - Update user (suspend, change role, etc.)
export async function PATCH(request: NextRequest) {
  try {
    // Check if database is available
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

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
    const { userId, action, reason, newRole } = body

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Prevent self-modification for critical actions
    if (userId === session.user.id && (action === "suspend" || action === "demote")) {
      return NextResponse.json({ error: "Cannot modify your own account" }, { status: 400 })
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prevent modifying SUPER_ADMIN users (only SUPER_ADMIN can modify SUPER_ADMIN)
    if (targetUser.systemRole === "SUPER_ADMIN" && systemRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Cannot modify Super Admin users" }, { status: 403 })
    }

    let updatedUser

    switch (action) {
      case "suspend":
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            isSuspended: true,
            suspendedAt: new Date(),
            suspendedReason: reason || "Suspended by admin",
          },
        })
        break

      case "unsuspend":
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            isSuspended: false,
            suspendedAt: null,
            suspendedReason: null,
          },
        })
        break

      case "changeSystemRole":
        // Only SUPER_ADMIN can promote to ADMIN
        if (newRole === "ADMIN" && systemRole !== "SUPER_ADMIN") {
          return NextResponse.json({ error: "Only Super Admin can promote users to Admin" }, { status: 403 })
        }
        // Only SUPER_ADMIN can demote from ADMIN
        if (targetUser.systemRole === "ADMIN" && systemRole !== "SUPER_ADMIN") {
          return NextResponse.json({ error: "Only Super Admin can demote Admin users" }, { status: 403 })
        }
        // Cannot promote to SUPER_ADMIN via API
        if (newRole === "SUPER_ADMIN") {
          return NextResponse.json({ error: "Cannot promote to Super Admin via API" }, { status: 403 })
        }

        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { systemRole: newRole },
        })
        break

      case "deactivate":
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isActive: false },
        })
        break

      case "activate":
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isActive: true },
        })
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    // Log the action
    await prisma.activityLog.create({
      data: {
        action: `admin_${action}`,
        entityType: "user",
        entityId: userId,
        description: `Admin ${session.user.email} performed ${action} on user ${targetUser.email}`,
        userId: session.user.id,
        organizationId: targetUser.id, // Using user id as org id for system-level logs
        changes: JSON.stringify({
          action,
          reason,
          newRole,
          performedBy: session.user.email,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        systemRole: updatedUser.systemRole,
        isSuspended: updatedUser.isSuspended,
        isActive: updatedUser.isActive,
      },
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
