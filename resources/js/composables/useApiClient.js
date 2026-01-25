import {ref} from 'vue';
import axios from 'axios';
import {useAuthState} from "./useAuthState.js";
import {useRouter} from "vue-router";

export function useApiClient() {
    const router = useRouter();
    const {getToken, resetToken} = useAuthState();

    const loading = ref(false);
    const error = ref(null);

    const api = axios.create({
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

    const request = async (method, url, data = {}, params = {}) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await api.request({
                method,
                url,
                data,
                params
            });

            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Error';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        get: (url, params) => request('get', url, {}, params),
        post: (url, data) => request('post', url, data),
        put: (url, data) => request('put', url, data),
        delete: (url) => request('delete', url)
    };
}
