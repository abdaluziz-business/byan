# Bayan (بيان) by Tabayn

A multi-tenant SaaS platform that lets businesses spin up a fully customizable
website — services, team, bookings, payments, blog, testimonials, and a
contact form — without writing code. This repository is the monorepo for the
whole platform: a NestJS API and a React admin panel + public site renderer.

Read this in: [English](#english) | [العربية](#العربية)

---

## English

### Architecture

```
bayan/
├── apps/
│   ├── backend/     # NestJS API (Prisma/PostgreSQL, JWT auth, BullMQ, Swagger)
│   └── frontend/    # React 18 + Vite + Tailwind — admin panel & live site renderer
├── packages/
│   └── shared/      # TypeScript types shared between backend and frontend
├── package.json     # npm workspaces root
└── README.md
```

**Multi-tenancy model**: a `Client` is a business using Bayan. Each client
owns one or more `Site`s. A site holds a `theme` (colors, fonts, logo) and a
`sections` map (which sections are enabled, which variant to render, and in
what order). Everything else — services, team members, bookings, testimonials,
blog posts, contact messages, payments — hangs off a site.

### Backend (`apps/backend`)

- **NestJS** with a module per domain concept: `auth`, `clients`, `sites`,
  `sections`, `services`, `bookings`, `payments`, `team`, `testimonials`,
  `blog`, `contact`, `uploads`.
- **Prisma ORM** targeting PostgreSQL — schema at `src/prisma/schema.prisma`.
- **JWT access + refresh tokens**: short-lived access token, long-lived
  refresh token hashed and stored on the `Client` row, rotated on every
  refresh.
- **BullMQ + Redis** for background jobs (currently: transactional emails).
- **Swagger** docs served at `/api/docs`.
- **Pino** structured logging, **class-validator/class-transformer** for
  request validation, **Helmet** + rate limiting for basic hardening.
- **Integrations** (`src/integrations`) are thin wrappers, safe to run without
  credentials in development — they log and no-op instead of throwing:
  - **Moyasar** — Saudi payment gateway for booking checkout.
  - **Resend** — transactional email (booking confirmations, contact
    notifications).
  - **Cloudflare R2** (S3-compatible) — file uploads (images, avatars).

Public vs. admin routes are split with a `@Public()` decorator on top of a
global `JwtAuthGuard`: anything not marked public requires a valid access
token. Public routes cover what the live site needs (published site content,
booking creation, contact form, testimonial submission) plus auth endpoints.

### Frontend (`apps/frontend`)

One Vite app serves two experiences:

- **Admin panel** (`src/admin`) — a neutral black-and-white dashboard
  (`#111111` on dark, `#ffffff` on light, no theme colors) where a client
  manages their site, services, bookings, team, testimonials, blog and
  contact messages.
- **Live site renderer** (`src/site`) — renders a client's public site by
  reading its `theme` and `sections` config and looking up components in a
  **section registry** (`src/site/registry.tsx`). Every section (header, hero,
  services, team, testimonials, about, blog, contact, achievements, gallery,
  trust, how-we-work, footer) is an independent, swappable component; some
  ship with multiple interchangeable variants (e.g. `HeaderClassic` /
  `HeaderMinimal` / `HeaderSidebar`).

**Theme system** (`src/theme`): `ThemeConfig` (re-exported from
`@bayan/shared`) drives everything — colors, fonts, logo, language, direction,
and per-section enable/variant/order. `ThemeProvider` writes the theme's
colors and fonts to CSS custom properties on `<html>` and sets the `dir`
attribute; Tailwind classes (`bg-background`, `text-cta`, etc.) read those
variables, so **no component hardcodes a color**. RTL/LTR is driven by the
`dir` attribute plus a Tailwind `rtl:`/`ltr:` variant registered in
`tailwind.config.ts`.

**i18n** (`src/i18n`): a small custom context (`ar.ts` / `en.ts` dictionaries
+ `i18nContext.tsx`) — no external i18n library, since Bayan only ever needs
Arabic and English.

### Getting started

```bash
# 1. Install all workspace dependencies
npm install

# 2. Copy env files and fill in the values you have (see below)
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 3. Build the shared types package (backend and frontend both depend on it)
npm run build:shared

# 4. Generate the Prisma client and run migrations (needs a running Postgres)
npm run prisma:generate
npm run prisma:migrate

# 5. Run everything (shared in watch mode, backend, frontend)
npm run dev
```

- Backend: `http://localhost:3000/api` — Swagger at `http://localhost:3000/api/docs`
- Frontend: `http://localhost:5173` — admin panel at `/admin/login`

Registering a client (`POST /api/auth/register`, or via the admin UI) creates
a default site automatically, so there's always something to edit right after
sign-up.

### Environment variables

Every variable is documented inline in `apps/backend/.env.example` and
`apps/frontend/.env.example`. Nothing is required to boot the app in
development — Redis/Moyasar/Resend/R2 all degrade gracefully when unset, but
you'll need real Postgres and Redis instances for the API to actually serve
requests and process jobs.

### Conventions worth knowing

- TypeScript `strict` mode everywhere.
- Prisma enums are plain string unions at the type level in `@bayan/shared`
  (not TS `enum` nominal types) is avoided on purpose where it would fight
  Prisma's generated types — mappers cast where necessary; see
  `modules/*/*.mapper.ts` on the backend.
- `packages/shared` builds to **both** CommonJS (`dist/cjs`, consumed by the
  Nest backend) and ESM (`dist/esm`, consumed by Vite) — this avoids CJS/ESM
  interop issues with enums during the frontend production build.

---

## العربية

### الفكرة

بيان منصة SaaS متعددة المستأجرين (multi-tenant) تتيح لأي نشاط تجاري إنشاء
موقع إلكتروني متكامل — خدمات، فريق عمل، حجوزات، مدفوعات، مدونة، آراء عملاء،
ونموذج تواصل — دون كتابة كود. هذا المستودع هو الـ monorepo الكامل للمنصة:
واجهة خلفية NestJS ولوحة تحكم + محرّك عرض للموقع مبني بـ React.

### البنية

```
bayan/
├── apps/
│   ├── backend/     # واجهة NestJS الخلفية (Prisma/PostgreSQL, JWT, BullMQ, Swagger)
│   └── frontend/    # React 18 + Vite + Tailwind — لوحة التحكم وعارض الموقع
├── packages/
│   └── shared/      # أنواع TypeScript مشتركة بين الواجهتين
├── package.json     # جذر مساحة العمل (npm workspaces)
└── README.md
```

**نموذج تعدد المستأجرين**: كل `Client` هو نشاط تجاري يستخدم بيان. كل عميل
يملك موقعًا واحدًا أو أكثر (`Site`)، ولكل موقع `theme` (الألوان، الخطوط،
الشعار) وخريطة `sections` تحدد الأقسام المفعّلة، والنسخة (variant) المستخدمة
لكل قسم، وترتيبها. كل شيء آخر — الخدمات، الفريق، الحجوزات، آراء العملاء،
المدونة، رسائل التواصل، المدفوعات — مرتبط بموقع معيّن.

### الواجهة الخلفية (`apps/backend`)

- **NestJS** بوحدة (module) مستقلة لكل مفهوم: `auth`, `clients`, `sites`,
  `sections`, `services`, `bookings`, `payments`, `team`, `testimonials`,
  `blog`, `contact`, `uploads`.
- **Prisma ORM** مع PostgreSQL — المخطط في `src/prisma/schema.prisma`.
- **مصادقة JWT مع Refresh Token**: توكن دخول قصير العمر، وتوكن تجديد طويل
  العمر يُخزَّن مُشفّرًا (hashed) في جدول العميل، ويتجدد مع كل عملية تحديث.
- **BullMQ + Redis** للمهام الخلفية (حاليًا: رسائل البريد الإلكتروني).
- **Swagger** على المسار `/api/docs`.
- **Pino** لتسجيل الأحداث، و**class-validator/class-transformer** للتحقق من
  المدخلات، و**Helmet** مع تحديد معدل الطلبات كحماية أساسية.
- **التكاملات** (`src/integrations`) عبارة عن واجهات بسيطة يمكن تشغيلها بدون
  مفاتيح فعلية أثناء التطوير — تسجّل تحذيرًا وتتوقف بأمان بدل رمي خطأ:
  - **ميسر (Moyasar)** — بوابة الدفع السعودية لإتمام عمليات الحجز.
  - **Resend** — البريد الإلكتروني التعاملي (تأكيد الحجوزات، إشعارات التواصل).
  - **Cloudflare R2** (متوافق مع S3) — رفع الملفات (صور، صور شخصية).

يتم الفصل بين المسارات العامة والمسارات الإدارية عبر خاصية `@Public()` فوق
حارس (`JwtAuthGuard`) عام: أي مسار غير معلَّم كعام يتطلب توكن دخول صالح.
المسارات العامة تغطي ما يحتاجه الموقع المباشر (محتوى الموقع المنشور، إنشاء
حجز، نموذج التواصل، إرسال رأي عميل) بالإضافة إلى مسارات المصادقة.

### الواجهة الأمامية (`apps/frontend`)

تطبيق Vite واحد يخدم تجربتين:

- **لوحة التحكم** (`src/admin`) — لوحة محايدة بالأسود والأبيض فقط
  (`#111111` للوضع الداكن، `#ffffff` للوضع الفاتح، بدون ألوان الهوية) يدير
  منها العميل موقعه وخدماته وحجوزاته وفريقه وآراء عملائه ومدونته ورسائل
  التواصل.
- **عارض الموقع المباشر** (`src/site`) — يعرض موقع العميل العام بالاعتماد
  على إعدادات `theme` و`sections`، ويبحث عن المكوّنات المناسبة في **سجلّ
  الأقسام** (`src/site/registry.tsx`). كل قسم (الرأس، المقدمة، الخدمات،
  الفريق، آراء العملاء، من نحن، المدونة، التواصل، الإنجازات، معرض الصور،
  الثقة، كيف نعمل، التذييل) مكوّن مستقل وقابل للاستبدال، وبعضها يأتي بعدة
  نسخ قابلة للتبديل (مثل `HeaderClassic` / `HeaderMinimal` / `HeaderSidebar`).

**نظام المظهر** (`src/theme`): تعتمد كل الواجهة على `ThemeConfig` (مُصدَّر من
`@bayan/shared`) — الألوان، الخطوط، الشعار، اللغة، الاتجاه، وحالة كل قسم
(مفعّل/نسخة/ترتيب). يقوم `ThemeProvider` بكتابة ألوان وخطوط المظهر كمتغيرات
CSS على عنصر `<html>` وضبط خاصية `dir`؛ وتقرأ فئات Tailwind (مثل
`bg-background`, `text-cta`) هذه المتغيرات، لذلك **لا يوجد أي لون ثابت مكتوب
داخل أي مكوّن**. اتجاه الصفحة (RTL/LTR) يُضبط عبر خاصية `dir` بالإضافة إلى
متغيّر Tailwind مخصص (`rtl:`/`ltr:`) مسجَّل في `tailwind.config.ts`.

**تعدد اللغات** (`src/i18n`): سياق (context) بسيط مبني يدويًا (قواميس
`ar.ts` / `en.ts` و`i18nContext.tsx`) بدون أي مكتبة خارجية، لأن بيان يحتاج
فقط العربية والإنجليزية.

### التشغيل محليًا

```bash
# 1. تثبيت جميع اعتماديات مساحة العمل
npm install

# 2. نسخ ملفات البيئة وتعبئة القيم المتوفرة لديك (انظر أدناه)
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 3. بناء حزمة الأنواع المشتركة (يعتمد عليها الطرفان)
npm run build:shared

# 4. توليد Prisma Client وتشغيل الترحيلات (يتطلب قاعدة بيانات Postgres تعمل)
npm run prisma:generate
npm run prisma:migrate

# 5. تشغيل كل شيء معًا
npm run dev
```

- الواجهة الخلفية: `http://localhost:3000/api` — توثيق Swagger على
  `http://localhost:3000/api/docs`
- الواجهة الأمامية: `http://localhost:5173` — لوحة التحكم على `/admin/login`

عند تسجيل عميل جديد (`POST /api/auth/register`، أو عبر واجهة لوحة التحكم)
يتم إنشاء موقع افتراضي تلقائيًا، بحيث يجد العميل شيئًا جاهزًا للتعديل مباشرة
بعد التسجيل.

### متغيرات البيئة

كل متغير موثّق داخل `apps/backend/.env.example` و`apps/frontend/.env.example`.
لا حاجة لأي متغير لتشغيل التطبيق في بيئة التطوير — تكاملات Redis وMoyasar
وResend وR2 تعمل بأمان دون قيم فعلية، لكنك ستحتاج قاعدتي بيانات Postgres
وRedis حقيقيتين حتى تستجيب الواجهة الخلفية للطلبات وتعالج المهام الخلفية.

### ملاحظات تستحق الانتباه

- وضع TypeScript الصارم (`strict`) مفعّل في كل مكان.
- حزمة `packages/shared` تُبنى إلى نسختين: **CommonJS** (`dist/cjs`، تستخدمها
  الواجهة الخلفية) و**ESM** (`dist/esm`، تستخدمها Vite) — لتفادي مشاكل توافق
  CJS/ESM مع القيم من نوع enum أثناء بناء نسخة الإنتاج للواجهة الأمامية.
