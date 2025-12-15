<script setup>
import { ref } from 'vue';
import VoucherModal from './VoucherModal.vue';


const props = defineProps({
    sales: {
        type: Object,
        required: true
    }
})

const showVoucher = ref(false);
const voucherId = ref(null);

const generateVoucher = (comprobante_id) => {
    voucherId.value = comprobante_id;
    showVoucher.value = true;
}

</script>

<template>
    <div class="w-[80%] h-[90%] overflow-y-auto">
        <table class="hidden md:table min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <thead class="bg-[#2E2B26] border-b border-gray-300">
                <tr>
                    <th class="px-4 py-2 text-left font-semibold text-white">Fecha</th>
                    <th class="px-4 py-2 text-left font-semibold text-white">Usuario</th>
                    <th class="px-4 py-2 text-left font-semibold text-white">Total</th>
                    <th class="px-4 py-2 text-left font-semibold text-white">Estado</th>
                    <th class="px-4 py-2 text-left font-semibold text-white">Cargar comprobante</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="sale in sales" :key="sale.id_venta" class="border-b hover:bg-gray-50 transition">
                    <td class="px-4 py-2">{{ sale.fecha }}</td>
                    <td class="px-4 py-2">{{ sale.vendedor }}</td>
                    <td class="px-4 py-2 font-medium">{{ sale.total }}</td>
                    <td class="px-4 py-2">
                        <span class="px-2 py-1 rounded text-sm font-medium">
                            {{ sale.estado }}
                        </span>
                    </td>
                    <td class="px-4 py-2">
                        <button @click="generateVoucher(sale.id_comprobante)"
                            class="px-3 py-1 bg-[#8B5E3C] text-white rounded cursor-pointer shadow-sm">
                            Generar
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="md:hidden space-y-4">
            <div v-for="sale in sales" :key="sale.id_venta" class="rounded-lg p-4 inset-shadow-sm bg-F7F5F0">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Fecha</span>
                    <span>{{ sale.fecha }}</span>
                </div>

                <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Usuario</span>
                    <span>{{ sale.vendedor }}</span>
                </div>

                <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Total</span>
                    <span class="font-medium">{{ sale.total }}</span>
                </div>

                <div class="flex justify-between text-sm mt-1">
                    <span class="text-gray-500">Estado</span>
                    <span class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                        {{ sale.estado }}
                    </span>
                </div>

                <button @click="generateVoucher(sale.id_comprobante)"
                    class="mt-3 w-full px-3 py-2 bg-[#8B5E3C] text-white rounded hover:bg-[#744A2E] transition">
                    Generar comprobante
                </button>
            </div>
        </div>

        <div v-if="showVoucher">
            <VoucherModal :visible="showVoucher" :comprobante_id="voucherId" @close="showVoucher = false" />
        </div>

    </div>

</template>