<script setup>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useProductsApi} from "../composables/useProductApi.js";
import {ElMessage} from "element-plus";

const route = useRoute()
const router = useRouter()
const {fetchProduct, error} = useProductsApi()

const product = ref(null)

const loadProduct = async (id) => {
    try {
        product.value = await fetchProduct(id);
    } catch (err) {
        router.push('/');
        ElMessage.error('Product not found');
    }
}

onMounted(async () => {
    await loadProduct(route.params.id)
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
