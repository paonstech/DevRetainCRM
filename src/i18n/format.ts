/**
 * Localized Formatting Utilities
 * 
 * Sayı, para birimi ve tarih formatlaması için yardımcı fonksiyonlar.
 */

import { type Locale, localeCurrencies } from "./config"

/**
 * Format currency based on locale
 */
export function formatCurrency(
  value: number,
  locale: Locale = "tr",
  options?: Intl.NumberFormatOptions
): string {
  const currency = localeCurrencies[locale]
  
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(value)
}

/**
 * Format number based on locale
 */
export function formatNumber(
  value: number,
  locale: Locale = "tr",
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value)
}

/**
 * Format compact number (e.g., 1.2M, 500K)
 */
export function formatCompactNumber(
  value: number,
  locale: Locale = "tr"
): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toString()
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  locale: Locale = "tr",
  options?: Intl.NumberFormatOptions
): string {
  const formatted = new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  }).format(value)
  
  return locale === "tr" ? `%${formatted}` : `${formatted}%`
}

/**
 * Format date based on locale
 */
export function formatDate(
  date: Date | string,
  locale: Locale = "tr",
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date
  
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
    day: "2-digit",
    month: locale === "tr" ? "2-digit" : "short",
    year: "numeric",
    ...options,
  }).format(d)
}

/**
 * Format date with time
 */
export function formatDateTime(
  date: Date | string,
  locale: Locale = "tr",
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date
  
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
    day: "2-digit",
    month: locale === "tr" ? "2-digit" : "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(d)
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(
  date: Date | string,
  locale: Locale = "tr"
): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  const rtf = new Intl.RelativeTimeFormat(locale === "tr" ? "tr" : "en", {
    numeric: "auto",
  })

  if (diffDays > 0) {
    return rtf.format(-diffDays, "day")
  }
  if (diffHours > 0) {
    return rtf.format(-diffHours, "hour")
  }
  if (diffMinutes > 0) {
    return rtf.format(-diffMinutes, "minute")
  }
  
  return locale === "tr" ? "Az önce" : "Just now"
}

/**
 * Format file size
 */
export function formatFileSize(
  bytes: number,
  locale: Locale = "tr"
): string {
  if (bytes >= 1000000) {
    return `${(bytes / 1000000).toFixed(1)} MB`
  }
  if (bytes >= 1000) {
    return `${(bytes / 1000).toFixed(0)} KB`
  }
  return `${bytes} B`
}
