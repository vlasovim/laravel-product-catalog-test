export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta<T> {
  items: T[];
  total: number;
  count: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginationMeta<T>>;

export type EmptyResponse = ApiResponse<null>;
