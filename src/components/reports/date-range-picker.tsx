"use client"

import * as React from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateRangePickerProps {
  startDate: Date | undefined
  endDate: Date | undefined
  onStartDateChange: (date: Date | undefined) => void
  onEndDateChange: (date: Date | undefined) => void
}

const PRESET_RANGES = [
  { label: "Son 7 Gün", days: 7 },
  { label: "Son 30 Gün", days: 30 },
  { label: "Son 3 Ay", days: 90 },
  { label: "Son 6 Ay", days: 180 },
  { label: "Son 1 Yıl", days: 365 },
]

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) {
  const handlePresetChange = (days: string) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - parseInt(days))
    onStartDateChange(start)
    onEndDateChange(end)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Preset Selector */}
      <Select onValueChange={handlePresetChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Hızlı Seçim" />
        </SelectTrigger>
        <SelectContent>
          {PRESET_RANGES.map((preset) => (
            <SelectItem key={preset.days} value={preset.days.toString()}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        {/* Start Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[180px] justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "d MMM yyyy", { locale: tr })
              ) : (
                <span>Başlangıç</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground">—</span>

        {/* End Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[180px] justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? (
                format(endDate, "d MMM yyyy", { locale: tr })
              ) : (
                <span>Bitiş</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              disabled={(date) => startDate ? date < startDate : false}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
