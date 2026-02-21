<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import type {FormInstance, FormRules} from 'element-plus';
import {useProductsApi} from "@/composables";
import CategorySelect from "@/components/CategorySelect.vue";
import type {ProductFormData} from "@/types";

const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();

const {
  fetchProduct,
  createProduct,
  updateProduct,
  loading: productLoading,
  error: productError
} = useProductsApi();

const isEdit = computed<boolean>(() => !!route.params.id);

const form = reactive<ProductFormData>({
  name: '',
  description: '',
  price: 0,
  category_id: null
});

const rules = reactive<FormRules<ProductFormData>>({
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
      validator: (_, value, callback) => {
        return value > 0
          ? callback()
          : callback(new Error('Price must be greater than 0'));
      },
      trigger: 'blur'
    }
  ],
  description: []
});

const goBack = (): void => {
  router.push('/admin/products');
}

const fetchProductData = async (): Promise<void> => {
  if (!isEdit.value) return;

  try {
    const product = await fetchProduct(Number(route.params.id));

    form.name = product.name;
    form.description = product.description || null;
    form.price = product.price;
    form.category_id = product.category?.id || null;
  } catch (error) {
    ElMessage.error('Product not found');
    goBack();
  }
}

const submitForm = async (): Promise<void> => {
  try {
    await formRef.value?.validate();
  } catch (error) {
    return;
  }

  try {
    if (isEdit.value) {
      await updateProduct(Number(route.params.id), form);

      ElMessage.success('Product updated successfully');
    } else {
      await createProduct(form);

      ElMessage.success('Product created successfully');
    }

    goBack();
  } catch (error) {
    ElMessage.error(productError.value || 'Unknown error');
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
