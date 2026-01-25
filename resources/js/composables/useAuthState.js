import {computed, ref} from 'vue';

const token = ref(localStorage.getItem('token'));

export function useAuthState() {
    const isAuthenticated = computed(() => !!token.value);

    const getToken = () => token.value;

    const setToken = (newToken) => {
        token.value = newToken;

        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
    };

    const resetToken = () => setToken(null);

    return {
        isAuthenticated,
        getToken,
        setToken,
        resetToken,
    };
}
