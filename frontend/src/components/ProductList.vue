<script setup>

import { useProductStore } from '../store/productsStore';
import ProductMiniDetails from './ProductMiniDetails.vue';

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

const handleSelection = (checked, product) => {
    let updated = [...props.selectedProducts];
    if (checked) updated.push({ ...product, cantidad: 1 });
    else updated = updated.filter((p) => p.id_producto !== product.id_producto);
    emit('selection', updated);
};

const handleDelete = async (id) => {
    await deleteProduct(id);
}

</script>

<template>

    <div class="overflow-x-auto w-full grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <ProductMiniDetails v-for="product in products" :key="product.id_producto" :product="product" :mode="mode"
            :selected="selectedProducts.some(p => p.id_producto === product.id_producto)" @edit="handleEdit"
            @delete="handleDelete" @select="(checked) => handleSelection(checked, product)" />    
    </div>

</template>