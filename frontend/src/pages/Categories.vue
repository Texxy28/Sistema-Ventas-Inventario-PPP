<script setup>
import { storeToRefs } from 'pinia';
import CategoriesTable from '../components/CategoriesTable.vue';
import { useCategoryStore } from '../store/categoriesStore';
import FormCategories from '../components/FormCategories.vue';
import { onMounted, ref } from 'vue';

const categoryStore = useCategoryStore();
const { categories, loadingCategories, errorCategories } = storeToRefs(categoryStore);
const { fetchCategoriesWithProductCount, addCategory, updateCategory } = categoryStore;

const selectedCategory = ref(null);

const selectCategory = async (category) => {
    selectedCategory.value = { ...category };
}

const saveEdit = async (category) => {
    await updateCategory(category.id_categoria, category);
    selectedCategory.value = null;
};

const handleAddCategory = async (category) => {
    await addCategory(category);
} 

onMounted(async () => {
    await fetchCategoriesWithProductCount();
})

</script>

<template>

    <div class="m-6 grid grid-cols-4">
        <div class="flex justify-center items-center col-span-1">
            <FormCategories :selectedCategory="selectedCategory" @addCategory="handleAddCategory" @editCategory="saveEdit" @cancelEdit="selectedCategory = null" />
        </div>
        <div class="flex justify-center col-span-3">
            <div v-if="loadingCategories">Cargando...</div>
            <CategoriesTable v-if="categories.length && !loadingCategories" :categories="categories" @edit="selectCategory"/>
        </div>
        <div v-if="errorCategories">{{ errorCategories }}</div>
    </div>

</template>