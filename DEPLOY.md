# TradeSignal Pro — Deploy Guide (Hostinger)

## Stack
- Frontend: Next.js 14 (standalone output) → port 4000
- Backend: Express.js → port 3000
- Database: Supabase PostgreSQL

## Setup di Hostinger Node.js Business Plan

### 1. Pasang Node.js 18+
Pastikan Node.js 18 LTS di Hostinger panel.

### 2. Clone / Upload project
```
/home/username/tradesignalpro-frontend/   ← Next.js ini
/home/username/tradesignalpro-api/        ← Backend Express
```

### 3. Install & Build Frontend
```bash
cd tradesignalpro-frontend
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL ke domain kamu

npm install
npm run build
```

### 4. Start Frontend (port 4000)
```bash
PORT=4000 node .next/standalone/server.js
```

### 5. Nginx Reverse Proxy
```nginx
server {
    server_name tradesignalpro.web.id;
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Frontend Next.js
    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 6. PM2 untuk auto-restart
```bash
# Frontend
pm2 start "PORT=4000 node .next/standalone/server.js" --name "tsp-frontend"

# Backend (dari folder api)
pm2 start server.js --name "tsp-api"

pm2 save
pm2 startup
```

## Catatan Penting
- Backend tetap di port 3000, frontend di port 4000
- NEXT_PUBLIC_API_URL harus diset ke domain production
- Static files: copy `public/` dan `.next/static/` ke standalone output
- Lihat: https://nextjs.org/docs/app/api-reference/config/next-config-js/output#automatically-copying-traced-files
