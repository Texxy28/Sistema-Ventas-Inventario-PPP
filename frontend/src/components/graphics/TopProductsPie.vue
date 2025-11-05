<script setup>
import { Pie } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(Tooltip, Legend, ArcElement, CategoryScale)

const props = defineProps({
    chartData: {
        type: Array,
        required: true
    }
})

const chartData = computed(() => {
    const labels = props.chartData.map(p => p.nombre)
    const values = props.chartData.map(p => p.total_sold)

    return {
        labels,
        datasets: [
            {
                label: 'Cantidad vendida',
                data: values,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#E7E9ED',
                    '#8B5E3C',
                    '#C8A785',
                    '#F7F5F0'
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
    <Pie :data="chartData" :options="chartOptions" />
</template>
