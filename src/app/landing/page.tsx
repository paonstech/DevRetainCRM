"use client"

import { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import {
  Zap,
  BarChart3,
  Users,
  FileText,
  Target,
  TrendingUp,
  ArrowRight,
  Check,
  Play,
  ChevronRight,
  Sparkles,
  Shield,
  Globe,
  Clock,
  Star,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

// Features data
const features = [
  {
    icon: TrendingUp,
    title: "ROI Takibi",
    description: "Sponsorluk yatırımlarınızın getirisini gerçek zamanlı izleyin. Detaylı finansal analizlerle kararlarınızı veriye dayandırın.",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-500/10 to-teal-500/10"
  },
  {
    icon: Target,
    title: "ROO Yönetimi",
    description: "Stratejik hedeflerinizi tanımlayın ve takip edin. Marka bilinirliği, etkileşim ve dönüşüm hedeflerinizi ölçümleyin.",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-500/10 to-purple-500/10"
  },
  {
    icon: Users,
    title: "Sponsor CRM",
    description: "Tüm sponsor ilişkilerinizi tek platformda yönetin. RFM segmentasyonu ile en değerli sponsorlarınızı belirleyin.",
    gradient: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-500/10 to-cyan-500/10"
  },
  {
    icon: FileText,
    title: "Otomatik Raporlama",
    description: "Profesyonel raporları tek tıkla oluşturun. PDF export ve otomatik yönetici özeti ile zaman kazanın.",
    gradient: "from-orange-500 to-amber-600",
    bgGradient: "from-orange-500/10 to-amber-500/10"
  }
]

// How it works steps
const steps = [
  {
    number: "01",
    title: "Hesap Aç",
    description: "Dakikalar içinde ücretsiz hesabınızı oluşturun. Kredi kartı gerekmez.",
    icon: Zap,
    color: "from-blue-500 to-indigo-600"
  },
  {
    number: "02",
    title: "Sponsorlarını Bağla",
    description: "Mevcut sponsorlarınızı ekleyin veya içe aktarın. Kampanyalarınızı oluşturun.",
    icon: Users,
    color: "from-violet-500 to-purple-600"
  },
  {
    number: "03",
    title: "Analiz Et",
    description: "ROI ve ROO metriklerinizi takip edin. Veriye dayalı kararlar alın.",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-600"
  }
]

// Pricing plans
const plans = [
  {
    name: "Free",
    price: "₺0",
    period: "sonsuza dek",
    description: "Başlangıç için ideal",
    features: [
      "5 Sponsor",
      "3 Aktif Kampanya",
      "Temel ROI Takibi",
      "Aylık Raporlar"
    ],
    cta: "Ücretsiz Başla",
    popular: false,
    gradient: "from-slate-600 to-slate-700"
  },
  {
    name: "Pro",
    price: "₺299",
    period: "/ay",
    description: "Büyüyen içerik üreticileri için",
    features: [
      "Sınırsız Sponsor",
      "Sınırsız Kampanya",
      "ROI + ROO Analizi",
      "Haftalık Raporlar",
      "RFM Segmentasyonu",
      "Öncelikli Destek"
    ],
    cta: "Pro'ya Geç",
    popular: true,
    gradient: "from-violet-600 to-purple-600"
  },
  {
    name: "Enterprise",
    price: "Özel",
    period: "teklif",
    description: "Büyük organizasyonlar için",
    features: [
      "Her şey Pro'da olanlar",
      "Özel Entegrasyonlar",
      "API Erişimi",
      "Beyaz Etiket Seçeneği",
      "Özel Eğitim",
      "7/24 Destek"
    ],
    cta: "İletişime Geç",
    popular: false,
    gradient: "from-slate-700 to-slate-800"
  }
]

// Social proof logos (placeholders)
const logos = [
  { name: "TechTurk", width: 120 },
  { name: "GamersTV", width: 100 },
  { name: "Anadolu Esports", width: 140 },
  { name: "DigiMedia", width: 110 },
  { name: "ContentLab", width: 120 },
  { name: "StreamPro", width: 100 },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                DevRetain
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Özellikler
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Nasıl Çalışır
              </a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Fiyatlandırma
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/">
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25">
                  Ücretsiz Başla
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              ) : (
                <Menu className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-sm font-medium text-slate-600 dark:text-slate-400 py-2">
                Özellikler
              </a>
              <a href="#how-it-works" className="block text-sm font-medium text-slate-600 dark:text-slate-400 py-2">
                Nasıl Çalışır
              </a>
              <a href="#pricing" className="block text-sm font-medium text-slate-600 dark:text-slate-400 py-2">
                Fiyatlandırma
              </a>
              <div className="pt-3 flex flex-col gap-2">
                <Link href="/">
                  <Button variant="outline" className="w-full">Giriş Yap</Button>
                </Link>
                <Link href="/">
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">
                    Ücretsiz Başla
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-500/5 to-indigo-500/5 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                Sponsorluk yönetiminde yeni dönem
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Sponsorluk Yönetiminde{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Veri Devri
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={fadeInUp}
              className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              ROI ve ROO metriklerinizi tek platformda takip edin. Sponsorlarınızı analiz edin, 
              kampanyalarınızı optimize edin ve veriye dayalı kararlar alın.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xl shadow-violet-500/25 text-base px-8 h-12"
                >
                  Ücretsiz Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-slate-300 dark:border-slate-700 text-base px-8 h-12 group"
              >
                <Play className="mr-2 h-4 w-4 text-violet-600 group-hover:scale-110 transition-transform" />
                Demoyu İzle
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              {[
                { value: "500+", label: "Aktif Kullanıcı" },
                { value: "₺10M+", label: "Takip Edilen Bütçe" },
                { value: "%95", label: "Müşteri Memnuniyeti" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image/Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl blur-2xl" />
              
              {/* Dashboard mockup */}
              <div className="relative bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-800">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-slate-700/50 rounded-md text-xs text-slate-400">
                      app.devretain.com/dashboard
                    </div>
                  </div>
                </div>
                
                {/* Dashboard content placeholder */}
                <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Toplam Gelir", value: "₺2.4M", color: "emerald" },
                      { label: "Aktif Kampanya", value: "12", color: "blue" },
                      { label: "Ortalama ROI", value: "%127", color: "violet" },
                      { label: "ROO Skoru", value: "86.4", color: "amber" }
                    ].map((card, i) => (
                      <div key={i} className={`p-4 rounded-lg bg-gradient-to-br from-${card.color}-500/10 to-${card.color}-500/5 border border-${card.color}-500/20`}>
                        <p className="text-xs text-slate-400">{card.label}</p>
                        <p className={`text-xl font-bold text-${card.color}-400 mt-1`}>{card.value}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Chart placeholder */}
                  <div className="h-48 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-end justify-around p-4 gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.05 }}
                        className="w-full bg-gradient-to-t from-violet-600 to-indigo-500 rounded-t opacity-80"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-8">
              Güvenle Kullanan Topluluklar
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {logos.map((logo, index) => (
                <motion.div
                  key={logo.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-center"
                >
                  <div 
                    className="h-8 px-6 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center"
                    style={{ width: logo.width }}
                  >
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {logo.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
              Özellikler
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Sponsorluk yönetiminin{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                tüm araçları
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Finansal takipten stratejik hedef yönetimine, sponsor ilişkilerinden otomatik raporlamaya kadar 
              ihtiyacınız olan her şey tek platformda.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative p-8 rounded-2xl border border-slate-200 dark:border-slate-800",
                  "bg-gradient-to-br",
                  feature.bgGradient,
                  "hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300",
                  "hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-6",
                  "bg-gradient-to-br",
                  feature.gradient,
                  "shadow-lg"
                )}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6">
                  <a 
                    href="#" 
                    className="inline-flex items-center text-sm font-medium text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300"
                  >
                    Daha fazla bilgi
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              Nasıl Çalışır
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              3 adımda{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                başlayın
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Karmaşık kurulumlar yok. Dakikalar içinde sponsorluk verilerinizi analiz etmeye başlayın.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-14 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-slate-300 dark:from-slate-700 to-transparent" />
                )}
                
                <div className="text-center">
                  {/* Step number */}
                  <div className="relative inline-flex mb-6">
                    <div className={cn(
                      "w-28 h-28 rounded-2xl flex items-center justify-center",
                      "bg-gradient-to-br",
                      step.color,
                      "shadow-xl"
                    )}>
                      <step.icon className="h-12 w-12 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-bold text-slate-900 dark:text-white">
                      {step.number}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
              Fiyatlandırma
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Her ölçeğe uygun{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                planlar
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Küçük içerik üreticilerinden büyük organizasyonlara, ihtiyacınıza uygun planı seçin.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative p-8 rounded-2xl border",
                  plan.popular 
                    ? "border-violet-500 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 dark:from-violet-500/10 dark:to-indigo-500/10" 
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 px-4">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      En Popüler
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {plan.description}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1">
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <Check className={cn(
                        "h-5 w-5 flex-shrink-0",
                        plan.popular ? "text-violet-500" : "text-emerald-500"
                      )} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/pricing" className="w-full">
                  <Button 
                    className={cn(
                      "w-full",
                      plan.popular 
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white" 
                        : ""
                    )}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Sponsorluk yönetiminizi{" "}
              <span className="text-violet-200">dönüştürmeye</span>{" "}
              hazır mısınız?
            </h2>
            <p className="text-lg text-violet-100 mb-10 max-w-2xl mx-auto">
              Binlerce içerik üreticisi ve organizasyon DevRetain ile sponsorluk süreçlerini 
              optimize ediyor. Siz de hemen başlayın.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-violet-700 hover:bg-violet-50 shadow-xl text-base px-8 h-12"
                >
                  Ücretsiz Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 text-base px-8 h-12"
              >
                Satış Ekibiyle Görüş
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">DevRetain</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Gizlilik</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Kullanım Şartları</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">İletişim</a>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2024 DevRetain. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
