"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { locales, localeNames, type Locale, defaultLocale } from "@/i18n/config"

const LOCALE_COOKIE_NAME = "NEXT_LOCALE"
const LOCALE_SELECTED_KEY = "locale_selected"

interface LanguageSelectorProps {
  showOnFirstVisit?: boolean
  trigger?: React.ReactNode
}

export function LanguageSelector({ showOnFirstVisit = true, trigger }: LanguageSelectorProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedLocale, setSelectedLocale] = useState<Locale>(defaultLocale)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSelected, setHasSelected] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check if user has already selected a language
    const selected = localStorage.getItem(LOCALE_SELECTED_KEY)
    setHasSelected(!!selected)
    
    const currentLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
      ?.split("=")[1] as Locale | undefined

    if (currentLocale && locales.includes(currentLocale)) {
      setSelectedLocale(currentLocale)
    }

    // Show modal only on first visit (when no locale_selected in localStorage)
    // User can also manually trigger it later from settings
    if (showOnFirstVisit && !selected) {
      // Small delay to ensure proper mounting
      const timer = setTimeout(() => {
        setOpen(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [showOnFirstVisit])

  const handleSelectLocale = (locale: Locale) => {
    setSelectedLocale(locale)
  }

  const handleConfirm = async () => {
    setIsLoading(true)

    // Set cookie
    document.cookie = `${LOCALE_COOKIE_NAME}=${selectedLocale}; path=/; max-age=31536000; SameSite=Lax`
    
    // Mark as selected
    localStorage.setItem(LOCALE_SELECTED_KEY, "true")
    
    // Close modal
    setOpen(false)
    
    // Refresh the page to apply new locale
    router.refresh()
    
    setIsLoading(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if user has selected before
    if (!newOpen && !hasSelected && showOnFirstVisit) {
      return // Prevent closing on first visit
    }
    setOpen(newOpen)
  }

  // Don't render until mounted (to avoid hydration issues)
  if (!mounted) return null

  return (
    <>
      {trigger && (
        <div onClick={() => setOpen(true)}>
          {trigger}
        </div>
      )}
      
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" hideCloseButton={!hasSelected}>
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              Dil Seçin / Select Language
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Tercih ettiğiniz dili seçin / Choose your preferred language
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-6">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleSelectLocale(locale)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
                  "hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20",
                  selectedLocale === locale
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                    : "border-slate-200 dark:border-slate-700"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-lg flex items-center justify-center text-lg font-bold",
                    selectedLocale === locale
                      ? "bg-violet-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  )}>
                    {locale.toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {localeNames[locale]}
                    </p>
                    <p className="text-sm text-slate-500">
                      {locale === "tr" ? "Türkiye" : "United States / United Kingdom"}
                    </p>
                  </div>
                </div>
                {selectedLocale === locale && (
                  <div className="h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full h-12 text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {selectedLocale === "tr" ? "Yükleniyor..." : "Loading..."}
              </span>
            ) : (
              selectedLocale === "tr" ? "Devam Et" : "Continue"
            )}
          </Button>

          <p className="text-xs text-center text-slate-400 mt-2">
            {selectedLocale === "tr" 
              ? "Dil tercihini daha sonra ayarlardan değiştirebilirsin." 
              : "You can change your language preference later in settings."}
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Compact language switcher for header/sidebar
export function LanguageSwitcher() {
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const locale = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
      ?.split("=")[1] as Locale | undefined

    if (locale && locales.includes(locale)) {
      setCurrentLocale(locale)
    }
  }, [])

  const toggleLocale = () => {
    const newLocale = currentLocale === "tr" ? "en" : "tr"
    document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    localStorage.setItem(LOCALE_SELECTED_KEY, "true")
    setCurrentLocale(newLocale)
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">{currentLocale.toUpperCase()}</span>
    </Button>
  )
}
