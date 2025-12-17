<script setup>
import { storeToRefs } from 'pinia';
import { useProductStore } from '../store/productsStore';
import { computed, onMounted, ref, watch } from 'vue';
import { useCategoryStore } from '../store/categoriesStore';
import FormProducts from '../components/FormProducts.vue';
import SearchBox from '../components/SearchBox.vue';
import ProductList from '../components/ProductList.vue';
import CategoriesFilter from '../components/CategoriesFilter.vue';
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon, ClipboardDocumentListIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useSupplierStore } from '../store/suppliersStore';
import ErrorModal from '../components/ErrorModal.vue';
import { useAuthStore } from '../store/authStore';

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const supplierStore = useSupplierStore();
const { products, currentPage, totalPages, loadingProducts, errorProducts } = storeToRefs(productStore);
const { categories, loadingCategories, errorCategories } = storeToRefs(categoryStore);
const { suppliers, loadingSuppliers, errorSuppliers } = storeToRefs(supplierStore);
const { fetchProducts, fetchProductsByCategory, fetchProductsBySearch, fetchProductsBySearchAndCategory, updateProduct, addProduct } = productStore;
const { fetchCategories } = categoryStore;
const { fetchSuppliers } = supplierStore;

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const { fetchUser } = authStore;

const selectedProduct = ref(null);
const selectedCategoryFilter = ref(null);
const searchQuery = ref(null);

const openForm = ref(false);

const selectProduct = async (product) => {
    selectedProduct.value = { ...product };
    openForm.value = true;
}

const saveEdit = async (product) => {
    const updateData = { ...product, usuario_responsable: user.value.id_usuario };
     await updateProduct(product.id_producto, updateData);  
    selectedProduct.value = null;
    openForm.value = false;
};

const handleAddProduct = async (product) => {
    await addProduct(product);
    openForm.value = false;
}

const selectCategoryFilter = async (category) => {
    selectedCategoryFilter.value = category;
}

const handleSearch = (query) => {
    if (!selectedCategoryFilter.value) {
        fetchProductsBySearch(query);
    } else {
        fetchProductsBySearchAndCategory(query, selectedCategoryFilter.value.id_categoria);
    }
    searchQuery.value = query;
}

const toogleForm = () => {
    openForm.value = !openForm.value;
}

const nextPage = () => {
    if (currentPage.value >= totalPages.value) return;

    const next = currentPage.value + 1;

    if (!searchQuery.value) {
        if (!selectedCategoryFilter.value) {
            fetchProducts(next);
        } else {
            fetchProductsByCategory(
                selectedCategoryFilter.value.id_categoria,
                next
            );
        }
    } else {
        if (!selectedCategoryFilter.value) {
            fetchProductsBySearch(searchQuery.value, next);
        } else {
            fetchProductsBySearchAndCategory(searchQuery.value, selectedCategoryFilter.value.id_categoria, next);
        }
    }
}

const prevPage = () => {
    if (currentPage.value <= 1) return;

    const prev = currentPage.value - 1;

    if (!searchQuery.value) {
        if (!selectedCategoryFilter.value) {
            fetchProducts(prev);
        } else {
            fetchProductsByCategory(
                selectedCategoryFilter.value.id_categoria,
                prev
            );
        }
    } else {
        if (!selectedCategoryFilter.value) {
            fetchProductsBySearch(searchQuery.value, prev);
        } else {
            fetchProductsBySearchAndCategory(searchQuery.value, selectedCategoryFilter.value.id_categoria, prev);
        }
    }
}

watch(selectedCategoryFilter, async (newValue) => {
    if (!newValue) {
        await fetchProducts();
        return;
    }
    await fetchProductsByCategory(newValue.id_categoria)
})

const reload = async () => {
    const page = currentPage.value;

    if (!selectedCategoryFilter.value) {
        await fetchProducts(page);
    } else {
        await fetchProductsByCategory(
            selectedCategoryFilter.value.id_categoria,
            page
        );
    }

    if (products.value.length === 0 && page > 1) {
        if (!selectedCategoryFilter.value) {
            fetchProducts(1);
        } else {
            fetchProductsByCategory(
                selectedCategoryFilter.value.id_categoria,
                1
            );
        }
    }

    searchQuery.value = null;
    await fetchCategories();
}

onMounted(async () => {
    await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchSuppliers()
    ]);
    if (!user) {
        await fetchUser();
    }
})

</script>

<template>
    <div>
        <div class="p-6 grid grid-cols-3 lg:grid-cols-4">
            <div class="hidden lg:flex justify-center col-span-1 max-h-[80vh]">
                <FormProducts :selectedProduct="selectedProduct" :loadingCategories="loadingCategories"
                    :errorCategories="errorCategories" :categories="categories" :loadingSuppliers="loadingSuppliers"
                    :errorSuppliers="errorSuppliers" :suppliers="suppliers" @addProduct="handleAddProduct"
                    @editProduct="saveEdit" @cancelEdit="selectedProduct = null" />
            </div>
            <div class="col-span-3 mt-4">
                <div class="flex flex-row gap-2 justify-between items-center">
                    <ArrowPathIcon class="w-8 h-8 bg-[#ECEAE5] p-1 rounded-md cursor-pointer" @click="reload" />
                    <SearchBox class="self-end" placeholder="Buscar productos..." @search="handleSearch" />
                    <ClipboardDocumentListIcon class="lg:hidden w-8 h-8 cursor-pointer" @click="toogleForm" />
                </div>
                <div v-if="errorProducts" class="">
                    <ErrorModal :visible=!!errorProducts :error="errorProducts" @close="errorProducts = null" />
                </div>
                <div>
                    <div v-if="categories.length && !loadingCategories" class="flex items-center justify-center">
                        <CategoriesFilter :categories="categories" @selection="selectCategoryFilter"
                            :selectedCategory="selectedCategoryFilter" />
                    </div>
                    <div v-if="loadingProducts">
                        <div class="h-[80vh] w-full flex gap-2 items-center justify-center">
                            <ArrowPathIcon class="w-8 h-8 text-[#2E2B26] animate-spin" />
                            <span class="text-[#2E2B26] text-lg">Cargando...</span>
                        </div>
                    </div>
                    <div class="h-[80vh]" v-if="products.length && !loadingProducts">
                        <div>
                            <div class="flex-1 flex flex-col max-h-[70vh] relative overflow-hidden">
                                <div class="flex-1 overflow-y-auto min-h-[60vh]">
                                    <ProductList :products="products" @edit="selectProduct" :mode="user?.rol" />
                                </div>
                                <div class="w-full flex justify-center items-center sticky bottom-0 gap-4 py-4">
                                    <div>
                                        <ChevronLeftIcon class="h-8 w-8 cursor-pointer" @click="prevPage" />
                                    </div>
                                    <div>
                                        <span>Página {{ currentPage }} de {{ totalPages }}</span>
                                    </div>
                                    <div>
                                        <ChevronRightIcon class="h-8 w-8 cursor-pointer" @click="nextPage" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <transition name="slide-fade">
            <div v-if="openForm" class="fixed lg:hidden inset-0 bg-black/50 z-[1000] flex justify-center items-center">
                <div class="relative overflow-y-auto">
                    <FormProducts :selectedProduct="selectedProduct" :loadingCategories="loadingCategories"
                        :errorCategories="errorCategories" :categories="categories" :loadingSuppliers="loadingSuppliers"
                        :errorSuppliers="errorSuppliers" :suppliers="suppliers" @addProduct="handleAddProduct"
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