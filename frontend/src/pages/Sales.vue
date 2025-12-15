<script setup>
import { storeToRefs } from 'pinia';
import { useSaleStore } from '../store/salesStore';
import { onMounted } from 'vue';
import SalesTable from '../components/SalesTable.vue';


const salesStore = useSaleStore();
const { sales, currentPage, totalPages, loadingSales, errorSales } = storeToRefs(salesStore);
const { fetchSales } = salesStore;

onMounted(async () => {
    await fetchSales();
})

</script>

<template>
    <div>
        <div v-if="loadingSales">
            Cargando...
        </div>
        <div v-if="sales.length && !loadingSales" class="w-full h-full flex justify-center items-center">
            <SalesTable :sales="sales" />
        </div>
    </div>
</template>