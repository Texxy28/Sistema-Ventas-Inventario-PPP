<script setup>

import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useProductStore } from '../store/productsStore';

const props = defineProps({
    products: {
        type: Array,
        required: true
    },
    mode: {
        type: String,
        default: 'admin'
    },
    selectedProducts: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['edit', 'selection']);

const productStore = useProductStore();
const { deleteProduct } = productStore;

const handleEdit = (product) => {
    emit('edit', product);
}

const handleSelection = (event, product) => {
    const finalProduct = {...product, cantidad: 1};
    let updatedSelection = [...props.selectedProducts];

    if (event.target.checked) {
        if (!updatedSelection.includes(finalProduct)) {
            updatedSelection.push(finalProduct);
        }
    } else {
        updatedSelection = updatedSelection.filter(p => p.id_producto !== product.id_producto);
    }
    emit('selection', updatedSelection);
}

const handleDelete = async (id) => {
    await deleteProduct(id);
}

</script>

<template>

    <div class="overflow-x-auto w-full">
        <table class="min-w-full border-collapse border text-left mt-6 text-xs">
            <thead>
                <tr>
                    <th class="border px-4 py-2">Código</th>
                    <th class="border px-4 py-2">Nombre</th>
                    <th class="border px-4 py-2">Autor (Solo libros)</th>
                    <th class="border px-4 py-2">Descripción</th>
                    <th class="border px-4 py-2">Categoria</th>
                    <th class="border px-4 py-2">Proveedor</th>
                    <th class="border px-4 py-2">Precio</th>
                    <th class="border px-4 py-2">Stock</th>
                    <th v-if="mode === 'admin'" class="border px-4 py-2">Editar</th>
                    <th v-if="mode === 'admin'" class="border px-4 py-2">Eliminar</th>
                    <th v-else class="border px-4 py-2">Seleccionar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id_producto">
                    <td class="border px-4 py-2">{{ product.codigo }}</td>
                    <td class="border px-4 py-2">{{ product.nombre }}</td>
                    <td class="border px-4 py-2">{{ product.autor || "Sin autor" }}</td>
                    <td class="border px-4 py-2">{{ product.descripcion }}</td>
                    <td class="border px-4 py-2">{{ product.categoria }}</td>
                    <td class="border px-4 py-2">{{ product.proveedor }}</td>
                    <td class="border px-4 py-2">{{ product.precio }}</td>
                    <td class="border px-4 py-2">{{ product.stock }}</td>
                    <td v-if="mode === 'admin'" class="border px-4 py-2">
                        <div class="flex justify-center items-center">
                            <PencilSquareIcon @click="handleEdit(product)" class="h-5 w-5 cursor-pointer" />
                        </div>
                    </td>
                    <td v-if="mode === 'admin'" class="border px-4 py-2">
                        <div class="flex justify-center items-center">
                            <TrashIcon @click="handleDelete(product.id_producto)" class="h-5 w-5 cursor-pointer" />
                        </div>
                    </td>
                    <td v-else class="border px-4 py-2">
                        <div class="flex justify-center items-center">
                            <input type="checkbox" @change="handleSelection($event, product)" :checked="selectedProducts.some(p => p.id_producto === product.id_producto)"/>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>