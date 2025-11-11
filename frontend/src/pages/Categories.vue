<script setup>
import { storeToRefs } from 'pinia';
import CategoriesTable from '../components/CategoriesTable.vue';
import { useCategoryStore } from '../store/categoriesStore';
import FormCategories from '../components/FormCategories.vue';
import { onMounted, ref } from 'vue';
import { ArrowPathIcon, ClipboardDocumentListIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const categoryStore = useCategoryStore();
const { categories, loadingCategories, errorCategories } = storeToRefs(categoryStore);
const { fetchCategoriesWithProductCount, addCategory, updateCategory } = categoryStore;

const selectedCategory = ref(null);

const openForm = ref(false);

const selectCategory = async (category) => {
    selectedCategory.value = { ...category };
    openForm.value = true;
}

const saveEdit = async (category) => {
    await updateCategory(category.id_categoria, category);
    selectedCategory.value = null;
    openForm.value = false;
};

const handleAddCategory = async (category) => {
    await addCategory(category);
    openForm.value = false;
}

const toggleForm = () => {
    openForm.value = !openForm.value;
}

onMounted(async () => {
    await fetchCategoriesWithProductCount();
})

</script>

<template>

    <div>
        <div class="p-6 grid grid-cols-3 lg:grid-cols-4">
            <div class="hidden lg:flex justify-center col-span-1">
                <FormCategories :selectedCategory="selectedCategory" @addCategory="handleAddCategory"
                    @editCategory="saveEdit" @cancelEdit="selectedCategory = null" />
            </div>
            <div class="col-span-3">
                <div class="flex flex-row justify-end items-center">
                    <ClipboardDocumentListIcon class="lg:hidden w-8 h-8 cursor-pointer" @click="toggleForm" />
                </div>
                <div class="flex-1 overflow-y-auto max-h-[80vh]">
                    <div v-if="loadingCategories">
                        <div class="h-[80vh] w-full flex gap-2 items-center justify-center">
                            <ArrowPathIcon class="w-8 h-8 text-[#2E2B26] animate-spin" />
                            <span class="text-[#2E2B26] text-lg">Cargando...</span>
                        </div>
                    </div>
                    <CategoriesTable v-if="categories.length && !loadingCategories" :categories="categories"
                        @edit="selectCategory" />
                    <div v-if="errorCategories">{{ errorCategories }}</div>
                </div>
            </div>
        </div>

        <transition name="slide-fade">
            <div v-if="openForm" class="fixed lg:hidden inset-0 bg-black/50 z-[1000] flex justify-center items-center">
                <div class="relative overflow-y-auto">
                    <FormCategories :selectedCategory="selectedCategory" @addCategory="handleAddCategory"
                        @editCategory="saveEdit" @cancelEdit="selectedCategory = null" />
                    <XMarkIcon @click="toggleForm"
                        class="absolute top-6 right-6 w-8 h-8 cursor-pointer hover:stroke-[#C8A785]" />
                </div>
            </div>
        </transition>
    </div>

</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>