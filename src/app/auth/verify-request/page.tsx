"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function VerifyRequestPage() {
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

        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-6">
          <Mail className="h-10 w-10 text-violet-600 dark:text-violet-400" />
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          E-postanızı Kontrol Edin
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Giriş yapmak için e-posta adresinize bir link gönderdik. 
          E-postanızdaki linke tıklayarak devam edebilirsiniz.
        </p>

        {/* Tips */}
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 mb-8 text-left">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            E-posta gelmediyse:
          </p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Spam/Junk klasörünü kontrol edin</li>
            <li>• E-posta adresinizi doğru yazdığınızdan emin olun</li>
            <li>• Birkaç dakika bekleyin</li>
          </ul>
        </div>

        {/* Back Button */}
        <Link href="/auth/signin">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Giriş Sayfasına Dön
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
