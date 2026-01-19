"use client"

import Link from "next/link"
import { AlertTriangle, Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuspendedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            Hesabınız Askıya Alındı
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Güvenlik veya politika ihlali nedeniyle hesabınız geçici olarak askıya alınmıştır.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-2">
              Bu durum aşağıdaki nedenlerden kaynaklanmış olabilir:
            </h3>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
              <li>Kullanım koşullarının ihlali</li>
              <li>Şüpheli hesap aktivitesi</li>
              <li>Ödeme sorunları</li>
              <li>Güvenlik endişeleri</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full gap-2">
              <a href="mailto:support@devretain.com">
                <Mail className="h-4 w-4" />
                Destek ile İletişime Geç
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full gap-2">
              <Link href="/landing">
                <ArrowLeft className="h-4 w-4" />
                Ana Sayfaya Dön
              </Link>
            </Button>
          </div>

          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            Hesabınızın yanlışlıkla askıya alındığını düşünüyorsanız, 
            lütfen <a href="mailto:support@devretain.com" className="text-violet-600 hover:underline">support@devretain.com</a> adresinden 
            bizimle iletişime geçin.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
