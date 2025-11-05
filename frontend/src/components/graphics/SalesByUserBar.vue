<script setup>
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
    chartData: {
        type: Array,
        required: true
    }
})

const chartData = computed(() => {
    const labels = props.chartData.map(p => p.vendedor)
    const valuesCount = props.chartData.map(p => p.sales_count)
    const valuesSales = props.chartData.map(p => p.sales_total)

    return {
        labels,
        datasets: [
            {
                label: 'Cantidad vendida',
                data: valuesCount,
                backgroundColor: [
                    '#36A2EB'
                ]
            },
            {
                label: 'Total vendido',
                data: valuesSales,
                backgroundColor: [
                    '#FF6384'
                ]
            }
        ]
    }
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right'
        }
    },
    scales: {
    y: { beginAtZero: true }
  }
}
</script>

<template>
    <Bar :data="chartData" :options="chartOptions" />
</template>
