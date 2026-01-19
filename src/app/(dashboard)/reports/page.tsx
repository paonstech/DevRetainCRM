"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Zap,
  FileText,
  Download,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/reports/date-range-picker"
import { ReportPreview } from "@/components/reports/report-preview"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import {
  generateReport,
  exportToPDF,
  formatShortDate,
  type ReportData,
} from "@/lib/report-generator"
import { useSubscription } from "@/contexts/subscription-context"
import { UpgradeModal } from "@/components/subscription/upgrade-modal"
import { Lock, Unlock, Crown } from "lucide-react"

export default function ReportsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  
  // Subscription check
  const { isProOrHigher, plan } = useSubscription()
  const hasPDFExport = isProOrHigher()
  
  // Varsayılan tarih aralığı: Son 6 ay
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isInitialized, setIsInitialized] = useState(false)

  // Client-side'da tarihleri ayarla (hydration hatası önlenir)
  useEffect(() => {
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - 6)
    setStartDate(start)
    setEndDate(end)
    setIsInitialized(true)
  }, [])

  // Tarihler ayarlandığında rapor oluştur
  useEffect(() => {
    if (isInitialized && startDate && endDate) {
      handleGenerateReport()
    }
  }, [isInitialized])

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Hata",
        description: "Lütfen tarih aralığı seçin.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simüle edilmiş yükleme
    setTimeout(() => {
      const data = generateReport("org-1", {
        startDate,
        endDate,
      })
      setReportData(data)
      setIsLoading(false)

      toast({
        title: "Rapor Oluşturuldu",
        description: `${formatShortDate(startDate)} - ${formatShortDate(endDate)} dönemi için rapor hazır.`,
        variant: "success",
      })
    }, 500)
  }

  const handleExportPDF = async () => {
    // Check subscription before export
    if (!hasPDFExport) {
      setUpgradeModalOpen(true)
      return
    }
    
    if (!reportData) return

    setIsExporting(true)

    try {
      const filename = `DevRetain_Rapor_${formatShortDate(reportData.dateRange.startDate)}_${formatShortDate(reportData.dateRange.endDate)}`
        .replace(/\./g, "-")
        .replace(/\s/g, "_")

      await exportToPDF("report-content", filename)

      toast({
        title: "PDF İndirildi! 📄",
        description: `${filename}.pdf başarıyla oluşturuldu.`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "PDF oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
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
              <p className="text-xs text-muted-foreground">Sponsorluk Yönetim Sistemi</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-600">Demo Modu</span>
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
              Dashboard'a Dön
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Rapor Oluştur
              </h2>
              <p className="text-muted-foreground mt-1">
                Kampanya performansları, RFM analizi ve LTV tahminleri
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Rapor Ayarları</CardTitle>
            <CardDescription>
              Rapor dönemini seçin ve raporu oluşturun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleGenerateReport}
                  disabled={isLoading || !startDate || !endDate}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Raporu Yenile
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleExportPDF}
                  disabled={isExporting || !reportData}
                  className={hasPDFExport 
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" 
                    : "bg-slate-400 hover:bg-slate-500"
                  }
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      İndiriliyor...
                    </>
                  ) : hasPDFExport ? (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      PDF İndir
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pro ile İndir
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Preview */}
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Rapor oluşturuluyor...</p>
              </div>
            </CardContent>
          </Card>
        ) : reportData ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <ReportPreview data={reportData} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-20">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Rapor oluşturmak için tarih aralığı seçin ve "Raporu Yenile" butonuna tıklayın.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Toast Provider */}
      <Toaster />

      {/* Upgrade Modal */}
      <UpgradeModal 
        open={upgradeModalOpen} 
        onOpenChange={setUpgradeModalOpen}
        feature="hasPDFExport"
        requiredPlan="PRO"
      />
    </div>
  )
}
