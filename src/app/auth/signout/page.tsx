"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Sparkles, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function SignOutPage() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isSignedOut, setIsSignedOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    
    // Simulate sign out (in real app, this would call NextAuth signOut)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setIsSignedOut(true)
    
    // Redirect to landing page after 1.5 seconds
    setTimeout(() => {
      router.push("/landing")
    }, 1500)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="inline-block mb-8">
          <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
            <Sparkles className="h-3 w-3 mr-1" />
            DevRetain CRM
          </Badge>
        </Link>

        {isSignedOut ? (
          <>
            {/* Success State */}
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 animate-pulse">
              <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Çıkış Yapıldı!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Hesabınızdan başarıyla çıkış yaptınız.
            </p>
            <p className="text-sm text-slate-400">
              Ana sayfaya yönlendiriliyorsunuz...
            </p>
          </>
        ) : (
          <>
            {/* Confirmation State */}
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
              <LogOut className="h-10 w-10 text-slate-600 dark:text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Çıkış yapmak istediğinizden emin misiniz?
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Hesabınızdan çıkış yapacaksınız.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="bg-red-600 hover:bg-red-700 min-w-[140px]"
              >
                {isSigningOut ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Çıkılıyor...
                  </span>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Evet, Çıkış Yap
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="min-w-[140px]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vazgeç
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
