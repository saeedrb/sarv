import { z } from "zod";

export const paginationMetaSchema = z.object({
  page: z.number().int().positive(),
  perPage: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const paginationInputSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(15),
  search: z.string().trim().optional(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PaginationInput = z.infer<typeof paginationInputSchema>;

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export function toPaginationQuery(input: Partial<PaginationInput>) {
  const parsed = paginationInputSchema.parse(input);

  return {
    page: parsed.page,
    per_page: parsed.perPage,
    search: parsed.search || undefined,
  };
}
