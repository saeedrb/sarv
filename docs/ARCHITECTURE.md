# راهنمای معماری Base Project

این پروژه یک نقطه شروع عمومی برای برنامه‌های Next.js است. هدف آن شبیه‌سازی
ظاهری Laravel نیست؛ هدف، داشتن قراردادها و محل‌های مشخص برای کارهایی است که در
تقریباً همه پروژه‌ها تکرار می‌شوند.

## ایده اصلی

هر بخش فقط یک مسئولیت دارد:

```text
app/        مسیریابی و کنار هم قرار دادن بخش‌های صفحه
features/   قابلیت‌های کسب‌وکار مانند auth، profile و cart
core/       زیرساخت عمومی مانند HTTP، error و config
providers/  اتصال سرویس‌ها به React
shared/     ابزارها و UI عمومی و مستقل از feature
```

وابستگی‌ها بهتر است در این جهت حرکت کنند:

```text
app -> features -> core
app -> shared
providers -> core
```

`core` نباید چیزی درباره محصول، صفحه پرداخت یا نام یک feature بداند.

## تنظیم متغیرهای محیطی

فایل `.env.example` را با نام `.env.local` کپی کنید:

```env
NEXT_PUBLIC_APP_NAME=Base Project
NEXT_PUBLIC_API_URL=/api
```

متغیرهای عمومی در `core/config/env.ts` با Zod بررسی می‌شوند. رازهایی مانند
کلید دیتابیس یا secret نباید با پیشوند `NEXT_PUBLIC_` تعریف شوند، چون در
مرورگر قابل مشاهده خواهند بود.

## درخواست‌های HTTP

همه درخواست‌های عمومی از `core/http` عبور می‌کنند:

```ts
import { api } from "@/core/http";

type Product = {
  id: string;
  title: string;
};

const product = await api.get<Product>("/products/1");
```

نمونه ارسال داده:

```ts
await api.post("/products", {
  title: "Keyboard",
});
```

HTTP client به‌صورت پیش‌فرض:

- درخواست JSON می‌فرستد و پاسخ JSON را می‌خواند.
- cookie را با `credentials: "include"` ارسال می‌کند.
- بعد از ۱۵ ثانیه درخواست را متوقف می‌کند.
- پاسخ ناموفق را به `AppError` تبدیل می‌کند.
- از query string و `AbortSignal` پشتیبانی می‌کند.

برای آپلود فایل، یک `FormData` به‌عنوان body بدهید. در این حالت
`Content-Type` توسط مرورگر تعیین می‌شود.

## قرارداد خطای backend

بهترین پاسخ خطا از backend این شکل است:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "اطلاعات واردشده معتبر نیست.",
  "errors": {
    "email": ["این ایمیل قبلاً ثبت شده است."]
  }
}
```

همه خطاها در frontend به مدل زیر تبدیل می‌شوند:

```ts
type AppError = {
  code: string;
  message: string;
  status?: number;
  fields?: Record<string, string[]>;
};
```

برای نمایش عمومی خطا در Client Component:

```ts
import { showError } from "@/shared/errors/show-error";

try {
  await saveProfile(input);
} catch (error) {
  const appError = showError(error);
  console.log(appError.code);
}
```

فایل `app/error.tsx` خطاهای کنترل‌نشده routeها را نمایش می‌دهد. در محیط واقعی
می‌توان `console.error` آن را با Sentry یا سرویس logging جایگزین کرد.

## دریافت و cache داده

TanStack Query برای state سمت سرور استفاده می‌شود:

```ts
const productsQuery = useQuery({
  queryKey: ["products"],
  queryFn: ({ signal }) => api.get<Product[]>("/products", { signal }),
});
```

قاعده پیشنهادی:

- داده backend را در TanStack Query نگه دارید.
- state موقت UI مانند باز بودن modal را در state محلی نگه دارید.
- اطلاعات تکراری backend را دوباره در Context یا Zustand کپی نکنید.
- Server Componentها می‌توانند برای داده‌های مخصوص رندر سرور مستقیماً fetch
  کنند.

## احراز هویت

feature آماده auth در `features/auth` قرار دارد و این endpointها را انتظار دارد:

```text
GET  /auth/session
POST /auth/login
POST /auth/logout
```

پاسخ session و login:

```json
{
  "user": {
    "id": "1",
    "name": "Ada",
    "email": "ada@example.com",
    "roles": ["admin"]
  }
}
```

استفاده در Client Component:

```tsx
const { user, isLoading, logout } = useAuth();
```

کامپوننت `LoginForm` نمونه کامل اتصال React Hook Form، Zod، API، خطاهای
فیلدها و toast است.

پیشنهاد امنیتی این starter استفاده از session یا token داخل cookie با گزینه‌های
`HttpOnly`، `Secure` و `SameSite` است. access token را به‌صورت پیش‌فرض در
`localStorage` نگه ندارید.

اگر frontend و backend روی originهای متفاوت هستند، تنظیم CORS و cookie باید
در backend نیز انجام شود.

## افزودن feature جدید

برای مثال feature محصولات:

```text
features/products/
  api/
    products-api.ts
  components/
    product-card.tsx
  hooks/
    use-products.ts
  schemas.ts
  types.ts
  index.ts
```

مراحل پیشنهادی:

1. type و schema ورودی را تعریف کنید.
2. توابع API را در پوشه `api` بنویسید.
3. query و mutationها را داخل hookهای feature قرار دهید.
4. UI اختصاصی همان feature را در `components` نگه دارید.
5. فقط exportهای عمومی feature را از `index.ts` منتشر کنید.

## چه چیزی کجا قرار نمی‌گیرد؟

- درخواست مستقیم و پراکنده `fetch` در کامپوننت‌های UI قرار نمی‌گیرد.
- منطق محصول داخل `core` قرار نمی‌گیرد.
- کامپوننت اختصاصی auth داخل `shared` قرار نمی‌گیرد.
- server secret داخل env عمومی قرار نمی‌گیرد.
- خطای backend بدون normalize شدن مستقیماً در UI مصرف نمی‌شود.

## پکیج‌های انتخاب‌شده

| پکیج | مسئولیت |
| --- | --- |
| Next.js | framework و routing |
| TanStack Query | cache، query و mutation |
| Zod | اعتبارسنجی runtime و schema |
| React Hook Form | مدیریت فرم |
| Sonner | toast و پیام‌های کوتاه |
| Tailwind CSS | استایل |

در این نسخه HTTP client روی `fetch` استاندارد ساخته شده است؛ بنابراین Axios
اضافه نشده و دو ابزار هم‌پوشان برای یک کار نداریم.

## توسعه آینده

قابلیت‌هایی مانند refresh token، logging پیشرفته و observability باید زمانی
اضافه شوند که قرارداد واقعی پروژه مشخص باشد. این رویکرد جلوی پیچیدگی زودهنگام
و abstractionهای بلااستفاده را می‌گیرد.

## تست

ابزارهای تست آماده‌اند:

```bash
npm test
npm run test:watch
```

ساختار تست:

```text
tests/
  setup.ts
  mocks/
    server.ts
```

MSW برای mock کردن backend استفاده می‌شود. نمونه:

```ts
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mocks/server";

server.use(
  http.get("https://api.example.test/products", () =>
    HttpResponse.json({ data: [], meta: { page: 1, perPage: 15, total: 0, totalPages: 0 } }),
  ),
);
```

تست‌های فعلی روی دو نقطه مهم تمرکز دارند: HTTP client و authorization.

## Authorization

توابع عمومی authorization در `core/auth` هستند:

```ts
import { hasPermission, hasRole } from "@/core/auth";

hasRole(user, "admin");
hasPermission(user, "posts.update");
```

کاربر دارای roleهای `admin` یا `super-admin` همه permissionها را پاس می‌کند.

برای Server Componentها:

```ts
import { requireServerPermission } from "@/features/auth/server/session";

export default async function AdminPage() {
  const session = await requireServerPermission("admin.view");
  return <div>{session.user.name}</div>;
}
```

اگر کاربر لاگین نباشد redirect می‌شود. اگر permission نداشته باشد صفحه 403
نمایش داده می‌شود.

## Pagination و فیلتر URL

قرارداد pagination در `core/api` قرار دارد:

```ts
type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};
```

برای sync با URL در Client Component:

```ts
import { useUrlPagination } from "@/shared/pagination";

const { pagination, setPage, setSearch } = useUrlPagination();
```

## UI پایه

کامپوننت‌های پایه در `shared/ui` قرار دارند:

```tsx
import { Alert, Button, Input, Modal } from "@/shared/ui";
```

این‌ها جای design system نهایی را نمی‌گیرند، اما باعث می‌شوند پروژه از همان اول
زبان بصری و accessibility پایه داشته باشد.

## Generator

برای ساخت feature جدید:

```bash
npm run make:feature products
```

خروجی:

```text
features/products/
  api/
  components/
  hooks/
  schemas.ts
  types.ts
  index.ts
```

نام feature باید kebab-case باشد.

## قوانین معماری

ESLint جلوی import مستقیم از داخل featureها را می‌گیرد:

```ts
// نادرست
import { LoginForm } from "@/features/auth/components/login-form";

// درست
import { LoginForm } from "@/features/auth";
```

داخل خود همان feature از import نسبی استفاده کنید.

## Upload

ابزارهای فایل در `core/upload` هستند:

```ts
import { createUploadFormData, validateFile } from "@/core/upload";

validateFile(file, {
  maxSizeInMb: 2,
  acceptedTypes: ["image/png", "image/jpeg"],
});

await api.post("/files", createUploadFormData(file));
```

## Feature Flags

flagهای عمومی در `.env.local` تعریف می‌شوند:

```env
NEXT_PUBLIC_FEATURE_NEW_DASHBOARD=true
```

استفاده:

```ts
import { isFeatureEnabled } from "@/core/feature-flags";

if (isFeatureEnabled("newDashboard")) {
  // show feature
}
```

## CI

فایل `.github/workflows/ci.yml` این فرمان‌ها را اجرا می‌کند:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
