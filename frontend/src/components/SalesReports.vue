<script setup>
import { onMounted, ref, watch } from 'vue';
import { useSalesReportStore } from '../store/salesReportStore';
import { storeToRefs } from 'pinia';
import { CurrencyDollarIcon } from '@heroicons/vue/24/outline';
import { PresentationChartLineIcon } from '@heroicons/vue/24/outline';
import TopProductsPie from './graphics/TopProductsPie.vue';
import SalesByCategoryDoughnut from './graphics/SalesByCategoryDoughnut.vue';
import SalesByUserBar from './graphics/SalesByUserBar.vue';

const salesReportStore = useSalesReportStore();
const { salesByDateRange, salesCountByDateRange, topProductsByDateRange, averageSalesByDateRange, salesByCategoryByDateRange, salesByUserByDateRange, loadingSalesReport, errorSalesReport } = storeToRefs(salesReportStore);
const { fetchSalesByDateRange, fetchSalesCountByDateRange, fetchTopProductsByDateRange, fetchAverageSalesByDateRange, fetchSalesByCategoryByDateRange, fetchSalesByUserByDateRange } = salesReportStore;

const options = [
    {
        title: 'Hoy',
        days: '1'
    },
    {
        title: 'Últimos 7 días',
        days: '7'
    },
    {
        title: 'Últimnos 30 días',
        days: '30'
    }
]

const selectedOption = ref(options[0])

watch(selectedOption, async (newOption) => {
    await Promise.all([
        fetchSalesByDateRange(newOption.days),
        fetchSalesCountByDateRange(newOption.days),
        fetchTopProductsByDateRange(newOption.days),
        fetchAverageSalesByDateRange(newOption.days),
        fetchSalesByCategoryByDateRange(newOption.days),
        fetchSalesByUserByDateRange(newOption.days)
    ])
})

onMounted(async () => {
    await Promise.all([
        fetchSalesByDateRange(selectedOption.value.days),
        fetchSalesCountByDateRange(selectedOption.value.days),
        fetchTopProductsByDateRange(selectedOption.value.days),
        fetchAverageSalesByDateRange(selectedOption.value.days),
        fetchSalesByCategoryByDateRange(selectedOption.value.days),
        fetchSalesByUserByDateRange(selectedOption.value.days)
    ])
})

</script>

<template>
    <div>
        <div>
            <select v-model="selectedOption" class="shadow-md focus:outline-none px-2 py-1 rounded bg-[#F7F5F0]">
                <option v-for="(option, index) in options" :key="index" :value="option">{{ option.title }}</option>
            </select>
        </div>
        <div v-if="loadingSalesReport">
            Cargando...
        </div>
        <div v-if="errorSalesReport">
            {{ errorSalesReport }}
        </div>
        <div
            v-if="salesByDateRange && salesCountByDateRange && averageSalesByDateRange && topProductsByDateRange && salesByCategoryByDateRange && salesByUserByDateRange && !loadingSalesReport">
            <div class="mt-4 flex gap-2">
                <div class="bg-[#F7F5F0] p-4 rounded-lg shadow-md flex items-center gap-3 w-70">
                    <CurrencyDollarIcon class="h-10 w-10 bg-green-200 text-green-500 p-1 rounded-lg" />
                    <div class="flex flex-col">
                        <span class="font-extralight">Ventas totales</span>
                        <span class="font-semibold text-lg">S/. {{ salesByDateRange.total_sales }}</span>
                    </div>
                </div>
                <div class="bg-[#F7F5F0] p-4 rounded-lg shadow-md flex items-center gap-3 w-70">
                    <PresentationChartLineIcon class="h-10 w-10 bg-red-200 text-red-500 p-1 rounded-lg" />
                    <div class="flex flex-col">
                        <span class="font-extralight">Cantidad de ventas</span>
                        <span class="font-semibold text-lg">{{ salesCountByDateRange.sales_count }}</span>
                    </div>
                </div>
                <div class="bg-[#F7F5F0] p-4 rounded-lg shadow-md flex items-center gap-3 w-70">
                    <PresentationChartLineIcon class="h-10 w-10 bg-red-200 text-red-500 p-1 rounded-lg" />
                    <div class="flex flex-col">
                        <span class="font-extralight">Promedio de ventas</span>
                        <span class="font-semibold text-lg">{{ averageSalesByDateRange.average_sales }}</span>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-2">
                <section class="col-span-1 p-4 flex items-center justify-center w-full min-h-80">
                    <TopProductsPie :chartData="topProductsByDateRange" />
                </section>
                <section class="col-span-1 p-4 flex items-center justify-center w-full min-h-80">
                    <SalesByCategoryDoughnut :chartData="salesByCategoryByDateRange" />
                </section>
                <section class="col-span-1 p-4 flex items-center justify-center w-full min-h-80">
                    <SalesByUserBar :chartData="salesByUserByDateRange" />
                </section>
            </div>
        </div>
    </div>
</template>