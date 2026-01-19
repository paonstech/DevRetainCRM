import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { cookies } from "next/headers"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { IntlProvider } from "@/i18n/provider"
import { defaultLocale, locales, type Locale } from "@/i18n/config"
import { LanguageSelector } from "@/components/language-selector"

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "DevRetain CRM - Sponsorluk Yönetim Sistemi",
  description: "Youtuber'lar, Kulüpler ve İşletmeler için profesyonel sponsorluk yönetim CRM'i. ROI analizi, RFM segmentasyonu ve kampanya takibi.",
  keywords: ["CRM", "Sponsorluk", "YouTube", "Influencer", "ROI", "Analitik"],
}

async function getMessages(locale: Locale) {
  try {
    return (await import(`../../messages/${locale}.json`)).default
  } catch {
    return (await import(`../../messages/${defaultLocale}.json`)).default
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get locale from cookie
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value
  const locale: Locale = localeCookie && locales.includes(localeCookie as Locale) 
    ? localeCookie as Locale 
    : defaultLocale

  // Get messages for the locale
  const messages = await getMessages(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <IntlProvider locale={locale} messages={messages}>
          {children}
          <LanguageSelector showOnFirstVisit={true} />
          <Toaster />
        </IntlProvider>
      </body>
    </html>
  )
}
