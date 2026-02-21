import {useApiClient} from '@/composables/useApiClient';
import type {ApiResponse} from "@/types/api-response.ts";
import type {Category} from "@/models/category.ts";

export function useCategoryApi() {
  const {get, loading, error} = useApiClient();

  const fetchCategories = async (): Promise<Category[]> => {
    try {
      const data = await get<ApiResponse<Category[]>>('/categories');
      return data.data;
    } catch (e) {
      throw e;
    }
  }

  return {
    loading,
    error,
    fetchCategories,
  }
}
