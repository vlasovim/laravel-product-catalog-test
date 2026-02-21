import type {PaginationParams} from "@/types/pagination-params.ts";

export interface ProductFilters extends PaginationParams {
  category_id?: number | null;
}
