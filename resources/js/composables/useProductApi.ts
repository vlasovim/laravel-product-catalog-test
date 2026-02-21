import {useApiClient} from '@/composables/useApiClient';
import type {
  ApiResponse,
  EmptyResponse,
  PaginatedResponse,
  PaginationMeta,
  ProductFilters,
  ProductFormData,
} from "@/types";
import type {Product} from "@/models";

export function useProductsApi() {
  const {
    get,
    post,
    put,
    delete: remove,
    loading,
    error
  } = useApiClient();

  const fetchProducts = async (params: ProductFilters = {}): Promise<PaginationMeta<Product>> => {
    try {
      const data = await get<PaginatedResponse<Product>>('/products', params);
      return data.data;
    } catch (e) {
      throw e;
    }
  }

  const fetchProduct = async (id: number): Promise<Product> => {
    try {
      const data = await get<ApiResponse<Product>>(`/products/${id}`);
      return data.data;
    } catch (e) {
      throw e;
    }
  }

  const createProduct = async (productData: ProductFormData): Promise<Product> => {
    try {
      const data = await post<ApiResponse<Product>>('/products', productData);
      return data.data;
    } catch (e) {
      throw e;
    }
  }

  const updateProduct = async (id: number, productData: ProductFormData): Promise<Product> => {
    try {
      const data = await put<ApiResponse<Product>>(`/products/${id}`, productData);
      return data.data;
    } catch (e) {
      throw e;
    }
  }

  const deleteProduct = async (id: number): Promise<void> => {
    try {
      await remove<EmptyResponse>(`/products/${id}`);
    } catch (e) {
      throw e;
    }
  }

  return {
    loading,
    error,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
