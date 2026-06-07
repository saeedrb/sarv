"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { paginationInputSchema } from "@/core/api";

type PaginationPatch = {
  page?: number;
  perPage?: number;
  search?: string;
};

export function useUrlPagination() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pagination = useMemo(
    () =>
      paginationInputSchema.parse({
        page: searchParams.get("page") ?? undefined,
        perPage: searchParams.get("per_page") ?? undefined,
        search: searchParams.get("search") ?? undefined,
      }),
    [searchParams],
  );

  function setPagination(patch: PaginationPatch) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (patch.page !== undefined) {
      nextParams.set("page", String(patch.page));
    }

    if (patch.perPage !== undefined) {
      nextParams.set("per_page", String(patch.perPage));
    }

    if (patch.search !== undefined) {
      if (patch.search.trim()) {
        nextParams.set("search", patch.search.trim());
      } else {
        nextParams.delete("search");
      }

      nextParams.set("page", "1");
    }

    router.replace(`${pathname}?${nextParams.toString()}`);
  }

  return {
    pagination,
    setPage: (page: number) => setPagination({ page }),
    setPerPage: (perPage: number) => setPagination({ perPage, page: 1 }),
    setSearch: (search: string) => setPagination({ search }),
  };
}
