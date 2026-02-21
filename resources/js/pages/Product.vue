<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useProductsApi} from "@/composables";
import {ElMessage} from "element-plus";
import type {Product} from "@/models";

const route = useRoute();
const router = useRouter();
const {fetchProduct, error} = useProductsApi();

const product = ref<Product>();

const loadProduct = async (id: number): Promise<void> => {
  try {
    product.value = await fetchProduct(id);
  } catch (err) {
    router.push('/');

    ElMessage.error('Product not found');
  }
}

onMounted(() => {
  loadProduct(Number(route.params.id));
})
</script>

<template>
  <div v-if="product">
    <h1>{{ product.name }}</h1>
    <p>{{ product.category?.name }}</p>
    <p>{{ product.description }}</p>
    <p>${{ product.price }}</p>
  </div>
</template>

<style scoped>
h1 {
  margin-top: 0;
}
</style>
