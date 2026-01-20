import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { prisma, isDatabaseAvailable } from "@/lib/prisma"
import { getPlanFeatures } from "@/lib/stripe"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Only use PrismaAdapter if database is available
  adapter: isDatabaseAvailable() ? PrismaAdapter(prisma) : undefined,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.EMAIL_FROM || "DevRetain <noreply@devretain.com>",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/onboarding",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        
        // Get user's system role, organization and subscription info
        // Note: After running `prisma generate`, these types will be properly recognized
        if (isDatabaseAvailable()) {
          try {
            const dbUser = await (prisma.user.findUnique as any)({
              where: { id: user.id },
              include: {
                memberships: {
                  include: {
                    organization: {
                      include: {
                        subscription: true,
                      },
                    },
                  },
                  where: { isActive: true },
                  take: 1,
                },
              },
            })

            if (dbUser) {
              // System-level role (for admin panel access)
              token.systemRole = dbUser.systemRole || "USER"
              token.isSuspended = dbUser.isSuspended || false
              
              if (dbUser.memberships?.[0]) {
                token.organizationId = dbUser.memberships[0].organizationId
                token.organizationName = dbUser.memberships[0].organization?.name
                token.role = dbUser.memberships[0].role // Organization-level role
                token.subscriptionPlan = dbUser.memberships[0].organization?.subscription?.plan || "FREE"
                token.subscriptionStatus = dbUser.memberships[0].organization?.subscription?.status || "ACTIVE"
              }
            }
          } catch (error) {
            // Database not available, use defaults
            console.warn("Database not available, using default values for user session")
          }
        } else {
          // Database not available, set default values
          token.systemRole = "USER"
          token.subscriptionPlan = "FREE"
          token.subscriptionStatus = "ACTIVE"
        }
      }

      // Refresh subscription info on session update
      if (trigger === "update" && token.id && isDatabaseAvailable()) {
        try {
          const dbUser = await (prisma.user.findUnique as any)({
            where: { id: token.id as string },
            include: {
              memberships: {
                where: { isActive: true },
                take: 1,
                include: {
                  organization: {
                    include: {
                      subscription: true,
                    },
                  },
                },
              },
            },
          })
          
          if (dbUser) {
            token.systemRole = dbUser.systemRole || "USER"
            token.isSuspended = dbUser.isSuspended || false
            
            if (dbUser.memberships?.[0]?.organization?.subscription) {
              token.subscriptionPlan = dbUser.memberships[0].organization.subscription.plan
              token.subscriptionStatus = dbUser.memberships[0].organization.subscription.status
            }
          }
        } catch (error) {
          // Database not available, keep existing token values
          console.warn("Database not available during session update")
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.systemRole = token.systemRole as string | undefined
        session.user.isSuspended = token.isSuspended as boolean | undefined
        session.user.organizationId = token.organizationId as string | undefined
        session.user.organizationName = token.organizationName as string | undefined
        session.user.role = token.role as string | undefined
        session.user.subscriptionPlan = token.subscriptionPlan as string | undefined
        session.user.subscriptionStatus = token.subscriptionStatus as string | undefined
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Check if user is suspended (only if database is available)
      if (user.id && isDatabaseAvailable()) {
        try {
          const dbUser = await (prisma.user.findUnique as any)({
            where: { id: user.id },
            select: { isSuspended: true },
          })
          
          if (dbUser?.isSuspended) {
            // Deny sign in for suspended users
            return false
          }
        } catch (error) {
          // Database not available, allow sign in
          console.warn("Database not available, allowing sign in")
        }
      }
      
      // Allow sign in
      return true
    },
  },
  events: {
    async createUser({ user }) {
      // Create default organization and FREE subscription for new users (only if database is available)
      if (user.id && user.email && isDatabaseAvailable()) {
        try {
          // Create organization
          const orgSlug = user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "-")
          const organization = await prisma.organization.create({
            data: {
              name: user.name || `${user.email.split("@")[0]}'s Organization`,
              slug: `${orgSlug}-${Date.now()}`,
              type: "YOUTUBER", // Default type
              email: user.email,
            },
          })

          // Create membership (user as owner)
          await prisma.organizationMember.create({
            data: {
              userId: user.id,
              organizationId: organization.id,
              role: "OWNER",
            },
          })

          // Create FREE subscription
          const freeFeatures = getPlanFeatures("FREE")
          await (prisma as any).subscription.create({
            data: {
              organizationId: organization.id,
              stripeCustomerId: `free_${organization.id}`, // Placeholder for free users
              plan: "FREE",
              status: "ACTIVE",
              ...freeFeatures,
            },
          })

          console.log(`Created organization and FREE subscription for user: ${user.email}`)
        } catch (error) {
          console.error("Error creating organization for new user:", error)
        }
      } else if (!isDatabaseAvailable()) {
        console.warn("Database not available, skipping organization creation for new user")
      }
    },
    async signIn({ user, isNewUser }) {
      // Update last login (only if database is available)
      if (user.id && isDatabaseAvailable()) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          })
        } catch (error) {
          console.warn("Database not available, skipping last login update")
        }
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
})

// Type augmentation for NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      systemRole?: string        // System-level role (USER, ADMIN, SUPER_ADMIN)
      isSuspended?: boolean      // Whether user is suspended
      organizationId?: string    // Current organization
      organizationName?: string
      role?: string              // Organization-level role (OWNER, ADMIN, etc.)
      subscriptionPlan?: string
      subscriptionStatus?: string
    }
  }

  interface User {
    id: string
    systemRole?: string
    isSuspended?: boolean
    organizationId?: string
    role?: string
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string
    systemRole?: string
    isSuspended?: boolean
    organizationId?: string
    organizationName?: string
    role?: string
    subscriptionPlan?: string
    subscriptionStatus?: string
  }
}
