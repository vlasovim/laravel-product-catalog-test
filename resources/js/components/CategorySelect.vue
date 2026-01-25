<script setup>
import {ref, onMounted} from 'vue'
import {useCategoryApi} from '../composables/useCategoryApi.js'
import {ElMessage} from "element-plus";

const model = defineModel({
    type: [String, Number],
    default: ''
});

const props = defineProps({
    size: {
        default: 'default',
        validator: (value) => ['large', 'default', 'small'].includes(value),
    },
})

const {fetchCategories, loading} = useCategoryApi();
const categories = ref([]);

onMounted(async () => {
    try {
        categories.value = await fetchCategories();
    } catch (error) {
        ElMessage.error('Failed to load categories');
    }
});
</script>

<template>
    <el-select
        v-model="model"
        placeholder="Select category"
        clearable
        filterable
        :size="size"
        :loading="loading"
    >
        <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
        />
    </el-select>
</template>
