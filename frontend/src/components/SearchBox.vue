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

watch(searchQuery, (newQuery) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        emit('search', newQuery);
    }, props.delay);
});

</script>

<template>
    <div class="flex items-center border border-[#B0B0AE] rounded-md px-3 py-1 gap-2">
        <MagnifyingGlassIcon class="h-4 w-4"/>
        <input v-model="searchQuery" :placeholder="placeholder" type="text" class="focus:outline-none"/>
    </div>
</template>