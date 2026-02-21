import {useApiClient} from '@/composables';
import type {LoginRequest, ApiResponse, LoginResponse} from "@/types";
import {useAuthStore} from '@/stores';

export function useAuthApi() {
  const {post} = useApiClient();
  const {setToken, resetToken} = useAuthStore();

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const data = await post<ApiResponse<LoginResponse>>('/login', credentials);

      setToken(data.data.token);

      return data.data;
    } catch (error) {
      throw error;
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await post('/logout');
    } catch (error) {
      throw error;
    } finally {
      resetToken();
    }
  }

  return {
    login,
    logout
  }
}
