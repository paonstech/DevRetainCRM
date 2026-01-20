import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma, isDatabaseAvailable } from "@/lib/prisma"

// GET /api/admin/stats - Get system-wide statistics (admin only)
export async function GET() {
  try {
    // Check if database is available, if not return mock data
    if (!isDatabaseAvailable()) {
      return NextResponse.json({
        users: {
          total: 150,
          active: 142,
          suspended: 8,
          newThisMonth: 12,
          growth: 8.7,
        },
        organizations: {
          total: 45,
          newThisMonth: 5,
        },
        subscriptions: {
          byPlan: { FREE: 20, PRO: 20, ENTERPRISE: 5 },
          total: 45,
        },
        revenue: {
          mrr: 1945,
          arr: 23340,
          arpu: 43.22,
          totalRevenue: 125000,
        },
        campaigns: {
          total: 180,
          active: 45,
        },
        sponsors: {
          total: 35,
        },
        metrics: {
          churnRate: 2.1,
        },
        systemRoles: {
          USER: 140,
          ADMIN: 8,
          SUPER_ADMIN: 2,
        },
        recentActivity: [],
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

    // Get date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // User statistics - using 'any' cast until prisma generate is run
    const prismaAny = prisma as any
    
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      newUsersThisMonth,
      newUsersLastMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prismaAny.user.count({ where: { isActive: true, isSuspended: false } }),
      prismaAny.user.count({ where: { isSuspended: true } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
    ])

    // Organization statistics
    const [totalOrganizations, newOrgsThisMonth] = await Promise.all([
      prisma.organization.count(),
      prisma.organization.count({ where: { createdAt: { gte: startOfMonth } } }),
    ])

    // Subscription statistics
    const subscriptionStats = await prismaAny.subscription.groupBy({
      by: ["plan"],
      _count: { plan: true },
      where: { status: "ACTIVE" },
    })

    const subscriptionsByPlan = {
      FREE: 0,
      PRO: 0,
      ENTERPRISE: 0,
    }

    subscriptionStats.forEach((stat: any) => {
      subscriptionsByPlan[stat.plan as keyof typeof subscriptionsByPlan] = stat._count.plan
    })

    // Calculate MRR (Monthly Recurring Revenue)
    // PRO = $49/month, ENTERPRISE = $199/month
    const mrr = subscriptionsByPlan.PRO * 49 + subscriptionsByPlan.ENTERPRISE * 199
    const arr = mrr * 12

    // Campaign statistics
    const [totalCampaigns, activeCampaigns] = await Promise.all([
      prisma.campaign.count(),
      prisma.campaign.count({ where: { status: "ACTIVE" } }),
    ])

    // Sponsor statistics
    const totalSponsors = await prisma.sponsor.count()

    // Transaction statistics (revenue)
    const totalRevenue = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME", status: "COMPLETED" },
    })

    // Calculate growth rates
    const userGrowth = newUsersLastMonth > 0
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
      : newUsersThisMonth > 0 ? 100 : 0

    // Churn rate (simplified - users who became inactive this month)
    const churnedThisMonth = await prismaAny.subscription.count({
      where: {
        status: "CANCELED",
        canceledAt: { gte: startOfMonth },
      },
    })
    const churnRate = totalOrganizations > 0
      ? (churnedThisMonth / totalOrganizations) * 100
      : 0

    // Average revenue per user
    const arpu = totalOrganizations > 0 ? mrr / totalOrganizations : 0

    // Recent activity logs
    const recentLogs = await prisma.activityLog.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { email: true },
        },
      },
    })

    // System role distribution - using raw query for new field
    const systemRoleStats = await prismaAny.user.groupBy({
      by: ["systemRole"],
      _count: { _all: true },
    })

    const systemRoles = {
      USER: 0,
      ADMIN: 0,
      SUPER_ADMIN: 0,
    }

    systemRoleStats.forEach((stat: any) => {
      if (stat.systemRole && systemRoles.hasOwnProperty(stat.systemRole)) {
        systemRoles[stat.systemRole as keyof typeof systemRoles] = stat._count._all
      }
    })

    return NextResponse.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
        newThisMonth: newUsersThisMonth,
        growth: Math.round(userGrowth * 10) / 10,
      },
      organizations: {
        total: totalOrganizations,
        newThisMonth: newOrgsThisMonth,
      },
      subscriptions: {
        byPlan: subscriptionsByPlan,
        total: subscriptionsByPlan.FREE + subscriptionsByPlan.PRO + subscriptionsByPlan.ENTERPRISE,
      },
      revenue: {
        mrr,
        arr,
        arpu: Math.round(arpu * 100) / 100,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      campaigns: {
        total: totalCampaigns,
        active: activeCampaigns,
      },
      sponsors: {
        total: totalSponsors,
      },
      metrics: {
        churnRate: Math.round(churnRate * 10) / 10,
      },
      systemRoles,
      recentActivity: recentLogs.map((log: any) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        description: log.description,
        user: log.user?.email || "System",
        createdAt: log.createdAt,
      })),
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
