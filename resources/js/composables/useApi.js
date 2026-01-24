import {ref} from 'vue';
import axios from 'axios';
import {useApiToken} from "./useApiToken.js";
import {useRouter} from "vue-router";

export function useApi() {
    const router = useRouter();
    const {getToken, resetToken} = useApiToken();

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

    const get = async (url, params = {}) => {
        try {
            loading.value = true;
            error.value = null;
            const response = await api.get(url, {params});
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Error';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    const post = async (url, data = {}) => {
        try {
            loading.value = true;
            error.value = null;
            const response = await api.post(url, data);
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Error';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    const put = async (url, data = {}) => {
        try {
            loading.value = true;
            error.value = null;
            const response = await api.put(url, data);
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Error';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    const del = async (url) => {
        try {
            loading.value = true;
            error.value = null;
            const response = await api.delete(url);
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Error';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        error,
        get,
        post,
        put,
        delete: del
    }
}
