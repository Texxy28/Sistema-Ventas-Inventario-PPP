<script setup lang="ts">
import { storeToRefs } from 'pinia';
import SearchBox from '../components/SearchBox.vue';
import { useProductStore } from '../store/productsStore';
import { computed, onMounted, ref } from 'vue';
import SaleDetails from '../components/SaleDetails.vue';
import { useSaleStore } from '../store/salesStore';
import VoucherModal from '../components/VoucherModal.vue';
import ProductList from '../components/ProductList.vue';
import { useCategoryStore } from '../store/categoriesStore';
import CategoriesFilter from '../components/CategoriesFilter.vue';
import { useAuthStore } from '../store/authStore';

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const { products, loadingProducts, errorProducts } = storeToRefs(productStore);
const { categories, loadingCategories, errorCategories } = storeToRefs(categoryStore);
const { user } = storeToRefs(authStore);
const { fetchProducts } = productStore;
const { fetchCategories } = categoryStore;
const { fetchUser } = authStore;

const saleStore = useSaleStore();
const { addSale } = saleStore;

const searchQuery = ref('');
const selectedProducts = ref([]);
const selectedCategoryFilter = ref(null);

const showVoucher = ref(false);
const voucherId = ref(null);

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
    selectedCategoryFilter.value =  category ;
}
const handleSearch = (query) => {
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
}

onMounted(async () => {
    await fetchProducts();
    await fetchCategories();
})

</script>

<template>
    <div class="p-6 grid grid-cols-3">
        <div class="col-span-2 p-6">
            <div class=" flex flex-row items-center justify-between">
                <h1 class="text-2xl font-bold mb-4">Gestión de Ventas</h1>
                <SearchBox placeholder="Buscar productos..." @search="handleSearch" />
            </div>
            <div class="flex items-center justify-center">
                <CategoriesFilter :categories="categories" @selection="selectCategoryFilter" :selectedCategory="selectedCategoryFilter" />
            </div>
            <div class="flex-1 overflow-y-auto max-h-[70vh]">
                <div v-if="loadingProducts">Cargando...</div>
                <ProductList v-if="products.length && !loadingProducts" :products="filteredProducts" mode="sales"
                    @selection="handleSelection" :selectedProducts="selectedProducts" />
                <div v-if="errorProducts">{{ errorProducts }}</div>
            </div>
        </div>
        <div class="col-span-1 p-6 h-full">
            <SaleDetails :selectedProducts="selectedProducts" @clear="handleClear" @finalize="handleFinalize" />
        </div>

        <div v-if="showVoucher">
            <VoucherModal :visible="showVoucher" :comprobante_id="voucherId" @close="showVoucher = false" />
        </div>

    </div>

</template>