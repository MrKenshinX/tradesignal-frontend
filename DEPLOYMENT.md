# TradeSignal Pro — Frontend Deployment Guide

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom cyberpunk theme)
- Framer Motion / CSS animations
- SWR untuk data fetching
- Zustand untuk auth state
- Axios dengan JWT interceptors

## Setup Lokal

```bash
# 1. Install dependencies
npm install

# 2. Copy env
cp .env.example .env.local

# 3. Edit .env.local — isi API URL backend
NEXT_PUBLIC_API_URL=http://localhost:3000

# 4. Run dev
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_API_URL=https://tradesignalpro.web.id   # prod backend URL
NEXT_PUBLIC_GOOGLE_CLIENT_ID=913916086668-nqd2bsn3618mcgmksvenls306nurub32.apps.googleusercontent.com
NEXT_PUBLIC_GA_ID=G-NNLKLQW8X4
```

## Build untuk Hostinger

```bash
npm run build
# Output ada di .next/standalone/
```

### Untuk Hostinger Node.js Business:
next.config.mjs sudah diset `output: 'standalone'` sehingga menghasilkan
folder `.next/standalone/` yang self-contained.

1. Upload `.next/standalone/` ke Hostinger
2. Upload `.next/static/` ke `public/.next/static/`
3. Set `PORT=3001` di Hostinger (agar tidak clash dengan backend port 3000)
4. Start: `node server.js`

Atau dengan PM2:
```bash
pm2 start server.js --name tradesignalpro-frontend
```

## Halaman yang Sudah Ada

| Path | Deskripsi |
|------|-----------|
| `/` | Landing page — hero, stats, fitur, pricing, testimonial |
| `/dashboard` | Dashboard sinyal + market overview |
| `/signals` | Sinyal dengan filter & sort lengkap |
| `/screener` | Screener 150+ instrumen |
| `/portfolio` | Portfolio tracker |
| `/auth/login` | Login dengan JWT |
| `/auth/register` | Register + redirect ke upgrade plan |

## API Integration

Semua API call di `src/lib/api.ts`. Field names sudah match persis dengan backend:

- `GET /api/signals` → response `{ success, data: Signal[] }` → field: `signal_type`, `category`, `price_entry`, `price_target`, `price_stop_loss`, `confidence`, `score`
- `GET /api/market/:category` → response `{ success, data: MarketData[] }` → field: `symbol`, `price`, `change_pct`
- `POST /api/auth/login` → request: `{ email, password }` → response: `{ success, token, user }`
- `POST /api/auth/register` → request: `{ name, email, password }` → response: `{ success, token, user }`

## CORS

Backend sudah dikonfigurasi `cors({ origin: '*' })` jadi tidak perlu config tambahan.
Untuk production, ganti ke domain spesifik di backend.

## Referral Ajaib

Link referral sudah diintegrasikan di:
1. `SignalCard.tsx` — muncul di setiap sinyal IDN
2. `Footer.tsx` — banner di footer
3. Kode: `pand2573058458`

## Fitur yang Perlu Dikembangkan Selanjutnya

- [ ] Halaman `/edukasi` (content sudah ada di backend HTML files)
- [ ] Halaman `/blog` (9 artikel sudah ada)
- [ ] Push notifications (service worker sudah ada di backend)
- [ ] Google OAuth (Client ID sudah di .env.example)
- [ ] Payment flow (`/upgrade` page → Midtrans)
- [ ] Admin dashboard

## Catatan Penting

- **TIDAK ADA data dummy** — semua dari `/api/*`
- Kalau API belum return data → tampil skeleton loader atau `—`
- Signal engine cron setiap 5 menit sudah berjalan di backend
- Backend Express tetap di port 3000, frontend Next.js di port 3001+
