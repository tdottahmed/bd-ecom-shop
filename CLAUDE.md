# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**True by Malaysia** is a full-stack e-commerce platform built with Laravel 12 + React 18 via Inertia.js. It features an admin dashboard (product/order/courier management) and a customer-facing storefront, with integrations for Bangladesh courier services (Steadfast, Pathao, RedX) and fraud detection.

## Commands

### Initial Setup
```bash
composer setup   # Installs deps, copies .env, generates key, runs migrations, builds assets
php artisan storage:link  # Required for file uploads to be publicly accessible
```

### Development
```bash
composer dev     # Runs all services concurrently: Laravel server, queue listener, Pail log watcher, Vite HMR
```

### Individual services
```bash
php artisan serve       # Laravel dev server at localhost:8000
npm run dev             # Vite with HMR
php artisan queue:listen --tries=1  # Process queued jobs
```

### Build & Test
```bash
npm run build    # TypeScript check + Vite production bundle
composer test    # Clears config cache, then runs PHPUnit
php artisan pint # Laravel PHP code formatter
```

### Database
```bash
php artisan migrate          # Run pending migrations
php artisan migrate --seed   # Migrate and seed
php artisan tinker           # Interactive REPL
```

## Architecture

### Stack
- **Backend**: Laravel 12 (PHP 8.2+), Eloquent ORM
- **Frontend**: React 18 + TypeScript, served via Inertia.js (no separate API layer)
- **Styling**: Tailwind CSS 3 with custom luxury color palette and fonts (Playfair Display, Inter)
- **State**: Zustand (`resources/js/Stores/useCartStore.ts`) for cart persistence to localStorage
- **Build**: Vite 7
- **Routing**: Ziggy for using Laravel named routes in TypeScript (`route('name')`)

### Inertia.js Pattern
Laravel controllers return `Inertia::render('PageName', $props)` instead of Blade views. React page components in `resources/js/Pages/` receive props directly as typed TypeScript interfaces. There is no REST API — data flows server→client through Inertia page props, and mutations go through standard form POSTs/`useForm` from `@inertiajs/react`.

### Route Structure
- `routes/web.php` — Public storefront (products, cart, checkout, search)
- `routes/admin.php` — Admin panel, all protected by auth middleware, prefixed `/admin`
- `routes/auth.php` — Login, password reset, email verification

### Frontend Page Organization
```
resources/js/
├── Pages/
│   ├── Admin/          # Dashboard, Products, Orders, Categories, etc.
│   ├── Customer/       # Home, Products, Product Show, Cart, Checkout
│   ├── Auth/           # Login, Register, Password flows
│   └── Profile/        # User profile
├── Components/
│   ├── Admin/          # Admin-specific components
│   ├── Customer/       # Header, Footer, ProductCard, CartSidebar
│   ├── Checkout/       # Checkout step components
│   ├── Ui/             # Shared base components (Button, Modal, Input, SelectInput, etc.)
│   └── Layouts/
├── Layouts/            # CustomerLayout, GuestLayout (wraps pages)
├── Stores/             # useCartStore (Zustand)
├── Hooks/              # useTheme, useDebounce
├── types/              # index.d.ts — all shared TypeScript interfaces
└── Utils/              # Helper functions
```

### TypeScript Path Alias
`@/*` maps to `resources/js/*` — use `import Foo from '@/Components/Ui/Foo'`.

### Key Models & Relationships
- `Product` → belongs to `Category`, `Brand`; has many `ProductVariation`, `OrderItem`
- `Order` → has many `OrderItem`; belongs to `DeliveryCharge`; has one `CourierOrderHistory`
- `ProductVariation` → belongs to `Product`, `ProductAttribute`

### File Uploads
Use `App\Utility\FileUpload` (or similar helper in `app/Utility/`). Images are stored in Laravel's storage and served via the storage symlink. The `intervention/image` package handles image processing.

### Courier Integrations
- Steadfast: via `steadfast-courier/steadfast-courier-laravel-package`, configured in `config/steadfast-courier.php`
- Pathao & RedX: credentials set in `.env` (`PATHAO_USER`, `PATHAO_PASSWORD`, `REDX_PHONE`, `REDX_PASSWORD`)
- Fraud detection: `App\Services\CourierFraudCheckerService` wraps `shahariar-ahmad/courier-fraud-checker-bd`

### Queue & Sessions
`QUEUE_CONNECTION=database`, `SESSION_DRIVER=database`, `CACHE_STORE=database` — all database-backed, no Redis required for local dev.
