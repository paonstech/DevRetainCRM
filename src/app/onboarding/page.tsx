"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  Youtube,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Users,
  Target,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const organizationTypes = [
  {
    id: "YOUTUBER",
    name: "İçerik Üreticisi",
    description: "YouTube, Instagram, TikTok ve diğer platformlarda içerik üretiyorum",
    icon: Youtube,
    gradient: "from-red-500 to-pink-600",
  },
  {
    id: "CLUB",
    name: "Kulüp / Topluluk",
    description: "Spor kulübü, öğrenci topluluğu veya sivil toplum kuruluşu",
    icon: Users,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "BUSINESS",
    name: "İşletme / Ajans",
    description: "Pazarlama ajansı, medya şirketi veya kurumsal işletme",
    icon: Briefcase,
    gradient: "from-violet-500 to-purple-600",
  },
]

const steps = [
  { id: 1, title: "Organizasyon Tipi" },
  { id: 2, title: "Temel Bilgiler" },
  { id: 3, title: "Tamamlandı" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    description: "",
    website: "",
  })

  const handleTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, type }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep === 1 && !formData.type) return
    if (currentStep === 2 && !formData.name) return
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Update organization via API
      const response = await fetch("/api/organizations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setCurrentStep(3)
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/")
        }, 2000)
      }
    } catch (error) {
      console.error("Onboarding error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
            <Sparkles className="h-3 w-3 mr-1" />
            DevRetain CRM
          </Badge>
          
          {/* Progress */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep >= step.id
                    ? "bg-violet-600 text-white"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                )}>
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-12 h-0.5 mx-1",
                    currentStep > step.id
                      ? "bg-violet-600"
                      : "bg-slate-200 dark:bg-slate-800"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Organization Type */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  Organizasyon Tipinizi Seçin
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Size en uygun deneyimi sunabilmemiz için organizasyon tipinizi belirtin
                </p>
              </div>

              <div className="grid gap-4">
                {organizationTypes.map((type) => {
                  const Icon = type.icon
                  const isSelected = formData.type === type.id
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className={cn(
                        "relative p-6 rounded-xl border-2 text-left transition-all",
                        isSelected
                          ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                          type.gradient
                        )}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {type.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {type.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!formData.type}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  Devam Et
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Basic Info */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  Temel Bilgiler
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Organizasyonunuz hakkında temel bilgileri girin
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Organizasyon Adı *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Örn: Acme Medya"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Organizasyonunuz hakkında kısa bir açıklama..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Web Sitesi</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Geri
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!formData.name || isLoading}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Kaydediliyor...
                    </span>
                  ) : (
                    <>
                      Tamamla
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Complete */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Hoş Geldiniz!
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Hesabınız hazır. Dashboard'a yönlendiriliyorsunuz...
              </p>

              {/* Features Preview */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {[
                  { icon: Target, label: "Kampanyalar" },
                  { icon: Users, label: "Sponsorlar" },
                  { icon: BarChart3, label: "Analizler" },
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800"
                    >
                      <Icon className="h-6 w-6 mx-auto text-violet-600 dark:text-violet-400 mb-2" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {item.label}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
