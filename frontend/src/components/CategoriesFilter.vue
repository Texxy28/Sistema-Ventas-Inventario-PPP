<script setup>

import { categoryStyles } from "../utils/iconsAndColorsMap"

const props = defineProps({
    categories: Object,
    selectedCategory: Object
})

const emit = defineEmits(['selection']);

const handleSelection = (category) => {
    emit('selection', category)
}

</script>

<template>

    <div
        class="flex flex-1 gap-4 max-w-[90vw] lg:max-w-[70vw] my-5 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-[#B0B0AE]/40 scrollbar-track-[#F7F5F0]">
        <div @click="handleSelection(null)"
            :class="[
                'rounded-xl px-6 py-3 shadow-lg cursor-pointer', 
                !selectedCategory ? 'bg-[#8B5E3C] text-white' : 'bg-[#B0B0AE]/40 hover:bg-[#B0B0AE]/60 text-[#2E2B26]'
                ]">
            <p class="font-semibold truncate text-center">Todas</p>
        </div>
        <div v-for="(category, index) in categories" :key="index" @click="handleSelection(category)"
            :class="[
                'flex flex-row items-center justify-center rounded-xl shadow-lg cursor-pointer', 
                selectedCategory && selectedCategory.id_categoria === category.id_categoria ? 'text-white' : 'bg-[#B0B0AE]/40 hover:bg-[#B0B0AE]/60 text-[#2E2B26]'
                ]"
            :style="{
                backgroundColor: selectedCategory && selectedCategory.id_categoria === category.id_categoria
                    ? categoryStyles[category.nombre].color
                    : '',
                color: selectedCategory && selectedCategory.id_categoria === category.id_categoria
                    ? 'white'
                    : '#2E2B26'
            }">
            <div class="h-full w-2 rounded-l-xl" :style="{
                backgroundColor: categoryStyles[category.nombre].color
            }"></div>
            <div class="flex flex-row justify-center items-center px-4 py-2">
                <component :is="categoryStyles[category.nombre].icon" class="w-6 h-6"></component>
                <p class=" font-semibold truncate text-center min-w-32">{{ category.nombre }}</p>
            </div>
        </div>
    </div>

</template>