<script setup>
import { storeToRefs } from 'pinia';
import { useSaleStore } from '../store/salesStore';
import { onMounted } from 'vue';
import SalesTable from '../components/SalesTable.vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';


const salesStore = useSaleStore();
const { sales, currentPage, totalPages, loadingSales, errorSales } = storeToRefs(salesStore);
const { fetchSales } = salesStore;

onMounted(async () => {
    await fetchSales();
})

const nextPage = () => {
    if (currentPage.value >= totalPages.value) return;

    const next = currentPage.value + 1;

    fetchSales(next);
}

const prevPage = () => {
    if (currentPage.value <= 1) return;

    const prev = currentPage.value - 1;

    fetchSales(prev);
}

</script>

<template>
    <div>
        <div v-if="loadingSales" class="w-full h-full flex justify-center items-center">
            <ArrowPathIcon class="w-8 h-8 text-[#2E2B26] animate-spin" />
            <span class="text-[#2E2B26] text-lg">Cargando...</span>
        </div>
        <div v-if="sales.length && !loadingSales" class="w-full h-full flex justify-center items-center">
            <SalesTable :sales="sales" :currentPage="currentPage" :totalPages="totalPages"
                @nextPage="nextPage" @prevPage="prevPage"/>
        </div>
    </div>
</template>