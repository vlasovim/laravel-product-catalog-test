<script setup>
import {ref, onMounted, watch} from 'vue'
import CategorySelect from "../components/CategorySelect.vue";
import {usePaginatedList} from "../composables/usePaginatedList.js";

const {
    items: products,
    total,
    currentPage,
    pageSize,
    pageSizes,
    loading,
    paginate,
    updateFilters,
    handlePageChange,
    handleSizeChange,
} = usePaginatedList({
    url: 'products'
});

const categoryId = ref(null);

watch(categoryId, (newCategoryId) => {
    updateFilters({
        category_id: newCategoryId
    });
});

onMounted(() => {
    paginate();
})
</script>

<template>
    <div v-if="!loading && products.length === 0">
        Nothing found
    </div>

    <div v-else v-loading="loading">
        <el-row :gutter="20" class="filters">
            <el-col :span="4">
                <CategorySelect v-model="categoryId"/>
            </el-col>
        </el-row>

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
            v-if="products.length > 0"
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

.filters,
.el-card {
    margin-bottom: 20px;
}
</style>
