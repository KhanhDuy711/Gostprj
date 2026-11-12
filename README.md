# Visual Bar Store

Premium digital marketplace for downloadable "Visual Bar" video packs — dark,
futuristic UI, hover video previews, secure checkout, and protected downloads.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Prisma ORM + PostgreSQL
- Auth.js (NextAuth v5, credentials provider)
- Zod validation
- Mock payment + mock storage providers (swap for Stripe / S3-R2 later, see `lib/payment.ts` and `lib/storage.ts`)

## Getting started

```bash
npm install

# 1. Start a local Postgres (or point DATABASE_URL at your own)
docker compose up -d

# 2. Copy env vars
cp .env.example .env

# 3. Generate the Prisma client, run migrations
npm run db:generate
npm run db:migrate

# 4. Generate demo video/image assets (requires ffmpeg on PATH)
npm run demo:assets

# 5. Seed the database with categories, 2 demo packs, and demo users
npm run db:seed

# 6. Run the app
npm run dev
```

Open http://localhost:3000.

**Demo accounts** (created by the seed script):
- Admin: `admin@visualbar.store` / `Admin123!` → `/admin`
- Customer: `customer@visualbar.store` / `Customer123!`

If `DATABASE_URL` is not set, product pages fall back to static demo data
(`lib/demo-data.ts`) so the storefront UI still renders — but auth, cart
checkout, My Library and the admin dashboard all need a real database.

## How it's organized

- `app/` — routes: homepage, `/products`, `/products/[slug]`, `/cart`,
  `/checkout`, `/library`, `/admin/*`, plus API routes under `app/api`.
- `components/ui` — small hand-built design-system primitives (Button, Card,
  Dialog, Badge...) on Radix UI, styled to the dark/purple/neon spec.
- `components/products` — product card (hover-to-preview), grid, filters,
  video gallery modal, add-to-cart.
- `lib/` — Prisma client singleton, storage + payment + signed-URL
  abstractions, Zod schemas, Auth.js config, cart context.
- `prisma/schema.prisma` — full data model (users, categories, packs,
  videos, orders, order items, payments, download logs).
- `scripts/generate-demo-assets.sh` — builds real, playable demo video
  clips + thumbnails + covers with ffmpeg, so the hover-preview and video
  gallery work out of the box without any licensed footage.

## Security notes baked in

- Checkout re-prices from the database — the client cart is never trusted
  for amounts.
- An order is marked `PAID` only inside the signed webhook handler
  (`app/api/webhooks/mock-payment/route.ts`), never from a client redirect.
- Original video files are never served from a public route. Downloads go
  through `lib/signed-url.ts`-issued, time-limited, HMAC-signed links, and
  the ZIP route re-checks the database for a `PAID` order before streaming
  anything.
- `/admin/*` is protected by `middleware.ts`, enforced before any admin data
  loads.

## Known gaps / next steps

- `PAYMENT_PROVIDER=stripe` and `STORAGE_PROVIDER=s3` are stubbed with
  `throw`s where the real SDK calls go — see `lib/payment.ts` / `lib/storage.ts`.
- Admin video upload currently reuses the same file for "preview" and
  "original" (no real watermark burn-in / transcode pipeline yet).
- No automated tests yet (Phase 6 in the project brief).
