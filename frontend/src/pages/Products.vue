<script setup>
import { storeToRefs } from 'pinia';
import { useProductStore } from '../store/productsStore';
import ProductTable from '../components/ProductTable.vue';
import { computed, onMounted, ref } from 'vue';
import { useCategoryStore } from '../store/categoriesStore';
import FormProducts from '../components/FormProducts.vue';
import SearchBox from '../components/SearchBox.vue';

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const { products, loadingProducts, errorProducts } = storeToRefs(productStore);
const { categories, loadingCategories, errorCategories } = storeToRefs(categoryStore);
const { fetchProducts, updateProduct, addProduct } = productStore;
const { fetchCategories } = categoryStore;

const selectedProduct = ref(null);
const searchQuery = ref('');

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

const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value;
    return products.value.filter(p =>
        p.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

function handleSearch(query) {
  searchQuery.value = query;
}

onMounted(async () => {
    await fetchProducts();
    await fetchCategories();
})

</script>

<template>
    <div class="p-6 grid grid-cols-4">
        <div class="flex justify-center col-span-1">
            <FormProducts :selectedProduct="selectedProduct" :loadingCategories="loadingCategories"
                :errorCategories="errorCategories" :categories="categories" @addProduct="handleAddProduct"
                @editProduct="saveEdit" @cancelEdit="selectedProduct = null" />
        </div>
        <div class="col-span-3">
            <div class="flex flex-row">
                <SearchBox class="self-end" placeholder="Buscar productos..." @search="handleSearch"/>
            </div>
            <div class="flex justify-center">
                <div v-if="loadingProducts">Cargando...</div>
                <ProductTable v-if="products.length && !loadingProducts" :products="filteredProducts" @edit="selectProduct"
                    mode="admin" />
                <div v-if="errorProducts">{{ errorProducts }}</div>
            </div>
        </div>
    </div>
</template>