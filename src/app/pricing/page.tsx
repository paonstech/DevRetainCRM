"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Check,
  X,
  Zap,
  Crown,
  Building2,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Users,
  BarChart3,
  FileText,
  Target,
  TrendingUp,
  Infinity,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Plan data
const plans = [
  {
    id: "free",
    name: "Hobby",
    description: "Bireysel içerik üreticileri için başlangıç planı",
    icon: Zap,
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    buttonText: "Ücretsiz Başla",
    buttonVariant: "outline" as const,
    gradient: "from-slate-500 to-slate-600",
    bgGradient: "from-slate-500/5 to-slate-600/5",
    features: [
      { name: "3 Aktif Kampanya", included: true },
      { name: "10 Sponsor Kaydı", included: true },
      { name: "2 Takım Üyesi", included: true },
      { name: "Temel ROI Analizi", included: true },
      { name: "E-posta Desteği", included: true },
      { name: "ROO Yönetimi", included: false },
      { name: "RFM Segmentasyonu", included: false },
      { name: "PDF Raporlama", included: false },
      { name: "CRM Entegrasyonu", included: false },
      { name: "API Erişimi", included: false },
    ],
    limits: {
      campaigns: "3",
      sponsors: "10",
      members: "2",
      storage: "100 MB",
    },
  },
  {
    id: "pro",
    name: "Professional",
    description: "Büyüyen ekipler ve ajanslar için ideal",
    icon: Crown,
    monthlyPrice: 49,
    yearlyPrice: 39, // %20 indirimli
    popular: true,
    buttonText: "Pro'ya Geç",
    buttonVariant: "default" as const,
    gradient: "from-violet-500 to-indigo-600",
    bgGradient: "from-violet-500/10 to-indigo-600/10",
    features: [
      { name: "Sınırsız Kampanya", included: true },
      { name: "500 Sponsor Kaydı", included: true },
      { name: "10 Takım Üyesi", included: true },
      { name: "Gelişmiş ROI Analizi", included: true },
      { name: "Öncelikli E-posta Desteği", included: true },
      { name: "Gelişmiş ROO Yönetimi", included: true },
      { name: "RFM Segmentasyonu", included: true },
      { name: "PDF Raporlama", included: true },
      { name: "CRM Entegrasyonu", included: true },
      { name: "API Erişimi", included: false },
    ],
    limits: {
      campaigns: "Sınırsız",
      sponsors: "500",
      members: "10",
      storage: "5 GB",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Kurumsal düzeyde özellikler ve destek",
    icon: Building2,
    monthlyPrice: 199,
    yearlyPrice: 159, // %20 indirimli
    popular: false,
    buttonText: "İletişime Geç",
    buttonVariant: "outline" as const,
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-500/10 to-orange-600/10",
    features: [
      { name: "Sınırsız Kampanya", included: true },
      { name: "Sınırsız Sponsor Kaydı", included: true },
      { name: "Sınırsız Takım Üyesi", included: true },
      { name: "Özel Ekonometrik Analizler", included: true },
      { name: "7/24 Öncelikli Destek", included: true },
      { name: "Gelişmiş ROO Yönetimi", included: true },
      { name: "RFM Segmentasyonu", included: true },
      { name: "PDF Raporlama", included: true },
      { name: "CRM Entegrasyonu", included: true },
      { name: "API Erişimi", included: true },
    ],
    limits: {
      campaigns: "Sınırsız",
      sponsors: "Sınırsız",
      members: "Sınırsız",
      storage: "Sınırsız",
    },
    extras: [
      "Özel marka logosu",
      "Dedicated hesap yöneticisi",
      "SLA garantisi",
      "Özel entegrasyonlar",
    ],
  },
]

// Feature comparison data
const featureComparison = [
  {
    category: "Kampanya Yönetimi",
    icon: Target,
    features: [
      { name: "Aktif Kampanya Sayısı", free: "3", pro: "Sınırsız", enterprise: "Sınırsız" },
      { name: "Sponsor Kaydı", free: "10", pro: "500", enterprise: "Sınırsız" },
      { name: "Takım Üyesi", free: "2", pro: "10", enterprise: "Sınırsız" },
      { name: "Dosya Depolama", free: "100 MB", pro: "5 GB", enterprise: "Sınırsız" },
    ],
  },
  {
    category: "Analitik & Raporlama",
    icon: BarChart3,
    features: [
      { name: "Temel ROI Analizi", free: true, pro: true, enterprise: true },
      { name: "Gelişmiş ROI Analizi", free: false, pro: true, enterprise: true },
      { name: "ROO Yönetimi", free: false, pro: true, enterprise: true },
      { name: "RFM Segmentasyonu", free: false, pro: true, enterprise: true },
      { name: "Özel Ekonometrik Analizler", free: false, pro: false, enterprise: true },
      { name: "LTV Tahminleme", free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "Raporlama & Export",
    icon: FileText,
    features: [
      { name: "Temel Raporlar", free: true, pro: true, enterprise: true },
      { name: "PDF Export", free: false, pro: true, enterprise: true },
      { name: "Yönetici Özeti", free: false, pro: true, enterprise: true },
      { name: "Özel Rapor Şablonları", free: false, pro: false, enterprise: true },
      { name: "Otomatik Rapor Gönderimi", free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "Entegrasyonlar",
    icon: Zap,
    features: [
      { name: "CRM Entegrasyonu", free: false, pro: true, enterprise: true },
      { name: "API Erişimi", free: false, pro: false, enterprise: true },
      { name: "Webhook Desteği", free: false, pro: false, enterprise: true },
      { name: "Özel Entegrasyonlar", free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "Destek",
    icon: Users,
    features: [
      { name: "E-posta Desteği", free: true, pro: true, enterprise: true },
      { name: "Öncelikli Destek", free: false, pro: true, enterprise: true },
      { name: "7/24 Destek", free: false, pro: false, enterprise: true },
      { name: "Dedicated Hesap Yöneticisi", free: false, pro: false, enterprise: true },
      { name: "SLA Garantisi", free: false, pro: false, enterprise: true },
    ],
  },
]

// FAQ data
const faqs = [
  {
    question: "Planımı istediğim zaman değiştirebilir miyim?",
    answer: "Evet, planınızı istediğiniz zaman yükseltebilir veya düşürebilirsiniz. Yükseltme anında geçerli olur, düşürme ise mevcut dönem sonunda aktif olur.",
  },
  {
    question: "Yıllık ödeme yaparsam indirim alabilir miyim?",
    answer: "Evet! Yıllık ödeme seçeneğinde tüm planlarda %20 indirim uygulanır. Bu, yılda 2 ay ücretsiz kullanım anlamına gelir.",
  },
  {
    question: "Ücretsiz deneme süresi var mı?",
    answer: "Pro ve Enterprise planlarında 14 günlük ücretsiz deneme süresi sunuyoruz. Kredi kartı bilgisi gerekmeden başlayabilirsiniz.",
  },
  {
    question: "İptal politikanız nedir?",
    answer: "İstediğiniz zaman iptal edebilirsiniz. İptal ettiğinizde, mevcut fatura döneminin sonuna kadar tüm özelliklere erişiminiz devam eder.",
  },
  {
    question: "Enterprise plan için özel fiyatlandırma var mı?",
    answer: "Evet, büyük ekipler ve özel ihtiyaçlar için özelleştirilmiş fiyatlandırma sunuyoruz. Bizimle iletişime geçin.",
  },
]

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") {
      // Redirect to dashboard for free plan
      window.location.href = "/"
      return
    }

    if (planId === "enterprise") {
      // Redirect to contact for enterprise
      window.location.href = "/contact"
      return
    }

    setIsLoading(planId)

    try {
      const response = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: "demo-org", // This should come from auth context
          plan: planId.toUpperCase(),
          successUrl: `${window.location.origin}/?subscription=success`,
          cancelUrl: `${window.location.origin}/pricing?subscription=canceled`,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return "Ücretsiz"
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
    return `$${price}`
  }

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return null
    const monthlyCost = plan.monthlyPrice * 12
    const yearlyCost = plan.yearlyPrice * 12
    const savings = monthlyCost - yearlyCost
    return savings
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/landing" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Ana Sayfa</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                Dashboard'a Git
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                Şeffaf Fiyatlandırma
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              İhtiyacınıza Uygun{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Plan Seçin
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            >
              Her ölçekte işletme için esnek fiyatlandırma. Gizli ücret yok, 
              istediğiniz zaman iptal edebilirsiniz.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div 
              variants={fadeInUp}
              className="mt-10 flex items-center justify-center gap-4"
            >
              <span className={cn(
                "text-sm font-medium transition-colors",
                !isYearly ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
              )}>
                Aylık
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-violet-600"
              />
              <span className={cn(
                "text-sm font-medium transition-colors",
                isYearly ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
              )}>
                Yıllık
              </span>
              {isYearly && (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  %20 İndirim
                </Badge>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {plans.map((plan) => {
              const Icon = plan.icon
              const savings = getSavings(plan)
              
              return (
                <motion.div key={plan.id} variants={fadeInUp}>
                  <Card className={cn(
                    "relative h-full flex flex-col transition-all duration-300 hover:shadow-xl",
                    plan.popular 
                      ? "border-violet-500/50 shadow-lg shadow-violet-500/10 scale-[1.02]" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  )}>
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 px-4 py-1 shadow-lg">
                          <Crown className="h-3 w-3 mr-1" />
                          En Popüler
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      {/* Icon */}
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br mb-4",
                        plan.bgGradient
                      )}>
                        <Icon className={cn(
                          "h-6 w-6",
                          plan.id === "free" && "text-slate-600 dark:text-slate-400",
                          plan.id === "pro" && "text-violet-600 dark:text-violet-400",
                          plan.id === "enterprise" && "text-amber-600 dark:text-amber-400"
                        )} />
                      </div>

                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="text-sm">{plan.description}</CardDescription>

                      {/* Price */}
                      <div className="mt-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-slate-900 dark:text-white">
                            {getPrice(plan)}
                          </span>
                          {plan.monthlyPrice > 0 && (
                            <span className="text-slate-500 dark:text-slate-400">
                              /{isYearly ? "yıl" : "ay"}
                            </span>
                          )}
                        </div>
                        {isYearly && savings && savings > 0 && (
                          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                            Yılda ${savings} tasarruf
                          </p>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1">
                      {/* Limits Summary */}
                      <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {plan.limits.campaigns}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Kampanya</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {plan.limits.sponsors}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Sponsor</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {plan.limits.members}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Üye</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {plan.limits.storage}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Depolama</div>
                        </div>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            {feature.included ? (
                              <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <X className="h-5 w-5 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                            )}
                            <span className={cn(
                              "text-sm",
                              feature.included 
                                ? "text-slate-700 dark:text-slate-300" 
                                : "text-slate-400 dark:text-slate-500"
                            )}>
                              {feature.name}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Enterprise Extras */}
                      {plan.extras && (
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                            Ek Özellikler:
                          </p>
                          <ul className="space-y-2">
                            {plan.extras.map((extra, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                {extra}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter>
                      <Button
                        className={cn(
                          "w-full",
                          plan.popular && "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
                        )}
                        variant={plan.buttonVariant}
                        size="lg"
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isLoading === plan.id}
                      >
                        {isLoading === plan.id ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            İşleniyor...
                          </span>
                        ) : (
                          <>
                            {plan.buttonText}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Detaylı Özellik Karşılaştırması
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Tüm özellikleri karşılaştırarak size en uygun planı seçin
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <div className="inline-block min-w-full">
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {/* Header */}
                <div className="grid grid-cols-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <div className="p-4 font-medium text-slate-900 dark:text-white">
                    Özellikler
                  </div>
                  <div className="p-4 text-center">
                    <div className="font-medium text-slate-900 dark:text-white">Hobby</div>
                    <div className="text-sm text-slate-500">Ücretsiz</div>
                  </div>
                  <div className="p-4 text-center bg-violet-50 dark:bg-violet-900/20">
                    <div className="font-medium text-violet-600 dark:text-violet-400">Professional</div>
                    <div className="text-sm text-slate-500">${isYearly ? "39" : "49"}/ay</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="font-medium text-slate-900 dark:text-white">Enterprise</div>
                    <div className="text-sm text-slate-500">${isYearly ? "159" : "199"}/ay</div>
                  </div>
                </div>

                {/* Feature Groups */}
                {featureComparison.map((group, groupIdx) => {
                  const GroupIcon = group.icon
                  return (
                    <div key={groupIdx}>
                      {/* Group Header */}
                      <div className="grid grid-cols-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-700">
                        <div className="p-4 col-span-4 flex items-center gap-2">
                          <GroupIcon className="h-4 w-4 text-slate-500" />
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {group.category}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      {group.features.map((feature, featureIdx) => (
                        <div 
                          key={featureIdx}
                          className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                        >
                          <div className="p-4 text-sm text-slate-600 dark:text-slate-400">
                            {feature.name}
                          </div>
                          <div className="p-4 flex justify-center">
                            {typeof feature.free === "boolean" ? (
                              feature.free ? (
                                <Check className="h-5 w-5 text-emerald-500" />
                              ) : (
                                <X className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                              )
                            ) : (
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {feature.free}
                              </span>
                            )}
                          </div>
                          <div className="p-4 flex justify-center bg-violet-50/50 dark:bg-violet-900/10">
                            {typeof feature.pro === "boolean" ? (
                              feature.pro ? (
                                <Check className="h-5 w-5 text-emerald-500" />
                              ) : (
                                <X className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                              )
                            ) : (
                              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                                {feature.pro}
                              </span>
                            )}
                          </div>
                          <div className="p-4 flex justify-center">
                            {typeof feature.enterprise === "boolean" ? (
                              feature.enterprise ? (
                                <Check className="h-5 w-5 text-emerald-500" />
                              ) : (
                                <X className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                              )
                            ) : (
                              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                {feature.enterprise}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Güvenli Ödeme", desc: "256-bit SSL şifreleme" },
              { icon: Clock, title: "7/24 Destek", desc: "Her zaman yanınızdayız" },
              { icon: TrendingUp, title: "99.9% Uptime", desc: "Kesintisiz hizmet" },
              { icon: Users, title: "10,000+ Kullanıcı", desc: "Güvenle kullanıyor" },
            ].map((badge, idx) => {
              const Icon = badge.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h3 className="font-medium text-slate-900 dark:text-white">{badge.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{badge.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Sıkça Sorulan Sorular
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Fiyatlandırma hakkında merak ettikleriniz
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
              >
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

            {/* Content */}
            <div className="relative px-8 py-16 sm:px-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Hala kararsız mısınız?
              </h2>
              <p className="text-lg text-violet-100 mb-8 max-w-xl mx-auto">
                14 günlük ücretsiz deneme ile tüm Pro özelliklerini test edin. 
                Kredi kartı gerekmez.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-violet-600 hover:bg-violet-50 shadow-xl"
                  onClick={() => handleSubscribe("pro")}
                >
                  Ücretsiz Deneyin
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <a href="mailto:sales@devretain.com">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Satış Ekibiyle Görüşün
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2024 DevRetain CRM. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                Kullanım Şartları
              </a>
              <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                Gizlilik Politikası
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
