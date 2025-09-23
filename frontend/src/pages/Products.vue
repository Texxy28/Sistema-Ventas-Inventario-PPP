<script setup>
import { storeToRefs } from 'pinia';
import { useProductStore } from '../store/productsStore';
import ProductTable from '../components/ProductTable.vue';
import { ref } from 'vue';

const productStore = useProductStore();
const { products, loading, error } = storeToRefs(productStore);
const { fetchProducts, updateProduct, addProduct } = productStore;

const editedProduct = ref(null);
const newProduct = ref({
    codigo: '',
    nombre: '',
    autor: '',
    descripcion: '',
    id_categoria: '',
    id_proveedor: '',
    precio: 0,
    stock: 0,
    punto_reorden: 5
});

const addModal = ref(false);

const openEditModal = (product) => {
    editedProduct.value = { ...product };
}

const saveEdit = async () => {
    await updateProduct(editedProduct.value.id_producto, editedProduct.value);
    editedProduct.value = null;
};

const handleAddModal = () => {
    addModal.value = true;
}

const handleAddProduct = async () => {
    await addProduct(newProduct.value);
    newProduct.value = {
        codigo: '',
        nombre: '',
        autor: null,
        descripcion: '',
        id_categoria: '',
        id_proveedor: '',
        precio: 0,
        stock: 0,
        punto_reorden: 5
    };
    addModal.value = false;
} 
</script>

<template>
    <div class="m-6">
        <div class="flex justify-around items-center">
            <div>
                <button @click="fetchProducts" class="bg-gray-400 p-2 rounded-3xl">Cargar Productos</button>
            </div>
            <div>
                <button @click="handleAddModal" class="bg-gray-400 p-2 rounded-3xl">Agregar Producto</button>
            </div>
        </div>
        <div class="flex justify-center">
            <div v-if="loading">Cargando...</div>
            <ProductTable v-if="products.length && !loading" :products="products" @edit="openEditModal" />
        </div>
        <div v-if="error">{{ error }}</div>
    </div>

    <div v-if="editedProduct" class="fixed inset-0 bg-black/50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg w-96">
            <h2 class="text-lg font-bold mb-4">Editar Producto</h2>
            <input v-model="editedProduct.nombre" placeholder="Nombre" class="border p-2 w-full mb-2" />
            <input v-model="editedProduct.autor" placeholder="Autor" class="border p-2 w-full mb-2" />
            <input v-model="editedProduct.descripcion" placeholder="Descripcion" class="border p-2 w-full mb-2" />
            <input v-model="editedProduct.id_categoria" placeholder="Categoria" class="border p-2 w-full mb-2" />
            <input v-model="editedProduct.id_proveedor" placeholder="Proveedor" class="border p-2 w-full mb-2" />
            <input v-model="editedProduct.precio" type="number" placeholder="Precio" class="border p-2 w-full mb-2" />
            <input v-model="editedProduct.stock" type="number" placeholder="Stock" class="border p-2 w-full mb-4" />
            <div class="flex justify-end gap-2">
                <button @click="editedProduct = null" class="bg-gray-400 px-4 py-2 rounded">Cancelar</button>
                <button @click="saveEdit" class="bg-gray-400 px-4 py-2 rounded">Guardar</button>
            </div>
        </div>
    </div>

    <div v-if="addModal" class="fixed inset-0 bg-black/50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg w-96">
            <h2 class="text-lg font-bold mb-4">Añadir Producto</h2>
            <input v-model="newProduct.codigo" placeholder="Código" class="border p-2 w-full mb-2" />
            <input v-model="newProduct.nombre" placeholder="Nombre" class="border p-2 w-full mb-2" />
            <input v-model="newProduct.autor" placeholder="Autor" class="border p-2 w-full mb-2" />
            <input v-model="newProduct.descripcion" placeholder="Descripcion" class="border p-2 w-full mb-2" />
            <input v-model="newProduct.id_categoria" type="number" placeholder="Categoria"
                class="border p-2 w-full mb-2" />
            <input v-model="newProduct.id_proveedor" type="number" placeholder="Proveedor"
                class="border p-2 w-full mb-2" />
            <input v-model="newProduct.precio" type="number" placeholder="Precio" class="border p-2 w-full mb-2" />
            <input v-model="newProduct.stock" type="number" placeholder="Stock" class="border p-2 w-full mb-4" />
            <input v-model="newProduct.punto_reorden" type="number" min="5" placeholder="Punto reorden"
                class="border p-2 w-full mb-4" />
            <div class="flex justify-end gap-2">
                <button @click="addModal = false" class="bg-gray-400 px-4 py-2 rounded">Cancelar</button>
                <button @click="handleAddProduct" class="bg-gray-400 px-4 py-2 rounded">Guardar</button>
            </div>
        </div>
    </div>

</template>