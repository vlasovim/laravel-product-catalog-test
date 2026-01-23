import {ref} from 'vue';
import {useApi} from './useApi';

export function useProductsApi() {
    const {get, post, put, delete: del} = useApi();

    const loading = ref(false);
    const error = ref(null);

    const fetchProducts = async (params = {}) => {
        loading.value = true;
        error.value = null
        try {
            const data = await get('/products', params);

            return data.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Error'
            throw err;
        } finally {
            loading.value = false;
        }
    }

    const fetchProduct = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            const data = await get(`/products/${id}`);

            return data.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Error';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    const createProduct = async (productData) => {
        loading.value = true;
        error.value = null;
        try {
            const data = await post('/products', productData);

            return data.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Error';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    const updateProduct = async (id, productData) => {
        loading.value = true;
        error.value = null;
        try {
            const data = await put(`/products/${id}`, productData);

            return data.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Error';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    const deleteProduct = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            await del(`/products/${id}`);
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
        fetchProducts,
        fetchProduct,
        createProduct,
        updateProduct,
        deleteProduct
    }
}
