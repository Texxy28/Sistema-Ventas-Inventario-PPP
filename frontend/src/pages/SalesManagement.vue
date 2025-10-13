<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ProductTable from '../components/ProductTable.vue';
import SearchBox from '../components/SearchBox.vue';
import { useProductStore } from '../store/productsStore';
import { computed, onMounted, ref } from 'vue';
import SaleDetails from '../components/SaleDetails.vue';
import { useSaleStore } from '../store/salesStore';
import VoucherModal from '../components/VoucherModal.vue';

const productStore = useProductStore();
const { products, loadingProducts, errorProducts } = storeToRefs(productStore);
const { fetchProducts } = productStore;

const saleStore = useSaleStore();
const { addSale } = saleStore;

const searchQuery = ref('');
const selectedProducts = ref([]);

const showVoucher = ref(false);
const voucherId = ref(null);

const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value;
    return products.value.filter(p =>
        p.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

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
    const saleData = {
        productos: productos,
        total: total,
        id_usuario: 1, // temporal
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
})

</script>

<template>
    <div class="p-6 grid grid-cols-3">
        <div class="col-span-2 p-6">
            <div class=" flex flex-row items-center justify-between">
                <h1 class="text-2xl font-bold mb-4">Gestión de Ventas</h1>
                <SearchBox placeholder="Buscar productos..." @search="handleSearch" />
            </div>
            <div class="flex justify-center">
                <div v-if="loadingProducts">Cargando...</div>
                <ProductTable v-if="products.length && !loadingProducts" :products="filteredProducts" mode="sales"
                    @selection="handleSelection" :selectedProducts="selectedProducts" />
                <div v-if="errorProducts">{{ errorProducts }}</div>
            </div>
        </div>
        <div class="col-span-1 p-6">
            <SaleDetails :selectedProducts="selectedProducts" @clear="handleClear" @finalize="handleFinalize" />
        </div>

        <div>
            <VoucherModal :visible="showVoucher" :comprobante_id="voucherId" @close="showVoucher = false" />
        </div>

    </div>

</template>