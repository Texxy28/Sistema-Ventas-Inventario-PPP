<script setup>
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import SalesTable from '../components/SalesTable.vue';
import { useMovementStore } from '../store/movementsStore';
import MovementsTable from '../components/MovementsTable.vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';


const movementStore = useMovementStore();
const { movements, currentPage, totalPages, loadingMovements, errorMovements } = storeToRefs(movementStore);
const { fetchMovements } = movementStore;

onMounted(async () => {
    await fetchMovements();
})

const nextPage = () => {
    if (currentPage.value >= totalPages.value) return;

    const next = currentPage.value + 1;

    fetchMovements(next);
}

const prevPage = () => {
    if (currentPage.value <= 1) return;

    const prev = currentPage.value - 1;

    fetchMovements(prev);
}

</script>

<template>
    <div>
        <div v-if="loadingMovements" class="w-full h-full flex justify-center items-center">
            <ArrowPathIcon class="w-8 h-8 text-[#2E2B26] animate-spin" />
            <span class="text-[#2E2B26] text-lg">Cargando...</span>
        </div>
        <div v-if="movements.length && !loadingMovements" class="w-full h-full flex justify-center items-center">
            <MovementsTable :movements="movements" :currentPage="currentPage" :totalPages="totalPages"
                @nextPage="nextPage" @prevPage="prevPage" />
        </div>
    </div>
</template>