"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DateRange {
  label: string
  value: string
  days: number
}

interface SponsorType {
  label: string
  value: string
}

const dateRanges: DateRange[] = [
  { label: "Son 7 Gün", value: "7d", days: 7 },
  { label: "Son 30 Gün", value: "30d", days: 30 },
  { label: "Son 90 Gün", value: "90d", days: 90 },
  { label: "Bu Yıl", value: "ytd", days: 365 },
  { label: "Tüm Zamanlar", value: "all", days: 0 },
]

const sponsorTypes: SponsorType[] = [
  { label: "Tümü", value: "all" },
  { label: "Diamond", value: "DIAMOND" },
  { label: "Platinum", value: "PLATINUM" },
  { label: "Gold", value: "GOLD" },
  { label: "Silver", value: "SILVER" },
  { label: "Bronze", value: "BRONZE" },
]

interface DashboardFiltersProps {
  onDateRangeChange?: (range: string) => void
  onSponsorTypeChange?: (type: string) => void
  className?: string
}

export function DashboardFilters({
  onDateRangeChange,
  onSponsorTypeChange,
  className,
}: DashboardFiltersProps) {
  const [selectedDateRange, setSelectedDateRange] = useState<string>("30d")
  const [selectedSponsorType, setSelectedSponsorType] = useState<string>("all")
  const [dateOpen, setDateOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)

  const handleDateRangeChange = (value: string) => {
    setSelectedDateRange(value)
    setDateOpen(false)
    onDateRangeChange?.(value)
  }

  const handleSponsorTypeChange = (value: string) => {
    setSelectedSponsorType(value)
    setTypeOpen(false)
    onSponsorTypeChange?.(value)
  }

  const clearFilters = () => {
    setSelectedDateRange("30d")
    setSelectedSponsorType("all")
    onDateRangeChange?.("30d")
    onSponsorTypeChange?.("all")
  }

  const hasActiveFilters = selectedDateRange !== "30d" || selectedSponsorType !== "all"

  const selectedDateLabel = dateRanges.find(r => r.value === selectedDateRange)?.label || "Tarih Seç"
  const selectedTypeLabel = sponsorTypes.find(t => t.value === selectedSponsorType)?.label || "Tür Seç"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Date Range Filter */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 gap-2 border-slate-200 dark:border-slate-700",
              selectedDateRange !== "30d" && "border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/20"
            )}
          >
            <Calendar className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">{selectedDateLabel}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-1">
          {dateRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleDateRangeChange(range.value)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                selectedDateRange === range.value
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {range.label}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Sponsor Type Filter */}
      <Popover open={typeOpen} onOpenChange={setTypeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 gap-2 border-slate-200 dark:border-slate-700",
              selectedSponsorType !== "all" && "border-violet-500/50 bg-violet-50/50 dark:bg-violet-900/20"
            )}
          >
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">{selectedTypeLabel}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-40 p-1">
          {sponsorTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleSponsorTypeChange(type.value)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                selectedSponsorType === type.value
                  ? "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {type.label}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9 px-2 text-slate-500 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
