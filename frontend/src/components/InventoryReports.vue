<script setup>
import { onMounted, ref, watch } from 'vue';
import { useInventoryReportStore } from '../store/inventoryReportStore';
import { storeToRefs } from 'pinia';
import BottomProductsPie from './graphics/BottomProductsPie.vue';
import { ArrowPathIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline';
import ProductsByCategoryDoughnut from './graphics/ProductsByCategoryDoughnut.vue';

const inventoryReportStore = useInventoryReportStore();
const { productsLowStock, bottomProductsByDateRange, productsNoMovementByDateRange, inventoryValue, productsSoldByCategory, loadingInventoryReport, errorInventoryReport } = storeToRefs(inventoryReportStore);
const { fetchProductsLowStockByDateRange, fetchBottomProductsByDateRange, fetchProductsNoMovementByDateRange, fetchInventoryValue, fetchProductsSoldByCategoryByDateRange } = inventoryReportStore;

const options = [
    {
        title: 'Hoy',
        days: '0'
    },
    {
        title: 'Últimos 7 días',
        days: '7'
    },
    {
        title: 'Últimos 30 días',
        days: '30'
    }
]

const selectedOption = ref(options[0]);

watch(selectedOption, async (newOption) => {
    await Promise.all([
        fetchProductsLowStockByDateRange(newOption.days),
        fetchBottomProductsByDateRange(newOption.days),
        fetchProductsNoMovementByDateRange(newOption.days),
        fetchProductsSoldByCategoryByDateRange(newOption.days)
    ])
})

onMounted(async () => {
    await Promise.all([
        fetchProductsLowStockByDateRange(selectedOption.value.days),
        fetchBottomProductsByDateRange(selectedOption.value.days),
        fetchProductsNoMovementByDateRange(selectedOption.value.days),
        fetchInventoryValue(),
        fetchProductsSoldByCategoryByDateRange(selectedOption.value.days)
    ])
})
</script>

<template>
    <div class="h-full">
        <div>
            <select v-model="selectedOption" class="shadow-md focus:outline-none px-2 py-1 rounded bg-[#F7F5F0]">
                <option v-for="(option, index) in options" :key="index" :value="option">{{ option.title }}</option>
            </select>
        </div>
        <div class="h-full" v-if="loadingInventoryReport">
            <div class="h-full w-full flex gap-2 items-center justify-center">
                <ArrowPathIcon class="w-8 h-8 text-[#2E2B26] animate-spin" />
                <span class="text-[#2E2B26] text-lg">Cargando...</span>
            </div>
        </div>
        <div v-if="errorInventoryReport">
            {{ errorInventoryReport }}
        </div>
        <div v-if="productsLowStock && bottomProductsByDateRange && productsNoMovementByDateRange && inventoryValue && productsSoldByCategory && !loadingInventoryReport">
            <div class="mt-4 flex gap-2">
                <div class="bg-[#F7F5F0] p-4 w-96 rounded-2xl shadow-md">
                    <h1 class="font-semibold text-lg">Productos con bajo stock</h1>
                    <div class="min-h-40 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-[#B0B0AE]/40 scrollbar-track-[#F7F5F0]">
                        <section v-for="(product, index) in productsLowStock" :key="index"
                            class="my-2 bg-[#ECEAE5] rounded-md shadow-md flex p-5 gap-2 justify-between">
                            <h1 class="font-bold">{{ product.codigo }}</h1>
                            <span>{{ product.nombre }}</span>
                            <span v-if="product.stock <= product.punto_reorden" class="font-bold text-yellow-500">Bajo
                                stock</span>
                            <span v-if="product.stock = 0" class="font-bold text-red-500">Sin stock</span>
                        </section>
                    </div>
                </div>
                <div class="bg-[#F7F5F0] p-4 w-96 rounded-2xl shadow-md">
                    <h1 class="font-semibold text-lg">Productos sin movimiento</h1>
                    <div class="min-h-40 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-[#B0B0AE]/40 scrollbar-track-[#F7F5F0]">
                        <section v-for="(product, index) in productsNoMovementByDateRange" :key="index"
                            class="my-2 bg-[#ECEAE5] rounded-md shadow-md flex p-5">
                            <span>{{ product.nombre }}</span>
                        </section>
                    </div>
                </div>
                <div class="bg-[#F7F5F0] p-4 rounded-lg shadow-md flex items-center gap-3 w-70 h-20">
                    <CurrencyDollarIcon class="h-10 w-10 bg-green-200 text-green-500 p-1 rounded-lg" />
                    <div class="flex flex-col">
                        <span class="font-extralight">Valor total del inventario</span>
                        <span class="font-semibold text-lg">S/. {{ inventoryValue.valor_total_inventario }}</span>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-2">
                <section class="col-span-1 p-4 my-4 flex flex-col items-center justify-center w-full min-h-80 max-h-80">
                    <h1 class="font-semibold text-xl">Productos menos vendidos</h1>
                    <BottomProductsPie :chartData="bottomProductsByDateRange" />
                </section>
                 <section class="col-span-1 p-4 my-4 flex flex-col items-center justify-center w-full min-h-80 max-h-80">
                    <h1 class="font-semibold text-xl">Productos vendidos por categoría</h1>
                    <ProductsByCategoryDoughnut :chartData="productsSoldByCategory" />
                </section>
            </div>
        </div>
    </div>
</template>