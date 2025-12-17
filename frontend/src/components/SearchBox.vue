<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { ref, watch } from 'vue';

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Buscar...'
    },
    delay: {
    type: Number,
    default: 400 
  }
})

const emit = defineEmits(['search']);

const searchQuery = ref('');
let timeout = null;

const search = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        emit('search', searchQuery.value);
    }, props.delay);
};

</script>

<template>
    <div class="flex flex-col md:flex-row gap-2 md:gap-0 items-center">
        <div class="flex items-center border border-[#B0B0AE] rounded-md px-3 py-1 gap-2 mr-4">
            <MagnifyingGlassIcon class="h-4 w-4" />
            <input v-model="searchQuery" :placeholder="placeholder" type="text" class="focus:outline-none" />
        </div>
        <button @click="search" class="bg-[#8B5E3C] text-white px-4 py-2 rounded-md hover:bg-[#C8A785] transition cursor-pointer">Buscar</button>
    </div>
</template>