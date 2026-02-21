export interface PaginatedListConfig {
  url: string;
  defaultPage?: number;
  defaultPageSize?: number;
  pageSizes?: number[];
  defaultParams?: Record<string, unknown>;
}
