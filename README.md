# Base Project

یک starter برای پروژه‌های Next.js که کارهای تکراری مانند درخواست HTTP، مدیریت
خطا، session، cache و فرم را با قرارداد مشخص آماده می‌کند.

## شروع سریع

```bash
npm install
cp .env.example .env.local
npm run dev
```

در ویندوز می‌توانید `.env.example` را به `.env.local` کپی کنید.

## ساختار اصلی

```text
app/        routes, layouts and page composition
core/       framework-agnostic infrastructure
features/   business capabilities
providers/  React context providers
shared/     reusable UI and utilities
docs/       project documentation
```

راهنمای معماری، قراردادهای backend و مثال توسعه هم به‌صورت فایل
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) وجود دارد و هم به‌صورت صفحات وب
در مسیر `/docs` داخل اپلیکیشن قابل مشاهده است.

## فرمان‌ها

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run make:feature products
```

## قابلیت‌های آماده

- HTTP client مرکزی و مدیریت خطای یکپارچه
- Auth سمت client و server
- Authorization با role و permission
- Pagination contract و sync با URL
- UI primitives شامل Button، Input، Alert و Modal
- فرم با React Hook Form و Zod
- تست با Vitest، Testing Library و MSW
- Generator برای ساخت feature
- CI آماده برای GitHub Actions
