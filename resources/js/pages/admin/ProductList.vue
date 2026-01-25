<script setup>
import {ref, onMounted, watch} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus';
import {useProductsApi} from "../../composables/useProductApi.js";
import {useRouter} from "vue-router";
import CategorySelect from "../../components/CategorySelect.vue";
import {usePaginatedList} from "../../composables/usePaginatedList.js";

const router = useRouter();
const {
    deleteProduct,
    loading: productLoading,
    error
} = useProductsApi();

const {
    items: products,
    total,
    currentPage,
    pageSize,
    pageSizes,
    loading: listLoading,
    paginate,
    updateFilters,
    handlePageChange,
    handleSizeChange,
} = usePaginatedList({
    url: 'products'
});

const categoryId = ref(null);

const handleEdit = (productId) => {
    router.push({path: `/admin/products/${productId}/edit`});
};

const handleCreate = () => {
    router.push({path: '/admin/products/create'});
};

const handleDelete = async (productId) => {
    try {
        await ElMessageBox.confirm(
            'Are you sure you want to delete this product?',
            'Confirm Delete',
            {
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        );

        await deleteProduct(productId);

        ElMessage.success('Product deleted successfully');

        await paginate();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('Failed to delete product');
        }
    }
}

watch(categoryId, (newCategoryId) => {
    updateFilters({
        category_id: newCategoryId
    });
});

onMounted(() => {
    paginate();
});
</script>

<template>
    <div v-if="!listLoading && products.length === 0">
        Nothing found
    </div>

    <div v-else v-loading="listLoading">
        <el-row :gutter="20">
            <el-col :span="3">
                <el-button type="success" @click="handleCreate()">
                    Create Product
                </el-button>
            </el-col>
            <el-col :span="4">
                <CategorySelect v-model="categoryId"/>
            </el-col>
        </el-row>

        <el-table
            :data="products"
            stripe
            border
        >
            <el-table-column prop="name" label="Product Name"/>
            <el-table-column prop="category.name" label="Category"/>
            <el-table-column prop="description" label="Description">
                <template #default="scope">
                    <el-text truncated>{{ scope.row.description }}</el-text>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="Price ($)"/>
            <el-table-column label="Actions" align="center">
                <template #default="scope">
                    <el-button-group>
                        <el-button
                            size="small"
                            type="warning"
                            @click="handleEdit(scope.row.id)"
                            :disabled="productLoading"
                        >
                            Edit
                        </el-button>

                        <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.row.id)"
                            :disabled="productLoading"
                        >
                            Delete
                        </el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

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
.el-table,
.el-row {
    margin-bottom: 20px;
}
</style>
