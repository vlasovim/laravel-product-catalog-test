import {computed} from 'vue';

export function useApiToken() {
    const token = computed({
        get() {
            return localStorage.getItem('token');
        },
        set(newToken) {
            if (newToken) {
                localStorage.setItem('token', newToken);
            } else {
                localStorage.removeItem('token');
            }
        }
    });
    const isAuthenticated = computed(() => !!token.value);

    const getToken = () => token.value;
    const setToken = (newToken) => token.value = newToken;
    const resetToken = () => {
        token.value = null;
    };

    return {
        isAuthenticated,
        getToken,
        setToken,
        resetToken
    };
}
