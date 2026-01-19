"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MultiSelect, type Option } from "@/components/ui/multi-select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  campaignFormSchema,
  type CampaignFormValues,
  CAMPAIGN_TYPES,
} from "@/lib/validations/campaign"
import { mockSponsors } from "@/lib/mock-data"

interface CampaignFormProps {
  onSuccess?: (data: CampaignFormValues) => void
  onCancel?: () => void
}

export function CampaignForm({ onSuccess, onCancel }: CampaignFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Sponsor seçeneklerini hazırla
  const sponsorOptions: Option[] = mockSponsors
    .filter((s) => s.isActive)
    .map((sponsor) => ({
      value: sponsor.id,
      label: sponsor.companyName,
      description: sponsor.industry || undefined,
    }))

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: undefined,
      sponsorIds: [],
      budgetTotal: undefined,
      targetROI: undefined,
      targetImpressions: undefined,
      targetClicks: undefined,
      targetConversions: undefined,
      startDate: undefined,
      endDate: undefined,
      currency: "TRY",
    },
  })

  const selectedSponsors = watch("sponsorIds") || []
  const startDate = watch("startDate")
  const endDate = watch("endDate")
  const campaignType = watch("type")

  const onSubmit = async (data: CampaignFormValues) => {
    setIsSubmitting(true)

    try {
      // API'ye gönder (demo modda mock)
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Kampanya Oluşturuldu! 🎉",
          description: `"${data.name}" kampanyası başarıyla kaydedildi.`,
          variant: "success",
        })
        reset()
        onSuccess?.(data)
      } else {
        throw new Error(result.error || "Bir hata oluştu")
      }
    } catch (error) {
      toast({
        title: "Hata!",
        description: error instanceof Error ? error.message : "Kampanya kaydedilemedi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Yeni Kampanya Oluştur</CardTitle>
            <CardDescription>
              Sponsorluk kampanyanızın detaylarını girin
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Kampanya Adı */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Kampanya Adı <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Örn: Yaz Teknoloji Festivali 2024"
              {...register("name")}
              className={cn(errors.name && "border-red-500")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Açıklama */}
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              placeholder="Kampanya hakkında kısa bir açıklama..."
              {...register("description")}
              className={cn(errors.description && "border-red-500")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Kampanya Türü */}
          <div className="space-y-2">
            <Label>
              Kampanya Türü <span className="text-red-500">*</span>
            </Label>
            <Select
              value={campaignType}
              onValueChange={(value) => setValue("type", value as CampaignFormValues["type"])}
            >
              <SelectTrigger className={cn(errors.type && "border-red-500")}>
                <SelectValue placeholder="Kampanya türü seçin" />
              </SelectTrigger>
              <SelectContent>
                {CAMPAIGN_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Sponsor Seçimi */}
          <div className="space-y-2">
            <Label>
              Sponsorlar <span className="text-red-500">*</span>
            </Label>
            <MultiSelect
              options={sponsorOptions}
              selected={selectedSponsors}
              onChange={(values) => setValue("sponsorIds", values)}
              placeholder="Sponsor seçin..."
              searchPlaceholder="Sponsor ara..."
              emptyMessage="Sponsor bulunamadı."
              className={cn(errors.sponsorIds && "border-red-500")}
            />
            {errors.sponsorIds && (
              <p className="text-sm text-red-500">{errors.sponsorIds.message}</p>
            )}
          </div>

          {/* Bütçe ve ROI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetTotal">
                Toplam Bütçe (₺) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="budgetTotal"
                type="number"
                placeholder="100000"
                {...register("budgetTotal", { valueAsNumber: true })}
                className={cn(errors.budgetTotal && "border-red-500")}
              />
              {errors.budgetTotal && (
                <p className="text-sm text-red-500">{errors.budgetTotal.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetROI">Hedef ROI (%)</Label>
              <Input
                id="targetROI"
                type="number"
                placeholder="150"
                {...register("targetROI", { valueAsNumber: true })}
                className={cn(errors.targetROI && "border-red-500")}
              />
              {errors.targetROI && (
                <p className="text-sm text-red-500">{errors.targetROI.message}</p>
              )}
            </div>
          </div>

          {/* Tarihler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Başlangıç Tarihi <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                      errors.startDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "d MMMM yyyy", { locale: tr })
                    ) : (
                      <span>Tarih seçin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setValue("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Bitiş Tarihi <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                      errors.endDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "d MMMM yyyy", { locale: tr })
                    ) : (
                      <span>Tarih seçin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setValue("endDate", date)}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Hedefler (Opsiyonel) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Performans Hedefleri</h3>
              <span className="text-xs text-muted-foreground">(Opsiyonel)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetImpressions">Hedef Gösterim</Label>
                <Input
                  id="targetImpressions"
                  type="number"
                  placeholder="1000000"
                  {...register("targetImpressions", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetClicks">Hedef Tıklama</Label>
                <Input
                  id="targetClicks"
                  type="number"
                  placeholder="50000"
                  {...register("targetClicks", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetConversions">Hedef Dönüşüm</Label>
                <Input
                  id="targetConversions"
                  type="number"
                  placeholder="2000"
                  {...register("targetConversions", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                İptal
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                "Kampanya Oluştur"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
