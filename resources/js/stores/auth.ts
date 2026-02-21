import {defineStore} from 'pinia';
import {ref, computed} from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const isAuthenticated = computed<boolean>(() => !!token.value);

  const getToken = (): string | null => {
    return token.value;
  };

  const setToken = (newToken: string | null): void => {
    token.value = newToken;

    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const resetToken = (): void => {
    setToken(null);
  }

  return {
    token,
    isAuthenticated,
    getToken,
    setToken,
    resetToken,
  };
});
