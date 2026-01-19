"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Mail, 
  ArrowRight, 
  Sparkles,
  Shield,
  Zap,
  BarChart3,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Google Icon Component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function SignInPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const error = searchParams.get("error")
  
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading("google")
    await signIn("google", { callbackUrl })
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsLoading("email")
    try {
      await signIn("resend", { 
        email, 
        callbackUrl,
        redirect: false,
      })
      setEmailSent(true)
    } catch (error) {
      console.error("Email sign in error:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const features = [
    { icon: BarChart3, text: "ROI & ROO Analizi" },
    { icon: Zap, text: "Gerçek Zamanlı Takip" },
    { icon: Shield, text: "Güvenli Veri Yönetimi" },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link href="/landing" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm">Ana Sayfa</span>
            </Link>
          </div>

          <div className="space-y-8">
            <div>
              <Badge className="bg-white/10 text-white border-white/20 mb-6">
                <Sparkles className="h-3 w-3 mr-1" />
                DevRetain CRM
              </Badge>
              <h1 className="text-4xl font-bold mb-4">
                Sponsorluk Yönetiminde<br />
                <span className="text-violet-200">Veri Devri</span>
              </h1>
              <p className="text-lg text-violet-100 max-w-md">
                ROI ve ROO metriklerinizi tek platformda takip edin. 
                Veriye dayalı kararlar alın, sponsorluklarınızı optimize edin.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-violet-100">{feature.text}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="text-sm text-violet-200">
            © 2024 DevRetain CRM. Tüm hakları saklıdır.
          </div>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/landing">
              <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
                <Sparkles className="h-3 w-3 mr-1" />
                DevRetain CRM
              </Badge>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Hoş Geldiniz
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Hesabınıza giriş yapın veya yeni hesap oluşturun
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                {error === "OAuthAccountNotLinked" 
                  ? "Bu e-posta adresi farklı bir giriş yöntemiyle kayıtlı."
                  : "Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin."}
              </p>
            </div>
          )}

          {emailSent ? (
            /* Email Sent Confirmation */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                E-postanızı Kontrol Edin
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                <span className="font-medium text-slate-900 dark:text-white">{email}</span> 
                {" "}adresine giriş linki gönderdik.
              </p>
              <Button
                variant="ghost"
                onClick={() => setEmailSent(false)}
                className="text-sm"
              >
                Farklı bir e-posta kullan
              </Button>
            </motion.div>
          ) : (
            /* Sign In Form */
            <div className="space-y-6">
              {/* Google Sign In */}
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base"
                onClick={handleGoogleSignIn}
                disabled={isLoading !== null}
              >
                {isLoading === "google" ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Bağlanıyor...
                  </span>
                ) : (
                  <>
                    <GoogleIcon className="h-5 w-5 mr-2" />
                    Google ile Devam Et
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-50 dark:bg-slate-950 text-slate-500">
                    veya e-posta ile
                  </span>
                </div>
              </div>

              {/* Email Sign In */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta Adresi</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  disabled={isLoading !== null || !email}
                >
                  {isLoading === "email" ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Gönderiliyor...
                    </span>
                  ) : (
                    <>
                      Magic Link Gönder
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Terms */}
              <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                Devam ederek{" "}
                <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline">
                  Kullanım Şartları
                </a>
                {" "}ve{" "}
                <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline">
                  Gizlilik Politikası
                </a>
                'nı kabul etmiş olursunuz.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
