import {useApiClient} from './useApiClient.js';

export function useProductsApi() {
    const {
        get,
        post,
        put,
        delete: remove,
        loading,
        error
    } = useApiClient();

    const fetchProducts = async (params = {}) => {
        try {
            const data = await get('/products', params);
            return data.data;
        } catch (err) {
            throw err;
        }
    }

    const fetchProduct = async (id) => {
        try {
            const data = await get(`/products/${id}`);
            return data.data;
        } catch (err) {
            throw err;
        }
    }

    const createProduct = async (productData) => {
        try {
            const data = await post('/products', productData);
            return data.data;
        } catch (err) {
            throw err;
        }
    }

    const updateProduct = async (id, productData) => {
        try {
            const data = await put(`/products/${id}`, productData);
            return data.data;
        } catch (err) {
            throw err;
        }
    }

    const deleteProduct = async (id) => {
        try {
            await remove(`/products/${id}`);
        } catch (err) {
            throw err;
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
