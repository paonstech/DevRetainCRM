"use client"

import { useState, ReactNode } from "react"
import { useSubscription, SubscriptionPlan } from "@/contexts/subscription-context"
import { UpgradeModal, UpgradePrompt } from "./upgrade-modal"

interface SubscriptionGateProps {
  children: ReactNode
  feature?: string
  requiredPlan?: SubscriptionPlan
  fallback?: ReactNode
  mode?: "block" | "blur" | "hide"
}

/**
 * SubscriptionGate - Wraps content that requires a specific subscription plan
 * 
 * Modes:
 * - "block": Shows upgrade prompt instead of content
 * - "blur": Shows blurred content with overlay
 * - "hide": Completely hides content
 */
export function SubscriptionGate({ 
  children, 
  feature,
  requiredPlan = "PRO",
  fallback,
  mode = "block"
}: SubscriptionGateProps) {
  const { plan, isProOrHigher, isEnterprise } = useSubscription()
  const [modalOpen, setModalOpen] = useState(false)

  // Check if user has access
  const hasAccess = requiredPlan === "PRO" 
    ? isProOrHigher() 
    : requiredPlan === "ENTERPRISE" 
      ? isEnterprise() 
      : true

  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>
  }

  // Handle different modes
  switch (mode) {
    case "hide":
      return null

    case "blur":
      return (
        <div className="relative">
          <div className="blur-sm pointer-events-none select-none">
            {children}
          </div>
          <div 
            className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            <UpgradePrompt feature={feature} requiredPlan={requiredPlan} />
          </div>
          <UpgradeModal 
            open={modalOpen} 
            onOpenChange={setModalOpen}
            feature={feature}
            requiredPlan={requiredPlan}
          />
        </div>
      )

    case "block":
    default:
      return fallback ? (
        <>{fallback}</>
      ) : (
        <UpgradePrompt feature={feature} requiredPlan={requiredPlan} />
      )
  }
}

/**
 * Hook to get subscription-aware button props
 */
export function useSubscriptionButton(feature?: string, requiredPlan: SubscriptionPlan = "PRO") {
  const { isProOrHigher, isEnterprise } = useSubscription()
  const [modalOpen, setModalOpen] = useState(false)

  const hasAccess = requiredPlan === "PRO" 
    ? isProOrHigher() 
    : requiredPlan === "ENTERPRISE" 
      ? isEnterprise() 
      : true

  return {
    hasAccess,
    modalOpen,
    setModalOpen,
    buttonProps: hasAccess ? {} : {
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        setModalOpen(true)
      }
    },
    Modal: () => (
      <UpgradeModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        feature={feature}
        requiredPlan={requiredPlan}
      />
    )
  }
}

/**
 * Subscription-aware button that shows upgrade modal if needed
 */
interface SubscriptionButtonProps {
  children: ReactNode
  feature?: string
  requiredPlan?: SubscriptionPlan
  onClick?: () => void
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

export function SubscriptionButton({
  children,
  feature,
  requiredPlan = "PRO",
  onClick,
  className,
  ...props
}: SubscriptionButtonProps) {
  const { hasAccess, modalOpen, setModalOpen, Modal } = useSubscriptionButton(feature, requiredPlan)

  const handleClick = () => {
    if (hasAccess) {
      onClick?.()
    } else {
      setModalOpen(true)
    }
  }

  return (
    <>
      <button onClick={handleClick} className={className} {...props}>
        {children}
      </button>
      <Modal />
    </>
  )
}
