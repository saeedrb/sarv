export type DocPage = {
  slug: string;
  title: string;
  description: string;
  sections: Array<{
    title: string;
    body: string[];
    code?: string;
  }>;
};

export const docPages: DocPage[] = [
  {
    slug: "architecture",
    title: "Architecture",
    description: "How the project is organized and where each kind of code lives.",
    sections: [
      {
        title: "Main Idea",
        body: [
          "This starter is inspired by Laravel's clarity, not by copying Laravel folders. The goal is to make repeated frontend work predictable.",
          "Routes stay light, features own business behavior, and core remains reusable across projects.",
        ],
        code: `app/        routing, layouts, page composition
features/   business capabilities such as auth or products
core/       reusable infrastructure such as HTTP, errors, config
providers/  React providers and app-level wiring
shared/     reusable UI, hooks, and utilities`,
      },
      {
        title: "Dependency Direction",
        body: [
          "Code should depend inward toward reusable layers. Core should not know about app routes or product features.",
          "Inside a feature, use relative imports. Outside a feature, import from the feature public index.",
        ],
        code: `app -> features -> core
app -> shared
providers -> core`,
      },
    ],
  },
  {
    slug: "http-errors",
    title: "HTTP And Errors",
    description: "A central HTTP client and one normalized error shape for the whole app.",
    sections: [
      {
        title: "HTTP Client",
        body: [
          "All regular API calls should go through core/http. This keeps timeout, JSON handling, cookies, and error normalization in one place.",
          "The client uses fetch under the hood, so there is no overlapping Axios layer.",
        ],
        code: `import { api } from "@/core/http";

type Product = {
  id: string;
  title: string;
};

const product = await api.get<Product>("/products/1");`,
      },
      {
        title: "Backend Error Contract",
        body: [
          "Backend validation errors should follow a predictable shape. The frontend turns every failed response into AppError.",
          "Field errors can be applied directly to React Hook Form inputs.",
        ],
        code: `{
  "code": "VALIDATION_ERROR",
  "message": "The submitted data is invalid.",
  "errors": {
    "email": ["Email is already taken."]
  }
}`,
      },
    ],
  },
  {
    slug: "auth",
    title: "Auth And Permissions",
    description: "Client auth hooks, server session helpers, roles, and permissions.",
    sections: [
      {
        title: "Expected Endpoints",
        body: [
          "The auth feature expects cookie-based session endpoints. HttpOnly cookies are the preferred default for this starter.",
          "Avoid localStorage tokens as the default auth storage.",
        ],
        code: `GET  /auth/session
POST /auth/login
POST /auth/logout`,
      },
      {
        title: "Server Protection",
        body: [
          "Use server helpers when a page must be protected before rendering. This avoids showing protected content for a moment on the client.",
        ],
        code: `import { requireServerPermission } from "@/features/auth/server/session";

export default async function AdminPage() {
  const session = await requireServerPermission("admin.view");
  return <div>{session.user.name}</div>;
}`,
      },
    ],
  },
  {
    slug: "forms-ui",
    title: "Forms And UI",
    description: "Reusable form helpers and basic UI primitives.",
    sections: [
      {
        title: "UI Primitives",
        body: [
          "The shared UI layer contains small primitives such as Button, Input, Alert, and Modal.",
          "These components are not a final design system. They are a stable starting point that keeps early project UI consistent.",
        ],
        code: `import { Alert, Button, Input, Modal } from "@/shared/ui";`,
      },
      {
        title: "Field Errors",
        body: [
          "Backend field errors can be mapped into React Hook Form with one helper.",
        ],
        code: `import { applyFieldErrors } from "@/shared/forms";

try {
  await login(input);
} catch (error) {
  showError(applyFieldErrors(error, setError));
}`,
      },
    ],
  },
  {
    slug: "data",
    title: "Data, Pagination, Upload",
    description: "Shared contracts for lists, query params, and file uploads.",
    sections: [
      {
        title: "Pagination",
        body: [
          "Paginated endpoints should return data and meta. Client pages can sync page, per_page, and search with the URL.",
        ],
        code: `type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};`,
      },
      {
        title: "Upload",
        body: [
          "File validation and FormData creation live in core/upload so upload rules are not rewritten inside every feature.",
        ],
        code: `validateFile(file, {
  maxSizeInMb: 2,
  acceptedTypes: ["image/png", "image/jpeg"],
});

await api.post("/files", createUploadFormData(file));`,
      },
    ],
  },
  {
    slug: "testing-ci",
    title: "Testing, Generator, CI",
    description: "Quality checks, API mocks, feature scaffolding, and automation.",
    sections: [
      {
        title: "Tests",
        body: [
          "Vitest runs unit tests. MSW mocks API behavior, which keeps HTTP tests realistic without needing a backend.",
        ],
        code: `npm test
npm run test:watch`,
      },
      {
        title: "Feature Generator",
        body: [
          "Use the generator to create a standard feature folder with api, components, hooks, schemas, types, and index files.",
        ],
        code: `npm run make:feature products`,
      },
      {
        title: "CI",
        body: [
          "GitHub Actions runs lint, typecheck, tests, and build on pushes and pull requests.",
        ],
        code: `npm run lint
npm run typecheck
npm test
npm run build`,
      },
    ],
  },
];

export const docsIndex = docPages.map(({ slug, title, description }) => ({
  slug,
  title,
  description,
}));

export function getDocPage(slug: string) {
  return docPages.find((page) => page.slug === slug);
}
