<script setup>
import { storeToRefs } from 'pinia';
import { useProductStore } from '../store/productsStore';
import { computed, onMounted, ref } from 'vue';
import { useCategoryStore } from '../store/categoriesStore';
import FormProducts from '../components/FormProducts.vue';
import SearchBox from '../components/SearchBox.vue';
import ProductList from '../components/ProductList.vue';
import CategoriesFilter from '../components/CategoriesFilter.vue';
import { ClipboardDocumentListIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const { products, loadingProducts, errorProducts } = storeToRefs(productStore);
const { categories, loadingCategories, errorCategories } = storeToRefs(categoryStore);
const { fetchProducts, updateProduct, addProduct } = productStore;
const { fetchCategories } = categoryStore;

const selectedProduct = ref(null);
const selectedCategoryFilter = ref(null);
const searchQuery = ref('');

const openForm = ref(false);

const selectProduct = async (product) => {
    selectedProduct.value = { ...product };
    openForm.value = true;
}

const saveEdit = async (product) => {
    await updateProduct(product.id_producto, product);
    selectedProduct.value = null;
    openForm.value = false;
};

const handleAddProduct = async (product) => {
    await addProduct(product);
    openForm.value = false;
}

const filteredProducts = computed(() => {
    return products.value.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesCategory = selectedCategoryFilter.value
            ? p.id_categoria === selectedCategoryFilter.value.id_categoria
            : true;
        return matchesSearch && matchesCategory;
    });
});

const selectCategoryFilter = async (category) => {
    selectedCategoryFilter.value = category;
}

const handleSearch = (query) => {
    searchQuery.value = query;
}

const toogleForm = () => {
    openForm.value = !openForm.value;
}

onMounted(async () => {
    await fetchProducts();
    await fetchCategories();
})

</script>

<template>
    <div>
        <div class="p-6 grid grid-cols-3 lg:grid-cols-4">
            <div class="hidden lg:flex justify-center col-span-1">
                <FormProducts :selectedProduct="selectedProduct" :loadingCategories="loadingCategories"
                    :errorCategories="errorCategories" :categories="categories" @addProduct="handleAddProduct"
                    @editProduct="saveEdit" @cancelEdit="selectedProduct = null" />
            </div>
            <div class="col-span-3">
                <div class="flex flex-row justify-between items-center">
                    <SearchBox class="self-end" placeholder="Buscar productos..." @search="handleSearch" />
                    <ClipboardDocumentListIcon class="lg:hidden w-8 h-8 cursor-pointer" @click="toogleForm" />
                </div>
                <div class="flex items-center justify-center">
                    <CategoriesFilter :categories="categories" @selection="selectCategoryFilter"
                        :selectedCategory="selectedCategoryFilter" />
                </div>
                <div class="flex-1 overflow-y-auto max-h-[80vh]">
                    <div v-if="loadingProducts">Cargando...</div>
                    <ProductList v-if="products.length && !loadingProducts" :products="filteredProducts"
                        @edit="selectProduct" mode="admin" />
                    <div v-if="errorProducts">{{ errorProducts }}</div>
                </div>
            </div>
        </div>

        <transition name="slide-fade">
            <div v-if="openForm" class="fixed lg:hidden inset-0 bg-black/50 z-[1000] flex justify-center items-center">
                <div class="relative overflow-y-auto">
                    <FormProducts :selectedProduct="selectedProduct" :loadingCategories="loadingCategories"
                        :errorCategories="errorCategories" :categories="categories" @addProduct="handleAddProduct"
                        @editProduct="saveEdit" @cancelEdit="selectedProduct = null" />
                    <XMarkIcon @click="toogleForm"
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