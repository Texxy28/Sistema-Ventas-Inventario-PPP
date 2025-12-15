<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

</script>

<template>
    <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg lg:w-[30%] lg:h-[30%] md:w-[40%] md:h-[40%] sm:w-[50%] sm:h-[30%] w-[90%] h-[30%] shadow-xl flex flex-col">
            <div class="flex justify-between items-center p-4 border-b">
                <h2 class="text-lg font-semibold">Error</h2>
                <XMarkIcon @click="closeModal" class="w-8 h-8 cursor-pointer "/>
            </div>
            <div class="flex-1 flex justify-center items-center">
                <h2 class="lg:text-2xl md:text-xl sm:text-lg text-xl font-semibold truncate">{{ error }}</h2>
            </div>
        </div>
    </div>
</template>