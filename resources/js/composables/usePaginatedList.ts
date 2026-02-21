import {ref} from 'vue'
import {useApiClient} from "@/composables/useApiClient";
import type {PaginatedResponse, PaginatedListConfig} from "@/types";
import {isAxiosError} from "axios";

export function usePaginatedList<T>(config: PaginatedListConfig) {
  const {
    url = '',
    defaultPage = 1,
    defaultPageSize = 12,
    pageSizes = [12, 30, 50],
    defaultParams = {}
  } = config;

  const {get} = useApiClient();

  const items = ref<T[]>([]);
  const total = ref<number>(0);
  const currentPage = ref<number>(defaultPage);
  const pageSize = ref<number>(defaultPageSize);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const filterParams = ref<Record<string, unknown>>({...defaultParams});

  const paginate = async (
    page: number = currentPage.value,
    limit: number = pageSize.value,
    customParams: Record<string, unknown> = {}
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const params = {
        page,
        per_page: limit,
        ...filterParams.value,
        ...customParams
      }

      const response = await get<PaginatedResponse<T>>(url, params)
      const data = response.data

      items.value = data.items;
      total.value = data.total;

      currentPage.value = page;
      pageSize.value = limit;
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        error.value = e.response?.data?.message || 'Error fetching data';
        items.value = [];
        total.value = 0;
      }
    } finally {
      loading.value = false;
    }
  }

  const updateFilters = async (newFilters: Record<string, unknown>): Promise<void> => {
    filterParams.value = {...filterParams.value, ...newFilters};
    currentPage.value = 1;

    await paginate(1, pageSize.value);
  }

  const resetFilters = async (): Promise<void> => {
    filterParams.value = {...defaultParams};
    currentPage.value = 1;

    await paginate(1, pageSize.value);
  }

  const handlePageChange = async (page: number): Promise<void> => {
    await paginate(page, pageSize.value);
  }

  const handleSizeChange = async (size: number): Promise<void> => {
    await paginate(1, size);
  }

  const refresh = async (): Promise<void> => {
    await paginate(currentPage.value, pageSize.value);
  }

  return {
    items,
    total,
    currentPage,
    pageSize,
    loading,
    error,
    filterParams,
    pageSizes,
    paginate,
    updateFilters,
    resetFilters,
    handlePageChange,
    handleSizeChange,
    refresh
  };
}
