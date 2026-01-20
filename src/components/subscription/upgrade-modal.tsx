"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Crown,
  Sparkles,
  Check,
  X,
  Zap,
  BarChart3,
  FileText,
  ShoppingCart,
  Shield,
  Rocket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useSubscription, SubscriptionPlan } from "@/contexts/subscription-context"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature?: string
  requiredPlan?: SubscriptionPlan
}

const PLAN_DETAILS = {
  PRO: {
    name: "Pro",
    price: "₺499",
    period: "/ay",
    description: "Büyüyen işletmeler için gelişmiş özellikler",
    icon: Sparkles,
    color: "violet",
    features: [
      "50 aktif kampanya",
      "500 sponsor kaydı",
      "Gelişmiş ROI/ROO analizi",
      "RFM segmentasyonu",
      "PDF rapor export",
      "Rapor Pazaryeri erişimi",
      "Öncelikli e-posta desteği",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: "₺1,999",
    period: "/ay",
    description: "Kurumsal düzeyde özellikler ve destek",
    icon: Crown,
    color: "amber",
    features: [
      "Sınırsız kampanya",
      "Sınırsız sponsor",
      "Tüm Pro özellikleri",
      "API erişimi",
      "Özel entegrasyonlar",
      "Öncelikli 7/24 destek",
      "Özel hesap yöneticisi",
    ],
  },
}

const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  hasAdvancedAnalytics: BarChart3,
  hasRFMAnalysis: BarChart3,
  hasROOTracking: BarChart3,
  hasPDFExport: FileText,
  hasMarketplaceAccess: ShoppingCart,
  hasUnlimitedReports: FileText,
  hasAPIAccess: Shield,
  hasPrioritySupport: Rocket,
}

const FEATURE_NAMES: Record<string, string> = {
  hasAdvancedAnalytics: "Gelişmiş Analitik",
  hasRFMAnalysis: "RFM Analizi",
  hasROOTracking: "ROO Takibi",
  hasPDFExport: "PDF Export",
  hasMarketplaceAccess: "Rapor Pazaryeri",
  hasUnlimitedReports: "Sınırsız Rapor",
  hasAPIAccess: "API Erişimi",
  hasPrioritySupport: "Öncelikli Destek",
}

export function UpgradeModal({ 
  open, 
  onOpenChange, 
  feature,
  requiredPlan = "PRO" 
}: UpgradeModalProps) {
  const { plan: currentPlan, setPlan } = useSubscription()
  const [isLoading, setIsLoading] = useState(false)

  const planDetails = PLAN_DETAILS[requiredPlan as keyof typeof PLAN_DETAILS]
  const PlanIcon = planDetails.icon
  const FeatureIcon = feature ? FEATURE_ICONS[feature] || Zap : Zap
  const featureName = feature ? FEATURE_NAMES[feature] || feature : "Bu özellik"

  const handleUpgrade = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo: directly upgrade
    setPlan(requiredPlan)
    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <PlanIcon className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl">Planınızı Yükseltin</DialogTitle>
          <DialogDescription className="text-base">
            <span className="font-medium text-slate-900 dark:text-white">{featureName}</span> özelliğine erişmek için{" "}
            <Badge className={cn(
              "mx-1",
              requiredPlan === "PRO" 
                ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" 
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            )}>
              {planDetails.name}
            </Badge>{" "}
            planına geçmeniz gerekiyor.
          </DialogDescription>
        </DialogHeader>

        {/* Current Plan Info */}
        <div className="mb-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Mevcut planınız:</span>
            <Badge variant="outline">{currentPlan}</Badge>
          </div>
          <X className="h-4 w-4 text-red-500" />
        </div>

        {/* Plan Card */}
        <div className={cn(
          "p-6 rounded-xl border-2",
          requiredPlan === "PRO" 
            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/10" 
            : "border-amber-500 bg-amber-50 dark:bg-amber-900/10"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {planDetails.name}
              </h3>
              <p className="text-sm text-slate-500">{planDetails.description}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {planDetails.price}
              </span>
              <span className="text-slate-500">{planDetails.period}</span>
            </div>
          </div>

          <ul className="space-y-2">
            {planDetails.features.map((feat, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Check className={cn(
                  "h-4 w-4",
                  requiredPlan === "PRO" ? "text-violet-600" : "text-amber-600"
                )} />
                <span className="text-slate-700 dark:text-slate-300">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            onClick={handleUpgrade}
            disabled={isLoading}
            className={cn(
              "w-full h-12 text-base",
              requiredPlan === "PRO" 
                ? "bg-violet-600 hover:bg-violet-700" 
                : "bg-amber-600 hover:bg-amber-700"
            )}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                İşleniyor...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                {planDetails.name} Planına Geç
              </>
            )}
          </Button>
          
          <Link href="/pricing" className="w-full">
            <Button variant="outline" className="w-full">
              Tüm Planları Karşılaştır
            </Button>
          </Link>
          
          <button 
            onClick={() => onOpenChange(false)}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Şimdilik geç
          </button>
        </div>

        {/* Trust Badge */}
        <p className="text-center text-xs text-slate-400 mt-4">
          🔒 Güvenli ödeme • İstediğiniz zaman iptal • 14 gün para iade garantisi
        </p>
      </DialogContent>
    </Dialog>
  )
}

// Simpler inline upgrade prompt for smaller areas
export function UpgradePrompt({ 
  feature, 
  requiredPlan = "PRO",
  className 
}: { 
  feature?: string
  requiredPlan?: SubscriptionPlan
  className?: string 
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const featureName = feature ? FEATURE_NAMES[feature] || feature : "Bu özellik"

  return (
    <>
      <div className={cn(
        "p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-center",
        className
      )}>
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/30 mb-3">
          <Crown className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        <h4 className="font-medium text-slate-900 dark:text-white mb-1">
          {requiredPlan} Plan Gerekli
        </h4>
        <p className="text-sm text-slate-500 mb-3">
          {featureName} için planınızı yükseltin
        </p>
        <Button 
          size="sm" 
          onClick={() => setModalOpen(true)}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Zap className="h-4 w-4 mr-1" />
          Planı Yükselt
        </Button>
      </div>
      
      <UpgradeModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        feature={feature}
        requiredPlan={requiredPlan}
      />
    </>
  )
}
