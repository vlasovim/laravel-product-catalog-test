<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useCategoryApi} from '@/composables'
import {ElMessage} from "element-plus";
import type {Category} from "@/models";

interface Props {
  size?: 'large' | 'default' | 'small';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default'
});

const model = defineModel<number | null>({
  required: true
});

const {fetchCategories, loading} = useCategoryApi();
const categories = ref<Category[]>([]);

onMounted(async () => {
  try {
    categories.value = await fetchCategories();
  } catch (e) {
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
