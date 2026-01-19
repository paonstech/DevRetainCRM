"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { CampaignForm } from "@/components/forms/campaign-form"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-locale"

export default function NewCampaignPage() {
  const router = useRouter()
  const { locale } = useLocale()

  const handleSuccess = () => {
    // Redirect to dashboard after successful save
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  const handleCancel = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DevRetain CRM
              </h1>
              <p className="text-xs text-muted-foreground">
                {locale === 'tr' ? 'Sponsorluk Yönetim Sistemi' : 'Sponsorship Management System'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-600">
                {locale === 'tr' ? 'Demo Modu' : 'Demo Mode'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {locale === 'tr' ? "Dashboard'a Dön" : 'Back to Dashboard'}
            </Button>
          </Link>
        </div>

        {/* Form */}
        <CampaignForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </main>

      {/* Toast Provider */}
      <Toaster />
    </div>
  )
}
