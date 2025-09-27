<script setup>
import { storeToRefs } from 'pinia';
import { useProductStore } from '../store/productsStore';
import ProductTable from '../components/ProductTable.vue';
import { onMounted, ref } from 'vue';
import { useCategoryStore } from '../store/categoriesStore';
import FormProducts from '../components/FormProducts.vue';

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const { products, loadingProducts, errorProducts } = storeToRefs(productStore);
const { categories, loadingCategories, errorCategories } = storeToRefs(categoryStore);
const { fetchProducts, updateProduct, addProduct } = productStore;
const { fetchCategories } = categoryStore;

const selectedProduct = ref(null);

const selectProduct = async (product) => {
    selectedProduct.value = { ...product };
}

const saveEdit = async (product) => {
    await updateProduct(product.id_producto, product);
    selectedProduct.value = null;
};

const handleAddProduct = async (product) => {
    await addProduct(product);
}

onMounted(async () => {
    await fetchProducts();
    await fetchCategories();
})

</script>

<template>
    <div class="m-6 grid grid-cols-4">
        <div class="flex justify-center items-center col-span-1">
            <FormProducts 
                :selectedProduct="selectedProduct" 
                :loadingCategories="loadingCategories"
                :errorCategories="errorCategories" 
                :categories="categories" 
                @addProduct="handleAddProduct"
                @editProduct="saveEdit" 
                @cancelEdit="selectedProduct = null" 
            />
        </div>
        <div class="flex justify-center col-span-3">
            <div v-if="loadingProducts">Cargando...</div>
            <ProductTable v-if="products.length && !loadingProducts" :products="products" @edit="selectProduct" />
        </div>
        <div v-if="errorProducts">{{ errorProducts }}</div>
    </div>


</template>