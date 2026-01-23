<script setup>
import {ref, onMounted} from 'vue'
import {ElMessage} from 'element-plus'
import {useProductsApi} from "../composables/useProductApi.js";

const {fetchProducts, loading, error} = useProductsApi();

const products = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(12);
const pageSizes = [12, 30, 50];

const loadProducts = async (page = 1, limit = pageSize.value) => {
    try {
        const data = await fetchProducts({
            page,
            per_page: limit
        });

        products.value = data.items || [];
        total.value = data.total || 0;
        currentPage.value = page;
        pageSize.value = limit;
    } catch (err) {
        ElMessage.error(error.value);
    }
}

const handlePageChange = (page) => {
    loadProducts(page, pageSize.value);
}

const handleSizeChange = (size) => {
    loadProducts(1, size);
}

onMounted(() => {
    loadProducts();
});
</script>

<template>
    <div v-if="loading">
        Loading...
    </div>

    <div v-else-if="products.length === 0">
        Nothing found
    </div>

    <div v-else>
        <el-row :gutter="20">
            <el-col
                v-for="product in products"
                :key="product.id"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
                :xl="6"
            >
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <el-row class="w-150px mb-2">
                                <el-text :size="'large'" tag="b" line-clamp="1">
                                    {{ product.name }}
                                </el-text>
                            </el-row>

                            <el-text>{{ product.category?.name }}</el-text>
                        </div>
                    </template>

                    <el-text v-if="product.description" line-clamp="2">
                        {{ product.description }}
                    </el-text>
                    <el-text>${{ product.price }}</el-text>

                    <template #footer>
                        <router-link :to="`/product/${product.id}`" class="product-link">
                            <el-button type="primary" plain>Read more</el-button>
                        </router-link>
                    </template>
                </el-card>

            </el-col>
        </el-row>

        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="pageSizes"
            layout="total, prev, pager, next"
            :pager-count="5"
            :total="total"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
        />
    </div>
</template>

<style scoped>
.product-link {
    text-decoration: none;
}

.el-card {
    margin-bottom: 20px;
}
</style>
