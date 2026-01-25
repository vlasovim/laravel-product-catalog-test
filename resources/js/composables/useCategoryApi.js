import {useApiClient} from './useApiClient.js';

export function useCategoryApi() {
    const {get, loading, error} = useApiClient();

    const fetchCategories = async (params = {}) => {
        try {
            const data = await get('/categories', params);
            return data.data;
        } catch (err) {
            throw err;
        }
    }

    return {
        loading,
        error,
        fetchCategories,
    }
}
