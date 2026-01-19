# DevRetain CRM - Sponsorluk Yönetim Sistemi

Youtuber'lar, Kulüpler ve İşletmeler için profesyonel sponsorluk yönetim CRM'i.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Database:** PostgreSQL
- **ORM:** Prisma

## 📦 Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL 14+
- pnpm (önerilen) veya npm

### Adımlar

1. **Bağımlılıkları yükle:**

```bash
npm install
```

2. **Environment dosyasını oluştur:**

```bash
cp .env.example .env
```

3. **`.env` dosyasını düzenle** ve PostgreSQL bağlantı bilgilerini gir.

4. **Prisma client oluştur:**

```bash
npm run db:generate
```

5. **Veritabanı migration'larını çalıştır:**

```bash
npm run db:migrate
```

6. **Geliştirme sunucusunu başlat:**

```bash
npm run dev
```

## 📊 Veritabanı Şeması

### Ana Tablolar

| Tablo | Açıklama |
|-------|----------|
| `users` | Sistem kullanıcıları |
| `organizations` | Youtuber, Kulüp veya İşletme organizasyonları |
| `organization_members` | Kullanıcı-Organizasyon ilişkisi (roller ile) |
| `sponsors` | Sponsor şirketleri |
| `sponsor_contacts` | Sponsor iletişim kişileri |
| `campaigns` | Sponsorluk kampanyaları |
| `campaign_sponsors` | Kampanya-Sponsor many-to-many ilişkisi |
| `campaign_assignments` | Kampanya takım atamaları |
| `campaign_milestones` | Kampanya kilometre taşları |
| `transactions` | Gelir ve gider işlemleri |
| `metrics` | Performans metrikleri (tıklama, izlenme, dönüşüm) |
| `rfm_scores` | Sponsor RFM analiz skorları |
| `activity_logs` | Sistem aktivite logları |
| `notifications` | Kullanıcı bildirimleri |

### İlişki Diyagramı

```
Organization (1) ──────< (N) OrganizationMember >────── (1) User
      │
      ├──< Campaign >──< CampaignSponsor >──< Sponsor
      │         │                                │
      │         ├──< CampaignAssignment >── User │
      │         │                                │
      │         ├──< CampaignMilestone           │
      │         │                                │
      │         ├──< Metric                      │
      │         │                                │
      │         └──< Transaction >───────────────┘
      │                                          │
      └──< Sponsor ──< SponsorContact            │
              │                                  │
              └──< RFMScore ─────────────────────┘
```

### RFM Segmentasyonu

Sponsorlar için otomatik RFM (Recency, Frequency, Monetary) analizi:

| Segment | Açıklama |
|---------|----------|
| Champions | En değerli sponsorlar |
| Loyal Customers | Sadık, düzenli sponsorlar |
| Potential Loyalist | Potansiyel sadık sponsorlar |
| New Customers | Yeni kazanılan sponsorlar |
| Promising | Umut vaat eden sponsorlar |
| Need Attention | İlgi gerektiren sponsorlar |
| About to Sleep | Uykuya dalmak üzere olanlar |
| At Risk | Risk altındaki sponsorlar |
| Can't Lose Them | Kaybetmemek gereken sponsorlar |
| Hibernating | Uzun süredir inaktif |
| Lost | Kaybedilmiş sponsorlar |

## 🛠 Prisma Komutları

```bash
# Prisma Client oluştur
npm run db:generate

# Şemayı veritabanına push et (dev)
npm run db:push

# Migration oluştur ve çalıştır
npm run db:migrate

# Production'da migration deploy et
npm run db:migrate:prod

# Prisma Studio'yu aç
npm run db:studio

# Veritabanını sıfırla
npm run db:reset
```

## 📁 Proje Yapısı

```
devretain-crm/
├── prisma/
│   ├── schema.prisma    # Veritabanı şeması
│   └── seed.ts          # Seed data
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # React bileşenleri
│   │   └── ui/          # Shadcn/UI bileşenleri
│   ├── lib/             # Utility fonksiyonları
│   │   ├── prisma.ts    # Prisma client
│   │   └── utils.ts     # Helper fonksiyonları
│   └── types/           # TypeScript tipleri
├── public/              # Static dosyalar
└── ...
```

## 📄 Lisans

MIT License
