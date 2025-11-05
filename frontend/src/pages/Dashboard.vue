<script setup>
import { ref } from 'vue';
import SalesReports from '../components/SalesReports.vue';
import InventoryReports from '../components/InventoryReports.vue';


const dashboardOption = [
    {
        title: 'Ventas'
    },
    {
        title: 'Inventario'
    }
]

const selectedOption = ref(dashboardOption[0]);

const handleSelection = (option) => {
    selectedOption.value = option;
}

</script>

<template>
    <div class="p-6">
        <h1 class="font-semibold text-2xl">Reportes</h1>
        <div class="pt-4 flex gap-1">
            <div v-for="(option, index) in dashboardOption" :key="index" @click="handleSelection(option)"
                :class="[
                    'rounded-t-md p-4 cursor-pointer',
                    selectedOption.title === option.title ? 'bg-[#ECEAE5]' : 'bg-[#B0B0AE]/60'
                ]">
                <h2>{{ option.title }}</h2>
            </div>
        </div>
        <div class="bg-[#ECEAE5] h-[75vh] rounded-tl-none rounded-2xl p-6 overflow-auto scrollbar-thin scrollbar-thumb-[#B0B0AE]/40 scrollbar-track-[#F7F5F0]">
            <SalesReports v-if="selectedOption.title === 'Ventas'" />
            <InventoryReports v-if="selectedOption.title === 'Inventario'" />
        </div>
    </div>
</template>