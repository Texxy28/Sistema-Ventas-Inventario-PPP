<script setup>

import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { categoryStyles } from "../utils/iconsAndColorsMap"

const props = defineProps({
    product: Object,
    mode: String,
    selected: Boolean,
});

const emit = defineEmits(['edit', 'delete', 'select']);

</script>

<template>

    <div class="w-full h-48 border rounded-lg flex flex-row relative" :style="{
        borderColor: categoryStyles[product.categoria].color
    }">

        <div class="h-full min-w-2 w-2 rounded-l-xl" :style="{
            backgroundColor: categoryStyles[product.categoria].color
        }"></div>

        <div class="flex flex-col py-4 px-4 gap-2 pr-11">
            <div class="overflow-auto scrollbar-thin scrollbar-thumb-[#B0B0AE]/40 scrollbar-track-[#F7F5F0]">

                <p class="font-semibold text-xl">{{ product.nombre }}</p>
                <p v-if="product.autor" class="font-light">{{ product.autor }}</p>
                <p>{{ product.descripcion }}</p>
                <p class="font-black">S/. {{ product.precio }}</p>
                <p class="font-black">Stock: {{ product.stock }}</p>

            </div>
            <div v-if="mode === 'admin'">
                <PencilSquareIcon @click="emit('edit', product)"
                    class="h-8 w-8 cursor-pointer absolute right-2 top-2" />
            </div>
            <div v-if="mode === 'admin'">
                <TrashIcon @click="emit('delete', product.id_producto)"
                    class="h-8 w-8 cursor-pointer absolute right-2 bottom-2" />
            </div>
            <div v-else>
                <input type="checkbox" @change="emit('select', $event.target.checked)" :checked="selected"
                    class="absolute bottom-2 right-2 w-5 h-5" />
            </div>
        </div>

    </div>

</template>