<script setup>

import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useProductStore } from '../store/productsStore';

defineProps({
    products: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['edit']);

const productStore = useProductStore();
const { deleteProduct } = productStore;

const handleEdit = (product) => {
    emit('edit', product);
}

const handleDelete = async (id) => {
    await deleteProduct(id);
}

</script>

<template>

    <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border text-left mt-6">
            <thead>
                <tr>
                    <th class="border px-4 py-2">Código</th>
                    <th class="border px-4 py-2">Nombre</th>
                    <th class="border px-4 py-2">Autor (Solo libros)</th>
                    <th class="border px-4 py-2">Descipción</th>    
                    <th class="border px-4 py-2">Categoria</th>    
                    <th class="border px-4 py-2">Proveedor</th>    
                    <th class="border px-4 py-2">Precio</th>
                    <th class="border px-4 py-2">Stock</th>
                    <th class="border px-4 py-2">Editar</th>
                    <th class="border px-4 py-2">Eliminar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id_producto">
                    <td class="border px-4 py-2">{{ product.codigo }}</td>
                    <td class="border px-4 py-2">{{ product.nombre }}</td>
                    <td class="border px-4 py-2">{{ product.autor || "Sin autor" }}</td>
                    <td class="border px-4 py-2">{{ product.descripcion }}</td>
                    <td class="border px-4 py-2">{{ product.id_categoria }}</td>
                    <td class="border px-4 py-2">{{ product.id_proveedor }}</td>
                    <td class="border px-4 py-2">{{ product.precio }}</td>
                    <td class="border px-4 py-2">{{ product.stock }}</td>
                    <td class="border px-4 py-2">
                        <div class="flex justify-center items-center">
                            <PencilSquareIcon @click="handleEdit(product)" class="h-5 w-5 cursor-pointer"/>
                        </div>
                    </td>
                    <td class="border px-4 py-2">
                        <div class="flex justify-center items-center">
                            <TrashIcon @click="handleDelete(product.id_producto)" class="h-5 w-5 cursor-pointer"/>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>