import { ref } from 'vue'
import {useApiClient} from "./useApiClient.js";

export function usePaginatedList(config = {}) {
    const {
        url = '',
        defaultPage = 1,
        defaultPageSize = 12,
        pageSizes = [12, 30, 50],
        defaultParams = {}
    } = config;

    const {get} = useApiClient();

    const items = ref([]);
    const total = ref(0);
    const currentPage = ref(defaultPage);
    const pageSize = ref(defaultPageSize);
    const loading = ref(false);
    const error = ref(null);
    const filterParams = ref({ ...defaultParams });

    const paginate = async (
        page = currentPage.value,
        limit = pageSize.value,
        customParams = {}
    ) => {
        loading.value = true;
        error.value = null;

        try {
            const params = {
                page,
                per_page: limit,
                ...filterParams.value,
                ...customParams
            }

            const response = await get(url, params)
            const data = response.data

            items.value = data.items;
            total.value = data.total;

            currentPage.value = page;
            pageSize.value = limit;
        } catch (err) {
            error.value = err.response?.data?.message || 'Error fetching data';
            items.value = [];
            total.value = 0;
        } finally {
            loading.value = false;
        }
    }

    const updateFilters = async (newFilters) => {
        filterParams.value = { ...filterParams.value, ...newFilters };
        currentPage.value = 1;

        await paginate(1, pageSize.value);
    }

    const resetFilters = async () => {
        filterParams.value = { ...defaultParams };
        currentPage.value = 1;

        await paginate(1, pageSize.value);
    }

    const handlePageChange = async (page) => {
        await paginate(page, pageSize.value);
    }

    const handleSizeChange = async (size) => {
        await paginate(1, size);
    }

    const refresh = async () => {
        await paginate(currentPage.value, pageSize.value);
    }

    return {
        items,
        total,
        currentPage,
        pageSize,
        loading,
        error,
        filterParams,
        pageSizes,
        paginate,
        updateFilters,
        resetFilters,
        handlePageChange,
        handleSizeChange,
        refresh
    };
}
