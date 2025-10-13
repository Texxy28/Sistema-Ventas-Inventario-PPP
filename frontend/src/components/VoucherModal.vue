<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';


const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    comprobante_id: {
        type: [Number, null],
        default: null
    }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

</script>

<template>
    <div v-if="visible && comprobante_id" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-[90%] h-[90%] shadow-xl flex flex-col">
            <div class="flex justify-between items-center p-4 border-b">
                <h2 class="text-lg font-semibold">Comprobante de Venta</h2>
                <XMarkIcon @click="closeModal" class="w-8 h-8 cursor-pointer"/>
            </div>
            <iframe :src="`http://localhost:5000/api/voucher/pdf/${comprobante_id}`" class="flex-1 w-full"></iframe>
        </div>
    </div>
</template>