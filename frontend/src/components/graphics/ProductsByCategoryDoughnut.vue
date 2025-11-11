<script setup>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { computed } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
    chartData: {
        type: Array,
        required: true
    }
})

const chartData = computed(() => {
    const labels = props.chartData.map(p => p.categoria)
    const values = props.chartData.map(p => p.total_stock)

    return {
        labels,
        datasets: [
            {
                label: 'Productos vendidos',
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
    <Doughnut :data="chartData" :options="chartOptions" />
</template>