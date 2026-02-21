import {ref} from 'vue';
import axios, {type AxiosInstance, isAxiosError} from 'axios';
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores";

export function useApiClient() {
  const router = useRouter();
  const {getToken, resetToken} = useAuthStore();

  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const api: AxiosInstance = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        resetToken();

        router.push('/login');
      }

      return Promise.reject(error);
    }
  );

  const request = async <T>(
    method: string,
    url: string,
    data: object = {},
    params: object = {}
  ): Promise<T> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await api.request<T>({
        method,
        url,
        data,
        params
      });

      return response.data;
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        error.value = e.response?.data?.message || 'Error';
      } else {
        error.value = 'An unexpected error occurred';
      }
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    get: <T>(url: string, params: object = {}): Promise<T> => {
      return request<T>('get', url, {}, params);
    },
    post: <T>(url: string, data: object = {}): Promise<T> => {
      return request<T>('post', url, data);
    },
    put: <T>(url: string, data: object = {}): Promise<T> => {
      return request<T>('put', url, data);
    },
    delete: <T>(url: string): Promise<T> => {
      return request<T>('delete', url);
    }
  };
}
