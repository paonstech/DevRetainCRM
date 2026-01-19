"use client"

import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { LogOut, Sparkles, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function SignOutPage() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isSignedOut, setIsSignedOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ redirect: false })
    setIsSignedOut(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        {/* Logo */}
        <Link href="/landing" className="inline-block mb-8">
          <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
            <Sparkles className="h-3 w-3 mr-1" />
            DevRetain CRM
          </Badge>
        </Link>

        {isSignedOut ? (
          <>
            {/* Success State */}
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Çıkış Yapıldı
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Hesabınızdan başarıyla çıkış yaptınız.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                  Tekrar Giriş Yap
                </Button>
              </Link>
              <Link href="/landing">
                <Button variant="outline">
                  Ana Sayfa
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation State */}
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
              <LogOut className="h-10 w-10 text-slate-600 dark:text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Çıkış Yapmak İstiyor musunuz?
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Hesabınızdan çıkış yapacaksınız. Devam etmek istiyor musunuz?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              >
                {isSigningOut ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Çıkış Yapılıyor...
                  </span>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Evet, Çıkış Yap
                  </>
                )}
              </Button>
              <Link href="/">
                <Button variant="outline">
                  Vazgeç
                </Button>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
