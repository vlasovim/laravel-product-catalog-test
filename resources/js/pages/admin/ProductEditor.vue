<script setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useProductsApi} from "../../composables/useProductApi.js";
import CategorySelect from "../../components/CategorySelect.vue";

const route = useRoute();
const router = useRouter();
const formRef = ref();

const {
    fetchProduct,
    createProduct,
    updateProduct,
    loading: productLoading,
    error: productError
} = useProductsApi();

const isEdit = computed(() => !!route.params.id);

const form = reactive({
    name: '',
    description: '',
    price: 0,
    category_id: ''
});

const rules = {
    name: [
        {required: true, message: 'Product name is required', trigger: 'blur'},
        {min: 2, message: 'Name must be at least 2 characters', trigger: 'blur'},
        {max: 255, message: 'Name must be at most 255 characters', trigger: 'blur'}
    ],
    category_id: [
        {required: true, message: 'Category is required', trigger: 'change'}
    ],
    price: [
        {required: true, message: 'Price is required', trigger: 'blur'},
        {
            validator: (_, value) => value > 0 || Promise.reject('Price must be greater than 0'),
            trigger: 'blur'
        }
    ],
}

const goBack = () => {
    router.push('/admin/products');
}

const fetchProductData = async () => {
    if (!isEdit.value) return;

    try {
        const product = await fetchProduct(route.params.id);

        form.name = product.name;
        form.description = product.description || '';
        form.price = product.price;
        form.category_id = product.category?.id || '';
    } catch (error) {
        ElMessage.error('Product not found');
        goBack();
    }
}

const submitForm = async () => {
    try {
        await formRef.value.validate();
    } catch (error) {
        return;
    }

    try {
        if (isEdit.value) {
            await updateProduct(route.params.id, form)
            ElMessage.success('Product updated successfully');
        } else {
            await createProduct(form)
            ElMessage.success('Product created successfully');
        }

        goBack();
    } catch (error) {
        ElMessage.error(productError);
    }
}

onMounted(() => {
    if (isEdit.value) {
        fetchProductData();
    }
})
</script>

<template>
    <div class="product-edit-page">
        <el-card shadow="never">
            <template #header>
                {{ isEdit ? 'Edit Product' : 'Create New Product' }}
            </template>

            <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-position="top"
                :disabled="productLoading"
            >
                <el-form-item label="Product Name" prop="name">
                    <el-input
                        v-model="form.name"
                        placeholder="Enter product name"
                        clearable
                        size="large"
                    />
                </el-form-item>

                <el-form-item label="Category" prop="category_id">
                    <CategorySelect v-model="form.category_id" size="large"/>
                </el-form-item>

                <el-form-item label="Price" prop="price">
                    <el-input
                        v-model="form.price"
                        type="number"
                        placeholder="0.00"
                        size="large"
                    />
                </el-form-item>

                <el-form-item label="Description" prop="description">
                    <el-input
                        v-model="form.description"
                        type="textarea"
                        :rows="4"
                        placeholder="Enter product description"
                    />
                </el-form-item>

                <el-form-item>
                    <el-button @click="goBack" :disabled="productLoading">
                        Cancel
                    </el-button>
                    <el-button
                        type="primary"
                        @click="submitForm"
                        :loading="productLoading"
                        :disabled="productLoading"
                    >
                        {{ isEdit ? 'Update' : 'Create' }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<style scoped>
.product-edit-page {
    max-width: 800px;
    margin: 0 auto;
}
</style>
