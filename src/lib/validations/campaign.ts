import { z } from "zod"

export const campaignFormSchema = z.object({
  name: z
    .string()
    .min(3, "Kampanya adı en az 3 karakter olmalıdır")
    .max(100, "Kampanya adı en fazla 100 karakter olabilir"),
  
  description: z
    .string()
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .optional(),
  
  type: z.enum([
    "BRAND_AWARENESS",
    "PRODUCT_LAUNCH",
    "EVENT_SPONSORSHIP",
    "CONTENT_SPONSORSHIP",
    "AFFILIATE",
    "INFLUENCER",
  ], {
    required_error: "Kampanya türü seçiniz",
  }),
  
  sponsorIds: z
    .array(z.string())
    .min(1, "En az bir sponsor seçmelisiniz"),
  
  budgetTotal: z
    .number({
      required_error: "Bütçe giriniz",
      invalid_type_error: "Geçerli bir sayı giriniz",
    })
    .min(1000, "Minimum bütçe ₺1.000 olmalıdır")
    .max(100000000, "Maksimum bütçe ₺100.000.000 olabilir"),
  
  targetROI: z
    .number({
      required_error: "Hedef ROI giriniz",
      invalid_type_error: "Geçerli bir sayı giriniz",
    })
    .min(0, "ROI negatif olamaz")
    .max(1000, "ROI en fazla %1000 olabilir")
    .optional(),
  
  targetImpressions: z
    .number()
    .min(0, "Gösterim hedefi negatif olamaz")
    .optional(),
  
  targetClicks: z
    .number()
    .min(0, "Tıklama hedefi negatif olamaz")
    .optional(),
  
  targetConversions: z
    .number()
    .min(0, "Dönüşüm hedefi negatif olamaz")
    .optional(),
  
  startDate: z
    .date({
      required_error: "Başlangıç tarihi seçiniz",
    }),
  
  endDate: z
    .date({
      required_error: "Bitiş tarihi seçiniz",
    }),
  
  currency: z
    .string()
    .default("TRY"),
}).refine((data) => data.endDate > data.startDate, {
  message: "Bitiş tarihi başlangıç tarihinden sonra olmalıdır",
  path: ["endDate"],
})

export type CampaignFormValues = z.infer<typeof campaignFormSchema>

export const CAMPAIGN_TYPES = [
  { value: "BRAND_AWARENESS", label: "Marka Bilinirliği" },
  { value: "PRODUCT_LAUNCH", label: "Ürün Lansmanı" },
  { value: "EVENT_SPONSORSHIP", label: "Etkinlik Sponsorluğu" },
  { value: "CONTENT_SPONSORSHIP", label: "İçerik Sponsorluğu" },
  { value: "AFFILIATE", label: "Affiliate / Ortaklık" },
  { value: "INFLUENCER", label: "Influencer Marketing" },
] as const
