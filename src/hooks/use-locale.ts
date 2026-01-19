"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { type Locale, defaultLocale, locales } from "@/i18n/config"
import {
  formatCurrency,
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatFileSize,
} from "@/i18n/format"

const LOCALE_COOKIE_NAME = "NEXT_LOCALE"

export function useLocale() {
  const router = useRouter()
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const currentLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
      ?.split("=")[1] as Locale | undefined

    if (currentLocale && locales.includes(currentLocale)) {
      setLocaleState(currentLocale)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    localStorage.setItem("locale_selected", "true")
    setLocaleState(newLocale)
    router.refresh()
  }, [router])

  // Formatting functions bound to current locale
  const format = {
    currency: (value: number, options?: Intl.NumberFormatOptions) =>
      formatCurrency(value, locale, options),
    number: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, locale, options),
    compact: (value: number) =>
      formatCompactNumber(value, locale),
    percentage: (value: number, options?: Intl.NumberFormatOptions) =>
      formatPercentage(value, locale, options),
    date: (date: Date | string, options?: Intl.DateTimeFormatOptions) =>
      formatDate(date, locale, options),
    dateTime: (date: Date | string, options?: Intl.DateTimeFormatOptions) =>
      formatDateTime(date, locale, options),
    relativeTime: (date: Date | string) =>
      formatRelativeTime(date, locale),
    fileSize: (bytes: number) =>
      formatFileSize(bytes, locale),
  }

  return {
    locale,
    setLocale,
    mounted,
    format,
    isEnglish: locale === "en",
    isTurkish: locale === "tr",
  }
}
