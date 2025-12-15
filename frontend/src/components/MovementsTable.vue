<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';


const props = defineProps({
    movements: {
        type: Object,
        required: true
    },
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    }
})

</script>

<template>
    <div class="w-[80%] h-[80%]">
        <div class="max-h-full overflow-y-auto">
            <table
                class="hidden md:table min-w-full max-h-[70vh] border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <thead class="bg-[#2E2B26] border-b border-gray-300">
                    <tr>
                        <th class="px-4 py-2 text-left font-semibold text-white">Producto</th>
                        <th class="px-4 py-2 text-left font-semibold text-white">Usuario</th>
                        <th class="px-4 py-2 text-left font-semibold text-white">Cantidad</th>
                        <th class="px-4 py-2 text-left font-semibold text-white">Fecha</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="movement in movements" :key="movement.id_venta"
                        class="border-b hover:bg-gray-50 transition">
                        <td class="px-4 py-2">{{ movement.producto }}</td>
                        <td class="px-4 py-2">{{ movement.vendedor }}</td>
                        <td class="px-4 py-2 font-medium">{{ movement.cantidad }}</td>
                        <td class="px-4 py-2">{{ movement.fecha_movimiento }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="md:hidden space-y-4">
            <div v-for="movement in movements" :key="movement.id_venta"
                class="rounded-lg p-4 inset-shadow-sm bg-F7F5F0">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Producto</span>
                    <span>{{ movement.producto }}</span>
                </div>

                <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Usuario</span>
                    <span>{{ movement.vendedor }}</span>
                </div>

                <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Cantidad</span>
                    <span class="font-medium">{{ movement.cantidad }}</span>
                </div>

                <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Fecha</span>
                    <span class="font-medium">
                        {{ movement.fecha_movimiento }}
                    </span>
                </div>
            </div>
        </div>

        <div class="w-full flex justify-center items-center sticky bottom-0 gap-4 py-4">
            <div>
                <ChevronLeftIcon class="h-8 w-8 cursor-pointer" @click="$emit('prevPage')" />
            </div>
            <div>
                <span>Página {{ currentPage }} de {{ totalPages }}</span>
            </div>
            <div>
                <ChevronRightIcon class="h-8 w-8 cursor-pointer" @click="$emit('nextPage')" />
            </div>
        </div>

    </div>

</template>