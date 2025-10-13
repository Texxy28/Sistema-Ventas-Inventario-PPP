<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    selectedProducts: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['finalize', 'clear']);

const moneyReceived = ref(0);

const total = computed(() =>
    props.selectedProducts.reduce((acc, p) => acc + parseFloat(p.precio) * (p.cantidad || 1), 0)
);

const change = computed(() => {
    return moneyReceived.value - total.value;
});

const handleFinalize = () => {
    moneyReceived.value = 0;
    emit('finalize', {
        productos: props.selectedProducts,
        total: total.value,
    });
};

</script>

<template>
    <div class="flex flex-col h-full p-4 gap-4">
        <div>
            <h2 class="text-xl font-bold mb-2">Informacion del cliente</h2>
            <input type="text" class="p-2 w-full rounded" placeholder="Nombre" />
        </div>
        <div class="flex flex-col flex-grow gap-4">
            <div class="flex flex-col flex-grow">
                <h1 class="text-lg font-semibold p-2 border-b">Detalles de venta</h1>
                <div class="overflow-y-auto flex-grow max-h-[400px]">
                    <table class="min-w-full border-collapse text-left">
                    <thead class="sticky top-0 bg-white z-10">
                        <tr class="border-b">
                            <th class="p-2">Producto</th>
                            <th class="p-2">Cant.</th>
                            <th class="p-2">Precio</th>
                            <th class="p-2">Subtot.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in selectedProducts" :key="p.id_producto" class="border-b">
                            <td class="p-2">{{ p.nombre }}</td>
                            <td class="p-2"><input type="number" v-model.number="p.cantidad" min="1" class="w-12" /></td>
                            <td class="p-2">{{ Number(p.precio).toFixed(2) }}</td>
                            <td class="p-2">{{ (parseFloat(p.precio) * (p.cantidad || 1)).toFixed(2) }}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
                <div class="flex justify-between font-semibold mt-4">
                    <span>Total:</span>
                    <span>S/ {{ total.toFixed(2) }}</span>
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <div class="">
                    <label class="font-semibold block mb-1">Monto recibido:</label>
                    <input type="number" v-model.number="moneyReceived" class="b order p-2 w-full" />
                    <p class="text-gray-600 mt-1">Vuelto: S/ {{ change.toFixed(2) }}</p>
                </div>

                <div class="flex justify-between">
                    <button @click="emit('clear')" class="bg-gray-300 px-4 py-2 rounded">Limpiar</button>
                    <button @click="handleFinalize" class="bg-black text-white px-4 py-2 rounded">
                        Finalizar Venta
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>