"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type SubscriptionPlan = "FREE" | "PRO" | "ENTERPRISE"
export type SubscriptionStatus = "ACTIVE" | "PAST_DUE" | "CANCELED" | "TRIALING"

interface SubscriptionFeatures {
  maxCampaigns: number
  maxSponsors: number
  hasAdvancedAnalytics: boolean
  hasRFMAnalysis: boolean
  hasROOTracking: boolean
  hasPDFExport: boolean
  hasMarketplaceAccess: boolean
  hasUnlimitedReports: boolean
  hasAPIAccess: boolean
  hasPrioritySupport: boolean
}

interface SubscriptionContextType {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  features: SubscriptionFeatures
  currentPeriodEnd: Date | null
  
  // Helper functions
  canAccess: (feature: keyof SubscriptionFeatures) => boolean
  canAccessRoute: (route: string) => boolean
  isProOrHigher: () => boolean
  isEnterprise: () => boolean
  
  // For demo purposes - toggle plan
  setPlan: (plan: SubscriptionPlan) => void
}

// Feature configuration per plan
const PLAN_FEATURES: Record<SubscriptionPlan, SubscriptionFeatures> = {
  FREE: {
    maxCampaigns: 3,
    maxSponsors: 10,
    hasAdvancedAnalytics: false,
    hasRFMAnalysis: false,
    hasROOTracking: false,
    hasPDFExport: false,
    hasMarketplaceAccess: false,
    hasUnlimitedReports: false,
    hasAPIAccess: false,
    hasPrioritySupport: false,
  },
  PRO: {
    maxCampaigns: 50,
    maxSponsors: 500,
    hasAdvancedAnalytics: true,
    hasRFMAnalysis: true,
    hasROOTracking: true,
    hasPDFExport: true,
    hasMarketplaceAccess: true,
    hasUnlimitedReports: true,
    hasAPIAccess: false,
    hasPrioritySupport: false,
  },
  ENTERPRISE: {
    maxCampaigns: -1, // Unlimited
    maxSponsors: -1,
    hasAdvancedAnalytics: true,
    hasRFMAnalysis: true,
    hasROOTracking: true,
    hasPDFExport: true,
    hasMarketplaceAccess: true,
    hasUnlimitedReports: true,
    hasAPIAccess: true,
    hasPrioritySupport: true,
  },
}

// Routes that require specific plans
const PRO_ROUTES = [
  "/marketplace",
  "/reports/advanced",
  "/analytics/rfm",
  "/analytics/roo",
]

const ENTERPRISE_ROUTES = [
  "/api-settings",
  "/integrations",
]

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  // Demo: Start with PRO plan, can be changed for testing
  const [plan, setPlan] = useState<SubscriptionPlan>("PRO")
  const [status] = useState<SubscriptionStatus>("ACTIVE")
  const [currentPeriodEnd] = useState<Date | null>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

  const features = PLAN_FEATURES[plan]

  const canAccess = (feature: keyof SubscriptionFeatures): boolean => {
    const value = features[feature]
    if (typeof value === "boolean") return value
    if (typeof value === "number") return value !== 0
    return false
  }

  const canAccessRoute = (route: string): boolean => {
    // Check enterprise routes first
    if (ENTERPRISE_ROUTES.some(r => route.startsWith(r))) {
      return plan === "ENTERPRISE"
    }
    
    // Check pro routes
    if (PRO_ROUTES.some(r => route.startsWith(r))) {
      return plan === "PRO" || plan === "ENTERPRISE"
    }
    
    // All other routes are accessible
    return true
  }

  const isProOrHigher = (): boolean => {
    return plan === "PRO" || plan === "ENTERPRISE"
  }

  const isEnterprise = (): boolean => {
    return plan === "ENTERPRISE"
  }

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        status,
        features,
        currentPeriodEnd,
        canAccess,
        canAccessRoute,
        isProOrHigher,
        isEnterprise,
        setPlan,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}

// Hook to check specific feature access
export function useFeatureAccess(feature: keyof SubscriptionFeatures) {
  const { canAccess, plan } = useSubscription()
  return {
    hasAccess: canAccess(feature),
    currentPlan: plan,
    requiredPlan: feature.startsWith("hasAPI") ? "ENTERPRISE" : "PRO",
  }
}
