import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "DevRetain CRM - Sponsorluk Yönetim Sistemi",
  description: "Youtuber'lar, Kulüpler ve İşletmeler için profesyonel sponsorluk yönetim CRM'i. ROI analizi, RFM segmentasyonu ve kampanya takibi.",
  keywords: ["CRM", "Sponsorluk", "YouTube", "Influencer", "ROI", "Analitik"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
