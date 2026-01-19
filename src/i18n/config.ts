/**
 * i18n Configuration - DevRetain CRM
 * 
 * Çok dilli destek için yapılandırma dosyası.
 * Desteklenen diller: Türkçe (tr), English (en)
 */

export const locales = ['tr', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'tr'

export const localeNames: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
}

export const localeFlags: Record<Locale, string> = {
  tr: '🇹🇷',
  en: '🇬🇧',
}

// Currency formatting
export const localeCurrencies: Record<Locale, string> = {
  tr: 'TRY',
  en: 'USD',
}

// Number formatting options
export const localeNumberFormats: Record<Locale, Intl.NumberFormatOptions> = {
  tr: {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
  en: {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
}

// Date formatting options
export const localeDateFormats: Record<Locale, Intl.DateTimeFormatOptions> = {
  tr: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
  en: {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  },
}
