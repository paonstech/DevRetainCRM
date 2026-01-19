import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: string = "TRY",
  locale: string = "tr-TR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  locale: string = "tr-TR"
): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, options).format(d)
}

export function formatNumber(
  number: number,
  locale: string = "tr-TR"
): string {
  return new Intl.NumberFormat(locale).format(number)
}

export function calculateROI(
  revenue: number,
  cost: number
): number {
  if (cost === 0) return 0
  return ((revenue - cost) / cost) * 100
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[üÜ]/g, "u")
    .replace(/[öÖ]/g, "o")
    .replace(/[çÇ]/g, "c")
    .replace(/[şŞ]/g, "s")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export function generateRFMSegment(
  recency: number,
  frequency: number,
  monetary: number
): string {
  const score = `${recency}${frequency}${monetary}`
  
  // RFM Segment mapping
  const segmentMap: Record<string, string> = {
    "555": "CHAMPIONS",
    "554": "CHAMPIONS",
    "544": "CHAMPIONS",
    "545": "CHAMPIONS",
    "454": "CHAMPIONS",
    "455": "CHAMPIONS",
    "445": "CHAMPIONS",
    "543": "LOYAL_CUSTOMERS",
    "444": "LOYAL_CUSTOMERS",
    "435": "LOYAL_CUSTOMERS",
    "355": "LOYAL_CUSTOMERS",
    "354": "LOYAL_CUSTOMERS",
    "345": "LOYAL_CUSTOMERS",
    "344": "LOYAL_CUSTOMERS",
    "335": "LOYAL_CUSTOMERS",
    "553": "POTENTIAL_LOYALIST",
    "551": "POTENTIAL_LOYALIST",
    "552": "POTENTIAL_LOYALIST",
    "541": "POTENTIAL_LOYALIST",
    "542": "POTENTIAL_LOYALIST",
    "533": "POTENTIAL_LOYALIST",
    "532": "POTENTIAL_LOYALIST",
    "531": "POTENTIAL_LOYALIST",
    "452": "POTENTIAL_LOYALIST",
    "451": "POTENTIAL_LOYALIST",
    "442": "POTENTIAL_LOYALIST",
    "441": "POTENTIAL_LOYALIST",
    "431": "POTENTIAL_LOYALIST",
    "453": "POTENTIAL_LOYALIST",
    "433": "POTENTIAL_LOYALIST",
    "432": "POTENTIAL_LOYALIST",
    "423": "POTENTIAL_LOYALIST",
    "353": "POTENTIAL_LOYALIST",
    "352": "POTENTIAL_LOYALIST",
    "351": "POTENTIAL_LOYALIST",
    "342": "POTENTIAL_LOYALIST",
    "341": "POTENTIAL_LOYALIST",
    "333": "POTENTIAL_LOYALIST",
    "323": "POTENTIAL_LOYALIST",
    "512": "NEW_CUSTOMERS",
    "511": "NEW_CUSTOMERS",
    "422": "NEW_CUSTOMERS",
    "421": "NEW_CUSTOMERS",
    "412": "NEW_CUSTOMERS",
    "411": "NEW_CUSTOMERS",
    "311": "NEW_CUSTOMERS",
    "525": "PROMISING",
    "524": "PROMISING",
    "523": "PROMISING",
    "522": "PROMISING",
    "521": "PROMISING",
    "515": "PROMISING",
    "514": "PROMISING",
    "513": "PROMISING",
    "425": "PROMISING",
    "424": "PROMISING",
    "413": "PROMISING",
    "414": "PROMISING",
    "415": "PROMISING",
    "315": "PROMISING",
    "314": "PROMISING",
    "313": "PROMISING",
    "334": "NEED_ATTENTION",
    "343": "NEED_ATTENTION",
    "443": "NEED_ATTENTION",
    "434": "NEED_ATTENTION",
    "244": "NEED_ATTENTION",
    "243": "NEED_ATTENTION",
    "234": "NEED_ATTENTION",
    "233": "NEED_ATTENTION",
    "232": "NEED_ATTENTION",
    "223": "NEED_ATTENTION",
    "222": "NEED_ATTENTION",
    "132": "NEED_ATTENTION",
    "231": "ABOUT_TO_SLEEP",
    "241": "ABOUT_TO_SLEEP",
    "251": "ABOUT_TO_SLEEP",
    "252": "ABOUT_TO_SLEEP",
    "253": "ABOUT_TO_SLEEP",
    "254": "ABOUT_TO_SLEEP",
    "255": "ABOUT_TO_SLEEP",
    "242": "ABOUT_TO_SLEEP",
    "245": "ABOUT_TO_SLEEP",
    "235": "ABOUT_TO_SLEEP",
    "225": "ABOUT_TO_SLEEP",
    "224": "ABOUT_TO_SLEEP",
    "153": "ABOUT_TO_SLEEP",
    "152": "ABOUT_TO_SLEEP",
    "145": "ABOUT_TO_SLEEP",
    "143": "ABOUT_TO_SLEEP",
    "142": "ABOUT_TO_SLEEP",
    "135": "ABOUT_TO_SLEEP",
    "134": "ABOUT_TO_SLEEP",
    "133": "ABOUT_TO_SLEEP",
    "125": "ABOUT_TO_SLEEP",
    "124": "ABOUT_TO_SLEEP",
    "155": "AT_RISK",
    "154": "AT_RISK",
    "144": "AT_RISK",
    "214": "AT_RISK",
    "215": "AT_RISK",
    "115": "AT_RISK",
    "114": "AT_RISK",
    "113": "AT_RISK",
    "131": "CANT_LOSE_THEM",
    "141": "CANT_LOSE_THEM",
    "151": "CANT_LOSE_THEM",
    "211": "CANT_LOSE_THEM",
    "212": "CANT_LOSE_THEM",
    "213": "CANT_LOSE_THEM",
    "221": "CANT_LOSE_THEM",
    "312": "CANT_LOSE_THEM",
    "321": "CANT_LOSE_THEM",
    "322": "CANT_LOSE_THEM",
    "331": "CANT_LOSE_THEM",
    "332": "CANT_LOSE_THEM",
    "123": "HIBERNATING",
    "122": "HIBERNATING",
    "121": "HIBERNATING",
    "112": "HIBERNATING",
    "111": "LOST",
  }
  
  return segmentMap[score] || "NEED_ATTENTION"
}
