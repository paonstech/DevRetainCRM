"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowLeft, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Yapılandırma Hatası",
    description: "Sunucu yapılandırmasında bir sorun var. Lütfen daha sonra tekrar deneyin.",
  },
  AccessDenied: {
    title: "Erişim Reddedildi",
    description: "Bu sayfaya erişim izniniz yok.",
  },
  Verification: {
    title: "Doğrulama Hatası",
    description: "Doğrulama linki geçersiz veya süresi dolmuş olabilir.",
  },
  OAuthSignin: {
    title: "Giriş Hatası",
    description: "OAuth sağlayıcısı ile giriş yapılırken bir hata oluştu.",
  },
  OAuthCallback: {
    title: "Callback Hatası",
    description: "OAuth callback işlemi sırasında bir hata oluştu.",
  },
  OAuthCreateAccount: {
    title: "Hesap Oluşturma Hatası",
    description: "OAuth hesabı oluşturulurken bir hata oluştu.",
  },
  EmailCreateAccount: {
    title: "Hesap Oluşturma Hatası",
    description: "E-posta ile hesap oluşturulurken bir hata oluştu.",
  },
  Callback: {
    title: "Callback Hatası",
    description: "Giriş işlemi sırasında bir hata oluştu.",
  },
  OAuthAccountNotLinked: {
    title: "Hesap Bağlı Değil",
    description: "Bu e-posta adresi farklı bir giriş yöntemiyle kayıtlı. Lütfen aynı yöntemi kullanarak giriş yapın.",
  },
  EmailSignin: {
    title: "E-posta Gönderme Hatası",
    description: "E-posta gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
  },
  CredentialsSignin: {
    title: "Giriş Hatası",
    description: "E-posta veya şifre hatalı.",
  },
  SessionRequired: {
    title: "Oturum Gerekli",
    description: "Bu sayfaya erişmek için giriş yapmanız gerekiyor.",
  },
  Default: {
    title: "Bir Hata Oluştu",
    description: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
  },
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Default"
  const errorInfo = errorMessages[error] || errorMessages.Default

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
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          {errorInfo.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {errorInfo.description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/auth/signin">
            <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
              <RefreshCw className="h-4 w-4" />
              Tekrar Dene
            </Button>
          </Link>
          <Link href="/landing">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Ana Sayfa
            </Button>
          </Link>
        </div>

        {/* Error Code */}
        <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
          Hata Kodu: {error}
        </p>
      </motion.div>
    </div>
  )
}
