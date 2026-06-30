# STREETWEAR — Urban Clothing Store

A modern streetwear e-commerce store built with Next.js, Supabase, and Stripe.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4
- **Database & Auth:** Supabase (Postgres + Auth)
- **Payments:** Stripe Checkout + Webhooks
- **State:** Zustand (cart)
- **Hosting:** Vercel

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for webhooks) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (test mode) |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for dev |

### 3. Database

Run the SQL in `supabase/migrations/00001_initial_schema.sql` in your Supabase SQL Editor. This creates all tables, RLS policies, and seeds 6 example products.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Stripe webhook (for local dev)

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

## Admin Panel

Access `/admin` with an email containing "admin" (e.g., `admin@example.com`). Create this user first via `/auth/register`.

- `/admin` — Dashboard with stats
- `/admin/products` — List and manage products
- `/admin/orders` — View and update order status
- `/admin/products/new` — Create a new product

## Deploy to Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.example`
4. Deploy — it works out of the box

### After deploy

- Update `NEXT_PUBLIC_SITE_URL` to your Vercel domain
- Update the Stripe webhook endpoint URL in Stripe Dashboard to `https://your-domain.vercel.app/api/stripe-webhook`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API
│   ├── shop/               # Catalog with filters
│   ├── product/[slug]/     # Product detail
│   ├── cart/               # Shopping bag
│   ├── checkout/           # Stripe Checkout
│   ├── order-confirmation/ # Post-purchase confirmation
│   ├── auth/               # Login, Register, Reset password
│   ├── account/            # User profile & orders
│   ├── admin/              # Admin dashboard, products, orders
│   └── api/                # Stripe Checkout & Webhook endpoints
├── components/
│   ├── ui/                 # Button, Input
│   ├── layout/             # Navbar, Footer
│   ├── product/            # ProductCard, ProductGrid, Selectors
│   ├── cart/               # CartDrawer
│   └── auth/               # AuthForm
├── lib/
│   ├── supabase/           # Client, Server, Middleware
│   ├── cart-store.ts       # Zustand cart store
│   ├── stripe.ts           # Stripe instance
│   └── utils.ts            # cn() and formatPrice()
└── types/                  # TypeScript interfaces
```

## Features

- Dark theme with bold typography (streetwear aesthetic)
- Full product catalog with category filters and sorting
- Product detail with size/color selectors and stock tracking
- Cart (persisted to localStorage via Zustand)
- Stripe Checkout integration (test mode)
- Order confirmation page
- User authentication (email+password + Google OAuth)
- Password recovery
- User account with order history
- Admin panel: product CRUD, order management
- Row Level Security on Supabase
- Mobile-first responsive design
- 6 seed products with realistic data
