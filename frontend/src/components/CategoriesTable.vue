<script setup>

import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useCategoryStore } from '../store/categoriesStore';

defineProps({
    categories: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['edit']);

const categoryStore = useCategoryStore();
const { deleteCategory } = categoryStore;

const handleEdit = (category) => {
    emit('edit', category);
}

const handleDelete = async (id) => {
    await deleteCategory(id);
}

</script>

<template>

    <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border text-left mt-6">
            <thead>
                <tr>
                    <th class="border px-4 py-2">Nombre</th>
                    <th class="border px-4 py-2">Descripción</th>
                    <th class="border px-4 py-2">Productos en esta categoría</th>
                    <th class="border px-4 py-2">Editar</th>
                    <th class="border px-4 py-2">Eliminar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="category in categories" :key="categories.id_categoria">
                    <td class="border px-4 py-2">{{ category.nombre }}</td>
                    <td class="border px-4 py-2">{{ category.descripcion }}</td>
                    <td class="border px-4 py-2">{{ category.total_productos }}</td>
                    <td class="border px-4 py-2">
                        <div class="flex justify-center items-center">
                            <PencilSquareIcon @click="handleEdit(category)" class="h-5 w-5 cursor-pointer" />
                        </div>
                    </td>
                    <td class="border px-4 py-2">
                        <div class="flex justify-center items-center">
                            <TrashIcon @click="handleDelete(category.id_categoria)" class="h-5 w-5 cursor-pointer" />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>


</template>