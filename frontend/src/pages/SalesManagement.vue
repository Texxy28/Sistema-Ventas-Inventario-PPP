<script setup lang="ts">
import { storeToRefs } from 'pinia';
import SearchBox from '../components/SearchBox.vue';
import { useProductStore } from '../store/productsStore';
import { computed, onMounted, ref, watch } from 'vue';
import SaleDetails from '../components/SaleDetails.vue';
import { useSaleStore } from '../store/salesStore';
import VoucherModal from '../components/VoucherModal.vue';
import ProductList from '../components/ProductList.vue';
import { useCategoryStore } from '../store/categoriesStore';
import CategoriesFilter from '../components/CategoriesFilter.vue';
import { useAuthStore } from '../store/authStore';
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon, ClipboardDocumentListIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const { products, currentPage, totalPages, loadingProducts, errorProducts } = storeToRefs(productStore);
const { categories, loadingCategories, errorCategories } = storeToRefs(categoryStore);
const { user } = storeToRefs(authStore);
const { fetchProducts, fetchProductsByCategory, fetchProductsBySearch, fetchProductsBySearchAndCategory } = productStore;
const { fetchCategories } = categoryStore;
const { fetchUser } = authStore;

const saleStore = useSaleStore();
const { addSale } = saleStore;

const searchQuery = ref('');
const selectedProducts = ref([]);
const selectedCategoryFilter = ref(null);

const showVoucher = ref(false);
const voucherId = ref(null);

const openForm = ref(false);

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

const handleSelection = (products) => {
    selectedProducts.value = products;
}

const handleClear = () => {
    selectedProducts.value = [];
}

const handleFinalize = async ({ productos, total }) => {
    await fetchUser();
    const saleData = {
        productos: productos,
        total: total,
        id_usuario: user.value.id_usuario,
        estado: 'completada'
    };
    const data = await addSale(saleData);
    if (data?.comprobante_id) {
        voucherId.value = data.comprobante_id;
        showVoucher.value = true;
    }
    selectedProducts.value = [];
    await fetchProducts();
    openForm.value = false;
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

const toogleForm = () => {
    openForm.value = !openForm.value;
}

onMounted(async () => {
    await fetchProducts();
    await fetchCategories();
})

</script>

<template>
    <div class="p-6 grid grid-cols-3">
        <div class="col-span-3 md:col-span-2 p-6">
            <div class=" flex flex-col md:flex-row items-center justify-between w-full">
                <h1 class="text-2xl font-bold mb-4 mt-4 md:mt-0">Gestión de Ventas</h1>
                <div class="flex flex-row gap-2 justify-between items-center w-full md:w-auto">
                    <ArrowPathIcon class="w-8 h-8 bg-[#ECEAE5] p-1 rounded-md cursor-pointer" @click="reload" />
                    <SearchBox class="self-end" placeholder="Buscar productos..." @search="handleSearch" />
                    <ClipboardDocumentListIcon class="md:hidden w-8 h-8 cursor-pointer" @click="toogleForm" />
                </div>
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
                <div v-if="products.length && !loadingProducts">

                    <div class="flex-1 flex flex-col max-h-[70vh] relative overflow-hidden">
                        <div class="flex-1 overflow-y-auto min-h-[60vh]">
                            <ProductList :products="products" mode="sales" @selection="handleSelection"
                                :selectedProducts="selectedProducts" />
                        </div>
                        <div v-if="errorProducts">{{ errorProducts }}</div>
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
        <div class="hidden md:block col-span-1 p-6 h-full max-h-[85vh]">
            <SaleDetails :selectedProducts="selectedProducts" @clear="handleClear" @finalize="handleFinalize" />
        </div>

        <div v-if="showVoucher">
            <VoucherModal :visible="showVoucher" :comprobante_id="voucherId" @close="showVoucher = false" />
        </div>

        <transition name="slide-fade">
            <div v-if="openForm" class="fixed lg:hidden inset-0 bg-black/50 z-[1000] flex justify-center items-center">
                <div class="relative overflow-y-auto max-w-[80vw]">
                    <SaleDetails :selectedProducts="selectedProducts" @clear="handleClear" @finalize="handleFinalize" />
                    <XMarkIcon @click="toogleForm"
                        class="absolute top-6 right-6 w-8 h-8 cursor-pointer hover:stroke-[#C8A785]" />
                </div>
            </div>
        </transition>

    </div>

</template>